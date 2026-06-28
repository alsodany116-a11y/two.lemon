'use client';

import { useState, useRef, useEffect } from 'react';

interface GalleryItem {
  id: string;
  image_url: string;
}

interface GalleryGridProps {
  images: GalleryItem[];
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const currentTranslate = useRef(0);
  const animationRef = useRef<number | null>(null);

  // Auto rotate timer
  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      if (!isDragging) {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }
    }, 4500);
    return () => clearInterval(interval);
  }, [images.length, isDragging]);

  if (images.length === 0) {
    return (
      <div className="text-center text-romantic-pink/50 py-12 border border-dashed border-romantic-border/40 rounded-2xl">
        سيتم إضافة صور واقعية قريباً 📸
      </div>
    );
  }

  // Pointer events handlers
  const handleStart = (clientX: number) => {
    setIsDragging(true);
    startX.current = clientX;
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    const currentX = clientX;
    const diff = currentX - startX.current;
    currentTranslate.current = diff;
  };

  const handleEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const movedBy = currentTranslate.current;

    // Swipe sensitivity threshold (50px)
    if (movedBy < -50) {
      // Swipe Left (Next Image)
      setCurrentIndex((prev) => (prev + 1) % images.length);
    } else if (movedBy > 50) {
      // Swipe Right (Previous Image)
      setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    }
    
    currentTranslate.current = 0;
  };

  // Touch triggers
  const onTouchStart = (e: React.TouchEvent) => handleStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handleMove(e.touches[0].clientX);
  
  // Mouse triggers
  const onMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    handleStart(e.clientX);
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    handleMove(e.clientX);
  };

  return (
    <div className="relative w-full overflow-hidden py-16 flex flex-col items-center justify-center select-none">
      {/* 3D Perspective Wrapper */}
      <div 
        className="relative w-[280px] h-[480px] md:w-[320px] md:h-[550px] cursor-grab active:cursor-grabbing preserve-3d"
        style={{ perspective: '1000px' }}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={handleEnd}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={handleEnd}
        onMouseLeave={handleEnd}
      >
        {images.map((item, index) => {
          // Calculate relative position index in 3D circle
          let offset = index - currentIndex;
          
          // Wrap around correctly
          if (offset < -images.length / 2) offset += images.length;
          if (offset > images.length / 2) offset -= images.length;

          const isCenter = index === currentIndex;
          const absOffset = Math.abs(offset);
          
          // 3D Math for sphere/cylinder wrapping
          const rotateY = offset * 45; // angle gap between images
          const translateZ = isCenter ? 30 : -120 - (absOffset * 40); // center is closest, others push back
          const translateX = offset * 110; // spread horizontally
          const opacity = isCenter ? 1 : Math.max(0.2, 0.9 - absOffset * 0.3);
          const zIndex = 100 - absOffset;
          const scale = isCenter ? 1 : 0.82;

          return (
            <div
              key={item.id}
              className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden border border-romantic-rosegold/30 shadow-2xl transition-all duration-700 ease-out pointer-events-none"
              style={{
                transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                opacity: opacity,
                zIndex: zIndex,
                boxShadow: isCenter ? '0 25px 50px -12px rgba(201, 116, 138, 0.4)' : 'none',
              }}
            >
              {/* Premium Phone aspect frame container */}
              <div className="relative w-full h-full bg-[#110508]">
                <img
                  src={item.image_url}
                  alt="لقطة واقعية لرسائل الحب"
                  className="w-full h-full object-cover"
                  draggable={false}
                />
                {/* Overlay highlight */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Swipe hints */}
      <div className="mt-8 text-center text-xs text-romantic-pink/50 pointer-events-none">
        <span>اسحب لليمين أو اليسار لاستعراض الصور ↔️</span>
      </div>

      {/* Slide Indicators */}
      <div className="flex justify-center gap-1.5 mt-5">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'w-6 bg-romantic-rosegold' 
                : 'w-2 bg-romantic-pink/30 hover:bg-romantic-pink/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
