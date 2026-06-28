'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { HelpCircle, Plus, Edit2, Trash2, X, Check } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
}

interface FaqsClientProps {
  initialFaqs: FaqItem[];
}

export default function FaqsClient({ initialFaqs }: FaqsClientProps) {
  const router = useRouter();

  // Form states
  const [id, setId] = useState<string | null>(null); // For editing
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [sortOrder, setSortOrder] = useState(0);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const isEditMode = id !== null;

  // Sort FAQs by sort_order
  const sortedFaqs = [...initialFaqs].sort((a, b) => a.sort_order - b.sort_order);

  // Handle Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    if (!question.trim() || !answer.trim()) {
      setErrorMsg('يرجى ملء السؤال والجواب.');
      setLoading(false);
      return;
    }

    try {
      const url = '/api/dashboard/faqs';
      const method = isEditMode ? 'PUT' : 'POST';
      const payload = isEditMode
        ? { id, question, answer, sort_order: sortOrder }
        : { question, answer, sort_order: sortOrder };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'فشل حفظ السؤال');
      }

      setSuccessMsg(isEditMode ? 'تم تعديل السؤال بنجاح!' : 'تمت إضافة السؤال بنجاح!');
      resetForm();
      router.refresh();
    } catch (err: any) {
      console.error('Submit FAQ error:', err);
      setErrorMsg(err.message || 'حصل خطأ ما أثناء حفظ السؤال.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Deleting FAQ
  const handleDelete = async (deleteId: string) => {
    if (!confirm('هل تريد حذف هذا السؤال بالتأكيد؟')) return;

    setDeleteLoadingId(deleteId);
    try {
      const response = await fetch(`/api/dashboard/faqs?id=${deleteId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'فشل حذف السؤال');
      }

      router.refresh();
    } catch (err: any) {
      console.error('Delete FAQ error:', err);
      alert(err.message || 'حدث خطأ أثناء محاولة الحذف.');
    } finally {
      setDeleteLoadingId(null);
    }
  };

  // Start edit mode
  const startEdit = (item: FaqItem) => {
    setId(item.id);
    setQuestion(item.question);
    setAnswer(item.answer);
    setSortOrder(item.sort_order);
    setErrorMsg('');
    setSuccessMsg('');
  };

  // Reset form
  const resetForm = () => {
    setId(null);
    setQuestion('');
    setAnswer('');
    setSortOrder(0);
  };

  return (
    <div className="space-y-10">
      
      {/* Header title */}
      <div className="border-b border-romantic-border/30 pb-5">
        <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
          <HelpCircle className="w-6 h-6 text-romantic-rosegold" />
          <span>إدارة الأسئلة الشائعة</span>
        </h2>
        <p className="text-xs text-romantic-pink/60 mt-1">
          تحكم في قائمة الأسئلة والأجوبة التفاعلية التي تظهر في قسم FAQ بالصفحة الرئيسية
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Card */}
        <div className="lg:col-span-1">
          <div className="bg-[#18080c] border border-romantic-border/40 p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              {isEditMode ? <Edit2 className="w-4 h-4 text-romantic-rosegold" /> : <Plus className="w-4 h-4 text-romantic-rosegold" />}
              <span>{isEditMode ? 'تعديل السؤال' : 'إضافة سؤال جديد'}</span>
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

              {/* Question */}
              <div>
                <label className="block text-xs font-semibold text-romantic-pink/70 mb-1.5">
                  السؤال الشائع
                </label>
                <input
                  type="text"
                  required
                  placeholder="مثال: هل يمكنني تعديل البيانات لاحقاً؟"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className="w-full bg-[#110508]/85 border border-romantic-border/50 focus:border-romantic-rosegold focus:outline-none text-white px-3 py-2.5 rounded-xl text-xs"
                />
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-xs font-semibold text-romantic-pink/70 mb-1.5">
                  الترتيب (رقم تصاعدي)
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="w-full bg-[#110508]/85 border border-romantic-border/50 focus:border-romantic-rosegold focus:outline-none text-white px-3 py-2.5 rounded-xl text-xs"
                />
              </div>

              {/* Answer */}
              <div>
                <label className="block text-xs font-semibold text-romantic-pink/70 mb-1.5">
                  الإجابة والجواب التفصيلي
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="اكتب الإجابة التي ستظهر للعميل عند فتح السؤال..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
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
                  <span>{loading ? 'جاري الحفظ...' : isEditMode ? 'تحديث السؤال' : 'إضافة السؤال'}</span>
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
          <h3 className="font-bold text-base text-white">الأسئلة الحالية مرتبة ({sortedFaqs.length})</h3>

          {sortedFaqs.length === 0 ? (
            <div className="text-center py-16 text-romantic-pink/40 text-sm">
              لا توجد أسئلة شائعة مسجلة حالياً.
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto max-h-[65vh] pr-1">
              {sortedFaqs.map((item) => (
                <div
                  key={item.id}
                  className="romantic-glass p-5 rounded-xl border border-romantic-border/40 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs bg-romantic-burgundy/80 text-white font-bold px-2 py-0.5 rounded">
                          ترتيب: {item.sort_order}
                        </span>
                        <span className="font-bold text-white text-sm md:text-base">{item.question}</span>
                      </div>
                      <p className="text-xs md:text-sm text-romantic-pink/70 leading-relaxed mt-2 pl-4">
                        {item.answer}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 shrink-0">
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
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
      
    </div>
  );
}
