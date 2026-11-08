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
  OperationalStatus
} from '../types';
import { INITIAL_AIRPORTS, INITIAL_AIRCRAFTS, getInitialFlights } from '../data/seedData';
import { translations } from '../utils/translations';

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
  searchQuery: SearchQuery | null;
  selectedFlight: Flight | null;
  passengers: Passenger[];
  contactEmail: string;
  contactPhone: string;
  selectedSeats: Record<string, string>; // passengerId -> seatNumber
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
  // Modals & Enhanced Features
  flightDetailsModal: Flight | null;
  setFlightDetailsModal: (flight: Flight | null) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  loginUser: (email: string, name: string) => void;
  logoutUser: () => void;
  checkinFlight: (pnr: string, surname: string) => Ticket | null;
  // Admin actions
  addFlight: (flight: Omit<Flight, 'id' | 'availableEconomySeats' | 'availableBusinessSeats'>) => void;
  updateFlightStatus: (flightId: string, status: OperationalStatus) => void;
  cancelFlight: (flightId: string) => void;
  cancelBooking: (bookingId: string) => void;
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

  // Persistence State
  const [airports, setAirports] = useState<Airport[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AIRPORTS);
    return saved ? JSON.parse(saved) : INITIAL_AIRPORTS;
  });

  const [aircrafts, setAircrafts] = useState<Aircraft[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AIRCRAFTS);
    return saved ? JSON.parse(saved) : INITIAL_AIRCRAFTS;
  });

  const [flights, setFlights] = useState<Flight[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FLIGHTS);
    return saved ? JSON.parse(saved) : getInitialFlights();
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    return saved ? JSON.parse(saved) : [];
  });

  const [tickets, setTickets] = useState<Ticket[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TICKETS);
    return saved ? JSON.parse(saved) : [];
  });

  // Current Booking Flow State
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
    return saved ? JSON.parse(saved) : {
      id: 'usr-1',
      name: 'Mustafa',
      surname: 'Göçük',
      email: 'mustafa.gocuk@rumusky.com',
      role: 'customer'
    };
  });

  const loginUser = (email: string, name: string) => {
    const user: User = {
      id: `usr-${Date.now()}`,
      name: name || 'Demo',
      surname: 'Yolcu',
      email,
      role: 'customer'
    };
    setActiveUser(user);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    setAuthModalOpen(false);
  };

  const logoutUser = () => {
    setActiveUser(null);
    localStorage.removeItem(STORAGE_KEYS.USER);
  };

  const toggleAdminMode = () => {
    setIsAdmin((prev) => {
      const next = !prev;
      if (next) {
        setActiveUser({
          id: 'user-admin',
          name: 'Sistem',
          surname: 'Yöneticisi',
          email: 'admin@rumusky.com',
          role: 'super_admin'
        });
        setActiveView('admin');
      } else {
        setActiveUser({
          id: 'usr-1',
          name: 'Mustafa',
          surname: 'Göçük',
          email: 'mustafa.gocuk@rumusky.com',
          role: 'customer'
        });
        setActiveView('home');
      }
      return next;
    });
  };

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FLIGHTS, JSON.stringify(flights));
  }, [flights]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
  }, [tickets]);

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
        firstName: i === 0 && activeUser ? activeUser.name : '',
        lastName: i === 0 && activeUser ? activeUser.surname : '',
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

    setFlights((prev) =>
      prev.map((f) => {
        if (f.id === selectedFlight.id) {
          return {
            ...f,
            availableEconomySeats: Math.max(0, f.availableEconomySeats - passengers.length)
          };
        }
        return f;
      })
    );

    setBookings((prev) => [newBooking, ...prev]);
    setTickets((prev) => [...newTickets, ...prev]);
    setCurrentBooking(newBooking);
    setActiveView('confirmation');

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

    const userTicket = tickets.find((t) => t.bookingId === booking.id);
    if (userTicket) {
      setTickets((prev) =>
        prev.map((t) => (t.id === userTicket.id ? { ...t, status: 'checked_in' } : t))
      );
      return { ...userTicket, status: 'checked_in' };
    }
    return null;
  };

  const getTicketsForBooking = (bookingId: string): Ticket[] => {
    return tickets.filter((t) => t.bookingId === bookingId);
  };

  // Admin Actions
  const addFlight = (newFlightData: Omit<Flight, 'id' | 'availableEconomySeats' | 'availableBusinessSeats'>) => {
    const newFlight: Flight = {
      ...newFlightData,
      id: `fl-${Date.now()}`,
      availableEconomySeats: 150,
      availableBusinessSeats: 18
    };
    setFlights((prev) => [newFlight, ...prev]);
  };

  const updateFlightStatus = (flightId: string, status: OperationalStatus) => {
    setFlights((prev) =>
      prev.map((f) => (f.id === flightId ? { ...f, operationalStatus: status } : f))
    );
  };

  const cancelFlight = (flightId: string) => {
    setFlights((prev) =>
      prev.map((f) => (f.id === flightId ? { ...f, operationalStatus: 'Cancelled', bookingStatus: 'closed' } : f))
    );
  };

  const cancelBooking = (bookingId: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: 'cancelled' } : b))
    );
  };

  const resetAllData = () => {
    localStorage.clear();
    setAirports(INITIAL_AIRPORTS);
    setAircrafts(INITIAL_AIRCRAFTS);
    setFlights(getInitialFlights());
    setBookings([]);
    setTickets([]);
    setActiveView('home');
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
        flights,
        bookings,
        tickets,
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
        flightDetailsModal,
        setFlightDetailsModal,
        authModalOpen,
        setAuthModalOpen,
        loginUser,
        logoutUser,
        checkinFlight,
        addFlight,
        updateFlightStatus,
        cancelFlight,
        cancelBooking,
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
