import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Booking, Flight, Ticket, TicketDesignConfig } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  Plane,
  Sparkles,
  Download,
  Share2,
  CheckCircle,
  Clock,
  Calendar,
  ShieldCheck,
  Award
} from 'lucide-react';

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

export const TicketCard: React.FC<TicketCardProps> = ({
  booking,
  flight,
  ticket,
  passengerIndex = 0,
  onDownloadPdf,
  showDownloadBtn = true,
  isStandaloneView = false,
  customTicketDesign
}) => {
  const { siteContent, language } = useApp();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const td = customTicketDesign || siteContent.ticketDesign || {
    badgeTitle: 'HATIRA BİLETİ',
    badgeTitleEn: 'COMMEMORATIVE SOUVENIR PASS',
    subTitle: 'Gaziantep Üniversitesi • Havacılık & Yazılım Projesi Özel Biniş Kartı',
    subTitleEn: 'Gaziantep University • Aviation & Software Project Commemorative Pass',
    universityName: 'Gaziantep Üniversitesi',
    universityLogoUrl: '/logos/gaziantep-universitesi-logo.png',
    airlineLogoUrl: '/logos/rumusky-brand-logo.png',
    commemorativeNote: 'Bu bilet Gaziantep Üniversitesi projesi kapsamında üretilmiş resmi hatıra belgesidir. Gökyüzündeki güvenli ve ayrıcalıklı yolculuğunuz, bizim gökyüzümüz.',
    commemorativeNoteEn: 'This ticket is an official commemorative souvenir produced for the Gaziantep University project. Your journey, our sky.',
    themeStyle: 'navy_gold' as const
  };

  const badgeTitle = language === 'en' ? td.badgeTitleEn : td.badgeTitle;
  const subTitle = language === 'en' ? td.subTitleEn : td.subTitle;
  const commemorativeNote = language === 'en' ? td.commemorativeNoteEn : td.commemorativeNote;

  // The actual live URL encoded inside the QR code
  const ticketLiveUrl = `${window.location.origin}/#ticket=${booking.pnr}&tkt=${ticket.ticketNumber}`;

  useEffect(() => {
    QRCode.toDataURL(ticketLiveUrl, {
      width: 220,
      margin: 1,
      color: {
        dark: td.themeStyle === 'navy_gold' ? '#0F172A' : '#0B2545',
        light: '#FFFFFF'
      }
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error('QR code generation error:', err));
  }, [ticketLiveUrl, td.themeStyle]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${siteContent.companyName || 'RUMUSKY'} - Hatıra Biniş Kartı (${booking.pnr})`,
          text: `${ticket.passenger.firstName} ${ticket.passenger.lastName} için ${flight.originAirport.city} ➔ ${flight.destinationAirport.city} hatıra bileti.`,
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

  // Color Theme definitions
  const themeStyles = {
    navy_gold: {
      headerBg: 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950',
      headerBorder: 'border-amber-400/30',
      badgeBg: 'bg-gradient-to-r from-amber-500/20 via-amber-400/30 to-amber-500/20 text-amber-300 border-amber-400/50',
      badgeText: 'text-amber-300',
      seatBadge: 'bg-gradient-to-br from-amber-400 to-amber-500 text-slate-950 shadow-md',
      accentColor: 'text-amber-600',
      cardBorder: 'border-amber-300/60 ring-1 ring-amber-400/20',
      btnPrimary: 'bg-slate-950 hover:bg-slate-800 text-amber-300 border border-amber-400/30'
    },
    modern_blue: {
      headerBg: 'bg-gradient-to-r from-brand-navy via-slate-900 to-brand-navy',
      headerBorder: 'border-sky-400/30',
      badgeBg: 'bg-sky-500/20 text-sky-200 border-sky-400/40',
      badgeText: 'text-brand-cyan',
      seatBadge: 'bg-brand-blue text-white shadow-md',
      accentColor: 'text-brand-blue',
      cardBorder: 'border-blue-200 ring-1 ring-blue-300/20',
      btnPrimary: 'bg-brand-navy hover:bg-slate-800 text-white'
    },
    emerald: {
      headerBg: 'bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950',
      headerBorder: 'border-emerald-400/30',
      badgeBg: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/40',
      badgeText: 'text-emerald-400',
      seatBadge: 'bg-emerald-600 text-white shadow-md',
      accentColor: 'text-emerald-600',
      cardBorder: 'border-emerald-200 ring-1 ring-emerald-300/20',
      btnPrimary: 'bg-emerald-950 hover:bg-emerald-900 text-white'
    },
    burgundy: {
      headerBg: 'bg-gradient-to-r from-rose-950 via-slate-900 to-rose-950',
      headerBorder: 'border-rose-400/30',
      badgeBg: 'bg-rose-500/20 text-rose-200 border-rose-400/40',
      badgeText: 'text-rose-400',
      seatBadge: 'bg-rose-700 text-white shadow-md',
      accentColor: 'text-rose-700',
      cardBorder: 'border-rose-200 ring-1 ring-rose-300/20',
      btnPrimary: 'bg-rose-950 hover:bg-rose-900 text-white'
    }
  };

  const currentTheme = themeStyles[td.themeStyle] || themeStyles.navy_gold;

  const depTime = flight.departureTime.split('T')[1].substring(0, 5);
  const arrTime = flight.arrivalTime.split('T')[1].substring(0, 5);
  const depDate = flight.departureTime.split('T')[0];
  const flightDuration = `${Math.floor(flight.durationMinutes / 60)}s ${flight.durationMinutes % 60}dk`;

  return (
    <div className={`relative bg-white rounded-3xl overflow-hidden shadow-2xl border transition-all ${currentTheme.cardBorder}`}>
      {/* 1. TOP HEADER: BRAND LOGO + HATIRA BİLETİ BADGE + UNIVERSITY EMBLEM */}
      <div className={`${currentTheme.headerBg} text-white px-5 sm:px-8 py-4 sm:py-5 border-b ${currentTheme.headerBorder}`}>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Left: Airline Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white/10 backdrop-blur-md p-1.5 flex items-center justify-center border border-white/20 shadow-xs">
              <img
                src={td.airlineLogoUrl || '/logos/rumusky-brand-logo.png'}
                alt={siteContent.companyName || 'RUMUSKY'}
                className="w-full h-full object-contain drop-shadow-sm"
              />
            </div>
            <div>
              <div className="font-heading font-black text-base sm:text-lg tracking-wider text-white">
                {siteContent.companyName || 'RUMUSKY'}
                <span className="text-[10px] sm:text-xs font-normal text-sky-300 ml-1.5 uppercase tracking-widest block sm:inline">
                  {siteContent.companySubtitle || 'AIRLINES'}
                </span>
              </div>
              <div className="text-[11px] text-slate-300 font-mono flex items-center gap-1.5 mt-0.5">
                <Plane className="w-3.5 h-3.5 text-brand-cyan" />
                <span>{flight.flightNumber}</span>
                <span>•</span>
                <span>{flight.aircraftModel}</span>
              </div>
            </div>
          </div>

          {/* Center: Prestigious Commemorative Badge */}
          <div className="text-center sm:px-2">
            <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-xs font-black uppercase tracking-wider shadow-xs ${currentTheme.badgeBg}`}>
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>{badgeTitle}</span>
              <Award className="w-3.5 h-3.5" />
            </div>
            <div className="text-[10px] sm:text-[11px] text-slate-300 font-medium mt-1 max-w-xs leading-tight">
              {subTitle}
            </div>
          </div>

          {/* Right: Gaziantep University Crest & Name */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-black text-white block tracking-tight">
                {td.universityName || 'Gaziantep Üniversitesi'}
              </span>
              <span className="text-[9px] text-slate-300 font-semibold uppercase tracking-wider block">
                Öğrenci Bitirme Projesi
              </span>
            </div>
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white p-1 flex items-center justify-center shadow-md border border-white/80">
              <img
                src={td.universityLogoUrl || '/logos/gaziantep-universitesi-logo.png'}
                alt={td.universityName || 'Gaziantep Üniversitesi'}
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN BOARDING PASS BODY & PERFORATED TICKET STUB */}
      <div className="grid grid-cols-1 lg:grid-cols-12 relative bg-linear-to-b from-white to-slate-50/60">
        
        {/* LEFT SECTION (9 Cols): Route, Passenger & Flight Manifest */}
        <div className="lg:col-span-8 p-6 sm:p-8 space-y-6">
          
          {/* Route & Times Graphic */}
          <div className="bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50/80 p-5 rounded-2xl border border-blue-100 flex items-center justify-between">
            {/* Origin */}
            <div className="text-left">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Kalkış / Departure</span>
              <div className="text-3xl sm:text-4xl font-heading font-black text-brand-navy tracking-tight mt-0.5">
                {flight.originAirport.iataCode}
              </div>
              <div className="text-xs font-bold text-slate-700">{flight.originAirport.city}</div>
              <div className="text-sm font-black text-brand-blue mt-1">{depTime}</div>
              <span className="text-[10px] text-slate-400 block font-mono">{depDate}</span>
            </div>

            {/* Flight Trajectory Arrow */}
            <div className="flex flex-col items-center px-3 flex-1 max-w-[200px]">
              <span className="text-[10px] font-bold text-slate-400 mb-1">{flightDuration}</span>
              <div className="w-full flex items-center">
                <div className="h-[2px] bg-slate-300 flex-1"></div>
                <div className="w-7 h-7 rounded-full bg-blue-100 text-brand-blue flex items-center justify-center mx-1 shadow-2xs">
                  <Plane className="w-4 h-4 rotate-90" />
                </div>
                <div className="h-[2px] bg-slate-300 flex-1"></div>
              </div>
              <span className="text-[9px] font-black uppercase text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full border border-emerald-300 mt-1.5">
                Direkt Sefer
              </span>
            </div>

            {/* Destination */}
            <div className="text-right">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Varış / Arrival</span>
              <div className="text-3xl sm:text-4xl font-heading font-black text-brand-navy tracking-tight mt-0.5">
                {flight.destinationAirport.iataCode}
              </div>
              <div className="text-xs font-bold text-slate-700">{flight.destinationAirport.city}</div>
              <div className="text-sm font-black text-brand-blue mt-1">{arrTime}</div>
              <span className="text-[10px] text-slate-400 block font-mono">{depDate}</span>
            </div>
          </div>

          {/* Passenger Info & Gate Manifest Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Yolcu / Passenger</span>
              <div className="text-sm font-black text-brand-navy truncate mt-0.5">
                {ticket.passenger.firstName} {ticket.passenger.lastName}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Koltuk / Seat</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className={`px-2.5 py-0.5 rounded-md text-xs font-black ${currentTheme.seatBadge}`}>
                  {ticket.seatNumber}
                </span>
                <span className="text-[10px] font-bold uppercase text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-200">
                  {ticket.cabinClass}
                </span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">PNR Kodu</span>
              <div className="text-sm font-mono font-black text-brand-blue mt-0.5">
                {booking.pnr}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Bilet No / Ticket</span>
              <div className="text-xs font-mono font-bold text-slate-700 truncate mt-0.5">
                {ticket.ticketNumber}
              </div>
            </div>
          </div>

          {/* Gate & Boarding Time */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-600 border-t border-slate-200/80">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-brand-blue" />
              <span>
                <strong>Uçağa Biniş Saati:</strong> {(() => {
                  const [h, m] = depTime.split(':').map(Number);
                  const total = h * 60 + m - 40;
                  const bh = Math.floor((total + 1440) % 1440 / 60);
                  const bm = (total + 1440) % 1440 % 60;
                  return `${String(bh).padStart(2, '0')}:${String(bm).padStart(2, '0')}`;
                })()} (Kalkıştan 40 dk önce)
              </span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Elektronik Doğrulanmış Sistem Bileti</span>
            </div>
          </div>
        </div>

        {/* PERFORATION NOTCHES (Left / Right Scallop Cutouts) */}
        <div className="hidden lg:block absolute top-0 bottom-0 left-[66.666%] w-0 border-r-2 border-dashed border-slate-300">
          <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-brand-bg border border-slate-300"></div>
          <div className="absolute -bottom-3 -left-3 w-6 h-6 rounded-full bg-brand-bg border border-slate-300"></div>
        </div>

        {/* RIGHT SECTION (4 Cols): REAL SCANNABLE QR CODE & COMMEMORATIVE STUB */}
        <div className="lg:col-span-4 p-6 sm:p-7 bg-slate-50/90 flex flex-col items-center justify-between text-center border-t lg:border-t-0 border-slate-200">
          <div className="w-full flex flex-col items-center">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-2">
              Biniş & Doğrulama Kuponu
            </div>

            {/* Real QR Code */}
            <div className="p-2 bg-white rounded-2xl shadow-md border border-slate-200 inline-block">
              {qrCodeUrl ? (
                <a
                  href={ticketLiveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Canlı Bilet Bağlantısını Aç"
                >
                  <img
                    src={qrCodeUrl}
                    alt="Canlı Bilet QR Kodu"
                    className="w-36 h-36 sm:w-40 sm:h-40 rounded-lg cursor-pointer hover:scale-102 transition-transform"
                  />
                </a>
              ) : (
                <div className="w-36 h-36 bg-slate-100 animate-pulse rounded-lg flex items-center justify-center text-xs text-slate-400">
                  QR Hazırlanıyor...
                </div>
              )}
            </div>

            <div className="mt-2.5 space-y-1">
              <span className="text-[11px] font-black text-brand-navy block">
                Telefonunuzla QR Kodu Okutun
              </span>
              <p className="text-[10px] text-slate-500 leading-tight max-w-[210px]">
                Kameranızı açıp okuttuğunuzda bu hatıra biletini anında canlı olarak görüntülersiniz.
              </p>
            </div>
          </div>

          {/* Action Buttons: PDF & Share */}
          <div className="w-full mt-4 space-y-2">
            {showDownloadBtn && onDownloadPdf && (
              <button
                type="button"
                onClick={onDownloadPdf}
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-colors ${currentTheme.btnPrimary}`}
              >
                <Download className="w-4 h-4" />
                <span>Hatıra Biletini İndir (PDF)</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 shadow-2xs transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5 text-brand-blue" />
              <span>{copied ? 'Bağlantı Kopyalandı! ✓' : 'Bileti Paylaş / Kopyala'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. COMMEMORATIVE FOOTER NOTE */}
      <div className="bg-slate-100/90 px-6 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[10px] text-slate-500">
        <div className="flex items-center gap-1.5 font-medium">
          <Award className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
          <span>{commemorativeNote}</span>
        </div>
        <div className="font-mono text-slate-400">
          Düzenlenme: {new Date(booking.createdAt).toLocaleDateString('tr-TR')}
        </div>
      </div>
    </div>
  );
};
