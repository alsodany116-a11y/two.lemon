import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { success: false, message: 'يرجى إدخال كلمة المرور' },
        { status: 400 }
      );
    }

    // Retrieve configured password from Supabase settings
    const { data: setting, error } = await supabaseAdmin
      .from('settings')
      .select('value')
      .eq('key', 'admin_password')
      .single();

    if (error || !setting) {
      console.error('Error fetching admin password:', error);
      return NextResponse.json(
        { success: false, message: 'حدث خطأ في النظام، يرجى المحاولة لاحقاً' },
        { status: 500 }
      );
    }

    if (setting.value !== password.trim()) {
      return NextResponse.json(
        { success: false, message: 'كلمة المرور غير صحيحة' },
        { status: 401 }
      );
    }

    // Create session token
    const token = await signToken({
      authenticated: true,
      username: 'admin',
    });

    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الدخول بنجاح',
    });

    // Set JWT in HttpOnly cookie
    response.cookies.set('admin_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('Login API error:', error);
    return NextResponse.json(
      { success: false, message: 'حصل خطأ ما، حاول مرة أخرى.' },
      { status: 500 }
    );
  }
}
