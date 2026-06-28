import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendCapiEvent } from '@/lib/pixel';

export async function POST(request: Request) {
  try {
    const { name, mobile, whatsapp, eventId, sourceUrl } = await request.json();

    // Basic validation
    if (!name || !mobile) {
      return NextResponse.json(
        { success: false, message: 'يرجى ملء جميع الحقول المطلوبة (الاسم ورقم الهاتف)' },
        { status: 400 }
      );
    }

    // Generate unique thank you token (UUID)
    const thankYouToken = crypto.randomUUID();

    // 1. Insert order into Supabase
    const { data: order, error: insertError } = await supabaseAdmin
      .from('orders')
      .insert([
        {
          name,
          mobile,
          whatsapp: whatsapp || null,
          thank_you_token: thankYouToken,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return NextResponse.json(
        { success: false, message: 'حدث خطأ أثناء حفظ طلبك، يرجى المحاولة مرة أخرى.' },
        { status: 500 }
      );
    }

    // 2. Fetch Facebook Pixel settings and trigger CAPI in the background (Non-blocking)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || '127.0.0.1';
    const userAgent = request.headers.get('user-agent') || 'Unknown';
    const referer = request.headers.get('referer') || '';

    (async () => {
      try {
        const { data: settingsData, error: settingsError } = await supabaseAdmin
          .from('settings')
          .select('key, value')
          .in('key', ['pixel_id', 'pixel_access_token', 'pixel_test_code']);

        if (!settingsError && settingsData) {
          const pixelId = settingsData.find((s) => s.key === 'pixel_id')?.value || '';
          const accessToken = settingsData.find((s) => s.key === 'pixel_access_token')?.value || '';
          const testCode = settingsData.find((s) => s.key === 'pixel_test_code')?.value || '';

          if (pixelId && accessToken) {
            await sendCapiEvent({
              pixelId,
              accessToken,
              testCode: testCode || undefined,
              eventName: 'Lead',
              eventId: eventId,
              url: sourceUrl || referer || '',
              ip: ip.split(',')[0].trim(),
              userAgent,
            });
          }
        }
      } catch (err) {
        console.error('Background CAPI Lead event error:', err);
      }
    })();

    return NextResponse.json({
      success: true,
      thankYouToken,
      orderId: order.id,
      message: 'تم تسجيل طلبك بنجاح',
    });
  } catch (error: any) {
    console.error('Order API error:', error);
    return NextResponse.json(
      { success: false, message: 'حصل خطأ ما، حاول مرة أخرى.' },
      { status: 500 }
    );
  }
}
