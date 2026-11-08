import React from 'react';
import { useApp } from '../../context/AppContext';
import { Campaign } from '../../types';
import { ArrowRight, Sparkles } from 'lucide-react';

export const Campaigns: React.FC = () => {
  const { campaigns, language, t, setSearchQuery } = useApp();

  const handleCampaignClick = (cmp: Campaign) => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 2);
    const dateStr = tomorrow.toISOString().split('T')[0];

    setSearchQuery({
      tripType: 'one-way',
      originIata: cmp.targetOrigin,
      destinationIata: cmp.targetDestination,
      departureDate: dateStr,
      adults: 1,
      children: 0,
      infants: 0,
      cabinClass: 'economy'
    });
  };

  return (
    <section className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-brand-navy font-heading">
            {t('campaigns_title')}
          </h3>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            {language === 'tr' ? 'Sezonun en avantajlı uçuş fırsatları' : 'The best seasonal airfare opportunities'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {campaigns.map((cmp) => {
          const title = language === 'en' ? cmp.titleEn : cmp.title;
          const subtitle = language === 'en' ? cmp.subtitleEn : cmp.subtitle;
          const badge = language === 'en' ? cmp.badgeTextEn : cmp.badgeText;
          const cta = language === 'en' ? cmp.ctaLabelEn : cmp.ctaLabel;

          return (
            <div
              key={cmp.id}
              onClick={() => handleCampaignClick(cmp)}
              className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-subtle hover:shadow-elevated transition-all duration-300 border border-slate-200/80 flex flex-col justify-end min-h-[260px] p-6 text-white"
            >
              {/* Dynamic Image with Smooth Overlay */}
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                style={{ backgroundImage: `url(${cmp.imageUrl})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/95 via-brand-navy/60 to-transparent" />

              {/* Content */}
              <div className="relative z-10 flex flex-col items-start gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-cyan text-brand-navy shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  {badge}
                </span>

                <h4 className="text-xl sm:text-2xl font-bold font-heading text-white group-hover:text-sky-200 transition-colors">
                  {title}
                </h4>

                <p className="text-xs sm:text-sm text-slate-200 line-clamp-2 leading-relaxed max-w-md">
                  {subtitle}
                </p>

                <div className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white group-hover:translate-x-1 transition-transform">
                  <span>{cta}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
