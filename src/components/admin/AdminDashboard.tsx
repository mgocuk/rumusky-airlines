import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Flight,
  OperationalStatus,
  Airport,
  UserRole,
  PermissionKey,
  NewsItem,
  Campaign,
  PopularDestination,
  BenefitItem
} from '../../types';
import { useToast } from '../common/Toast';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import {
  Plane,
  Calendar,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  AlertCircle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Sliders,
  Shield,
  Building,
  ArrowRight,
  Settings,
  Save,
  Image as ImageIcon,
  Newspaper,
  CheckSquare,
  Square,
  Trash2,
  Edit,
  Eye,
  Lock,
  Unlock,
  UserPlus,
  Menu,
  X
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    flights,
    bookings,
    airports,
    aircrafts,
    campaigns,
    destinations,
    siteContent,
    updateSiteContent,
    news,
    addNewsItem,
    updateNewsItem,
    deleteNewsItem,
    updateCampaign,
    updateDestination,
    rolePermissions,
    updateRolePermissions,
    hasPermission,
    staffUsers,
    addStaffUser,
    updateUserRole,
    deleteStaffUser,
    switchActiveStaffRole,
    activeUser,
    addFlight,
    updateFlightStatus,
    cancelFlight,
    cancelBooking,
    resetAllData,
    toggleAdminMode,
    t,
    language
  } = useApp();

  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'flights' | 'bookings' | 'cms' | 'news' | 'airports' | 'rbac' | 'settings'
  >('overview');

  const [mobileAdminNavOpen, setMobileAdminNavOpen] = useState(false);

  // Modals state
  const [showAddFlightModal, setShowAddFlightModal] = useState(false);
  const [showAddAirportModal, setShowAddAirportModal] = useState(false);
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [editingNewsItem, setEditingNewsItem] = useState<NewsItem | null>(null);

  // New Flight Form state
  const [newFlightNumber, setNewFlightNumber] = useState('RMK-707');
  const [newOriginIata, setNewOriginIata] = useState('IST');
  const [newDestIata, setNewDestIata] = useState('DXB');
  const [newAircraftId, setNewAircraftId] = useState(aircrafts[0]?.id || 'ac-1');
  const [newDepDate, setNewDepDate] = useState('2026-11-15T09:00');
  const [newArrDate, setNewArrDate] = useState('2026-11-15T13:30');
  const [newEconomyPrice, setNewEconomyPrice] = useState(3800);
  const [newBusinessPrice, setNewBusinessPrice] = useState(8900);

  // New Airport Form state
  const [newIata, setNewIata] = useState('ESB');
  const [newIcao, setNewIcao] = useState('LTAC');
  const [newAirportName, setNewAirportName] = useState('Ankara Esenboğa Havalimanı');
  const [newCity, setNewCity] = useState('Ankara');
  const [newCountry, setNewCountry] = useState('Türkiye');

  // New News Item state
  const [newsTitle, setNewsTitle] = useState('');
  const [newsTitleEn, setNewsTitleEn] = useState('');
  const [newsCategory, setNewsCategory] = useState<'Duyuru' | 'Kampanya' | 'Operasyon' | 'Basın'>('Duyuru');
  const [newsImage, setNewsImage] = useState('https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80');
  const [newsSummary, setNewsSummary] = useState('');
  const [newsSummaryEn, setNewsSummaryEn] = useState('');
  const [newsContent, setNewsContent] = useState('');
  const [newsContentEn, setNewsContentEn] = useState('');

  // New Staff User state
  const [staffName, setStaffName] = useState('');
  const [staffSurname, setStaffSurname] = useState('');
  const [staffEmail, setStaffEmail] = useState('');
  const [staffRole, setStaffRole] = useState<UserRole>('flight_manager');

  // CMS Form States
  const [cmsHeroBg, setCmsHeroBg] = useState(siteContent.heroBackgroundUrl);
  const [cmsHeroTitle, setCmsHeroTitle] = useState(siteContent.heroTitle);
  const [cmsHeroTitleEn, setCmsHeroTitleEn] = useState(siteContent.heroTitleEn);
  const [cmsHeroSubtitle, setCmsHeroSubtitle] = useState(siteContent.heroSubtitle);
  const [cmsHeroSubtitleEn, setCmsHeroSubtitleEn] = useState(siteContent.heroSubtitleEn);
  const [cmsHeroBadge, setCmsHeroBadge] = useState(siteContent.heroBadgeText);
  const [cmsHeroBadgeEn, setCmsHeroBadgeEn] = useState(siteContent.heroBadgeTextEn);
  const [cmsAnnounceEnabled, setCmsAnnounceEnabled] = useState(siteContent.announcementBanner.enabled);
  const [cmsAnnounceText, setCmsAnnounceText] = useState(siteContent.announcementBanner.text);
  const [cmsAnnounceTextEn, setCmsAnnounceTextEn] = useState(siteContent.announcementBanner.textEn);
  const [cmsAnnounceBadge, setCmsAnnounceBadge] = useState(siteContent.announcementBanner.badge);

  // Settings state
  const [vatRate, setVatRate] = useState(18);
  const [seatHoldMinutes, setSeatHoldMinutes] = useState(10);

  // Live Analytics Calculations
  const totalRevenue = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.totalAmount, 0);

  const totalPassengers = bookings
    .filter((b) => b.status === 'confirmed')
    .reduce((sum, b) => sum + b.passengers.length, 0);

  const activeFlightsCount = flights.filter((f) => f.bookingStatus === 'open').length;

  const destCounts: Record<string, number> = {};
  flights.forEach((f) => {
    destCounts[f.destinationAirport.iataCode] = (destCounts[f.destinationAirport.iataCode] || 0) + 1;
  });
  const chartData = Object.entries(destCounts).map(([code, count]) => ({
    name: code,
    ucuslar: count
  }));

  // Handlers
  const handleCreateFlight = (e: React.FormEvent) => {
    e.preventDefault();
    const origin = airports.find((a) => a.iataCode === newOriginIata) || airports[0];
    const destination = airports.find((a) => a.iataCode === newDestIata) || airports[1];
    const aircraft = aircrafts.find((ac) => ac.id === newAircraftId) || aircrafts[0];

    const dep = new Date(newDepDate);
    const arr = new Date(newArrDate);
    const durationMins = Math.round((arr.getTime() - dep.getTime()) / (1000 * 60)) || 180;

    addFlight({
      flightNumber: newFlightNumber,
      routeId: `rt-${Date.now()}`,
      originAirport: origin,
      destinationAirport: destination,
      aircraftId: aircraft.id,
      aircraftModel: aircraft.model,
      departureTime: newDepDate + ':00',
      arrivalTime: newArrDate + ':00',
      durationMinutes: durationMins,
      priceEconomy: Number(newEconomyPrice),
      priceBusiness: Number(newBusinessPrice),
      baggageAllowanceKg: 25,
      operationalStatus: 'Scheduled',
      bookingStatus: 'open'
    });

    setShowAddFlightModal(false);
    showToast(`${newFlightNumber} seferi başarıyla satışa açıldı!`, 'success');
  };

  const handleCreateAirport = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt: Airport = {
      id: `apt-${Date.now()}`,
      iataCode: newIata.toUpperCase(),
      icaoCode: newIcao.toUpperCase(),
      name: newAirportName,
      city: newCity,
      cityEn: newCity,
      country: newCountry,
      countryEn: newCountry,
      timezone: 'Europe/Istanbul',
      isActive: true
    };
    airports.push(newApt);
    setShowAddAirportModal(false);
    showToast(`${newApt.iataCode} havalimanı sisteme kaydedildi!`, 'success');
  };

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent({
      heroBackgroundUrl: cmsHeroBg,
      heroTitle: cmsHeroTitle,
      heroTitleEn: cmsHeroTitleEn,
      heroSubtitle: cmsHeroSubtitle,
      heroSubtitleEn: cmsHeroSubtitleEn,
      heroBadgeText: cmsHeroBadge,
      heroBadgeTextEn: cmsHeroBadgeEn,
      announcementBanner: {
        enabled: cmsAnnounceEnabled,
        badge: cmsAnnounceBadge,
        text: cmsAnnounceText,
        textEn: cmsAnnounceTextEn
      }
    });
    showToast('Site görselleri ve başlık metinleri canlı olarak güncellendi!', 'success');
  };

  const handleCreateNews = (e: React.FormEvent) => {
    e.preventDefault();
    addNewsItem({
      title: newsTitle,
      titleEn: newsTitleEn || newsTitle,
      summary: newsSummary,
      summaryEn: newsSummaryEn || newsSummary,
      content: newsContent,
      contentEn: newsContentEn || newsContent,
      imageUrl: newsImage,
      category: newsCategory,
      isActive: true
    });
    setShowAddNewsModal(false);
    setNewsTitle('');
    setNewsSummary('');
    setNewsContent('');
    showToast('Yeni haber başarıyla yayınlandı!', 'success');
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    addStaffUser({
      name: staffName,
      surname: staffSurname,
      email: staffEmail,
      role: staffRole,
      phone: '+90 555 000 0000'
    });
    setShowAddStaffModal(false);
    setStaffName('');
    setStaffSurname('');
    setStaffEmail('');
    showToast('Yeni personel ve yetki ataması yapıldı!', 'success');
  };

  const togglePermissionForRole = (role: UserRole, perm: PermissionKey) => {
    const current = rolePermissions[role] || [];
    const next = current.includes(perm)
      ? current.filter((p) => p !== perm)
      : [...current, perm];
    updateRolePermissions(role, next);
    showToast(`${role} rolünün ${perm} yetkisi güncellendi!`, 'info');
  };

  const allPermissionsList: { key: PermissionKey; label: string }[] = [
    { key: 'manage_flights', label: 'Uçuş Seferleri Yönetimi (Ekle / İptal / Durum)' },
    { key: 'manage_airports', label: 'Havalimanı Tanımlama & Düzenleme' },
    { key: 'manage_aircraft', label: 'Uçak Filosu & Kapasite Yönetimi' },
    { key: 'manage_bookings', label: 'Rezervasyon & Bilet İptal / İade Kontrolü' },
    { key: 'manage_cms', label: 'Site CMS: Görseller, Başlıklar, Sloganlar' },
    { key: 'manage_news', label: 'Haberler & Basın Bültenleri Yönetimi' },
    { key: 'manage_settings', label: 'Sistem Parametreleri & Vergi Oranları' },
    { key: 'manage_roles', label: 'Süper Admin: Yetki Matrisi & Personel Atama' }
  ];

  return (
    <div className="bg-slate-50 min-h-screen pb-16 font-sans">
      
      {/* Top Admin Header Bar */}
      <div className="bg-brand-navy text-white px-4 sm:px-6 py-4 shadow-md sticky top-0 z-30">
        <div className="max-w-[1300px] mx-auto flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileAdminNavOpen(!mobileAdminNavOpen)}
              className="lg:hidden p-2 rounded-xl bg-slate-800 text-white"
            >
              {mobileAdminNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="w-10 h-10 rounded-xl bg-brand-blue flex items-center justify-center shadow-xs">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-heading font-extrabold tracking-wide">
                  RUMUSKY SÜPER ADMİN PANELİ
                </h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-brand-cyan text-brand-navy">
                  v2.0 CMS
                </span>
              </div>
              <p className="text-[11px] text-sky-200 hidden sm:block">
                Tüm Görseller, Başlıklar, Haberler, Uçuşlar ve Rol Yetkileri Yönetimi
              </p>
            </div>
          </div>

          {/* Quick Active Role Switcher (For Presentation Testing!) */}
          <div className="flex items-center gap-2.5">
            <div className="hidden sm:flex items-center bg-slate-800/90 rounded-xl p-1 border border-slate-700 text-xs">
              <span className="text-[11px] text-slate-400 px-2 font-medium">Test Rolü:</span>
              {(['super_admin', 'flight_manager', 'booking_manager', 'content_manager'] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => switchActiveStaffRole(r)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                    activeUser?.role === r
                      ? 'bg-brand-blue text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {r === 'super_admin' ? 'Süper Admin' : r === 'flight_manager' ? 'Uçuş Şefi' : r === 'booking_manager' ? 'Biletçi' : 'İçerik'}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                resetAllData();
                showToast('Tüm simülasyon fabrika ayarlarına sıfırlandı.', 'info');
              }}
              title="Tüm veritabanı simülasyonunu sıfırlar"
              className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 border border-slate-700"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Sıfırla</span>
            </button>

            <button
              onClick={toggleAdminMode}
              className="px-3.5 py-2 rounded-xl bg-brand-cyan hover:bg-sky-400 text-brand-navy text-xs font-black flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <span>Canlı Siteye Dön</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Admin Nav Tabs */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-6 shadow-xs">
        <div className="max-w-[1300px] mx-auto flex gap-1 sm:gap-2 overflow-x-auto py-2.5">
          {[
            { id: 'overview', label: 'Genel Bakış', icon: TrendingUp, perm: null },
            { id: 'flights', label: `Uçuşlar (${flights.length})`, icon: Plane, perm: 'manage_flights' },
            { id: 'bookings', label: `Rezervasyonlar (${bookings.length})`, icon: Calendar, perm: 'manage_bookings' },
            { id: 'cms', label: 'Site Görselleri & Metinler', icon: ImageIcon, perm: 'manage_cms' },
            { id: 'news', label: `Haberler (${news.length})`, icon: Newspaper, perm: 'manage_news' },
            { id: 'airports', label: `Havalimanları & Filo`, icon: Building, perm: 'manage_airports' },
            { id: 'rbac', label: 'Rol & Yetki Matrisi (SüperAdmin)', icon: Lock, perm: 'manage_roles' },
            { id: 'settings', label: 'Sistem Parametreleri', icon: Settings, perm: 'manage_settings' }
          ].map((tab) => {
            const isPermitted = !tab.perm || hasPermission(tab.perm as PermissionKey);
            return (
              <button
                key={tab.id}
                onClick={() => {
                  if (isPermitted) setActiveTab(tab.id as any);
                  else showToast('Bu sekmeye erişim için rol yetkiniz bulunmamaktadır!', 'error');
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-brand-blue border border-blue-200 shadow-xs'
                    : isPermitted
                    ? 'text-slate-600 hover:bg-slate-100'
                    : 'text-slate-300 cursor-not-allowed bg-slate-50'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {!isPermitted && <Lock className="w-3 h-3 text-slate-400 ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Admin Content Area */}
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6 pt-6">

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtle">
                <div className="flex items-center justify-between text-brand-muted text-xs font-bold mb-2">
                  <span>{t('admin_stat_total_bookings')}</span>
                  <Calendar className="w-4 h-4 text-brand-blue" />
                </div>
                <div className="text-3xl font-black font-heading text-brand-navy">
                  {bookings.length}
                </div>
                <div className="text-[11px] text-emerald-600 mt-1 font-semibold">
                  {bookings.filter((b) => b.status === 'confirmed').length} Onaylı Bilet
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtle">
                <div className="flex items-center justify-between text-brand-muted text-xs font-bold mb-2">
                  <span>{t('admin_stat_revenue')}</span>
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                </div>
                <div className="text-3xl font-black font-heading text-brand-navy">
                  {totalRevenue.toLocaleString('tr-TR')} ₺
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Simüle Edilmiş Satış Geliri
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtle">
                <div className="flex items-center justify-between text-brand-muted text-xs font-bold mb-2">
                  <span>{t('admin_stat_active_flights')}</span>
                  <Plane className="w-4 h-4 text-brand-cyan" />
                </div>
                <div className="text-3xl font-black font-heading text-brand-navy">
                  {activeFlightsCount}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Satışa Açık Aktif Hat
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtle">
                <div className="flex items-center justify-between text-brand-muted text-xs font-bold mb-2">
                  <span>{t('admin_stat_occupancy')}</span>
                  <TrendingUp className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-3xl font-black font-heading text-brand-navy">
                  %82.1
                </div>
                <div className="text-[11px] text-emerald-600 mt-1 font-semibold">
                  Yüksek Kapasite Verimi
                </div>
              </div>
            </div>

            {/* Recharts Chart */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-subtle">
              <h3 className="font-heading font-bold text-base text-brand-navy mb-4">
                Destinasyon Bazında Sefer Dağılımı (Recharts Analytics)
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" stroke="#64748B" fontSize={12} />
                    <YAxis stroke="#64748B" fontSize={12} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0B2545',
                        color: '#FFF',
                        borderRadius: '8px',
                        border: 'none'
                      }}
                    />
                    <Bar dataKey="ucuslar" fill="#0D6EFD" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* 2. CMS: SITE GÖRSELLERİ, BAŞLIKLAR VE METİNLER TAB */}
        {activeTab === 'cms' && hasPermission('manage_cms') && (
          <div className="space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-heading text-brand-navy">
                  Dinamik İçerik & Görsel Yönetim Stüdyosu (CMS)
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">
                  Arka plan resimlerini, ana sayfa başlıklarını, sloganları ve avantaj kartlarını buradan anında değiştirin.
                </p>
              </div>
            </div>

            {/* Hero & Background Customizer */}
            <form onSubmit={handleSaveCMS} className="bg-white p-6 rounded-2xl border border-brand-border shadow-subtle space-y-6">
              <div className="flex items-center gap-2 font-heading font-bold text-base text-brand-navy pb-3 border-b border-slate-100">
                <ImageIcon className="w-5 h-5 text-brand-blue" />
                <span>Hero Bölümü Görseli & Başlıkları</span>
              </div>

              {/* Background URL */}
              <div>
                <label className="text-xs font-bold text-brand-muted uppercase block mb-1">
                  Hero Arka Plan Resmi URL (Canlı Fotoğraf)
                </label>
                <div className="flex gap-3">
                  <input
                    type="url"
                    required
                    value={cmsHeroBg}
                    onChange={(e) => setCmsHeroBg(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                  <div className="w-16 h-10 rounded-xl overflow-hidden border border-slate-300 flex-shrink-0 bg-slate-100">
                    <img src={cmsHeroBg} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                </div>
                <span className="text-[10px] text-brand-muted mt-1 block">
                  İpucu: Unsplash veya doğrudan uçak/gökyüzü görseli URL'si yapıştırabilirsiniz.
                </span>
              </div>

              {/* Titles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-brand-muted uppercase block mb-1">
                    Ana Başlık (Türkçe)
                  </label>
                  <input
                    type="text"
                    required
                    value={cmsHeroTitle}
                    onChange={(e) => setCmsHeroTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-brand-muted uppercase block mb-1">
                    Ana Başlık (İngilizce)
                  </label>
                  <input
                    type="text"
                    required
                    value={cmsHeroTitleEn}
                    onChange={(e) => setCmsHeroTitleEn(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              {/* Subtitles Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-brand-muted uppercase block mb-1">
                    Alt Açıklama (Türkçe)
                  </label>
                  <textarea
                    rows={2}
                    value={cmsHeroSubtitle}
                    onChange={(e) => setCmsHeroSubtitle(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-brand-muted uppercase block mb-1">
                    Alt Açıklama (İngilizce)
                  </label>
                  <textarea
                    rows={2}
                    value={cmsHeroSubtitleEn}
                    onChange={(e) => setCmsHeroSubtitleEn(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Pill Badges */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-brand-muted uppercase block mb-1">
                    Üst Slogan Rozeti (Türkçe)
                  </label>
                  <input
                    type="text"
                    value={cmsHeroBadge}
                    onChange={(e) => setCmsHeroBadge(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-brand-muted uppercase block mb-1">
                    Üst Slogan Rozeti (İngilizce)
                  </label>
                  <input
                    type="text"
                    value={cmsHeroBadgeEn}
                    onChange={(e) => setCmsHeroBadgeEn(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Top Announcement Ribbon Switcher */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    id="announceCheck"
                    checked={cmsAnnounceEnabled}
                    onChange={(e) => setCmsAnnounceEnabled(e.target.checked)}
                    className="w-4 h-4 text-brand-blue rounded"
                  />
                  <label htmlFor="announceCheck" className="text-xs font-bold text-brand-navy cursor-pointer">
                    Ana Sayfa Üst Duyuru Bandını Göster
                  </label>
                </div>

                {cmsAnnounceEnabled && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">Rozet Metni</label>
                      <input
                        type="text"
                        value={cmsAnnounceBadge}
                        onChange={(e) => setCmsAnnounceBadge(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold uppercase"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">Duyuru Cümlesi</label>
                      <input
                        type="text"
                        value={cmsAnnounceText}
                        onChange={(e) => setCmsAnnounceText(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Değişiklikleri Canlıya Uygula</span>
                </button>
              </div>
            </form>

            {/* Campaign Banners Editor */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-subtle space-y-4">
              <h4 className="font-heading font-bold text-base text-brand-navy">
                Kampanya Banner Görselleri ve İndirimleri
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {campaigns.map((cmp) => (
                  <div key={cmp.id} className="p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="h-32 rounded-lg overflow-hidden bg-slate-100">
                      <img src={cmp.imageUrl} alt={cmp.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">Görsel URL</label>
                      <input
                        type="url"
                        value={cmp.imageUrl}
                        onChange={(e) => updateCampaign(cmp.id, { imageUrl: e.target.value })}
                        className="w-full px-3 py-1.5 text-xs bg-slate-50 border rounded-lg font-mono"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">Başlık</label>
                        <input
                          type="text"
                          value={cmp.title}
                          onChange={(e) => updateCampaign(cmp.id, { title: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border rounded-lg font-bold"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">Rozet</label>
                        <input
                          type="text"
                          value={cmp.badgeText}
                          onChange={(e) => updateCampaign(cmp.id, { badgeText: e.target.value })}
                          className="w-full px-3 py-1.5 text-xs bg-slate-50 border rounded-lg font-bold"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Destinations Prices Editor */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-subtle space-y-4">
              <h4 className="font-heading font-bold text-base text-brand-navy">
                Popüler Destinasyonlar Görsel ve Fiyat Ayarları
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {destinations.map((dest) => (
                  <div key={dest.id} className="p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="h-24 rounded-lg overflow-hidden bg-slate-100">
                      <img src={dest.imageUrl} alt={dest.city} className="w-full h-full object-cover" />
                    </div>
                    <div className="font-bold">{dest.city}</div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block">Görsel URL</label>
                      <input
                        type="url"
                        value={dest.imageUrl}
                        onChange={(e) => updateDestination(dest.id, { imageUrl: e.target.value })}
                        className="w-full px-2 py-1 text-[11px] bg-slate-50 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-500 font-bold block">Başlangıç Fiyatı (₺)</label>
                      <input
                        type="number"
                        value={dest.startingPrice}
                        onChange={(e) => updateDestination(dest.id, { startingPrice: Number(e.target.value) })}
                        className="w-full px-2 py-1 text-[11px] bg-slate-50 border rounded font-bold"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. HABERLER & DUYURULAR YÖNETİMİ TAB */}
        {activeTab === 'news' && hasPermission('manage_news') && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-heading text-brand-navy">
                  Haberler, Basın Bültenleri ve Duyurular ({news.length})
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">
                  Buradan yeni şirket haberleri ekleyebilir veya yayından kaldırabilirsiniz.
                </p>
              </div>

              <button
                onClick={() => setShowAddNewsModal(true)}
                className="px-4 py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Haber Ekle</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.map((n) => (
                <div key={n.id} className="bg-white rounded-2xl border border-brand-border shadow-subtle p-5 flex flex-col justify-between">
                  <div>
                    <div className="h-40 rounded-xl overflow-hidden mb-3 bg-slate-100">
                      <img src={n.imageUrl} alt={n.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-brand-muted mb-1.5">
                      <span className="font-bold text-brand-blue uppercase">{n.category}</span>
                      <span>{n.publishedAt}</span>
                    </div>
                    <h4 className="font-bold text-sm text-brand-navy line-clamp-2">{n.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-3 leading-relaxed">{n.summary}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      n.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {n.isActive ? 'Yayında' : 'Taslak'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => updateNewsItem(n.id, { isActive: !n.isActive })}
                        className="p-1.5 text-slate-500 hover:text-brand-blue rounded-lg"
                        title={n.isActive ? 'Yayından Kaldır' : 'Yayına Al'}
                      >
                        {n.isActive ? <Eye className="w-4 h-4" /> : <Eye className="w-4 h-4 opacity-40" />}
                      </button>
                      <button
                        onClick={() => {
                          deleteNewsItem(n.id);
                          showToast('Haber silindi.', 'error');
                        }}
                        className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg"
                        title="Haberi Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 4. SÜPER ADMİN: ROL VE YETKİ MATRİSİ (RBAC) TAB */}
        {activeTab === 'rbac' && hasPermission('manage_roles') && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-700 text-xs font-bold mb-2">
                <Lock className="w-3.5 h-3.5" />
                <span>Süper Admin Güvenlik & Yetkilendirme Modülü</span>
              </div>
              <h3 className="text-xl font-bold font-heading text-brand-navy">
                Rol Tabanlı Erişim Kontrolü (RBAC Permissions Matrix)
              </h3>
              <p className="text-xs text-brand-muted mt-0.5">
                Hangi rolün admin panelindeki hangi bölümlere (uçuşlar, rezervasyonlar, CMS, haberler vb.) erişebileceğini doğrudan buradan ayarlayın.
              </p>
            </div>

            {/* Permissions Matrix Table */}
            <div className="bg-white rounded-2xl border border-brand-border shadow-subtle overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <h4 className="font-heading font-bold text-sm text-brand-navy">
                  Yetki Dağılım Matrisi (Açmak/Kapatmak için Kutulara Tıklayın)
                </h4>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-bold uppercase tracking-wider">
                    <tr>
                      <th className="p-3.5 min-w-[240px]">Yetki Alanı</th>
                      <th className="p-3.5 text-center">Süper Admin</th>
                      <th className="p-3.5 text-center">Uçuş Şefi (Flight)</th>
                      <th className="p-3.5 text-center">Bilet Destek (Booking)</th>
                      <th className="p-3.5 text-center">İçerik Editörü (Content)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allPermissionsList.map((perm) => (
                      <tr key={perm.key} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 font-bold text-brand-navy">{perm.label}</td>

                        {/* Super Admin always has all */}
                        <td className="p-3.5 text-center">
                          <CheckSquare className="w-5 h-5 text-emerald-600 mx-auto" />
                        </td>

                        {/* Flight Manager */}
                        <td className="p-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => togglePermissionForRole('flight_manager', perm.key)}
                            className="focus:outline-hidden"
                          >
                            {rolePermissions.flight_manager?.includes(perm.key) ? (
                              <CheckSquare className="w-5 h-5 text-brand-blue mx-auto" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-300 mx-auto hover:text-slate-500" />
                            )}
                          </button>
                        </td>

                        {/* Booking Manager */}
                        <td className="p-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => togglePermissionForRole('booking_manager', perm.key)}
                            className="focus:outline-hidden"
                          >
                            {rolePermissions.booking_manager?.includes(perm.key) ? (
                              <CheckSquare className="w-5 h-5 text-brand-blue mx-auto" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-300 mx-auto hover:text-slate-500" />
                            )}
                          </button>
                        </td>

                        {/* Content Manager */}
                        <td className="p-3.5 text-center">
                          <button
                            type="button"
                            onClick={() => togglePermissionForRole('content_manager', perm.key)}
                            className="focus:outline-hidden"
                          >
                            {rolePermissions.content_manager?.includes(perm.key) ? (
                              <CheckSquare className="w-5 h-5 text-brand-blue mx-auto" />
                            ) : (
                              <Square className="w-5 h-5 text-slate-300 mx-auto hover:text-slate-500" />
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Staff Accounts Management */}
            <div className="bg-white rounded-2xl border border-brand-border shadow-subtle p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-heading font-bold text-base text-brand-navy">
                    Yetkili Personel ve Yönetici Kullanıcılar ({staffUsers.length})
                  </h4>
                  <p className="text-xs text-brand-muted">
                    Sistem personeli tanımlayın veya mevcut personelin rolünü değiştirin.
                  </p>
                </div>

                <button
                  onClick={() => setShowAddStaffModal(true)}
                  className="px-4 py-2 bg-brand-navy hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs"
                >
                  <UserPlus className="w-4 h-4 text-brand-cyan" />
                  <span>Yeni Personel Tanımla</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-brand-muted uppercase font-bold">
                    <tr>
                      <th className="p-3">Ad Soyad</th>
                      <th className="p-3">E-Posta</th>
                      <th className="p-3">Aktif Rol</th>
                      <th className="p-3 text-right">Rolü Güncelle</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {staffUsers.map((u) => (
                      <tr key={u.id}>
                        <td className="p-3 font-bold text-brand-navy">{u.name} {u.surname}</td>
                        <td className="p-3 text-slate-600">{u.email}</td>
                        <td className="p-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            u.role === 'super_admin'
                              ? 'bg-purple-100 text-purple-800'
                              : u.role === 'flight_manager'
                              ? 'bg-blue-100 text-blue-800'
                              : u.role === 'booking_manager'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}>
                            {u.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <select
                            value={u.role}
                            onChange={(e) => {
                              updateUserRole(u.id, e.target.value as UserRole);
                              showToast(`${u.name} kullanıcısının rolü güncellendi!`, 'info');
                            }}
                            className="px-2 py-1 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                          >
                            <option value="super_admin">Süper Admin</option>
                            <option value="flight_manager">Uçuş Şefi (Flight Manager)</option>
                            <option value="booking_manager">Biletçi (Booking Manager)</option>
                            <option value="content_manager">İçerik Editörü (Content Manager)</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. FLIGHTS TAB */}
        {activeTab === 'flights' && hasPermission('manage_flights') && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold font-heading text-brand-navy">
                  Uçuş Tarifesi & Operasyon Yönetimi
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">
                  Buradan yeni uçuş ekleyebilir veya durumunu değiştirebilirsiniz.
                </p>
              </div>

              <button
                onClick={() => setShowAddFlightModal(true)}
                className="px-4 py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{t('admin_add_flight')}</span>
              </button>
            </div>

            {/* Flights Table */}
            <div className="bg-white rounded-2xl border border-brand-border shadow-subtle overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-brand-muted uppercase font-bold tracking-wider">
                    <tr>
                      <th className="p-3.5">Uçuş Kodu</th>
                      <th className="p-3.5">Güzergah</th>
                      <th className="p-3.5">Uçak Modeli</th>
                      <th className="p-3.5">Kalkış - Varış</th>
                      <th className="p-3.5">Taban Fiyat</th>
                      <th className="p-3.5">Operasyonel Durum</th>
                      <th className="p-3.5 text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {flights.map((f) => (
                      <tr key={f.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 font-bold font-mono text-brand-navy">
                          {f.flightNumber}
                        </td>
                        <td className="p-3.5 font-semibold">
                          {f.originAirport.iataCode} → {f.destinationAirport.iataCode}
                        </td>
                        <td className="p-3.5 text-slate-600">{f.aircraftModel}</td>
                        <td className="p-3.5">
                          {f.departureTime.split('T')[0]} ({f.departureTime.split('T')[1].substring(0, 5)})
                        </td>
                        <td className="p-3.5 font-bold text-brand-navy">
                          {f.priceEconomy.toLocaleString('tr-TR')} ₺
                        </td>
                        <td className="p-3.5">
                          <select
                            value={f.operationalStatus}
                            onChange={(e) => {
                              updateFlightStatus(f.id, e.target.value as OperationalStatus);
                              showToast(`${f.flightNumber} durumu ${e.target.value} olarak güncellendi.`);
                            }}
                            className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-semibold bg-white"
                          >
                            <option value="Scheduled">Scheduled (Planlandı)</option>
                            <option value="Boarding">Boarding (Biniş)</option>
                            <option value="Departed">Departed (Kalktı)</option>
                            <option value="In Air">In Air (Havada)</option>
                            <option value="Landed">Landed (İndi)</option>
                            <option value="Delayed">Delayed (Rötar)</option>
                            <option value="Cancelled">Cancelled (İptal)</option>
                          </select>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => {
                              cancelFlight(f.id);
                              showToast(`${f.flightNumber} uçuşu iptal edildi.`, 'error');
                            }}
                            className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            İptal Et
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 6. BOOKINGS TAB */}
        {activeTab === 'bookings' && hasPermission('manage_bookings') && (
          <div className="space-y-6 animate-fade-in">
            <h3 className="text-xl font-bold font-heading text-brand-navy">
              Rezervasyon ve Bilet Kayıtları
            </h3>

            {bookings.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-brand-border text-center text-brand-muted">
                <Calendar className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>Henüz sistemde oluşturulmuş bir rezervasyon bulunmuyor.</p>
                <p className="text-xs text-slate-400 mt-1">Müşteri arayüzünden test uçuşu satın aldığınızda burada listelenecektir.</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-brand-border shadow-subtle overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-brand-muted uppercase font-bold tracking-wider">
                    <tr>
                      <th className="p-3.5">PNR</th>
                      <th className="p-3.5">İletişim</th>
                      <th className="p-3.5">Yolcular</th>
                      <th className="p-3.5">Toplam Tutar</th>
                      <th className="p-3.5">Durum</th>
                      <th className="p-3.5">Tarih</th>
                      <th className="p-3.5 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {bookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="p-3.5 font-bold font-mono text-brand-blue">{b.pnr}</td>
                        <td className="p-3.5">
                          <div className="font-semibold text-brand-navy">{b.contactEmail}</div>
                          <div className="text-[10px] text-brand-muted">{b.contactPhone}</div>
                        </td>
                        <td className="p-3.5">
                          {b.passengers.map((p) => `${p.firstName} ${p.lastName} (${p.selectedSeat || 'TBA'})`).join(', ')}
                        </td>
                        <td className="p-3.5 font-bold text-brand-navy">
                          {b.totalAmount.toLocaleString('tr-TR')} ₺
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}>
                            {b.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500">
                          {new Date(b.createdAt).toLocaleDateString('tr-TR')}
                        </td>
                        <td className="p-3.5 text-right">
                          {b.status === 'confirmed' && (
                            <button
                              onClick={() => {
                                cancelBooking(b.id);
                                showToast(`${b.pnr} bilet rezervasyonu iptal edildi.`, 'error');
                              }}
                              className="px-2.5 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg"
                            >
                              Bileti İptal Et
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 7. AIRPORTS & AIRCRAFT TAB */}
        {activeTab === 'airports' && hasPermission('manage_airports') && (
          <div className="space-y-8 animate-fade-in">
            {/* Airports */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold font-heading text-brand-navy">
                  Kayıtlı Havalimanları ({airports.length})
                </h3>
                <button
                  onClick={() => setShowAddAirportModal(true)}
                  className="px-4 py-2 bg-brand-blue text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yeni Havalimanı Ekle</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {airports.map((a) => (
                  <div key={a.id} className="bg-white p-5 rounded-2xl border border-brand-border shadow-subtle flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-black font-heading text-brand-navy">{a.iataCode}</span>
                        <span className="text-xs font-mono font-bold text-slate-400">{a.icaoCode}</span>
                      </div>
                      <div className="font-bold text-sm text-brand-navy truncate">{a.name}</div>
                      <div className="text-xs text-brand-muted mt-0.5">{a.city}, {a.country}</div>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
                      <span>{a.timezone}</span>
                      <span className="text-emerald-600 font-bold">Aktif</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Aircraft Fleet */}
            <div>
              <h3 className="text-xl font-bold font-heading text-brand-navy mb-4">
                Uçak Filosu ve Kabin Yerleşimi ({aircrafts.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {aircrafts.map((ac) => (
                  <div key={ac.id} className="bg-white p-6 rounded-2xl border border-brand-border shadow-subtle">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xl font-bold font-heading text-brand-navy">{ac.model}</span>
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-brand-blue">
                        {ac.registrationNumber}
                      </span>
                    </div>
                    <div className="text-xs text-slate-600 space-y-1.5 mt-4">
                      <div>Üretici: <b>{ac.manufacturer}</b></div>
                      <div>Toplam Kapasite: <b>{ac.totalCapacity} Yolcu</b></div>
                      <div>Kabin Dağılımı: <b>{ac.businessRows} Sıra Business, {ac.economyRows} Sıra Ekonomi</b></div>
                      <div>Koltuk Dizilimi: <b>3 + 3 ({ac.seatsPerRow.join(', ')})</b></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 8. SETTINGS TAB */}
        {activeTab === 'settings' && hasPermission('manage_settings') && (
          <div className="max-w-2xl bg-white p-6 sm:p-8 rounded-3xl border border-brand-border shadow-subtle space-y-6 animate-fade-in">
            <div>
              <h3 className="text-xl font-bold font-heading text-brand-navy">
                Sistem ve Finansal Parametreler
              </h3>
              <p className="text-xs text-brand-muted mt-1">
                Vergi oranları ve koltuk kilitleme sürelerini buradan yönetebilirsiniz.
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); showToast('Sistem ayarları güncellendi!', 'success'); }} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-brand-muted uppercase block mb-1">
                  KDV & Havalimanı Harç Oranı (%)
                </label>
                <input
                  type="number"
                  value={vatRate}
                  onChange={(e) => setVatRate(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand-muted uppercase block mb-1">
                  Geçici Koltuk Kilitleme Süresi (Dakika)
                </label>
                <input
                  type="number"
                  value={seatHoldMinutes}
                  onChange={(e) => setSeatHoldMinutes(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Ayarları Kaydet</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* MODALS */}

      {/* Add Flight Modal */}
      {showAddFlightModal && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-brand-border">
            <h3 className="text-lg font-bold font-heading text-brand-navy mb-4">
              Yeni Uçuş Tarifesi Oluştur
            </h3>

            <form onSubmit={handleCreateFlight} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">Uçuş Kodu</label>
                  <input
                    type="text"
                    required
                    value={newFlightNumber}
                    onChange={(e) => setNewFlightNumber(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">Uçak</label>
                  <select
                    value={newAircraftId}
                    onChange={(e) => setNewAircraftId(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    {aircrafts.map((ac) => (
                      <option key={ac.id} value={ac.id}>{ac.model} ({ac.registrationNumber})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">Kalkış Havalimanı</label>
                  <select
                    value={newOriginIata}
                    onChange={(e) => setNewOriginIata(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    {airports.map((a) => (
                      <option key={a.id} value={a.iataCode}>{a.city} ({a.iataCode})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">Varış Havalimanı</label>
                  <select
                    value={newDestIata}
                    onChange={(e) => setNewDestIata(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    {airports.map((a) => (
                      <option key={a.id} value={a.iataCode}>{a.city} ({a.iataCode})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">Kalkış Tarih / Saat</label>
                  <input
                    type="datetime-local"
                    required
                    value={newDepDate}
                    onChange={(e) => setNewDepDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">Varış Tarih / Saat</label>
                  <input
                    type="datetime-local"
                    required
                    value={newArrDate}
                    onChange={(e) => setNewArrDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">Ekonomi Fiyat (₺)</label>
                  <input
                    type="number"
                    required
                    value={newEconomyPrice}
                    onChange={(e) => setNewEconomyPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">Business Fiyat (₺)</label>
                  <input
                    type="number"
                    required
                    value={newBusinessPrice}
                    onChange={(e) => setNewBusinessPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddFlightModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Uçuşu Satışa Aç
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Airport Modal */}
      {showAddAirportModal && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-brand-border">
            <h3 className="text-lg font-bold font-heading text-brand-navy mb-4">
              Yeni Havalimanı Tanımla
            </h3>

            <form onSubmit={handleCreateAirport} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">IATA Kodu</label>
                  <input
                    type="text"
                    required
                    maxLength={3}
                    placeholder="ESB"
                    value={newIata}
                    onChange={(e) => setNewIata(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">ICAO Kodu</label>
                  <input
                    type="text"
                    required
                    maxLength={4}
                    placeholder="LTAC"
                    value={newIcao}
                    onChange={(e) => setNewIcao(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-brand-muted block mb-1">Havalimanı Adı</label>
                <input
                  type="text"
                  required
                  value={newAirportName}
                  onChange={(e) => setNewAirportName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">Şehir</label>
                  <input
                    type="text"
                    required
                    value={newCity}
                    onChange={(e) => setNewCity(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">Ülke</label>
                  <input
                    type="text"
                    required
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddAirportModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Havalimanını Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add News Modal */}
      {showAddNewsModal && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-brand-border max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold font-heading text-brand-navy mb-4">
              Yeni Şirket Haberi & Duyuru Ekle
            </h3>

            <form onSubmit={handleCreateNews} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-brand-muted block mb-1">Haber Başlığı</label>
                <input
                  type="text"
                  required
                  placeholder="Yeni Seferlerimiz Satışta..."
                  value={newsTitle}
                  onChange={(e) => setNewsTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">Kategori</label>
                  <select
                    value={newsCategory}
                    onChange={(e) => setNewsCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  >
                    <option value="Duyuru">Duyuru</option>
                    <option value="Kampanya">Kampanya</option>
                    <option value="Operasyon">Operasyon</option>
                    <option value="Basın">Basın</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">Görsel URL</label>
                  <input
                    type="url"
                    required
                    value={newsImage}
                    onChange={(e) => setNewsImage(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-brand-muted block mb-1">Kısa Özet</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Haber kartında görünecek 1-2 cümlelik özet..."
                  value={newsSummary}
                  onChange={(e) => setNewsSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand-muted block mb-1">Detaylı Haber İçeriği</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Haberin tam metni..."
                  value={newsContent}
                  onChange={(e) => setNewsContent(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddNewsModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Haberi Yayınla
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-brand-border">
            <h3 className="text-lg font-bold font-heading text-brand-navy mb-4">
              Yeni Yetkili Personel Ekle
            </h3>

            <form onSubmit={handleAddStaff} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">Ad</label>
                  <input
                    type="text"
                    required
                    value={staffName}
                    onChange={(e) => setStaffName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-brand-muted block mb-1">Soyad</label>
                  <input
                    type="text"
                    required
                    value={staffSurname}
                    onChange={(e) => setStaffSurname(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-brand-muted block mb-1">E-Posta</label>
                <input
                  type="email"
                  required
                  placeholder="personel@rumusky.com"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand-muted block mb-1">Atanacak Rol</label>
                <select
                  value={staffRole}
                  onChange={(e) => setStaffRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  <option value="super_admin">Süper Admin (Tam Yetki)</option>
                  <option value="flight_manager">Uçuş Şefi (Uçuş, Havalimanı, Uçaklar)</option>
                  <option value="booking_manager">Bilet Destek (Rezervasyonlar & Biletler)</option>
                  <option value="content_manager">İçerik Editörü (CMS, Haberler, Görseller)</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md"
                >
                  Personeli Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
