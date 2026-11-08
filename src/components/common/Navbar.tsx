import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import {
  Globe,
  Shield,
  User as UserIcon,
  Menu,
  X,
  Search,
  Calendar,
  FileText,
  LogOut,
  ChevronDown,
  Newspaper
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
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

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
          className="group"
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

        {/* Right: TR/EN Selector, Admin Panel Toggle, Auth */}
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

          {/* Admin Switcher Pill */}
          <button
            onClick={toggleAdminMode}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isAdmin
                ? 'bg-brand-navy text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
            }`}
            title="Yönetici ve Müşteri Paneli Arasında Geçiş Yap"
          >
            <Shield className="w-3.5 h-3.5 text-brand-cyan" />
            <span>{isAdmin ? 'Yönetici Aktif' : 'Admin Paneli'}</span>
          </button>

          {/* User Account / Auth Dropdown */}
          {activeUser && !isAdmin ? (
            <div className="relative">
              <div
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-2 border-l border-brand-border cursor-pointer hover:opacity-90"
              >
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-brand-blue font-bold text-xs">
                  {activeUser.name.charAt(0)}
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-brand-navy leading-none">
                    {activeUser.name} {activeUser.surname}
                  </span>
                  <span className="text-[10px] text-brand-blue font-semibold leading-tight">
                    SkyClub Gold
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 top-11 w-48 bg-white rounded-xl shadow-elevated border border-brand-border p-2 z-50 animate-fade-in space-y-1 text-xs font-semibold">
                  <button
                    onClick={() => {
                      setActiveView('account');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-brand-navy hover:bg-blue-50 flex items-center gap-2"
                  >
                    <UserIcon className="w-4 h-4 text-brand-blue" />
                    <span>{t('nav_account')}</span>
                  </button>
                  <button
                    onClick={() => {
                      logoutUser();
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('nav_logout')}</span>
                  </button>
                </div>
              )}
            </div>
          ) : !isAdmin ? (
            <div className="flex items-center gap-2 pl-2 border-l border-brand-border">
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-3.5 py-1.5 text-xs font-bold text-brand-navy hover:text-brand-blue"
              >
                {t('nav_login')}
              </button>
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-3.5 py-1.5 rounded-lg bg-brand-blue text-white text-xs font-bold shadow-xs hover:bg-blue-600 transition-colors"
              >
                {t('nav_register')}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 pl-2 border-l border-brand-border">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-brand-cyan flex items-center justify-center font-bold text-xs">
                AD
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-brand-navy leading-none">
                  Süper Admin
                </span>
                <span className="text-[10px] text-brand-muted leading-tight">
                  Yetkili Personel
                </span>
              </div>
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
        <div className="md:hidden absolute top-[72px] left-0 w-full bg-white border-b border-brand-border p-4 shadow-xl flex flex-col gap-3 animate-fade-in z-50">
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

          <button
            onClick={() => {
              setActiveView('account');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-brand-navy hover:bg-slate-50 flex items-center gap-2.5"
          >
            <UserIcon className="w-4 h-4 text-brand-blue" />
            <span>{t('nav_account')}</span>
          </button>
          
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => {
                toggleAdminMode();
                setMobileMenuOpen(false);
              }}
              className="px-4 py-2 text-xs font-bold rounded-lg bg-brand-navy text-white flex items-center gap-2"
            >
              <Shield className="w-4 h-4 text-brand-cyan" />
              {isAdmin ? 'Müşteri Moduna Dön' : 'Yönetici Paneline Geç'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
