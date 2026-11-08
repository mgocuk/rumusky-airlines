import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Booking, Flight } from '../../types';
import { generateTicketPDF } from '../../utils/pdfGenerator';
import { Search, Download, AlertCircle, Plane, CheckCircle2 } from 'lucide-react';

export const ManageBooking: React.FC = () => {
  const { findBooking, flights, tickets, t, language } = useApp();

  const [pnrInput, setPnrInput] = useState('');
  const [surnameInput, setSurnameInput] = useState('');
  const [searched, setSearched] = useState(false);
  const [foundBooking, setFoundBooking] = useState<Booking | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearched(true);
    const result = findBooking(pnrInput, surnameInput);
    setFoundBooking(result);
  };

  const bookedFlight = foundBooking ? flights.find((f) => f.id === foundBooking.flightId) : null;
  const bookingTickets = foundBooking ? tickets.filter((tkt) => tkt.bookingId === foundBooking.id) : [];

  const handleDownloadTicket = async (index: number) => {
    if (!bookedFlight || !foundBooking) return;
    const ticket = bookingTickets[index] || bookingTickets[0];
    const passenger = foundBooking.passengers[index] || foundBooking.passengers[0];
    await generateTicketPDF(ticket, bookedFlight, passenger);
  };

  return (
    <div className="max-w-[850px] w-full mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-brand-navy">
          {t('manage_title')}
        </h2>
        <p className="text-sm text-brand-muted mt-2 max-w-lg mx-auto">
          {t('manage_subtitle')}
        </p>
      </div>

      {/* Lookup Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-elevated mb-8">
        <form onSubmit={handleSearch} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
          <div className="sm:col-span-5">
            <label className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
              {t('manage_pnr_input')}
            </label>
            <input
              type="text"
              required
              placeholder="Örn: RMK84A"
              value={pnrInput}
              onChange={(e) => setPnrInput(e.target.value.toUpperCase())}
              className="w-full px-4 py-3 bg-brand-bg rounded-xl border border-brand-border text-base font-mono font-bold tracking-widest uppercase focus:border-brand-blue focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-5">
            <label className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
              {t('manage_surname_input')}
            </label>
            <input
              type="text"
              required
              placeholder="Örn: Yılmaz"
              value={surnameInput}
              onChange={(e) => setSurnameInput(e.target.value)}
              className="w-full px-4 py-3 bg-brand-bg rounded-xl border border-brand-border text-base font-bold focus:border-brand-blue focus:outline-hidden"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all"
            >
              <Search className="w-4 h-4" />
              <span>Bul</span>
            </button>
          </div>
        </form>
      </div>

      {/* Not Found State */}
      {searched && !foundBooking && (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{t('manage_not_found')}</span>
        </div>
      )}

      {/* Found Booking Details */}
      {foundBooking && bookedFlight && (() => {
        const isPastFlight = new Date(bookedFlight.departureTime).getTime() <= Date.now();

        return (
          <div className="bg-white rounded-3xl border border-brand-border shadow-elevated overflow-hidden animate-fade-in">
            <div className="bg-brand-navy text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plane className="w-5 h-5 text-brand-cyan" />
                <span className="font-heading font-bold text-sm">
                  PNR: {foundBooking.pnr} • {bookedFlight.flightNumber}
                </span>
              </div>
              {isPastFlight ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-500/30 text-slate-300 border border-slate-500/40">
                  Geçmiş Sefer (Tamamlandı)
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Onaylandı (Aktif Sefer)
                </span>
              )}
            </div>

            {isPastFlight ? (
              <div className="mx-6 mt-4 p-3 bg-slate-100 rounded-xl border border-slate-200 text-slate-700 text-xs font-medium flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                <span>Bu uçuşun kalkış zamanı geçmişte kalmıştır. Gerçekleşmiş geçmiş uçuşunuzun e-bilet dökümünü aşağıdan indirebilirsiniz.</span>
              </div>
            ) : (
              <div className="mx-6 mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Uçuşunuz güncel ve onaylanmıştır. Uçuş saatinden en az 2 saat önce havalimanında bulunmanız gerekmektedir.</span>
              </div>
            )}

            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-brand-navy">{bookedFlight.originAirport.iataCode}</div>
              <div className="text-xs text-brand-muted">{bookedFlight.originAirport.city}</div>
              <div className="text-xs font-semibold text-brand-blue mt-1">
                {bookedFlight.departureTime.split('T')[0]} ({bookedFlight.departureTime.split('T')[1].substring(0, 5)})
              </div>
            </div>

            <div className="text-center">
              <Plane className="w-5 h-5 text-brand-blue mx-auto mb-1 rotate-90" />
              <div className="text-xs text-brand-muted">{bookedFlight.aircraftModel}</div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-black text-brand-navy">{bookedFlight.destinationAirport.iataCode}</div>
              <div className="text-xs text-brand-muted">{bookedFlight.destinationAirport.city}</div>
              <div className="text-xs font-semibold text-brand-blue mt-1">
                {bookedFlight.arrivalTime.split('T')[0]} ({bookedFlight.arrivalTime.split('T')[1].substring(0, 5)})
              </div>
            </div>
          </div>

          <div className="p-6 divide-y divide-slate-100">
            {foundBooking.passengers.map((p, idx) => (
              <div key={p.id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-brand-navy">{p.firstName} {p.lastName}</h4>
                  <p className="text-xs text-brand-muted">
                    Koltuk: <span className="font-bold text-brand-blue">{p.selectedSeat || 'Girişte'}</span> • {p.cabinClass.toUpperCase()}
                  </p>
                </div>
                <button
                  onClick={() => handleDownloadTicket(idx)}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-brand-navy text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-4 h-4 text-brand-blue" />
                  <span>PDF Bilet İndir</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      ); })()}
    </div>
  );
};
