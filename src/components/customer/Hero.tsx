import React from 'react';
import { useApp } from '../../context/AppContext';
import { FlightSearchCard } from './FlightSearchCard';
import { CentralAsianCorner, CentralAsianDivider } from '../common/CentralAsianMotif';
import { Plane } from 'lucide-react';

export const Hero: React.FC = () => {
  const { siteContent, language } = useApp();

  const title = language === 'en' ? siteContent.heroTitleEn : siteContent.heroTitle;
  const subtitle = language === 'en' ? siteContent.heroSubtitleEn : siteContent.heroSubtitle;
  const badge = language === 'en' ? siteContent.heroBadgeTextEn : siteContent.heroBadgeText;

  const overlayOpacity = siteContent.heroOverlayOpacity !== undefined ? siteContent.heroOverlayOpacity : 18;

  return (
    <section className="relative bg-central-asian-lattice pt-8 sm:pt-12 pb-20 sm:pb-28 lg:pb-32 overflow-hidden border-b border-brand-border/70">
      {/* Subtle sunlit sky background photography blended cleanly into warm light ivory */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out scale-[1.01] opacity-30"
        style={{
          backgroundImage: `url('${siteContent.heroBackgroundUrl}')`
        }}
      />
      {/* Airy sunlit pearl/ivory gradient veil (keeps typography bright, luminous, zero suffocating darkness) */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-[#FFFDF9]/90 via-[#FAF6EE]/75 to-brand-bg transition-opacity duration-500 pointer-events-none"
        style={{ opacity: Math.min(1, 0.72 + overlayOpacity / 250) }}
      />

      {/* Central Asian Decorative Corner Filigree Accents */}
      <CentralAsianCorner position="tl" className="absolute top-3 left-3 sm:top-5 sm:left-5 w-14 h-14 sm:w-20 sm:h-20 opacity-75" />
      <CentralAsianCorner position="tr" className="absolute top-3 right-3 sm:top-5 sm:right-5 w-14 h-14 sm:w-20 sm:h-20 opacity-75" />

      {/* Top Announcement Ribbon */}
      {siteContent.announcementBanner.enabled && (
        <div className="relative z-20 max-w-[1240px] mx-auto px-4 mb-6">
          <div className="p-2 sm:p-2.5 rounded-full bg-white/90 backdrop-blur-md border border-brand-gold/45 text-brand-navy text-xs flex items-center justify-center gap-2 text-center animate-fade-in shadow-subtle">
            <span className="px-2.5 py-0.5 rounded-full bg-brand-gold text-white font-black text-[10px] uppercase tracking-wider">
              {siteContent.announcementBanner.badge}
            </span>
            <span className="font-semibold truncate max-w-xl text-brand-navy">
              {language === 'en' ? siteContent.announcementBanner.textEn : siteContent.announcementBanner.text}
            </span>
          </div>
        </div>
      )}

      {/* Hero Content */}
      <div className="relative max-w-[1240px] w-full mx-auto px-4 sm:px-6 text-center z-10">
        
        {/* Emblem + Heritage Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-brand-gold/50 text-brand-navy text-xs font-bold mb-4 sm:mb-5 animate-fade-in shadow-subtle">
          <img
            src="/logos/alpha-airline-logo.png"
            alt="Alpha Airline Crest"
            className="w-5 h-5 rounded-full object-cover border border-brand-gold/60"
          />
          <Plane className="w-3.5 h-3.5 text-brand-gold" />
          <span className="text-brand-navy tracking-wide">{badge}</span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black text-brand-navy font-heading tracking-tight max-w-4xl mx-auto leading-tight">
          {title}
        </h1>

        <CentralAsianDivider className="max-w-xs mx-auto my-3 sm:my-4" />

        {/* Subtitle */}
        <p className="mt-2 sm:mt-3 text-sm sm:text-lg text-brand-muted max-w-2xl mx-auto font-medium leading-relaxed">
          {subtitle}
        </p>

        {/* Overlapping Flight Search Card Container */}
        <div className="mt-8 sm:mt-10 max-w-5xl mx-auto relative z-20">
          <FlightSearchCard />
        </div>
      </div>
    </section>
  );
};
