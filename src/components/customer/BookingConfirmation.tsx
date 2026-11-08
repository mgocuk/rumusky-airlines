import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateTicketPDF } from '../../utils/pdfGenerator';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import {
  CheckCircle,
  Download,
  Home,
  Plane,
  QrCode,
  Calendar,
  Clock,
  User,
  Share2
} from 'lucide-react';

export const BookingConfirmation: React.FC = () => {
  const { currentBooking, flights, tickets, setActiveView, t, language } = useApp();
  const [qrCodeDataUrls, setQrCodeDataUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    // Launch celebratory confetti!
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }, []);

  if (!currentBooking) {
    setActiveView('home');
    return null;
  }

  const bookedFlight = flights.find((f) => f.id === currentBooking.flightId);
  const bookingTickets = tickets.filter((tkt) => tkt.bookingId === currentBooking.id);

  // Generate QR codes for tickets
  useEffect(() => {
    bookingTickets.forEach(async (tkt) => {
      const url = await QRCode.toDataURL(tkt.qrCodeData, { width: 140, margin: 1 });
      setQrCodeDataUrls((prev) => ({ ...prev, [tkt.id]: url }));
    });
  }, [bookingTickets]);

  const handleDownloadPDF = async (ticketIndex: number = 0) => {
    if (!bookedFlight) return;
    const tkt = bookingTickets[ticketIndex] || bookingTickets[0];
    const passenger = currentBooking.passengers[ticketIndex] || currentBooking.passengers[0];

    await generateTicketPDF(tkt, bookedFlight, passenger);
  };

  return (
    <div className="max-w-[850px] w-full mx-auto px-4 sm:px-6 py-10">
      {/* Success Badge */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-subtle animate-bounce">
          <CheckCircle className="w-10 h-10 stroke-[2.25]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-brand-navy">
          {t('confirm_success_title')}
        </h2>
        <p className="text-sm text-brand-muted mt-1.5 max-w-md mx-auto">
          {t('confirm_success_desc')}
        </p>

        {/* Big PNR Box */}
        <div className="mt-6 inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border-2 border-brand-blue shadow-subtle">
          <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">
            {t('confirm_pnr_label')}
          </span>
          <span className="font-mono font-black text-2xl sm:text-3xl tracking-widest text-brand-blue">
            {currentBooking.pnr}
          </span>
        </div>
      </div>

      {/* Flight & Ticket Cards */}
      {bookedFlight && (
        <div className="bg-white rounded-3xl border border-brand-border shadow-elevated overflow-hidden mb-8">
          {/* Top Banner */}
          <div className="bg-brand-navy text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Plane className="w-5 h-5 text-brand-cyan" />
              <span className="font-heading font-bold text-sm tracking-wider">
                {bookedFlight.flightNumber} • {bookedFlight.aircraftModel}
              </span>
            </div>
            <div className="text-xs text-sky-200 font-mono">
              Düzenleme Tarihi: {new Date().toLocaleDateString('tr-TR')}
            </div>
          </div>

          {/* Route & Times */}
          <div className="p-6 sm:p-8 border-b border-slate-100">
            <div className="flex items-center justify-between max-w-lg mx-auto">
              <div>
                <div className="text-3xl sm:text-4xl font-black font-heading text-brand-navy">
                  {bookedFlight.originAirport.iataCode}
                </div>
                <div className="text-xs font-bold text-slate-700 mt-1">
                  {bookedFlight.originAirport.city}
                </div>
                <div className="text-sm font-semibold text-brand-blue mt-0.5">
                  {bookedFlight.departureTime.split('T')[1].substring(0, 5)}
                </div>
              </div>

              <div className="text-center px-4">
                <span className="text-[11px] text-brand-muted font-medium block mb-1">
                  Direkt Uçuş
                </span>
                <div className="w-24 sm:w-36 h-[2px] bg-slate-300 relative flex items-center justify-center">
                  <Plane className="w-4 h-4 text-brand-blue absolute rotate-90" />
                </div>
                <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                  {bookedFlight.departureTime.split('T')[0]}
                </span>
              </div>

              <div className="text-right">
                <div className="text-3xl sm:text-4xl font-black font-heading text-brand-navy">
                  {bookedFlight.destinationAirport.iataCode}
                </div>
                <div className="text-xs font-bold text-slate-700 mt-1">
                  {bookedFlight.destinationAirport.city}
                </div>
                <div className="text-sm font-semibold text-brand-blue mt-0.5">
                  {bookedFlight.arrivalTime.split('T')[1].substring(0, 5)}
                </div>
              </div>
            </div>
          </div>

          {/* Passengers & QR Codes List */}
          <div className="p-6 divide-y divide-slate-100">
            {bookingTickets.map((tkt, idx) => (
              <div key={tkt.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 text-brand-navy flex items-center justify-center font-bold text-sm">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-heading font-extrabold text-base text-brand-navy">
                      {tkt.passenger.firstName} {tkt.passenger.lastName}
                    </h4>
                    <p className="text-xs text-brand-muted mt-0.5">
                      Bilet No: <span className="font-mono text-slate-700 font-semibold">{tkt.ticketNumber}</span> • Koltuk: <span className="font-bold text-brand-blue">{tkt.seatNumber}</span> • {tkt.cabinClass.toUpperCase()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  {qrCodeDataUrls[tkt.id] && (
                    <img
                      src={qrCodeDataUrls[tkt.id]}
                      alt="Ticket QR"
                      className="w-14 h-14 border border-slate-200 rounded-lg p-0.5"
                      title="Havalimanı kapı QR kodu"
                    />
                  )}

                  <button
                    onClick={() => handleDownloadPDF(idx)}
                    className="px-4 py-2.5 rounded-xl bg-brand-navy hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
                  >
                    <Download className="w-4 h-4 text-brand-cyan" />
                    <span>PDF İndir</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Return to Home / Navigation */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => setActiveView('home')}
          className="px-8 py-3.5 bg-brand-blue hover:bg-blue-600 text-white font-heading font-bold rounded-xl shadow-elevated flex items-center gap-2 transition-all"
        >
          <Home className="w-4 h-4" />
          <span>{t('confirm_return_home')}</span>
        </button>
      </div>
    </div>
  );
};
