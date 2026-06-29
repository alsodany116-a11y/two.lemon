'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Save, Lock, KeyRound, Sparkles } from 'lucide-react';

interface SettingsClientProps {
  initialCountdown: string;
  initialDetails: string;
  initialThankYou: string;
  initialThankYouStep1: string;
  initialThankYouStep2: string;
  initialPrice: string;
}

export default function SettingsClient({
  initialCountdown,
  initialDetails,
  initialThankYou,
  initialThankYouStep1,
  initialThankYouStep2,
  initialPrice,
}: SettingsClientProps) {
  const router = useRouter();

  // General Settings States
  const [countdown, setCountdown] = useState(initialCountdown);
  const [details, setDetails] = useState(initialDetails);
  const [thankYou, setThankYou] = useState(initialThankYou);
  const [thankYouStep1, setThankYouStep1] = useState(initialThankYouStep1);
  const [thankYouStep2, setThankYouStep2] = useState(initialThankYouStep2);
  const [price, setPrice] = useState(initialPrice);
  
  const [generalLoading, setGeneralLoading] = useState(false);
  const [generalSuccess, setGeneralSuccess] = useState('');
  const [generalError, setGeneralError] = useState('');

  // Password Settings States
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [passLoading, setPassLoading] = useState(false);
  const [passSuccess, setPassSuccess] = useState('');
  const [passError, setPassError] = useState('');

  // Save General settings
  const handleSaveGeneral = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralLoading(true);
    setGeneralSuccess('');
    setGeneralError('');

    try {
      const response = await fetch('/api/dashboard/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings: {
            countdown_end: countdown,
            website_details: details,
            thank_you_message: thankYou,
            thank_you_step1: thankYouStep1,
            thank_you_step2: thankYouStep2,
            website_price: price,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'فشل حفظ الإعدادات');
      }

      setGeneralSuccess('تم حفظ الإعدادات العامة بنجاح!');
      router.refresh();
    } catch (err: any) {
      console.error('Save general settings error:', err);
      setGeneralError(err.message || 'حصل خطأ ما أثناء حفظ الإعدادات.');
    } finally {
      setGeneralLoading(false);
    }
  };

  // Change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassLoading(true);
    setPassSuccess('');
    setPassError('');

    if (newPassword !== confirmPassword) {
      setPassError('كلمة المرور الجديدة وتأكيدها غير متطابقتين.');
      setPassLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setPassError('يجب أن تتكون كلمة المرور الجديدة من 6 أحرف على الأقل.');
      setPassLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/dashboard/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'فشل تغيير كلمة المرور');
      }

      setPassSuccess('تم تغيير كلمة المرور بنجاح!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      router.refresh();
    } catch (err: any) {
      console.error('Change password error:', err);
      setPassError(err.message || 'حصل خطأ ما أثناء محاولة تغيير كلمة المرور.');
    } finally {
      setPassLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      
      {/* Header title */}
      <div className="border-b border-romantic-border/30 pb-5">
        <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
          <Settings className="w-6 h-6 text-romantic-rosegold" />
          <span>إعدادات تفاصيل الموقع والسرية</span>
        </h2>
        <p className="text-xs text-romantic-pink/60 mt-1">
          عدل تفاصيل وصفحات الموقع، عدل وقت العداد التنازلي، أو غير كلمة مرور الداشبورد
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: General Configuration Form (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#18080c] border border-romantic-border/40 p-6 md:p-8 rounded-2xl space-y-6">
            <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-romantic-border/20 pb-3">
              <Sparkles className="w-4 h-4 text-romantic-rosegold" />
              <span>الإعدادات العامة وتفاصيل المحتوى</span>
            </h3>

            <form onSubmit={handleSaveGeneral} className="space-y-5">
              {generalError && (
                <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-xl text-red-200 text-xs">
                  {generalError}
                </div>
              )}
              {generalSuccess && (
                <div className="bg-emerald-950/30 border border-emerald-500/50 p-4 rounded-xl text-emerald-200 text-xs">
                  {generalSuccess}
                </div>
              )}

              {/* Website Price Input */}
              <div>
                <label className="block text-xs font-semibold text-romantic-pink/80 mb-2">
                  سعر الخدمة بالموقع (بالجنيه المصري)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  placeholder="80"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-[#110508]/85 border border-romantic-border/50 focus:border-romantic-rosegold focus:outline-none text-white px-3 py-2.5 rounded-xl text-xs ltr text-left font-bold"
                />
              </div>

              {/* Countdown Target Input */}
              <div>
                <label className="block text-xs font-semibold text-romantic-pink/80 mb-2">
                  تاريخ ووقت انتهاء العرض التنازلي (صيغة ISO بالمنطقة الزمنية)
                </label>
                <input
                  type="text"
                  required
                  placeholder="2026-07-15T00:00:00.000Z"
                  value={countdown}
                  onChange={(e) => setCountdown(e.target.value)}
                  className="w-full bg-[#110508]/85 border border-romantic-border/50 focus:border-romantic-rosegold focus:outline-none text-white px-3 py-2.5 rounded-xl text-xs ltr text-left"
                />
                <span className="text-[10px] text-romantic-pink/40 mt-1 block">
                  ملاحظة: أدخل التاريخ بالصيغة العالمية المحددة، مثال: 2026-07-15T00:00:00.000Z
                </span>
              </div>

              {/* Website Details Block */}
              <div>
                <label className="block text-xs font-semibold text-romantic-pink/80 mb-2">
                  تفاصيل ومميزات الموقع (قسم تفاصيل الموقع)
                </label>
                <textarea
                  rows={6}
                  required
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full bg-[#110508]/85 border border-romantic-border/50 focus:border-romantic-rosegold focus:outline-none text-white px-3 py-2.5 rounded-xl text-xs leading-relaxed"
                />
              </div>

              {/* Thank You Page Message */}
              <div>
                <label className="block text-xs font-semibold text-romantic-pink/80 mb-2">
                  رسالة الشكر الرومانسية (تظهر في صفحة /thank-you بعد الطلب)
                </label>
                <textarea
                  rows={4}
                  required
                  value={thankYou}
                  onChange={(e) => setThankYou(e.target.value)}
                  className="w-full bg-[#110508]/85 border border-romantic-border/50 focus:border-romantic-rosegold focus:outline-none text-white px-3 py-2.5 rounded-xl text-xs leading-relaxed"
                />
              </div>

              {/* Thank You Page Step 1 */}
              <div>
                <label className="block text-xs font-semibold text-romantic-pink/80 mb-2">
                  الخطوات القادمة - الخطوة الأولى
                </label>
                <textarea
                  rows={2}
                  required
                  value={thankYouStep1}
                  onChange={(e) => setThankYouStep1(e.target.value)}
                  className="w-full bg-[#110508]/85 border border-romantic-border/50 focus:border-romantic-rosegold focus:outline-none text-white px-3 py-2.5 rounded-xl text-xs leading-relaxed"
                />
              </div>

              {/* Thank You Page Step 2 */}
              <div>
                <label className="block text-xs font-semibold text-romantic-pink/80 mb-2">
                  الخطوات القادمة - الخطوة الثانية
                </label>
                <textarea
                  rows={2}
                  required
                  value={thankYouStep2}
                  onChange={(e) => setThankYouStep2(e.target.value)}
                  className="w-full bg-[#110508]/85 border border-romantic-border/50 focus:border-romantic-rosegold focus:outline-none text-white px-3 py-2.5 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={generalLoading}
                className="bg-romantic-burgundy hover:bg-romantic-lightburgundy text-white font-bold py-2.5 px-6 rounded-xl text-sm border border-romantic-rosegold/30 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                <span>{generalLoading ? 'جاري حفظ الإعدادات...' : 'حفظ الإعدادات العامة'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Change Password (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#18080c] border border-romantic-border/40 p-6 rounded-2xl space-y-5">
            <h3 className="font-bold text-base text-white flex items-center gap-2 border-b border-romantic-border/20 pb-3">
              <Lock className="w-4 h-4 text-romantic-rosegold" />
              <span>تغيير كلمة المرور</span>
            </h3>

            <form onSubmit={handleChangePassword} className="space-y-4">
              {passError && (
                <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-xl text-red-200 text-xs">
                  {passError}
                </div>
              )}
              {passSuccess && (
                <div className="bg-emerald-950/30 border border-emerald-500/50 p-3 rounded-xl text-emerald-200 text-xs">
                  {passSuccess}
                </div>
              )}

              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-romantic-pink/70 mb-1.5">
                  كلمة المرور الحالية
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-[#110508]/85 border border-romantic-border/50 focus:border-romantic-rosegold focus:outline-none text-white px-3 py-2 rounded-xl text-xs text-center"
                />
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-romantic-pink/70 mb-1.5">
                  كلمة المرور الجديدة
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-[#110508]/85 border border-romantic-border/50 focus:border-romantic-rosegold focus:outline-none text-white px-3 py-2 rounded-xl text-xs text-center"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-romantic-pink/70 mb-1.5">
                  تأكيد كلمة المرور الجديدة
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#110508]/85 border border-romantic-border/50 focus:border-romantic-rosegold focus:outline-none text-white px-3 py-2 rounded-xl text-xs text-center"
                />
              </div>

              <button
                type="submit"
                disabled={passLoading}
                className="w-full bg-romantic-burgundy hover:bg-romantic-lightburgundy text-white font-bold py-2.5 px-4 rounded-xl text-sm border border-romantic-rosegold/30 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                <KeyRound className="w-4 h-4" />
                <span>{passLoading ? 'جاري التغيير...' : 'تغيير كلمة المرور'}</span>
              </button>
            </form>
          </div>
        </div>

      </div>
      
    </div>
  );
}
