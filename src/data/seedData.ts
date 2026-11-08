import { Airport, Aircraft, Flight, Campaign, PopularDestination } from '../types';

export const INITIAL_AIRPORTS: Airport[] = [
  {
    id: 'apt-1',
    iataCode: 'IST',
    icaoCode: 'LTFM',
    name: 'İstanbul Havalimanı',
    city: 'İstanbul',
    cityEn: 'Istanbul',
    country: 'Türkiye',
    countryEn: 'Turkey',
    timezone: 'Europe/Istanbul',
    terminalInfo: 'Ana Terminal / Gate A-B-C',
    isActive: true
  },
  {
    id: 'apt-2',
    iataCode: 'SAW',
    icaoCode: 'LTFJ',
    name: 'Sabiha Gökçen Havalimanı',
    city: 'İstanbul (Anadolu)',
    cityEn: 'Istanbul (Sabiha Gokcen)',
    country: 'Türkiye',
    countryEn: 'Turkey',
    timezone: 'Europe/Istanbul',
    terminalInfo: 'Dış Hatlar Terminali',
    isActive: true
  },
  {
    id: 'apt-3',
    iataCode: 'LHR',
    icaoCode: 'EGLL',
    name: 'Heathrow Airport',
    city: 'Londra',
    cityEn: 'London',
    country: 'Birleşik Krallık',
    countryEn: 'United Kingdom',
    timezone: 'Europe/London',
    terminalInfo: 'Terminal 2 (The Queen\'s Terminal)',
    isActive: true
  },
  {
    id: 'apt-4',
    iataCode: 'CDG',
    icaoCode: 'LFPG',
    name: 'Charles de Gaulle Airport',
    city: 'Paris',
    cityEn: 'Paris',
    country: 'Fransa',
    countryEn: 'France',
    timezone: 'Europe/Paris',
    terminalInfo: 'Terminal 2E',
    isActive: true
  },
  {
    id: 'apt-5',
    iataCode: 'FCO',
    icaoCode: 'LIRF',
    name: 'Leonardo da Vinci–Fiumicino',
    city: 'Roma',
    cityEn: 'Rome',
    country: 'İtalya',
    countryEn: 'Italy',
    timezone: 'Europe/Rome',
    terminalInfo: 'Terminal 3',
    isActive: true
  },
  {
    id: 'apt-6',
    iataCode: 'JFK',
    icaoCode: 'KJFK',
    name: 'John F. Kennedy International',
    city: 'New York',
    cityEn: 'New York',
    country: 'ABD',
    countryEn: 'USA',
    timezone: 'America/New_York',
    terminalInfo: 'Terminal 1',
    isActive: true
  },
  {
    id: 'apt-7',
    iataCode: 'DXB',
    icaoCode: 'OMDB',
    name: 'Dubai International Airport',
    city: 'Dubai',
    cityEn: 'Dubai',
    country: 'Birleşik Arap Emirlikleri',
    countryEn: 'UAE',
    timezone: 'Asia/Dubai',
    terminalInfo: 'Terminal 3',
    isActive: true
  },
  {
    id: 'apt-8',
    iataCode: 'HND',
    icaoCode: 'RJTT',
    name: 'Haneda Airport',
    city: 'Tokyo',
    cityEn: 'Tokyo',
    country: 'Japonya',
    countryEn: 'Japan',
    timezone: 'Asia/Tokyo',
    terminalInfo: 'Terminal 3 (International)',
    isActive: true
  }
];

export const INITIAL_AIRCRAFTS: Aircraft[] = [
  {
    id: 'ac-1',
    model: 'Airbus A320-200neo',
    registrationNumber: 'TC-RMK',
    manufacturer: 'Airbus',
    aircraftType: 'Dar Gövde (Narrow-Body)',
    totalCapacity: 180,
    economyRows: 26,
    businessRows: 4,
    seatsPerRow: ['A', 'B', 'C', 'D', 'E', 'F'],
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
    cabinImageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=80',
    rangeKm: 6300,
    cruiseSpeedKmh: 840,
    wingspanM: 35.8,
    lengthM: 37.6,
    engineType: 'CFM LEAP-1A26 (Yeni Nesil Sessiz Motor)',
    features: [
      'Uydu Bağlantılı Hızlı Wi-Fi',
      'Ekstra Geniş Diz Mesafesi',
      'Kişisel Dokunmatik Eğlence Ekranı',
      'USB-A & Type-C 60W Şarj',
      'HEPA %99.97 Tıbbi Sınıf Hava Filtresi',
      'Mood LED Dinamik Kabin Aydınlatması'
    ],
    description: 'Yeni nesil CFM LEAP motorları sayesinde %20 yakıt tasarrufu ve %50 daha sessiz kabin deneyimi sunan modern filo uçağımız.',
    descriptionEn: 'Our modern aircraft offering 20% fuel savings and 50% quieter cabin experience powered by next-gen CFM LEAP engines.'
  },
  {
    id: 'ac-2',
    model: 'Boeing 737-800 Next-Gen',
    registrationNumber: 'TC-RMS',
    manufacturer: 'Boeing',
    aircraftType: 'Dar Gövde (Narrow-Body)',
    totalCapacity: 189,
    economyRows: 27,
    businessRows: 4,
    seatsPerRow: ['A', 'B', 'C', 'D', 'E', 'F'],
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1200&q=80',
    cabinImageUrl: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1200&q=80',
    rangeKm: 5765,
    cruiseSpeedKmh: 850,
    wingspanM: 35.8,
    lengthM: 39.5,
    engineType: 'CFM56-7B27 Yüksek Güvenilirlikli TurboFan',
    features: [
      'Boeing Sky Interior Gökyüzü Tavanı',
      'Genişletilmiş Pivot Baş Üstü Dolapları',
      'Ergonomik İnce Sırtlı Koltuklar',
      'USB Hızlı Şarj Portları',
      'HEPA Havalandırma Sistemi'
    ],
    description: 'Havacılık tarihinin en güvenilir ve kanıtlanmış uçaklarından olan Boeing 737-800, yenilenmiş Sky Interior kabiniyle konforlu seyahat sağlar.',
    descriptionEn: 'One of the most reliable commercial jets, offering comfortable travel with upgraded Boeing Sky Interior cabin.'
  },
  {
    id: 'ac-3',
    model: 'Boeing 787-9 Dreamliner',
    registrationNumber: 'TC-RUM',
    manufacturer: 'Boeing',
    aircraftType: 'Geniş Gövde (Wide-Body)',
    totalCapacity: 300,
    economyRows: 32,
    businessRows: 6,
    seatsPerRow: ['A', 'B', 'C', 'D', 'E', 'F'],
    isActive: true,
    imageUrl: 'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=1200&q=80',
    cabinImageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=80',
    rangeKm: 14140,
    cruiseSpeedKmh: 903,
    wingspanM: 60.1,
    lengthM: 62.8,
    engineType: 'General Electric GEnx-1B Yüksek Verimli Motor',
    features: [
      '180° Tam Yatar (Lie-Flat) Business Süitler',
      'Düğmeyle Karartılan Elektronik Akıllı Pencereler',
      'Daha Düşük Kabin İrtifası & Yüksek Nem Oranı (Jetlag Azaltıcı)',
      '13.3 inç 4K Ultra HD Eğlence Ekranı',
      'Yüksek Hızlı Ka-Band Uydu İnterneti',
      'Gürültü Önleyici Kulaklık Desteği & Bluetooth Ses Bağlantısı'
    ],
    description: 'Kompozit gövde yapısı, elektronik karartmalı dev pencereleri ve yüksek nemli kabin basıncıyla uzun menzilli uçuşlarda jetlag hissini minimuma indirir.',
    descriptionEn: 'Composite fuselage, electrochromic smart windows, and higher cabin humidity drastically minimize jetlag on long-haul flights.'
  }
];

// Helper to get relative future dates YYYY-MM-DD
export function getFutureDateString(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split('T')[0];
}

export function getInitialFlights(): Flight[] {
  const d0 = getFutureDateString(1);
  const d1 = getFutureDateString(3);
  const d2 = getFutureDateString(5);
  const d3 = getFutureDateString(7);

  const ist = INITIAL_AIRPORTS[0];
  const saw = INITIAL_AIRPORTS[1];
  const lhr = INITIAL_AIRPORTS[2];
  const cdg = INITIAL_AIRPORTS[3];
  const fco = INITIAL_AIRPORTS[4];
  const jfk = INITIAL_AIRPORTS[5];
  const dxb = INITIAL_AIRPORTS[6];

  return [
    {
      id: 'fl-1',
      flightNumber: 'RMK-101',
      routeId: 'rt-1',
      originAirport: ist,
      destinationAirport: lhr,
      aircraftId: 'ac-1',
      aircraftModel: 'Airbus A320-200neo',
      departureTime: `${d0}T10:30:00`,
      arrivalTime: `${d0}T12:45:00`,
      durationMinutes: 255,
      priceEconomy: 2999,
      priceBusiness: 7499,
      baggageAllowanceKg: 25,
      operationalStatus: 'Scheduled',
      bookingStatus: 'open',
      availableEconomySeats: 142,
      availableBusinessSeats: 16
    },
    {
      id: 'fl-2',
      flightNumber: 'RMK-103',
      routeId: 'rt-1',
      originAirport: ist,
      destinationAirport: lhr,
      aircraftId: 'ac-2',
      aircraftModel: 'Boeing 737-800',
      departureTime: `${d1}T18:15:00`,
      arrivalTime: `${d1}T20:30:00`,
      durationMinutes: 255,
      priceEconomy: 3250,
      priceBusiness: 7990,
      baggageAllowanceKg: 25,
      operationalStatus: 'Scheduled',
      bookingStatus: 'open',
      availableEconomySeats: 156,
      availableBusinessSeats: 18
    },
    {
      id: 'fl-3',
      flightNumber: 'RMK-201',
      routeId: 'rt-2',
      originAirport: ist,
      destinationAirport: cdg,
      aircraftId: 'ac-1',
      aircraftModel: 'Airbus A320-200neo',
      departureTime: `${d0}T08:00:00`,
      arrivalTime: `${d0}T10:45:00`,
      durationMinutes: 225,
      priceEconomy: 3499,
      priceBusiness: 8200,
      baggageAllowanceKg: 25,
      operationalStatus: 'Scheduled',
      bookingStatus: 'open',
      availableEconomySeats: 130,
      availableBusinessSeats: 14
    },
    {
      id: 'fl-4',
      flightNumber: 'RMK-301',
      routeId: 'rt-3',
      originAirport: ist,
      destinationAirport: fco,
      aircraftId: 'ac-2',
      aircraftModel: 'Boeing 737-800',
      departureTime: `${d1}T13:45:00`,
      arrivalTime: `${d1}T15:25:00`,
      durationMinutes: 160,
      priceEconomy: 2750,
      priceBusiness: 6500,
      baggageAllowanceKg: 20,
      operationalStatus: 'Scheduled',
      bookingStatus: 'open',
      availableEconomySeats: 168,
      availableBusinessSeats: 20
    },
    {
      id: 'fl-5',
      flightNumber: 'RMK-401',
      routeId: 'rt-4',
      originAirport: ist,
      destinationAirport: jfk,
      aircraftId: 'ac-1',
      aircraftModel: 'Airbus A320-200neo',
      departureTime: `${d2}T12:00:00`,
      arrivalTime: `${d2}T16:30:00`,
      durationMinutes: 630,
      priceEconomy: 12900,
      priceBusiness: 28500,
      baggageAllowanceKg: 35,
      operationalStatus: 'Scheduled',
      bookingStatus: 'open',
      availableEconomySeats: 110,
      availableBusinessSeats: 12
    },
    {
      id: 'fl-6',
      flightNumber: 'RMK-501',
      routeId: 'rt-5',
      originAirport: saw,
      destinationAirport: dxb,
      aircraftId: 'ac-2',
      aircraftModel: 'Boeing 737-800',
      departureTime: `${d0}T21:00:00`,
      arrivalTime: `${d0}T02:30:00`,
      durationMinutes: 270,
      priceEconomy: 4200,
      priceBusiness: 9800,
      baggageAllowanceKg: 30,
      operationalStatus: 'Scheduled',
      bookingStatus: 'open',
      availableEconomySeats: 145,
      availableBusinessSeats: 16
    },
    // Return flights
    {
      id: 'fl-7',
      flightNumber: 'RMK-102',
      routeId: 'rt-1r',
      originAirport: lhr,
      destinationAirport: ist,
      aircraftId: 'ac-1',
      aircraftModel: 'Airbus A320-200neo',
      departureTime: `${d2}T14:00:00`,
      arrivalTime: `${d2}T20:15:00`,
      durationMinutes: 255,
      priceEconomy: 3100,
      priceBusiness: 7750,
      baggageAllowanceKg: 25,
      operationalStatus: 'Scheduled',
      bookingStatus: 'open',
      availableEconomySeats: 140,
      availableBusinessSeats: 18
    },
    {
      id: 'fl-8',
      flightNumber: 'RMK-202',
      routeId: 'rt-2r',
      originAirport: cdg,
      destinationAirport: ist,
      aircraftId: 'ac-1',
      aircraftModel: 'Airbus A320-200neo',
      departureTime: `${d3}T12:30:00`,
      arrivalTime: `${d3}T17:05:00`,
      durationMinutes: 215,
      priceEconomy: 3600,
      priceBusiness: 8500,
      baggageAllowanceKg: 25,
      operationalStatus: 'Scheduled',
      bookingStatus: 'open',
      availableEconomySeats: 135,
      availableBusinessSeats: 16
    }
  ];
}

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp-1',
    title: "Avrupa'ya Özel Fırsatlar!",
    titleEn: 'Special Deals to Europe!',
    subtitle: "Seçili hatlarda %30'a varan indirimleri kaçırmayın. Londra, Paris ve Roma sizi bekliyor.",
    subtitleEn: 'Enjoy up to 30% discount on selected routes. London, Paris and Rome are waiting for you.',
    imageUrl: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?auto=format&fit=crop&w=1200&q=80',
    ctaLabel: 'Kampanyaları İncele →',
    ctaLabelEn: 'Explore Deals →',
    badgeText: '%30 İndirim',
    badgeTextEn: '30% Off',
    targetOrigin: 'IST',
    targetDestination: 'CDG',
    discountPercentage: 30
  },
  {
    id: 'cmp-2',
    title: 'Uzak Doğu Sizi Çağırıyor',
    titleEn: 'The Far East Awaits You',
    subtitle: 'Tokyo, Seul ve daha fazlası için avantajlı Business ve Ekonomi biletleri şimdi satışta.',
    subtitleEn: 'Advantageous Business and Economy tickets for Tokyo, Seoul and beyond are now on sale.',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    ctaLabel: 'Hemen Keşfet →',
    ctaLabelEn: 'Discover Now →',
    badgeText: 'Özel Fiyatlar',
    badgeTextEn: 'Exclusive Fares',
    targetOrigin: 'IST',
    targetDestination: 'HND',
    discountPercentage: 20
  }
];

export const INITIAL_DESTINATIONS: PopularDestination[] = [
  {
    id: 'dest-1',
    city: 'İstanbul (IST)',
    cityEn: 'Istanbul (IST)',
    country: 'Türkiye',
    countryEn: 'Turkey',
    iataCode: 'IST',
    imageUrl: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?auto=format&fit=crop&w=800&q=80',
    startingPrice: 1450,
    currency: '₺'
  },
  {
    id: 'dest-2',
    city: 'Londra (LHR)',
    cityEn: 'London (LHR)',
    country: 'İngiltere',
    countryEn: 'United Kingdom',
    iataCode: 'LHR',
    imageUrl: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    startingPrice: 2999,
    currency: '₺'
  },
  {
    id: 'dest-3',
    city: 'Paris (CDG)',
    cityEn: 'Paris (CDG)',
    country: 'Fransa',
    countryEn: 'France',
    iataCode: 'CDG',
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
    startingPrice: 3499,
    currency: '₺'
  },
  {
    id: 'dest-4',
    city: 'Roma (FCO)',
    cityEn: 'Rome (FCO)',
    country: 'İtalya',
    countryEn: 'Italy',
    iataCode: 'FCO',
    imageUrl: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    startingPrice: 2750,
    currency: '₺'
  },
  {
    id: 'dest-5',
    city: 'New York (JFK)',
    cityEn: 'New York (JFK)',
    country: 'ABD',
    countryEn: 'USA',
    iataCode: 'JFK',
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80',
    startingPrice: 12900,
    currency: '₺'
  }
];
