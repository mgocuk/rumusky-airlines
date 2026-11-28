import React from 'react';
import { useApp } from '../../context/AppContext';
import { CentralAsianCorner } from '../common/CentralAsianMotif';
import { ShieldCheck, Armchair, Tag, Headphones, Award, Star, Heart } from 'lucide-react';

export const Benefits: React.FC = () => {
  const { siteContent, language } = useApp();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Armchair': return Armchair;
      case 'Tag': return Tag;
      case 'Headphones': return Headphones;
      case 'Award': return Award;
      case 'Star': return Star;
      case 'Heart': return Heart;
      default: return ShieldCheck;
    }
  };

  return (
    <section className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {siteContent.benefits.map((b) => {
          const IconComponent = getIcon(b.icon);
          const title = language === 'en' ? b.titleEn : b.title;
          const desc = language === 'en' ? b.descEn : b.desc;

          return (
            <div
              key={b.id}
              className="relative overflow-hidden flex items-center gap-3.5 sm:gap-4 p-4 rounded-2xl bg-white border border-[#D8C7A4] shadow-subtle hover:border-[#C49238]/80 transition-all duration-200 group"
            >
              {/* Üst kenar altın ışıltı çizgisi ve ince iç çerçeve */}
              <div className="pointer-events-none absolute top-0 inset-x-6 h-[2px] bg-gradient-to-r from-transparent via-[#E6C376]/80 to-transparent" />
              <div className="pointer-events-none absolute inset-1 rounded-xl border border-[#C49238]/20" />
              <CentralAsianCorner position="tl" className="absolute top-1 left-1 w-6 h-6 opacity-60" />
              <CentralAsianCorner position="br" className="absolute bottom-1 right-1 w-6 h-6 opacity-60" />

              <div className="relative z-10 w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#08182B] border border-[#D8AE58]/60 flex items-center justify-center flex-shrink-0 text-[#E6C376] group-hover:bg-[#1E5B70] group-hover:text-white transition-colors duration-200 shadow-xs">
                <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
              </div>
              <div className="relative z-10 overflow-hidden">
                <h4 className="text-xs sm:text-sm font-bold text-brand-navy truncate">{title}</h4>
                <p className="text-[11px] sm:text-xs text-brand-muted mt-0.5 line-clamp-2 leading-snug">{desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
