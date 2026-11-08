import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, Mail, User, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { Logo } from './Logo';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, loginUser, t, language } = useApp();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  if (!authModalOpen) return null;

  const handleQuickDemoLogin = () => {
    loginUser('mustafa.gocuk@rumusky.com', 'Mustafa Göçük');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginUser(email || 'yolcu@rumusky.com', name || 'Demo Yolcu');
  };

  return (
    <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-brand-border relative">
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <Logo size="md" className="mx-auto mb-2" />
          <h3 className="text-xl font-heading font-extrabold text-brand-navy mt-2">
            {tab === 'login' ? t('nav_login') : t('nav_register')}
          </h3>
          <p className="text-xs text-brand-muted mt-1">
            RUMUSKY SkyClub ile millerinizi ve uçuşlarınızı yönetin.
          </p>
        </div>

        {/* Quick Demo Login Pill for Academic Presentations */}
        <div className="mb-5 p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-center">
          <div className="text-[11px] font-bold text-brand-blue mb-2 flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4" />
            <span>Okul Sunumu İçin Tek Tıkla Giriş</span>
          </div>
          <button
            type="button"
            onClick={handleQuickDemoLogin}
            className="w-full py-2 bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <span>Demo Kullanıcı Olarak Giriş Yap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Switch Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-5">
          <button
            type="button"
            onClick={() => setTab('login')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tab === 'login' ? 'bg-white text-brand-blue shadow-xs' : 'text-slate-600'
            }`}
          >
            {t('nav_login')}
          </button>
          <button
            type="button"
            onClick={() => setTab('register')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              tab === 'register' ? 'bg-white text-brand-blue shadow-xs' : 'text-slate-600'
            }`}
          >
            {t('nav_register')}
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' && (
            <div>
              <label className="text-xs font-bold text-brand-muted uppercase block mb-1">
                Ad Soyad
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Ahmet Yılmaz"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-brand-bg rounded-xl border border-brand-border text-xs font-semibold focus:border-brand-blue focus:outline-hidden pl-9"
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-brand-muted uppercase block mb-1">
              E-Posta Adresi
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="ornek@rumusky.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-brand-bg rounded-xl border border-brand-border text-xs font-semibold focus:border-brand-blue focus:outline-hidden pl-9"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-brand-muted uppercase block mb-1">
              Parola
            </label>
            <div className="relative">
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-brand-bg rounded-xl border border-brand-border text-xs font-semibold focus:border-brand-blue focus:outline-hidden pl-9"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-navy hover:bg-slate-800 text-white rounded-xl text-xs font-heading font-bold shadow-md transition-all"
          >
            {tab === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}
          </button>
        </form>
      </div>
    </div>
  );
};
