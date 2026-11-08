import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { generateSeatsForFlight } from '../../utils/seatGenerator';
import { FlightSeat } from '../../types';
import {
  ArrowLeft,
  Clock,
  ChevronRight,
  Check,
  Sparkles,
  Lock,
  Coffee,
  Plane,
  AlertTriangle,
  Compass
} from 'lucide-react';

export const SeatMap: React.FC = () => {
  const {
    selectedFlight,
    passengers,
    selectedSeats,
    assignSeat,
    setActiveView,
    t,
    language,
    tickets,
    bookings
  } = useApp();

  const [activePassengerIndex, setActivePassengerIndex] = useState(0);
  const [seats, setSeats] = useState<FlightSeat[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 minutes countdown

  // Retrieve ONLY genuine booked seats from tickets and bookings (no random occupancies)
  useEffect(() => {
    if (selectedFlight) {
      const flightTickets = tickets.filter(
        (t) => t.flight && t.flight.id === selectedFlight.id && t.status !== 'cancelled'
      );
      const ticketSeats = flightTickets
        .map((t) => t.seatNumber)
        .filter((s): s is string => Boolean(s));

      const flightBookings = bookings.filter(
        (b) => b.flightId === selectedFlight.id && b.status !== 'cancelled'
      );
      const bookingSeats = flightBookings.flatMap((b) =>
        b.passengers
          .map((p) => p.selectedSeat)
          .filter((s): s is string => Boolean(s) && s !== 'Girişte Belirlenecek' && s !== 'TBA')
      );

      const realBookedSeats = Array.from(new Set([...ticketSeats, ...bookingSeats]));
      setSeats(generateSeatsForFlight(selectedFlight.id, 26, realBookedSeats));
    }
  }, [selectedFlight, tickets, bookings]);

  // Countdown timer for 10 min seat reservation hold
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!selectedFlight) {
    setActiveView('home');
    return null;
  }

  const activePassenger = passengers[activePassengerIndex] || passengers[0];

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSeatClick = (seat: FlightSeat) => {
    if (seat.status === 'booked' || seat.status === 'blocked') return;

    // Assign seat to current active passenger
    assignSeat(activePassenger.id, seat.seatNumber);

    // If there are more passengers without a seat, auto switch to next passenger
    const nextUnassignedIndex = passengers.findIndex(
      (p, i) => i !== activePassengerIndex && !selectedSeats[p.id]
    );
    if (nextUnassignedIndex !== -1) {
      setActivePassengerIndex(nextUnassignedIndex);
    }
  };

  // Group seats by row
  const rowsMap: Record<number, FlightSeat[]> = {};
  seats.forEach((s) => {
    if (!rowsMap[s.rowNumber]) rowsMap[s.rowNumber] = [];
    rowsMap[s.rowNumber].push(s);
  });

  return (
    <div className="max-w-[1100px] w-full mx-auto px-3 sm:px-6 py-6 font-sans">
      
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('passengers')}
            className="p-2.5 rounded-xl bg-white border border-brand-border text-brand-navy hover:text-brand-blue transition-colors shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold font-heading text-brand-navy">
                {language === 'tr' ? 'Uçak İçi Koltuk Seçimi' : 'Interactive Seat Selection'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
                Üstten Bakış Simülasyonu
              </span>
            </div>
            <p className="text-xs text-brand-muted mt-0.5 flex items-center gap-2">
              <Plane className="w-3.5 h-3.5 text-brand-blue" />
              <span>{selectedFlight.aircraftModel}</span>
              <span>•</span>
              <span className="font-bold text-brand-navy">{selectedFlight.flightNumber}</span>
              <span>•</span>
              <span>{selectedFlight.originAirport.iataCode} ➔ {selectedFlight.destinationAirport.iataCode}</span>
            </p>
          </div>
        </div>

        {/* 10-Minute Hold Expiry Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold shadow-2xs">
          <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
          <span>{t('seat_hold_notice')}</span>
          <span className="font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
            {formatTimer(secondsRemaining)}
          </span>
        </div>
      </div>

      {/* Passenger Selection Selector */}
      <div className="bg-white rounded-2xl p-4 border border-brand-border shadow-subtle mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-bold text-brand-navy uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-brand-blue" />
            <span>{language === 'tr' ? 'Koltuk Seçilen Yolcu:' : 'Active Passenger for Seat Selection:'}</span>
          </div>
          <span className="text-[11px] text-slate-500">
            {Object.keys(selectedSeats).length} / {passengers.length} Koltuk Seçildi
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {passengers.map((p, idx) => {
            const isCurrent = idx === activePassengerIndex;
            const assignedSeat = selectedSeats[p.id];

            return (
              <button
                key={p.id}
                onClick={() => setActivePassengerIndex(idx)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2.5 border cursor-pointer ${
                  isCurrent
                    ? 'bg-brand-blue text-white border-brand-blue shadow-md scale-[1.02]'
                    : 'bg-slate-50 text-brand-navy border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold ${isCurrent ? 'bg-white text-brand-blue' : 'bg-slate-200 text-slate-700'}`}>
                  {idx + 1}
                </div>
                <span>{p.firstName ? `${p.firstName} ${p.lastName}` : `Yolcu ${idx + 1}`}</span>
                {assignedSeat ? (
                  <span className={`px-2 py-0.5 rounded-md text-[11px] font-black ${isCurrent ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'}`}>
                    {assignedSeat}
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                    Koltuk Seçiniz
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Seat Map Legend Bar */}
      <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6 bg-white p-3 rounded-2xl border border-brand-border/60 shadow-xs mb-8 text-xs font-medium text-brand-navy">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-white border-2 border-slate-300"></div>
          <span className="text-slate-600">{t('seat_legend_available')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-brand-blue border-2 border-brand-blue text-white flex items-center justify-center">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
          <span className="font-bold text-brand-blue">{t('seat_legend_selected')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-slate-200 border border-slate-300 flex items-center justify-center text-slate-400">
            <Lock className="w-2.5 h-2.5" />
          </div>
          <span className="text-slate-400">Dolu / Satın Alınmış</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-purple-100 border-2 border-purple-400"></div>
          <span className="text-purple-950 font-semibold">{t('seat_legend_business')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-amber-50 border-2 border-amber-400"></div>
          <span className="text-amber-950 font-semibold">{t('seat_legend_extra_legroom')}</span>
        </div>
      </div>

      {/* REALISTIC AIRPLANE TOP-DOWN FUSELAGE CONTAINER */}
      <div className="relative py-4 flex justify-center overflow-x-auto">
        
        {/* Full Aircraft Structure with Swept Wings on Desktop */}
        <div className="relative flex flex-col items-center">

          {/* LEFT WING (PORT WING) - Appears on sides of rows 9 to 18 */}
          <div className="hidden lg:block absolute left-[-220px] top-[380px] w-[230px] h-[340px] pointer-events-none select-none z-0">
            <svg viewBox="0 0 240 360" className="w-full h-full drop-shadow-md">
              {/* Main Swept Wing Surface */}
              <polygon
                points="240,60 20,290 10,340 50,330 240,240"
                fill="#F1F5F9"
                stroke="#CBD5E1"
                strokeWidth="2.5"
              />
              {/* Wing Flaps & Slats Panel Lines */}
              <line x1="235" y1="90" x2="45" y2="285" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="230" y1="130" x2="65" y2="295" stroke="#94A3B8" strokeWidth="1" />
              <line x1="220" y1="190" x2="110" y2="290" stroke="#CBD5E1" strokeWidth="1" />
              
              {/* Jet Engine Pylon & Turbofan Nacelle */}
              <rect x="120" y="110" width="36" height="85" rx="14" fill="#0B2545" stroke="#38BDF8" strokeWidth="2" />
              <ellipse cx="138" cy="112" rx="14" ry="7" fill="#38BDF8" />
              <circle cx="138" cy="112" r="4" fill="#FFFFFF" />
              
              {/* Wing Emergency Escape Path Lines */}
              <path d="M 235 150 L 170 210" stroke="#E11D48" strokeWidth="2" strokeDasharray="4 2" />
              <text x="145" y="240" fill="#E11D48" fontSize="8" fontWeight="bold" transform="rotate(-35 145 240)">
                ◄ KAÇIŞ HATTI
              </text>

              {/* Port Navigation Light (RED) & Strobe at Wingtip */}
              <circle cx="12" cy="335" r="5" fill="#EF4444" className="animate-pulse" />
              <circle cx="12" cy="335" r="9" fill="#EF4444" opacity="0.3" className="animate-ping" />
              {/* Winglet */}
              <polygon points="10,340 0,320 18,335" fill="#0D6EFD" />
            </svg>
          </div>

          {/* RIGHT WING (STARBOARD WING) - Appears on sides of rows 9 to 18 */}
          <div className="hidden lg:block absolute right-[-220px] top-[380px] w-[230px] h-[340px] pointer-events-none select-none z-0">
            <svg viewBox="0 0 240 360" className="w-full h-full drop-shadow-md">
              {/* Main Swept Wing Surface */}
              <polygon
                points="0,60 220,290 230,340 190,330 0,240"
                fill="#F1F5F9"
                stroke="#CBD5E1"
                strokeWidth="2.5"
              />
              {/* Wing Flaps & Slats Panel Lines */}
              <line x1="5" y1="90" x2="195" y2="285" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="10" y1="130" x2="175" y2="295" stroke="#94A3B8" strokeWidth="1" />
              <line x1="20" y1="190" x2="130" y2="290" stroke="#CBD5E1" strokeWidth="1" />

              {/* Jet Engine Pylon & Turbofan Nacelle */}
              <rect x="84" y="110" width="36" height="85" rx="14" fill="#0B2545" stroke="#38BDF8" strokeWidth="2" />
              <ellipse cx="102" cy="112" rx="14" ry="7" fill="#38BDF8" />
              <circle cx="102" cy="112" r="4" fill="#FFFFFF" />

              {/* Wing Emergency Escape Path Lines */}
              <path d="M 5 150 L 70 210" stroke="#E11D48" strokeWidth="2" strokeDasharray="4 2" />
              <text x="45" y="235" fill="#E11D48" fontSize="8" fontWeight="bold" transform="rotate(35 45 235)">
                ESCAPE PATH ►
              </text>

              {/* Starboard Navigation Light (GREEN) & Strobe at Wingtip */}
              <circle cx="228" cy="335" r="5" fill="#10B981" className="animate-pulse" />
              <circle cx="228" cy="335" r="9" fill="#10B981" opacity="0.3" className="animate-ping" />
              {/* Winglet */}
              <polygon points="230,340 240,320 222,335" fill="#0D6EFD" />
            </svg>
          </div>

          {/* MAIN FUSELAGE HULL (UÇAK GÖVDESİ) */}
          <div className="relative z-10 w-[360px] sm:w-[420px] bg-white rounded-[70px_70px_60px_60px] border-[3px] border-slate-300 shadow-2xl p-4 sm:p-6 overflow-hidden">
            
            {/* EXTERIOR PASSENGER WINDOWS (Sol ve Sağ Dış Gövde Pencereleri) */}
            <div className="absolute left-1.5 top-36 bottom-32 flex flex-col justify-between py-2 pointer-events-none">
              {Object.keys(rowsMap).map((r) => (
                <div
                  key={`win-l-${r}`}
                  className="w-1.5 h-3.5 rounded-full bg-sky-200 border border-slate-400/80 shadow-inner my-0.5"
                  title="Kabin Penceresi"
                />
              ))}
            </div>

            <div className="absolute right-1.5 top-36 bottom-32 flex flex-col justify-between py-2 pointer-events-none">
              {Object.keys(rowsMap).map((r) => (
                <div
                  key={`win-r-${r}`}
                  className="w-1.5 h-3.5 rounded-full bg-sky-200 border border-slate-400/80 shadow-inner my-0.5"
                  title="Kabin Penceresi"
                />
              ))}
            </div>

            {/* 1. NOSE CONE & COCKPIT WINDSHIELD */}
            <div className="relative -mt-2 mb-4 flex flex-col items-center">
              
              {/* Aircraft Nose Radome Contour */}
              <div className="w-28 h-8 rounded-t-full bg-slate-100 border-t-2 border-x-2 border-slate-300 flex items-center justify-center">
                <span className="text-[9px] font-black tracking-widest text-slate-500 uppercase flex items-center gap-1">
                  <Compass className="w-3 h-3 text-brand-blue" />
                  KOKPİT
                </span>
              </div>

              {/* Tinted Cockpit Windshield (Kokpit Camları) */}
              <div className="w-36 h-11 bg-slate-900 rounded-t-2xl border-2 border-slate-700 flex items-center justify-center px-3 gap-1 shadow-inner relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-sky-400/20 via-transparent to-transparent pointer-events-none" />
                <div className="w-8 h-6 bg-slate-800 rounded-t-md border border-slate-600 flex items-center justify-center text-[7px] text-cyan-400 font-mono">
                  CPT
                </div>
                <div className="w-10 h-7 bg-slate-800 rounded-t-md border border-slate-600 flex items-center justify-center text-[8px] text-brand-cyan font-bold">
                  HUD
                </div>
                <div className="w-8 h-6 bg-slate-800 rounded-t-md border border-slate-600 flex items-center justify-center text-[7px] text-cyan-400 font-mono">
                  FO
                </div>
              </div>

              {/* Forward Galley & Forward Exit Doors (Door 1L / 1R) */}
              <div className="w-full flex items-center justify-between px-3 py-2 bg-slate-50 border-y border-slate-200 text-[10px] font-bold text-slate-500 mt-2 rounded-lg">
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 text-[9px] font-black">
                  KAPI 1L
                </span>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Coffee className="w-3.5 h-3.5 text-amber-700" />
                  <span>Ön Servis & Mutfak (Galley 1)</span>
                </div>
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300 text-[9px] font-black">
                  KAPI 1R
                </span>
              </div>
            </div>

            {/* COLUMN LABELS BAR (A, B, C | KORİDOR | D, E, F) */}
            <div className="flex items-center justify-between text-xs font-black text-slate-500 py-2 border-b-2 border-slate-200 px-3 bg-slate-100/60 rounded-xl mb-3">
              <div className="flex gap-2 sm:gap-2.5">
                <span className="w-8 text-center text-brand-navy">A</span>
                <span className="w-8 text-center text-brand-navy">B</span>
                <span className="w-8 text-center text-brand-navy">C</span>
              </div>

              <div className="flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">KORİDOR</span>
                <div className="w-8 h-0.5 bg-brand-cyan/60 rounded-full" />
              </div>

              <div className="flex gap-2 sm:gap-2.5">
                <span className="w-8 text-center text-brand-navy">D</span>
                <span className="w-8 text-center text-brand-navy">E</span>
                <span className="w-8 text-center text-brand-navy">F</span>
              </div>
            </div>

            {/* CABIN SEAT ROWS WITH AISLE LIGHTING */}
            <div className="space-y-2 relative">
              
              {/* Floor Proximity Aisle Lighting Strip */}
              <div className="absolute left-1/2 top-0 bottom-0 w-0.5 -translate-x-1/2 bg-gradient-to-b from-brand-cyan/40 via-amber-300/40 to-brand-cyan/40 pointer-events-none z-0" />

              {Object.entries(rowsMap).map(([rowStr, rowSeats]) => {
                const rowNum = Number(rowStr);
                const isBusinessRow = rowNum <= 4;
                const isExitRow = rowNum === 12 || rowNum === 13;
                const isEndOfBusiness = rowNum === 4;

                const leftSeats = rowSeats.filter((s) => ['A', 'B', 'C'].includes(s.seatLetter));
                const rightSeats = rowSeats.filter((s) => ['D', 'E', 'F'].includes(s.seatLetter));

                return (
                  <React.Fragment key={rowNum}>
                    {/* Emergency Exit Row Header for Row 12 */}
                    {rowNum === 12 && (
                      <div className="my-2.5 py-1 px-3 bg-amber-500 text-white rounded-lg flex items-center justify-between text-[10px] font-black tracking-wider uppercase shadow-xs">
                        <span className="flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          ACİL ÇIKIŞ (EXIT 12)
                        </span>
                        <span>GENİŞ DİZ MESAFESİ</span>
                        <span>ÇIKIŞ KAPISI</span>
                      </div>
                    )}

                    <div className="flex items-center justify-between gap-1 relative z-10">
                      
                      {/* Left 3 Seats (A, B, C) */}
                      <div className="flex gap-1.5 sm:gap-2">
                        {leftSeats.map((seat) => {
                          const isSelectedByAny = Object.values(selectedSeats).includes(seat.seatNumber);
                          const isSelectedByActive = selectedSeats[activePassenger.id] === seat.seatNumber;
                          const isOccupied = seat.status === 'booked';

                          let seatStyle = 'bg-white border-slate-300 text-slate-800 hover:border-brand-blue hover:shadow-xs';
                          if (isOccupied) {
                            seatStyle = 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed opacity-75';
                          } else if (isSelectedByActive) {
                            seatStyle = 'bg-brand-blue border-brand-blue text-white shadow-md font-black scale-105 ring-2 ring-brand-blue/30';
                          } else if (isSelectedByAny) {
                            seatStyle = 'bg-emerald-100 border-emerald-400 text-emerald-800 font-bold';
                          } else if (isBusinessRow) {
                            seatStyle = 'bg-purple-50/90 border-purple-300 text-purple-950 hover:bg-purple-100 font-semibold';
                          } else if (isExitRow) {
                            seatStyle = 'bg-amber-50 border-amber-400 text-amber-950 hover:bg-amber-100 font-semibold';
                          }

                          return (
                            <button
                              key={seat.id}
                              type="button"
                              disabled={isOccupied}
                              onClick={() => handleSeatClick(seat)}
                              className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg border text-xs flex flex-col items-center justify-center font-bold transition-all relative cursor-pointer ${seatStyle}`}
                              title={
                                isOccupied
                                  ? `Koltuk ${seat.seatNumber}: Bu koltuk sistemde satın alınmıştır`
                                  : `Koltuk ${seat.seatNumber} (${seat.cabinClass.toUpperCase()}) ${seat.priceModifier ? `+${seat.priceModifier}₺` : ''}`
                              }
                            >
                              {/* Headrest cushion outline */}
                              <div className="w-5 h-1 rounded-t-xs bg-black/10 -mt-0.5 mb-0.5" />
                              <span className="leading-none text-[11px]">{seat.seatLetter}</span>
                              {isOccupied && (
                                <Lock className="w-2.5 h-2.5 absolute top-0.5 right-0.5 text-slate-400" />
                              )}
                              {isSelectedByActive && (
                                <Check className="w-3 h-3 absolute -top-1 -right-1 bg-white text-brand-blue rounded-full p-0.5 shadow-xs stroke-[3]" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Row Number in Aisle */}
                      <div className="w-8 text-center text-[11px] font-black text-slate-400 bg-slate-100 py-1 rounded-md border border-slate-200">
                        {rowNum}
                      </div>

                      {/* Right 3 Seats (D, E, F) */}
                      <div className="flex gap-1.5 sm:gap-2">
                        {rightSeats.map((seat) => {
                          const isSelectedByAny = Object.values(selectedSeats).includes(seat.seatNumber);
                          const isSelectedByActive = selectedSeats[activePassenger.id] === seat.seatNumber;
                          const isOccupied = seat.status === 'booked';

                          let seatStyle = 'bg-white border-slate-300 text-slate-800 hover:border-brand-blue hover:shadow-xs';
                          if (isOccupied) {
                            seatStyle = 'bg-slate-200 border-slate-300 text-slate-400 cursor-not-allowed opacity-75';
                          } else if (isSelectedByActive) {
                            seatStyle = 'bg-brand-blue border-brand-blue text-white shadow-md font-black scale-105 ring-2 ring-brand-blue/30';
                          } else if (isSelectedByAny) {
                            seatStyle = 'bg-emerald-100 border-emerald-400 text-emerald-800 font-bold';
                          } else if (isBusinessRow) {
                            seatStyle = 'bg-purple-50/90 border-purple-300 text-purple-950 hover:bg-purple-100 font-semibold';
                          } else if (isExitRow) {
                            seatStyle = 'bg-amber-50 border-amber-400 text-amber-950 hover:bg-amber-100 font-semibold';
                          }

                          return (
                            <button
                              key={seat.id}
                              type="button"
                              disabled={isOccupied}
                              onClick={() => handleSeatClick(seat)}
                              className={`w-8 h-8 sm:w-8.5 sm:h-8.5 rounded-lg border text-xs flex flex-col items-center justify-center font-bold transition-all relative cursor-pointer ${seatStyle}`}
                              title={
                                isOccupied
                                  ? `Koltuk ${seat.seatNumber}: Bu koltuk sistemde satın alınmıştır`
                                  : `Koltuk ${seat.seatNumber} (${seat.cabinClass.toUpperCase()}) ${seat.priceModifier ? `+${seat.priceModifier}₺` : ''}`
                              }
                            >
                              <div className="w-5 h-1 rounded-t-xs bg-black/10 -mt-0.5 mb-0.5" />
                              <span className="leading-none text-[11px]">{seat.seatLetter}</span>
                              {isOccupied && (
                                <Lock className="w-2.5 h-2.5 absolute top-0.5 right-0.5 text-slate-400" />
                              )}
                              {isSelectedByActive && (
                                <Check className="w-3 h-3 absolute -top-1 -right-1 bg-white text-brand-blue rounded-full p-0.5 shadow-xs stroke-[3]" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Cabin Class Partition Line between Row 4 (Business) and Row 5 (Economy) */}
                    {isEndOfBusiness && (
                      <div className="my-3 py-1 px-3 bg-purple-50 rounded-lg border border-purple-200 flex items-center justify-between text-[10px] font-bold text-purple-900">
                        <span>✦ Business Class Bitişi</span>
                        <span className="text-[9px] uppercase tracking-wider text-purple-600">Ekonomi Kabini Başlangıcı</span>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>

            {/* AFT GALLEY, TOILETS (WC) & TAIL CONE (Arka Mutfak, Tuvaletler ve Kuyruk) */}
            <div className="mt-6 pt-4 border-t-2 border-slate-200 space-y-3">
              <div className="grid grid-cols-2 gap-2 text-center text-[10px] font-bold text-slate-600">
                <div className="p-2 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span>Tuvalet (WC Sol)</span>
                </div>
                <div className="p-2 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  <span>Tuvalet (WC Sağ)</span>
                </div>
              </div>

              <div className="w-full flex items-center justify-between px-3 py-1.5 bg-slate-100 rounded-lg text-[10px] font-bold text-slate-500">
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px]">KAPI 2L</span>
                <span>Arka Servis & Mutfak (Galley 2)</span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[9px]">KAPI 2R</span>
              </div>

              {/* Tapered Tail Cone & APU Exhaust */}
              <div className="flex flex-col items-center pt-2">
                <div className="w-20 h-6 bg-slate-200 rounded-b-xl border border-slate-300 flex items-center justify-center text-[9px] font-extrabold text-slate-500">
                  KUYRUK APU
                </div>
              </div>
            </div>

          </div>

          {/* HORIZONTAL STABILIZERS (ARKA YATAY DENGE KANATLARI) */}
          <div className="hidden sm:flex items-center justify-between w-[520px] -mt-10 px-4 pointer-events-none z-0">
            {/* Left Horizontal Tail */}
            <div className="w-24 h-12 bg-slate-100 border-2 border-slate-300 rounded-bl-3xl transform -rotate-12 shadow-xs" />
            {/* Right Horizontal Tail */}
            <div className="w-24 h-12 bg-slate-100 border-2 border-slate-300 rounded-br-3xl transform rotate-12 shadow-xs" />
          </div>

        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 p-4 bg-white rounded-2xl border border-brand-border shadow-subtle">
        <div>
          <span className="text-xs text-brand-muted block font-semibold">
            {language === 'tr' ? 'Seçilen Koltuklar:' : 'Selected Seats:'}
          </span>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-extrabold text-base sm:text-lg text-brand-navy">
              {Object.values(selectedSeats).length > 0
                ? Object.values(selectedSeats).join(', ')
                : (language === 'tr' ? 'Henüz Seçilmedi' : 'None Selected')}
            </span>
            {Object.values(selectedSeats).length === passengers.length && (
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Tüm Yolcular Tamamlandı ✓
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => setActiveView('checkout')}
          className="px-8 py-3.5 bg-brand-blue hover:bg-blue-600 text-white font-heading font-bold rounded-xl shadow-elevated flex items-center gap-2 group transition-all cursor-pointer"
        >
          <span>{t('seat_confirm_btn')}</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

    </div>
  );
};
