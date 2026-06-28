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

// CREATE FAQ
export async function POST(request: Request) {
  try {
    const auth = await authorizeAdmin();
    if (!auth) {
      return NextResponse.json({ success: false, message: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const { question, answer, sort_order } = await request.json();

    if (!question || !answer) {
      return NextResponse.json({ success: false, message: 'بيانات غير كاملة' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('faqs')
      .insert([
        {
          question: question.trim(),
          answer: answer.trim(),
          sort_order: sort_order !== undefined ? Number(sort_order) : 0,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Create FAQ error:', error);
      return NextResponse.json({ success: false, message: 'فشل إضافة السؤال في قاعدة البيانات' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data, message: 'تمت إضافة السؤال بنجاح' });
  } catch (error: any) {
    console.error('FAQ POST error:', error);
    return NextResponse.json({ success: false, message: 'حصل خطأ ما، حاول مرة أخرى.' }, { status: 500 });
  }
}

// UPDATE FAQ
export async function PUT(request: Request) {
  try {
    const auth = await authorizeAdmin();
    if (!auth) {
      return NextResponse.json({ success: false, message: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const { id, question, answer, sort_order } = await request.json();

    if (!id || !question || !answer) {
      return NextResponse.json({ success: false, message: 'بيانات غير كاملة' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from('faqs')
      .update({
        question: question.trim(),
        answer: answer.trim(),
        sort_order: sort_order !== undefined ? Number(sort_order) : 0,
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Update FAQ error:', error);
      return NextResponse.json({ success: false, message: 'فشل تحديث السؤال الشائع' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data, message: 'تم تحديث السؤال الشائع بنجاح' });
  } catch (error: any) {
    console.error('FAQ PUT error:', error);
    return NextResponse.json({ success: false, message: 'حصل خطأ ما، حاول مرة أخرى.' }, { status: 500 });
  }
}

// DELETE FAQ
export async function DELETE(request: Request) {
  try {
    const auth = await authorizeAdmin();
    if (!auth) {
      return NextResponse.json({ success: false, message: 'غير مصرح لك بالوصول' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'معرف السؤال مطلوب' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('faqs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Delete FAQ error:', error);
      return NextResponse.json({ success: false, message: 'فشل حذف السؤال الشائع' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'تم حذف السؤال الشائع بنجاح' });
  } catch (error: any) {
    console.error('FAQ DELETE error:', error);
    return NextResponse.json({ success: false, message: 'حصل خطأ ما، حاول مرة أخرى.' }, { status: 500 });
  }
}
