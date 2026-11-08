import React from 'react';
import { useApp } from '../../context/AppContext';
import { ShieldCheck, Armchair, Tag, Headphones } from 'lucide-react';

export const Benefits: React.FC = () => {
  const { t } = useApp();

  const benefits = [
    {
      icon: ShieldCheck,
      title: t('benefit_safe_title'),
      desc: t('benefit_safe_desc')
    },
    {
      icon: Armchair,
      title: t('benefit_comfort_title'),
      desc: t('benefit_comfort_desc')
    },
    {
      icon: Tag,
      title: t('benefit_price_title'),
      desc: t('benefit_price_desc')
    },
    {
      icon: Headphones,
      title: t('benefit_support_title'),
      desc: t('benefit_support_desc')
    }
  ];

  return (
    <section className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {benefits.map((b, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 p-4 rounded-xl bg-white border border-brand-border/70 shadow-subtle hover:border-brand-blue/30 transition-all group"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50/80 flex items-center justify-center flex-shrink-0 text-brand-blue group-hover:bg-brand-blue group-hover:text-white transition-colors duration-200">
              <b.icon className="w-6 h-6 stroke-[1.75]" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-brand-navy">{b.title}</h4>
              <p className="text-xs text-brand-muted mt-0.5 leading-snug">{b.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
