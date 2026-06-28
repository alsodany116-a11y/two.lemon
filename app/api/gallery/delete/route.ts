import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // 1. Authorize admin
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('admin_session');

    if (!sessionCookie) {
      return NextResponse.json({ success: false, message: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const payload = await verifyToken(sessionCookie.value);
    if (!payload || !payload.authenticated) {
      return NextResponse.json({ success: false, message: 'جلسة عمل غير صالحة' }, { status: 401 });
    }

    const { id, imageUrl } = await request.json();

    if (!id || !imageUrl) {
      return NextResponse.json({ success: false, message: 'بيانات غير مكتملة' }, { status: 400 });
    }

    // 2. Extract file name from Supabase public URL
    // Public URL format: https://.../storage/v1/object/public/gallery/FILENAME
    const urlParts = imageUrl.split('/');
    const fileName = urlParts[urlParts.length - 1];

    if (!fileName) {
      return NextResponse.json({ success: false, message: 'فشل استخراج اسم الملف من الرابط' }, { status: 400 });
    }

    // 3. Remove image from Supabase Storage
    const { error: storageError } = await supabaseAdmin.storage
      .from('gallery')
      .remove([fileName]);

    if (storageError) {
      console.error('Supabase Storage Deletion Error:', storageError);
      // We continue to database deletion in case file was already removed from storage
    }

    // 4. Delete image record from Supabase Database
    const { error: dbError } = await supabaseAdmin
      .from('gallery')
      .delete()
      .eq('id', id);

    if (dbError) {
      console.error('Database deletion error:', dbError);
      return NextResponse.json({ success: false, message: 'فشل حذف السجل من قاعدة البيانات' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف الصورة بنجاح من التخزين وقاعدة البيانات',
    });
  } catch (error: any) {
    console.error('Delete Gallery Image Error:', error);
    return NextResponse.json(
      { success: false, message: 'حصل خطأ ما، حاول مرة أخرى.' },
      { status: 500 }
    );
  }
}
