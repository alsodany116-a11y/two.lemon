import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth';

async function authorizeAdmin() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('admin_session');

  if (!sessionCookie) return null;

  const payload = await verifyToken(sessionCookie.value);
  if (!payload || !payload.authenticated) return null;

  return payload;
}

// DELETE Order
export async function DELETE(request: Request) {
  try {
    const auth = await authorizeAdmin();
    if (!auth) {
      return NextResponse.json({ success: false, message: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'معرف الأوردر مطلوب' }, { status: 400 });
    }

    // Delete the order from Supabase orders table
    const { error } = await supabaseAdmin
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete order database error:', error);
      return NextResponse.json({ success: false, message: 'فشل حذف الأوردر من قاعدة البيانات' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف الأوردر بنجاح',
    });
  } catch (error: any) {
    console.error('Delete Order API error:', error);
    return NextResponse.json(
      { success: false, message: 'حصل خطأ ما، حاول مرة أخرى.' },
      { status: 500 }
    );
  }
}
