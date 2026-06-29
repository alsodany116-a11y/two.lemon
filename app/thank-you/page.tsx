import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { supabaseAdmin } from '@/lib/supabase';
import { sendCapiEvent } from '@/lib/pixel';
import ConfettiTrigger from '@/components/confetti-trigger';
import { Heart, Calendar, CreditCard, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';

interface ThankYouProps {
  searchParams: {
    token?: string;
  };
}

export const revalidate = 0; // Disable cache to fetch fresh order details

export default async function ThankYouPage({ searchParams }: ThankYouProps) {
  const token = searchParams.token;

  // 1. If token is missing, redirect to home page immediately
  if (!token) {
    redirect('/');
  }

  // 2. Validate token and fetch thank you page settings in parallel
  let order: any = null;
  let thankYouMessage = 'سعداء جداً بكوننا جزءاً من توثيق ذكرياتكما الرومانسية! سيقوم فريقنا بالتواصل معك عبر الواتساب خلال 24 ساعة لبدء تصميم هديتك المميّزة. ❤️';
  let thankYouStep1 = 'سنقوم بالتواصل معك عبر الواتساب على الرقم المرفق بالطلب خلال 24 ساعة كحد أقصى.';
  let thankYouStep2 = 'سنسلمك رابط صفحتكما الخاصة والرقم السري الخاص بها، لتفاجئ بها شريك حياتك بهدية لا تُنسى!';
  let websitePrice = '80';
  let pixelId = '';
  let accessToken = '';
  let testCode = '';

  try {
    const [orderRes, settingsRes] = await Promise.all([
      supabaseAdmin
        .from('orders')
        .select('*')
        .eq('thank_you_token', token)
        .single(),
      supabaseAdmin
        .from('settings')
        .select('key, value')
        .in('key', [
          'thank_you_message',
          'thank_you_step1',
          'thank_you_step2',
          'website_price',
          'pixel_id',
          'pixel_access_token',
          'pixel_test_code'
        ])
    ]);

    if (orderRes.error || !orderRes.data) {
      console.error('Invalid token or order not found on thank you page:', orderRes.error);
      redirect('/');
    }
    
    order = orderRes.data;

    if (settingsRes.data) {
      const dbMsg = settingsRes.data.find((s) => s.key === 'thank_you_message')?.value;
      if (dbMsg) thankYouMessage = dbMsg;

      const dbStep1 = settingsRes.data.find((s) => s.key === 'thank_you_step1')?.value;
      if (dbStep1) thankYouStep1 = dbStep1;

      const dbStep2 = settingsRes.data.find((s) => s.key === 'thank_you_step2')?.value;
      if (dbStep2) thankYouStep2 = dbStep2;

      const dbPrice = settingsRes.data.find((s) => s.key === 'website_price')?.value;
      if (dbPrice) websitePrice = dbPrice;

      pixelId = settingsRes.data.find((s) => s.key === 'pixel_id')?.value || '';
      accessToken = settingsRes.data.find((s) => s.key === 'pixel_access_token')?.value || '';
      testCode = settingsRes.data.find((s) => s.key === 'pixel_test_code')?.value || '';
    }
  } catch (err) {
    console.error('Error fetching data for thank-you page:', err);
    redirect('/');
  }

  const eventId = `purchase-${order.id}`;

  // 4. Send Server-Side Conversions API (CAPI) Purchase Event
  if (pixelId && accessToken) {
    const headersList = headers();
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || '127.0.0.1';
    const userAgent = headersList.get('user-agent') || 'Unknown';
    const host = headersList.get('host') || 'love-messages.com';
    const sourceUrl = `https://${host}/thank-you?token=${token}`;

    sendCapiEvent({
      pixelId,
      accessToken,
      testCode: testCode || undefined,
      eventName: 'Purchase',
      eventId: eventId,
      url: sourceUrl,
      ip: ip.split(',')[0].trim(),
      userAgent,
      customData: {
        value: Number(websitePrice) || 80,
        currency: 'EGP',
      },
    }).catch((err) => {
      console.error('CAPI Purchase event failed to send:', err);
    });
  }

  return (
    <div className="relative min-h-screen text-white bg-romantic-gradient selection:bg-romantic-rosegold py-12 px-4 flex flex-col justify-center items-center">
      {/* Confetti Trigger */}
      <ConfettiTrigger />

      {/* Browser Pixel Purchase Script */}
      {pixelId && (
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (window.fbq) {
                console.log('Firing browser Pixel Purchase event with ID: ${eventId}');
                fbq('track', 'Purchase', {
                  value: ${Number(websitePrice) || 80},
                  currency: 'EGP'
                }, { event_id: '${eventId}' });
              }
            `,
          }}
        />
      )}

      {/* Main card */}
      <div className="w-full max-w-2xl romantic-glass p-8 md:p-12 rounded-3xl border border-romantic-rosegold/30 shadow-2xl relative overflow-hidden text-center space-y-8">
        
        {/* Floating background glows */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-romantic-rosegold/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-romantic-burgundy/20 rounded-full blur-3xl"></div>

        {/* Success Icon */}
        <div className="w-20 h-20 rounded-full bg-romantic-burgundy border-2 border-romantic-rosegold flex items-center justify-center mx-auto shadow-lg relative">
          <CheckCircle2 className="w-10 h-10 text-romantic-pink" />
        </div>

        {/* Header Texts */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-romantic-pink to-white">
            شكراً لطلبك، {order.name}! ❤️
          </h1>
          <p className="text-sm md:text-base text-romantic-rosegold font-bold uppercase tracking-wide">
            تم تسجيل طلبك بنجاح وجاري العمل عليه
          </p>
        </div>

        {/* Romantic Message */}
        <div className="bg-[#110508]/60 border border-romantic-border/40 p-6 rounded-2xl">
          <p className="text-base md:text-lg text-romantic-pink/90 leading-relaxed whitespace-pre-line">
            {thankYouMessage}
          </p>
        </div>

        {/* Order Details summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-right">
          <div className="bg-romantic-card/60 border border-romantic-border/30 p-4 rounded-xl flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-romantic-rosegold shrink-0" />
            <div>
              <span className="block text-xs text-romantic-pink/50">المبلغ المدفوع</span>
              <span className="font-bold text-white text-base">{websitePrice} جنيه</span>
            </div>
          </div>
          <div className="bg-romantic-card/60 border border-romantic-border/30 p-4 rounded-xl flex items-center gap-3">
            <Calendar className="w-5 h-5 text-romantic-rosegold shrink-0" />
            <div>
              <span className="block text-xs text-romantic-pink/50">تاريخ الطلب</span>
              <span className="font-bold text-white text-sm">
                {new Date(order.created_at).toLocaleDateString('ar-EG', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>
          <div className="bg-romantic-card/60 border border-romantic-border/30 p-4 rounded-xl flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-romantic-rosegold shrink-0" />
            <div>
              <span className="block text-xs text-romantic-pink/50">رقم الهاتف</span>
              <span className="font-bold text-white text-sm ltr">{order.mobile}</span>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="text-right space-y-4">
          <h2 className="text-lg font-bold text-white border-b border-romantic-border pb-2">
            الخطوات القادمة ⏳:
          </h2>
          <div className="space-y-3">
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-romantic-burgundy border border-romantic-rosegold/50 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">
                ١
              </div>
              <p className="text-sm text-romantic-pink/90">
                {thankYouStep1}
              </p>
            </div>
            <div className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-romantic-burgundy border border-romantic-rosegold/50 flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5">
                ٢
              </div>
              <p className="text-sm text-romantic-pink/90">
                {thankYouStep2}
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home Action */}
        <div className="pt-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 bg-romantic-burgundy hover:bg-romantic-lightburgundy text-white font-bold py-3 px-6 rounded-xl border border-romantic-rosegold/40 hover:border-romantic-rosegold transition-all text-sm"
          >
            <span>العودة للصفحة الرئيسية</span>
            <ArrowRight className="w-4 h-4 text-white rotate-180" />
          </a>
        </div>
      </div>
    </div>
  );
}
