'use client';

import { useState } from 'react';
import { ShoppingBag, Search, Printer, Calendar, Phone, MessageSquare, User } from 'lucide-react';

interface OrderItem {
  id: string;
  created_at: string;
  name: string;
  mobile: string;
  whatsapp: string | null;
}

interface OrdersClientProps {
  initialOrders: OrderItem[];
}

export default function OrdersClient({ initialOrders }: OrdersClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter orders based on search query
  const filteredOrders = initialOrders.filter((order) => {
    const search = searchTerm.toLowerCase();
    return (
      order.name.toLowerCase().includes(search) ||
      order.mobile.includes(search) ||
      (order.whatsapp && order.whatsapp.includes(search))
    );
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Print Control */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-romantic-border/30 pb-5">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-romantic-rosegold" />
            <span>إدارة الأوردرات ({initialOrders.length})</span>
          </h2>
          <p className="text-xs text-romantic-pink/60 mt-1">
            استعرض وتتبع جميع الطلبات الواردة من استمارة الشراء
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="inline-flex items-center justify-center gap-2 bg-romantic-burgundy hover:bg-romantic-lightburgundy text-white font-bold py-2.5 px-5 rounded-xl border border-romantic-rosegold/30 hover:border-romantic-rosegold/60 text-sm shadow-md transition-all print:hidden"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة كشف الطلبات</span>
        </button>
      </div>

      {/* Stats Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 print:hidden">
        <div className="bg-[#18080c] border border-romantic-border/40 p-5 rounded-2xl">
          <span className="text-xs text-romantic-pink/60 block">إجمالي المبيعات</span>
          <span className="text-2xl font-black text-white mt-1 block">
            {initialOrders.length * 170} جنيه
          </span>
        </div>
        <div className="bg-[#18080c] border border-romantic-border/40 p-5 rounded-2xl">
          <span className="text-xs text-romantic-pink/60 block">عدد الأوردرات</span>
          <span className="text-2xl font-black text-white mt-1 block">
            {initialOrders.length} أوردر
          </span>
        </div>
        <div className="bg-[#18080c] border border-romantic-border/40 p-5 rounded-2xl">
          <span className="text-xs text-romantic-pink/60 block">متوسط السعر للطلب</span>
          <span className="text-2xl font-black text-white mt-1 block">
            170 جنيه
          </span>
        </div>
      </div>

      {/* Search Input bar */}
      <div className="relative print:hidden">
        <input
          type="text"
          placeholder="ابحث عن أوردر باسم العميل أو رقم الهاتف..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#18080c] border border-romantic-border/50 focus:border-romantic-rosegold focus:outline-none focus:ring-1 focus:ring-romantic-rosegold text-white px-4 py-3 pr-11 rounded-xl text-sm"
        />
        <Search className="w-5 h-5 text-romantic-pink/50 absolute top-1/2 right-4 -translate-y-1/2" />
      </div>

      {/* Orders Table sheet */}
      <div className="romantic-glass rounded-2xl overflow-hidden border border-romantic-border/20 shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-[#16070a]/80 text-romantic-pink/80 border-b border-romantic-border/30 text-xs md:text-sm">
                <th className="p-4 font-bold">اسم العميل</th>
                <th className="p-4 font-bold">رقم الهاتف</th>
                <th className="p-4 font-bold">الواتساب</th>
                <th className="p-4 font-bold">تاريخ الطلب</th>
                <th className="p-4 font-bold print:hidden">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-romantic-border/20 text-xs md:text-sm">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-romantic-pink/50 font-medium">
                    {searchTerm ? 'لا توجد نتائج تطابق بحثك' : 'لا توجد أوردرات مسجلة حالياً'}
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-romantic-burgundy/10 transition-colors">
                    {/* Customer Name */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-romantic-rosegold/70 shrink-0" />
                        <span className="font-semibold text-white">{order.name}</span>
                      </div>
                    </td>
                    
                    {/* Mobile */}
                    <td className="p-4 font-mono text-romantic-pink/90 ltr text-right">
                      <a href={`tel:${order.mobile}`} className="hover:underline flex items-center justify-end gap-1.5">
                        <span>{order.mobile}</span>
                        <Phone className="w-3.5 h-3.5 text-romantic-rosegold/50 shrink-0 print:hidden" />
                      </a>
                    </td>
                    
                    {/* WhatsApp */}
                    <td className="p-4 font-mono text-romantic-pink/90 ltr text-right">
                      {order.whatsapp ? (
                        <a
                          href={`https://wa.me/2${order.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline flex items-center justify-end gap-1.5 text-emerald-400 hover:text-emerald-300 print:text-white"
                        >
                          <span>{order.whatsapp}</span>
                          <MessageSquare className="w-3.5 h-3.5 text-emerald-400/50 shrink-0 print:hidden" />
                        </a>
                      ) : (
                        <span className="text-romantic-pink/30">-</span>
                      )}
                    </td>
                    
                    {/* Created Date */}
                    <td className="p-4 text-romantic-pink/70">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-romantic-rosegold/50 shrink-0" />
                        <span>
                          {new Date(order.created_at).toLocaleString('ar-EG', {
                            year: 'numeric',
                            month: 'numeric',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </td>

                    {/* Quick WhatsApp Action (Web only) */}
                    <td className="p-4 print:hidden">
                      <a
                        href={`https://wa.me/2${order.whatsapp || order.mobile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1 px-3 rounded-lg text-xs transition-colors inline-block"
                      >
                        مراسلة واتساب
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
