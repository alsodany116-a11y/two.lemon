'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, Star, Plus, Edit2, Trash2, X, Check } from 'lucide-react';

interface TestimonialItem {
  id: string;
  name: string;
  stars: number;
  comment: string;
}

interface TestimonialsClientProps {
  initialTestimonials: TestimonialItem[];
}

export default function TestimonialsClient({ initialTestimonials }: TestimonialsClientProps) {
  const router = useRouter();

  // Form states
  const [id, setId] = useState<string | null>(null); // For editing
  const [name, setName] = useState('');
  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const isEditMode = id !== null;

  // Handle Form Submission (Add or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (!name.trim() || !comment.trim()) {
      setErrorMsg('يرجى كتابة الاسم والتعليق.');
      setLoading(false);
      return;
    }

    try {
      const url = '/api/dashboard/testimonials';
      const method = isEditMode ? 'PUT' : 'POST';
      const payload = isEditMode ? { id, name, stars, comment } : { name, stars, comment };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'فشل حفظ التعديلات');
      }

      setSuccessMsg(isEditMode ? 'تم تعديل رأي العميل بنجاح!' : 'تمت إضافة رأي العميل بنجاح!');
      resetForm();
      router.refresh();
    } catch (err: any) {
      console.error('Submit error:', err);
      setErrorMsg(err.message || 'حصل خطأ أثناء محاولة حفظ رأي العميل.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Deleting testimonial
  const handleDelete = async (deleteId: string) => {
    if (!confirm('هل تريد حذف رأي العميل هذا بالتأكيد؟')) return;

    setDeleteLoadingId(deleteId);
    try {
      const response = await fetch(`/api/dashboard/testimonials?id=${deleteId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'فشل حذف الرأي');
      }

      router.refresh();
    } catch (err: any) {
      console.error('Delete error:', err);
      alert(err.message || 'حدث خطأ أثناء محاولة الحذف.');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  // Populate form for editing
  const startEdit = (item: TestimonialItem) => {
    setId(item.id);
    setName(item.name);
    setStars(item.stars);
    setComment(item.comment);
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Cancel edit state and reset form
  const resetForm = () => {
    setId(null);
    setName('');
    setStars(5);
    setComment('');
  };

  return (
    <div className="space-y-10">
      
      {/* Header title */}
      <div className="border-b border-romantic-border/30 pb-5">
        <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
          <MessageSquare className="w-6 h-6 text-romantic-rosegold" />
          <span>إدارة آراء العملاء (الشهادات)</span>
        </h2>
        <p className="text-xs text-romantic-pink/60 mt-1">
          أضف أو عدل أو احذف تقييمات العملاء التي تظهر على الصفحة الرئيسية للموقع
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Card (Add/Edit) */}
        <div className="lg:col-span-1">
          <div className="bg-[#18080c] border border-romantic-border/40 p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              {isEditMode ? <Edit2 className="w-4 h-4 text-romantic-rosegold" /> : <Plus className="w-4 h-4 text-romantic-rosegold" />}
              <span>{isEditMode ? 'تعديل رأي العميل' : 'إضافة رأي جديد'}</span>
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-xl text-red-200 text-xs">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="bg-emerald-950/30 border border-emerald-500/50 p-3 rounded-xl text-emerald-200 text-xs">
                  {successMsg}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-semibold text-romantic-pink/70 mb-1.5">
                  اسم العميل (أو اللقب)
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: أحمد وسارة، أو منى ا."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#110508]/85 border border-romantic-border/50 focus:border-romantic-rosegold focus:outline-none text-white px-3 py-2.5 rounded-xl text-xs"
                />
              </div>

              {/* Stars */}
              <div>
                <label className="block text-xs font-semibold text-romantic-pink/70 mb-1.5">
                  التقييم بالنجوم
                </label>
                <div className="flex gap-2 bg-[#110508]/50 p-2 rounded-xl border border-romantic-border/30 w-fit">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setStars(star)}
                      className="p-1 focus:outline-none"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          star <= stars
                            ? 'text-romantic-rosegold fill-romantic-rosegold'
                            : 'text-romantic-pink/20 fill-transparent'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment text */}
              <div>
                <label className="block text-xs font-semibold text-romantic-pink/70 mb-1.5">
                  التعليق والرأي
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="اكتب هنا رأي العميل في تجربته للموقع والتصميم..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-[#110508]/85 border border-romantic-border/50 focus:border-romantic-rosegold focus:outline-none text-white px-3 py-2.5 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-grow bg-romantic-burgundy hover:bg-romantic-lightburgundy text-white font-bold py-2.5 px-4 rounded-xl text-sm border border-romantic-rosegold/30 flex items-center justify-center gap-1 transition-all disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{loading ? 'جاري الحفظ...' : isEditMode ? 'تحديث الرأي' : 'إضافة الرأي'}</span>
                </button>

                {isEditMode && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="bg-transparent hover:bg-romantic-border/30 text-romantic-pink/70 hover:text-white font-bold py-2.5 px-3 rounded-xl text-sm border border-romantic-border/60 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Existing List */}
        <div className="lg:col-span-2 bg-[#18080c] border border-romantic-border/40 p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-base text-white">الآراء الحالية ({initialTestimonials.length})</h3>

          {initialTestimonials.length === 0 ? (
            <div className="text-center py-16 text-romantic-pink/40 text-sm">
              لا توجد آراء عملاء مسجلة حالياً.
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-[60vh] pr-1">
              {initialTestimonials.map((item) => (
                <div
                  key={item.id}
                  className="romantic-glass p-5 rounded-xl border border-romantic-border/40 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4"
                >
                  <div className="space-y-2">
                    {/* Stars and Name */}
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white">{item.name}</span>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < item.stars
                                ? 'text-romantic-rosegold fill-romantic-rosegold'
                                : 'text-romantic-pink/10 fill-transparent'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {/* Comment */}
                    <p className="text-xs md:text-sm text-romantic-pink/80 leading-relaxed">
                      {item.comment}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 sm:self-start shrink-0">
                    <button
                      onClick={() => startEdit(item)}
                      className="bg-romantic-burgundy/40 hover:bg-romantic-burgundy hover:text-white text-romantic-pink p-2 rounded-lg border border-romantic-border transition-all"
                      title="تعديل"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={deleteLoadingId === item.id}
                      className="bg-[#ff003c]/10 hover:bg-[#ff003c]/20 text-[#ff003c] p-2 rounded-lg border border-[#ff003c]/20 transition-all disabled:opacity-50"
                      title="حذف"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
      
    </div>
  );
}
