import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // 1. Authorize Admin
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('admin_session');

    if (!sessionCookie) {
      return NextResponse.json({ success: false, message: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const payload = await verifyToken(sessionCookie.value);
    if (!payload || !payload.authenticated) {
      return NextResponse.json({ success: false, message: 'جلسة عمل غير صالحة' }, { status: 401 });
    }

    const { settings } = await request.json();

    if (!settings || typeof settings !== 'object') {
      return NextResponse.json({ success: false, message: 'بيانات الإعدادات غير صالحة' }, { status: 400 });
    }

    // Convert settings object to array of { key, value }
    const upsertData = Object.entries(settings).map(([key, value]) => ({
      key,
      value: String(value).trim(),
    }));

    if (upsertData.length === 0) {
      return NextResponse.json({ success: false, message: 'لا توجد إعدادات لتحديثها' }, { status: 400 });
    }

    // 2. Upsert settings in database
    const { error } = await supabaseAdmin
      .from('settings')
      .upsert(upsertData, { onConflict: 'key' });

    if (error) {
      console.error('Settings upsert error:', error);
      return NextResponse.json({ success: false, message: 'فشل حفظ الإعدادات في قاعدة البيانات' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'تم حفظ الإعدادات بنجاح',
    });
  } catch (error: any) {
    console.error('Settings API Error:', error);
    return NextResponse.json(
      { success: false, message: 'حصل خطأ ما، حاول مرة أخرى.' },
      { status: 500 }
    );
  }
}
