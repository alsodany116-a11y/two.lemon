import OrderForm from '@/components/order-form';
import { Heart } from 'lucide-react';

export const revalidate = 0; // Dynamic rendering

export default function OrderPage() {
  return (
    <div className="relative min-h-screen text-white bg-romantic-gradient selection:bg-romantic-rosegold py-12 px-4 flex flex-col justify-center items-center">
      
      {/* Background Micro-sparkles */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(74,0,16,0.15)_0%,transparent_70%)] pointer-events-none"></div>

      {/* Checkout Card */}
      <div className="w-full max-w-xl romantic-glass p-8 md:p-10 rounded-3xl border border-romantic-rosegold/20 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Floating background glows */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-romantic-rosegold/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-romantic-burgundy/20 rounded-full blur-3xl"></div>

        {/* Heart Icon */}
        <div className="w-16 h-16 rounded-full bg-romantic-burgundy border-2 border-romantic-rosegold flex items-center justify-center mx-auto shadow-lg relative">
          <Heart className="w-8 h-8 text-white fill-white heart-pulse" />
        </div>

        {/* Heading */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl md:text-3xl font-black text-white">ابدأ تصميم كبسولتك الآن 💌</h1>
          <p className="text-xs md:text-sm text-romantic-pink/70">
            املأ البيانات وسيقوم فريقنا بالتواصل معك لتصميم هديتك فوراً
          </p>
        </div>

        {/* Price Tag */}
        <div className="bg-[#110508]/80 border border-romantic-border/50 p-4 rounded-2xl text-center space-y-1">
          <span className="text-romantic-pink/40 line-through text-xs md:text-sm block">380 جنيه</span>
          <span className="text-2xl font-black text-white block">
            170 جنيه فقط
          </span>
          <span className="text-[10px] text-romantic-rosegold font-bold uppercase tracking-wider block">
            خصم لفترة محدودة جداً! 🏷️
          </span>
        </div>

        {/* Order Form Component */}
        <OrderForm />

        {/* Back to Home Link */}
        <div className="text-center pt-2">
          <a href="/" className="text-xs text-romantic-pink/50 hover:text-romantic-rosegold transition-colors">
            العودة لمشاهدة تفاصيل الموقع 🏠
          </a>
        </div>
      </div>
    </div>
  );
}
