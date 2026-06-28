import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyToken } from '@/lib/auth';

// 1. Helper to authorize admin
async function authorizeAdmin() {
  const cookieStore = cookies();
  const sessionCookie = cookieStore.get('admin_session');

  if (!sessionCookie) return null;

  const payload = await verifyToken(sessionCookie.value);
  if (!payload || !payload.authenticated) return null;

  return payload;
}

// CREATE Testimonial
export async function POST(request: Request) {
  try {
    const auth = await authorizeAdmin();
    if (!auth) {
      return NextResponse.json({ success: false, message: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const { name, stars, comment } = await request.json();

    if (!name || !comment || stars === undefined) {
      return NextResponse.json({ success: false, message: 'بيانات غير كاملة' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .insert([{ name: name.trim(), stars: Number(stars), comment: comment.trim() }])
      .select()
      .single();

    if (error) {
      console.error('Create testimonial error:', error);
      return NextResponse.json({ success: false, message: 'فشل إضافة الرأي في قاعدة البيانات' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data, message: 'تمت إضافة رأي العميل بنجاح' });
  } catch (error: any) {
    console.error('Testimonial POST error:', error);
    return NextResponse.json({ success: false, message: 'حصل خطأ ما، حاول مرة أخرى.' }, { status: 500 });
  }
}

// UPDATE Testimonial
export async function PUT(request: Request) {
  try {
    const auth = await authorizeAdmin();
    if (!auth) {
      return NextResponse.json({ success: false, message: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const { id, name, stars, comment } = await request.json();

    if (!id || !name || !comment || stars === undefined) {
      return NextResponse.json({ success: false, message: 'بيانات غير كاملة' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('testimonials')
      .update({ name: name.trim(), stars: Number(stars), comment: comment.trim() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update testimonial error:', error);
      return NextResponse.json({ success: false, message: 'فشل تحديث رأي العميل' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data, message: 'تم تحديث رأي العميل بنجاح' });
  } catch (error: any) {
    console.error('Testimonial PUT error:', error);
    return NextResponse.json({ success: false, message: 'حصل خطأ ما، حاول مرة أخرى.' }, { status: 500 });
  }
}

// DELETE Testimonial
export async function DELETE(request: Request) {
  try {
    const auth = await authorizeAdmin();
    if (!auth) {
      return NextResponse.json({ success: false, message: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'معرف الرأي مطلوب' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('testimonials')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete testimonial error:', error);
      return NextResponse.json({ success: false, message: 'فشل حذف رأي العميل' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'تم حذف رأي العميل بنجاح' });
  } catch (error: any) {
    console.error('Testimonial DELETE error:', error);
    return NextResponse.json({ success: false, message: 'حصل خطأ ما، حاول مرة أخرى.' }, { status: 500 });
  }
}
