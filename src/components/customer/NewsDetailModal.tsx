import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, Share2, Newspaper } from 'lucide-react';

export const NewsDetailModal: React.FC = () => {
  const { selectedNewsArticle, setSelectedNewsArticle, language } = useApp();

  if (!selectedNewsArticle) return null;

  const item = selectedNewsArticle;
  const title = language === 'en' ? item.titleEn : item.title;
  const content = language === 'en' ? item.contentEn : item.content;

  return (
    <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-brand-border max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={() => setSelectedNewsArticle(null)}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-brand-navy hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category & Date */}
        <div className="flex items-center gap-3 mb-3">
          <span className="px-3 py-1 rounded-full bg-blue-50 text-brand-blue text-xs font-bold uppercase tracking-wider">
            {item.category}
          </span>
          <span className="text-xs text-brand-muted flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(item.publishedAt).toLocaleDateString(language === 'tr' ? 'tr-TR' : 'en-US')}</span>
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl sm:text-2xl font-black font-heading text-brand-navy leading-tight mb-4">
          {title}
        </h3>

        {/* Image */}
        <div className="rounded-2xl overflow-hidden mb-6 h-64 bg-slate-100">
          <img src={item.imageUrl} alt={title} className="w-full h-full object-cover" />
        </div>

        {/* Content */}
        <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed text-sm space-y-4">
          <p className="font-semibold text-slate-900 leading-relaxed">
            {language === 'en' ? item.summaryEn : item.summary}
          </p>
          <p className="leading-relaxed whitespace-pre-line">
            {content}
          </p>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => setSelectedNewsArticle(null)}
            className="px-6 py-2.5 bg-brand-navy text-white text-xs font-bold rounded-xl shadow-xs hover:bg-slate-800 transition-colors"
          >
            {language === 'tr' ? 'Kapat' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
