import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Booking, Flight, Passenger, Ticket, TicketDesignConfig } from '../../types';
import { useApp } from '../../context/AppContext';
import { realtimeSync } from '../../services/realtimeSync';
import { Download, Share2, QrCode, Check, Sparkles, RotateCw } from 'lucide-react';

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

export function isChildPassenger(passenger?: Partial<Passenger> | null): boolean {
  if (!passenger) return false;
  if (passenger.passengerType === 'child' || passenger.passengerType === 'infant') {
    return true;
  }
  if (passenger.dateOfBirth) {
    const birth = new Date(passenger.dateOfBirth);
    if (!Number.isNaN(birth.getTime())) {
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age -= 1;
      }
      return age < 12;
    }
  }
  return false;
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
  const flightNo = (flight.flightNumber || 'ALP-101').toUpperCase();
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
  const [showChildBack, setShowChildBack] = useState(false);
  const [copied, setCopied] = useState(false);

  const isChild = isChildPassenger(ticket.passenger);

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
              dark: '#12253E',
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
          title: `Alpha Airline Hatıra Bileti (${booking.pnr})`,
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

  const passengerFontSizeCqw =
    fields.passengerName.length > 22
      ? 0.9
      : fields.passengerName.length > 16
        ? 1.05
        : fields.passengerName.length > 12
          ? 1.18
          : 1.32;

  const childTopFieldFontSizeCqw = (text: string) =>
    text.length > 24 ? 1.55 : text.length > 18 ? 1.8 : 2.05;

  const fieldTypography: React.CSSProperties = {
    fontFamily: "'Times New Roman', Times, Georgia, serif",
    fontVariantNumeric: 'lining-nums tabular-nums',
    color: '#182230',
    lineHeight: 1.12
  };

  return (
    <div className="w-full space-y-3">
      {/* Child Ticket Badge */}
      {isChild && (
        <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-brand-goldLight border border-brand-gold/40 text-xs">
          <div className="flex items-center gap-2 font-bold text-brand-navy">
            <Sparkles className="w-4 h-4 text-brand-gold" />
            <span>
              {language === 'en'
                ? 'Special Young Travellers Child Ticket Design'
                : 'Minik Gezginler İçin Özel Çocuk Hatıra Bileti'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowChildBack((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-white hover:bg-brand-ivory text-brand-navy border border-brand-border font-bold text-[11px] transition-colors cursor-pointer"
          >
            <RotateCw className="w-3 h-3 text-brand-gold" />
            <span>
              {showChildBack
                ? language === 'en'
                  ? 'Show Front Pass'
                  : 'Ön Yüzü (Biniş Kartı) Göster'
                : language === 'en'
                ? 'Show Back Card'
                : 'Arka Yüzü (Dream Big) Gör'}
            </span>
          </button>
        </div>
      )}

      {/* Exact 1:1 Souvenir Boarding Pass Visual (Child or Adult) */}
      {isChild ? (
        showChildBack ? (
          <div className="relative w-full aspect-[959/254] select-none drop-shadow-2xl">
            <img
              src="/tickets/child-ticket-back.png"
              alt="Çocuk Hatıra Bileti Arka Yüzü — Dream Big Fly High"
              className="w-full h-full object-contain block pointer-events-none"
              draggable={false}
            />
          </div>
        ) : (
          <div
            className="relative w-full aspect-[962/292] select-none drop-shadow-2xl"
            style={{ containerType: 'inline-size' }}
          >
            <img
              src="/tickets/child-ticket-template.png"
              alt="Çocuk Hatıra Biniş Kartı"
              className="w-full h-full object-contain block pointer-events-none"
              draggable={false}
            />

            {/* Passenger value */}
            <div
              className="absolute font-bold uppercase tracking-wide whitespace-nowrap"
              style={{
                ...fieldTypography,
                left: '48.8%',
                top: '27.8%',
                maxWidth: '30%',
                fontSize: `${childTopFieldFontSizeCqw(fields.passengerName)}cqw`
              }}
              title={fields.passengerName}
            >
              {fields.passengerName}
            </div>

            {/* From value */}
            <div
              className="absolute font-bold uppercase tracking-wide whitespace-nowrap"
              style={{
                ...fieldTypography,
                left: '48.8%',
                top: '41.5%',
                maxWidth: '30%',
                fontSize: `${childTopFieldFontSizeCqw(fields.fromText)}cqw`
              }}
            >
              {fields.fromText}
            </div>

            {/* To value */}
            <div
              className="absolute font-bold uppercase tracking-wide whitespace-nowrap"
              style={{
                ...fieldTypography,
                left: '48.8%',
                top: '54.6%',
                maxWidth: '30%',
                fontSize: `${childTopFieldFontSizeCqw(fields.toText)}cqw`
              }}
            >
              {fields.toText}
            </div>

            {/* Flight Date value */}
            <div
              className="absolute font-bold uppercase tracking-wide whitespace-nowrap"
              style={{
                ...fieldTypography,
                left: '40.2%',
                top: '75.2%',
                maxWidth: '10.5%',
                fontSize: '1.38cqw'
              }}
            >
              {fields.formattedDate}
            </div>

            {/* Time value */}
            <div
              className="absolute font-bold uppercase tracking-wide whitespace-nowrap"
              style={{
                ...fieldTypography,
                left: '52.4%',
                top: '75.2%',
                maxWidth: '8.5%',
                fontSize: '1.44cqw'
              }}
            >
              {fields.depTime}
            </div>

            {/* Gate value */}
            <div
              className="absolute font-bold uppercase tracking-wide whitespace-nowrap"
              style={{
                ...fieldTypography,
                left: '63.8%',
                top: '75.2%',
                maxWidth: '8.5%',
                fontSize: '1.44cqw'
              }}
            >
              {fields.gateCode}
            </div>

            {/* Seat value */}
            <div
              className="absolute font-bold uppercase tracking-wide whitespace-nowrap"
              style={{
                ...fieldTypography,
                left: '74.2%',
                top: '75.2%',
                maxWidth: '7%',
                fontSize: '1.48cqw'
              }}
            >
              {fields.seatLabel}
            </div>
          </div>
        )
      ) : (
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
            className="absolute font-bold uppercase tracking-wide whitespace-nowrap overflow-hidden text-ellipsis"
            style={{
              ...fieldTypography,
              left: '40.3%',
              top: '28.2%',
              maxWidth: '37.5%',
              fontSize: fields.fromText.length > 22 ? '1.95cqw' : '2.32cqw'
            }}
          >
            {fields.fromText}
          </div>

          {/* TO value */}
          <div
            className="absolute font-bold uppercase tracking-wide whitespace-nowrap overflow-hidden text-ellipsis"
            style={{
              ...fieldTypography,
              left: '40.3%',
              top: '42.9%',
              maxWidth: '37.5%',
              fontSize: fields.toText.length > 22 ? '1.95cqw' : '2.32cqw'
            }}
          >
            {fields.toText}
          </div>

          {/* FLIGHT value */}
          <div
            className="absolute font-bold uppercase tracking-wide whitespace-nowrap"
            style={{
              ...fieldTypography,
              left: '41.1%',
              top: '60.8%',
              maxWidth: '8.8%',
              fontSize: '1.62cqw'
            }}
          >
            {fields.flightNo}
          </div>

          {/* DATE value */}
          <div
            className="absolute font-bold uppercase tracking-wide whitespace-nowrap"
            style={{
              ...fieldTypography,
              left: '53.6%',
              top: '60.8%',
              maxWidth: '10.6%',
              fontSize: '1.62cqw'
            }}
          >
            {fields.formattedDate}
          </div>

          {/* GATE value */}
          <div
            className="absolute font-bold uppercase tracking-wide whitespace-nowrap"
            style={{
              ...fieldTypography,
              left: '68.5%',
              top: '60.8%',
              maxWidth: '11%',
              fontSize: '1.62cqw'
            }}
          >
            {fields.gateCode}
          </div>

          {/* PASSENGER value */}
          <div
            className="absolute font-bold uppercase tracking-wide whitespace-nowrap"
            style={{
              ...fieldTypography,
              left: '36.3%',
              top: '74.1%',
              maxWidth: '13.4%',
              fontSize: `${passengerFontSizeCqw}cqw`
            }}
            title={fields.passengerName}
          >
            {fields.passengerName}
          </div>

          {/* TIME value */}
          <div
            className="absolute font-bold uppercase tracking-wide whitespace-nowrap"
            style={{
              ...fieldTypography,
              left: '53.6%',
              top: '69.3%',
              maxWidth: '12%',
              fontSize: '1.62cqw'
            }}
          >
            {fields.depTime}
          </div>

          {/* SEAT value */}
          <div
            className="absolute font-bold uppercase tracking-wide whitespace-nowrap"
            style={{
              ...fieldTypography,
              left: '41.1%',
              top: '77.4%',
              maxWidth: '8.8%',
              fontSize: '1.68cqw'
            }}
          >
            {fields.seatLabel}
          </div>
        </div>
      )}

      {/* External Action Bar */}
      {showDownloadBtn && (
        <div className="flex flex-wrap items-center justify-between gap-2.5 bg-white/95 backdrop-blur-xs px-4 py-3 rounded-2xl border border-brand-border shadow-xs">
          <div className="flex items-center gap-3 text-xs">
            <span className="font-mono font-black text-brand-navy bg-brand-ivory px-2.5 py-1 rounded-lg border border-brand-border">
              PNR: {booking.pnr}
            </span>
            <span className="text-brand-muted font-mono hidden sm:inline">
              {ticket.ticketNumber}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {qrCodeUrl && (
              <button
                type="button"
                onClick={() => setShowQrBox((prev) => !prev)}
                className="px-3 py-2 rounded-xl bg-brand-ivory/80 hover:bg-brand-ivory text-brand-navy border border-brand-border/80 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5 text-brand-gold" />
                <span>{language === 'en' ? 'Verification QR' : 'Doğrulama QR'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="px-3 py-2 rounded-xl bg-brand-ivory/80 hover:bg-brand-ivory text-brand-navy border border-brand-border/80 font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
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
                className="px-4 py-2 rounded-xl bg-brand-navy hover:bg-brand-blue text-brand-goldLight border border-brand-gold/50 font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer transition-colors"
              >
                <Download className="w-4 h-4 text-brand-cyan" />
                <span>
                  {isChild
                    ? language === 'en'
                      ? 'Download Child Ticket (PDF)'
                      : 'Çocuk Biletini İndir (PDF)'
                    : language === 'en'
                    ? 'Download Souvenir Ticket (PDF)'
                    : 'Hatıra Biletini İndir (PDF)'}
                </span>
              </button>
            )}
          </div>
        </div>
      )}

      {showQrBox && qrCodeUrl && (
        <div className="bg-white rounded-2xl border border-brand-border p-4 flex items-center gap-4 shadow-xs animate-fade-in">
          <a href={ticketLiveUrl} target="_blank" rel="noopener noreferrer" className="shrink-0">
            <img src={qrCodeUrl} alt="Doğrulama QR Kodu" className="w-24 h-24 rounded-lg border border-brand-border" />
          </a>
          <div className="text-xs text-brand-muted space-y-1">
            <div className="font-bold text-brand-navy">
              {language === 'en' ? 'Live Ticket Verification Link' : 'Canlı Bilet Doğrulama Bağlantısı'}
            </div>
            <p className="text-[11px] text-brand-muted">
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
