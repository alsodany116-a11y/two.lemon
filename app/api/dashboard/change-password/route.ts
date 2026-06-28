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

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ success: false, message: 'يرجى ملء جميع الحقول المطلوبة' }, { status: 400 });
    }

    // 2. Fetch current password from DB settings
    const { data: passwordSetting, error: fetchError } = await supabaseAdmin
      .from('settings')
      .select('value')
      .eq('key', 'admin_password')
      .single();

    if (fetchError || !passwordSetting) {
      console.error('Fetch password setting error:', fetchError);
      return NextResponse.json({ success: false, message: 'فشل جلب كلمة المرور الحالية' }, { status: 500 });
    }

    if (passwordSetting.value !== currentPassword.trim()) {
      return NextResponse.json({ success: false, message: 'كلمة المرور الحالية غير صحيحة' }, { status: 400 });
    }

    // 3. Update the password
    const { error: updateError } = await supabaseAdmin
      .from('settings')
      .update({ value: newPassword.trim() })
      .eq('key', 'admin_password');

    if (updateError) {
      console.error('Update password error:', updateError);
      return NextResponse.json({ success: false, message: 'فشل تحديث كلمة المرور في قاعدة البيانات' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'تم تغيير كلمة المرور بنجاح',
    });
  } catch (error: any) {
    console.error('Password change error:', error);
    return NextResponse.json(
      { success: false, message: 'حصل خطأ ما، حاول مرة أخرى.' },
      { status: 500 }
    );
  }
}
