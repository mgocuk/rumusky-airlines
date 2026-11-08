import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TicketCard } from './TicketCard';
import { generateTicketPDF } from '../../utils/pdfGenerator';
import {
  Plane,
  Search,
  CheckCircle,
  Home,
  Award,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export const TicketView: React.FC = () => {
  const { bookings, tickets, flights, siteContent, setActiveView, language, currentBooking } = useApp();
  const [pnrInput, setPnrInput] = useState('');
  const [targetPnr, setTargetPnr] = useState<string>('');

  // Read PNR from window.location.hash, e.g. #ticket=RMKQ92 or #bilet=RMKQ92
  useEffect(() => {
    const parseHashPnr = () => {
      const hash = window.location.hash;
      if (hash.includes('ticket=') || hash.includes('bilet=') || hash.includes('pnr=')) {
        const match = hash.match(/(?:ticket|bilet|pnr)=([A-Za-z0-9]+)/i);
        if (match && match[1]) {
          setTargetPnr(match[1].toUpperCase());
          setPnrInput(match[1].toUpperCase());
          return;
        }
      }
      if (currentBooking) {
        setTargetPnr(currentBooking.pnr);
        setPnrInput(currentBooking.pnr);
      }
    };

    parseHashPnr();
    window.addEventListener('hashchange', parseHashPnr);
    return () => window.removeEventListener('hashchange', parseHashPnr);
  }, [currentBooking]);

  const booking = bookings.find(
    (b) => b.pnr.toUpperCase() === targetPnr.toUpperCase()
  ) || (currentBooking?.pnr === targetPnr ? currentBooking : null);

  const flight = booking ? flights.find((f) => f.id === booking.flightId) : null;
  const bookingTickets = booking ? tickets.filter((t) => t.bookingId === booking.id) : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pnrInput.trim()) {
      setTargetPnr(pnrInput.trim().toUpperCase());
      window.location.hash = `#ticket=${pnrInput.trim().toUpperCase()}`;
    }
  };

  const handleDownloadPdf = async (idx: number) => {
    if (!flight) return;
    const tkt = bookingTickets[idx] || bookingTickets[0];
    const passenger = booking?.passengers[idx] || booking?.passengers[0];
    if (tkt && passenger) {
      await generateTicketPDF(tkt, flight, passenger);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg py-8 sm:py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              window.location.hash = '';
              setActiveView('home');
            }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-brand-navy font-bold text-xs border border-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-brand-blue" />
            <span>Ana Sayfaya Dön</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>Doğrulanmış Dijital Hatıra Bileti</span>
          </div>
        </div>

        {/* Header Title & University Badge */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-800 text-xs font-black uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Gaziantep Üniversitesi • Hatıra Bileti Görüntüleme Portalı</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-heading font-black text-brand-navy">
            Elektronik Hatıra Biniş Kartı
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Bu ekran, bilet üzerindeki QR kod telefon kamerası ile tarandığında açılan resmi dijital görüntüleme ve doğrulama sayfasıdır.
          </p>
        </div>

        {/* PNR Search Box (if user wants to search another PNR) */}
        <form onSubmit={handleSearchSubmit} className="max-w-md mx-auto">
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-300 shadow-xs">
            <input
              type="text"
              value={pnrInput}
              onChange={(e) => setPnrInput(e.target.value.toUpperCase())}
              placeholder="Farklı bir PNR kodu girin (örn. RMKQ92)"
              maxLength={8}
              className="flex-1 px-3 py-2 text-xs font-mono font-bold text-brand-navy uppercase focus:outline-hidden"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-brand-blue hover:bg-blue-600 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Bileti Getir
            </button>
          </div>
        </form>

        {/* Display Matching Ticket Card */}
        {booking && flight ? (
          <div className="space-y-6 animate-fade-in">
            {bookingTickets.length > 0 ? (
              bookingTickets.map((tkt, idx) => (
                <TicketCard
                  key={tkt.id}
                  booking={booking}
                  flight={flight}
                  ticket={tkt}
                  passengerIndex={idx}
                  onDownloadPdf={() => handleDownloadPdf(idx)}
                  showDownloadBtn={true}
                  isStandaloneView={true}
                />
              ))
            ) : (
              // Fallback ticket for preview if no ticket objects in array
              <TicketCard
                booking={booking}
                flight={flight}
                ticket={{
                  id: 'tkt-demo',
                  bookingId: booking.id,
                  flight: flight,
                  ticketNumber: `235-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
                  pnr: booking.pnr,
                  passenger: booking.passengers[0] || {
                    id: 'p-1',
                    firstName: 'Değerli',
                    lastName: 'Yolcumuz',
                    gender: 'M',
                    dateOfBirth: '2000-01-01',
                    passengerType: 'adult',
                    nationality: 'TR',
                    idOrPassportNo: '12345678901',
                    cabinClass: 'economy'
                  },
                  seatNumber: booking.passengers[0]?.selectedSeat || '12A',
                  cabinClass: 'economy',
                  baggageKg: 20,
                  qrCodeData: `RUMUSKY|${booking.pnr}`,
                  status: 'issued',
                  issuedAt: booking.createdAt
                }}
                passengerIndex={0}
                onDownloadPdf={() => handleDownloadPdf(0)}
                showDownloadBtn={true}
                isStandaloneView={true}
              />
            )}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center max-w-md mx-auto shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-black text-base text-brand-navy">
              Bilet Bulunamadı
            </h3>
            <p className="text-xs text-slate-500">
              {targetPnr
                ? `"${targetPnr}" koduna ait bilet kaydı bulunamadı. Lütfen PNR kodunu kontrol ediniz.`
                : 'Lütfen yukarıdaki arama alanına 6 haneli PNR rezervasyon kodunuzu giriniz.'}
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
