import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import {
  Shield,
  Menu,
  X,
  Search,
  Calendar,
  FileText,
  LogOut,
  Newspaper,
  UserCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    activeView,
    setActiveView,
    isAdmin,
    toggleAdminMode,
    activeUser,
    setAuthModalOpen,
    logoutUser
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { key: 'nav_search_flights', view: 'home', icon: Search },
    { key: 'nav_my_bookings', view: 'manage', icon: Calendar },
    { key: 'nav_checkin', view: 'checkin', icon: FileText },
    { key: 'nav_news', view: 'news', icon: Newspaper }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-border/60 shadow-xs h-[72px] flex items-center">
      <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 flex items-center justify-between">
        
        {/* Left: Brand Logo */}
        <div 
          onClick={() => {
            setActiveView('home');
            setMobileMenuOpen(false);
          }}
          className="group cursor-pointer"
        >
          <Logo />
        </div>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navItems.map((item) => {
            const isActive = activeView === item.view && !isAdmin;
            return (
              <button
                key={item.key}
                onClick={() => setActiveView(item.view as any)}
                className={`px-3.5 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'text-brand-blue bg-blue-50/80 font-semibold shadow-xs'
                    : 'text-brand-navy/80 hover:text-brand-navy hover:bg-slate-100/70'
                }`}
              >
                {t(item.key as any)}
              </button>
            );
          })}
          
          <button
            onClick={() => setActiveView('home')}
            className="px-3.5 py-2 rounded-full text-sm font-medium text-brand-navy/80 hover:text-brand-navy hover:bg-slate-100/70 transition-all"
          >
            {t('nav_travel_info')}
          </button>
          
          <button
            onClick={() => setActiveView('home')}
            className="px-3.5 py-2 rounded-full text-sm font-medium text-brand-navy/80 hover:text-brand-navy hover:bg-slate-100/70 transition-all flex items-center gap-1.5"
          >
            <span>{t('nav_about')}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span>
          </button>
        </nav>

        {/* Right: TR/EN Selector, Admin Access */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center bg-brand-bg rounded-lg p-1 border border-brand-border/60">
            <button
              onClick={() => setLanguage('tr')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                language === 'tr'
                  ? 'bg-white text-brand-blue shadow-xs'
                  : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              TR
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                language === 'en'
                  ? 'bg-white text-brand-blue shadow-xs'
                  : 'text-brand-muted hover:text-brand-text'
              }`}
            >
              EN
            </button>
          </div>

          {/* Admin / Staff State */}
          {activeUser && activeUser.role !== 'customer' ? (
            /* Logged in as Staff/Admin */
            <div className="flex items-center gap-2 pl-2 border-l border-brand-border">
              <button
                onClick={toggleAdminMode}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                  isAdmin
                    ? 'bg-brand-navy text-white ring-2 ring-brand-blue/30'
                    : 'bg-brand-blue text-white hover:bg-blue-600'
                }`}
                title="Yönetim Paneli ile Canlı Site Arasında Geçiş Yap"
              >
                <Shield className="w-3.5 h-3.5 text-brand-cyan" />
                <span>{isAdmin ? 'Yönetici Aktif' : 'Admin Paneli'}</span>
              </button>

              <div className="flex items-center gap-2 pl-1">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-brand-cyan flex items-center justify-center font-bold text-xs shadow-xs">
                  {activeUser.role === 'super_admin' ? 'SA' : 'OP'}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-brand-navy leading-none">
                    {activeUser.role === 'super_admin' ? 'Süper Admin' : activeUser.name}
                  </span>
                  <span className="text-[10px] text-brand-muted leading-tight">
                    Yetkili Personel
                  </span>
                </div>

                <button
                  onClick={logoutUser}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-1"
                  title="Yetkili Oturumunu Kapat"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Not logged in (Clean Guest State for Normal Passengers) */
            <div className="flex items-center gap-2 pl-2 border-l border-brand-border">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-navy text-xs font-bold flex items-center gap-1.5 border border-slate-200 shadow-2xs transition-all"
                title="Yalnızca Yetkili Personel ve Süper Admin Girişi"
              >
                <Shield className="w-3.5 h-3.5 text-brand-blue" />
                <span>Admin Girişi</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
            className="px-2 py-1 text-xs font-bold rounded bg-slate-100 text-brand-navy"
          >
            {language.toUpperCase()}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-brand-navy hover:bg-slate-100 rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-[72px] left-0 w-full bg-white border-b border-brand-border p-4 shadow-xl flex flex-col gap-2.5 animate-fade-in z-50">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                setActiveView(item.view as any);
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-brand-navy hover:bg-slate-50 flex items-center gap-2.5"
            >
              <item.icon className="w-4 h-4 text-brand-blue" />
              {t(item.key as any)}
            </button>
          ))}
          
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            {activeUser && activeUser.role !== 'customer' ? (
              <div className="w-full flex items-center justify-between">
                <button
                  onClick={() => {
                    toggleAdminMode();
                    setMobileMenuOpen(false);
                  }}
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-brand-navy text-white flex items-center gap-2 shadow-xs"
                >
                  <Shield className="w-4 h-4 text-brand-cyan" />
                  {isAdmin ? 'Müşteri Moduna Dön' : 'Yönetici Paneline Geç'}
                </button>
                <button
                  onClick={() => {
                    logoutUser();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg flex items-center gap-1.5"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Çıkış</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 text-xs font-bold rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-navy flex items-center justify-center gap-2 border border-slate-200"
              >
                <Shield className="w-4 h-4 text-brand-blue" />
                <span>Yetkili & Admin Girişi</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
