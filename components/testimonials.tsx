'use client';

import { Star } from 'lucide-react';

interface TestimonialItem {
  id: string;
  name: string;
  stars: number;
  comment: string;
}

interface TestimonialsProps {
  testimonials: TestimonialItem[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  if (testimonials.length === 0) {
    return (
      <div className="text-center text-romantic-pink/60 py-6">
        لا توجد آراء عملاء مضافة حالياً.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
      {testimonials.map((item) => (
        <div
          key={item.id}
          className="romantic-glass p-6 rounded-2xl flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-romantic-rosegold/30 hover:shadow-lg hover:shadow-romantic-burgundy/10 group relative"
        >
          {/* Top Quote Icon */}
          <span className="text-6xl text-romantic-rosegold/10 absolute top-4 left-6 pointer-events-none select-none font-serif">
            ”
          </span>

          <div className="space-y-4">
            {/* Stars */}
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < item.stars
                      ? 'text-romantic-rosegold fill-romantic-rosegold'
                      : 'text-romantic-border fill-transparent'
                  }`}
                />
              ))}
            </div>

            {/* Comment */}
            <p className="text-romantic-pink/90 text-sm md:text-base leading-relaxed relative z-10">
              {item.comment}
            </p>
          </div>

          {/* Customer Name */}
          <div className="mt-6 pt-4 border-t border-romantic-border/30 flex items-center justify-between">
            <span className="font-semibold text-white group-hover:text-romantic-rosegold transition-colors">
              {item.name}
            </span>
            <span className="text-xs text-romantic-pink/50">عميل مؤكد ✅</span>
          </div>
        </div>
      ))}
    </div>
  );
}
