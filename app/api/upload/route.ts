import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // 1. Authorize user using JWT
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('admin_session');

    if (!sessionCookie) {
      return NextResponse.json({ success: false, message: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const payload = await verifyToken(sessionCookie.value);
    if (!payload || !payload.authenticated) {
      return NextResponse.json({ success: false, message: 'جلسة عمل غير صالحة' }, { status: 401 });
    }

    // 2. Parse uploaded file
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'لم يتم العثور على ملف' }, { status: 400 });
    }

    // Convert file to buffer for Supabase Storage
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${fileExtension}`;

    // 3. Upload to Supabase Storage bucket named 'gallery'
    // Note: We use upsert = true and make sure RLS or bucket is public
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('gallery')
      .upload(fileName, buffer, {
        contentType: file.type,
        duplex: 'half',
      });

    if (uploadError) {
      console.error('Supabase Storage Upload Error:', uploadError);
      return NextResponse.json(
        {
          success: false,
          message: 'فشل رفع الصورة إلى التخزين. تأكد من إنشاء bucket باسم gallery في Supabase وجعلها عامة (Public)',
        },
        { status: 500 }
      );
    }

    // 4. Get Public URL
    const { data: { publicUrl } } = supabaseAdmin.storage
      .from('gallery')
      .getPublicUrl(fileName);

    // 5. Save image URL to Supabase Database
    const { data: dbItem, error: dbError } = await supabaseAdmin
      .from('gallery')
      .insert([{ image_url: publicUrl }])
      .select()
      .single();

    if (dbError) {
      console.error('Database save error:', dbError);
      return NextResponse.json(
        { success: false, message: 'فشل حفظ رابط الصورة في قاعدة البيانات' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: dbItem,
      message: 'تم رفع الصورة بنجاح',
    });
  } catch (error: any) {
    console.error('Upload API Error:', error);
    return NextResponse.json(
      { success: false, message: 'حصل خطأ ما، حاول مرة أخرى.' },
      { status: 500 }
    );
  }
}
