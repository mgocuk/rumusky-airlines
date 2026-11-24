import React from 'react';
import { useApp } from '../../context/AppContext';
import { CentralAsianDivider } from '../common/CentralAsianMotif';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';

export const NewsSection: React.FC = () => {
  const { news, language, setSelectedNewsArticle } = useApp();

  const activeNews = news.filter((n) => n.isActive);

  if (activeNews.length === 0) return null;

  return (
    <section className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-10">
      <CentralAsianDivider className="mb-8" />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-brand-goldLight border border-brand-gold/40 text-brand-navy mb-2">
            <Newspaper className="w-3.5 h-3.5 text-brand-gold" />
            <span>
              {language === 'en' ? 'Alpha Airline Press & News' : 'Alpha Airline Basın & Güncel Haberler'}
            </span>
          </div>
          <h3 className="text-xl sm:text-3xl font-extrabold text-brand-navy font-heading">
            {language === 'tr' ? 'Gökyüzünden Son Gelişmeler' : 'Latest Sky Updates & News'}
          </h3>
          <p className="text-xs sm:text-sm text-brand-muted mt-1">
            {language === 'tr'
              ? 'Filomuz, yeni destinasyonlarımız ve operasyonel duyurularımız.'
              : 'Our fleet additions, newly launched routes, and official statements.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {activeNews.slice(0, 3).map((item) => {
          const title = language === 'en' ? item.titleEn : item.title;
          const summary = language === 'en' ? item.summaryEn : item.summary;

          return (
            <div
              key={item.id}
              onClick={() => setSelectedNewsArticle(item)}
              className="group bg-white rounded-2xl overflow-hidden border border-brand-border shadow-subtle hover:shadow-elevated hover:border-brand-gold/70 transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-brand-ivory">
                  <img
                    src={item.imageUrl}
                    alt={title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-brand-navy border border-brand-gold/45 text-[10px] font-bold uppercase tracking-wider shadow-xs">
                    {item.category}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-center gap-1.5 text-[11px] text-brand-muted mb-2 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-brand-gold" />
                    <span>{new Date(item.publishedAt).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}</span>
                  </div>

                  <h4 className="font-heading font-extrabold text-base text-brand-navy group-hover:text-brand-blue transition-colors leading-snug line-clamp-2">
                    {title}
                  </h4>

                  <p className="text-xs text-brand-muted mt-2 line-clamp-3 leading-relaxed">
                    {summary}
                  </p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <span className="text-xs font-bold text-brand-blue group-hover:translate-x-1 inline-flex items-center gap-1 transition-transform">
                  <span>{language === 'tr' ? 'Devamını Oku' : 'Read Full Story'}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-gold" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
