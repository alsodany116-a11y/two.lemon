import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل الخروج بنجاح',
    });

    // Clear session cookie
    response.cookies.delete('admin_session');

    return response;
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'حصل خطأ ما، حاول مرة أخرى.' },
      { status: 500 }
    );
  }
}
