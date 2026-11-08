import React from 'react';
import { useApp } from '../../context/AppContext';
import { FlightSearchCard } from './FlightSearchCard';
import { Plane, Bell, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const { siteContent, language } = useApp();

  const title = language === 'en' ? siteContent.heroTitleEn : siteContent.heroTitle;
  const subtitle = language === 'en' ? siteContent.heroSubtitleEn : siteContent.heroSubtitle;
  const badge = language === 'en' ? siteContent.heroBadgeTextEn : siteContent.heroBadgeText;

  const overlayOpacity = siteContent.heroOverlayOpacity !== undefined ? siteContent.heroOverlayOpacity : 25;

  return (
    <section className="relative bg-slate-900 pt-8 sm:pt-12 pb-24 sm:pb-32 lg:pb-36 overflow-hidden">
      {/* Dynamic Background Image - Airplane Soaring Above Clouds */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out scale-[1.02]"
        style={{
          backgroundImage: `url('${siteContent.heroBackgroundUrl}')`
        }}
      />
      {/* Adjustable Cinematic Overlay Gradient - Lets the aircraft and clouds pop out with vibrant clarity */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-900/20 to-slate-950/70 transition-opacity duration-500 pointer-events-none"
        style={{ opacity: overlayOpacity / 100 }}
      />
      {/* Subtle bottom edge blend into the page */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-brand-bg to-transparent pointer-events-none" />

      {/* Top Announcement Ribbon (if enabled by Super Admin) */}
      {siteContent.announcementBanner.enabled && (
        <div className="relative z-20 max-w-[1240px] mx-auto px-4 mb-6">
          <div className="p-2 sm:p-2.5 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/20 text-sky-200 text-xs flex items-center justify-center gap-2 text-center animate-fade-in shadow-lg">
            <span className="px-2 py-0.5 rounded-full bg-brand-cyan text-brand-navy font-black text-[10px] uppercase">
              {siteContent.announcementBanner.badge}
            </span>
            <span className="font-medium truncate max-w-xl text-white">
              {language === 'en' ? siteContent.announcementBanner.textEn : siteContent.announcementBanner.text}
            </span>
          </div>
        </div>
      )}

      {/* Hero Content */}
      <div className="relative max-w-[1240px] w-full mx-auto px-4 sm:px-6 text-center z-10">
        
        {/* Subtle Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/40 backdrop-blur-md border border-white/20 text-sky-200 text-xs font-semibold mb-4 sm:mb-6 animate-fade-in shadow-md">
          <Plane className="w-3.5 h-3.5 text-brand-cyan" />
          <span className="text-white drop-shadow-xs">{badge}</span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-4xl lg:text-6xl font-black text-white font-heading tracking-tight max-w-4xl mx-auto leading-tight drop-shadow-lg">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-slate-100 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
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
