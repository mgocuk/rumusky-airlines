import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { generateTicketPDF } from '../../utils/pdfGenerator';
import { TicketCard } from './TicketCard';
import confetti from 'canvas-confetti';
import {
  CheckCircle,
  Home,
  Sparkles,
  Plane
} from 'lucide-react';

export const BookingConfirmation: React.FC = () => {
  const { currentBooking, flights, tickets, setActiveView, t, language, siteContent } = useApp();

  useEffect(() => {
    // Launch celebratory confetti!
    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.55 }
    });
  }, []);

  if (!currentBooking) {
    setActiveView('home');
    return null;
  }

  const bookedFlight = flights.find((f) => f.id === currentBooking.flightId);
  const bookingTickets = tickets.filter((tkt) => tkt.bookingId === currentBooking.id);

  const handleDownloadPDF = async (ticketIndex: number = 0) => {
    if (!bookedFlight) return;
    const tkt = bookingTickets[ticketIndex] || bookingTickets[0];
    const passenger = currentBooking.passengers[ticketIndex] || currentBooking.passengers[0];

    await generateTicketPDF(tkt, bookedFlight, passenger);
  };

  return (
    <div className="max-w-[920px] w-full mx-auto px-4 sm:px-6 py-10 space-y-8 animate-fade-in">
      {/* Success Badge */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm animate-bounce">
          <CheckCircle className="w-10 h-10 stroke-[2.25]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-heading text-brand-navy">
          {t('confirm_success_title')}
        </h2>
        <p className="text-sm text-brand-muted max-w-md mx-auto">
          {t('confirm_success_desc')}
        </p>

        {/* Big PNR Box */}
        <div className="mt-4 inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white border-2 border-brand-blue shadow-sm">
          <span className="text-xs font-bold text-brand-muted uppercase tracking-wider">
            {t('confirm_pnr_label')}
          </span>
          <span className="font-mono font-black text-2xl sm:text-3xl tracking-widest text-brand-blue">
            {currentBooking.pnr}
          </span>
        </div>
      </div>

      {/* Commemorative Boarding Passes (Hatıra Biletleri) List */}
      {bookedFlight && (
        <div className="space-y-6">
          {bookingTickets.map((tkt, idx) => (
            <TicketCard
              key={tkt.id}
              booking={currentBooking}
              flight={bookedFlight}
              ticket={tkt}
              passengerIndex={idx}
              onDownloadPdf={() => handleDownloadPDF(idx)}
              showDownloadBtn={true}
              isStandaloneView={false}
            />
          ))}
        </div>
      )}

      {/* Return to Home / Navigation */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
        <button
          type="button"
          onClick={() => setActiveView('home')}
          className="px-8 py-3.5 bg-brand-blue hover:bg-blue-600 text-white font-heading font-bold rounded-2xl shadow-elevated flex items-center gap-2 transition-all cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>{t('confirm_return_home')}</span>
        </button>
      </div>
    </div>
  );
};
