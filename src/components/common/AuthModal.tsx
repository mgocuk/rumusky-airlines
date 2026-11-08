import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, Mail, Shield, ArrowRight, AlertCircle } from 'lucide-react';
import { Logo } from './Logo';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, loginStaff, language } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const result = loginStaff(email, password);
    if (!result.success) {
      setErrorMessage(result.message || (language === 'en' ? 'Unauthorized email or invalid credentials.' : 'Yetkisiz e-posta adresi veya geçersiz giriş bilgisi.'));
    }
  };

  const handleClose = () => {
    setEmail('');
    setPassword('');
    setErrorMessage('');
    setAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-brand-border relative">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded-xl transition-colors"
          title="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand & Security Header */}
        <div className="text-center mb-6">
          <Logo size="md" className="mx-auto mb-3" />
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-brand-navy text-brand-cyan mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>{language === 'en' ? 'Staff & Operations Portal' : 'Yetkili Personel Portalı'}</span>
          </div>
          <h3 className="text-xl font-heading font-extrabold text-brand-navy">
            {language === 'en' ? 'Admin & Staff Login' : 'Yetkili & Admin Girişi'}
          </h3>
          <p className="text-xs text-brand-muted mt-1.5 leading-relaxed">
            {language === 'en'
              ? 'Please enter your corporate email address. Your role and permissions will be automatically configured upon login.'
              : 'Lütfen kurumsal e-posta adresinizi giriniz. Sistem yetkileriniz girilen e-postaya göre otomatik olarak tanımlanacaktır.'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Quick Super Admin Sign In Pill */}
        <div className="mb-4 p-3 bg-blue-50/80 border border-blue-200/80 rounded-2xl flex items-center justify-between gap-3">
          <div className="text-left">
            <span className="text-xs font-bold text-brand-navy block">
              {language === 'en' ? 'Quick Super Admin Sign In' : 'Süper Admin Hızlı Giriş'}
            </span>
            <span className="text-[11px] text-brand-muted font-mono">admin@rumusky.com</span>
          </div>
          <button
            type="button"
            onClick={() => {
              loginStaff('admin@rumusky.com', 'admin123');
            }}
            className="px-3 py-1.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs shrink-0 flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5 text-brand-cyan" />
            <span>{language === 'en' ? 'Sign In' : 'Giriş Yap'}</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
              {language === 'en' ? 'Corporate Email' : 'Kurumsal E-Posta'}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder={language === 'en' ? 'name@rumusky.com' : 'ad.soyad@rumusky.com'}
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-brand-border text-xs font-semibold focus:border-brand-blue focus:outline-hidden pl-9 font-mono"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
              {language === 'en' ? 'Password' : 'Yetkili Parola'}
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-brand-border text-xs font-semibold focus:border-brand-blue focus:outline-hidden pl-9"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-navy hover:bg-slate-800 text-white rounded-xl text-xs font-heading font-extrabold shadow-md transition-all flex items-center justify-center gap-2 mt-2"
          >
            <span>{language === 'en' ? 'Enter Management Panel' : 'Yönetim Paneline Giriş Yap'}</span>
            <ArrowRight className="w-4 h-4 text-brand-cyan" />
          </button>
        </form>

        <div className="mt-5 pt-3 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400">
            {language === 'en'
              ? 'Passenger booking flow is public and requires no login.'
              : 'Yolcular için biletleme ve check-in adımları üyelik gerektirmeden herkese açıktır.'}
          </p>
        </div>

      </div>
    </div>
  );
};
