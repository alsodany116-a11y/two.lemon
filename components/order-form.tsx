'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, MessageSquare, Phone, User } from 'lucide-react';

export default function OrderForm() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [isWhatsappSame, setIsWhatsappSame] = useState(true);
  const [whatsapp, setWhatsapp] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!name.trim() || !mobile.trim()) {
      setErrorMsg('يرجى كتابة الاسم ورقم الهاتف بشكل صحيح.');
      setLoading(false);
      return;
    }

    // Generate matching Event ID for browser and CAPI deduplication
    let eventId = '';
    try {
      eventId = crypto.randomUUID();
    } catch (err) {
      // Fallback generator if crypto.randomUUID is not available (e.g. non-HTTPS local environment)
      eventId = 'lead-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now();
    }

    const whatsappValue = isWhatsappSame ? mobile : whatsapp;
    const sourceUrl = typeof window !== 'undefined' ? window.location.href : '';

    try {
      // Submit order to API
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          mobile: mobile.trim(),
          whatsapp: whatsappValue.trim(),
          eventId,
          sourceUrl,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'فشل إرسال الطلب');
      }

      // Order saved successfully. Now trigger client-side Facebook Pixel Lead event.
      if (typeof window !== 'undefined' && (window as any).fbq) {
        console.log(`Firing browser Pixel Lead event with ID: ${eventId}`);
        (window as any).fbq('track', 'Lead', {}, { event_id: eventId });
      } else {
        console.log('FB Pixel script not loaded or blocked by browser extensions, but order is saved.');
      }

      // Redirect to Secure Thank You Page with Token
      router.push(`/thank-you?token=${data.thankYouToken}`);
    } catch (err: any) {
      console.error('Order submission error:', err);
      setErrorMsg(err.message || 'حصل خطأ أثناء إرسال طلبك، يرجى المحاولة مرة أخرى.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errorMsg && (
        <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-xl text-red-200 text-sm text-center leading-relaxed">
          {errorMsg}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-romantic-pink/90 mb-2">
          الاسم بالكامل
        </label>
        <div className="relative">
          <input
            type="text"
            id="fullName"
            required
            disabled={loading}
            placeholder="مثال: أحمد محمد علي"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-[#110508]/80 border border-romantic-border/60 focus:border-romantic-rosegold focus:outline-none focus:ring-1 focus:ring-romantic-rosegold text-white px-4 py-3 pr-11 rounded-xl text-base transition-colors"
          />
          <User className="w-5 h-5 text-romantic-rosegold/60 absolute top-1/2 right-4 -translate-y-1/2" />
        </div>
      </div>

      {/* Mobile Number */}
      <div>
        <label htmlFor="mobile" className="block text-sm font-medium text-romantic-pink/90 mb-2">
          رقم الهاتف (المحمول)
        </label>
        <div className="relative">
          <input
            type="tel"
            id="mobile"
            required
            disabled={loading}
            placeholder="مثال: 01012345678"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="w-full bg-[#110508]/80 border border-romantic-border/60 focus:border-romantic-rosegold focus:outline-none focus:ring-1 focus:ring-romantic-rosegold text-white px-4 py-3 pr-11 rounded-xl text-base text-left ltr transition-colors"
          />
          <Phone className="w-5 h-5 text-romantic-rosegold/60 absolute top-1/2 right-4 -translate-y-1/2" />
        </div>
      </div>

      {/* Is WhatsApp same as mobile toggle */}
      <div className="bg-[#110508]/40 border border-romantic-border/30 p-4 rounded-xl flex items-center justify-between">
        <span className="text-sm font-medium text-romantic-pink/90">
          هل رقم الواتساب هو نفس رقم الهاتف؟
        </span>
        <div className="flex items-center gap-1 bg-[#1a0a0f] p-1 rounded-lg border border-romantic-border/40">
          <button
            type="button"
            disabled={loading}
            onClick={() => setIsWhatsappSame(true)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              isWhatsappSame
                ? 'bg-romantic-burgundy text-white shadow-md'
                : 'text-romantic-pink/60 hover:text-white'
            }`}
          >
            نعم
          </button>
          <button
            type="button"
            disabled={loading}
            onClick={() => setIsWhatsappSame(false)}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
              !isWhatsappSame
                ? 'bg-romantic-burgundy text-white shadow-md'
                : 'text-romantic-pink/60 hover:text-white'
            }`}
          >
            لا
          </button>
        </div>
      </div>

      {/* Custom WhatsApp Field */}
      {!isWhatsappSame && (
        <div className="transition-all duration-300">
          <label htmlFor="whatsapp" className="block text-sm font-medium text-romantic-pink/90 mb-2">
            رقم الواتساب
          </label>
          <div className="relative">
            <input
              type="tel"
              id="whatsapp"
              required={!isWhatsappSame}
              disabled={loading}
              placeholder="مثال: 01098765432"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full bg-[#110508]/80 border border-romantic-border/60 focus:border-romantic-rosegold focus:outline-none focus:ring-1 focus:ring-romantic-rosegold text-white px-4 py-3 pr-11 rounded-xl text-base text-left ltr transition-colors"
            />
            <MessageSquare className="w-5 h-5 text-romantic-rosegold/60 absolute top-1/2 right-4 -translate-y-1/2" />
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-burgundy-gold hover:opacity-90 active:scale-[0.98] transition-all text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 text-lg shadow-lg hover:shadow-romantic-burgundy/40 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        <Heart className="w-5 h-5 text-white fill-white group-hover:scale-110 transition-transform heart-pulse" />
        <span>{loading ? 'جاري إرسال طلبك...' : 'اطلب دلوقتي ❤️'}</span>
      </button>
    </form>
  );
}
