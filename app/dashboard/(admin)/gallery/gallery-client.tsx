'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImageIcon, Upload, Trash2, Save, FileImage } from 'lucide-react';

interface GalleryItem {
  id: string;
  image_url: string;
}

interface GalleryClientProps {
  images: GalleryItem[];
  initialTextAbove: string;
  initialTextBelow: string;
}

export default function GalleryClient({
  images,
  initialTextAbove,
  initialTextBelow,
}: GalleryClientProps) {
  const router = useRouter();
  
  // States for text settings
  const [textAbove, setTextAbove] = useState(initialTextAbove);
  const [textBelow, setTextBelow] = useState(initialTextBelow);
  const [textLoading, setTextLoading] = useState(false);
  const [textSuccessMsg, setTextSuccessMsg] = useState('');
  const [textErrorMsg, setTextErrorMsg] = useState('');

  // States for image upload
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');
  const [uploadErrorMsg, setUploadErrorMsg] = useState('');

  // States for deletion
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Handle uploading image
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return;

    setUploadLoading(true);
    setUploadErrorMsg('');
    setUploadSuccessMsg('');

    const formData = new FormData();
    formData.append('file', uploadFile);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'فشل رفع الملف');
      }

      setUploadSuccessMsg('تم رفع الصورة وإضافتها للروابط بنجاح!');
      setUploadFile(null);
      
      // Reset file input value
      const fileInput = document.getElementById('galleryFileInput') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      router.refresh(); // Refresh dashboard page to show new image
    } catch (err: any) {
      console.error('Upload error:', err);
      setUploadErrorMsg(err.message || 'حصل خطأ أثناء رفع الصورة، تأكد من إعدادات Supabase Storage.');
    } finally {
      setUploadLoading(false);
    }
  };

  // Handle deleting image
  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصورة نهائياً؟')) return;

    setDeleteId(id);
    try {
      const response = await fetch('/api/gallery/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, imageUrl }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'فشل حذف الصورة');
      }

      router.refresh();
    } catch (err: any) {
      console.error('Delete error:', err);
      alert(err.message || 'حدث خطأ أثناء محاولة حذف الصورة.');
    } finally {
      setDeleteId(null);
    }
  };

  // Handle saving texts settings
  const handleSaveTexts = async (e: React.FormEvent) => {
    e.preventDefault();
    setTextLoading(true);
    setTextSuccessMsg('');
    setTextErrorMsg('');

    try {
      const response = await fetch('/api/dashboard/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          settings: {
            gallery_text_above: textAbove,
            gallery_text_below: textBelow,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'فشل حفظ النصوص');
      }

      setTextSuccessMsg('تم حفظ النصوص بنجاح!');
      router.refresh();
    } catch (err: any) {
      console.error('Save texts error:', err);
      setTextErrorMsg(err.message || 'حصل خطأ أثناء حفظ النصوص، يرجى المحاولة لاحقاً.');
    } finally {
      setTextLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      
      {/* Header title */}
      <div className="border-b border-romantic-border/30 pb-5">
        <h2 className="text-xl md:text-2xl font-black text-white flex items-center gap-2">
          <ImageIcon className="w-6 h-6 text-romantic-rosegold" />
          <span>إدارة معرض الصور</span>
        </h2>
        <p className="text-xs text-romantic-pink/60 mt-1">
          قم برفع صور واقعية للمنتجات وتحديث العناوين التوضيحية للمعرض
        </p>
      </div>

      {/* Grid of Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Form Settings (Texts & Uploader) */}
        <div className="space-y-8 lg:col-span-1">
          
          {/* 1. Image Upload Card */}
          <div className="bg-[#18080c] border border-romantic-border/40 p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Upload className="w-4 h-4 text-romantic-rosegold" />
              <span>رفع صورة جديدة</span>
            </h3>
            
            <form onSubmit={handleUpload} className="space-y-4">
              {uploadErrorMsg && (
                <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-xl text-red-200 text-xs">
                  {uploadErrorMsg}
                </div>
              )}
              {uploadSuccessMsg && (
                <div className="bg-emerald-950/30 border border-emerald-500/50 p-3 rounded-xl text-emerald-200 text-xs">
                  {uploadSuccessMsg}
                </div>
              )}

              <div className="border-2 border-dashed border-romantic-border hover:border-romantic-rosegold/50 rounded-xl p-4 text-center cursor-pointer transition-colors relative">
                <input
                  type="file"
                  id="galleryFileInput"
                  accept="image/*"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={uploadLoading}
                />
                <FileImage className="w-8 h-8 text-romantic-rosegold/60 mx-auto mb-2" />
                <p className="text-xs text-romantic-pink/70">
                  {uploadFile ? uploadFile.name : 'اضغط لاختيار صورة، أو اسحبها هنا'}
                </p>
              </div>

              <button
                type="submit"
                disabled={!uploadFile || uploadLoading}
                className="w-full bg-romantic-burgundy hover:bg-romantic-lightburgundy text-white font-bold py-2.5 px-4 rounded-xl text-sm border border-romantic-rosegold/30 hover:border-romantic-rosegold/60 flex items-center justify-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <span>{uploadLoading ? 'جاري رفع الصورة...' : 'بدء الرفع'}</span>
              </button>
            </form>
          </div>

          {/* 2. Gallery Texts Card */}
          <div className="bg-[#18080c] border border-romantic-border/40 p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Save className="w-4 h-4 text-romantic-rosegold" />
              <span>نصوص المعرض</span>
            </h3>

            <form onSubmit={handleSaveTexts} className="space-y-4">
              {textErrorMsg && (
                <div className="bg-red-900/30 border border-red-500/50 p-3 rounded-xl text-red-200 text-xs">
                  {textErrorMsg}
                </div>
              )}
              {textSuccessMsg && (
                <div className="bg-emerald-950/30 border border-emerald-500/50 p-3 rounded-xl text-emerald-200 text-xs">
                  {textSuccessMsg}
                </div>
              )}

              {/* Text Above */}
              <div>
                <label className="block text-xs font-semibold text-romantic-pink/70 mb-1.5">
                  النص أعلى المعرض
                </label>
                <textarea
                  rows={3}
                  value={textAbove}
                  onChange={(e) => setTextAbove(e.target.value)}
                  className="w-full bg-[#110508]/80 border border-romantic-border/50 focus:border-romantic-rosegold focus:outline-none text-white px-3 py-2 rounded-xl text-xs leading-relaxed"
                />
              </div>

              {/* Text Below */}
              <div>
                <label className="block text-xs font-semibold text-romantic-pink/70 mb-1.5">
                  النص أسفل المعرض
                </label>
                <textarea
                  rows={3}
                  value={textBelow}
                  onChange={(e) => setTextBelow(e.target.value)}
                  className="w-full bg-[#110508]/80 border border-romantic-border/50 focus:border-romantic-rosegold focus:outline-none text-white px-3 py-2 rounded-xl text-xs leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={textLoading}
                className="w-full bg-romantic-burgundy hover:bg-romantic-lightburgundy text-white font-bold py-2.5 px-4 rounded-xl text-sm border border-romantic-rosegold/30 flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
              >
                <span>{textLoading ? 'جاري الحفظ...' : 'حفظ النصوص'}</span>
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Existing Gallery Grid (2/3 width) */}
        <div className="lg:col-span-2 bg-[#18080c] border border-romantic-border/40 p-6 rounded-2xl space-y-4">
          <h3 className="font-bold text-base text-white">معرض الصور الحالي ({images.length})</h3>
          
          {images.length === 0 ? (
            <div className="text-center py-16 text-romantic-pink/40 text-sm">
              لا توجد صور في المعرض حالياً.
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((img) => (
                <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-romantic-border group shadow-sm bg-black">
                  <img
                    src={img.image_url}
                    alt="صورة في المعرض"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  {/* Delete overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <button
                      onClick={() => handleDelete(img.id, img.image_url)}
                      disabled={deleteId === img.id}
                      className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-full border border-red-500 shadow-md transition-colors"
                      title="حذف الصورة"
                    >
                      <Trash2 className="w-5 h-5" />
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
