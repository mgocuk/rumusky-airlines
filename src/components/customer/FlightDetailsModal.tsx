import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Plane,
  Wifi,
  Coffee,
  Zap,
  Briefcase,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText
} from 'lucide-react';

export const FlightDetailsModal: React.FC = () => {
  const { flightDetailsModal, setFlightDetailsModal, selectFlightForBooking, t, language, aircrafts } = useApp();

  if (!flightDetailsModal) return null;

  const f = flightDetailsModal;
  const matchingAircraft = aircrafts.find((ac) => ac.id === f.aircraftId || ac.model === f.aircraftModel);

  const handleBookNow = () => {
    selectFlightForBooking(f);
    setFlightDetailsModal(null);
  };

  return (
    <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-brand-border max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-blue flex items-center justify-center">
              <Plane className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-brand-navy">
                {t('modal_flight_details_title')}
              </h3>
              <p className="text-xs text-brand-muted">
                {f.flightNumber} • {f.aircraftModel}
              </p>
            </div>
          </div>

          <button
            onClick={() => setFlightDetailsModal(null)}
            className="p-2 rounded-xl text-slate-400 hover:text-brand-navy hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Route Schedule Box */}
        <div className="bg-brand-bg rounded-2xl p-5 border border-brand-border mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-brand-navy">{f.originAirport.iataCode}</div>
              <div className="text-xs font-bold text-slate-700">{f.originAirport.city}</div>
              <div className="text-xs text-brand-muted mt-1">{f.originAirport.name}</div>
              <div className="text-xs font-semibold text-brand-blue mt-1">
                Kalkış: {f.departureTime.split('T')[1].substring(0, 5)}
              </div>
            </div>

            <div className="text-center px-4">
              <div className="text-xs font-semibold text-brand-muted flex items-center justify-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{Math.floor(f.durationMinutes / 60)}s {f.durationMinutes % 60}dk</span>
              </div>
              <div className="w-24 sm:w-32 h-[2px] bg-slate-300 relative flex items-center justify-center">
                <Plane className="w-4 h-4 text-brand-blue absolute rotate-90" />
              </div>
              <span className="text-[10px] text-emerald-600 font-bold mt-1 block">Direkt Sefer</span>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black text-brand-navy">{f.destinationAirport.iataCode}</div>
              <div className="text-xs font-bold text-slate-700">{f.destinationAirport.city}</div>
              <div className="text-xs text-brand-muted mt-1">{f.destinationAirport.name}</div>
              <div className="text-xs font-semibold text-brand-blue mt-1">
                Varış: {f.arrivalTime.split('T')[1].substring(0, 5)}
              </div>
            </div>
          </div>
        </div>

        {/* Assigned Aircraft Spotlight */}
        {matchingAircraft && (
          <div className="mb-6 rounded-2xl overflow-hidden border border-brand-border bg-slate-50 shadow-2xs">
            <div className="relative h-40 bg-slate-900">
              <img
                src={matchingAircraft.imageUrl || 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80'}
                alt={matchingAircraft.model}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/30 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 text-white flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-brand-cyan block">
                    Uçuş Uçağınız • {matchingAircraft.manufacturer}
                  </span>
                  <span className="text-base sm:text-lg font-black font-heading leading-tight">
                    {matchingAircraft.model}
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold bg-white/20 backdrop-blur-md text-white border border-white/30">
                  {matchingAircraft.registrationNumber}
                </span>
              </div>
            </div>

            <div className="p-4 space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="p-2 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-bold">KAPASİTE</span>
                  <span className="font-extrabold text-brand-navy">{matchingAircraft.totalCapacity} Yolcu</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-bold">MENZİL</span>
                  <span className="font-extrabold text-brand-navy">{matchingAircraft.rangeKm?.toLocaleString() || '6,300'} km</span>
                </div>
                <div className="p-2 rounded-xl bg-white border border-slate-200">
                  <span className="text-[10px] text-slate-400 block font-bold">SEYİR HIZI</span>
                  <span className="font-extrabold text-brand-navy">{matchingAircraft.cruiseSpeedKmh || '850'} km/s</span>
                </div>
              </div>

              {matchingAircraft.features && matchingAircraft.features.length > 0 && (
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
                    Bu Uçaktaki Konfor Donanımları:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchingAircraft.features.map((feat, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 text-brand-blue border border-blue-100">
                        ✓ {feat}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* In-Flight Amenities */}
        <div className="mb-6">
          <h4 className="font-heading font-bold text-sm text-brand-navy mb-3">
            {t('modal_amenities')}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <Wifi className="w-4 h-4 text-brand-blue flex-shrink-0" />
              <span>{t('modal_wifi')}</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <Coffee className="w-4 h-4 text-brand-cyan flex-shrink-0" />
              <span>{t('modal_meal')}</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
              <Zap className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>{t('modal_power')}</span>
            </div>
          </div>
        </div>

        {/* Baggage & Cabin Rules */}
        <div className="mb-6">
          <h4 className="font-heading font-bold text-sm text-brand-navy mb-3">
            {t('modal_baggage')}
          </h4>
          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Kayıtlı Bagaj: <b>{f.baggageAllowanceKg} kg</b> ücretsiz hakkı</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Kabin El Bagajı: 1 parça (8 kg max, 55x40x23 cm) + 1 kişisel eşya</span>
            </div>
          </div>
        </div>

        {/* Cancellation & Fare Rules */}
        <div className="mb-6 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <h4 className="font-heading font-bold text-sm text-brand-navy mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-brand-blue" />
            <span>{t('modal_fare_rules')}</span>
          </h4>
          <ul className="text-xs text-slate-600 space-y-1.5 list-disc list-inside">
            <li>Uçuştan 12 saat öncesine kadar kesintisiz iade ve tarih değişikliği imkanı.</li>
            <li>Uçuşa 12 saatten az kala %20 kesintili işlem yapılabilir.</li>
            <li>Business sınıfta sınırsız ücretsiz tarih değişikliği hakkı mevcuttur.</li>
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div>
            <span className="text-[10px] text-brand-muted uppercase tracking-wider block">Başlangıç Fiyatı</span>
            <span className="text-2xl font-black font-heading text-brand-navy">
              {f.priceEconomy.toLocaleString('tr-TR')} ₺
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setFlightDetailsModal(null)}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              Kapat
            </button>
            <button
              onClick={handleBookNow}
              className="px-6 py-2.5 bg-brand-blue hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md transition-all"
            >
              Bu Uçuşu Seç ve Devam Et
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
