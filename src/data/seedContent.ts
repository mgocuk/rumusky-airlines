import { SiteContentConfig, NewsItem, PermissionKey, UserRole, User } from '../types';

export const INITIAL_SITE_CONTENT: SiteContentConfig = {
  heroBackgroundUrl: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=2000&q=80',
  heroBadgeText: 'RUMUSKY AIRLINES — Gökyüzündeki Güvenli Eviniz',
  heroBadgeTextEn: 'RUMUSKY AIRLINES — Your Safe Home in the Skies',
  heroTitle: 'Dünyaya RUMUSKY ile Uçun',
  heroTitleEn: 'Fly the World with RUMUSKY',
  heroSubtitle: 'Konforlu, güvenli ve avantajlı uçuşlarla hayalinizdeki destinasyonlara ulaşın.',
  heroSubtitleEn: 'Reach your dream destinations with comfortable, safe, and advantageous flights.',
  benefits: [
    {
      id: 'ben-1',
      title: 'Güvenli Seyahat',
      titleEn: 'Safe Travel',
      desc: 'Uluslararası güvenlik ve bakım standartları',
      descEn: 'International safety and maintenance standards',
      icon: 'ShieldCheck'
    },
    {
      id: 'ben-2',
      title: 'Konforlu Uçuş',
      titleEn: 'Comfortable Flights',
      desc: 'Modern geniş diz mesafeli ergonomik koltuklar',
      descEn: 'Modern spacious legroom ergonomic seating',
      icon: 'Armchair'
    },
    {
      id: 'ben-3',
      title: 'Avantajlı Fiyatlar',
      titleEn: 'Advantageous Fares',
      desc: 'Şeffaf fiyatlandırma, özel kampanyalar ve indirimler',
      descEn: 'Transparent pricing, exclusive deals and promotions',
      icon: 'Tag'
    },
    {
      id: 'ben-4',
      title: '7/24 Kesintisiz Destek',
      titleEn: '24/7 Dedicated Support',
      desc: 'Tüm rezervasyon ve bilet işlemlerinizde anında yanınızdayız',
      descEn: 'Always by your side for all booking and ticketing needs',
      icon: 'Headphones'
    }
  ],
  announcementBanner: {
    enabled: true,
    badge: 'YENİ SEFERLER',
    text: 'Tokyo, Dubai ve Londra direkt seferlerimiz avantajlı tanıtım fiyatlarıyla satışa açıldı!',
    textEn: 'Direct flights to Tokyo, Dubai, and London are now on sale with special introductory fares!'
  },
  footerDesc: 'RUMUSKY AIRLINES — Gökyüzündeki güvenli, konforlu ve ayrıcalıklı yolculuğunuz. Yolculuğunuz, Bizim Gökyüzümüz.',
  footerDescEn: 'RUMUSKY AIRLINES — Your safe, comfortable and privileged journey in the skies. Your Journey, Our Sky.'
};

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'RUMUSKY AIRLINES Filosuna Yeni Nesil Airbus A321neo Katıldı',
    titleEn: 'RUMUSKY AIRLINES Welcomes Next-Generation Airbus A321neo to Fleet',
    summary: 'Daha sessiz, %20 daha az yakıt tüketen ve geniş kabin konforu sunan yeni A321neo uçağımız sefere hazır.',
    summaryEn: 'Our new A321neo aircraft offering quieter flight, 20% lower fuel burn and extra cabin space is ready for service.',
    content: 'RUMUSKY AIRLINES olarak filomuzu en yeni havacılık teknolojileriyle genişletmeye devam ediyoruz. Teslim aldığımız TC-RMK tescilli Airbus A321neo, yüksek hızlı uydu interneti ve geniş Business sınıfı koltuklarıyla yolcularımıza eşsiz bir seyahat deneyimi sunacak.',
    contentEn: 'RUMUSKY AIRLINES continues to expand its fleet with cutting-edge aviation technologies. Our newly delivered Airbus A321neo registered TC-RMK features high-speed satellite Wi-Fi and spacious Business class seating.',
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
    category: 'Filo',
    publishedAt: '2026-11-05',
    isActive: true
  },
  {
    id: 'news-2',
    title: 'Tokyo Haneda (HND) Direkt Uçuşlarımız Başladı',
    titleEn: 'Direct Flights to Tokyo Haneda (HND) Officially Inaugurated',
    summary: 'İstanbul ile Tokyo artık birbirine daha yakın! Haftada 4 frekans olarak icra edilen seferlerimiz satışta.',
    summaryEn: 'Istanbul and Tokyo are now closer than ever! 4 weekly scheduled direct flights are now available.',
    content: 'Uzak Doğu ağımızın en prestijli destinasyonu olan Tokyo Haneda Havalimanı direkt seferlerimiz başladı. Business sınıfında gurme Japon ve Türk mutfağı ikramları ile unutulmaz bir yolculuk sizleri bekliyor.',
    contentEn: 'Our non-stop flights to Tokyo Haneda Airport, the crown jewel of our Far East network, have officially commenced. Enjoy gourmet Japanese and Turkish culinary experiences onboard.',
    imageUrl: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    category: 'Hat Açılışı',
    publishedAt: '2026-11-01',
    isActive: true
  },
  {
    id: 'news-3',
    title: 'Sürdürülebilir Gökyüzü: Karbon Ayak İzimizi %25 Azalttık',
    titleEn: 'Sustainable Skies: Carbon Footprint Reduced by 25%',
    summary: 'Sürdürülebilir havacılık yakıtı (SAF) kullanımı ve optimize edilmiş uçuş rotalarıyla çevre dostu adımlar atıyoruz.',
    summaryEn: 'Taking eco-friendly strides through sustainable aviation fuel (SAF) and optimized flight trajectory routing.',
    content: 'Gelecek nesillere daha temiz bir gökyüzü bırakmak adına 2026 yılı sürdürülebilirlik hedeflerimize ulaştık. Uçuş operasyonlarımızda tek kullanımlık plastikleri %100 kaldırarak dijital biniş kartı sistemine tam geçiş sağladık.',
    contentEn: 'We achieved our 2026 sustainability milestones for cleaner skies. 100% of single-use plastics have been eliminated with a full transition to digital boarding pass systems.',
    imageUrl: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80',
    category: 'Sürdürülebilirlik',
    publishedAt: '2026-10-25',
    isActive: true
  }
];

export const DEFAULT_ROLE_PERMISSIONS: Record<UserRole, PermissionKey[]> = {
  super_admin: [
    'manage_flights',
    'manage_airports',
    'manage_aircraft',
    'manage_bookings',
    'manage_cms',
    'manage_news',
    'manage_settings',
    'manage_roles'
  ],
  flight_manager: [
    'manage_flights',
    'manage_airports',
    'manage_aircraft'
  ],
  booking_manager: [
    'manage_bookings'
  ],
  content_manager: [
    'manage_cms',
    'manage_news'
  ],
  customer: []
};

export const INITIAL_STAFF_USERS: User[] = [
  {
    id: 'usr-admin-1',
    name: 'Mustafa',
    surname: 'Göçük',
    email: 'admin@rumusky.com',
    role: 'super_admin',
    phone: '+90 555 100 2030'
  },
  {
    id: 'usr-flight-1',
    name: 'Ahmet',
    surname: 'Demir',
    email: 'ops@rumusky.com',
    role: 'flight_manager',
    phone: '+90 555 200 3040'
  },
  {
    id: 'usr-booking-1',
    name: 'Elif',
    surname: 'Kaya',
    email: 'booking@rumusky.com',
    role: 'booking_manager',
    phone: '+90 555 300 4050'
  },
  {
    id: 'usr-content-1',
    name: 'Selin',
    surname: 'Öztürk',
    email: 'editor@rumusky.com',
    role: 'content_manager',
    phone: '+90 555 400 5060'
  }
];
