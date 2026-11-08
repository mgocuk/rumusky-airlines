import { ExtraService } from '../types';

export const AVAILABLE_SERVICES: ExtraService[] = [
  {
    id: 'srv-baggage',
    name: '+10 kg Ekstra Bagaj Hakkı',
    nameEn: '+10 kg Extra Checked Baggage',
    description: 'Daha fazla eşya taşıyabilmeniz için ek bagaj kapasitesi.',
    descriptionEn: 'Additional luggage allowance for your journey.',
    price: 250,
    icon: 'Briefcase'
  },
  {
    id: 'srv-fasttrack',
    name: 'Fast Track & Öncelikli Biniş',
    nameEn: 'Fast Track & Priority Boarding',
    description: 'Havalimanı güvenlik ve biniş kuyruklarında beklemeden hızlı geçiş.',
    descriptionEn: 'Breeze through airport security and board first.',
    price: 180,
    icon: 'Zap'
  },
  {
    id: 'srv-insurance',
    name: 'Kapsamlı Seyahat Sigortası',
    nameEn: 'Comprehensive Travel Insurance',
    description: 'Olası gecikme, bagaj kaybı ve acil tıbbi durum güvencesi.',
    descriptionEn: 'Coverage for flight delays, lost luggage and medical emergencies.',
    price: 150,
    icon: 'ShieldCheck'
  },
  {
    id: 'srv-meal',
    name: 'Özel Gurme Sıcak Menü',
    nameEn: 'Special Gourmet Hot Meal',
    description: 'Uçuş sırasında usta şefler tarafından hazırlanan özel yemek servisi.',
    descriptionEn: 'Chef-prepared hot meals and premium beverages on board.',
    price: 120,
    icon: 'Coffee'
  }
];
