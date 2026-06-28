'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  if (faqs.length === 0) {
    return (
      <div className="text-center text-romantic-pink/60 py-6">
        لا توجد أسئلة شائعة مضافة حالياً.
      </div>
    );
  }

  // Sort FAQs by sort_order
  const sortedFaqs = [...faqs].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {sortedFaqs.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div
            key={faq.id}
            className="romantic-glass rounded-xl overflow-hidden transition-all duration-300 hover:border-romantic-rosegold/30"
          >
            <button
              onClick={() => toggleFaq(faq.id)}
              className="w-full flex items-center justify-between p-5 text-right font-medium text-white focus:outline-none"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="w-5 h-5 text-romantic-rosegold shrink-0" />
                <span className="text-base md:text-lg font-semibold">{faq.question}</span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-romantic-pink/60 transition-transform duration-300 shrink-0 ${
                  isOpen ? 'rotate-180 text-romantic-rosegold' : ''
                }`}
              />
            </button>
            <div
              className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isOpen ? 'max-h-96 opacity-100 border-t border-romantic-border/30' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-5 text-sm md:text-base text-romantic-pink/80 leading-relaxed bg-[#0c0507]/40">
                {faq.answer}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
