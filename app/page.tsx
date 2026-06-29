import { supabaseAdmin } from '@/lib/supabase';
import Countdown from '@/components/countdown';
import GalleryGrid from '@/components/gallery-grid';
import Testimonials from '@/components/testimonials';
import FaqAccordion from '@/components/faq-accordion';
import { Shield, Image as ImageIcon, Gift, Clock, Sparkles, Heart, Compass } from 'lucide-react';

export const revalidate = 0; // Disable caching so dashboard updates display instantly

export default async function LandingPage() {
  // 1. Fetch data from Supabase
  let settingsMap: Record<string, string> = {};
  let testimonials: any[] = [];
  let faqs: any[] = [];
  let galleryImages: any[] = [];

  try {
    const [settingsRes, testimonialsRes, faqsRes, galleryRes] = await Promise.all([
      supabaseAdmin.from('settings').select('*'),
      supabaseAdmin.from('testimonials').select('*').order('created_at', { ascending: false }),
      supabaseAdmin.from('faqs').select('*').order('sort_order', { ascending: true }),
      supabaseAdmin.from('gallery').select('*').order('created_at', { ascending: false }),
    ]);

    if (settingsRes.data) {
      settingsMap = settingsRes.data.reduce((acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      }, {} as Record<string, string>);
    }

    testimonials = testimonialsRes.data || [];
    faqs = faqsRes.data || [];
    galleryImages = galleryRes.data || [];
  } catch (error) {
    console.error('Error fetching landing page data:', error);
  }

  // Fallbacks for settings
  const countdownEnd = settingsMap['countdown_end'] || '2026-07-15T00:00:00.000Z';
  const websitePrice = settingsMap['website_price'] || '80';
  const galleryTextAbove = settingsMap['gallery_text_above'] || 'لقطات حية لبعض الذكريات الرائعة المطبوعة والمحفوظة لعملائنا 📸';
  const galleryTextBelow = settingsMap['gallery_text_below'] || 'كل صورة تحكي قصة حب، وذكريات تعيش للأبد في قلوب من تحب.';
  const websiteDetails = settingsMap['website_details'] || 'موقع رسائل الحب هو طريقتك المبتكرة للتعبير عن مشاعرك. نحن نقوم بتحويل صورك وكلماتك الرومانسية إلى صفحة ويب تفاعلية خاصة بك وبمن تحب، ومحمية بكلمة مرور لا يعرفها أحد غيركما. تبقى هذه الصفحة محفوظة للأبد على الإنترنت لتستعيدا ذكرياتكما معاً في أي وقت ومن أي مكان بالعالم.';

  return (
    <div className="relative min-h-screen text-white overflow-hidden bg-romantic-gradient selection:bg-romantic-rosegold selection:text-white pb-16">
      
      {/* Background Micro-sparkles */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,0,16,0.15)_0%,transparent_70%)] pointer-events-none"></div>

      {/* 1. Navbar */}
      <header className="sticky top-0 z-40 w-full transition-all duration-300">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <nav className="romantic-glass px-6 py-3 rounded-full flex items-center justify-between shadow-lg">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <span className="text-xl md:text-2xl font-black tracking-wider text-white select-none">
                رسائل الحب <span className="inline-block animate-pulse">💌</span>
              </span>
            </div>
            
            {/* CTA Button */}
            <a
              href="/order"
              className="bg-romantic-burgundy hover:bg-romantic-lightburgundy text-white font-bold py-2.5 px-5 rounded-full text-xs md:text-sm border border-romantic-rosegold/30 hover:border-romantic-rosegold/60 shadow-md transition-all active:scale-95"
            >
              احجز الآن
            </a>
          </nav>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative px-4 pt-8 md:pt-16 pb-12 max-w-5xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 bg-romantic-burgundy/60 border border-romantic-rosegold/40 px-4 py-1.5 rounded-full text-xs md:text-sm font-semibold text-romantic-pink mb-6 shadow-md animate-bounce">
          <Sparkles className="w-4 h-4 text-romantic-rosegold" />
          <span>أول 50 طلب بالسعر المخفض</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-tight mb-6 max-w-4xl mx-auto">
          خلّدوا لحظاتكم السعيدة في{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-romantic-pink via-romantic-rosegold to-romantic-pink font-extrabold">
            صفحة ويب رومانسية خاصة
          </span>{' '}
          بكما للأبد 💖
        </h1>

        {/* Subheadline */}
        <p className="text-sm md:text-lg text-romantic-pink/80 leading-relaxed max-w-3xl mx-auto mb-8">
          الهدايا العادية تنتهي وتُنسى.. فاجئ شريك حياتك بهدية مبتكرة لا تخطر على البال: صفحة ويب تفاعلية كاملة خاصة بكما لحفظ رسائلكما، صوركما، وأغنيتكم المفضلة، محمية بكلمة مرور لا يعرفها أحد غيركما.
        </p>

        {/* Price Tag Box */}
        <div className="romantic-glass rounded-2xl p-6 max-w-md mx-auto mb-10 border border-romantic-rosegold/20 shadow-xl relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-romantic-rosegold/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-romantic-burgundy/20 rounded-full blur-xl"></div>

          <div className="flex items-center justify-center gap-4 mb-2">
            <span className="text-romantic-pink/50 line-through text-lg font-medium">750 جنيه</span>
            <span className="text-3xl md:text-4xl font-black text-white bg-romantic-burgundy/40 px-4 py-1 rounded-xl border border-romantic-border shadow-inner">
              {websitePrice} جنيه فقط
            </span>
          </div>
          <p className="text-xs text-romantic-rosegold font-bold uppercase tracking-wider mb-4">
            خصم خاص 77% لفترة محدودة جداً! 🏷️
          </p>

          {/* Countdown Timer */}
          <div className="space-y-3">
            <span className="text-xs text-romantic-pink/70 block">ينتهي هذا العرض الحصري خلال:</span>
            <Countdown targetDateString={countdownEnd} />
          </div>
        </div>

        {/* Hero CTA Button */}
        <div>
          <a
            href="/order"
            className="inline-flex items-center gap-2 bg-burgundy-gold hover:opacity-95 text-white text-lg font-extrabold px-8 py-4 rounded-full border border-romantic-rosegold/40 hover:border-romantic-rosegold shadow-lg hover:shadow-romantic-burgundy/30 transition-all hover:scale-105 active:scale-95"
          >
            <Heart className="w-5 h-5 text-white fill-white heart-pulse" />
            <span>احجز هديتك دلوقتي ❤️</span>
          </a>
        </div>
      </section>

      {/* 3. Story Section */}
      <section className="px-4 py-16 bg-[#0c0305]/50 border-y border-romantic-border/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-2xl md:text-4xl font-extrabold mb-4 text-white">
              لماذا تستحق ذكرياتكما صفحة خاصة؟ ✍️
            </h2>
            <p className="text-sm md:text-base text-romantic-pink/80 leading-relaxed">
              الحب الحقيقي يستحق أن يُخلّد. الهدايا التقليدية مثل الشوكولاتة والورد تتلاشى مع الوقت، لكن صفحتكم الخاصة التي تحمل صوركما ورسائلكم الرومانسية ستبقى محفوظة للأبد على الإنترنت. كلما اشتقتما لبعضكما، يمكنكما إدخال رقمكما السري واسترجاع اللحظات السعيدة، لتظل شعلة الحب متقدة دائماً.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="romantic-glass p-6 rounded-2xl text-center hover:border-romantic-rosegold/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-romantic-burgundy/80 flex items-center justify-center mx-auto mb-4 border border-romantic-rosegold/20">
                <Shield className="w-6 h-6 text-romantic-rosegold" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-white">خصوصية تامة</h3>
              <p className="text-xs md:text-sm text-romantic-pink/70 leading-relaxed">
                الصفحة محمية بكلمة مرور خاصة بكما فقط، مما يضمن أمان وخصوصية ذكرياتكم.
              </p>
            </div>

            {/* Card 2 */}
            <div className="romantic-glass p-6 rounded-2xl text-center hover:border-romantic-rosegold/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-romantic-burgundy/80 flex items-center justify-center mx-auto mb-4 border border-romantic-rosegold/20">
                <ImageIcon className="w-6 h-6 text-romantic-rosegold" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-white">رسائل وصور</h3>
              <p className="text-xs md:text-sm text-romantic-pink/70 leading-relaxed">
                اجمعوا رسائلكم وصوركم وكلماتكم الخاصة مع تشغيل أغنيتكم المفضلة في الخلفية.
              </p>
            </div>

            {/* Card 3 */}
            <div className="romantic-glass p-6 rounded-2xl text-center hover:border-romantic-rosegold/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-romantic-burgundy/80 flex items-center justify-center mx-auto mb-4 border border-romantic-rosegold/20">
                <Gift className="w-6 h-6 text-romantic-rosegold" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-white">هدية رومانسية</h3>
              <p className="text-xs md:text-sm text-romantic-pink/70 leading-relaxed">
                فكرة جديدة غير مألوفة تعبر عن اهتمام حقيقي وتفاصيل تلمس المشاعر بعمق.
              </p>
            </div>

            {/* Card 4 */}
            <div className="romantic-glass p-6 rounded-2xl text-center hover:border-romantic-rosegold/30 transition-all duration-300">
              <div className="w-12 h-12 rounded-xl bg-romantic-burgundy/80 flex items-center justify-center mx-auto mb-4 border border-romantic-rosegold/20">
                <Clock className="w-6 h-6 text-romantic-rosegold" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-white">محفوظة للأبد</h3>
              <p className="text-xs md:text-sm text-romantic-pink/70 leading-relaxed">
                ستبقى الصفحة محفوظة على الويب لتستعرضوها في أي وقت ومن أي مكان في العالم.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Real Photos Section (Gallery) */}
      <section className="px-4 py-16 max-w-6xl mx-auto">
        <div className="text-center mb-10 max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-extrabold mb-4 text-white">
            صور حية من الواقع 📸
          </h2>
          <p className="text-sm md:text-base text-romantic-pink/80 leading-relaxed">
            {galleryTextAbove}
          </p>
        </div>

        <GalleryGrid images={galleryImages} />

        <div className="text-center mt-8">
          <p className="text-xs md:text-sm text-romantic-rosegold/80 font-medium">
            {galleryTextBelow}
          </p>
        </div>
      </section>

      {/* 5. Website Details Section */}
      <section className="px-4 py-12 bg-gradient-to-b from-transparent to-[#0c0305]/60">
        <div className="max-w-4xl mx-auto">
          <div className="romantic-glass p-8 rounded-3xl border border-romantic-rosegold/10 text-center relative overflow-hidden">
            <div className="absolute -top-12 -left-12 w-32 h-32 bg-romantic-burgundy/20 rounded-full blur-2xl"></div>
            <h2 className="text-xl md:text-2xl font-extrabold mb-4 text-white flex items-center justify-center gap-2">
              <Compass className="w-6 h-6 text-romantic-rosegold" />
              <span>تفاصيل ومميزات الموقع</span>
            </h2>
            <p className="text-sm md:text-base text-romantic-pink/90 leading-relaxed text-right md:text-center whitespace-pre-line">
              {websiteDetails}
            </p>
          </div>
        </div>
      </section>

      {/* 6. Testimonials Section */}
      <section className="px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-extrabold mb-3 text-white">
              قالوا عنا في رسائل الحب 💬
            </h2>
            <p className="text-sm md:text-base text-romantic-pink/70">
              آراء حقيقية من عملائنا الكرام الذين شاركوا ذكرياتهم معنا
            </p>
          </div>

          <Testimonials testimonials={testimonials} />
        </div>
      </section>

      {/* 7. How It Works Section */}
      <section className="px-4 py-16 bg-[#0c0305]/50 border-y border-romantic-border/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-extrabold mb-3 text-white">
              كيف تحصل على هديتك الرومانسية؟ ⚙️
            </h2>
            <p className="text-sm md:text-base text-romantic-pink/70">
              خطوات بسيطة وسريعة لتجهيز صفحة ذكرياتكما الخاصة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative max-w-3xl mx-auto">
            {/* Step 1 */}
            <div className="text-center space-y-4 relative">
              <div className="w-16 h-16 rounded-full bg-romantic-burgundy/80 flex items-center justify-center mx-auto text-xl font-bold border-2 border-romantic-rosegold/40 shadow-lg text-white">
                ١
              </div>
              <h3 className="text-lg font-bold text-white">اطلب الخدمة</h3>
              <p className="text-xs md:text-sm text-romantic-pink/70 leading-relaxed px-4">
                اضغط على زر احجز هديتك الآن واملأ استمارة الطلب ببياناتك وسنقوم باستلام طلبك فوراً.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center space-y-4 relative">
              <div className="w-16 h-16 rounded-full bg-romantic-burgundy/80 flex items-center justify-center mx-auto text-xl font-bold border-2 border-romantic-rosegold/40 shadow-lg text-white">
                ٢
              </div>
              <h3 className="text-lg font-bold text-white">استلم صفحتكما</h3>
              <p className="text-xs md:text-sm text-romantic-pink/70 leading-relaxed px-4">
                خلال 24 ساعة، سنسلمك رابط صفحتكما الخاصة مع الرقم السري لتفاجئ بها شريك حياتك!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FAQ Section */}
      <section className="px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-extrabold mb-3 text-white">
              الأسئلة الشائعة ❓
            </h2>
            <p className="text-sm md:text-base text-romantic-pink/70">
              إليك إجابات لأكثر الأسئلة التي تدور في ذهنك
            </p>
          </div>

          <FaqAccordion faqs={faqs} />
        </div>
      </section>

      {/* 9. Order Form Section (Replaced by CTA Button) */}
      <section id="order-form-section" className="px-4 py-16 max-w-xl mx-auto text-center animate-fade-in">
        <div className="romantic-glass p-8 md:p-10 rounded-3xl border border-romantic-rosegold/20 shadow-2xl relative overflow-hidden space-y-6">
          <div className="absolute -top-12 -right-12 w-24 h-24 bg-romantic-rosegold/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-12 -left-12 w-24 h-24 bg-romantic-burgundy/25 rounded-full blur-xl"></div>
          
          <div className="w-12 h-12 rounded-full bg-romantic-burgundy border-2 border-romantic-rosegold flex items-center justify-center mx-auto shadow-lg">
            <Heart className="w-5 h-5 text-white fill-white heart-pulse" />
          </div>

          <div className="space-y-3">
            <h2 className="text-xl md:text-2xl font-extrabold text-white">
              ابدأ تصميم هديتكم الرومانسية الآن ❤️
            </h2>
            <p className="text-xs md:text-sm text-romantic-pink/70 leading-relaxed max-w-md mx-auto">
              سعر مخفض وحصري لفترة محدودة. اطلب الآن وسنقوم بالتواصل معك لتخصيص كل تفاصيل صفحتكم.
            </p>
          </div>

          <div className="pt-2">
            <a
              href="/order"
              className="inline-flex items-center justify-center gap-2 bg-burgundy-gold hover:opacity-95 text-white text-base md:text-lg font-bold w-full py-4 px-6 rounded-xl border border-romantic-rosegold/40 shadow-lg hover:shadow-romantic-burgundy/30 transition-all hover:scale-[1.02] active:scale-[0.98] group"
            >
              <Heart className="w-4 h-4 text-white fill-white group-hover:scale-110 transition-transform heart-pulse" />
              <span>احجز هديتك دلوقتي ❤️</span>
            </a>
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className="text-center pt-8 border-t border-romantic-border/30 max-w-4xl mx-auto px-4">
        <p className="text-xs md:text-sm text-romantic-pink/50">
          جميع الحقوق محفوظة © {new Date().getFullYear()} - موقع رسائل الحب 💌
        </p>
      </footer>

    </div>
  );
}
