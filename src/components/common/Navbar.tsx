import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from './Logo';
import { CentralAsianBorder, CentralAsianCorner, SamrukCrest } from './CentralAsianMotif';
import {
  Shield,
  Menu,
  X,
  Search,
  Calendar,
  FileText,
  LogOut,
  Newspaper,
  LogIn
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    activeView,
    setActiveView,
    isAdmin,
    toggleAdminMode,
    activeUser,
    setAuthModalOpen,
    logoutUser,
    siteContent
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navCfg = siteContent?.navbar || {
    companyName: siteContent?.companyName || 'Alpha Airline',
    companySubtitle: siteContent?.companySubtitle || 'FLY BEYOND BORDERS',
    customLogoUrl: siteContent?.customLogoUrl || '/logos/alpha-airline-logo.png',
    navSearchFlights: 'Uçuş Ara',
    navSearchFlightsEn: 'Search Flights',
    navMyBookings: 'Rezervasyonlarım',
    navMyBookingsEn: 'My Bookings',
    navCheckin: 'Online Check-in',
    navCheckinEn: 'Online Check-in',
    navNews: 'Haberler & Basın',
    navNewsEn: 'News & Media',
    navTravelInfo: 'Seyahat Bilgileri',
    navTravelInfoEn: 'Travel Information',
    navAbout: 'Alpha Airline',
    navAboutEn: 'Alpha Airline',
    navAdminButtonText: 'Admin Paneli',
    navAdminButtonTextEn: 'Admin Portal'
  };

  const labelSearch = language === 'en' ? (navCfg.navSearchFlightsEn || 'Search Flights') : (navCfg.navSearchFlights || 'Uçuş Ara');
  const labelBookings = language === 'en' ? (navCfg.navMyBookingsEn || 'My Bookings') : (navCfg.navMyBookings || 'Rezervasyonlarım');
  const labelCheckin = language === 'en' ? (navCfg.navCheckinEn || 'Online Check-in') : (navCfg.navCheckin || 'Online Check-in');
  const labelNews = language === 'en' ? (navCfg.navNewsEn || 'News & Media') : (navCfg.navNews || 'Haberler & Basın');
  const labelTravelInfo = language === 'en' ? (navCfg.navTravelInfoEn || 'Travel Information') : (navCfg.navTravelInfo || 'Seyahat Bilgileri');
  const labelAdminBtn = language === 'en' ? (navCfg.navAdminButtonTextEn || 'Admin Portal') : (navCfg.navAdminButtonText || 'Admin Paneli');

  const navItems = [
    { key: 'nav_search_flights', label: labelSearch, view: 'home', icon: Search },
    { key: 'nav_my_bookings', label: labelBookings, view: 'manage', icon: Calendar },
    { key: 'nav_checkin', label: labelCheckin, view: 'checkin', icon: FileText },
    { key: 'nav_news', label: labelNews, view: 'news', icon: Newspaper }
  ];

  const PolarStarIcon = () => (
    <svg viewBox="0 0 16 16" className="w-3 h-3 shrink-0 text-[#E6C376]" fill="currentColor" aria-hidden="true">
      <path d="M8 0.8 L9.4 5.8 L13.5 3.2 L10.7 7 L15.2 8 L10.7 9 L13.5 12.8 L9.4 10.2 L8 15.2 L6.6 10.2 L2.5 12.8 L5.3 9 L0.8 8 L5.3 7 L2.5 3.2 L6.6 5.8 Z" />
    </svg>
  );

  return (
    <header className="sticky top-0 z-40 bg-[#061322] shadow-[0_8px_28px_-6px_rgba(6,19,34,0.45)]">
      {/* Upper Samruk Heritage Strip */}
      <div className="hidden sm:block bg-[#040D18] border-b border-[#C49238]/25">
        <div className="max-w-[1320px] w-full mx-auto px-4 sm:px-6 h-7 flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-2 text-[#E8DFCE]/85 font-semibold tracking-[0.12em] uppercase">
            <SamrukCrest className="w-7 h-3.5 shrink-0" showArc={false} />
            <PolarStarIcon />
            <span>
              {language === 'en'
                ? 'HERITAGE OF SAMRUK • FLY BEYOND BORDERS ON THE WINGS OF THE SACRED STEPPE BIRD'
                : "SAMRUK MİRASI • ORTA ASYA'NIN KUTSAL GÖKYÜZÜ KUŞU İLE SINIRLARIN ÖTESİNE"}
            </span>
          </div>
          <div className="hidden lg:flex items-center gap-1.5 text-[#E6C376]/85 font-semibold tracking-[0.14em] uppercase">
            <span>ALMATI (ALA)</span>
            <span className="text-[#C49238]">✦</span>
            <span>İSTANBUL (IST/SAW)</span>
            <span className="text-[#C49238]">✦</span>
            <span>LONDRA</span>
            <span className="text-[#C49238]">✦</span>
            <span>TOKYO</span>
            <span className="text-[#C49238]">✦</span>
            <span>DUBAİ</span>
          </div>
        </div>
      </div>

      {/* Main Header Body: Deep Tengri Night Navy & Samruk Gold */}
      <div className="relative bg-gradient-to-r from-[#061322] via-[#0B1E35] to-[#061322] overflow-hidden">
        {/* Subtle Celestial Arc + Samruk Wings Watermark */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.09]">
          <SamrukCrest className="w-[380px] h-[140px]" showArc />
        </div>

        {/* Left & Right Corner Samruk Feather Borders */}
        <CentralAsianCorner position="tl" variant="light" className="hidden md:block absolute top-1 left-1 w-9 h-9 opacity-65" />
        <CentralAsianCorner position="tr" variant="light" className="hidden md:block absolute top-1 right-1 w-9 h-9 opacity-65" />

        <div className="relative z-10 max-w-[1320px] w-full mx-auto px-4 sm:px-6 h-[74px] flex items-center justify-between gap-2 xl:gap-3">
          {/* Left: Brand Logo */}
          <div
            onClick={() => {
              setActiveView('home');
              setMobileMenuOpen(false);
            }}
            className="group cursor-pointer shrink-0"
          >
            <Logo variant="white" />
          </div>

          {/* Center: Gold-Framed Capsule Rail Navigation */}
          <nav className="hidden md:flex items-center gap-0.5 min-[1360px]:gap-1 bg-[#071526]/85 border border-[#C49238]/30 rounded-full p-1 shadow-inner shrink-0">
            {navItems.map((item) => {
              const isActive = activeView === item.view && !isAdmin;
              return (
                <button
                  key={item.key}
                  onClick={() => setActiveView(item.view as any)}
                  className={`px-2.5 min-[1360px]:px-3.5 py-1.5 rounded-full text-xs min-[1360px]:text-[13px] font-medium transition-all duration-200 flex items-center gap-1.5 whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-b from-[#1A3855] to-[#0E2238] text-[#FFF9EB] border border-[#E6C376]/65 shadow-[0_2px_12px_rgba(196,146,56,0.2)] font-semibold'
                      : 'text-[#E8DFCE]/85 hover:text-white hover:bg-white/[0.07] border border-transparent'
                  }`}
                >
                  {isActive && <PolarStarIcon />}
                  <span>{item.label}</span>
                </button>
              );
            })}

            <button
              onClick={() => setActiveView('home')}
              className="px-2.5 min-[1360px]:px-3.5 py-1.5 rounded-full text-xs min-[1360px]:text-[13px] font-medium text-[#E8DFCE]/85 hover:text-white hover:bg-white/[0.07] border border-transparent transition-all whitespace-nowrap"
            >
              {labelTravelInfo}
            </button>
          </nav>

          {/* Right: TR/EN Selector & Auth/Admin Controls */}
          <div className="hidden lg:flex items-center gap-2 min-[1360px]:gap-2.5 shrink-0">
            {/* Language Selector */}
            <div className="flex items-center bg-[#071526] rounded-xl p-1 border border-[#C49238]/35">
              <button
                onClick={() => setLanguage('tr')}
                className={`px-2 py-1 text-xs rounded-lg transition-all ${
                  language === 'tr'
                    ? 'bg-gradient-to-b from-[#E2BC6B] to-[#B88428] text-[#061322] font-extrabold shadow-xs'
                    : 'text-[#D8CEB8] hover:text-white font-bold'
                }`}
              >
                TR
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 text-xs rounded-lg transition-all ${
                  language === 'en'
                    ? 'bg-gradient-to-b from-[#E2BC6B] to-[#B88428] text-[#061322] font-extrabold shadow-xs'
                    : 'text-[#D8CEB8] hover:text-white font-bold'
                }`}
              >
                EN
              </button>
            </div>

            {/* Admin / Staff State or Login Button */}
            {activeUser && activeUser.role !== 'customer' ? (
              <div className="flex items-center gap-1.5 xl:gap-2 pl-2 border-l border-[#C49238]/30">
                <button
                  onClick={toggleAdminMode}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs border whitespace-nowrap ${
                    isAdmin
                      ? 'bg-[#0F2C47] text-[#FFFDF8] border-[#E6C376]/75 ring-2 ring-[#C49238]/40'
                      : 'bg-[#1E5B70] text-white border-[#E6C376]/50 hover:bg-[#246C85]'
                  }`}
                  title="Yönetim Paneli ile Canlı Site Arasında Geçiş Yap"
                >
                  <Shield className="w-3.5 h-3.5 text-[#E6C376]" />
                  <span>{isAdmin ? (language === 'en' ? 'Exit Admin' : 'Yönetici Aktif') : labelAdminBtn}</span>
                </button>

                <div className="flex items-center gap-1.5 pl-0.5">
                  <div className="w-8 h-8 rounded-full bg-[#0E2238] text-[#E6C376] border border-[#E6C376]/60 flex items-center justify-center font-bold text-xs shadow-xs shrink-0">
                    {activeUser.role === 'super_admin' ? 'SA' : 'OP'}
                  </div>
                  <div className="hidden min-[1360px]:flex flex-col text-left max-w-[96px]">
                    <span className="text-xs font-bold text-[#FFFDF8] leading-none truncate">
                      {activeUser.role === 'super_admin' ? 'Süper Admin' : activeUser.name}
                    </span>
                    <span className="text-[10px] text-[#E6C376]/85 leading-tight truncate">
                      Yetkili Personel
                    </span>
                  </div>

                  <button
                    onClick={logoutUser}
                    className="p-1.5 rounded-lg text-[#D8CEB8] hover:text-rose-300 hover:bg-rose-500/15 transition-colors shrink-0"
                    title="Yetkili Oturumunu Kapat"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-[#C49238]/30">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#C49238] via-[#DFB860] to-[#B88428] hover:brightness-110 text-[#061322] border border-[#F3DC99]/60 text-xs font-extrabold flex items-center gap-1.5 shadow-[0_2px_12px_rgba(196,146,56,0.25)] transition-all"
                  title={language === 'en' ? 'Login' : 'Giriş Yap'}
                >
                  <LogIn className="w-3.5 h-3.5 text-[#061322]" />
                  <span>{language === 'en' ? 'Login' : 'Giriş Yap'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger & Language Toggle */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
              className="px-2.5 py-1 text-xs font-extrabold rounded-lg bg-[#071526] border border-[#C49238]/45 text-[#E6C376]"
            >
              {language.toUpperCase()}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#FFFDF8] bg-[#071526]/80 border border-[#C49238]/40 hover:border-[#E6C376] rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 text-[#E6C376]" /> : <Menu className="w-5 h-5 text-[#E6C376]" />}
            </button>
          </div>
        </div>
      </div>

      {/* Crisp Dark-Gold Samruk & Qoshqar Muyiz Bottom Border with Medallion */}
      <CentralAsianBorder variant="dark" opacity={0.95} withMedallion />

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-[#08182B] border-b-2 border-[#C49238]/60 p-4 shadow-2xl flex flex-col gap-2 animate-fade-in z-50">
          {navItems.map((item) => {
            const isActive = activeView === item.view && !isAdmin;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setActiveView(item.view as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2.5 transition-colors ${
                  isActive
                    ? 'bg-[#122B46] text-[#FFFDF8] border border-[#E6C376]/55'
                    : 'text-[#E8DFCE] hover:bg-white/[0.06] border border-transparent'
                }`}
              >
                <item.icon className="w-4 h-4 text-[#E6C376]" />
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => {
              setActiveView('home');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-semibold text-[#E8DFCE] hover:bg-white/[0.06]"
          >
            {labelTravelInfo}
          </button>

          {activeUser && activeUser.role !== 'customer' ? (
            <div className="pt-2.5 mt-1 border-t border-[#C49238]/25 flex items-center justify-between">
              <button
                onClick={() => {
                  toggleAdminMode();
                  setMobileMenuOpen(false);
                }}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-[#1E5B70] border border-[#E6C376]/50 text-white flex items-center gap-2 shadow-xs"
              >
                <Shield className="w-4 h-4 text-[#E6C376]" />
                {isAdmin ? (language === 'en' ? 'Back to Customer Mode' : 'Müşteri Moduna Dön') : labelAdminBtn}
              </button>
              <button
                onClick={() => {
                  logoutUser();
                  setMobileMenuOpen(false);
                }}
                className="px-3 py-2 text-xs font-bold text-rose-300 hover:bg-rose-500/15 rounded-lg flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" />
                <span>{language === 'en' ? 'Logout' : 'Çıkış'}</span>
              </button>
            </div>
          ) : (
            <div className="pt-2.5 mt-1 border-t border-[#C49238]/25">
              <button
                onClick={() => {
                  setAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="w-full px-4 py-2.5 text-xs font-extrabold rounded-xl bg-gradient-to-r from-[#C49238] via-[#DFB860] to-[#B88428] text-[#061322] border border-[#F3DC99]/60 flex items-center justify-center gap-2 shadow-xs transition-all"
              >
                <LogIn className="w-4 h-4 text-[#061322]" />
                <span>{language === 'en' ? 'Login' : 'Giriş Yap'}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
