import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, Mail, Shield, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Logo } from './Logo';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, loginStaff, language } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const clearFormState = () => {
    setEmail('');
    setPassword('');
    setShowPassword(false);
    setErrorMessage('');
  };

  useEffect(() => {
    if (authModalOpen) {
      clearFormState();
    }
  }, [authModalOpen]);

  const handleClose = () => {
    clearFormState();
    if (['#admin', '#staff', '#login'].includes(window.location.hash)) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setAuthModalOpen(false);
  };

  useEffect(() => {
    if (!authModalOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [authModalOpen]);

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const cleanEmail = email.trim();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMessage(
        language === 'en'
          ? 'Please enter a valid corporate email address.'
          : 'Lütfen geçerli bir kurumsal e-posta adresi giriniz.'
      );
      return;
    }
    const result = loginStaff(cleanEmail, password);
    if (!result.success) {
      setErrorMessage(
        result.message ||
          (language === 'en'
            ? 'Invalid email address or password.'
            : 'Yetkisiz e-posta adresi veya geçersiz parola.')
      );
    } else {
      clearFormState();
    }
  };

  return (
    <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-brand-border relative">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded-xl transition-colors"
          title={language === 'en' ? 'Close' : 'Kapat'}
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
              ? 'Please enter your authorized corporate email address and password to access the management panel.'
              : 'Yönetim paneline erişmek için yetkili kurumsal e-posta adresinizi ve parolanızı giriniz.'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
          <div>
            <label
              htmlFor="rumusky-staff-email"
              className="text-[11px] font-bold text-brand-muted uppercase block mb-1"
            >
              {language === 'en' ? 'Corporate Email' : 'Kurumsal E-Posta'}
            </label>
            <div className="relative">
              <input
                id="rumusky-staff-email"
                name="rumusky-staff-email"
                type="text"
                inputMode="email"
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={false}
                data-lpignore="true"
                data-1p-ignore="true"
                data-bwignore="true"
                data-form-type="other"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder=""
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-brand-border text-xs font-semibold focus:border-brand-blue focus:outline-hidden pl-9 font-mono"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label
              htmlFor="rumusky-staff-password"
              className="text-[11px] font-bold text-brand-muted uppercase block mb-1"
            >
              {language === 'en' ? 'Password' : 'Yetkili Parola'}
            </label>
            <div className="relative">
              <input
                id="rumusky-staff-password"
                name="rumusky-staff-password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                data-lpignore="true"
                data-1p-ignore="true"
                data-bwignore="true"
                data-form-type="other"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder=""
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-brand-border text-xs font-semibold focus:border-brand-blue focus:outline-hidden pl-9 pr-10"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2.5 top-2 p-1 text-slate-400 hover:text-brand-navy rounded-lg transition-colors"
                aria-label={
                  showPassword
                    ? language === 'en'
                      ? 'Hide password'
                      : 'Parolayı gizle'
                    : language === 'en'
                    ? 'Show password'
                    : 'Parolayı göster'
                }
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
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
