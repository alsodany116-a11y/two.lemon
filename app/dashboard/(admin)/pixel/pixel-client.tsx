'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Facebook, Save, ShieldAlert, Sparkles, HelpCircle } from 'lucide-react';

interface PixelClientProps {
  initialPixelId: string;
  initialAccessToken: string;
  initialTestCode: string;
}

export default function PixelClient({
  initialPixelId,
  initialAccessToken,
  initialTestCode,
}: PixelClientProps) {
  const router = useRouter();

  const [pixelId, setPixelId] = useState(initialPixelId);
  const [accessToken, setAccessToken] = useState(initialAccessToken);
  const [testCode, setTestCode] = useState(initialTestCode);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      const response = await fetch('/api/dashboard/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings: {
            pixel_id: pixelId.trim(),
            pixel_access_token: accessToken.trim(),
            pixel_test_code: testCode.trim(),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'فشل حفظ إعدادات Pixel');
      }

      setSuccessMsg('تم حفظ إعدادات Facebook Pixel بنجاح!');
      router.refresh();
    } catch (err: any) {
      console.error('Save pixel error:', err);
      setErrorMsg(err.message || 'حصل خطأ ما أثناء حفظ الإعدادات.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      
      {/* Header title */}
      <div className="border-b border-romantic-border/30 pb-5">
        <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
          <Facebook className="w-6 h-6 text-blue-500" />
          <span>إعدادات Facebook Pixel و Conversions API</span>
        </h2>
        <p className="text-xs text-romantic-pink/60 mt-1">
          اربط موقعك بـ Meta Pixel للتتبع الإعلاني الدقيق باستخدام متصفح الويب والـ CAPI خادميًا
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Card (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#18080c] border border-romantic-border/40 p-6 md:p-8 rounded-2xl space-y-6">
            <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-romantic-border/20 pb-3">
              <Sparkles className="w-4 h-4 text-romantic-rosegold" />
              <span>بيانات الربط مع فيسبوك</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMsg && (
                <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-xl text-red-200 text-xs">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="bg-emerald-950/30 border border-emerald-500/50 p-4 rounded-xl text-emerald-200 text-xs">
                  {successMsg}
                </div>
              )}

              {/* Pixel ID */}
              <div>
                <label className="block text-xs font-semibold text-romantic-pink/80 mb-2">
                  معرّف البيكسل (Pixel ID)
                </label>
                <input
                  type="text"
                  placeholder="مثال: 123456789012345"
                  value={pixelId}
                  onChange={(e) => setPixelId(e.target.value)}
                  className="w-full bg-[#110508]/85 border border-romantic-border/50 focus:border-romantic-rosegold focus:outline-none text-white px-3 py-2.5 rounded-xl text-xs ltr text-left"
                />
              </div>

              {/* Access Token (CAPI) */}
              <div>
                <label className="block text-xs font-semibold text-romantic-pink/80 mb-2">
                  رمز الوصول للتحويلات (CAPI Access Token)
                </label>
                <textarea
                  rows={5}
                  placeholder="EAAG..."
                  value={accessToken}
                  onChange={(e) => setAccessToken(e.target.value)}
                  className="w-full bg-[#110508]/85 border border-romantic-border/50 focus:border-romantic-rosegold focus:outline-none text-white px-3 py-2.5 rounded-xl text-xs ltr text-left leading-relaxed"
                />
              </div>

              {/* Test Event Code */}
              <div>
                <label className="block text-xs font-semibold text-romantic-pink/80 mb-2">
                  كود حدث الاختبار (Test Event Code - اختياري)
                </label>
                <input
                  type="text"
                  placeholder="مثال: TEST12345"
                  value={testCode}
                  onChange={(e) => setTestCode(e.target.value)}
                  className="w-full bg-[#110508]/85 border border-romantic-border/50 focus:border-romantic-rosegold focus:outline-none text-white px-3 py-2.5 rounded-xl text-xs ltr text-left"
                />
                <span className="text-[10px] text-romantic-pink/40 mt-1 block">
                  ملاحظة: استخدم هذا الرمز فقط عند الرغبة في اختبار الأحداث مباشرة داخل مدير أحداث فيسبوك (Events Manager)، وامسحه في التشغيل الفعلي.
                </span>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-romantic-burgundy hover:bg-romantic-lightburgundy text-white font-bold py-2.5 px-6 rounded-xl text-sm border border-romantic-rosegold/30 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{loading ? 'جاري الحفظ...' : 'حفظ إعدادات البيكسل'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Explanations (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#18080c] border border-romantic-border/40 p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-romantic-border/20 pb-3">
              <HelpCircle className="w-4 h-4 text-romantic-rosegold" />
              <span>دليل التتبع</span>
            </h3>

            <div className="space-y-4 text-xs text-romantic-pink/80 leading-relaxed text-right">
              <p>
                للتتبع الإعلاني الدقيق وتفادي مشاكل حظر ملفات تعريف الارتباط بالمتصفحات، يقوم هذا الموقع بإرسال الأحداث بطريقتين متزامنتين:
              </p>
              <ul className="list-disc list-inside space-y-2 pr-2">
                <li>
                  <strong className="text-white">تتبع المتصفح (Browser Pixel):</strong> يرسل أحداث PageView و Lead و Purchase مباشرة من جهاز العميل.
                </li>
                <li>
                  <strong className="text-white">تتبع السيرفر (Conversions API):</strong> يرسل نفس الأحداث من السيرفر مباشرة لتفادي الحظر.
                </li>
              </ul>
              
              <div className="p-3 bg-romantic-burgundy/10 border border-romantic-border/30 rounded-xl flex gap-2 items-start text-[10px]">
                <ShieldAlert className="w-4 h-4 text-romantic-rosegold shrink-0 mt-0.5" />
                <p>
                  نظام التتبع مدمج به إرسال نفس المعرّف (Event ID) للحدثين معاً، فيسبوك يقوم بعملية <strong className="text-white">إلغاء التكرار (Deduplication)</strong> تلقائياً لضمان دقة الإحصائيات وعدم احتساب الطلب مرتين.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
      
    </div>
  );
}
