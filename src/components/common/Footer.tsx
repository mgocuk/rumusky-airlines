import React from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { ShieldCheck, Apple, Play } from 'lucide-react';
import { INITIAL_SITE_CONTENT } from '../../data/seedContent';

export const Footer: React.FC = () => {
  const {
    t,
    setActiveView,
    siteContent,
    language,
    infoPages,
    setSelectedInfoPage
  } = useApp();

  const footer = siteContent.footer || INITIAL_SITE_CONTENT.footer;

  const desc = language === 'en' ? (footer.descEn || siteContent.footerDescEn) : (footer.desc || siteContent.footerDesc);
  const safetyBadge = language === 'en' ? footer.safetyBadgeEn : footer.safetyBadge;
  const col1Title = language === 'en' ? footer.col1TitleEn : footer.col1Title;
  const col2Title = language === 'en' ? footer.col2TitleEn : footer.col2Title;
  const col3Title = language === 'en' ? footer.col3TitleEn : footer.col3Title;
  const copyright = language === 'en' ? footer.copyrightEn : footer.copyright;

  const rumuskyPages = infoPages.filter((p) => p.category === 'rumusky');
  const travelPages = infoPages.filter((p) => p.category === 'travel_info');
  const helpPages = infoPages.filter((p) => p.category === 'help_support');
  const legalPages = infoPages.filter((p) => p.category === 'legal');

  return (
    <footer className="bg-brand-navy text-slate-300 pt-16 pb-10 border-t border-slate-800 mt-auto">
      <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6">
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div onClick={() => setActiveView('home')} className="cursor-pointer">
              <Logo variant="white" size="lg" />
            </div>
            
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              {desc}
            </p>

            <div className="flex items-center gap-2 text-xs text-sky-400 font-medium">
              <ShieldCheck className="w-4 h-4 shrink-0 text-brand-cyan" />
              <span>{safetyBadge}</span>
            </div>

            {/* Simulated App Badges */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-white text-xs select-none">
                <Apple className="w-4 h-4 text-white" />
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-slate-400 leading-tight">İndirin</span>
                  <span className="font-semibold leading-tight">App Store</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-white text-xs select-none">
                <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-slate-400 leading-tight">Edinin</span>
                  <span className="font-semibold leading-tight">Google Play</span>
                </div>
              </div>
            </div>
          </div>

          {/* Links Column 1: RUMUSKY */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4 font-heading">
              {col1Title}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {rumuskyPages.map((page) => (
                <li key={page.id}>
                  <button
                    onClick={() => setSelectedInfoPage(page)}
                    className="hover:text-white transition-colors text-left group flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-brand-cyan transition-colors"></span>
                    <span>{language === 'en' ? page.menuLabelEn : page.menuLabel}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2: SEYAHAT BİLGİLERİ */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4 font-heading">
              {col2Title}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {travelPages.map((page) => (
                <li key={page.id}>
                  <button
                    onClick={() => setSelectedInfoPage(page)}
                    className="hover:text-white transition-colors text-left group flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-brand-cyan transition-colors"></span>
                    <span>{language === 'en' ? page.menuLabelEn : page.menuLabel}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 3: YARDIM & DESTEK */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4 font-heading">
              {col3Title}
            </h4>
            <ul className="space-y-2.5 text-sm">
              {helpPages.map((page) => (
                <li key={page.id}>
                  <button
                    onClick={() => setSelectedInfoPage(page)}
                    className="hover:text-white transition-colors text-left group flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-slate-600 group-hover:bg-brand-cyan transition-colors"></span>
                    <span>{language === 'en' ? page.menuLabelEn : page.menuLabel}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>{copyright}</div>
          <div className="flex flex-wrap items-center gap-5 sm:gap-6">
            {legalPages.map((page) => (
              <button
                key={page.id}
                onClick={() => setSelectedInfoPage(page)}
                className="hover:text-slate-300 transition-colors cursor-pointer text-left font-medium"
              >
                {language === 'en' ? page.menuLabelEn : page.menuLabel}
              </button>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
