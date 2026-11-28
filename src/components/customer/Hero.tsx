import React from 'react';
import { useApp } from '../../context/AppContext';
import { FlightSearchCard } from './FlightSearchCard';
import { CentralAsianCorner, CentralAsianDivider, SamrukCrest } from '../common/CentralAsianMotif';
import { Plane } from 'lucide-react';

export const Hero: React.FC = () => {
  const { siteContent, language } = useApp();

  const title = language === 'en' ? siteContent.heroTitleEn : siteContent.heroTitle;
  const subtitle = language === 'en' ? siteContent.heroSubtitleEn : siteContent.heroSubtitle;
  const badge = language === 'en' ? siteContent.heroBadgeTextEn : siteContent.heroBadgeText;

  const overlayOpacity = siteContent.heroOverlayOpacity !== undefined ? siteContent.heroOverlayOpacity : 18;

  return (
    <section className="relative bg-central-asian-lattice pt-8 sm:pt-12 pb-20 sm:pb-28 lg:pb-32 overflow-hidden border-b border-brand-gold/40">
      {/* Subtle sunlit sky background photography blended cleanly into warm light ivory */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out scale-[1.01] opacity-30"
        style={{
          backgroundImage: `url('${siteContent.heroBackgroundUrl}')`
        }}
      />
      {/* Airy sunlit pearl/ivory gradient veil */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9]/90 via-[#FAF6EE]/75 to-brand-bg transition-opacity duration-500 pointer-events-none"
        style={{ opacity: Math.min(1, 0.72 + overlayOpacity / 250) }}
      />

      {/* Inner Golden Frame Border */}
      <div className="pointer-events-none absolute inset-3 sm:inset-5 border border-brand-gold/25 rounded-2xl z-10" />

      {/* 4-Corner Samruk Wing & Ulama Filigree Accents */}
      <CentralAsianCorner position="tl" className="absolute top-3 left-3 sm:top-5 sm:left-5 w-14 h-14 sm:w-20 sm:h-20 opacity-80 z-10" />
      <CentralAsianCorner position="tr" className="absolute top-3 right-3 sm:top-5 sm:right-5 w-14 h-14 sm:w-20 sm:h-20 opacity-80 z-10" />
      <CentralAsianCorner position="bl" className="absolute bottom-3 left-3 sm:bottom-5 sm:left-5 w-14 h-14 sm:w-20 sm:h-20 opacity-80 z-10" />
      <CentralAsianCorner position="br" className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 w-14 h-14 sm:w-20 sm:h-20 opacity-80 z-10" />

      {/* Subtle Samruk Crest Watermark behind Headline */}
      <div className="pointer-events-none absolute inset-x-0 top-12 sm:top-16 flex justify-center opacity-[0.07] z-0">
        <SamrukCrest className="w-[460px] sm:w-[560px] h-[240px] sm:h-[290px]" showArc />
      </div>

      {/* Top Announcement Ribbon */}
      {siteContent.announcementBanner.enabled && (
        <div className="relative z-20 max-w-[1240px] mx-auto px-4 mb-6">
          <div className="p-2 sm:p-2.5 rounded-full bg-white/95 backdrop-blur-md border border-brand-gold/55 ring-1 ring-brand-gold/20 text-brand-navy text-xs flex items-center justify-center gap-2.5 text-center animate-fade-in shadow-subtle">
            <svg viewBox="0 0 12 12" className="hidden sm:block w-2.5 h-2.5 text-brand-gold shrink-0" fill="currentColor" aria-hidden="true">
              <path d="M6 0.5 L7.1 4.4 L10.2 2.4 L8.1 5.3 L11.5 6 L8.1 6.7 L10.2 9.6 L7.1 7.6 L6 11.5 L4.9 7.6 L1.8 9.6 L3.9 6.7 L0.5 6 L3.9 5.3 L1.8 2.4 L4.9 4.4 Z" />
            </svg>
            <span className="px-3 py-0.5 rounded-full bg-[#071628] text-[#ECC97E] border border-[#C49238]/60 font-black text-[10px] uppercase tracking-wider shrink-0">
              {siteContent.announcementBanner.badge}
            </span>
            <span className="font-semibold truncate max-w-xl text-brand-navy">
              {language === 'en' ? siteContent.announcementBanner.textEn : siteContent.announcementBanner.text}
            </span>
            <svg viewBox="0 0 12 12" className="hidden sm:block w-2.5 h-2.5 text-brand-gold shrink-0" fill="currentColor" aria-hidden="true">
              <path d="M6 0.5 L7.1 4.4 L10.2 2.4 L8.1 5.3 L11.5 6 L8.1 6.7 L10.2 9.6 L7.1 7.6 L6 11.5 L4.9 7.6 L1.8 9.6 L3.9 6.7 L0.5 6 L3.9 5.3 L1.8 2.4 L4.9 4.4 Z" />
            </svg>
          </div>
        </div>
      )}

      {/* Hero Content */}
      <div className="relative max-w-[1240px] w-full mx-auto px-4 sm:px-6 text-center z-10">
        {/* Emblem + Heritage Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-brand-gold/55 ring-1 ring-brand-gold/20 text-brand-navy text-xs font-bold mb-4 sm:mb-5 animate-fade-in shadow-subtle">
          <div className="w-6 h-6 rounded-full bg-[#061322] border border-[#D8AE58]/80 p-0.5 flex items-center justify-center shrink-0 overflow-hidden">
            <img
              src="/logos/alpha-airline-logo.png"
              alt="Alpha Airline Crest"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          <SamrukCrest className="w-7 h-3.5 shrink-0" showArc={false} />
          <Plane className="w-3.5 h-3.5 text-brand-gold" />
          <span className="text-brand-navy tracking-wide">{badge}</span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black text-brand-navy font-heading tracking-tight max-w-4xl mx-auto leading-tight">
          {title}
        </h1>

        <CentralAsianDivider className="max-w-sm mx-auto my-3 sm:my-4" />

        {/* Subtitle */}
        <p className="mt-2 sm:mt-3 text-sm sm:text-lg text-brand-muted max-w-2xl mx-auto font-medium leading-relaxed">
          {subtitle}
        </p>

        {/* Overlapping Flight Search Card Container */}
        <div className="mt-10 sm:mt-12 max-w-5xl mx-auto relative z-20">
          <FlightSearchCard />
        </div>
      </div>
    </section>
  );
};
