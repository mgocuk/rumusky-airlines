import React from 'react';
import { useApp } from '../../context/AppContext';
import { FlightSearchCard } from './FlightSearchCard';
import { Plane, Compass, Sparkles } from 'lucide-react';

export const Hero: React.FC = () => {
  const { t } = useApp();

  return (
    <section className="relative bg-brand-navy pt-12 pb-32 lg:pb-36 overflow-hidden">
      {/* Background Aircraft Imagery & Soft Clouds Gradient */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-30 mix-blend-luminosity scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=2000&q=80')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-navy/90 via-brand-navy/80 to-brand-bg" />

      {/* Hero Content */}
      <div className="relative max-w-[1240px] w-full mx-auto px-4 sm:px-6 text-center z-10">
        
        {/* Subtle Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-sky-200 text-xs font-semibold mb-6 animate-fade-in shadow-xs">
          <Plane className="w-3.5 h-3.5 text-brand-cyan" />
          <span>RUMUSKY AIRLINES — Gökyüzündeki Güvenli Eviniz</span>
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white font-heading tracking-tight max-w-4xl mx-auto leading-tight">
          {t('hero_title')}
        </h1>

        {/* Subtitle */}
        <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-normal leading-relaxed">
          {t('hero_subtitle')}
        </p>

        {/* Overlapping Flight Search Card Container */}
        <div className="mt-10 max-w-5xl mx-auto relative z-20">
          <FlightSearchCard />
        </div>
      </div>
    </section>
  );
};
