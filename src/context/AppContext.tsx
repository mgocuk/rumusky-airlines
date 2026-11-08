import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  Language,
  Airport,
  Aircraft,
  Flight,
  Booking,
  Ticket,
  Passenger,
  SearchQuery,
  User,
  UserRole,
  PermissionKey,
  OperationalStatus,
  SiteContentConfig,
  NewsItem,
  Campaign,
  PopularDestination,
  InfoPage
} from '../types';
import { INITIAL_AIRPORTS, INITIAL_AIRCRAFTS, getInitialFlights, syncFlightsWithCurrentTime, INITIAL_CAMPAIGNS, INITIAL_DESTINATIONS } from '../data/seedData';
import { INITIAL_SITE_CONTENT, INITIAL_NEWS, DEFAULT_ROLE_PERMISSIONS, INITIAL_STAFF_USERS, INITIAL_INFO_PAGES } from '../data/seedContent';
import { translations } from '../utils/translations';
import { useToast } from '../components/common/Toast';
import { realtimeSync, SyncAction } from '../services/realtimeSync';

export type AppView = 
  | 'home' 
  | 'results' 
  | 'passengers' 
  | 'seats' 
  | 'checkout' 
  | 'confirmation' 
  | 'manage' 
  | 'account' 
  | 'checkin'
  | 'news'
  | 'admin';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['tr']) => string;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  airports: Airport[];
  aircrafts: Aircraft[];
  flights: Flight[];
  bookings: Booking[];
  tickets: Ticket[];
  campaigns: Campaign[];
  destinations: PopularDestination[];
  siteContent: SiteContentConfig;
  updateSiteContent: (content: Partial<SiteContentConfig>) => void;
  news: NewsItem[];
  addNewsItem: (item: Omit<NewsItem, 'id' | 'publishedAt'>) => void;
  updateNewsItem: (id: string, item: Partial<NewsItem>) => void;
  deleteNewsItem: (id: string) => void;
  selectedNewsArticle: NewsItem | null;
  setSelectedNewsArticle: (item: NewsItem | null) => void;
  // Info Pages & Footer Modals
  infoPages: InfoPage[];
  updateInfoPage: (id: string, updated: Partial<InfoPage>) => void;
  selectedInfoPage: InfoPage | null;
  setSelectedInfoPage: (page: InfoPage | null) => void;
  openInfoPageBySlug: (slug: string) => void;
  // Aircraft & Fleet Management
  addAircraft: (aircraft: Omit<Aircraft, 'id'>) => void;
  updateAircraft: (id: string, updated: Partial<Aircraft>) => void;
  deleteAircraft: (id: string) => void;
  toggleAircraftActive: (id: string) => void;
  // Role & Permissions (RBAC)
  rolePermissions: Record<UserRole, PermissionKey[]>;
  updateRolePermissions: (role: UserRole, perms: PermissionKey[]) => void;
  hasPermission: (perm: PermissionKey) => boolean;
  staffUsers: User[];
  addStaffUser: (user: Omit<User, 'id'>) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  deleteStaffUser: (userId: string) => void;
  switchActiveStaffRole: (role: UserRole) => void;
  // Dynamic Campaigns & Destinations
  updateCampaign: (id: string, updated: Partial<Campaign>) => void;
  updateDestination: (id: string, updated: Partial<PopularDestination>) => void;
  // Booking Flow
  searchQuery: SearchQuery | null;
  selectedFlight: Flight | null;
  passengers: Passenger[];
  contactEmail: string;
  contactPhone: string;
  selectedSeats: Record<string, string>;
  currentBooking: Booking | null;
  activeUser: User | null;
  isAdmin: boolean;
  toggleAdminMode: () => void;
  setSearchQuery: (query: SearchQuery) => void;
  selectFlightForBooking: (flight: Flight) => void;
  setPassengerDetails: (passengers: Passenger[], email: string, phone: string) => void;
  assignSeat: (passengerId: string, seatNumber: string) => void;
  completePayment: (cardInfo: { cardLastFour: string; cardBrand: string }) => Booking;
  findBooking: (pnr: string, surname: string) => Booking | null;
  getTicketsForBooking: (bookingId: string) => Ticket[];
  // Multi-User Realtime Sync & Share
  connectedClientsCount: number;
  isRealtimeConnected: boolean;
  shareModalOpen: boolean;
  setShareModalOpen: (open: boolean) => void;
  // Modals & Enhanced Features
  flightDetailsModal: Flight | null;
  setFlightDetailsModal: (flight: Flight | null) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  loginStaff: (email: string, password?: string) => { success: boolean; message?: string };
  loginUser: (email: string, name: string) => void;
  logoutUser: () => void;
  checkinFlight: (pnr: string, surname: string) => Ticket | null;
  // Admin actions
  addFlight: (flight: Omit<Flight, 'id' | 'availableEconomySeats' | 'availableBusinessSeats'>) => void;
  updateFlightStatus: (flightId: string, status: OperationalStatus) => void;
  cancelFlight: (flightId: string) => void;
  cancelBooking: (bookingId: string) => void;
  syncAllFlights: () => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  LANGUAGE: 'rumusky_lang',
  FLIGHTS: 'rumusky_flights',
  BOOKINGS: 'rumusky_bookings',
  TICKETS: 'rumusky_tickets',
  AIRPORTS: 'rumusky_airports',
  AIRCRAFTS: 'rumusky_aircrafts',
  CAMPAIGNS: 'rumusky_campaigns',
  DESTINATIONS: 'rumusky_destinations',
  SITE_CONTENT: 'rumusky_site_content',
  NEWS: 'rumusky_news',
  INFO_PAGES: 'rumusky_info_pages',
  ROLE_PERMISSIONS: 'rumusky_role_permissions',
  STAFF_USERS: 'rumusky_staff_users',
  USER: 'rumusky_user'
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Language
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem(STORAGE_KEYS.LANGUAGE) as Language) || 'tr';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEYS.LANGUAGE, lang);
  };

  const t = (key: keyof typeof translations['tr']): string => {
    const dict = translations[language] || translations.tr;
    return (dict as any)[key] || (translations.tr as any)[key] || key;
  };

  // View state
  const [activeView, setActiveView] = useState<AppView>('home');
  const [selectedNewsArticle, setSelectedNewsArticle] = useState<NewsItem | null>(null);

  // Persistence State
  const [airports, setAirports] = useState<Airport[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AIRPORTS);
    return saved ? JSON.parse(saved) : INITIAL_AIRPORTS;
  });

  const [aircrafts, setAircrafts] = useState<Aircraft[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AIRCRAFTS);
    if (saved) {
      try {
        const parsed: Aircraft[] = JSON.parse(saved);
        // Ensure initial aircrafts have the new rich photo and spec fields
        const enriched = parsed.map((ac) => {
          const match = INITIAL_AIRCRAFTS.find((init) => init.id === ac.id);
          if (match && !ac.imageUrl) {
            return { ...match, ...ac, imageUrl: match.imageUrl, cabinImageUrl: match.cabinImageUrl, features: match.features, rangeKm: match.rangeKm, cruiseSpeedKmh: match.cruiseSpeedKmh, engineType: match.engineType, description: match.description };
          }
          return ac;
        });
        // If initial wide-body like ac-3 is missing in saved, append it
        INITIAL_AIRCRAFTS.forEach((init) => {
          if (!enriched.some((ac) => ac.id === init.id)) {
            enriched.push(init);
          }
        });
        return enriched;
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_AIRCRAFTS;
  });

  const [flights, setFlights] = useState<Flight[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FLIGHTS);
    const initialList = saved ? JSON.parse(saved) : getInitialFlights();
    return syncFlightsWithCurrentTime(initialList);
  });

  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
    return saved ? JSON.parse(saved) : INITIAL_CAMPAIGNS;
  });

  const [destinations, setDestinations] = useState<PopularDestination[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DESTINATIONS);
    return saved ? JSON.parse(saved) : INITIAL_DESTINATIONS;
  });

  const [siteContent, setSiteContent] = useState<SiteContentConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SITE_CONTENT);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.heroBackgroundUrl && parsed.heroBackgroundUrl.includes('photo-1542296332')) {
          parsed.heroBackgroundUrl = INITIAL_SITE_CONTENT.heroBackgroundUrl;
        }
        parsed.companyName = parsed.companyName || INITIAL_SITE_CONTENT.companyName;
        parsed.companySubtitle = parsed.companySubtitle || INITIAL_SITE_CONTENT.companySubtitle;
        parsed.customLogoUrl = parsed.customLogoUrl || '';
        parsed.navbar = {
          ...INITIAL_SITE_CONTENT.navbar,
          ...(parsed.navbar || {})
        };
        return parsed;
      } catch (e) {
        // fallback
      }
    }
    return INITIAL_SITE_CONTENT;
  });

  const [news, setNews] = useState<NewsItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NEWS);
    return saved ? JSON.parse(saved) : INITIAL_NEWS;
  });

  const [infoPages, setInfoPages] = useState<InfoPage[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INFO_PAGES);
    return saved ? JSON.parse(saved) : INITIAL_INFO_PAGES;
  });

  const [selectedInfoPage, setSelectedInfoPage] = useState<InfoPage | null>(null);

  const [rolePermissions, setRolePermissions] = useState<Record<UserRole, PermissionKey[]>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ROLE_PERMISSIONS);
    return saved ? JSON.parse(saved) : DEFAULT_ROLE_PERMISSIONS;
  });

  const [staffUsers, setStaffUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STAFF_USERS);
    return saved ? JSON.parse(saved) : INITIAL_STAFF_USERS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return saved ? JSON.parse(saved) : [];
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TICKETS);
    return saved ? JSON.parse(saved) : [];
  });

  // Booking Flow State
  const [searchQuery, setSearchQueryState] = useState<SearchQuery | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [selectedSeats, setSelectedSeats] = useState<Record<string, string>>({});
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);

  // Modals
  const [flightDetailsModal, setFlightDetailsModal] = useState<Flight | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // User & Admin Mode
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [activeUser, setActiveUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USER);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.role && parsed.role !== 'customer' && parsed.isExplicitLogin) {
          return parsed;
        }
      } catch (e) {
        // ignore
      }
    }
    localStorage.removeItem(STORAGE_KEYS.USER);
    return null;
  });

  const { showToast } = useToast();

  // Multi-user & Share state
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [connectedClientsCount, setConnectedClientsCount] = useState(realtimeSync.getConnectedClientsCount());
  const [isRealtimeConnected, setIsRealtimeConnected] = useState(realtimeSync.getIsConnected());

  // Real-time synchronization lifecycle
  useEffect(() => {
    // 1. Connection status listener
    const unsubscribeConn = realtimeSync.onConnectionChange((connected, count) => {
      setIsRealtimeConnected(connected);
      setConnectedClientsCount(count);
    });

    // 2. Fetch server state on initial load
    realtimeSync.fetchServerState().then((serverState) => {
      if (serverState && Object.keys(serverState).length > 0) {
        if (serverState.flights) setFlights(serverState.flights);
        if (serverState.bookings) setBookings(serverState.bookings);
        if (serverState.tickets) setTickets(serverState.tickets);
        if (serverState.siteContent) setSiteContent(serverState.siteContent);
        if (serverState.news) setNews(serverState.news);
        if (serverState.airports) setAirports(serverState.airports);
        if (serverState.aircrafts) setAircrafts(serverState.aircrafts);
        if (serverState.infoPages) setInfoPages(serverState.infoPages);
        if (serverState.rolePermissions) setRolePermissions(serverState.rolePermissions);
        if (serverState.staffUsers) setStaffUsers(serverState.staffUsers);
      } else {
        // Server store is empty, push client's state to server
        realtimeSync.initializeServerStateIfEmpty({
          flights,
          bookings,
          tickets,
          siteContent,
          news,
          airports,
          aircrafts,
          infoPages,
          rolePermissions,
          staffUsers
        });
      }
    });

    // 3. Listen to incoming sync actions from other clients / server
    const unsubscribeSync = realtimeSync.subscribe((action: SyncAction) => {
      const { type, payload } = action;

      switch (type) {
        case 'BOOKING_CREATED': {
          const { booking, tickets: newTickets, updatedFlight } = payload;
          if (booking) {
            setBookings((prev) => [booking, ...prev.filter((b) => b.id !== booking.id)]);
          }
          if (newTickets && Array.isArray(newTickets)) {
            const ids = new Set(newTickets.map((t: any) => t.id));
            setTickets((prev) => [...newTickets, ...prev.filter((t) => !ids.has(t.id))]);
          }
          if (updatedFlight) {
            setFlights((prev) => prev.map((f) => (f.id === updatedFlight.id ? { ...f, ...updatedFlight } : f)));
          }
          showToast(
            `⚡ Canlı Rezervasyon: PNR: ${booking?.pnr} - ${booking?.passengers?.[0]?.firstName || 'Yolcu'} ${booking?.passengers?.[0]?.lastName || ''} (${booking?.passengers?.length || 1} Bilet Satın Alındı)`,
            'info'
          );
          break;
        }

        case 'BOOKING_CANCELLED': {
          const { bookingId, pnr, updatedFlight } = payload;
          if (bookingId) {
            setBookings((prev) => prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b)));
          }
          if (updatedFlight) {
            setFlights((prev) => prev.map((f) => (f.id === updatedFlight.id ? { ...f, ...updatedFlight } : f)));
          }
          showToast(`⚡ Canlı Bildirim: ${pnr} PNR'lı rezervasyon iptal edildi.`, 'info');
          break;
        }

        case 'CHECKIN_COMPLETED': {
          const { ticketId, seatNumber, pnr, passengerName } = payload;
          if (ticketId) {
            setTickets((prev) =>
              prev.map((t) =>
                t.id === ticketId
                  ? { ...t, status: 'checked_in', seatNumber: seatNumber || t.seatNumber }
                  : t
              )
            );
          }
          showToast(`⚡ Canlı Check-in: PNR: ${pnr} - ${passengerName || 'Yolcu'} koltuğu: ${seatNumber}`, 'info');
          break;
        }

        case 'SITE_CONTENT_UPDATED': {
          setSiteContent((prev) => ({ ...prev, ...payload }));
          showToast(`⚡ Canlı Güncelleme: Firma adı, logo ve üst menü ayarları güncellendi.`, 'success');
          break;
        }

        case 'FLIGHT_ADDED': {
          if (payload.flight) {
            setFlights((prev) => [payload.flight, ...prev.filter((f) => f.id !== payload.flight.id)]);
            showToast(`⚡ Canlı Güncelleme: Yeni uçuş seferi eklendi (${payload.flight.flightNumber})`, 'success');
          }
          break;
        }

        case 'FLIGHT_CANCELLED': {
          if (payload.flightId) {
            setFlights((prev) =>
              prev.map((f) =>
                f.id === payload.flightId
                  ? { ...f, bookingStatus: 'closed', operationalStatus: 'Cancelled' }
                  : f
              )
            );
            showToast(`⚡ Canlı Güncelleme: Bir uçuş seferi iptal edildi.`, 'info');
          }
          break;
        }

        case 'FLIGHTS_UPDATED': {
          if (Array.isArray(payload.flights)) {
            setFlights(payload.flights);
            if (payload.actionDescription) {
              showToast(`⚡ Canlı Güncelleme: ${payload.actionDescription}`, 'info');
            }
          }
          break;
        }

        case 'AIRCRAFTS_UPDATED': {
          if (Array.isArray(payload.aircrafts)) {
            setAircrafts(payload.aircrafts);
            showToast(`⚡ Canlı Güncelleme: Uçak filosu güncellendi.`, 'info');
          }
          break;
        }

        case 'AIRPORT_ADDED': {
          if (payload.airport) {
            setAirports((prev) => [...prev, payload.airport]);
            showToast(`⚡ Canlı Güncelleme: Yeni havalimanı eklendi (${payload.airport.iataCode})`, 'info');
          }
          break;
        }

        case 'NEWS_UPDATED': {
          if (Array.isArray(payload.news)) {
            setNews(payload.news);
            showToast(`⚡ Canlı Güncelleme: Haber ve basın bültenleri güncellendi.`, 'info');
          }
          break;
        }

        case 'INFO_PAGE_UPDATED': {
          if (payload.page) {
            setInfoPages((prev) => prev.map((p) => (p.id === payload.page.id ? { ...p, ...payload.page } : p)));
          }
          break;
        }

        case 'ROLE_PERMISSIONS_UPDATED': {
          if (payload.rolePermissions) {
            setRolePermissions(payload.rolePermissions);
            showToast(`⚡ Canlı Güncelleme: Rol yetki matrisi güncellendi.`, 'info');
          }
          break;
        }

        case 'STAFF_USERS_UPDATED': {
          if (Array.isArray(payload.staffUsers)) {
            setStaffUsers(payload.staffUsers);
            showToast(`⚡ Canlı Güncelleme: Personel listesi güncellendi.`, 'info');
          }
          break;
        }

        case 'RESET_ALL_DATA': {
          window.location.reload();
          break;
        }

        default:
          break;
      }
    });

    return () => {
      unsubscribeConn();
      unsubscribeSync();
    };
  }, []);

  // Local Storage Sync
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AIRCRAFTS, JSON.stringify(aircrafts));
  }, [aircrafts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FLIGHTS, JSON.stringify(flights));
  }, [flights]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SITE_CONTENT, JSON.stringify(siteContent));
  }, [siteContent]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(news));
  }, [news]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INFO_PAGES, JSON.stringify(infoPages));
  }, [infoPages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(campaigns));
  }, [campaigns]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DESTINATIONS, JSON.stringify(destinations));
  }, [destinations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ROLE_PERMISSIONS, JSON.stringify(rolePermissions));
  }, [rolePermissions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STAFF_USERS, JSON.stringify(staffUsers));
  }, [staffUsers]);

  // Permission Checker
  const hasPermission = (perm: PermissionKey): boolean => {
    if (!activeUser) return false;
    if (activeUser.role === 'super_admin') return true;
    const userPerms = rolePermissions[activeUser.role] || [];
    return userPerms.includes(perm);
  };

  const updateRolePermissions = (role: UserRole, perms: PermissionKey[]) => {
    setRolePermissions((prev) => {
      const next = {
        ...prev,
        [role]: perms
      };
      realtimeSync.dispatchAction('ROLE_PERMISSIONS_UPDATED', { rolePermissions: next });
      return next;
    });
  };

  const updateSiteContent = (updated: Partial<SiteContentConfig>) => {
    setSiteContent((prev) => ({ ...prev, ...updated }));
    realtimeSync.dispatchAction('SITE_CONTENT_UPDATED', updated);
  };

  const addNewsItem = (item: Omit<NewsItem, 'id' | 'publishedAt'>) => {
    const newItem: NewsItem = {
      ...item,
      id: `news-${Date.now()}`,
      publishedAt: new Date().toISOString().split('T')[0]
    };
    setNews((prev) => {
      const next = [newItem, ...prev];
      realtimeSync.dispatchAction('NEWS_UPDATED', { news: next });
      return next;
    });
  };

  const updateNewsItem = (id: string, updated: Partial<NewsItem>) => {
    setNews((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, ...updated } : n));
      realtimeSync.dispatchAction('NEWS_UPDATED', { news: next });
      return next;
    });
  };

  const deleteNewsItem = (id: string) => {
    setNews((prev) => {
      const next = prev.filter((n) => n.id !== id);
      realtimeSync.dispatchAction('NEWS_UPDATED', { news: next });
      return next;
    });
  };

  const updateInfoPage = (id: string, updated: Partial<InfoPage>) => {
    setInfoPages((prev) => {
      const next = prev.map((p) =>
        p.id === id || p.slug === id
          ? { ...p, ...updated, lastUpdated: new Date().toISOString().split('T')[0] }
          : p
      );
      const targetPage = next.find((p) => p.id === id || p.slug === id);
      if (targetPage) {
        realtimeSync.dispatchAction('INFO_PAGE_UPDATED', { page: targetPage });
      }
      return next;
    });
  };

  const openInfoPageBySlug = (slug: string) => {
    const page = infoPages.find((p) => p.slug === slug || p.id === slug);
    if (page) {
      setSelectedInfoPage(page);
    }
  };

  const addAircraft = (newAc: Omit<Aircraft, 'id'>) => {
    const created: Aircraft = {
      ...newAc,
      id: `ac-${Date.now()}`
    };
    setAircrafts((prev) => {
      const next = [created, ...prev];
      realtimeSync.dispatchAction('AIRCRAFTS_UPDATED', { aircrafts: next });
      return next;
    });
  };

  const updateAircraft = (id: string, updated: Partial<Aircraft>) => {
    setAircrafts((prev) => {
      const next = prev.map((ac) => (ac.id === id ? { ...ac, ...updated } : ac));
      realtimeSync.dispatchAction('AIRCRAFTS_UPDATED', { aircrafts: next });
      return next;
    });
  };

  const deleteAircraft = (id: string) => {
    setAircrafts((prev) => {
      const next = prev.filter((ac) => ac.id !== id);
      realtimeSync.dispatchAction('AIRCRAFTS_UPDATED', { aircrafts: next });
      return next;
    });
  };

  const toggleAircraftActive = (id: string) => {
    setAircrafts((prev) => {
      const next = prev.map((ac) => (ac.id === id ? { ...ac, isActive: !ac.isActive } : ac));
      realtimeSync.dispatchAction('AIRCRAFTS_UPDATED', { aircrafts: next });
      return next;
    });
  };

  const updateCampaign = (id: string, updated: Partial<Campaign>) => {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
  };

  const updateDestination = (id: string, updated: Partial<PopularDestination>) => {
    setDestinations((prev) => prev.map((d) => (d.id === id ? { ...d, ...updated } : d)));
  };

  const addStaffUser = (newUser: Omit<User, 'id'>) => {
    const user: User = {
      ...newUser,
      id: `usr-staff-${Date.now()}`
    };
    setStaffUsers((prev) => {
      const next = [...prev, user];
      realtimeSync.dispatchAction('STAFF_USERS_UPDATED', { staffUsers: next });
      return next;
    });
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setStaffUsers((prev) => {
      const next = prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
      realtimeSync.dispatchAction('STAFF_USERS_UPDATED', { staffUsers: next });
      return next;
    });
    if (activeUser && activeUser.id === userId) {
      setActiveUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }
  };

  const deleteStaffUser = (userId: string) => {
    setStaffUsers((prev) => {
      const next = prev.filter((u) => u.id !== userId);
      realtimeSync.dispatchAction('STAFF_USERS_UPDATED', { staffUsers: next });
      return next;
    });
  };

  const switchActiveStaffRole = (role: UserRole) => {
    const matchingStaff = staffUsers.find((u) => u.role === role) || {
      id: `usr-${role}`,
      name: role.toUpperCase(),
      surname: 'Yetkilisi',
      email: `${role}@rumusky.com`,
      role
    };
    setActiveUser(matchingStaff);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(matchingStaff));
  };

  const loginStaff = (email: string, password?: string): { success: boolean; message?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      return { success: false, message: 'Lütfen yetkili e-posta adresinizi giriniz.' };
    }

    // 1. Look up matching staff in staffUsers list
    const matchingStaff = staffUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    let assignedRole: UserRole | null = null;
    let staffName = 'Yetkili';
    let staffSurname = 'Personel';

    if (matchingStaff) {
      assignedRole = matchingStaff.role;
      staffName = matchingStaff.name;
      staffSurname = matchingStaff.surname;
    } else if (cleanEmail.includes('admin') || cleanEmail.includes('super')) {
      assignedRole = 'super_admin';
      staffName = 'Süper';
      staffSurname = 'Admin';
    } else if (cleanEmail.includes('ops') || cleanEmail.includes('flight') || cleanEmail.includes('sefer')) {
      assignedRole = 'flight_manager';
      staffName = 'Uçuş';
      staffSurname = 'Şefi';
    } else if (cleanEmail.includes('booking') || cleanEmail.includes('bilet') || cleanEmail.includes('rezervasyon')) {
      assignedRole = 'booking_manager';
      staffName = 'Rezervasyon';
      staffSurname = 'Sorumlusu';
    } else if (cleanEmail.includes('editor') || cleanEmail.includes('content') || cleanEmail.includes('basin') || cleanEmail.includes('haber')) {
      assignedRole = 'content_manager';
      staffName = 'İçerik';
      staffSurname = 'Editörü';
    } else {
      return {
        success: false,
        message: 'Bu e-posta adresi yetkili personel sisteminde kayıtlı değildir.'
      };
    }

    const sessionUser: User & { isExplicitLogin: boolean } = {
      id: matchingStaff ? matchingStaff.id : `usr-staff-${Date.now()}`,
      name: staffName,
      surname: staffSurname,
      email: cleanEmail,
      role: assignedRole,
      isExplicitLogin: true
    };

    setActiveUser(sessionUser);
    setIsAdmin(true);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(sessionUser));
    setAuthModalOpen(false);
    setActiveView('admin');
    return { success: true };
  };

  const loginUser = (email: string, name: string) => {
    loginStaff(email);
  };

  const logoutUser = () => {
    setActiveUser(null);
    setIsAdmin(false);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setActiveView('home');
  };

  const toggleAdminMode = () => {
    if (!activeUser || activeUser.role === 'customer') {
      setAuthModalOpen(true);
      return;
    }
    setIsAdmin((prev) => {
      const next = !prev;
      setActiveView(next ? 'admin' : 'home');
      return next;
    });
  };

  // Actions
  const setSearchQuery = (query: SearchQuery) => {
    setSearchQueryState(query);
    setActiveView('results');
  };

  const selectFlightForBooking = (flight: Flight) => {
    setSelectedFlight(flight);
    const adultCount = searchQuery?.adults || 1;
    const initialPassengers: Passenger[] = [];
    for (let i = 0; i < adultCount; i++) {
      initialPassengers.push({
        id: `p-${Date.now()}-${i}`,
        firstName: '',
        lastName: '',
        gender: 'M',
        dateOfBirth: '1995-05-15',
        passengerType: 'adult',
        nationality: 'TR',
        idOrPassportNo: '',
        cabinClass: searchQuery?.cabinClass || 'economy'
      });
    }
    setPassengers(initialPassengers);
    setSelectedSeats({});
    setActiveView('passengers');
  };

  const setPassengerDetails = (newPassengers: Passenger[], email: string, phone: string) => {
    setPassengers(newPassengers);
    setContactEmail(email);
    setContactPhone(phone);
    setActiveView('seats');
  };

  const assignSeat = (passengerId: string, seatNumber: string) => {
    setSelectedSeats((prev) => {
      const copy = { ...prev };
      Object.keys(copy).forEach((pid) => {
        if (copy[pid] === seatNumber) delete copy[pid];
      });
      copy[passengerId] = seatNumber;
      return copy;
    });
  };

  // Generate unique 6-character PNR (e.g. RMK84X)
  const generateUniquePnr = (): string => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let pnr = 'RMK';
    for (let i = 0; i < 3; i++) {
      pnr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pnr;
  };

  const completePayment = (cardInfo: { cardLastFour: string; cardBrand: string }): Booking => {
    if (!selectedFlight) throw new Error('No flight selected');

    const pnr = generateUniquePnr();
    const isBusiness = searchQuery?.cabinClass === 'business';
    const basePricePerPerson = isBusiness ? selectedFlight.priceBusiness : selectedFlight.priceEconomy;
    const taxPerPerson = Math.round(basePricePerPerson * 0.18);
    const subtotal = (basePricePerPerson + taxPerPerson) * passengers.length;
    
    let seatSurcharges = 0;
    Object.values(selectedSeats).forEach((seat) => {
      if (seat.endsWith('A') || seat.endsWith('F')) seatSurcharges += 100;
      if (seat.startsWith('12') || seat.startsWith('13')) seatSurcharges += 250;
    });

    const totalAmount = subtotal + seatSurcharges;

    const newBooking: Booking = {
      id: `bk-${Date.now()}`,
      pnr,
      flightId: selectedFlight.id,
      passengers: passengers.map((p) => ({
        ...p,
        selectedSeat: selectedSeats[p.id] || 'Girişte Belirlenecek'
      })),
      contactEmail,
      contactPhone,
      totalAmount,
      currency: '₺',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      paymentDetails: {
        id: `pay-${Date.now()}`,
        bookingId: `bk-${Date.now()}`,
        transactionRef: `TRX-${Date.now()}`,
        cardLastFour: cardInfo.cardLastFour,
        cardBrand: cardInfo.cardBrand,
        amount: totalAmount,
        currency: '₺',
        status: 'successful',
        paidAt: new Date().toISOString()
      }
    };

    const newTickets: Ticket[] = newBooking.passengers.map((passenger, index) => {
      const ticketNum = `235-${Math.floor(1000000000 + Math.random() * 9000000000)}`;
      return {
        id: `tkt-${Date.now()}-${index}`,
        ticketNumber: ticketNum,
        bookingId: newBooking.id,
        pnr: newBooking.pnr,
        passenger,
        flight: selectedFlight,
        seatNumber: passenger.selectedSeat || 'TBA',
        cabinClass: passenger.cabinClass,
        baggageKg: selectedFlight.baggageAllowanceKg,
        qrCodeData: `RUMUSKY-TICKET|${newBooking.pnr}|${ticketNum}|${passenger.firstName} ${passenger.lastName}|${selectedFlight.flightNumber}|${selectedFlight.originAirport.iataCode}-${selectedFlight.destinationAirport.iataCode}`,
        status: 'issued',
        issuedAt: new Date().toISOString()
      };
    });

    const updatedFlightObj: Flight = {
      ...selectedFlight,
      availableEconomySeats: Math.max(0, selectedFlight.availableEconomySeats - passengers.length)
    };

    setFlights((prev) =>
      prev.map((f) => (f.id === selectedFlight.id ? updatedFlightObj : f))
    );

    setBookings((prev) => [newBooking, ...prev]);
    setTickets((prev) => [...newTickets, ...prev]);
    setCurrentBooking(newBooking);
    setActiveView('confirmation');

    // Broadcast across all clients in real-time
    realtimeSync.dispatchAction('BOOKING_CREATED', {
      booking: newBooking,
      tickets: newTickets,
      updatedFlight: updatedFlightObj,
      bookedSeats: Object.values(selectedSeats)
    });

    return newBooking;
  };

  const findBooking = (pnr: string, surname: string): Booking | null => {
    const cleanPnr = pnr.trim().toUpperCase();
    const cleanSurname = surname.trim().toLowerCase();

    const found = bookings.find((b) => {
      const matchesPnr = b.pnr.toUpperCase() === cleanPnr;
      const matchesSurname = b.passengers.some(
        (p) => p.lastName.trim().toLowerCase() === cleanSurname
      );
      return matchesPnr && matchesSurname;
    });

    return found || null;
  };

  const checkinFlight = (pnr: string, surname: string): Ticket | null => {
    const booking = findBooking(pnr, surname);
    if (!booking) return null;

    const bookedFlight = flights.find((f) => f.id === booking.flightId);
    // Cannot check in for past expired flights
    if (bookedFlight && new Date(bookedFlight.departureTime).getTime() <= Date.now()) {
      return null;
    }

    const userTicket = tickets.find((t) => t.bookingId === booking.id);
    if (userTicket) {
      setTickets((prev) =>
        prev.map((t) => (t.id === userTicket.id ? { ...t, status: 'checked_in' } : t))
      );

      realtimeSync.dispatchAction('CHECKIN_COMPLETED', {
        ticketId: userTicket.id,
        seatNumber: userTicket.seatNumber,
        pnr: booking.pnr,
        passengerName: `${userTicket.passenger.firstName} ${userTicket.passenger.lastName}`
      });

      return { ...userTicket, status: 'checked_in' };
    }
    return null;
  };

  const getTicketsForBooking = (bookingId: string): Ticket[] => {
    return tickets.filter((t) => t.bookingId === bookingId);
  };

  const syncAllFlights = () => {
    setFlights((prev) => syncFlightsWithCurrentTime(prev));
  };

  // Admin Actions
  const addFlight = (newFlightData: Omit<Flight, 'id' | 'availableEconomySeats' | 'availableBusinessSeats'>) => {
    const newFlight: Flight = {
      ...newFlightData,
      id: `fl-${Date.now()}`,
      availableEconomySeats: 150,
      availableBusinessSeats: 18
    };
    setFlights((prev) => {
      const next = [newFlight, ...prev];
      realtimeSync.dispatchAction('FLIGHT_ADDED', { flight: newFlight });
      return next;
    });
  };

  const updateFlightStatus = (flightId: string, status: OperationalStatus) => {
    setFlights((prev) => {
      const next = prev.map((f) => (f.id === flightId ? { ...f, operationalStatus: status } : f));
      realtimeSync.dispatchAction('FLIGHTS_UPDATED', {
        flights: next,
        actionDescription: `Uçuş durumu güncellendi: ${status}`
      });
      return next;
    });
  };

  const cancelFlight = (flightId: string) => {
    setFlights((prev) => {
      const next = prev.map((f) => (f.id === flightId ? { ...f, operationalStatus: 'Cancelled' as const, bookingStatus: 'closed' as const } : f));
      realtimeSync.dispatchAction('FLIGHT_CANCELLED', { flightId });
      return next;
    });
  };

  const cancelBooking = (bookingId: string) => {
    const target = bookings.find((b) => b.id === bookingId);
    let updatedF: Flight | undefined;
    if (target && target.status !== 'cancelled') {
      const flight = flights.find((f) => f.id === target.flightId);
      if (flight) {
        updatedF = {
          ...flight,
          availableEconomySeats: Math.min(180, flight.availableEconomySeats + target.passengers.length)
        };
        setFlights((prev) => prev.map((f) => (f.id === flight.id ? updatedF! : f)));
      }
    }

    setBookings((prev) => {
      const next = prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' as const } : b));
      realtimeSync.dispatchAction('BOOKING_CANCELLED', {
        bookingId,
        pnr: target?.pnr || '',
        updatedFlight: updatedF
      });
      return next;
    });
  };

  const resetAllData = () => {
    localStorage.clear();
    setAirports(INITIAL_AIRPORTS);
    setAircrafts(INITIAL_AIRCRAFTS);
    setFlights(getInitialFlights());
    setCampaigns(INITIAL_CAMPAIGNS);
    setDestinations(INITIAL_DESTINATIONS);
    setSiteContent(INITIAL_SITE_CONTENT);
    setNews(INITIAL_NEWS);
    setInfoPages(INITIAL_INFO_PAGES);
    setSelectedInfoPage(null);
    setRolePermissions(DEFAULT_ROLE_PERMISSIONS);
    setStaffUsers(INITIAL_STAFF_USERS);
    setBookings([]);
    setTickets([]);
    setActiveView('home');
    realtimeSync.dispatchAction('RESET_ALL_DATA', {});
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        activeView,
        setActiveView,
        airports,
        aircrafts,
        addAircraft,
        updateAircraft,
        deleteAircraft,
        toggleAircraftActive,
        flights,
        bookings,
        tickets,
        campaigns,
        destinations,
        siteContent,
        updateSiteContent,
        news,
        addNewsItem,
        updateNewsItem,
        deleteNewsItem,
        selectedNewsArticle,
        setSelectedNewsArticle,
        infoPages,
        updateInfoPage,
        selectedInfoPage,
        setSelectedInfoPage,
        openInfoPageBySlug,
        rolePermissions,
        updateRolePermissions,
        hasPermission,
        staffUsers,
        addStaffUser,
        updateUserRole,
        deleteStaffUser,
        switchActiveStaffRole,
        updateCampaign,
        updateDestination,
        searchQuery,
        selectedFlight,
        passengers,
        contactEmail,
        contactPhone,
        selectedSeats,
        currentBooking,
        activeUser,
        isAdmin,
        toggleAdminMode,
        setSearchQuery,
        selectFlightForBooking,
        setPassengerDetails,
        assignSeat,
        completePayment,
        findBooking,
        getTicketsForBooking,
        connectedClientsCount,
        isRealtimeConnected,
        shareModalOpen,
        setShareModalOpen,
        flightDetailsModal,
        setFlightDetailsModal,
        authModalOpen,
        setAuthModalOpen,
        loginStaff,
        loginUser,
        logoutUser,
        checkinFlight,
        addFlight,
        updateFlightStatus,
        cancelFlight,
        cancelBooking,
        syncAllFlights,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
