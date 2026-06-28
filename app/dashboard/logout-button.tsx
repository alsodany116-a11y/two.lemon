'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;
    if (!confirm('هل تريد بالتأكيد تسجيل الخروج؟')) return;
    
    setLoading(true);
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
      });
      if (response.ok) {
        router.push('/dashboard/login');
        router.refresh();
      } else {
        alert('فشل تسجيل الخروج، يرجى المحاولة مرة أخرى.');
      }
    } catch (err) {
      console.error('Logout failed:', err);
      alert('حدث خطأ أثناء الاتصال بالخادم.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full flex items-center justify-center gap-2 bg-[#ff003c]/10 hover:bg-[#ff003c]/20 text-[#ff003c] font-bold py-3 px-4 rounded-xl text-sm border border-[#ff003c]/20 hover:border-[#ff003c]/40 transition-all disabled:opacity-50"
    >
      <LogOut className="w-4 h-4 shrink-0" />
      <span>{loading ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}</span>
    </button>
  );
}
