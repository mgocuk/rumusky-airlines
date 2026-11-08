import React from 'react';
import { useApp } from '../../context/AppContext';
import { FlightSearchCard } from './FlightSearchCard';
import { Plane, Bell, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const { siteContent, language } = useApp();

  const title = language === 'en' ? siteContent.heroTitleEn : siteContent.heroTitle;
  const subtitle = language === 'en' ? siteContent.heroSubtitleEn : siteContent.heroSubtitle;
  const badge = language === 'en' ? siteContent.heroBadgeTextEn : siteContent.heroBadgeText;

  return (
    <section className="relative bg-brand-navy pt-8 sm:pt-12 pb-24 sm:pb-32 lg:pb-36 overflow-hidden">
      {/* Dynamic Background Image - Airplane Soaring Above Clouds */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-700 ease-out"
        style={{
          backgroundImage: `url('${siteContent.heroBackgroundUrl}')`
        }}
      />
      {/* Semi-transparent layered gradient for crystal clear text readability while showcasing clouds & airplane */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-brand-navy/40 to-brand-bg" />

      {/* Top Announcement Ribbon (if enabled by Super Admin) */}
      {siteContent.announcementBanner.enabled && (
        <div className="relative z-20 max-w-[1240px] mx-auto px-4 mb-6">
          <div className="p-2 sm:p-2.5 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/30 text-sky-200 text-xs flex items-center justify-center gap-2 text-center animate-fade-in shadow-xs">
            <span className="px-2 py-0.5 rounded-full bg-brand-cyan text-brand-navy font-black text-[10px] uppercase">
              {siteContent.announcementBanner.badge}
            </span>
            <span className="font-medium truncate max-w-xl">
              {language === 'en' ? siteContent.announcementBanner.textEn : siteContent.announcementBanner.text}
            </span>
          </div>
        </div>
      )}

      {/* Hero Content */}
      <div className="relative max-w-[1240px] w-full mx-auto px-4 sm:px-6 text-center z-10">
        
        {/* Subtle Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-sky-200 text-xs font-semibold mb-4 sm:mb-6 animate-fade-in shadow-xs">
          <Plane className="w-3.5 h-3.5 text-brand-cyan" />
          <span>{badge}</span>
        </div>

        {/* Headline */}
        <h1 className="text-2xl sm:text-4xl lg:text-6xl font-extrabold text-white font-heading tracking-tight max-w-4xl mx-auto leading-tight">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="mt-3 sm:mt-4 text-sm sm:text-lg text-slate-200 max-w-2xl mx-auto font-normal leading-relaxed">
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
