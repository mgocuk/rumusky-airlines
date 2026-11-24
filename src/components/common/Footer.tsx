import React from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { CentralAsianBorder } from './CentralAsianMotif';
import { ShieldCheck, Apple, Play } from 'lucide-react';
import { INITIAL_SITE_CONTENT } from '../../data/seedContent';

export const Footer: React.FC = () => {
  const {
    setActiveView,
    siteContent,
    language,
    infoPages,
    setSelectedInfoPage,
    setAuthModalOpen,
    activeUser
  } = useApp();

  const footer = siteContent.footer || INITIAL_SITE_CONTENT.footer;

  const desc = language === 'en' ? (footer.descEn || siteContent.footerDescEn) : (footer.desc || siteContent.footerDesc);
  const safetyBadge = language === 'en' ? footer.safetyBadgeEn : footer.safetyBadge;
  const col1Title = language === 'en' ? footer.col1TitleEn : footer.col1Title;
  const col2Title = language === 'en' ? footer.col2TitleEn : footer.col2Title;
  const col3Title = language === 'en' ? footer.col3TitleEn : footer.col3Title;
  const copyright = language === 'en' ? footer.copyrightEn : footer.copyright;

  const corporatePages = infoPages.filter((p) => p.category === 'rumusky');
  const travelPages = infoPages.filter((p) => p.category === 'travel_info');
  const helpPages = infoPages.filter((p) => p.category === 'help_support');
  const legalPages = infoPages.filter((p) => p.category === 'legal');

  return (
    <footer className="bg-[#F2E9D8] bg-central-asian-lattice text-brand-text border-t border-brand-gold/40 mt-auto">
      <CentralAsianBorder opacity={0.65} />

      <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 pt-14 pb-10">
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 border-b border-brand-gold/30 items-start">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 flex flex-col gap-4 pr-2">
            <div onClick={() => setActiveView('home')} className="cursor-pointer inline-flex items-center">
              <Logo variant="full" size="md" />
            </div>

            <p className="text-sm text-brand-muted leading-relaxed max-w-sm">
              {desc}
            </p>

            <div className="flex items-center gap-2 text-xs text-brand-blue font-semibold">
              <ShieldCheck className="w-4 h-4 shrink-0 text-brand-gold" />
              <span>{safetyBadge}</span>
            </div>

            {/* Simulated App Badges */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/95 border border-brand-border text-brand-navy text-xs select-none shadow-2xs">
                <Apple className="w-4 h-4 text-brand-navy" />
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-brand-muted leading-tight">İndirin</span>
                  <span className="font-semibold leading-tight">App Store</span>
                </div>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/95 border border-brand-border text-brand-navy text-xs select-none shadow-2xs">
                <Play className="w-4 h-4 text-brand-blue fill-brand-blue" />
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-brand-muted leading-tight">Edinin</span>
                  <span className="font-semibold leading-tight">Google Play</span>
                </div>
              </div>
            </div>
          </div>

          {/* Links Column 1: ALPHA AIRLINE */}
          <div>
            <h4 className="text-brand-navy text-sm font-bold tracking-wider uppercase mb-4 font-heading">
              {col1Title}
            </h4>
            <ul className="space-y-2.5 text-sm text-brand-muted">
              {corporatePages.map((page) => (
                <li key={page.id}>
                  <button
                    onClick={() => setSelectedInfoPage(page)}
                    className="hover:text-brand-navy transition-colors text-left group flex items-center gap-2 font-medium"
                  >
                    <span className="w-1.5 h-1.5 rotate-45 bg-brand-gold/60 group-hover:bg-brand-gold transition-colors shrink-0"></span>
                    <span>{language === 'en' ? page.menuLabelEn : page.menuLabel}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 2: SEYAHAT BİLGİLERİ */}
          <div>
            <h4 className="text-brand-navy text-sm font-bold tracking-wider uppercase mb-4 font-heading">
              {col2Title}
            </h4>
            <ul className="space-y-2.5 text-sm text-brand-muted">
              {travelPages.map((page) => (
                <li key={page.id}>
                  <button
                    onClick={() => setSelectedInfoPage(page)}
                    className="hover:text-brand-navy transition-colors text-left group flex items-center gap-2 font-medium"
                  >
                    <span className="w-1.5 h-1.5 rotate-45 bg-brand-gold/60 group-hover:bg-brand-gold transition-colors shrink-0"></span>
                    <span>{language === 'en' ? page.menuLabelEn : page.menuLabel}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Links Column 3: YARDIM & DESTEK */}
          <div>
            <h4 className="text-brand-navy text-sm font-bold tracking-wider uppercase mb-4 font-heading">
              {col3Title}
            </h4>
            <ul className="space-y-2.5 text-sm text-brand-muted">
              {helpPages.map((page) => (
                <li key={page.id}>
                  <button
                    onClick={() => setSelectedInfoPage(page)}
                    className="hover:text-brand-navy transition-colors text-left group flex items-center gap-2 font-medium"
                  >
                    <span className="w-1.5 h-1.5 rotate-45 bg-brand-gold/60 group-hover:bg-brand-gold transition-colors shrink-0"></span>
                    <span>{language === 'en' ? page.menuLabelEn : page.menuLabel}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Legal Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-brand-muted">
          <div className="font-medium">{copyright}</div>
          <div className="flex flex-wrap items-center gap-5 sm:gap-6">
            {legalPages.map((page) => (
              <button
                key={page.id}
                onClick={() => setSelectedInfoPage(page)}
                className="hover:text-brand-navy transition-colors cursor-pointer text-left font-semibold"
              >
                {language === 'en' ? page.menuLabelEn : page.menuLabel}
              </button>
            ))}
            {!activeUser && (
              <button
                onClick={() => setAuthModalOpen(true)}
                title="Yetkili Personel Girişi (Kısayol: Alt + A)"
                className="hover:text-brand-navy transition-colors cursor-pointer text-left font-semibold opacity-75 hover:opacity-100"
              >
                {language === 'en' ? 'Staff Portal' : 'Personel Portalı'}
              </button>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
