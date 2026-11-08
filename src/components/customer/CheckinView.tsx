import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateTicketPDF } from '../../utils/pdfGenerator';
import { CheckCircle2, Search, Download, AlertCircle, Plane, Sparkles } from 'lucide-react';

export const CheckinView: React.FC = () => {
  const { checkinFlight, findBooking, flights, t, language, setActiveView } = useApp();

  const [pnr, setPnr] = useState('');
  const [surname, setSurname] = useState('');
  const [checkedTicket, setCheckedTicket] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const booking = findBooking(pnr, surname);
    if (booking) {
      const flight = flights.find((f) => f.id === booking.flightId);
      if (flight && new Date(flight.departureTime).getTime() <= Date.now()) {
        setError(
          language === 'tr'
            ? 'Bu uçuşun kalkış saati geçmişte kalmıştır. Gerçekleşen geçmiş uçuşlar için online check-in yapılamaz.'
            : 'This flight has already departed. Online check-in is not available for past flights.'
        );
        return;
      }
    }

    const ticket = checkinFlight(pnr, surname);
    if (!ticket) {
      setError(
        language === 'tr'
          ? 'Belirtilen PNR ve soyadına ait check-in yapılabilir uçuş bulunamadı.'
          : 'No check-in eligible flight found for the provided PNR and surname.'
      );
      return;
    }

    setCheckedTicket(ticket);
  };

  const bookedFlight = checkedTicket ? flights.find((f) => f.id === checkedTicket.flightId) : null;

  const handleDownloadBoardingPass = async () => {
    if (!bookedFlight || !checkedTicket) return;
    await generateTicketPDF(checkedTicket, bookedFlight, checkedTicket.passenger);
  };

  return (
    <div className="max-w-[850px] w-full mx-auto px-4 sm:px-6 py-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-brand-navy">
          {t('checkin_title')}
        </h2>
        <p className="text-sm text-brand-muted mt-2 max-w-lg mx-auto">
          {t('checkin_subtitle')}
        </p>
      </div>

      {/* Input Card */}
      {!checkedTicket ? (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-brand-border shadow-elevated">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleCheckin} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
            <div className="sm:col-span-5">
              <label className="text-xs font-bold text-brand-muted uppercase tracking-wider block mb-1">
                {t('manage_pnr_input')}
              </label>
              <input
                type="text"
                required
                placeholder="Örn: RMK84A"
                value={pnr}
                onChange={(e) => setPnr(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 bg-brand-bg rounded-xl border border-brand-border text-base font-mono font-bold uppercase tracking-widest focus:border-brand-blue focus:outline-hidden"
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
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
                className="w-full px-4 py-3 bg-brand-bg rounded-xl border border-brand-border text-base font-bold focus:border-brand-blue focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <button
                type="submit"
                className="w-full py-3 bg-brand-blue hover:bg-blue-600 text-white font-bold rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all text-xs"
              >
                <Search className="w-4 h-4" />
                <span>Check-in</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Checked-In Success Boarding Pass View */
        <div className="bg-white rounded-3xl border border-brand-border shadow-elevated p-6 sm:p-8 animate-fade-in text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <h3 className="text-2xl font-bold font-heading text-brand-navy">
            {t('checkin_done_success')}
          </h3>
          <p className="text-xs text-brand-muted mt-1">
            Uçuş Kapısı: <b>Gate A-12</b> • Biniş Saati: <b>Uçuştan 45 dk önce</b>
          </p>

          <div className="my-6 p-4 rounded-2xl bg-brand-bg border border-brand-border max-w-md mx-auto text-left">
            <div className="text-xs font-bold text-brand-navy">
              Yolcu: {checkedTicket.passenger.firstName} {checkedTicket.passenger.lastName}
            </div>
            <div className="text-xs text-brand-muted mt-1">
              Koltuk: <span className="font-bold text-brand-blue">{checkedTicket.seatNumber}</span> • Bilet No: {checkedTicket.ticketNumber}
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={handleDownloadBoardingPass}
              className="px-6 py-3 bg-brand-navy hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md transition-all"
            >
              <Download className="w-4 h-4 text-brand-cyan" />
              <span>Biniş Kartını İndir (PDF)</span>
            </button>
            <button
              onClick={() => setActiveView('home')}
              className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-brand-navy rounded-xl text-xs font-bold transition-all"
            >
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
