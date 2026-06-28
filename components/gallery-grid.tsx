'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

interface GalleryItem {
  id: string;
  image_url: string;
}

interface GalleryGridProps {
  images: GalleryItem[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (images.length === 0) {
    return (
      <div className="text-center text-romantic-pink/50 py-12 border border-dashed border-romantic-border/40 rounded-2xl">
        سيتم إضافة صور واقعية قريباً 📸
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Photo Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
        {images.map((item) => (
          <div
            key={item.id}
            onClick={() => setSelectedImage(item.image_url)}
            className="aspect-square relative overflow-hidden rounded-2xl border border-romantic-border/40 cursor-pointer group shadow-md"
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
              <span className="text-sm font-semibold text-white bg-romantic-burgundy/80 px-3 py-1.5 rounded-full border border-romantic-rosegold/30 shadow-lg scale-90 group-hover:scale-100 transition-transform duration-300">
                تكبير الصورة 🔍
              </span>
            </div>
            
            {/* Image */}
            <img
              src={item.image_url}
              alt="لقطة واقعية لرسائل الحب"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4 transition-all duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 text-white hover:text-romantic-rosegold p-2 focus:outline-none bg-romantic-card/80 border border-romantic-border/60 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div 
            className="max-w-4xl max-h-[85vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt="معاينة الصورة"
              className="max-w-full max-h-[85vh] object-contain rounded-xl border border-romantic-border/30 shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
