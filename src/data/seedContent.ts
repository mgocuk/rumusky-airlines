import { SiteContentConfig, TicketDesignConfig, NewsItem, PermissionKey, UserRole, User, InfoPage } from '../types';

export const DEFAULT_TICKET_DESIGN: TicketDesignConfig = {
  badgeTitle: 'HATIRA BİLETİ',
  badgeTitleEn: 'COMMEMORATIVE SOUVENIR PASS',
  subTitle: 'Gaziantep Üniversitesi • Havacılık & Yazılım Projesi Özel Biniş Kartı',
  subTitleEn: 'Gaziantep University • Aviation & Software Project Commemorative Pass',
  universityName: 'Gaziantep Üniversitesi',
  universityLogoUrl: '/logos/gaziantep-universitesi-logo.png',
  airlineLogoUrl: '/logos/rumusky-brand-logo.png',
  commemorativeNote: 'Bu bilet Gaziantep Üniversitesi projesi kapsamında üretilmiş resmi hatıra belgesidir. Gökyüzündeki güvenli ve ayrıcalıklı yolculuğunuz, bizim gökyüzümüz.',
  commemorativeNoteEn: 'This ticket is an official commemorative souvenir produced for the Gaziantep University graduation project. Your journey, our sky.',
  themeStyle: 'navy_gold'
};

export const INITIAL_SITE_CONTENT: SiteContentConfig = {
  companyName: 'RUMUSKY',
  companySubtitle: 'AIRLINES',
  customLogoUrl: '/logos/rumusky-brand-logo.png',
  navbar: {
    companyName: 'RUMUSKY',
    companySubtitle: 'AIRLINES',
    customLogoUrl: '/logos/rumusky-brand-logo.png',
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
  },
  ticketDesign: DEFAULT_TICKET_DESIGN,
  heroBackgroundUrl: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?auto=format&fit=crop&w=2000&q=80',
  heroOverlayOpacity: 25,
  searchCardOpacity: 70,
  searchCardBlur: 12,
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
  footerDescEn: 'RUMUSKY AIRLINES — Your safe, comfortable and privileged journey in the skies. Your Journey, Our Sky.',
  footer: {
    desc: 'RUMUSKY AIRLINES — Gökyüzündeki güvenli, konforlu ve ayrıcalıklı yolculuğunuz. Yolculuğunuz, Bizim Gökyüzümüz.',
    descEn: 'RUMUSKY AIRLINES — Your safe, comfortable and privileged journey in the skies. Your Journey, Our Sky.',
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
  }
};

export const INITIAL_INFO_PAGES: InfoPage[] = [
  // 1. Column: RUMUSKY
  {
    id: 'page-about',
    slug: 'about-us',
    category: 'rumusky',
    menuLabel: 'Hakkımızda',
    menuLabelEn: 'About Us',
    title: 'RUMUSKY AIRLINES Hakkında',
    titleEn: 'About RUMUSKY AIRLINES',
    badge: 'Biz Kimiz?',
    badgeEn: 'Who We Are',
    summary: 'Gökyüzünde güven, modern havacılık standartları ve yüksek misafir memnuniyetiyle hizmetinizdeyiz.',
    summaryEn: 'Serving you with safety, modern aviation benchmarks, and supreme guest satisfaction.',
    content: `RUMUSKY AIRLINES, modern havacılık vizyonuyla kurulan, uluslararası güvenlik ve konfor standartlarını benimsemiş öncü bir hava yolu şirketidir. 

Filomuzda yer alan genç, çevre dostu ve yeni nesil uçaklarımızla yolcularımıza güvenli, konforlu ve zamanında varış garantili seyahatler sunuyoruz. İstanbul merkezli operasyonlarımız; Avrupa, Orta Doğu ve Asya kıtalarındaki seçkin destinasyonlara kesintisiz uçuş köprüleri kurmaktadır.

Vizyonumuz: Gökyüzünde misafirlerimize kendilerini evlerinde hissettiren sıcak, profesyonel ve yenilikçi bir seyahat ekosistemi oluşturmaktır.`,
    contentEn: `RUMUSKY AIRLINES is a premier carrier built on modern aviation vision, embracing international standards of safety and comfort.

With our young, eco-efficient, and next-generation fleet, we provide passengers with safe, comfortable, and punctual air travel. Our Istanbul-based flight operations seamlessly connect prime destinations across Europe, the Middle East, and Asia.

Our Vision: To cultivate a warm, professional, and tech-forward journey ecosystem where our guests feel truly at home in the skies.`,
    lastUpdated: '2026-11-01'
  },
  {
    id: 'page-career',
    slug: 'career',
    category: 'rumusky',
    menuLabel: 'Kariyer',
    menuLabelEn: 'Careers',
    title: 'RUMUSKY Ailesine Katılın',
    titleEn: 'Join the RUMUSKY Family',
    badge: 'Açık Pozisyonlar',
    badgeEn: 'Open Roles',
    summary: 'Kokpitten kabine, yer işletmeden bilgi teknolojilerine kadar gökyüzünün geleceğini birlikte inşa ediyoruz.',
    summaryEn: 'From cockpit to cabin crew, ground operations to IT, we shape the future of flight together.',
    content: `RUMUSKY AIRLINES olarak en değerli sermayemizin tutkuyla çalışan dinamik ekibimiz olduğuna inanıyoruz. Havacılığa tutku duyan, takım çalışmasını seven ve sürekli gelişime inanan yeteneklere kapılarımız daima açıktır.

Çalışanlarımıza Sunduklarımız:
• Uluslararası standartlarda uçuş ve mesleki eğitim programları
• Özel sağlık sigortası ve geniş sosyal haklar
• RUMUSKY uçuş ağında avantajlı bilet ve seyahat hakları
• Dinamik ve çok kültürlü küresel çalışma ortamı

Açık Pozisyonlarımız: Kaptan Pilot, İkinci Pilot, Kabin Memuru, Uçak Teknisyeni, Havalimanı Operasyon Uzmanı ve Dijital Ürün Geliştirici. Başvurularınızı ik@rumusky.com adresine iletebilirsiniz.`,
    contentEn: `At RUMUSKY AIRLINES, we firmly believe our most valuable asset is our passionate, dynamic team. Our doors are always open to aviation enthusiasts committed to teamwork and continuous growth.

What We Offer:
• World-class flight and professional training academies
• Comprehensive private health insurance and wellness perks
• Subsidized travel privileges across the RUMUSKY global flight network
• An agile, multicultural, and inclusive work environment

Open Positions: Captain, First Officer, Cabin Crew, Aircraft Maintenance Engineer, Airport Dispatcher, and Software Developer. Submit your resume to careers@rumusky.com.`,
    contactEmail: 'ik@rumusky.com',
    lastUpdated: '2026-11-02'
  },
  {
    id: 'page-press',
    slug: 'press',
    category: 'rumusky',
    menuLabel: 'Basın Odası',
    menuLabelEn: 'Press Room',
    title: 'Basın Odası & Medya Kiti',
    titleEn: 'Press Room & Media Kit',
    badge: 'Kurumsal Haberler',
    badgeEn: 'Media Relations',
    summary: 'RUMUSKY AIRLINES ile ilgili basın bültenleri, resmi logolar, yüksek çözünürlüklü görseller ve kurumsal açıklamalar.',
    summaryEn: 'Official press releases, brand assets, high-res aircraft photos, and executive statements.',
    content: `RUMUSKY AIRLINES Kurumsal İletişim Departmanı, basın mensuplarına ve medya temsilcilerine hızlı, şeffaf ve doğru bilgi akışı sağlamayı taahhüt eder.

Medya Kaynaklarımız:
• Rektörlük ve Havacılık Otoritesi onaylı resmi duyurular
• Yeni rota açılışları ve filo genişleme basın kitleri
• Kurumsal logo vektörleri ve uçak fotoğrafları
• Yöneticilerimizin röportaj ve söyleşi talepleri

Basın ve röportaj talepleriniz için basin@rumusky.com adresinden Kurumsal İletişim ekibimize doğrudan ulaşabilirsiniz.`,
    contentEn: `RUMUSKY AIRLINES Corporate Communications team is committed to providing media partners with prompt, transparent, and accurate news flow.

Media Resources:
• Official statements approved by Civil Aviation Authorities
• New route inaugural press packs and fleet expansion releases
• High-resolution vector logos and aircraft fleet imagery
• Executive interview and editorial media requests

For press inquiries, contact our media relations desk directly at press@rumusky.com.`,
    contactEmail: 'basin@rumusky.com',
    lastUpdated: '2026-11-03'
  },
  {
    id: 'page-contact',
    slug: 'contact',
    category: 'rumusky',
    menuLabel: 'İletişim',
    menuLabelEn: 'Contact',
    title: 'Bize Ulaşın & Genel Merkez',
    titleEn: 'Contact Us & Head Office',
    badge: '7/24 Yanınızdayız',
    badgeEn: '24/7 At Your Service',
    summary: 'Genel müdürlüğümüz, bilet satış ofislerimiz, çağrı merkezimiz ve müşteri geri bildirim kanallarımız.',
    summaryEn: 'Our headquarters, ticket sales offices, call center, and passenger feedback channels.',
    content: `RUMUSKY AIRLINES ile ilgili her türlü soru, öneri, tebrik ve geri bildiriminiz için bize aşağıdaki kanallardan 7/24 ulaşabilirsiniz:

Genel Merkez:
RUMUSKY Plaza, Havalimanı Caddesi No:42, Arnavutköy / İstanbul - Türkiye
Telefon: +90 (850) 800 78 69
E-posta: iletisim@rumusky.com

Çağrı Merkezi:
Türkiye'den: 0850 800 78 69 (7/24 Ücretsiz Destek)
Yurt Dışından: +90 212 900 78 69

Havalimanı Bilet Satış Ofisleri:
• İstanbul Havalimanı (IST) — Giden Yolcu Terminali Kapı 4
• Sabiha Gökçen Havalimanı (SAW) — Dış Hatlar Terminali Kontuar B-12`,
    contentEn: `Reach out to RUMUSKY AIRLINES anytime through our dedicated 24/7 channels:

Headquarters:
RUMUSKY Plaza, Airport Avenue No:42, Arnavutkoy / Istanbul - Turkey
Phone: +90 (850) 800 78 69
Email: contact@rumusky.com

Global Call Center:
Domestic (TR): 0850 800 78 69 (Toll-Free 24/7)
International: +90 212 900 78 69

Airport Ticket Desks:
• Istanbul Airport (IST) — Departures Level Gate 4
• Sabiha Gokcen Airport (SAW) — International Terminal Counter B-12`,
    contactEmail: 'iletisim@rumusky.com',
    contactPhone: '+90 (850) 800 78 69',
    lastUpdated: '2026-11-04'
  },

  // 2. Column: SEYAHAT BİLGİLERİ
  {
    id: 'page-baggage',
    slug: 'baggage-rules',
    category: 'travel_info',
    menuLabel: 'Bagaj Kuralları',
    menuLabelEn: 'Baggage Rules',
    title: 'Kabin ve Kayıtlı Bagaj Kuralları',
    titleEn: 'Cabin & Checked Baggage Policy',
    badge: 'Yolcu Kılavuzu',
    badgeEn: 'Traveler Guide',
    summary: 'Tüm uçuşlarımızda geçerli kabin el bagajı hakları, kayıtlı bagaj limitleri ve kısıtlı taşınabilir maddeler.',
    summaryEn: 'Cabin carry-on limits, checked luggage allowances, and prohibited items on all flights.',
    content: `Seyahatinizin sorunsuz ve rahat geçmesi için bagaj kurallarımızı inceleyebilirsiniz:

1. Kabin El Bagajı (Ücretsiz):
• Ekonomi Sınıfı: 1 parça el bagajı (en fazla 8 kg, 55x40x23 cm) + 1 adet küçük kişisel eşya (çanta veya laptop).
• Business Sınıfı: 2 parça el bagajı (her biri en fazla 8 kg) + 1 adet kişisel eşya.

2. Kayıtlı (Uçak Altı) Bagaj Hakkı:
• Ekonomi Sınıfı: 20 kg ücretsiz kayıtlı bagaj.
• Business Sınıfı: 30 kg ücretsiz kayıtlı bagaj.

3. Sıvı Kısıtlamaları:
Kabin bagajınızdaki sıvılar, aerosoller ve jeller maksimum 100 ml hacimli kaplarda ve toplamı 1 litreyi geçmeyen şeffaf, kilitli poşet içinde taşınmalıdır.

4. Ekstra Bagaj:
Rezervasyon adımı sırasında veya Havalimanında ek bagaj satın alabilirsiniz (+10 kg için 250 ₺ indirimli web tarifesi).`,
    contentEn: `Review our baggage policy for a seamless flight experience:

1. Cabin Carry-on (Complimentary):
• Economy Class: 1 piece (up to 8 kg, 55x40x23 cm) + 1 small personal item (handbag or laptop sleeve).
• Business Class: 2 pieces (up to 8 kg each) + 1 small personal item.

2. Checked Baggage:
• Economy Class: 20 kg included.
• Business Class: 30 kg included.

3. Liquids in Carry-on:
All liquids, aerosols, and gels must be in containers up to 100 ml, placed inside a single 1-liter clear resealable plastic bag.

4. Excess Luggage:
Add extra baggage during booking or via airport counters (discounted +10 kg for 250 ₺ online).`,
    lastUpdated: '2026-11-04'
  },
  {
    id: 'page-checkin-guide',
    slug: 'online-checkin-guide',
    category: 'travel_info',
    menuLabel: 'Online Check-in',
    menuLabelEn: 'Online Check-in',
    title: 'Online Check-in Rehberi & Adımları',
    titleEn: 'Online Check-in Guide & Steps',
    badge: 'Hızlı Uçuş',
    badgeEn: 'Fast Travel',
    summary: 'Kalkıştan 24 saat önce başlayan online check-in ile havalimanında sıra beklemeden biniş kapısına geçin.',
    summaryEn: 'Check in online 24 hours prior to departure and head directly to your boarding gate.',
    content: `RUMUSKY AIRLINES ile online check-in yapmak çok kolay ve hızlıdır:

Ne Zaman Açılır?
Online check-in işlemi uçuş saatinizden 24 saat önce başlar ve tarifeli kalkışa 90 dakika kalana kadar devam eder.

Nasıl Yapılır?
1. Menüdeki "Online Check-in" sekmesine tıklayın.
2. 6 haneli Rezervasyon Kodunuzu (PNR) ve Yolcu Soyadınızı girin.
3. Koltuğunuzu onaylayın veya dilediğiniz yeni koltuğu seçin.
4. Dijital biniş kartınızı PDF olarak indirin veya mobil cihazınıza kaydedin.

Havalimanında:
Yalnızca el bagajınız varsa havalimanında doğrudan güvenlik kontrolüne ve biniş kapısına geçebilirsiniz. Kayıtlı bagajınız varsa "Bagaj Teslim (Bag Drop)" kontuarlarımıza bagajınızı teslim edebilirsiniz.`,
    contentEn: `Online check-in with RUMUSKY AIRLINES is quick, paperless, and intuitive:

When Is It Available?
Opens 24 hours prior to departure and closes 90 minutes before scheduled flight time.

Steps:
1. Click the "Online Check-in" tab on the top menu.
2. Enter your 6-character PNR code and Passenger Surname.
3. Verify or pick your seat.
4. Download your QR boarding pass PDF to your smartphone.

At the Airport:
Traveling with carry-on only? Head straight through security to your gate. If you have checked bags, simply drop them at our dedicated Bag Drop desks.`,
    lastUpdated: '2026-11-05'
  },
  {
    id: 'page-seat-selection',
    slug: 'seat-selection-rules',
    category: 'travel_info',
    menuLabel: 'Koltuk Seçimi',
    menuLabelEn: 'Seat Selection',
    title: 'Koltuk Seçimi & Konfor Ayrıcalıkları',
    titleEn: 'Seat Selection & Comfort Options',
    badge: 'Kabin Düzeni',
    badgeEn: 'Cabin Layout',
    summary: 'İster cam kenarında manzaranın tadını çıkarın, ister acil çıkış sırasında ekstra diz mesafesiyle seyahat edin.',
    summaryEn: 'Enjoy stunning window views or relax with extra legroom exit row seating options.',
    content: `RUMUSKY AIRLINES uçaklarında her yolcumuzun konforu ön plandadır:

Koltuk Seçeneklerimiz:
• Standart Koltuklar: Ergonomik, ayarlanabilir baş destekli, ferah oturma alanı.
• Cam Kenarı: Bulutların ve şehirlerin eşsiz manzarasını seyrederek yolculuk yapmak isteyenler için.
• Koridor: Uçuş sırasında rahatça ayağa kalkmak ve koridor hareketliliği isteyenler için.
• Ekstra Diz Mesafeli Koltuklar (Acil Çıkış): +20 cm ekstra bacak mesafesi ile maksimum rahatlık sağlar (Sivil Havacılık kuralları gereği acil çıkışta oturacak yolcuların 18 yaşından büyük ve acil durum talimatlarını uygulayabilecek durumda olması gerekir).
• Business Sınıfı Koltuklar: Geniş deri koltuklar, tam yatış açısı ve kişisel alan konforu.

Rezervasyonunuz sırasında veya "Rezervasyonlarım" adımından istediğiniz koltuğu rezerve edebilirsiniz. Seçtiğiniz koltuk 10 dakika boyunca adınıza kilitlenir.`,
    contentEn: `Passenger comfort is engineered into every seat on RUMUSKY aircraft:

Seat Categories:
• Standard Seats: Ergonomic seating with adjustable headrests.
• Window Seats: Perfect for gazing out at skies and city skylines.
• Aisle Seats: Freedom of movement and swift disembarkation.
• Extra Legroom (Exit Rows): Up to +20 cm extra leg space. Due to aviation regulations, exit row occupants must be 18+ and capable of executing emergency instructions.
• Business Class Suites: Premium leather seating, enhanced recline, and dedicated personal space.

Seats are temporarily locked for 10 minutes during your checkout session.`,
    lastUpdated: '2026-11-05'
  },
  {
    id: 'page-special-services',
    slug: 'special-services',
    category: 'travel_info',
    menuLabel: 'Özel Hizmetler',
    menuLabelEn: 'Special Services',
    title: 'Özel Hizmetler & Engelsiz Uçuş',
    titleEn: 'Special Assistance & Inclusive Travel',
    badge: 'Konfor & Destek',
    badgeEn: 'Accessibility',
    summary: 'Engelli yolcularımız, evcil hayvan taşıma, refakatsiz çocuk ve özel tıbbi gereksinimler için çözümlerimiz.',
    summaryEn: 'Assistance for passengers with reduced mobility, pet transport, unaccompanied minors, and medical care.',
    content: `RUMUSKY AIRLINES, tüm misafirlerinin eşit ve engelsiz bir seyahat deneyimi yaşaması için kapsamlı hizmetler sunar:

1. Hareket Kısıtlılığı ve Tekerlekli Sandalye Desteği:
Havalimanına varışınızdan uçağa binişinize kadar ücretsiz tekerlekli sandalye refakat hizmeti sağlanır. Talebinizi uçuştan en az 48 saat önce iletmeniz yeterlidir.

2. Evcil Hayvan Taşınması (Kedi & Köpek):
Kabin içinde kafesiyle birlikte en fazla 8 kg olan kedi ve köpekler yolcu eşliğinde uçabilir. Aşı kartı ve sağlık karnesi zorunludur.

3. Refakatsiz Çocuk Yolcu (UM):
7-12 yaş arasındaki çocuklarımız, havalimanında görevli personelimiz eşliğinde uçağa bindirilir, kabin ekibine teslim edilir ve varışta belirtilen kişiye imza karşılığı teslim edilir.

4. Özel Yemek Talepleri:
Diyabetik, glütensiz, vegan, koşer ve çocuk menüsü gibi özel ikram taleplerinizi uçuştan 24 saat önce iletebilirsiniz.`,
    contentEn: `RUMUSKY AIRLINES offers comprehensive assistance to ensure an effortless, barrier-free travel experience:

1. Mobility & Wheelchair Assistance:
Complimentary escort and wheelchair services from airport check-in to your aircraft seat. Please request at least 48 hours before departure.

2. Traveling with Pets (PETC):
Cats and dogs up to 8 kg (including approved carrier) can travel in the cabin. Health certificate and vaccination records required.

3. Unaccompanied Minors (UM):
Children aged 7 to 12 can travel safely under full supervision of dedicated airline staff from departure until handover to authorized guardians.

4. Special In-flight Meals:
Diabetic, gluten-free, vegan, halal, and child meals can be selected free of charge up to 24 hours before your flight.`,
    lastUpdated: '2026-11-06'
  },

  // 3. Column: YARDIM & DESTEK
  {
    id: 'page-faq',
    slug: 'faq',
    category: 'help_support',
    menuLabel: 'Sıkça Sorulan Sorular',
    menuLabelEn: 'FAQ',
    title: 'Sıkça Sorulan Sorular (SSS)',
    titleEn: 'Frequently Asked Questions',
    badge: 'Yardım Merkezi',
    badgeEn: 'Knowledge Base',
    summary: 'Rezervasyon, bilet değişikliği, ödeme ve havalimanı süreçleri hakkında en sık sorulan soruların yanıtları.',
    summaryEn: 'Answers to the most common questions regarding booking, flight changes, payments, and airport procedures.',
    content: `Soru 1: PNR Kodumu unuttum veya kaybettim, bilet bilgilerime nasıl ulaşabilirim?
Cevap: Bilet satın alma sırasında girdiğiniz e-posta adresinize gönderilen onay mesajından PNR kodunuzu görebilir veya 0850 800 78 69 numaralı çağrı merkezimizden kimlik doğrulaması yaparak biletinizi sorgulatabilirsiniz.

Soru 2: Koltuk seçimini sonradan değiştirebilir miyim?
Cevap: Evet, ana sayfada yer alan "Rezervasyonlarım" sekmesinden PNR ve soyadınız ile giriş yaparak uçuşa 3 saat kalana kadar koltuk değişikliği yapabilirsiniz.

Soru 3: Uçuşum iptal edilirse veya gecikirse haklarım nelerdir?
Cevap: Operasyonel nedenlerle uçuş iptali yaşandığında yolcularımıza ücretsiz bilet değişikliği, kesintisiz tam iade ve SHY-YOLCU standartlarında otel/ikram hizmeti sağlanır.

Soru 4: Ödeme yaparken gerçek kredi kartı kullanmam gerekiyor mu?
Cevap: Hayır! RUMUSKY AIRLINES bir eğitim ve simülasyon projesidir. Kesinlikle gerçek kredi kartı bilgisi girilmemelidir. Ekrandaki hazır test kartlarını tıklayarak güvenle simüle işlem yapabilirsiniz.`,
    contentEn: `Question 1: I lost my PNR code, how can I access my e-ticket?
Answer: Check the confirmation email sent upon booking or call our support center at +90 850 800 78 69 with your national ID/passport details.

Question 2: Can I change my selected seat after booking?
Answer: Yes! Visit the "My Bookings" page, enter your PNR and surname, and update your seat preference up to 3 hours prior to departure.

Question 3: What are my passenger rights if my flight is delayed or cancelled?
Answer: In the event of airline schedule disruption, passengers are entitled to complimentary rebooking, 100% full refunds, and care accommodations under civil aviation regulations.

Question 4: Do I need a real credit card for booking?
Answer: Absolutely not! RUMUSKY AIRLINES is an academic simulation project. Use the one-click simulated test cards on the payment screen.`,
    lastUpdated: '2026-11-06'
  },
  {
    id: 'page-support-center',
    slug: 'support-center',
    category: 'help_support',
    menuLabel: 'Destek Merkezi',
    menuLabelEn: 'Support Center',
    title: '7/24 RUMUSKY Destek Merkezi',
    titleEn: '24/7 Support Center',
    badge: 'Müşteri Memnuniyeti',
    badgeEn: 'Customer Support',
    summary: 'Bilet işlemleri, bagaj takibi, geri bildirimler ve acil durum talepleriniz için kesintisiz canlı destek.',
    summaryEn: 'Round-the-clock live assistance for bookings, baggage tracking, and immediate passenger care.',
    content: `Destek Merkezimize Hoş Geldiniz!

RUMUSKY AIRLINES olarak uçuş öncesinde, esnasında ve sonrasında tüm soru ve taleplerinize hızlı çözümler üretmek için buradayız.

Hızlı Destek Kanalları:
• Çağrı Merkezi: 0850 800 78 69 (Haftanın 7 günü 24 saat)
• WhatsApp Destek Hattı: +90 555 800 78 69
• E-Posta Destek: destek@rumusky.com
• Geri Bildirim Formu: Web sitemizdeki iletişim alanından şikayet ve önerilerinizi anında iletebilirsiniz.

Talepleriniz ortalama 15 dakika içinde müşteri temsilcilerimiz tarafından incelenir ve yanıtlanır.`,
    contentEn: `Welcome to the RUMUSKY Support Center!

We are committed to delivering immediate, personalized resolutions before, during, and after your journey.

Channels:
• Call Center: +90 850 800 78 69 (Available 24/7/365)
• WhatsApp Help Desk: +90 555 800 78 69
• Email Support: support@rumusky.com
• Online Feedback: Submit tickets directly through our web contact portal.

Customer requests are typically answered within 15 minutes by our dedicated care specialists.`,
    contactEmail: 'destek@rumusky.com',
    contactPhone: '+90 (850) 800 78 69',
    lastUpdated: '2026-11-06'
  },
  {
    id: 'page-ticket-rules',
    slug: 'ticket-rules',
    category: 'help_support',
    menuLabel: 'Bilet İşlemleri',
    menuLabelEn: 'Ticket Rules',
    title: 'Bilet İşlemleri ve Ücret Kuralları',
    titleEn: 'Ticket Rules & Fare Families',
    badge: 'Esnek Bilet',
    badgeEn: 'Flexible Travel',
    summary: 'Ekonomi ve Business bilet sınıflarımızda geçerli tarih değişikliği, isim düzeltme ve açığa alma koşulları.',
    summaryEn: 'Conditions for rebooking, date modifications, name corrections, and open tickets.',
    content: `Bilet İşlemleri ve Değişiklik Politikası:

1. Tarih ve Saat Değişiklikleri:
• Uçuşa 24 saatten fazla süre varken: Ekonomi sınıfında yalnızca varsa bilet sınıf farkı alınır, ceza bedeli uygulanmaz. Business sınıfında değişiklik tamamen ücretsizdir.
• Uçuşa 24 saat ile 3 saat arasında: Standart 250 ₺ işlem bedeli + ücret farkı uygulanır.
• Uçuşa 3 saatten az süre kala: Değişiklik yapılamaz (No-Show kuralları geçerlidir).

2. Bilet Açığa Alma:
Kullanmadığınız biletinizi 1 yıl boyunca dilediğiniz rotada kullanmak üzere açığa alabilirsiniz.

3. İsim ve Soyadı Düzeltmeleri:
Harf hatası içeren isim düzeltmeleri (en fazla 3 harfe kadar) çağrı merkezimiz tarafından ücretsiz olarak düzeltilir.`,
    contentEn: `Ticket Modification & Fare Family Policies:

1. Date and Time Modifications:
• More than 24h before flight: Economy tickets can be changed with fare difference only (zero penalty). Business changes are 100% free.
• 24h to 3h before flight: 250 ₺ change fee + fare difference.
• Less than 3h: No changes allowed (No-Show terms apply).

2. Open Ticket Option:
Convert unutilized tickets into open vouchers valid for 1 full calendar year across the entire network.

3. Name Corrections:
Typographical spelling errors up to 3 characters can be resolved free of charge via customer support.`,
    lastUpdated: '2026-11-06'
  },
  {
    id: 'page-cancellation-refund',
    slug: 'cancellation-refund',
    category: 'help_support',
    menuLabel: 'İptal ve İade Koşulları',
    menuLabelEn: 'Cancellation & Refund',
    title: 'İptal, Kesinti ve İade Koşulları',
    titleEn: 'Cancellation & Refund Terms',
    badge: 'Tüketici Hakları',
    badgeEn: 'Consumer Rights',
    summary: 'Gönüllü iptaller, zorunlu uçuş iptalleri ve iade süreçlerinde uygulanan kurallar ve yasal haklarınız.',
    summaryEn: 'Voluntary passenger cancellations, airline schedule disruptions, and refund guidelines.',
    content: `İptal ve İade Süreçleri Esasları:

1. Yolcu Kaynaklı (Gönüllü) İptaller:
• Satın alma işleminden sonraki ilk 24 saat içinde koşulsuz ve kesintisiz %100 tam iade hakkınız bulunmaktadır.
• Uçuşa 48 saatten fazla süre varken yapılan iptallerde bilet ücreti %15 hizmet bedeli kesilerek iade edilir.
• Promosyon biletlerde temel ücret iade edilmez; yalnızca tahsil edilen havalimanı vergileri eksiksiz iade edilir.

2. Havayolu Kaynaklı İptaller:
Hava muhalefeti veya operasyonel aksaklıklar sebebiyle RUMUSKY AIRLINES tarafından iptal edilen seferlerde kesintisiz %100 bilet iadesi banka kartınıza otomatik olarak yansıtılır.

3. İade Süresi:
Onaylanan iade tutarları 3 ila 7 iş günü içerisinde ödeme yaptığınız kartın hesabına aktarılır.`,
    contentEn: `Guidelines for Cancellation and Ticket Refunds:

1. Voluntary Passenger Cancellations:
• Full 100% unconditional refund within 24 hours of purchase.
• Cancellations requested over 48h before flight receive full refund minus 15% handling fee.
• Non-refundable promo fares retain full refundability of airport taxes.

2. Airline Involuntary Cancellations:
Flights cancelled due to weather or operational conditions qualify for automatic 100% full refund with zero deductions.

3. Refund Processing Time:
Refund credits reflect on original payment cards within 3 to 7 business banking days.`,
    lastUpdated: '2026-11-06'
  },

  // 4. Bottom Bar: YASAL & SÖZLEŞMELER
  {
    id: 'page-privacy',
    slug: 'privacy-policy',
    category: 'legal',
    menuLabel: 'Gizlilik Politikası',
    menuLabelEn: 'Privacy Policy',
    title: 'Kişisel Verilerin Korunması ve Gizlilik Politikası',
    titleEn: 'Privacy Policy & Data Protection',
    badge: 'KVKK & GDPR',
    badgeEn: 'Compliance',
    summary: '6698 Sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve AB GDPR uyarınca verilerinizin güvenliği.',
    summaryEn: 'Protection and governance of passenger personal data under KVKK and EU GDPR frameworks.',
    content: `RUMUSKY AIRLINES Gizlilik Bildirimi:

Veri Sorumlusu:
RUMUSKY Havacılık ve Taşımacılık A.Ş. olarak yolcularımızın kişisel verilerinin güvenliğine en üst düzeyde önem veriyoruz.

İşlenen Kişisel Veriler:
• Kimlik Bilgileri: Ad, soyad, TC kimlik / Pasaport numarası, doğum tarihi, cinsiyet.
• İletişim Bilgileri: E-posta adresi, cep telefonu numarası.
• Uçuş ve Bilet Bilgileri: PNR kodu, uçuş güzergahı, koltuk tercihi ve özel hizmet talepleri.

Verilerin İşlenme Amacı:
Bilet düzenleme, rezervasyon yönetimi, uçuş güvenliği ve sivil havacılık mevzuatından doğan yasal yükümlülüklerin ifası amacıyla toplanmaktadır. Kişisel verileriniz yasal zorunluluklar (Sivil Havacılık Genel Müdürlüğü, Emniyet ve sınır otoriteleri) haricinde üçüncü şahıslarla paylaşılmaz.`,
    contentEn: `RUMUSKY AIRLINES Privacy and Personal Data Notice:

Data Controller:
RUMUSKY Aviation Inc. prioritizes passenger privacy and data security at the highest modern standards.

Processed Data:
• Identity: Full name, national identity or passport number, date of birth, gender.
• Contact: Email address, phone number.
• Travel Details: PNR booking reference, flight itinerary, seat selection, special assistance notes.

Processing Purposes:
Data is collected exclusively to issue flight tickets, administer travel bookings, maintain flight security, and fulfill civil aviation mandates. Personal data is never disclosed to unauthorized commercial third parties.`,
    lastUpdated: '2026-11-06'
  },
  {
    id: 'page-terms',
    slug: 'terms-of-use',
    category: 'legal',
    menuLabel: 'Kullanım Şartları',
    menuLabelEn: 'Terms of Use',
    title: 'Web Sitesi ve Hizmet Kullanım Şartları',
    titleEn: 'Terms of Service & Platform Use',
    badge: 'Yasal Hükümler',
    badgeEn: 'Legal Notice',
    summary: 'RUMUSKY AIRLINES platformunun, biletleme motorunun ve simülasyon sisteminin kullanım koşulları.',
    summaryEn: 'Terms and conditions governing the use of the RUMUSKY AIRLINES booking and simulation engine.',
    content: `RUMUSKY AIRLINES Web Platformu Kullanım Şartları:

1. Hizmetin Niteliği ve Simülasyon Bildirimi:
Bu platform bir akademik eğitim ve havayolu yönetim simülasyon projesidir. Sistemde yapılan uçuş rezervasyonları ve ödeme adımları tamamen eğitim amaçlı simülasyon niteliğindedir. Gerçek para tahsilatı yapılmaz.

2. Fikri Mülkiyet Hakları:
Web sitesindeki tüm logolar, grafikler, yazılım kodları, arayüz tasarımları ve içerikler RUMUSKY AIRLINES projesine aittir. İzinsiz kopyalanamaz veya çoğaltılamaz.

3. Kullanıcı Yükümlülükleri:
Kullanıcılar biletleme ve rezervasyon formlarını doldururken doğru bilgi girmeyi, sistemin güvenliğini tehdit edecek girişimlerde bulunmamayı kabul ve taahhüt eder.`,
    contentEn: `RUMUSKY AIRLINES Platform Terms & Conditions:

1. Nature of Platform & Simulation Disclaimer:
This platform is an academic engineering and aviation simulation project. All booking transactions, payment screens, and seat holds are simulated for educational demonstration. No real financial charges occur.

2. Intellectual Property Rights:
All logos, design assets, source code, and interface components belong to RUMUSKY AIRLINES and may not be reproduced without explicit attribution.

3. User Responsibilities:
Visitors agree to provide truthful passenger information in test scenarios and refrain from actions that compromise platform integrity.`,
    lastUpdated: '2026-11-06'
  },
  {
    id: 'page-cookie',
    slug: 'cookie-notice',
    category: 'legal',
    menuLabel: 'Çerez Bildirimi',
    menuLabelEn: 'Cookie Notice',
    title: 'Çerez (Cookie) Aydınlatma Bildirimi',
    titleEn: 'Cookie Usage & Preferences Policy',
    badge: 'Çerez Politikası',
    badgeEn: 'Cookie Policy',
    summary: 'Kullanıcı deneyiminizi iyileştirmek, dil seçiminizi hatırlamak ve rezervasyon oturumunu korumak için çerezler kullanılır.',
    summaryEn: 'Cookies used to enhance browsing experience, remember language preferences, and preserve seat holds.',
    content: `RUMUSKY AIRLINES Çerez Aydınlatma Metni:

Çerez Nedir?
Çerezler, web sitemizi ziyaret ettiğinizde tarayıcınız aracılığıyla cihazınıza kaydedilen küçük metin dosyalarıdır.

Kullandığımız Çerez Türleri:
• Zorunlu Çerezler: Web sitemizin güvenli çalışması, aktif rezervasyonunuzun korunması ve 10 dakikalık koltuk kilidinizin hafızada tutulması için şarttır.
• Tercih Çerezleri: Seçtiğiniz dil (Türkçe/İngilizce) gibi kişiselleştirilmiş ayarlarınızı hatırlar.
• Performans ve Analitik Çerezleri: Hangi sayfaların daha çok ziyaret edildiğini analiz ederek kullanıcı deneyimini iyileştirmemize yardımcı olur.

Çerez Yönetimi:
Tarayıcı ayarlarınızdan dilediğiniz zaman çerezleri silebilir veya engelleyebilirsiniz.`,
    contentEn: `RUMUSKY AIRLINES Cookie Policy:

What Are Cookies?
Cookies are compact text files stored on your device via your web browser during site visits.

Categories of Cookies Utilized:
• Essential Cookies: Necessary for site security, session maintenance, and active 10-minute seat lock holds.
• Preference Cookies: Memorizes chosen language (Turkish/English) and currency filters.
• Analytics Cookies: Helps us optimize page load times and user journeys through anonymous aggregation.

Managing Cookies:
You may clear or block cookies anytime within your browser settings.`,
    lastUpdated: '2026-11-06'
  }
];

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
    name: 'Süper',
    surname: 'Admin',
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
