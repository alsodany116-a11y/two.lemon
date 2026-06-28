import Link from 'next/link';
import { ShoppingBag, Image as ImageIcon, MessageSquare, HelpCircle, Settings, Facebook } from 'lucide-react';
import LogoutButton from '../logout-button';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  // Sidebar navigation links
  const links = [
    { href: '/dashboard/orders', label: 'الأوردرات 🛒', icon: ShoppingBag },
    { href: '/dashboard/gallery', label: 'صور واقعية 🖼️', icon: ImageIcon },
    { href: '/dashboard/testimonials', label: 'الشهادات 💬', icon: MessageSquare },
    { href: '/dashboard/faqs', label: 'الأسئلة الشائعة ❓', icon: HelpCircle },
    { href: '/dashboard/settings', label: 'تفاصيل الموقع والسرية 🔑', icon: Settings },
    { href: '/dashboard/pixel', label: 'Facebook Pixel 📡', icon: Facebook },
  ];

  return (
    <div className="min-h-screen bg-[#070204] text-white flex flex-col md:flex-row font-cairo">
      
      {/* Sidebar Container */}
      <aside className="w-full md:w-64 bg-[#110508] border-b md:border-b-0 md:border-l border-romantic-border/40 flex flex-col justify-between shrink-0">
        
        {/* Top Branding & Menu */}
        <div>
          <div className="p-6 border-b border-romantic-border/30 flex items-center justify-between">
            <h1 className="text-lg font-black text-romantic-pink tracking-wider">
              لوحة التحكم 💌
            </h1>
            <span className="text-xs bg-romantic-burgundy/80 border border-romantic-rosegold/30 text-white px-2 py-0.5 rounded-full font-bold">
              المدير
            </span>
          </div>

          <nav className="p-4 space-y-1">
            {links.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-romantic-pink/70 hover:text-white hover:bg-romantic-burgundy/20 hover:border-r-4 hover:border-romantic-rosegold/80 transition-all"
                >
                  <Icon className="w-4 h-4 text-romantic-rosegold shrink-0" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Sign-out Action */}
        <div className="p-4 border-t border-romantic-border/30">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Workspace */}
      <main className="flex-grow p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        <div className="bg-[#110508]/40 border border-romantic-border/20 rounded-3xl p-6 md:p-8 shadow-xl min-h-[80vh]">
          {children}
        </div>
      </main>

    </div>
  );
}
