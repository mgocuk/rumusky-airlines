import React from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { ShieldCheck, Heart, Plane, Smartphone, Apple, Play } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, setActiveView } = useApp();

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
              {t('footer_company_desc')}
            </p>
            <div className="flex items-center gap-2 text-xs text-sky-400 font-medium">
              <ShieldCheck className="w-4 h-4" />
              <span>IATA & ICAO Standartlarında Güvenli Uçuş Operasyonları</span>
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

          {/* Links: About */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4 font-heading">
              {t('footer_about')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">{t('footer_about_us')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer_career')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer_press')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer_contact')}</a></li>
            </ul>
          </div>

          {/* Links: Travel Info */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4 font-heading">
              {t('footer_travel_info')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">{t('footer_baggage_rules')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer_online_checkin')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer_seat_selection')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer_special_services')}</a></li>
            </ul>
          </div>

          {/* Links: Support */}
          <div>
            <h4 className="text-white text-sm font-semibold tracking-wider uppercase mb-4 font-heading">
              {t('footer_help')}
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">{t('footer_faq')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer_support_center')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer_ticket_rules')}</a></li>
              <li><a href="#" className="hover:text-white transition-colors">{t('footer_cancel_refund')}</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>{t('footer_copyright')}</div>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Gizlilik Politikası</span>
            <span className="hover:text-slate-400 cursor-pointer">Kullanım Şartları</span>
            <span className="hover:text-slate-400 cursor-pointer">Çerez Bildirimi</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
