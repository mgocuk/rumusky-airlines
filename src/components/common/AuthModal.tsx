import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, Mail, Shield, Sparkles, ArrowRight, CheckCircle2, UserCheck } from 'lucide-react';
import { Logo } from './Logo';

export const AuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, loginStaff, language } = useApp();
  const [email, setEmail] = useState('admin@rumusky.com');
  const [password, setPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState<'super_admin' | 'flight_manager' | 'booking_manager' | 'content_manager'>('super_admin');

  if (!authModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginStaff(email, selectedRole);
  };

  const staffPresets = [
    {
      role: 'super_admin' as const,
      title: 'Süper Admin (Tam Yetki)',
      titleEn: 'Super Admin (Full Access)',
      email: 'admin@rumusky.com',
      badge: 'Tüm Yetkiler Açık'
    },
    {
      role: 'flight_manager' as const,
      title: 'Uçuş Şefi & Operasyon',
      titleEn: 'Flight Ops Manager',
      email: 'ops@rumusky.com',
      badge: 'Sefer & Filo Yetkisi'
    },
    {
      role: 'booking_manager' as const,
      title: 'Rezervasyon & Bilet Sorumlusu',
      titleEn: 'Booking & Ticketing Lead',
      email: 'booking@rumusky.com',
      badge: 'Bilet İptal / İade'
    },
    {
      role: 'content_manager' as const,
      title: 'İçerik Editörü & Basın',
      titleEn: 'CMS & Press Editor',
      email: 'editor@rumusky.com',
      badge: 'CMS & Haber Yönetimi'
    }
  ];

  return (
    <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-brand-border relative">
        
        {/* Close Button */}
        <button
          onClick={() => setAuthModalOpen(false)}
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
            <span>{language === 'en' ? 'Authorized Staff Portal' : 'Yetkili Personel Girişi'}</span>
          </div>
          <h3 className="text-xl font-heading font-extrabold text-brand-navy">
            {language === 'en' ? 'Admin & Management Login' : 'Admin & Yönetici Giriş Paneli'}
          </h3>
          <p className="text-xs text-brand-muted mt-1.5 leading-relaxed">
            {language === 'en'
              ? 'This portal is restricted to authorized operations, flight dispatchers, and Super Admins. Passengers do not need an account to book flights.'
              : 'Bu ekran yalnızca RUMUSKY yetkili personeli ve Süper Admin girişi içindir. Yolcularımızın bilet satın alırken üye olmasına gerek yoktur.'}
          </p>
        </div>

        {/* One-Click Staff Role Selector for Presentation / Testing */}
        <div className="mb-5 space-y-2">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between">
            <span>{language === 'en' ? 'Quick Staff Credentials:' : 'Hızlı Giriş Rolü Seçin:'}</span>
            <span className="text-[10px] text-brand-blue font-semibold">Test için hazır</span>
          </div>

          <div className="grid grid-cols-1 gap-2">
            {staffPresets.map((preset) => {
              const isSelected = selectedRole === preset.role;
              return (
                <button
                  key={preset.role}
                  type="button"
                  onClick={() => {
                    setSelectedRole(preset.role);
                    setEmail(preset.email);
                  }}
                  className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-blue-50/80 border-brand-blue shadow-2xs'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                      isSelected ? 'bg-brand-blue text-white' : 'bg-slate-200 text-slate-600'
                    }`}>
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-brand-navy leading-tight">
                        {language === 'en' ? preset.titleEn : preset.title}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {preset.email}
                      </div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-brand-blue text-white' : 'bg-slate-200/60 text-slate-600'
                  }`}>
                    {preset.badge}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
              {language === 'en' ? 'Staff Email' : 'Yetkili E-Posta'}
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 rounded-xl border border-brand-border text-xs font-semibold focus:border-brand-blue focus:outline-hidden pl-9"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-navy hover:bg-slate-800 text-white rounded-xl text-xs font-heading font-extrabold shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{language === 'en' ? 'Enter Management Panel' : 'Yönetim Paneline Giriş Yap'}</span>
            <ArrowRight className="w-4 h-4 text-brand-cyan" />
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400">
            {language === 'en'
              ? 'Passengers can book flights and download tickets without registration.'
              : 'Yolcular doğrudan uçuş arayarak üyelik olmadan bilet alabilirler.'}
          </p>
        </div>

      </div>
    </div>
  );
};
