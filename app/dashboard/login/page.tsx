'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Heart } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    if (!password) {
      setErrorMsg('يرجى إدخال كلمة المرور.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        router.push('/dashboard/orders');
        router.refresh();
      } else {
        setErrorMsg(data.message || 'كلمة المرور غير صحيحة.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setErrorMsg('حدث خطأ أثناء الاتصال بالخادم، يرجى المحاولة لاحقاً.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen text-white bg-romantic-gradient selection:bg-romantic-rosegold py-12 px-4 flex flex-col justify-center items-center">
      
      {/* Background Micro-sparkles */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,0,16,0.15)_0%,transparent_70%)] pointer-events-none"></div>

      {/* Login Card */}
      <div className="w-full max-w-md romantic-glass p-8 md:p-10 rounded-3xl border border-romantic-rosegold/20 shadow-2xl relative overflow-hidden space-y-8">
        
        {/* Floating background glows */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-romantic-rosegold/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-romantic-burgundy/20 rounded-full blur-3xl"></div>

        {/* Lock Icon */}
        <div className="w-16 h-16 rounded-full bg-romantic-burgundy border-2 border-romantic-rosegold flex items-center justify-center mx-auto shadow-lg relative">
          <Lock className="w-8 h-8 text-romantic-pink" />
        </div>

        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-black text-white">دخول لوحة التحكم</h1>
          <p className="text-xs text-romantic-pink/70">
            أدخل كلمة المرور السرية للوصول إلى لوحة الإدارة
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-5">
          {errorMsg && (
            <div className="bg-red-900/30 border border-red-500/50 p-4 rounded-xl text-red-200 text-sm text-center leading-relaxed">
              {errorMsg}
            </div>
          )}

          <div>
            <label htmlFor="pass" className="block text-sm font-medium text-romantic-pink/90 mb-2">
              كلمة المرور
            </label>
            <div className="relative">
              <input
                type="password"
                id="pass"
                required
                disabled={loading}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#110508]/85 border border-romantic-border/60 focus:border-romantic-rosegold focus:outline-none focus:ring-1 focus:ring-romantic-rosegold text-white px-4 py-3 rounded-xl text-base text-center transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-burgundy-gold hover:opacity-90 active:scale-[0.98] transition-all text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 text-base shadow-lg hover:shadow-romantic-burgundy/40 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span>{loading ? 'جاري التحقق...' : 'تسجيل الدخول'}</span>
          </button>
        </form>

        {/* Back to Site */}
        <div className="text-center">
          <a href="/" className="text-xs text-romantic-pink/50 hover:text-romantic-rosegold transition-colors">
            العودة لموقع رسائل الحب 💌
          </a>
        </div>
      </div>
    </div>
  );
}
