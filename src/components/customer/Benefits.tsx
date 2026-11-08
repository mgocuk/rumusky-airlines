import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Armchair, Tag, Headphones, Award, Star, Heart, CheckCircle2 } from 'lucide-react';

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
              className="flex items-center gap-3.5 sm:gap-4 p-4 rounded-2xl bg-white border border-brand-border/80 shadow-subtle hover:border-brand-blue/40 transition-all duration-200 group"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-blue-50/80 flex items-center justify-center flex-shrink-0 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors duration-200">
                <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
              </div>
              <div className="overflow-hidden">
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
