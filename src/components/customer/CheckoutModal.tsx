import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AVAILABLE_SERVICES } from '../../data/extraServices';
import { useToast } from '../common/Toast';
import {
  ArrowLeft,
  CreditCard,
  ShieldCheck,
  Lock,
  AlertCircle,
  CheckCircle,
  Smartphone,
  Plus,
  Check,
  Briefcase,
  Zap,
  Coffee
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const {
    selectedFlight,
    passengers,
    selectedSeats,
    searchQuery,
    completePayment,
    setActiveView,
    t,
    language
  } = useApp();

  const { showToast } = useToast();

  const [cardNumber, setCardNumber] = useState('4000 0000 0000 0001');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('888');
  const [cardHolder, setCardHolder] = useState('MUSTAFA GOCUK');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);

  // Simulation flow states
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpCode, setOtpCode] = useState('123456');

  if (!selectedFlight) {
    setActiveView('home');
    return null;
  }

  const toggleService = (serviceId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId]
    );
  };

  // Price calculations
  const isBusiness = searchQuery?.cabinClass === 'business';
  const basePricePerPerson = isBusiness ? selectedFlight.priceBusiness : selectedFlight.priceEconomy;
  const taxesPerPerson = Math.round(basePricePerPerson * 0.18);
  
  let seatSurcharges = 0;
  Object.values(selectedSeats).forEach((seat) => {
    if (seat.endsWith('A') || seat.endsWith('F')) seatSurcharges += 100;
    if (seat.startsWith('12') || seat.startsWith('13')) seatSurcharges += 250;
  });

  const baseTotal = basePricePerPerson * passengers.length;
  const taxesTotal = taxesPerPerson * passengers.length;

  const extraServicesTotal = selectedServiceIds.reduce((sum, id) => {
    const s = AVAILABLE_SERVICES.find((srv) => srv.id === id);
    return sum + (s ? s.price * passengers.length : 0);
  }, 0);

  const grandTotal = baseTotal + taxesTotal + seatSurcharges + extraServicesTotal;

  const handleTestCardSelect = (type: 'success' | 'fail') => {
    if (type === 'success') {
      setCardNumber('4000 0000 0000 0001');
      setCardHolder('DEMO KULLANICI');
      setErrorMessage(null);
    } else {
      setCardNumber('4000 0000 0000 0002');
      setCardHolder('YETERSIZ BAKIYE');
    }
  };

  const handlePaymentInitiate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      if (cardNumber.endsWith('0002')) {
        setErrorMessage(
          language === 'tr'
            ? 'Test Ödeme Hatası: Kartınızda yetersiz bakiye bulunmaktadır. Lütfen başarılı test kartını seçiniz.'
            : 'Simulated Payment Error: Insufficient funds. Please select the successful test card.'
        );
      } else {
        setShowOtpModal(true);
      }
    }, 1200);
  };

  const handleVerifyOtpAndFinish = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowOtpModal(false);

      const lastFour = cardNumber.replace(/\s+/g, '').slice(-4) || '0001';
      completePayment({
        cardLastFour: lastFour,
        cardBrand: 'Visa Test'
      });
      showToast('Biletiniz başarıyla oluşturuldu!', 'success');
    }, 1000);
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Briefcase': return <Briefcase className="w-4 h-4 text-brand-blue" />;
      case 'Zap': return <Zap className="w-4 h-4 text-amber-500" />;
      case 'Coffee': return <Coffee className="w-4 h-4 text-brand-cyan" />;
      default: return <ShieldCheck className="w-4 h-4 text-emerald-600" />;
    }
  };

  return (
    <div className="max-w-[1050px] w-full mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setActiveView('seats')}
          className="p-2.5 rounded-xl bg-white border border-brand-border text-brand-navy hover:text-brand-blue transition-colors shadow-xs"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold font-heading text-brand-navy">
            {t('checkout_title')}
          </h2>
          <p className="text-xs text-brand-muted mt-0.5">
            {language === 'tr' ? 'Ek hizmetleri seçin ve test kartıyla işleminizi onaylayın' : 'Select extra services and confirm with simulated payment'}
          </p>
        </div>
      </div>

      {/* Academic Disclaimer Alert */}
      <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-bold">{t('checkout_test_banner')}</div>
          <div className="mt-1 text-blue-800">
            {language === 'tr'
              ? 'Tüm işlem simülasyon olarak yürütülür; banka veya gerçek kart bilgisi gerekmez.'
              : 'All transactions are simulated for academic demonstration. No real financial credentials required.'}
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Extra Services + Test Payment Card Form */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Extra Services Picker */}
          <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle">
            <h3 className="font-heading font-bold text-base text-brand-navy mb-1">
              İsteğe Bağlı Ek Hizmetler
            </h3>
            <p className="text-xs text-brand-muted mb-4">
              Seyahatinizi daha konforlu kılmak için dilediğiniz hizmeti ekleyebilirsiniz.
            </p>

            <div className="space-y-2.5">
              {AVAILABLE_SERVICES.map((srv) => {
                const isSelected = selectedServiceIds.includes(srv.id);
                const title = language === 'en' ? srv.nameEn : srv.name;
                const desc = language === 'en' ? srv.descriptionEn : srv.description;

                return (
                  <div
                    key={srv.id}
                    onClick={() => toggleService(srv.id)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-blue-50/80 border-brand-blue shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center border ${
                        isSelected ? 'bg-brand-blue border-brand-blue text-white' : 'border-slate-300 bg-white'
                      }`}>
                        {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                      <div className="flex items-center gap-2">
                        {getServiceIcon(srv.icon)}
                        <div>
                          <div className="text-xs font-bold text-brand-navy">{title}</div>
                          <div className="text-[10px] text-brand-muted">{desc}</div>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs font-black text-brand-navy whitespace-nowrap">
                      +{srv.price} ₺
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Test Payment Form */}
          <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
              <div className="flex items-center gap-2 font-heading font-bold text-base text-brand-navy">
                <CreditCard className="w-5 h-5 text-brand-blue" />
                <span>Simüle Test Kartı</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                <Lock className="w-3 h-3" />
                <span>256-Bit SSL Mock</span>
              </div>
            </div>

            {/* Quick Test Cards Picker */}
            <div className="mb-6 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-2">
                {t('checkout_test_cards')}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleTestCardSelect('success')}
                  className="px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-bold text-left flex items-center gap-2 transition-colors"
                >
                  <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{t('checkout_test_success')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleTestCardSelect('fail')}
                  className="px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-xs font-bold text-left flex items-center gap-2 transition-colors"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{t('checkout_test_fail')}</span>
                </button>
              </div>
            </div>

            {/* Credit Card Input Form */}
            <form onSubmit={handlePaymentInitiate} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
                  {t('checkout_cardholder')}
                </label>
                <input
                  type="text"
                  required
                  value={cardHolder}
                  onChange={(e) => setCardHolder(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-brand-bg rounded-xl border border-brand-border text-sm font-semibold uppercase tracking-wider focus:border-brand-blue focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
                  {t('checkout_card_number')}
                </label>
                <input
                  type="text"
                  required
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-brand-bg rounded-xl border border-brand-border text-sm font-mono font-bold tracking-widest focus:border-brand-blue focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
                    {t('checkout_expiry')}
                  </label>
                  <input
                    type="text"
                    required
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-brand-bg rounded-xl border border-brand-border text-sm font-mono font-bold focus:border-brand-blue focus:outline-hidden text-center"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
                    {t('checkout_cvv')}
                  </label>
                  <input
                    type="password"
                    maxLength={3}
                    required
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-brand-bg rounded-xl border border-brand-border text-sm font-mono font-bold focus:border-brand-blue focus:outline-hidden text-center"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-4 py-4 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-heading font-extrabold text-base shadow-elevated transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>İşlem Doğrulanıyor...</span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>{grandTotal.toLocaleString('tr-TR')} ₺ {t('checkout_pay_button')}</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right: Booking Summary Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-brand-border shadow-subtle sticky top-24">
            <h3 className="font-heading font-bold text-base text-brand-navy pb-3 border-b border-slate-100 mb-4">
              {t('checkout_flight_summary')}
            </h3>

            {/* Flight info */}
            <div className="space-y-3 pb-4 border-b border-slate-100 text-xs">
              <div className="flex justify-between">
                <span className="text-brand-muted">Uçuş Kodu:</span>
                <span className="font-bold text-brand-navy">{selectedFlight.flightNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Güzergah:</span>
                <span className="font-bold text-brand-navy">
                  {selectedFlight.originAirport.city} ({selectedFlight.originAirport.iataCode}) → {selectedFlight.destinationAirport.city} ({selectedFlight.destinationAirport.iataCode})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Tarih / Saat:</span>
                <span className="font-bold text-brand-navy">
                  {selectedFlight.departureTime.split('T')[0]} ({selectedFlight.departureTime.split('T')[1].substring(0, 5)})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-brand-muted">Kabin Sınıfı:</span>
                <span className="font-bold text-brand-navy uppercase">{searchQuery?.cabinClass || 'EKONOMİ'}</span>
              </div>
            </div>

            {/* Passengers & Seats */}
            <div className="py-4 border-b border-slate-100 text-xs space-y-2">
              <div className="font-bold text-brand-navy">{t('checkout_passenger_summary')}:</div>
              {passengers.map((p, idx) => (
                <div key={p.id} className="flex justify-between text-slate-600">
                  <span>{idx + 1}. {p.firstName} {p.lastName}</span>
                  <span className="font-bold text-brand-blue">
                    Koltuk: {selectedSeats[p.id] || 'Atanacak'}
                  </span>
                </div>
              ))}
            </div>

            {/* Pricing breakdown */}
            <div className="pt-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>{t('checkout_base_fare')} ({passengers.length}x):</span>
                <span>{baseTotal.toLocaleString('tr-TR')} ₺</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>{t('checkout_taxes_fees')}:</span>
                <span>{taxesTotal.toLocaleString('tr-TR')} ₺</span>
              </div>
              {seatSurcharges > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>{t('checkout_seat_selection_fee')}:</span>
                  <span>+{seatSurcharges.toLocaleString('tr-TR')} ₺</span>
                </div>
              )}
              {extraServicesTotal > 0 && (
                <div className="flex justify-between text-slate-600">
                  <span>Ekstra Hizmetler ({selectedServiceIds.length}):</span>
                  <span>+{extraServicesTotal.toLocaleString('tr-TR')} ₺</span>
                </div>
              )}

              <div className="pt-3 mt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="font-heading font-extrabold text-sm text-brand-navy">
                  {t('checkout_total')}
                </span>
                <span className="font-heading font-black text-2xl text-brand-navy">
                  {grandTotal.toLocaleString('tr-TR')} ₺
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Secure Simulation Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-brand-border">
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-slate-100">
              <div className="w-10 h-10 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-heading font-bold text-base text-brand-navy">
                  {t('checkout_otp_modal_title')}
                </h4>
                <p className="text-xs text-brand-muted">RUMUSKY Secure Gateway</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              {t('checkout_otp_modal_desc')}
            </p>

            <div className="mb-6">
              <input
                type="text"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                maxLength={6}
                className="w-full py-3 text-center text-2xl font-mono font-bold tracking-[0.5em] bg-slate-50 border border-slate-300 rounded-xl focus:border-brand-blue focus:outline-hidden"
              />
              <span className="text-[10px] text-center block text-brand-muted mt-2">
                Simülasyon Kodu: <b>123456</b>
              </span>
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowOtpModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl"
              >
                İptal Et
              </button>
              <button
                type="button"
                onClick={handleVerifyOtpAndFinish}
                disabled={isProcessing}
                className="px-6 py-2.5 bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md transition-all"
              >
                {isProcessing ? 'Onaylanıyor...' : t('checkout_otp_confirm')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
