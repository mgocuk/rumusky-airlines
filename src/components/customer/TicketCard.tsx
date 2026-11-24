import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Booking, Flight, Ticket, TicketDesignConfig } from '../../types';
import { useApp } from '../../context/AppContext';
import { realtimeSync } from '../../services/realtimeSync';
import { Download, Share2, QrCode, Check } from 'lucide-react';

interface TicketCardProps {
  booking: Booking;
  flight: Flight;
  ticket: Ticket;
  passengerIndex?: number;
  onDownloadPdf?: () => void;
  showDownloadBtn?: boolean;
  isStandaloneView?: boolean;
  customTicketDesign?: TicketDesignConfig;
}

export function formatTicketDisplayFields(booking: Booking, flight: Flight, ticket: Ticket) {
  const originCity = (flight.originAirport?.city || '').toLocaleUpperCase('tr-TR');
  const originCode = (flight.originAirport?.iataCode || 'IST').toUpperCase();
  const destCity = (flight.destinationAirport?.city || '').toLocaleUpperCase('tr-TR');
  const destCode = (flight.destinationAirport?.iataCode || 'LHR').toUpperCase();

  const depTime = flight.departureTime?.includes('T')
    ? flight.departureTime.split('T')[1].substring(0, 5)
    : '10:30';
  const rawDate = flight.departureTime?.includes('T')
    ? flight.departureTime.split('T')[0]
    : '';
  const [yyyy, mm, dd] = rawDate.split('-');
  const formattedDate = yyyy && mm && dd ? `${dd}.${mm}.${yyyy}` : rawDate;

  const passengerName = `${ticket.passenger?.firstName || ''} ${ticket.passenger?.lastName || ''}`
    .trim()
    .toLocaleUpperCase('tr-TR');

  const seatLabel = (ticket.seatNumber || booking.passengers?.[0]?.selectedSeat || 'TBA').toUpperCase();
  const flightNo = (flight.flightNumber || 'RMK-101').toUpperCase();
  const gateCode = 'A-12';

  return {
    fromText: `${originCity} (${originCode})`,
    toText: `${destCity} (${destCode})`,
    flightNo,
    formattedDate,
    gateCode,
    passengerName,
    depTime,
    seatLabel
  };
}

export const TicketCard: React.FC<TicketCardProps> = ({
  booking,
  flight,
  ticket,
  onDownloadPdf,
  showDownloadBtn = true
}) => {
  const { language } = useApp();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [showQrBox, setShowQrBox] = useState(false);
  const [copied, setCopied] = useState(false);

  const [ticketLiveUrl, setTicketLiveUrl] = useState<string>(
    `${window.location.origin}/#ticket=${booking.pnr}&tkt=${ticket.ticketNumber}`
  );

  useEffect(() => {
    let active = true;

    const resolveUrlAndGenerateQr = async () => {
      let base = window.location.origin;

      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        try {
          const netInfo = await realtimeSync.fetchNetworkInfo();
          if (netInfo && netInfo.url) {
            base = netInfo.url;
          }
        } catch {
          // fallback to origin
        }
      }

      const fullUrl = `${base}/#ticket=${booking.pnr}&tkt=${ticket.ticketNumber}`;

      if (active) {
        setTicketLiveUrl(fullUrl);
        try {
          const url = await QRCode.toDataURL(fullUrl, {
            width: 220,
            margin: 1,
            errorCorrectionLevel: 'M',
            color: {
              dark: '#0B2545',
              light: '#FFFFFF'
            }
          });
          if (active) setQrCodeUrl(url);
        } catch (err) {
          console.error('QR code generation error:', err);
        }
      }
    };

    void resolveUrlAndGenerateQr();

    return () => {
      active = false;
    };
  }, [booking.pnr, ticket.ticketNumber]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Hatıra Biniş Kartı (${booking.pnr})`,
          text: `${ticket.passenger.firstName} ${ticket.passenger.lastName} için ${flight.originAirport.city} - ${flight.destinationAirport.city} hatıra bileti.`,
          url: ticketLiveUrl
        });
      } catch {
        // user cancelled share
      }
    } else {
      navigator.clipboard.writeText(ticketLiveUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const fields = formatTicketDisplayFields(booking, flight, ticket);

  const fieldTypography: React.CSSProperties = {
    fontFamily: "'Georgia', 'Times New Roman', serif",
    color: '#182230'
  };

  return (
    <div className="w-full space-y-3">
      {/* Exact 1:1 Souvenir Boarding Pass Visual */}
      <div
        className="relative w-full aspect-[941/293] select-none drop-shadow-2xl"
        style={{ containerType: 'inline-size' }}
      >
        <img
          src="/tickets/souvenir-ticket-template.png"
          alt="Hatıra Biniş Kartı"
          className="w-full h-full object-contain block pointer-events-none"
          draggable={false}
        />

        {/* FROM value */}
        <div
          className="absolute font-bold uppercase tracking-wide truncate leading-none"
          style={{
            ...fieldTypography,
            left: '40.5%',
            top: '29.6%',
            maxWidth: '37%',
            fontSize: '1.62cqw'
          }}
        >
          {fields.fromText}
        </div>

        {/* TO value */}
        <div
          className="absolute font-bold uppercase tracking-wide truncate leading-none"
          style={{
            ...fieldTypography,
            left: '40.5%',
            top: '44.4%',
            maxWidth: '37%',
            fontSize: '1.62cqw'
          }}
        >
          {fields.toText}
        </div>

        {/* FLIGHT value */}
        <div
          className="absolute font-bold uppercase tracking-wide truncate leading-none"
          style={{
            ...fieldTypography,
            left: '41.5%',
            top: '61.7%',
            maxWidth: '8.5%',
            fontSize: '1.16cqw'
          }}
        >
          {fields.flightNo}
        </div>

        {/* DATE value */}
        <div
          className="absolute font-bold uppercase tracking-wide truncate leading-none"
          style={{
            ...fieldTypography,
            left: '54.2%',
            top: '61.7%',
            maxWidth: '10%',
            fontSize: '1.16cqw'
          }}
        >
          {fields.formattedDate}
        </div>

        {/* GATE value */}
        <div
          className="absolute font-bold uppercase tracking-wide truncate leading-none"
          style={{
            ...fieldTypography,
            left: '68.8%',
            top: '61.7%',
            maxWidth: '9%',
            fontSize: '1.16cqw'
          }}
        >
          {fields.gateCode}
        </div>

        {/* PASSENGER value (cleanly below PASSENGER label so long names never collide with TIME) */}
        <div
          className="absolute font-bold uppercase tracking-wide truncate leading-none"
          style={{
            ...fieldTypography,
            left: '36.4%',
            top: '74.8%',
            maxWidth: '14%',
            fontSize: '0.96cqw'
          }}
          title={fields.passengerName}
        >
          {fields.passengerName}
        </div>

        {/* TIME value */}
        <div
          className="absolute font-bold uppercase tracking-wide truncate leading-none"
          style={{
            ...fieldTypography,
            left: '54.2%',
            top: '70.3%',
            maxWidth: '10%',
            fontSize: '1.16cqw'
          }}
        >
          {fields.depTime}
        </div>

        {/* SEAT value */}
        <div
          className="absolute font-bold uppercase tracking-wide truncate leading-none"
          style={{
            ...fieldTypography,
            left: '41.5%',
            top: '78.4%',
            maxWidth: '8.5%',
            fontSize: '1.16cqw'
          }}
        >
          {fields.seatLabel}
        </div>
      </div>

      {/* External Action Bar (kept outside the ticket artwork so ticket stays 100% pure) */}
      {showDownloadBtn && (
        <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white/90 backdrop-blur-xs px-4 py-3 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-mono font-black text-brand-navy bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
              PNR: {booking.pnr}
            </span>
            <span className="text-slate-500 font-mono hidden sm:inline">
              {ticket.ticketNumber}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {qrCodeUrl && (
              <button
                type="button"
                onClick={() => setShowQrBox((prev) => !prev)}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-brand-navy" />
                <span>{language === 'en' ? 'Verification QR' : 'Doğrulama QR'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5 text-brand-blue" />}
              <span>
                {copied
                  ? language === 'en'
                    ? 'Link Copied'
                    : 'Bağlantı Kopyalandı'
                  : language === 'en'
                  ? 'Share'
                  : 'Paylaş'}
              </span>
            </button>

            {onDownloadPdf && (
              <button
                type="button"
                onClick={onDownloadPdf}
                className="px-4 py-2 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-300 border border-amber-400/30 font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'en' ? 'Download Souvenir Ticket (PDF)' : 'Hatıra Biletini İndir (PDF)'}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {showQrBox && qrCodeUrl && (
        <div className="bg-white rounded-2xl border border-slate-200 p-4 flex items-center gap-4 shadow-xs animate-fade-in">
          <a href={ticketLiveUrl} target="_blank" rel="noopener noreferrer" className="shrink-0">
            <img src={qrCodeUrl} alt="Doğrulama QR Kodu" className="w-24 h-24 rounded-lg border border-slate-200" />
          </a>
          <div className="text-xs text-slate-600 space-y-1">
            <div className="font-bold text-brand-navy">
              {language === 'en' ? 'Live Ticket Verification Link' : 'Canlı Bilet Doğrulama Bağlantısı'}
            </div>
            <p className="text-[11px] text-slate-500">
              {language === 'en'
                ? 'Scan this QR code with your phone camera to view and verify this souvenir ticket online.'
                : 'Telefon kameranızla okutarak bu hatıra biletini canlı olarak görüntüleyebilirsiniz.'}
            </p>
            <div className="text-[10px] font-mono text-brand-blue break-all">{ticketLiveUrl}</div>
          </div>
        </div>
      )}
    </div>
  );
};
