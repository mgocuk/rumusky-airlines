import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  FileText,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  Calendar,
  ExternalLink,
  Edit,
  CheckCircle2
} from 'lucide-react';

export const InfoPageModal: React.FC = () => {
  const {
    selectedInfoPage,
    setSelectedInfoPage,
    language,
    setActiveView,
    isAdmin
  } = useApp();

  if (!selectedInfoPage) return null;

  const page = selectedInfoPage;
  const title = language === 'en' ? page.titleEn : page.title;
  const summary = language === 'en' ? page.summaryEn : page.summary;
  const content = language === 'en' ? page.contentEn : page.content;
  const badge = language === 'en' ? (page.badgeEn || page.badge) : (page.badge || 'Bilgilendirme');

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'rumusky':
        return language === 'en' ? 'About RUMUSKY' : 'RUMUSKY Kurumsal';
      case 'travel_info':
        return language === 'en' ? 'Travel Guidelines' : 'Seyahat Bilgileri';
      case 'help_support':
        return language === 'en' ? 'Help & Assistance' : 'Yardım & Destek';
      case 'legal':
        return language === 'en' ? 'Legal & Terms' : 'Yasal Bilgiler';
      default:
        return 'RUMUSKY';
    }
  };

  return (
    <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-brand-border max-h-[90vh] overflow-y-auto relative flex flex-col justify-between">
        
        {/* Top Header */}
        <div>
          <button
            onClick={() => setSelectedInfoPage(null)}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-brand-navy hover:bg-slate-100 transition-colors"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Category & Badge */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              <span>{getCategoryLabel(page.category)}</span>
            </span>

            {badge && (
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                {badge}
              </span>
            )}

            {page.lastUpdated && (
              <span className="text-[11px] text-brand-muted flex items-center gap-1 ml-auto mr-8 sm:mr-0">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{language === 'en' ? 'Updated:' : 'Son Güncelleme:'} {page.lastUpdated}</span>
              </span>
            )}
          </div>

          {/* Title & Summary */}
          <h2 className="text-xl sm:text-2xl font-black font-heading text-brand-navy leading-tight mb-2">
            {title}
          </h2>

          {summary && (
            <p className="text-xs sm:text-sm text-brand-muted font-medium leading-relaxed mb-6 pb-4 border-b border-slate-100">
              {summary}
            </p>
          )}

          {/* Main Content Body */}
          <div className="text-slate-700 text-xs sm:text-sm leading-relaxed space-y-4 whitespace-pre-line bg-slate-50/60 p-5 rounded-2xl border border-slate-100/80 font-normal">
            {content}
          </div>

          {/* Contact Fast Actions if contact info is present */}
          {(page.contactEmail || page.contactPhone) && (
            <div className="mt-5 p-4 rounded-2xl bg-blue-50/60 border border-blue-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-xs font-bold text-brand-navy">
                  {language === 'en' ? 'Need Direct Assistance?' : 'Doğrudan İletişime Geçin'}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {language === 'en' ? 'Our passenger experience desk is at your service 24/7.' : 'Müşteri deneyim masamız 7/24 hizmetinizdedir.'}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {page.contactPhone && (
                  <a
                    href={`tel:${page.contactPhone.replace(/\s+/g, '')}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white text-brand-navy border border-slate-200 text-xs font-bold hover:bg-slate-50 shadow-2xs transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-brand-blue" />
                    <span>{page.contactPhone}</span>
                  </a>
                )}
                {page.contactEmail && (
                  <a
                    href={`mailto:${page.contactEmail}`}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-blue-600 shadow-2xs transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{page.contactEmail}</span>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Action if check-in guide */}
          {page.slug === 'online-checkin-guide' && (
            <div className="mt-5 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span className="text-xs font-semibold text-emerald-900">
                  {language === 'en' ? 'Ready to check-in now?' : 'Uçuşunuz için hemen check-in yapmak ister misiniz?'}
                </span>
              </div>
              <button
                onClick={() => {
                  setSelectedInfoPage(null);
                  setActiveView('checkin');
                }}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shrink-0 shadow-2xs"
              >
                <span>{language === 'en' ? 'Go to Check-in' : 'Check-in Yap'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
          <div>
            {isAdmin && (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-blue bg-blue-50 px-2.5 py-1 rounded-lg">
                <Edit className="w-3.5 h-3.5" />
                <span>Yönetici Modu (Admin Panelinden Değiştirilebilir)</span>
              </span>
            )}
          </div>
          <button
            onClick={() => setSelectedInfoPage(null)}
            className="px-6 py-2.5 bg-brand-navy text-white text-xs font-bold rounded-xl shadow-xs hover:bg-slate-800 transition-colors"
          >
            {language === 'en' ? 'Close' : 'Kapat'}
          </button>
        </div>

      </div>
    </div>
  );
};
