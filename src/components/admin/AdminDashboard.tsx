import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Flight,
  OperationalStatus,
  Airport,
  Aircraft,
  UserRole,
  PermissionKey,
  NewsItem,
  Campaign,
  PopularDestination,
  BenefitItem,
  Booking,
  Ticket as TicketType,
  Passenger
} from '../../types';
import { useToast } from '../common/Toast';
import { Logo } from '../common/Logo';
import { getFutureDateString } from '../../data/seedData';
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
  Clock,
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
  X,
  FileText,
  BookOpen,
  Upload,
  Sparkles,
  Layers,
  Gauge,
  Compass,
  Maximize2,
  Tag,
  Wifi,
  Coffee,
  Zap,
  Wind,
  VolumeX,
  Radio,
  Share2,
  Search,
  MapPin,
  Ticket
} from 'lucide-react';

const PRESET_HERO_BACKGROUNDS = [
  {
    title: 'Bulut Denizi & Jet (Öne Çıkan)',
    url: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=2000&q=80'
  },
  {
    title: 'Geniş Gövde Jet & Okyanus (THY Konsepti)',
    url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=2000&q=80'
  },
  {
    title: 'Bulutlar Üzerinde Uçak (Klasik)',
    url: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=80'
  },
  {
    title: 'Gün Batımı & Bulutlar',
    url: 'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=2000&q=80'
  },
  {
    title: 'Gündüz Uçuşu & Gökyüzü',
    url: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=2000&q=80'
  },
  {
    title: 'Modern Yolcu Uçağı',
    url: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=2000&q=80'
  }
];

const AIRCRAFT_TEMPLATES = [
  {
    name: 'Airbus A321-200neo',
    model: 'Airbus A321-200neo',
    manufacturer: 'Airbus',
    type: 'Dar Gövde (Narrow-Body)',
    economyRows: 31,
    businessRows: 4,
    seatsPerRow: 'A, B, C, D, E, F',
    rangeKm: 7400,
    speedKmh: 876,
    wingspan: 35.8,
    length: 44.5,
    engine: 'CFM LEAP-1A32 Yüksek Baypaslı Sessiz TurboFan',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
    cabinImageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=80',
    features: ['Uydu Bağlantılı Hızlı Wi-Fi', 'Kişisel 4K Dokunmatik Ekran', 'USB-C Hızlı Şarj', 'HEPA %99.97 Filtreleme', 'Mood LED Aydınlatma'],
    desc: 'Yüksek yolcu kapasitesi ve düşük karbon salınımıyla filonun en verimli dar gövdeli amiral gemisi.',
    descEn: 'Our most fuel-efficient narrow-body flagship offering high capacity and low carbon emissions.'
  },
  {
    name: 'Boeing 787-9 Dreamliner',
    model: 'Boeing 787-9 Dreamliner',
    manufacturer: 'Boeing',
    type: 'Geniş Gövde (Wide-Body)',
    economyRows: 32,
    businessRows: 6,
    seatsPerRow: 'A, B, C, D, E, F',
    rangeKm: 14140,
    speedKmh: 903,
    wingspan: 60.1,
    length: 62.8,
    engine: 'General Electric GEnx-1B Yüksek İtişli Kompozit Motor',
    imageUrl: 'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=1200&q=80',
    cabinImageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=80',
    features: ['180° Tam Yatar (Lie-Flat) Business Süitler', 'Düğmeyle Karartılan Elektronik Pencereler', 'Yüksek Kabin Nemi & Jetlag Azaltıcı Basınç', '13.3 inç 4K Ultra HD Ekran', 'Yüksek Hızlı Ka-Band Wi-Fi'],
    desc: 'Kıtalararası uzun menzilli uçuşlarda kompozit gövdesi ve yüksek kabin nemiyle jetlag etkisini minimuma indiren rüya uçak.',
    descEn: 'Dreamliner with composite body and optimized cabin pressure for ultimate long-haul comfort.'
  },
  {
    name: 'Airbus A350-900 XWB',
    model: 'Airbus A350-900 XWB',
    manufacturer: 'Airbus',
    type: 'Geniş Gövde (Wide-Body)',
    economyRows: 34,
    businessRows: 6,
    seatsPerRow: 'A, B, C, D, E, F',
    rangeKm: 15000,
    speedKmh: 910,
    wingspan: 64.75,
    length: 66.8,
    engine: 'Rolls-Royce Trent XWB Sessiz Dev Motor',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80',
    cabinImageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=80',
    features: ['Ekstra Geniş Kabin (XWB)', '180° Lie-Flat Business Yatak', '3-4 Dakikada Bir %100 Temizlenen Kabin Havası', '4K Eğlence Ekranları & Bluetooth Ses', 'Ultra Sessiz Uçuş Deneyimi'],
    desc: 'Havacılığın en sessiz geniş gövdeli kabinine sahip, Rolls-Royce motorlu ultra uzun menzil devi.',
    descEn: 'Ultra-long range wide-body aircraft with the quietest twin-aisle cabin in modern aviation.'
  },
  {
    name: 'Boeing 737 MAX 8',
    model: 'Boeing 737 MAX 8',
    manufacturer: 'Boeing',
    type: 'Dar Gövde (Narrow-Body)',
    economyRows: 27,
    businessRows: 4,
    seatsPerRow: 'A, B, C, D, E, F',
    rangeKm: 6570,
    speedKmh: 840,
    wingspan: 35.9,
    length: 39.5,
    engine: 'CFM LEAP-1B Çift Kademeli Çevre Dostu Motor',
    imageUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80',
    cabinImageUrl: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1200&q=80',
    features: ['Gelişmiş Winglet Teknolojisi', 'Boeing Sky Interior Gökyüzü Işıklandırması', 'Genişletilmiş Baş Üstü Dolaplar', 'USB-C Hızlı Şarj', 'HEPA Hava Filtresi'],
    desc: 'Gelişmiş winglet tasarımı ve yeni LEAP motorlarıyla yüksek yakıt tasarrufu sağlayan modern bölgesel uçak.',
    descEn: 'Modern regional airliner with advanced winglets and LEAP engines for exceptional fuel economy.'
  }
];

const COMMON_AIRCRAFT_FEATURES = [
  'Uydu Bağlantılı Hızlı Wi-Fi',
  'Kişisel 4K Dokunmatik Ekran',
  'USB-A & Type-C 60W Hızlı Şarj',
  '180° Tam Yatar (Lie-Flat) Business Koltuklar',
  'HEPA %99.97 Tıbbi Sınıf Hava Filtresi',
  'Ekstra Akustik Yalıtım & Sessiz Kabin',
  'Elektronik Karartmalı Akıllı Pencereler',
  'Mood LED Dinamik Kabin Aydınlatması',
  'Genişletilmiş Baş Üstü Bagaj Dolapları',
  'Gürültü Önleyici Kulaklık Desteği',
  'Özel Ergonomik Baş ve Boyun Desteği'
];

export const AdminDashboard: React.FC = () => {
  const {
    flights,
    bookings,
    tickets,
    airports,
    aircrafts,
    addAircraft,
    updateAircraft,
    deleteAircraft,
    toggleAircraftActive,
    campaigns,
    destinations,
    siteContent,
    updateSiteContent,
    news,
    addNewsItem,
    updateNewsItem,
    deleteNewsItem,
    infoPages,
    updateInfoPage,
    setSelectedInfoPage,
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
    syncAllFlights,
    resetAllData,
    toggleAdminMode,
    t,
    language,
    connectedClientsCount,
    setShareModalOpen,
    isRealtimeConnected
  } = useApp();

  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'flights' | 'fleet' | 'bookings' | 'cms' | 'footer_pages' | 'news' | 'airports' | 'rbac' | 'settings'
  >('overview');

  const [mobileAdminNavOpen, setMobileAdminNavOpen] = useState(false);

  // Modals state
  const [showAddFlightModal, setShowAddFlightModal] = useState(false);
  const [showAddAirportModal, setShowAddAirportModal] = useState(false);
  const [showAddNewsModal, setShowAddNewsModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showAddAircraftModal, setShowAddAircraftModal] = useState(false);
  const [editingAircraft, setEditingAircraft] = useState<Aircraft | null>(null);

  // Bookings Filter and Detail state
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingFilterStatus, setBookingFilterStatus] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [selectedBookingModal, setSelectedBookingModal] = useState<Booking | null>(null);

  // New Aircraft Form states
  const [acModel, setAcModel] = useState('Airbus A321-200neo');
  const [acReg, setAcReg] = useState('TC-RML');
  const [acManufacturer, setAcManufacturer] = useState('Airbus');
  const [acType, setAcType] = useState('Dar Gövde (Narrow-Body)');
  const [acEconomyRows, setAcEconomyRows] = useState(31);
  const [acBusinessRows, setAcBusinessRows] = useState(4);
  const [acSeatsPerRow, setAcSeatsPerRow] = useState('A, B, C, D, E, F');
  const [acImageUrl, setAcImageUrl] = useState('https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80');
  const [acCabinImageUrl, setAcCabinImageUrl] = useState('https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=80');
  const [acRangeKm, setAcRangeKm] = useState(7400);
  const [acCruiseSpeed, setAcCruiseSpeed] = useState(876);
  const [acWingspan, setAcWingspan] = useState(35.8);
  const [acLength, setAcLength] = useState(44.5);
  const [acEngineType, setAcEngineType] = useState('CFM LEAP-1A32 Yüksek Baypaslı Sessiz TurboFan');
  const [acFeatures, setAcFeatures] = useState<string[]>([
    'Uydu Bağlantılı Hızlı Wi-Fi',
    'Kişisel 4K Dokunmatik Ekran',
    'USB-A & Type-C 60W Hızlı Şarj',
    'HEPA %99.97 Tıbbi Sınıf Hava Filtresi',
    'Ekstra Akustik Yalıtım & Sessiz Kabin'
  ]);
  const [acCustomFeature, setAcCustomFeature] = useState('');
  const [acDesc, setAcDesc] = useState('Yüksek yolcu kapasitesi ve düşük yakıt tüketimiyle filomuzun amiral gemisi.');
  const [acDescEn, setAcDescEn] = useState('Our flagship narrow-body aircraft offering high passenger capacity and superior efficiency.');
  const [editingNewsItem, setEditingNewsItem] = useState<NewsItem | null>(null);

  // New Flight Form state
  const [newFlightNumber, setNewFlightNumber] = useState('RMK-707');
  const [newOriginIata, setNewOriginIata] = useState('IST');
  const [newDestIata, setNewDestIata] = useState('DXB');
  const [newAircraftId, setNewAircraftId] = useState(aircrafts[0]?.id || 'ac-1');
  const [newDepDate, setNewDepDate] = useState(`${getFutureDateString(1)}T09:00`);
  const [newArrDate, setNewArrDate] = useState(`${getFutureDateString(1)}T13:30`);
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
  const [cmsHeroOverlayOpacity, setCmsHeroOverlayOpacity] = useState(siteContent.heroOverlayOpacity ?? 25);
  const [cmsSearchOpacity, setCmsSearchOpacity] = useState(siteContent.searchCardOpacity ?? 70);
  const [cmsSearchBlur, setCmsSearchBlur] = useState(siteContent.searchCardBlur ?? 12);
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

  // Brand & Navbar Form States
  const navCfg = siteContent.navbar || {
    companyName: siteContent.companyName || 'RUMUSKY',
    companySubtitle: siteContent.companySubtitle || 'AIRLINES',
    customLogoUrl: siteContent.customLogoUrl || '',
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
    navAbout: 'RUMUSKY',
    navAboutEn: 'RUMUSKY',
    navAdminButtonText: 'Admin Paneli',
    navAdminButtonTextEn: 'Admin Portal'
  };

  const [cmsCompanyName, setCmsCompanyName] = useState(siteContent.companyName || 'RUMUSKY');
  const [cmsCompanySubtitle, setCmsCompanySubtitle] = useState(siteContent.companySubtitle || 'AIRLINES');
  const [cmsLogoUrl, setCmsLogoUrl] = useState(siteContent.customLogoUrl || '');
  const [cmsNavSearch, setCmsNavSearch] = useState(navCfg.navSearchFlights);
  const [cmsNavSearchEn, setCmsNavSearchEn] = useState(navCfg.navSearchFlightsEn);
  const [cmsNavBookings, setCmsNavBookings] = useState(navCfg.navMyBookings);
  const [cmsNavBookingsEn, setCmsNavBookingsEn] = useState(navCfg.navMyBookingsEn);
  const [cmsNavCheckin, setCmsNavCheckin] = useState(navCfg.navCheckin);
  const [cmsNavCheckinEn, setCmsNavCheckinEn] = useState(navCfg.navCheckinEn);
  const [cmsNavNews, setCmsNavNews] = useState(navCfg.navNews);
  const [cmsNavNewsEn, setCmsNavNewsEn] = useState(navCfg.navNewsEn);
  const [cmsNavTravelInfo, setCmsNavTravelInfo] = useState(navCfg.navTravelInfo);
  const [cmsNavTravelInfoEn, setCmsNavTravelInfoEn] = useState(navCfg.navTravelInfoEn);
  const [cmsNavAbout, setCmsNavAbout] = useState(navCfg.navAbout);
  const [cmsNavAboutEn, setCmsNavAboutEn] = useState(navCfg.navAboutEn);
  const [cmsNavAdminBtn, setCmsNavAdminBtn] = useState(navCfg.navAdminButtonText);
  const [cmsNavAdminBtnEn, setCmsNavAdminBtnEn] = useState(navCfg.navAdminButtonTextEn);
  const [cmsNavbarPreviewLang, setCmsNavbarPreviewLang] = useState<'tr' | 'en'>('tr');

  useEffect(() => {
    setCmsHeroBg(siteContent.heroBackgroundUrl);
    setCmsHeroOverlayOpacity(siteContent.heroOverlayOpacity ?? 25);
    setCmsSearchOpacity(siteContent.searchCardOpacity ?? 70);
    setCmsSearchBlur(siteContent.searchCardBlur ?? 12);
    setCmsHeroTitle(siteContent.heroTitle);
    setCmsHeroTitleEn(siteContent.heroTitleEn);
    setCmsHeroSubtitle(siteContent.heroSubtitle);
    setCmsHeroSubtitleEn(siteContent.heroSubtitleEn);
    setCmsHeroBadge(siteContent.heroBadgeText);
    setCmsHeroBadgeEn(siteContent.heroBadgeTextEn);
    setCmsAnnounceEnabled(siteContent.announcementBanner.enabled);
    setCmsAnnounceText(siteContent.announcementBanner.text);
    setCmsAnnounceTextEn(siteContent.announcementBanner.textEn);
    setCmsAnnounceBadge(siteContent.announcementBanner.badge);

    const n = siteContent.navbar;
    setCmsCompanyName(siteContent.companyName || 'RUMUSKY');
    setCmsCompanySubtitle(siteContent.companySubtitle || 'AIRLINES');
    setCmsLogoUrl(siteContent.customLogoUrl || '');
    if (n) {
      setCmsNavSearch(n.navSearchFlights || 'Uçuş Ara');
      setCmsNavSearchEn(n.navSearchFlightsEn || 'Search Flights');
      setCmsNavBookings(n.navMyBookings || 'Rezervasyonlarım');
      setCmsNavBookingsEn(n.navMyBookingsEn || 'My Bookings');
      setCmsNavCheckin(n.navCheckin || 'Online Check-in');
      setCmsNavCheckinEn(n.navCheckinEn || 'Online Check-in');
      setCmsNavNews(n.navNews || 'Haberler & Basın');
      setCmsNavNewsEn(n.navNewsEn || 'News & Media');
      setCmsNavTravelInfo(n.navTravelInfo || 'Seyahat Bilgileri');
      setCmsNavTravelInfoEn(n.navTravelInfoEn || 'Travel Information');
      setCmsNavAbout(n.navAbout || 'RUMUSKY');
      setCmsNavAboutEn(n.navAboutEn || 'RUMUSKY');
      setCmsNavAdminBtn(n.navAdminButtonText || 'Admin Paneli');
      setCmsNavAdminBtnEn(n.navAdminButtonTextEn || 'Admin Portal');
    }
  }, [siteContent]);

  // Footer & 15 Info Pages States
  const [selectedEditingPageId, setSelectedEditingPageId] = useState<string>(infoPages[0]?.id || 'page-about');
  const activeEditingPage = infoPages.find((p) => p.id === selectedEditingPageId) || infoPages[0];

  const [pageMenuLabel, setPageMenuLabel] = useState(activeEditingPage?.menuLabel || '');
  const [pageMenuLabelEn, setPageMenuLabelEn] = useState(activeEditingPage?.menuLabelEn || '');
  const [pageTitle, setPageTitle] = useState(activeEditingPage?.title || '');
  const [pageTitleEn, setPageTitleEn] = useState(activeEditingPage?.titleEn || '');
  const [pageBadge, setPageBadge] = useState(activeEditingPage?.badge || '');
  const [pageBadgeEn, setPageBadgeEn] = useState(activeEditingPage?.badgeEn || '');
  const [pageSummary, setPageSummary] = useState(activeEditingPage?.summary || '');
  const [pageSummaryEn, setPageSummaryEn] = useState(activeEditingPage?.summaryEn || '');
  const [pageContent, setPageContent] = useState(activeEditingPage?.content || '');
  const [pageContentEn, setPageContentEn] = useState(activeEditingPage?.contentEn || '');
  const [pageContactEmail, setPageContactEmail] = useState(activeEditingPage?.contactEmail || '');
  const [pageContactPhone, setPageContactPhone] = useState(activeEditingPage?.contactPhone || '');

  // Footer Global State
  const initialFooter = siteContent.footer || {
    desc: siteContent.footerDesc,
    descEn: siteContent.footerDescEn,
    safetyBadge: 'IATA & ICAO Standartlarında Güvenli Uçuş Operasyonları',
    safetyBadgeEn: 'IATA & ICAO Standardized Flight Safety Operations',
    col1Title: 'RUMUSKY',
    col1TitleEn: 'RUMUSKY',
    col2Title: 'SEYAHAT BİLGİLERİ',
    col2TitleEn: 'TRAVEL INFO',
    col3Title: 'YARDIM & DESTEK',
    col3TitleEn: 'HELP & SUPPORT',
    copyright: '© 2026 RUMUSKY AIRLINES. Tüm hakları saklıdır. Okul Projesi ve Demo Gösterimi.',
    copyrightEn: '© 2026 RUMUSKY AIRLINES. All rights reserved. Academic Project & Live Demonstration.'
  };

  const [footerDesc, setFooterDesc] = useState(initialFooter.desc);
  const [footerDescEn, setFooterDescEn] = useState(initialFooter.descEn);
  const [footerSafety, setFooterSafety] = useState(initialFooter.safetyBadge);
  const [footerSafetyEn, setFooterSafetyEn] = useState(initialFooter.safetyBadgeEn);
  const [footerCol1, setFooterCol1] = useState(initialFooter.col1Title);
  const [footerCol1En, setFooterCol1En] = useState(initialFooter.col1TitleEn);
  const [footerCol2, setFooterCol2] = useState(initialFooter.col2Title);
  const [footerCol2En, setFooterCol2En] = useState(initialFooter.col2TitleEn);
  const [footerCol3, setFooterCol3] = useState(initialFooter.col3Title);
  const [footerCol3En, setFooterCol3En] = useState(initialFooter.col3TitleEn);
  const [footerCopyright, setFooterCopyright] = useState(initialFooter.copyright);
  const [footerCopyrightEn, setFooterCopyrightEn] = useState(initialFooter.copyrightEn);

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

  const handleApplyAircraftTemplate = (tpl: typeof AIRCRAFT_TEMPLATES[0]) => {
    setAcModel(tpl.model);
    setAcManufacturer(tpl.manufacturer);
    setAcType(tpl.type);
    setAcEconomyRows(tpl.economyRows);
    setAcBusinessRows(tpl.businessRows);
    setAcSeatsPerRow(tpl.seatsPerRow);
    setAcRangeKm(tpl.rangeKm);
    setAcCruiseSpeed(tpl.speedKmh);
    setAcWingspan(tpl.wingspan);
    setAcLength(tpl.length);
    setAcEngineType(tpl.engine);
    setAcImageUrl(tpl.imageUrl);
    setAcCabinImageUrl(tpl.cabinImageUrl);
    setAcFeatures([...tpl.features]);
    setAcDesc(tpl.desc);
    setAcDescEn(tpl.descEn);
    showToast(`${tpl.name} şablonu yüklendi!`, 'info');
  };

  const handleToggleAcFeature = (feat: string) => {
    if (acFeatures.includes(feat)) {
      setAcFeatures(acFeatures.filter((f) => f !== feat));
    } else {
      setAcFeatures([...acFeatures, feat]);
    }
  };

  const handleAddCustomAcFeature = () => {
    const trimmed = acCustomFeature.trim();
    if (trimmed && !acFeatures.includes(trimmed)) {
      setAcFeatures([...acFeatures, trimmed]);
      setAcCustomFeature('');
    }
  };

  const handleSaveAircraft = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanLetters = acSeatsPerRow
      .split(',')
      .map((s) => s.trim().toUpperCase())
      .filter(Boolean);

    const seatsCount = cleanLetters.length || 6;
    const computedTotal = (Number(acEconomyRows) + Number(acBusinessRows)) * seatsCount;

    if (editingAircraft) {
      updateAircraft(editingAircraft.id, {
        model: acModel,
        registrationNumber: acReg.toUpperCase().trim(),
        manufacturer: acManufacturer,
        aircraftType: acType,
        totalCapacity: computedTotal,
        economyRows: Number(acEconomyRows),
        businessRows: Number(acBusinessRows),
        seatsPerRow: cleanLetters,
        imageUrl: acImageUrl,
        cabinImageUrl: acCabinImageUrl,
        rangeKm: Number(acRangeKm),
        cruiseSpeedKmh: Number(acCruiseSpeed),
        wingspanM: Number(acWingspan),
        lengthM: Number(acLength),
        engineType: acEngineType,
        features: acFeatures,
        description: acDesc,
        descriptionEn: acDescEn
      });
      showToast(`${acModel} (${acReg}) başarıyla güncellendi!`, 'success');
      setEditingAircraft(null);
    } else {
      addAircraft({
        model: acModel,
        registrationNumber: acReg.toUpperCase().trim(),
        manufacturer: acManufacturer,
        aircraftType: acType,
        totalCapacity: computedTotal,
        economyRows: Number(acEconomyRows),
        businessRows: Number(acBusinessRows),
        seatsPerRow: cleanLetters,
        isActive: true,
        imageUrl: acImageUrl,
        cabinImageUrl: acCabinImageUrl,
        rangeKm: Number(acRangeKm),
        cruiseSpeedKmh: Number(acCruiseSpeed),
        wingspanM: Number(acWingspan),
        lengthM: Number(acLength),
        engineType: acEngineType,
        features: acFeatures,
        description: acDesc,
        descriptionEn: acDescEn
      });
      showToast(`Yeni uçak ${acModel} (${acReg}) filoya başarıyla eklendi!`, 'success');
    }

    setShowAddAircraftModal(false);
  };

  const handleEditAircraft = (ac: Aircraft) => {
    setEditingAircraft(ac);
    setAcModel(ac.model);
    setAcReg(ac.registrationNumber);
    setAcManufacturer(ac.manufacturer);
    setAcType(ac.aircraftType || 'Dar Gövde (Narrow-Body)');
    setAcEconomyRows(ac.economyRows);
    setAcBusinessRows(ac.businessRows);
    setAcSeatsPerRow(ac.seatsPerRow.join(', '));
    setAcImageUrl(ac.imageUrl || '');
    setAcCabinImageUrl(ac.cabinImageUrl || '');
    setAcRangeKm(ac.rangeKm || 6500);
    setAcCruiseSpeed(ac.cruiseSpeedKmh || 850);
    setAcWingspan(ac.wingspanM || 35.8);
    setAcLength(ac.lengthM || 37.5);
    setAcEngineType(ac.engineType || '');
    setAcFeatures(ac.features || []);
    setAcDesc(ac.description || '');
    setAcDescEn(ac.descriptionEn || '');
    setShowAddAircraftModal(true);
  };

  const handleOpenNewAircraftModal = () => {
    setEditingAircraft(null);
    setAcModel('Airbus A321-200neo');
    setAcReg(`TC-R${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`);
    setAcManufacturer('Airbus');
    setAcType('Dar Gövde (Narrow-Body)');
    setAcEconomyRows(31);
    setAcBusinessRows(4);
    setAcSeatsPerRow('A, B, C, D, E, F');
    setAcImageUrl('https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80');
    setAcCabinImageUrl('https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=80');
    setAcRangeKm(7400);
    setAcCruiseSpeed(876);
    setAcWingspan(35.8);
    setAcLength(44.5);
    setAcEngineType('CFM LEAP-1A32 Yüksek Baypaslı Sessiz TurboFan');
    setAcFeatures([
      'Uydu Bağlantılı Hızlı Wi-Fi',
      'Kişisel 4K Dokunmatik Ekran',
      'USB-A & Type-C 60W Hızlı Şarj',
      'HEPA %99.97 Tıbbi Sınıf Hava Filtresi',
      'Ekstra Akustik Yalıtım & Sessiz Kabin'
    ]);
    setAcDesc('Yüksek yolcu kapasitesi ve düşük karbon salınımıyla filomuzun amiral gemisi.');
    setAcDescEn('Our flagship narrow-body aircraft offering high passenger capacity and superior efficiency.');
    setShowAddAircraftModal(true);
  };

  const handleSaveCMS = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent({
      companyName: cmsCompanyName,
      companySubtitle: cmsCompanySubtitle,
      customLogoUrl: cmsLogoUrl,
      navbar: {
        companyName: cmsCompanyName,
        companySubtitle: cmsCompanySubtitle,
        customLogoUrl: cmsLogoUrl,
        navSearchFlights: cmsNavSearch,
        navSearchFlightsEn: cmsNavSearchEn,
        navMyBookings: cmsNavBookings,
        navMyBookingsEn: cmsNavBookingsEn,
        navCheckin: cmsNavCheckin,
        navCheckinEn: cmsNavCheckinEn,
        navNews: cmsNavNews,
        navNewsEn: cmsNavNewsEn,
        navTravelInfo: cmsNavTravelInfo,
        navTravelInfoEn: cmsNavTravelInfoEn,
        navAbout: cmsNavAbout,
        navAboutEn: cmsNavAboutEn,
        navAdminButtonText: cmsNavAdminBtn,
        navAdminButtonTextEn: cmsNavAdminBtnEn
      },
      heroBackgroundUrl: cmsHeroBg,
      heroOverlayOpacity: cmsHeroOverlayOpacity,
      searchCardOpacity: cmsSearchOpacity,
      searchCardBlur: cmsSearchBlur,
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
    showToast('Marka kimliği, logo, üst menü butonları ve site görselleri canlıya uygulandı!', 'success');
  };

  const handleSelectEditingPage = (pageId: string) => {
    setSelectedEditingPageId(pageId);
    const target = infoPages.find((p) => p.id === pageId);
    if (target) {
      setPageMenuLabel(target.menuLabel);
      setPageMenuLabelEn(target.menuLabelEn);
      setPageTitle(target.title);
      setPageTitleEn(target.titleEn);
      setPageBadge(target.badge || '');
      setPageBadgeEn(target.badgeEn || '');
      setPageSummary(target.summary);
      setPageSummaryEn(target.summaryEn);
      setPageContent(target.content);
      setPageContentEn(target.contentEn);
      setPageContactEmail(target.contactEmail || '');
      setPageContactPhone(target.contactPhone || '');
    }
  };

  const handleSaveActivePage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEditingPage) return;
    updateInfoPage(activeEditingPage.id, {
      menuLabel: pageMenuLabel,
      menuLabelEn: pageMenuLabelEn,
      title: pageTitle,
      titleEn: pageTitleEn,
      badge: pageBadge,
      badgeEn: pageBadgeEn,
      summary: pageSummary,
      summaryEn: pageSummaryEn,
      content: pageContent,
      contentEn: pageContentEn,
      contactEmail: pageContactEmail,
      contactPhone: pageContactPhone
    });
    showToast(`"${pageTitle}" sayfası ve menü link adı başarıyla güncellendi!`, 'success');
  };

  const handleSaveFooterGlobal = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteContent({
      footerDesc: footerDesc,
      footerDescEn: footerDescEn,
      footer: {
        desc: footerDesc,
        descEn: footerDescEn,
        safetyBadge: footerSafety,
        safetyBadgeEn: footerSafetyEn,
        col1Title: footerCol1,
        col1TitleEn: footerCol1En,
        col2Title: footerCol2,
        col2TitleEn: footerCol2En,
        col3Title: footerCol3,
        col3TitleEn: footerCol3En,
        copyright: footerCopyright,
        copyrightEn: footerCopyrightEn
      }
    });
    showToast('Footer genel başlıkları, güvenlik rozeti ve telif metinleri güncellendi!', 'success');
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
            {/* Live Multi-User / Student Test Button */}
            <button
              onClick={() => setShareModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              title="Öğrenci Testi ve Canlı Ağ QR Kodu"
            >
              <Radio className="w-3.5 h-3.5 animate-pulse text-white" />
              <span className="hidden sm:inline">Canlı Öğrenci Testi</span>
              <span className="bg-emerald-900/60 px-1.5 py-0.5 rounded-full text-[10px] font-black">
                {connectedClientsCount} Cihaz
              </span>
            </button>

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
            { id: 'fleet', label: `Uçak Filosu (${aircrafts.length})`, icon: Layers, perm: 'manage_aircraft' },
            { id: 'airports', label: `Havalimanları (${airports.length})`, icon: Building, perm: 'manage_airports' },
            { id: 'bookings', label: `Rezervasyonlar (${bookings.length})`, icon: Calendar, perm: 'manage_bookings' },
            { id: 'cms', label: 'Site Görselleri & Metinler', icon: ImageIcon, perm: 'manage_cms' },
            { id: 'footer_pages', label: `Kurumsal Sayfalar & Footer (${infoPages.length})`, icon: FileText, perm: 'manage_cms' },
            { id: 'news', label: `Haberler (${news.length})`, icon: Newspaper, perm: 'manage_news' },
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
          <div className="space-y-6 animate-fade-in">
            {/* Multi-User Real-time Sync Status Card */}
            <div className="bg-gradient-to-r from-brand-navy via-slate-900 to-brand-navy text-white p-5 rounded-2xl border border-slate-700/80 shadow-md flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <Radio className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-heading font-black text-sm text-white">
                      Eşzamanlı Çok Kullanıcılı Canlı Senkronizasyon (SSE & Event Stream)
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Canlı & Dinamik
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Öğrenciler telefonlarından bilet satın aldıklarında veya siz yönetici olarak bir değişiklik yaptığınızda tüm ekranlar anında senkronize olur.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span className="text-slate-300">Bağlı:</span>
                  <span className="font-extrabold text-white">{connectedClientsCount} Cihaz</span>
                </div>

                <button
                  type="button"
                  onClick={() => setShareModalOpen(true)}
                  className="px-4 py-2 rounded-xl bg-brand-cyan hover:bg-sky-300 text-brand-navy text-xs font-black flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Öğrenci Test QR Kodu & Linki</span>
                </button>
              </div>
            </div>

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

            {/* Son Alınan Biletler ve Canlı Sefer Detayları (Nereye, Saat Kaçta, Koltuk) */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-subtle space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center">
                    <Plane className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-base text-brand-navy">
                      Son Alınan Biletler ve Sefer Bilgileri (Nereye & Saat Kaçta)
                    </h3>
                    <p className="text-xs text-brand-muted">
                      Öğrencilerin ve müşterilerin satın aldığı biletler, nereye gidecekleri ve uçuş kalkış saatleri.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveTab('bookings')}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-brand-navy transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Tüm Biletleri İncele ({bookings.length})</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {bookings.length === 0 ? (
                <div className="p-8 rounded-xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
                  Henüz satın alınmış bir bilet bulunmuyor. Müşteri ekranından veya telefondan bilet satın alındığında anında burada görüntülenecektir.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="py-2.5 px-3">PNR</th>
                        <th className="py-2.5 px-3">Yolcu & Koltuk</th>
                        <th className="py-2.5 px-3">Sefer & Uçak</th>
                        <th className="py-2.5 px-3">Güzergâh (Nereden ➔ Nereye)</th>
                        <th className="py-2.5 px-3">Kalkış & Varış Saati</th>
                        <th className="py-2.5 px-3 text-right">Tutar & Durum</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.slice(0, 5).map((b) => {
                        const flight = flights.find((f) => f.id === b.flightId);
                        const depTime = flight?.departureTime ? flight.departureTime.split('T')[1].substring(0, 5) : '--:--';
                        const arrTime = flight?.arrivalTime ? flight.arrivalTime.split('T')[1].substring(0, 5) : '--:--';
                        const depDate = flight?.departureTime ? flight.departureTime.split('T')[0] : '';

                        return (
                          <tr key={b.id} className="hover:bg-slate-50/60 transition-colors">
                            <td className="py-3 px-3">
                              <span className="font-mono font-black text-brand-blue bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                                {b.pnr}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-bold text-brand-navy">
                                {b.passengers.map((p) => `${p.firstName} ${p.lastName}`).join(', ')}
                              </div>
                              <div className="flex flex-wrap gap-1 mt-0.5">
                                {b.passengers.map((p, idx) => (
                                  <span key={idx} className="px-1.5 py-0.5 rounded text-[10px] font-black bg-emerald-50 text-emerald-800 border border-emerald-200">
                                    Koltuk: {p.selectedSeat || 'TBA'}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-black text-brand-navy flex items-center gap-1">
                                <Plane className="w-3 h-3 text-brand-blue" />
                                <span>{flight?.flightNumber || 'RMK'}</span>
                              </div>
                              <div className="text-[10px] text-slate-500">{flight?.aircraftModel}</div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1.5 font-bold text-brand-navy">
                                <span>{flight?.originAirport.city} ({flight?.originAirport.iataCode})</span>
                                <ArrowRight className="w-3.5 h-3.5 text-brand-blue shrink-0" />
                                <span className="text-brand-blue font-extrabold">{flight?.destinationAirport.city} ({flight?.destinationAirport.iataCode})</span>
                              </div>
                              <div className="text-[10px] text-slate-500">{flight?.destinationAirport.name}</div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="font-black text-brand-navy flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                                <span>{depTime} ➔ {arrTime}</span>
                              </div>
                              <div className="text-[10px] text-slate-500 font-medium">Tarih: {depDate}</div>
                            </td>
                            <td className="py-3 px-3 text-right">
                              <div className="font-black text-brand-navy">{b.totalAmount.toLocaleString('tr-TR')} ₺</div>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                b.status === 'confirmed' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                              }`}>
                                {b.status === 'confirmed' ? 'ONAYLI' : 'İPTAL'}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
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
                  Arka plan resimlerini, ana sayfa başlıklarını, sloganları, logo ve üst menü butonlarını buradan anında değiştirin.
                </p>
              </div>
            </div>

            {/* 1. Üst Menü (Navbar), Logo & Marka Kimliği Yönetimi */}
            <form onSubmit={handleSaveCMS} className="bg-white p-6 rounded-2xl border border-brand-border shadow-subtle space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-base text-brand-navy">
                      Üst Menü (Navbar), Logo ve Marka Kimliği Yönetimi
                    </h4>
                    <p className="text-xs text-brand-muted">
                      Firma adını, logosunu ve üst menüdeki tüm buton isimlerini (Türkçe & İngilizce) anında değiştirin.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Marka & Menüyü Kaydet</span>
                </button>
              </div>

              {/* Firma Adı ve Logo Yönetimi */}
              <div className="bg-slate-50/70 p-5 rounded-2xl border border-slate-200/80 space-y-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-brand-blue" />
                    Firma Adı & Logo Ayarları
                  </span>
                  <span className="text-[11px] font-semibold text-brand-blue bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                    Tüm Sayfalarda Canlı Geçerli
                  </span>
                </div>

                {/* Firma Adı ve Slogan Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-brand-navy block mb-1">
                      Firma Adı (Örn: RUMUSKY, ANADOLU SKY, vb.)
                    </label>
                    <input
                      type="text"
                      required
                      value={cmsCompanyName}
                      onChange={(e) => setCmsCompanyName(e.target.value)}
                      placeholder="RUMUSKY"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-brand-navy focus:border-brand-blue focus:outline-hidden"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Üst menüde, logoda, footer'da ve biletlerde ana marka adı olarak görünür.
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-brand-navy block mb-1">
                      Marka Alt Başlığı (Örn: AIRLINES, HAVAYOLLARI, vb.)
                    </label>
                    <input
                      type="text"
                      value={cmsCompanySubtitle}
                      onChange={(e) => setCmsCompanySubtitle(e.target.value)}
                      placeholder="AIRLINES"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-brand-navy tracking-wider focus:border-brand-blue focus:outline-hidden"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Logonun altındaki ikinci satır veya uzantı metnidir.
                    </span>
                  </div>
                </div>

                {/* Logo Dosyası Yükleme & URL */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start pt-2 border-t border-slate-200/60">
                  <div className="lg:col-span-2 space-y-3">
                    <div>
                      <label className="text-[11px] font-bold text-brand-navy uppercase block mb-1">
                        Logo Görsel URL'si (PNG, SVG, JPG, WebP)
                      </label>
                      <input
                        type="url"
                        value={cmsLogoUrl}
                        onChange={(e) => setCmsLogoUrl(e.target.value)}
                        placeholder="https://.../logo.png (Boş bırakılırsa varsayılan kanatlı monogram logo kullanılır)"
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:border-brand-blue focus:outline-hidden"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      <label className="flex items-center gap-1.5 px-3.5 py-2 bg-white border border-slate-300 hover:border-brand-blue rounded-xl text-xs font-semibold text-brand-navy cursor-pointer hover:bg-slate-50 transition-colors shadow-2xs">
                        <Upload className="w-3.5 h-3.5 text-brand-blue" />
                        <span>Cihazdan Yeni Logo Yükle</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (reader.result) {
                                  setCmsLogoUrl(reader.result as string);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>

                      {cmsLogoUrl && (
                        <button
                          type="button"
                          onClick={() => setCmsLogoUrl('')}
                          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 rounded-xl text-xs font-semibold transition-colors"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Varsayılan Monogram Logoya Dön</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Canlı Logo Önizleme Kutusu (Hem açık hem koyu tema üzerinde) */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">
                      Logo Canlı Önizleme:
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-3 bg-white rounded-lg border border-slate-200 flex items-center justify-center min-h-[60px]" title="Beyaz zemin">
                        <Logo
                          companyName={cmsCompanyName}
                          companySubtitle={cmsCompanySubtitle}
                          logoImage={cmsLogoUrl}
                          size="md"
                        />
                      </div>
                      <div className="p-3 bg-brand-navy rounded-lg flex items-center justify-center min-h-[60px]" title="Koyu zemin (Footer görünümü)">
                        <Logo
                          companyName={cmsCompanyName}
                          companySubtitle={cmsCompanySubtitle}
                          logoImage={cmsLogoUrl}
                          variant="white"
                          size="md"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Üst Menü Buton İsimleri Ayarları */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div>
                    <h5 className="font-heading font-bold text-sm text-brand-navy">
                      Üst Menü Buton & Sekme Metinleri
                    </h5>
                    <p className="text-[11px] text-brand-muted">
                      Her bir butonun Türkçe ve İngilizce dillerindeki görünümünü belirleyin.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 1. Uçuş Ara */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <span className="text-[11px] font-bold text-brand-navy flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand-blue"></span>
                      1. Buton: Uçuş Ara (Sefer Bulma)
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Türkçe</label>
                        <input
                          type="text"
                          required
                          value={cmsNavSearch}
                          onChange={(e) => setCmsNavSearch(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">İngilizce (EN)</label>
                        <input
                          type="text"
                          required
                          value={cmsNavSearchEn}
                          onChange={(e) => setCmsNavSearchEn(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 2. Rezervasyonlarım */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <span className="text-[11px] font-bold text-brand-navy flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand-blue"></span>
                      2. Buton: Rezervasyonlarım / Bilet Yönetimi
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Türkçe</label>
                        <input
                          type="text"
                          required
                          value={cmsNavBookings}
                          onChange={(e) => setCmsNavBookings(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">İngilizce (EN)</label>
                        <input
                          type="text"
                          required
                          value={cmsNavBookingsEn}
                          onChange={(e) => setCmsNavBookingsEn(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 3. Online Check-in */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <span className="text-[11px] font-bold text-brand-navy flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand-blue"></span>
                      3. Buton: Online Check-in
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Türkçe</label>
                        <input
                          type="text"
                          required
                          value={cmsNavCheckin}
                          onChange={(e) => setCmsNavCheckin(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">İngilizce (EN)</label>
                        <input
                          type="text"
                          required
                          value={cmsNavCheckinEn}
                          onChange={(e) => setCmsNavCheckinEn(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 4. Haberler & Basın */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <span className="text-[11px] font-bold text-brand-navy flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand-blue"></span>
                      4. Buton: Haberler & Basın
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Türkçe</label>
                        <input
                          type="text"
                          required
                          value={cmsNavNews}
                          onChange={(e) => setCmsNavNews(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">İngilizce (EN)</label>
                        <input
                          type="text"
                          required
                          value={cmsNavNewsEn}
                          onChange={(e) => setCmsNavNewsEn(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 5. Seyahat Bilgileri */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <span className="text-[11px] font-bold text-brand-navy flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand-blue"></span>
                      5. Buton: Seyahat Bilgileri
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Türkçe</label>
                        <input
                          type="text"
                          required
                          value={cmsNavTravelInfo}
                          onChange={(e) => setCmsNavTravelInfo(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">İngilizce (EN)</label>
                        <input
                          type="text"
                          required
                          value={cmsNavTravelInfoEn}
                          onChange={(e) => setCmsNavTravelInfoEn(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 6. Kurumsal / Hakkımızda Menüsü */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2">
                    <span className="text-[11px] font-bold text-brand-navy flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-brand-blue"></span>
                      6. Buton: Kurumsal / Marka Menüsü (Hakkımızda)
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Türkçe</label>
                        <input
                          type="text"
                          required
                          value={cmsNavAbout}
                          onChange={(e) => setCmsNavAbout(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">İngilizce (EN)</label>
                        <input
                          type="text"
                          required
                          value={cmsNavAboutEn}
                          onChange={(e) => setCmsNavAboutEn(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* 7. Admin Paneli Buton Metni */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2 md:col-span-2">
                    <span className="text-[11px] font-bold text-brand-navy flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-brand-blue" />
                      7. Buton: Admin Paneli Yetkili Giriş / Geçiş Butonu Metni
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Türkçe</label>
                        <input
                          type="text"
                          required
                          value={cmsNavAdminBtn}
                          onChange={(e) => setCmsNavAdminBtn(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 block mb-0.5">İngilizce (EN)</label>
                        <input
                          type="text"
                          required
                          value={cmsNavAdminBtnEn}
                          onChange={(e) => setCmsNavAdminBtnEn(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Canlı İnteraktif Navbar Önizleme Şeridi */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-cyan" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                      Üst Menü Canlı Önizleme (Simülasyon)
                    </span>
                  </div>
                  <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-lg">
                    <button
                      type="button"
                      onClick={() => setCmsNavbarPreviewLang('tr')}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                        cmsNavbarPreviewLang === 'tr' ? 'bg-brand-blue text-white shadow-xs' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      TR Görünümü
                    </button>
                    <button
                      type="button"
                      onClick={() => setCmsNavbarPreviewLang('en')}
                      className={`px-2.5 py-1 text-[11px] font-bold rounded-md transition-all ${
                        cmsNavbarPreviewLang === 'en' ? 'bg-brand-blue text-white shadow-xs' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      EN Görünümü
                    </button>
                  </div>
                </div>

                {/* Navbar Visual Bar */}
                <div className="bg-white text-brand-navy rounded-xl p-3 shadow-md border border-slate-200 flex flex-wrap items-center justify-between gap-3 overflow-x-auto">
                  {/* Brand */}
                  <div>
                    <Logo
                      companyName={cmsCompanyName}
                      companySubtitle={cmsCompanySubtitle}
                      logoImage={cmsLogoUrl}
                      size="sm"
                    />
                  </div>

                  {/* Nav Links */}
                  <div className="flex items-center gap-1 sm:gap-2 text-[11px] font-semibold whitespace-nowrap">
                    <span className="px-2.5 py-1 rounded-full bg-blue-50 text-brand-blue font-bold">
                      {cmsNavbarPreviewLang === 'en' ? cmsNavSearchEn : cmsNavSearch}
                    </span>
                    <span className="px-2 py-1 text-slate-600">
                      {cmsNavbarPreviewLang === 'en' ? cmsNavBookingsEn : cmsNavBookings}
                    </span>
                    <span className="px-2 py-1 text-slate-600">
                      {cmsNavbarPreviewLang === 'en' ? cmsNavCheckinEn : cmsNavCheckin}
                    </span>
                    <span className="px-2 py-1 text-slate-600">
                      {cmsNavbarPreviewLang === 'en' ? cmsNavNewsEn : cmsNavNews}
                    </span>
                    <span className="px-2 py-1 text-slate-600">
                      {cmsNavbarPreviewLang === 'en' ? cmsNavTravelInfoEn : cmsNavTravelInfo}
                    </span>
                    <span className="px-2 py-1 text-slate-600 flex items-center gap-1">
                      <span>{cmsNavbarPreviewLang === 'en' ? cmsNavAboutEn : cmsNavAbout}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-cyan"></span>
                    </span>
                  </div>

                  {/* Right side */}
                  <div className="flex items-center gap-2 whitespace-nowrap">
                    <div className="flex items-center bg-slate-100 rounded-md px-1.5 py-0.5 text-[10px] font-bold">
                      <span className={cmsNavbarPreviewLang === 'tr' ? 'text-brand-blue font-extrabold' : 'text-slate-400'}>TR</span>
                      <span className="text-slate-300 mx-1">|</span>
                      <span className={cmsNavbarPreviewLang === 'en' ? 'text-brand-blue font-extrabold' : 'text-slate-400'}>EN</span>
                    </div>

                    <div className="px-2.5 py-1 rounded-lg bg-brand-navy text-white text-[10px] font-bold flex items-center gap-1">
                      <Shield className="w-3 h-3 text-brand-cyan" />
                      <span>{cmsNavbarPreviewLang === 'en' ? cmsNavAdminBtnEn : cmsNavAdminBtn}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
                >
                  <Save className="w-4 h-4" />
                  <span>Marka & Üst Menü Değişikliklerini Canlıya Uygula</span>
                </button>
              </div>
            </form>

            {/* Hero & Background Customizer */}
            <form onSubmit={handleSaveCMS} className="bg-white p-6 rounded-2xl border border-brand-border shadow-subtle space-y-6">
              <div className="flex items-center gap-2 font-heading font-bold text-base text-brand-navy pb-3 border-b border-slate-100">
                <ImageIcon className="w-5 h-5 text-brand-blue" />
                <span>Hero Bölümü Görseli & Başlıkları</span>
              </div>

              {/* Background URL & Presets & Local Upload */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-brand-navy uppercase flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-blue" />
                    <span>Hero Arka Plan Görseli (Bulutlar & Uçak)</span>
                  </label>
                  <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Dinamik & Değiştirilebilir
                  </span>
                </div>

                {/* Quick Presets Selection */}
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block mb-2">
                    Önerilen Uçak ve Bulut Temaları (Hızlı Tek Tıkla Değiştir):
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                    {PRESET_HERO_BACKGROUNDS.map((preset, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setCmsHeroBg(preset.url)}
                        className={`group relative rounded-xl overflow-hidden border-2 text-left transition-all aspect-video flex flex-col justify-end p-2 cursor-pointer ${
                          cmsHeroBg === preset.url
                            ? 'border-brand-blue ring-2 ring-brand-blue/30 shadow-md'
                            : 'border-slate-200 hover:border-brand-blue/50 opacity-80 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={preset.url}
                          alt={preset.title}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        <span className="relative z-10 text-[10px] font-bold text-white line-clamp-1 leading-tight">
                          {preset.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom URL or File Upload */}
                <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Özel Görsel URL'si Yapıştırın:
                    </label>
                    <input
                      type="url"
                      required
                      value={cmsHeroBg}
                      onChange={(e) => setCmsHeroBg(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-mono focus:border-brand-blue focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                      Veya Cihazdan Görsel Yükleyin:
                    </label>
                    <label className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-slate-300 hover:border-brand-blue rounded-xl text-xs font-semibold text-brand-navy cursor-pointer hover:bg-slate-50 transition-colors shadow-2xs">
                      <Upload className="w-3.5 h-3.5 text-brand-blue" />
                      <span>Resim Seç & Yükle</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (reader.result) {
                                setCmsHeroBg(reader.result as string);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Live Preview Card */}
                <div className="relative rounded-xl overflow-hidden border border-slate-200 h-28 flex items-center px-6">
                  <img
                    src={cmsHeroBg}
                    alt="Hero Preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-brand-navy/90 via-brand-navy/50 to-transparent"
                    style={{ opacity: Math.max(0.3, cmsHeroOverlayOpacity / 100) }}
                  />
                  <div className="relative z-10 text-white">
                    <div className="text-[10px] font-bold text-brand-cyan uppercase tracking-wider mb-0.5">
                      Canlı Önizleme
                    </div>
                    <div className="text-sm font-extrabold font-heading">
                      {cmsHeroTitle || 'Dünyaya RUMUSKY ile Uçun'}
                    </div>
                    <div className="text-[11px] text-slate-200 line-clamp-1">
                      {cmsHeroSubtitle || 'Konforlu, güvenli ve avantajlı uçuşlar'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Arama Kartı Şeffaflık & Uçak Görseli Canlılığı Ayarları */}
              <div className="bg-gradient-to-br from-slate-50 to-blue-50/60 p-5 rounded-2xl border border-blue-200 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-brand-blue" />
                    <span className="text-xs font-black text-brand-navy uppercase tracking-wider">
                      Arama Kartı Şeffaflık & Arka Plan Uçak Canlılığı (Cam Efekti)
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-brand-blue bg-blue-100/70 px-2.5 py-0.5 rounded-full border border-blue-200">
                    Glassmorphism Ayarları
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Search Card Idle Opacity */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700">
                        Arama Kartı Şeffaflığı
                      </label>
                      <span className="text-xs font-mono font-black text-brand-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        %{cmsSearchOpacity}
                      </span>
                    </div>
                    <input
                      type="range"
                      min={15}
                      max={100}
                      step={5}
                      value={cmsSearchOpacity}
                      onChange={(e) => setCmsSearchOpacity(Number(e.target.value))}
                      className="w-full accent-brand-blue cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                      <span>%15 (Çok Saydam)</span>
                      <span>%70 (Önerilen)</span>
                      <span>%100 (Opak)</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                      Kullanıcı arama kutusuna tıklamadan önce uçağın ve gökyüzünün görünmesini sağlayan şeffaflık oranı. Tıklandığında veya odaklandığında otomatik netleşir.
                    </p>
                  </div>

                  {/* Search Card Backdrop Blur */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700">
                        Buzlu Cam Bulanıklığı (Blur)
                      </label>
                      <span className="text-xs font-mono font-black text-brand-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {cmsSearchBlur}px
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={24}
                      step={2}
                      value={cmsSearchBlur}
                      onChange={(e) => setCmsSearchBlur(Number(e.target.value))}
                      className="w-full accent-brand-blue cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                      <span>0px (Net)</span>
                      <span>12px (Buzlu Cam)</span>
                      <span>24px (Maksimum)</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                      Kutunun arkasında kalan uçağın ve bulutların buzlu cam gibi dağılma yoğunluğunu belirler.
                    </p>
                  </div>

                  {/* Hero Background Plane Visibility / Darkness */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-slate-700">
                        Uçak Karartma Perdesi
                      </label>
                      <span className="text-xs font-mono font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        %{cmsHeroOverlayOpacity} Karartma
                      </span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={80}
                      step={5}
                      value={cmsHeroOverlayOpacity}
                      onChange={(e) => setCmsHeroOverlayOpacity(Number(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                      <span>%0 (En Canlı Uçak)</span>
                      <span>%25 (Dengeli)</span>
                      <span>%80 (Koyu)</span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 leading-relaxed">
                      Düşük değerlerde arka plandaki uçak görseli ve gökyüzü çok daha canlı, parlak ve belirgin olarak öne çıkar.
                    </p>
                  </div>
                </div>

                {/* Canlı Etkileşimli Önizleme */}
                <div className="relative rounded-2xl overflow-hidden border border-slate-300 h-36 flex items-center justify-center p-4">
                  <img
                    src={cmsHeroBg}
                    alt="Hero Preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-900/20 to-slate-950/60 transition-opacity"
                    style={{ opacity: cmsHeroOverlayOpacity / 100 }}
                  />
                  {/* Mini Search Card Representation */}
                  <div
                    className="relative z-10 w-full max-w-md p-3 rounded-2xl border border-white/70 shadow-xl text-center transition-all"
                    style={{
                      backgroundColor: `rgba(255, 255, 255, ${cmsSearchOpacity / 100})`,
                      backdropFilter: `blur(${cmsSearchBlur}px)`,
                      WebkitBackdropFilter: `blur(${cmsSearchBlur}px)`
                    }}
                  >
                    <div className="text-[11px] font-black text-brand-navy flex items-center justify-center gap-1.5">
                      <Plane className="w-3.5 h-3.5 text-brand-blue" />
                      <span>Arama Kutusu Canlı Önizleme (Şeffaf Görünüm)</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-2 text-[10px] text-slate-700 font-bold">
                      <span className="px-2.5 py-1 bg-white/80 rounded-lg border border-slate-200/60 shadow-2xs">İstanbul (IST)</span>
                      <span className="text-brand-navy">➔</span>
                      <span className="px-2.5 py-1 bg-white/80 rounded-lg border border-slate-200/60 shadow-2xs">Londra (LHR)</span>
                      <span className="px-3 py-1 bg-brand-blue text-white rounded-lg shadow-2xs">Uçuş Ara</span>
                    </div>
                  </div>
                </div>
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

        {/* 2.5 KURUMSAL SAYFALAR & FOOTER YÖNETİMİ TAB */}
        {activeTab === 'footer_pages' && hasPermission('manage_cms') && (
          <div className="space-y-8 animate-fade-in">
            {/* Header info */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-subtle flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-brand-blue mb-2">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Footer & 15 Bilgi Sayfası Yönetimi</span>
                </div>
                <h3 className="text-xl font-bold font-heading text-brand-navy">
                  Kurumsal Sayfalar & Tıklanınca Açılan Ekranların İçerikleri
                </h3>
                <p className="text-xs text-brand-muted mt-1 max-w-2xl">
                  Footer'daki tüm bağlantıların isimlerini, tıklandığında açılan pencerelerin detaylı metinlerini ve footer başlıklarını buradan canlı olarak düzenleyin.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedInfoPage(activeEditingPage)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center gap-2 transition-colors border border-slate-200 shadow-2xs"
                >
                  <Eye className="w-4 h-4 text-brand-blue" />
                  <span>Seçili Sayfayı Canlı Önizle</span>
                </button>
              </div>
            </div>

            {/* 15 Pages Master-Detail Editor */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: 15 Pages Selector Grouped by Category */}
              <div className="lg:col-span-4 space-y-4">
                <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-subtle">
                  <h4 className="text-xs font-extrabold text-brand-navy uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>Düzenlenecek Sayfayı Seçin</span>
                    <span className="text-[10px] text-brand-muted lowercase font-normal">{infoPages.length} sayfa aktif</span>
                  </h4>

                  {/* Categories */}
                  {[
                    { cat: 'rumusky', label: '1. RUMUSKY Grubu' },
                    { cat: 'travel_info', label: '2. Seyahat Bilgileri' },
                    { cat: 'help_support', label: '3. Yardım & Destek' },
                    { cat: 'legal', label: '4. Yasal & Sözleşmeler' }
                  ].map((group) => {
                    const pagesInGroup = infoPages.filter((p) => p.category === group.cat);
                    return (
                      <div key={group.cat} className="mb-4 last:mb-0">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 bg-slate-50 rounded-md mb-1.5">
                          {group.label}
                        </div>
                        <div className="space-y-1">
                          {pagesInGroup.map((p) => {
                            const isSelected = p.id === selectedEditingPageId;
                            return (
                              <button
                                key={p.id}
                                type="button"
                                onClick={() => handleSelectEditingPage(p.id)}
                                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                                  isSelected
                                    ? 'bg-brand-navy text-white shadow-xs font-bold'
                                    : 'text-slate-700 hover:bg-slate-100'
                                }`}
                              >
                                <span className="truncate">{p.menuLabel}</span>
                                <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {p.slug}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Page Detail Form */}
              <div className="lg:col-span-8">
                <form
                  onSubmit={handleSaveActivePage}
                  className="bg-white p-6 sm:p-7 rounded-2xl border border-brand-border shadow-subtle space-y-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-cyan"></span>
                        <h4 className="font-heading font-extrabold text-base text-brand-navy">
                          {pageTitle || activeEditingPage?.title}
                        </h4>
                      </div>
                      <span className="text-[11px] text-brand-muted">
                        Slug: <code className="text-brand-blue font-mono">{activeEditingPage?.slug}</code> • Kategori: {activeEditingPage?.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedInfoPage(activeEditingPage)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-brand-blue" />
                        <span>Önizle</span>
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-brand-blue hover:bg-blue-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>Sayfayı Kaydet</span>
                      </button>
                    </div>
                  </div>

                  {/* Menu Link Labels (Footer'da görünen isimler) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-blue-50/40 p-4 rounded-xl border border-blue-100/60">
                    <div>
                      <label className="text-[11px] font-bold text-brand-navy block mb-1">
                        Footer Menü Link Adı (Türkçe)
                      </label>
                      <input
                        type="text"
                        required
                        value={pageMenuLabel}
                        onChange={(e) => setPageMenuLabel(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        placeholder="Örn: Hakkımızda"
                      />
                      <span className="text-[10px] text-slate-500 mt-0.5 block">Footer kolonunda görünen tıklanabilir link yazısı</span>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-brand-navy block mb-1">
                        Footer Menü Link Adı (İngilizce)
                      </label>
                      <input
                        type="text"
                        required
                        value={pageMenuLabelEn}
                        onChange={(e) => setPageMenuLabelEn(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-bold text-brand-navy focus:outline-none focus:ring-2 focus:ring-brand-blue"
                        placeholder="e.g. About Us"
                      />
                      <span className="text-[10px] text-slate-500 mt-0.5 block">English link label in footer</span>
                    </div>
                  </div>

                  {/* Modal Page Titles */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                        Açılan Ekranın Başlığı (Türkçe)
                      </label>
                      <input
                        type="text"
                        required
                        value={pageTitle}
                        onChange={(e) => setPageTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-brand-navy"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                        Açılan Ekranın Başlığı (İngilizce)
                      </label>
                      <input
                        type="text"
                        required
                        value={pageTitleEn}
                        onChange={(e) => setPageTitleEn(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-brand-navy"
                      />
                    </div>
                  </div>

                  {/* Badge & Subtitle */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                        Rozet / Kategori Vurgusu (Türkçe)
                      </label>
                      <input
                        type="text"
                        value={pageBadge}
                        onChange={(e) => setPageBadge(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                        placeholder="Örn: Kurumsal Vizyonumuz"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                        Rozet / Kategori Vurgusu (İngilizce)
                      </label>
                      <input
                        type="text"
                        value={pageBadgeEn}
                        onChange={(e) => setPageBadgeEn(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium"
                        placeholder="e.g. Corporate Vision"
                      />
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                        Kısa Özet / Alt Başlık (Türkçe)
                      </label>
                      <textarea
                        rows={2}
                        value={pageSummary}
                        onChange={(e) => setPageSummary(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs leading-relaxed"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                        Kısa Özet / Alt Başlık (İngilizce)
                      </label>
                      <textarea
                        rows={2}
                        value={pageSummaryEn}
                        onChange={(e) => setPageSummaryEn(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs leading-relaxed"
                      />
                    </div>
                  </div>

                  {/* Detailed Content */}
                  <div>
                    <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                      Açılan Ekranın Tam Detaylı Metni (Türkçe)
                    </label>
                    <textarea
                      rows={6}
                      required
                      value={pageContent}
                      onChange={(e) => setPageContent(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-normal leading-relaxed focus:bg-white"
                      placeholder="Maddeler, paragraflar ve açıklamaları yazabilirsiniz..."
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                      Açılan Ekranın Tam Detaylı Metni (İngilizce)
                    </label>
                    <textarea
                      rows={6}
                      required
                      value={pageContentEn}
                      onChange={(e) => setPageContentEn(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-normal leading-relaxed focus:bg-white"
                      placeholder="Full English text paragraphs..."
                    />
                  </div>

                  {/* Optional Contact fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                    <div>
                      <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                        İletişim E-Postası (Varsa)
                      </label>
                      <input
                        type="email"
                        value={pageContactEmail}
                        onChange={(e) => setPageContactEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                        placeholder="Örn: iletisim@rumusky.com"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                        İletişim Telefonu (Varsa)
                      </label>
                      <input
                        type="text"
                        value={pageContactPhone}
                        onChange={(e) => setPageContactPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                        placeholder="Örn: +90 (850) 800 78 69"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Bu Sayfanın Değişikliklerini Kaydet</span>
                    </button>
                  </div>
                </form>
              </div>

            </div>

            {/* Global Footer Settings Section */}
            <form
              onSubmit={handleSaveFooterGlobal}
              className="bg-white p-6 sm:p-7 rounded-2xl border border-brand-border shadow-subtle space-y-6"
            >
              <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                <Settings className="w-5 h-5 text-brand-blue" />
                <div>
                  <h4 className="font-heading font-extrabold text-base text-brand-navy">
                    Footer Genel Başlıkları, Güvenlik Rozeti & Telif Metinleri
                  </h4>
                  <p className="text-xs text-brand-muted">
                    Footer'ın en altındaki telif yazısı, emniyet rozeti ve 3 kolonun ana başlıklarını buradan güncelleyin.
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                    Sol Kolon Şirket Açıklaması (Türkçe)
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={footerDesc}
                    onChange={(e) => setFooterDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                    Sol Kolon Şirket Açıklaması (İngilizce)
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={footerDescEn}
                    onChange={(e) => setFooterDescEn(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Safety Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                    Emniyet & Standart Rozet Metni (Türkçe)
                  </label>
                  <input
                    type="text"
                    required
                    value={footerSafety}
                    onChange={(e) => setFooterSafety(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                    Emniyet & Standart Rozet Metni (İngilizce)
                  </label>
                  <input
                    type="text"
                    required
                    value={footerSafetyEn}
                    onChange={(e) => setFooterSafetyEn(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold"
                  />
                </div>
              </div>

              {/* Column Titles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                    1. Kolon Başlığı (TR / EN)
                  </label>
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      required
                      value={footerCol1}
                      onChange={(e) => setFooterCol1(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                      placeholder="TR Başlık"
                    />
                    <input
                      type="text"
                      required
                      value={footerCol1En}
                      onChange={(e) => setFooterCol1En(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      placeholder="EN Başlık"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                    2. Kolon Başlığı (TR / EN)
                  </label>
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      required
                      value={footerCol2}
                      onChange={(e) => setFooterCol2(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                      placeholder="TR Başlık"
                    />
                    <input
                      type="text"
                      required
                      value={footerCol2En}
                      onChange={(e) => setFooterCol2En(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      placeholder="EN Başlık"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                    3. Kolon Başlığı (TR / EN)
                  </label>
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      required
                      value={footerCol3}
                      onChange={(e) => setFooterCol3(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold"
                      placeholder="TR Başlık"
                    />
                    <input
                      type="text"
                      required
                      value={footerCol3En}
                      onChange={(e) => setFooterCol3En(e.target.value)}
                      className="w-full px-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs"
                      placeholder="EN Başlık"
                    />
                  </div>
                </div>
              </div>

              {/* Copyright */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                    En Alt Telif / Copyright Metni (Türkçe)
                  </label>
                  <input
                    type="text"
                    required
                    value={footerCopyright}
                    onChange={(e) => setFooterCopyright(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                    En Alt Telif / Copyright Metni (İngilizce)
                  </label>
                  <input
                    type="text"
                    required
                    value={footerCopyrightEn}
                    onChange={(e) => setFooterCopyrightEn(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-navy hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Save className="w-4 h-4 text-brand-cyan" />
                  <span>Footer Başlıkları & Telif Metinlerini Kaydet</span>
                </button>
              </div>
            </form>
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-bold font-heading text-brand-navy">
                  Uçuş Tarifesi & Operasyon Yönetimi
                </h3>
                <p className="text-xs text-brand-muted mt-0.5">
                  Tüm seferler güncel zamana senkronize şekilde çalışır.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    syncAllFlights();
                    showToast('Tüm uçuş saatleri bugünden itibaren güncel zamana başarıyla senkronize edildi!', 'success');
                  }}
                  className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                  title="Geçmişte kalan veya eski tarihli seferleri bugünden ileriye taşır"
                >
                  <Clock className="w-4 h-4" />
                  <span>Saatleri Şimdiye Senkronize Et</span>
                </button>

                <button
                  onClick={() => setShowAddFlightModal(true)}
                  className="px-4 py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('admin_add_flight')}</span>
                </button>
              </div>
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
                          <div className="font-semibold text-brand-navy">
                            {f.departureTime.split('T')[0]} ({f.departureTime.split('T')[1].substring(0, 5)})
                          </div>
                          {new Date(f.departureTime).getTime() <= Date.now() ? (
                            <span className="text-[10px] font-bold text-slate-400">
                              (Geçmiş Sefer)
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-emerald-600">
                              (Gelecek Sefer)
                            </span>
                          )}
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

        {/* 6. BOOKINGS & TICKETS MANIFEST TAB */}
        {activeTab === 'bookings' && hasPermission('manage_bookings') && (() => {
          const filteredBookings = bookings.filter((b) => {
            const flight = flights.find((f) => f.id === b.flightId);
            const matchesStatus =
              bookingFilterStatus === 'all' || b.status === bookingFilterStatus;

            if (!bookingSearch.trim()) return matchesStatus;

            const query = bookingSearch.trim().toLowerCase();
            const matchesPnr = b.pnr.toLowerCase().includes(query);
            const matchesEmail = b.contactEmail.toLowerCase().includes(query);
            const matchesPassenger = b.passengers.some((p) =>
              `${p.firstName} ${p.lastName} ${p.selectedSeat}`.toLowerCase().includes(query)
            );
            const matchesFlight = flight
              ? `${flight.flightNumber} ${flight.originAirport.city} ${flight.destinationAirport.city} ${flight.originAirport.iataCode} ${flight.destinationAirport.iataCode}`
                  .toLowerCase()
                  .includes(query)
              : false;

            return matchesStatus && (matchesPnr || matchesEmail || matchesPassenger || matchesFlight);
          });

          return (
            <div className="space-y-6 animate-fade-in">
              {/* Header with Title and Search/Filters */}
              <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-subtle space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-50 text-brand-blue mb-2">
                      <Ticket className="w-3.5 h-3.5" />
                      <span>CANLI REZERVASYON & SEFER BİLGİLERİ</span>
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold font-heading text-brand-navy">
                      Alınan Biletler, Güzergâhlar ve Uçuş Saatleri
                    </h3>
                    <p className="text-xs text-brand-muted mt-1">
                      Müşterilerin ve öğrencilerin aldığı biletlerin hangi şehre, saat kaçta uçacağı ve koltuk numaraları burada anlık listelenir.
                    </p>
                  </div>

                  {/* Filter Pills */}
                  <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setBookingFilterStatus('all')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        bookingFilterStatus === 'all'
                          ? 'bg-white text-brand-navy shadow-xs'
                          : 'text-slate-500 hover:text-brand-navy'
                      }`}
                    >
                      Tümü ({bookings.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingFilterStatus('confirmed')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        bookingFilterStatus === 'confirmed'
                          ? 'bg-white text-emerald-700 shadow-xs'
                          : 'text-slate-500 hover:text-brand-navy'
                      }`}
                    >
                      Onaylı ({bookings.filter((b) => b.status === 'confirmed').length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingFilterStatus('cancelled')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        bookingFilterStatus === 'cancelled'
                          ? 'bg-white text-rose-700 shadow-xs'
                          : 'text-slate-500 hover:text-brand-navy'
                      }`}
                    >
                      İptal Edilenler ({bookings.filter((b) => b.status === 'cancelled').length})
                    </button>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={bookingSearch}
                    onChange={(e) => setBookingSearch(e.target.value)}
                    placeholder="PNR, Yolcu Adı, Koltuk No, Uçuş Kodu (Örn: RMK-104), Nereye veya Nereden (Örn: Londra, IST)..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-brand-blue focus:outline-hidden transition-colors"
                  />
                  {bookingSearch && (
                    <button
                      type="button"
                      onClick={() => setBookingSearch('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      Temizle
                    </button>
                  )}
                </div>
              </div>

              {/* Table or Empty State */}
              {filteredBookings.length === 0 ? (
                <div className="bg-white p-12 rounded-3xl border border-brand-border text-center text-brand-muted space-y-3">
                  <Calendar className="w-12 h-12 mx-auto text-slate-300" />
                  <h4 className="text-base font-bold text-brand-navy">Eşleşen Bilet Kaydı Bulunamadı</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    {bookingSearch
                      ? `"${bookingSearch}" aramasına uygun bilet bulunamadı.`
                      : 'Henüz sistemde rezervasyon oluşturulmamış. Müşteri panelinden bir test bileti aldığınızda canlı olarak burada belirecektir.'}
                  </p>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-brand-border shadow-subtle overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50/80 border-b border-slate-200 text-brand-muted uppercase font-bold tracking-wider text-[11px]">
                        <tr>
                          <th className="p-4">PNR & Bilet No</th>
                          <th className="p-4">Yolcu & Koltuk Detayı</th>
                          <th className="p-4">Sefer & Uçak Modeli</th>
                          <th className="p-4">Güzergâh (Nereden ➔ Nereye)</th>
                          <th className="p-4">Kalkış & Varış Saati</th>
                          <th className="p-4">İletişim & Ödeme</th>
                          <th className="p-4">Durum</th>
                          <th className="p-4 text-right">İşlemler</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredBookings.map((b) => {
                          const flight = flights.find((f) => f.id === b.flightId);
                          const bookingTickets = tickets.filter((t: TicketType) => t.bookingId === b.id);
                          const depTime = flight?.departureTime ? flight.departureTime.split('T')[1].substring(0, 5) : '--:--';
                          const arrTime = flight?.arrivalTime ? flight.arrivalTime.split('T')[1].substring(0, 5) : '--:--';
                          const depDate = flight?.departureTime ? flight.departureTime.split('T')[0] : '';
                          const durationHours = flight ? Math.floor(flight.durationMinutes / 60) : 0;
                          const durationMins = flight ? flight.durationMinutes % 60 : 0;

                          return (
                            <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                              {/* PNR & Bilet No */}
                              <td className="p-4 align-top">
                                <div className="font-mono font-black text-brand-blue text-sm">
                                  {b.pnr}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                                  {bookingTickets.length > 0
                                    ? bookingTickets.map((t: TicketType) => t.ticketNumber).join(', ')
                                    : `ID: ${b.id.substring(0, 10)}`}
                                </div>
                                <div className="text-[9px] text-slate-400 mt-1">
                                  {new Date(b.createdAt).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} • {new Date(b.createdAt).toLocaleDateString('tr-TR')}
                                </div>
                              </td>

                              {/* Yolcu & Koltuk Detayı */}
                              <td className="p-4 align-top">
                                <div className="space-y-1.5">
                                  {b.passengers.map((p: Passenger, pIdx: number) => (
                                    <div key={p.id || pIdx} className="flex flex-col">
                                      <span className="font-bold text-brand-navy">
                                        {p.firstName} {p.lastName}
                                      </span>
                                      <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="px-2 py-0.5 rounded-md text-[10px] font-black bg-blue-50 text-brand-blue border border-blue-200">
                                          Koltuk: {p.selectedSeat || 'TBA'}
                                        </span>
                                        <span className="text-[10px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded font-bold uppercase">
                                          {p.cabinClass}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </td>

                              {/* Sefer & Uçak Modeli */}
                              <td className="p-4 align-top">
                                <div className="font-black text-brand-navy flex items-center gap-1.5">
                                  <Plane className="w-3.5 h-3.5 text-brand-blue" />
                                  <span>{flight?.flightNumber || 'RMK-100'}</span>
                                </div>
                                <div className="text-[11px] text-slate-600 font-medium mt-0.5">
                                  {flight?.aircraftModel || 'Airbus A321-200neo'}
                                </div>
                                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[9px] font-black bg-slate-100 text-slate-600">
                                  Direkt Uçuş ({durationHours}s {durationMins}dk)
                                </span>
                              </td>

                              {/* Güzergâh (Nereden ➔ Nereye) */}
                              <td className="p-4 align-top">
                                <div className="flex items-center gap-2 font-bold text-xs">
                                  <div className="flex flex-col">
                                    <span className="text-brand-navy font-black text-sm">
                                      {flight?.originAirport.iataCode || 'IST'}
                                    </span>
                                    <span className="text-[10px] text-slate-500">
                                      {flight?.originAirport.city}
                                    </span>
                                  </div>

                                  <div className="flex flex-col items-center px-1">
                                    <ArrowRight className="w-4 h-4 text-brand-blue" />
                                    <span className="text-[8px] text-slate-400 uppercase">Varış</span>
                                  </div>

                                  <div className="flex flex-col">
                                    <span className="text-brand-blue font-black text-sm">
                                      {flight?.destinationAirport.iataCode || 'LHR'}
                                    </span>
                                    <span className="text-[10px] text-brand-navy font-bold">
                                      {flight?.destinationAirport.city}
                                    </span>
                                  </div>
                                </div>
                                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                                  {flight?.destinationAirport.name}
                                </div>
                              </td>

                              {/* Kalkış & Varış Saati */}
                              <td className="p-4 align-top">
                                <div className="p-2 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                                  <div className="flex items-center justify-between gap-2 text-xs">
                                    <span className="text-[10px] text-slate-500 font-semibold">Kalkış:</span>
                                    <span className="font-black text-brand-navy text-sm font-mono">{depTime}</span>
                                  </div>
                                  <div className="flex items-center justify-between gap-2 text-xs">
                                    <span className="text-[10px] text-slate-500 font-semibold">Varış:</span>
                                    <span className="font-black text-brand-blue text-sm font-mono">{arrTime}</span>
                                  </div>
                                  <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-500 font-medium">
                                    Tarih: <strong className="text-brand-navy">{depDate}</strong>
                                  </div>
                                </div>
                              </td>

                              {/* İletişim & Ödeme */}
                              <td className="p-4 align-top">
                                <div className="font-black text-sm text-brand-navy">
                                  {b.totalAmount.toLocaleString('tr-TR')} ₺
                                </div>
                                <div className="text-[11px] text-brand-navy font-medium mt-1">
                                  {b.contactEmail}
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {b.contactPhone}
                                </div>
                              </td>

                              {/* Durum */}
                              <td className="p-4 align-top">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black tracking-wider uppercase inline-block ${
                                  b.status === 'confirmed'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                                }`}>
                                  {b.status === 'confirmed' ? 'Onaylı Bilet' : 'İptal Edildi'}
                                </span>
                              </td>

                              {/* İşlemler */}
                              <td className="p-4 align-top text-right space-y-1.5">
                                <button
                                  type="button"
                                  onClick={() => setSelectedBookingModal(b)}
                                  className="w-full px-2.5 py-1.5 text-xs font-bold bg-slate-100 hover:bg-slate-200 text-brand-navy rounded-lg transition-colors cursor-pointer"
                                >
                                  Detay & Biniş Kartı
                                </button>
                                {b.status === 'confirmed' && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      cancelBooking(b.id);
                                      showToast(`${b.pnr} bilet rezervasyonu başarıyla iptal edildi.`, 'error');
                                    }}
                                    className="w-full px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                  >
                                    Bileti İptal Et
                                  </button>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Bilet Detay / Biniş Kartı Modalı */}
              {selectedBookingModal && (() => {
                const modalFlight = flights.find((f) => f.id === selectedBookingModal.flightId);
                const modalTickets = tickets.filter((t: TicketType) => t.bookingId === selectedBookingModal.id);

                return (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
                    <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-brand-border animate-scale-up">
                      <div className="bg-brand-navy text-white px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <Ticket className="w-5 h-5 text-brand-cyan" />
                          <div>
                            <h4 className="font-heading font-black text-base">
                              Bilet & Sefer Detay Manifestosu
                            </h4>
                            <span className="text-xs text-sky-300 font-mono font-bold">
                              PNR: {selectedBookingModal.pnr}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedBookingModal(null)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
                        {/* Sefer Güzergâh ve Saat Kartı */}
                        <div className="bg-gradient-to-r from-blue-50 to-slate-50 p-4 rounded-2xl border border-blue-200">
                          <div className="flex items-center justify-between border-b border-blue-200/60 pb-2 mb-3">
                            <span className="text-xs font-black text-brand-navy flex items-center gap-1.5">
                              <Plane className="w-4 h-4 text-brand-blue" />
                              {modalFlight?.flightNumber} • {modalFlight?.aircraftModel}
                            </span>
                            <span className="text-xs font-bold text-brand-blue">
                              {modalFlight?.departureTime.split('T')[0]}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 items-center text-center">
                            <div>
                              <div className="text-2xl font-black text-brand-navy">{modalFlight?.originAirport.iataCode}</div>
                              <div className="text-xs font-bold text-slate-700">{modalFlight?.originAirport.city}</div>
                              <div className="text-sm font-black text-brand-blue mt-1">
                                {modalFlight?.departureTime.split('T')[1].substring(0, 5)}
                              </div>
                              <span className="text-[10px] text-slate-500 block">Kalkış Saati</span>
                            </div>

                            <div className="flex flex-col items-center">
                              <span className="text-[10px] font-bold text-slate-400">
                                {modalFlight ? `${Math.floor(modalFlight.durationMinutes / 60)}s ${modalFlight.durationMinutes % 60}dk` : ''}
                              </span>
                              <div className="w-full flex items-center my-1">
                                <div className="h-0.5 bg-slate-300 flex-1"></div>
                                <Plane className="w-4 h-4 text-brand-blue mx-1 rotate-90" />
                                <div className="h-0.5 bg-slate-300 flex-1"></div>
                              </div>
                              <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                Direkt Sefer
                              </span>
                            </div>

                            <div>
                              <div className="text-2xl font-black text-brand-navy">{modalFlight?.destinationAirport.iataCode}</div>
                              <div className="text-xs font-bold text-slate-700">{modalFlight?.destinationAirport.city}</div>
                              <div className="text-sm font-black text-brand-blue mt-1">
                                {modalFlight?.arrivalTime.split('T')[1].substring(0, 5)}
                              </div>
                              <span className="text-[10px] text-slate-500 block">Varış Saati</span>
                            </div>
                          </div>
                        </div>

                        {/* Yolcular ve Koltuklar */}
                        <div>
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
                            Biletli Yolcu Listesi & Koltuklar:
                          </span>
                          <div className="space-y-2">
                            {selectedBookingModal.passengers.map((p: Passenger, idx: number) => {
                              const tkt = modalTickets[idx] || modalTickets[0];
                              return (
                                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                                  <div>
                                    <div className="font-bold text-sm text-brand-navy">
                                      {p.firstName} {p.lastName}
                                    </div>
                                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                      Bilet No: {tkt?.ticketNumber || '235-XXXXXXXXXX'}
                                    </div>
                                  </div>

                                  <div className="text-right">
                                    <span className="px-3 py-1 rounded-lg bg-brand-blue text-white text-xs font-black shadow-2xs">
                                      Koltuk: {p.selectedSeat || 'TBA'}
                                    </span>
                                    <span className="block text-[10px] text-slate-500 mt-0.5 uppercase font-bold">
                                      {p.cabinClass}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Ödeme ve İletişim Detayları */}
                        <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200">
                          <div>
                            <span className="text-slate-400 block text-[10px]">İletişim:</span>
                            <strong className="text-brand-navy block">{selectedBookingModal.contactEmail}</strong>
                            <span className="text-slate-500 font-mono">{selectedBookingModal.contactPhone}</span>
                          </div>

                          <div className="text-right">
                            <span className="text-slate-400 block text-[10px]">Toplam Ödenen:</span>
                            <span className="text-lg font-black text-brand-navy">
                              {selectedBookingModal.totalAmount.toLocaleString('tr-TR')} ₺
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-50 px-6 py-3.5 border-t border-slate-200 flex justify-end">
                        <button
                          type="button"
                          onClick={() => setSelectedBookingModal(null)}
                          className="px-5 py-2 bg-brand-navy text-white text-xs font-bold rounded-xl hover:bg-slate-800 cursor-pointer"
                        >
                          Kapat
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          );
        })()}

        {/* FLEET & AIRCRAFT TAB */}
        {activeTab === 'fleet' && hasPermission('manage_aircraft') && (
          <div className="space-y-8 animate-fade-in">
            {/* Header with Stats & Actions */}
            <div className="bg-white p-6 rounded-3xl border border-brand-border shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-blue-50 text-brand-blue mb-2">
                  <Layers className="w-3.5 h-3.5" />
                  <span>RUMUSKY AIRLINES FLIGHT FLEET</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold font-heading text-brand-navy">
                  Uçak Filosu ve Kabin Yönetimi
                </h3>
                <p className="text-xs text-brand-muted mt-1">
                  Filodaki tüm uçak modelleri, dış & kabin fotoğrafları, menzil, hız, motor ve konfor donanımları.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleOpenNewAircraftModal}
                  className="px-4 py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yeni Uçak Ekle</span>
                </button>
              </div>
            </div>

            {/* Quick Fleet Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Toplam Uçak</span>
                <span className="text-2xl font-black text-brand-navy mt-1 block">{aircrafts.length} Uçak</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Aktif Operasyon</span>
                <span className="text-2xl font-black text-emerald-600 mt-1 block">{aircrafts.filter(a => a.isActive).length} Görevde</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Toplam Koltuk Kapasitesi</span>
                <span className="text-2xl font-black text-brand-blue mt-1 block">
                  {aircrafts.reduce((acc, a) => acc + (a.totalCapacity || 180), 0).toLocaleString()} Koltuk
                </span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-brand-border shadow-xs">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Ortalama Menzil</span>
                <span className="text-2xl font-black text-purple-600 mt-1 block">
                  {Math.round(aircrafts.reduce((acc, a) => acc + (a.rangeKm || 6000), 0) / (aircrafts.length || 1)).toLocaleString()} km
                </span>
              </div>
            </div>

            {/* Aircraft Cards Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {aircrafts.map((ac) => (
                <div
                  key={ac.id}
                  className="bg-white rounded-3xl border border-brand-border shadow-subtle overflow-hidden flex flex-col justify-between hover:border-brand-blue/40 transition-all group"
                >
                  {/* Photo & Badge Banner */}
                  <div className="relative h-48 sm:h-56 bg-slate-900 overflow-hidden">
                    <img
                      src={ac.imageUrl || 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80'}
                      alt={ac.model}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/30 to-black/30" />

                    {/* Top status & Registration badge */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-mono font-black bg-white/90 backdrop-blur-md text-brand-navy shadow-xs border border-white/40">
                        {ac.registrationNumber}
                      </span>
                      <button
                        onClick={() => {
                          toggleAircraftActive(ac.id);
                          showToast(`${ac.model} durumu değiştirildi!`, 'info');
                        }}
                        className={`px-3 py-1 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer ${
                          ac.isActive
                            ? 'bg-emerald-500/90 hover:bg-emerald-600 text-white'
                            : 'bg-rose-500/90 hover:bg-rose-600 text-white'
                        }`}
                      >
                        {ac.isActive ? '● Uçuşa Hazır (Aktif)' : '○ Bakımda (Pasif)'}
                      </button>
                    </div>

                    {/* Bottom overlay info */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[10px] font-black uppercase tracking-wider text-brand-cyan">
                        {ac.manufacturer} • {ac.aircraftType || 'Dar Gövde'}
                      </span>
                      <h4 className="text-xl sm:text-2xl font-black font-heading leading-tight drop-shadow-md">
                        {ac.model}
                      </h4>
                    </div>
                  </div>

                  {/* Body Specs */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    {/* Technical Pills Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Kapasite</span>
                        <span className="font-extrabold text-brand-navy">{ac.totalCapacity} Yolcu</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Maks. Menzil</span>
                        <span className="font-extrabold text-brand-navy">{ac.rangeKm?.toLocaleString() || '6,300'} km</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Seyir Hızı</span>
                        <span className="font-extrabold text-brand-navy">{ac.cruiseSpeedKmh || '850'} km/s</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase">Kabin Düzeni</span>
                        <span className="font-extrabold text-brand-navy">{ac.businessRows}B + {ac.economyRows}E</span>
                      </div>
                    </div>

                    {/* Engine & Dimensions */}
                    {ac.engineType && (
                      <div className="text-xs text-slate-600 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100/60">
                        <span className="font-bold text-brand-blue">Motor: </span>
                        <span>{ac.engineType}</span>
                        {(ac.wingspanM || ac.lengthM) && (
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            Kanat Açıklığı: {ac.wingspanM || '35.8'}m • Gövde Uzunluğu: {ac.lengthM || '37.6'}m
                          </div>
                        )}
                      </div>
                    )}

                    {/* Cabin Photo Preview if exists */}
                    {ac.cabinImageUrl && (
                      <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="w-14 h-10 rounded-lg overflow-hidden border border-slate-200 shrink-0">
                          <img src={ac.cabinImageUrl} alt="Kabin" className="w-full h-full object-cover" />
                        </div>
                        <div className="text-[11px] text-slate-500">
                          <span className="font-bold text-slate-700 block">Kabin İçi Donanım & Konfor</span>
                          <span>Modern yolcu koltukları ve geniş diz mesafesi</span>
                        </div>
                      </div>
                    )}

                    {/* Features Tags */}
                    {ac.features && ac.features.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                          Kabin & Konfor Donanımları:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {ac.features.map((feat, fIdx) => (
                            <span
                              key={fIdx}
                              className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              ✓ {feat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    {ac.description && (
                      <p className="text-xs text-slate-500 italic line-clamp-2">
                        "{ac.description}"
                      </p>
                    )}

                    {/* Card Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div className="text-[11px] text-slate-400 font-mono">
                        ID: {ac.id} • Koltuklar: {ac.seatsPerRow.join('')}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditAircraft(ac)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-brand-navy rounded-xl text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Düzenle</span>
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`${ac.model} (${ac.registrationNumber}) filodan silinsin mi?`)) {
                              deleteAircraft(ac.id);
                              showToast(`${ac.model} filodan kaldırıldı.`, 'error');
                            }
                          }}
                          className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                          title="Uçağı Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. AIRPORTS TAB */}
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

            {/* Fleet shortcut link */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-subtle flex items-center justify-between">
              <div>
                <h4 className="font-bold text-brand-navy text-sm font-heading">
                  Uçak Filosu ve Kabin Yerleşimi ({aircrafts.length} Uçak Kayıtlı)
                </h4>
                <p className="text-xs text-brand-muted mt-0.5">
                  Her uçağın resimlerini, teknik özelliklerini ve kabin donanımlarını Filo Yönetimi sekmesinden yönetebilirsiniz.
                </p>
              </div>
              <button
                onClick={() => setActiveTab('fleet')}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-brand-navy rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>Filo Sekmesine Git</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
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
                    min={new Date().toISOString().slice(0, 16)}
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
                    min={newDepDate}
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

      {/* Add / Edit Aircraft Modal */}
      {showAddAircraftModal && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-brand-border max-h-[92vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-brand-blue flex items-center justify-center shadow-xs">
                  <Plane className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold font-heading text-brand-navy">
                    {editingAircraft ? 'Uçak Bilgilerini ve Donanımlarını Düzenle' : 'Filoya Yeni Uçak & Model Ekle'}
                  </h3>
                  <p className="text-xs text-brand-muted">
                    Uçağın teknik spesifikasyonları, kabin oturma düzeni ve yüksek çözünürlüklü fotoğrafları
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddAircraftModal(false)}
                className="p-2 text-slate-400 hover:text-brand-navy hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Templates Buttons */}
            <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-2.5">
                ⚡ Hızlı Uçak Şablonları (Tek Tıkla Formu Doldur):
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {AIRCRAFT_TEMPLATES.map((tpl, tIdx) => (
                  <button
                    key={tIdx}
                    type="button"
                    onClick={() => handleApplyAircraftTemplate(tpl)}
                    className="p-2.5 rounded-xl bg-white border border-slate-200 hover:border-brand-blue hover:bg-blue-50/50 text-left transition-all shadow-2xs group cursor-pointer"
                  >
                    <div className="text-xs font-bold text-brand-navy group-hover:text-brand-blue line-clamp-1">
                      {tpl.name}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">
                      {tpl.rangeKm.toLocaleString()} km • {tpl.speedKmh} km/s
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveAircraft} className="space-y-6">
              
              {/* Section 1: Basic Identifiers */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-brand-navy mb-3 flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-brand-blue" />
                  <span>1. Temel Uçak Bilgileri</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                      Uçak Modeli
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Airbus A321-200neo"
                      value={acModel}
                      onChange={(e) => setAcModel(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                      Kuyruk Tescil Kodu
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="TC-RML"
                      value={acReg}
                      onChange={(e) => setAcReg(e.target.value.toUpperCase())}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold uppercase"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                      Üretici Firma
                    </label>
                    <select
                      value={acManufacturer}
                      onChange={(e) => setAcManufacturer(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                    >
                      <option value="Airbus">Airbus</option>
                      <option value="Boeing">Boeing</option>
                      <option value="Embraer">Embraer</option>
                      <option value="Bombardier">Bombardier</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                      Gövde Tipi
                    </label>
                    <select
                      value={acType}
                      onChange={(e) => setAcType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                    >
                      <option value="Dar Gövde (Narrow-Body)">Dar Gövde (Narrow-Body / Tek Koridor)</option>
                      <option value="Geniş Gövde (Wide-Body)">Geniş Gövde (Wide-Body / Çift Koridor)</option>
                      <option value="Bölgesel Jet (Regional Jet)">Bölgesel Jet (Regional Jet)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Photos / Images & Live Preview */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-brand-navy mb-3 flex items-center gap-2">
                  <ImageIcon className="w-3.5 h-3.5 text-brand-blue" />
                  <span>2. Uçak Dış & Kabin Fotoğrafları</span>
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Exterior Photo */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <label className="text-[11px] font-bold text-slate-600 block">
                      Uçak Dış Görseli (Gövde / Havada Fotoğrafı)
                    </label>
                    <div className="relative rounded-xl overflow-hidden border border-slate-300 h-28 bg-slate-900">
                      <img src={acImageUrl} alt="Uçak Dış" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        required
                        placeholder="https://images.unsplash.com/..."
                        value={acImageUrl}
                        onChange={(e) => setAcImageUrl(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[11px] font-mono"
                      />
                      <label className="px-3 py-1.5 bg-white border border-slate-300 hover:border-brand-blue text-brand-navy rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Yükle</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (reader.result) setAcImageUrl(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Cabin Photo */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <label className="text-[11px] font-bold text-slate-600 block">
                      Kabin İçi & Koltuk Düzeni Fotoğrafı
                    </label>
                    <div className="relative rounded-xl overflow-hidden border border-slate-300 h-28 bg-slate-900">
                      <img src={acCabinImageUrl} alt="Kabin İçi" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={acCabinImageUrl}
                        onChange={(e) => setAcCabinImageUrl(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-[11px] font-mono"
                      />
                      <label className="px-3 py-1.5 bg-white border border-slate-300 hover:border-brand-blue text-brand-navy rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Yükle</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = () => {
                                if (reader.result) setAcCabinImageUrl(reader.result as string);
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Technical Specifications */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-brand-navy mb-3 flex items-center gap-2">
                  <Gauge className="w-3.5 h-3.5 text-brand-blue" />
                  <span>3. Teknik & Performans Özellikleri</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                      Maksimum Menzil (km)
                    </label>
                    <input
                      type="number"
                      required
                      value={acRangeKm}
                      onChange={(e) => setAcRangeKm(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                      Seyir Hızı (km/s)
                    </label>
                    <input
                      type="number"
                      required
                      value={acCruiseSpeed}
                      onChange={(e) => setAcCruiseSpeed(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                      Kanat Açıklığı (m)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={acWingspan}
                      onChange={(e) => setAcWingspan(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                      Gövde Uzunluğu (m)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={acLength}
                      onChange={(e) => setAcLength(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                      Motor Modeli & Teknolojisi
                    </label>
                    <input
                      type="text"
                      placeholder="CFM LEAP-1A32 Yüksek Baypaslı Sessiz TurboFan"
                      value={acEngineType}
                      onChange={(e) => setAcEngineType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Section 4: Capacity & Cabin Configuration */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-brand-navy mb-3 flex items-center gap-2">
                  <Maximize2 className="w-3.5 h-3.5 text-brand-blue" />
                  <span>4. Kabin Düzeni ve Koltuk Kapasitesi</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                  <div>
                    <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                      Business Sıra Sayısı
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={acBusinessRows}
                      onChange={(e) => setAcBusinessRows(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                      Ekonomi Sıra Sayısı
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={acEconomyRows}
                      onChange={(e) => setAcEconomyRows(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                      Koltuk Harfleri
                    </label>
                    <input
                      type="text"
                      value={acSeatsPerRow}
                      onChange={(e) => setAcSeatsPerRow(e.target.value)}
                      placeholder="A, B, C, D, E, F"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold"
                    />
                  </div>

                  <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200 text-center">
                    <span className="text-[10px] font-bold text-brand-blue uppercase block">Toplam Kapasite</span>
                    <span className="text-lg font-black text-brand-navy">
                      {(Number(acEconomyRows) + Number(acBusinessRows)) * (acSeatsPerRow.split(',').filter(Boolean).length || 6)} Yolcu
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 5: Features & Amenities */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-brand-navy mb-3 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-brand-blue" />
                  <span>5. Kabin Donanımları & Konfor Özellikleri</span>
                </h4>

                <div className="flex flex-wrap gap-2 mb-3">
                  {COMMON_AIRCRAFT_FEATURES.map((feat, fIdx) => {
                    const isSelected = acFeatures.includes(feat);
                    return (
                      <button
                        key={fIdx}
                        type="button"
                        onClick={() => handleToggleAcFeature(feat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                          isSelected
                            ? 'bg-brand-blue text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <span>{isSelected ? '✓' : '+'}</span>
                        <span>{feat}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Özel donanım yazıp ekleyin (örn: Çift Koridorlu Ekstra Sessiz Kabin)..."
                    value={acCustomFeature}
                    onChange={(e) => setAcCustomFeature(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddCustomAcFeature();
                      }
                    }}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomAcFeature}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Ekle
                  </button>
                </div>
              </div>

              {/* Section 6: Descriptions */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-brand-navy mb-3 flex items-center gap-2">
                  <FileText className="w-3.5 h-3.5 text-brand-blue" />
                  <span>6. Tanıtım Açıklaması</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                      Açıklama (Türkçe)
                    </label>
                    <textarea
                      rows={2}
                      value={acDesc}
                      onChange={(e) => setAcDesc(e.target.value)}
                      placeholder="Uçağın yolculara sunduğu konfor avantajları..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-brand-muted uppercase block mb-1">
                      Açıklama (İngilizce)
                    </label>
                    <textarea
                      rows={2}
                      value={acDescEn}
                      onChange={(e) => setAcDescEn(e.target.value)}
                      placeholder="Passenger comfort and performance details in English..."
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddAircraftModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{editingAircraft ? 'Değişiklikleri Kaydet' : 'Uçağı Filoya Ekle'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
