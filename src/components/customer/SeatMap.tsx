import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { generateSeatsForFlight } from '../../utils/seatGenerator';
import { FlightSeat } from '../../types';
import { ArrowLeft, Clock, ShieldCheck, ChevronRight, Check, Sparkles } from 'lucide-react';

export const SeatMap: React.FC = () => {
  const {
    selectedFlight,
    passengers,
    selectedSeats,
    assignSeat,
    setActiveView,
    t,
    language
  } = useApp();

  const [activePassengerIndex, setActivePassengerIndex] = useState(0);
  const [seats, setSeats] = useState<FlightSeat[]>([]);
  const [secondsRemaining, setSecondsRemaining] = useState(600); // 10 minutes countdown

  useEffect(() => {
    if (selectedFlight) {
      setSeats(generateSeatsForFlight(selectedFlight.id, 26));
    }
  }, [selectedFlight]);

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
    <div className="max-w-[1000px] w-full mx-auto px-4 sm:px-6 py-8">
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
            <h2 className="text-2xl font-bold font-heading text-brand-navy">
              {t('seat_title')}
            </h2>
            <p className="text-xs text-brand-muted mt-0.5">
              {selectedFlight.aircraftModel} • {selectedFlight.flightNumber}
            </p>
          </div>
        </div>

        {/* 10-Minute Hold Expiry Badge */}
        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-semibold">
          <Clock className="w-4 h-4 text-amber-600 animate-pulse" />
          <span>{t('seat_hold_notice')}</span>
          <span className="font-mono font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
            {formatTimer(secondsRemaining)}
          </span>
        </div>
      </div>

      {/* Passenger Selection Selector */}
      <div className="bg-white rounded-2xl p-4 border border-brand-border shadow-subtle mb-6">
        <div className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2">
          {language === 'tr' ? 'Koltuk Seçilen Yolcu:' : 'Selecting Seat for Passenger:'}
        </div>
        <div className="flex flex-wrap gap-2">
          {passengers.map((p, idx) => {
            const isCurrent = idx === activePassengerIndex;
            const assignedSeat = selectedSeats[p.id];

            return (
              <button
                key={p.id}
                onClick={() => setActivePassengerIndex(idx)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border ${
                  isCurrent
                    ? 'bg-brand-blue text-white border-brand-blue shadow-xs'
                    : 'bg-brand-bg text-brand-navy border-brand-border hover:bg-slate-100'
                }`}
              >
                <span>{idx + 1}. {p.firstName || `Yolcu ${idx + 1}`} {p.lastName}</span>
                {assignedSeat ? (
                  <span className={`px-2 py-0.5 rounded-md text-[10px] ${isCurrent ? 'bg-white/20 text-white' : 'bg-blue-100 text-brand-blue'}`}>
                    {assignedSeat}
                  </span>
                ) : (
                  <span className="text-[10px] text-amber-600">(Seçilmedi)</span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Seat Map Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 bg-white p-3 rounded-xl border border-brand-border/60 shadow-xs mb-8 text-xs font-medium text-brand-navy">
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-white border-2 border-slate-300"></div>
          <span>{t('seat_legend_available')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-brand-blue border-2 border-brand-blue"></div>
          <span>{t('seat_legend_selected')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-slate-200 border border-slate-300"></div>
          <span>{t('seat_legend_occupied')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-purple-100 border-2 border-purple-300"></div>
          <span>{t('seat_legend_business')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 rounded-md bg-amber-50 border-2 border-amber-300"></div>
          <span>{t('seat_legend_extra_legroom')}</span>
        </div>
      </div>

      {/* Fuselage Container */}
      <div className="max-w-md mx-auto bg-white rounded-3xl border-2 border-slate-300 shadow-elevated p-6 relative">
        {/* Cockpit Nose */}
        <div className="w-24 h-12 mx-auto -mt-6 bg-slate-100 rounded-t-full border-t-2 border-x-2 border-slate-300 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          {t('seat_cockpit')}
        </div>

        {/* Column Letters Bar */}
        <div className="flex items-center justify-between text-xs font-black text-slate-400 py-3 border-b border-slate-200 px-2 my-2">
          <div className="flex gap-2">
            <span className="w-8 text-center">A</span>
            <span className="w-8 text-center">B</span>
            <span className="w-8 text-center">C</span>
          </div>
          <span className="text-[10px] uppercase tracking-wider text-slate-300">KORİDOR</span>
          <div className="flex gap-2">
            <span className="w-8 text-center">D</span>
            <span className="w-8 text-center">E</span>
            <span className="w-8 text-center">F</span>
          </div>
        </div>

        {/* Seat Rows */}
        <div className="space-y-2 py-4">
          {Object.entries(rowsMap).map(([rowStr, rowSeats]) => {
            const rowNum = Number(rowStr);
            const isBusinessRow = rowNum <= 4;
            const isExitRow = rowNum === 12 || rowNum === 13;

            const leftSeats = rowSeats.filter((s) => ['A', 'B', 'C'].includes(s.seatLetter));
            const rightSeats = rowSeats.filter((s) => ['D', 'E', 'F'].includes(s.seatLetter));

            return (
              <div key={rowNum} className="flex items-center justify-between gap-1 group">
                {/* Left 3 Seats (A, B, C) */}
                <div className="flex gap-1.5 sm:gap-2">
                  {leftSeats.map((seat) => {
                    const isSelectedByAny = Object.values(selectedSeats).includes(seat.seatNumber);
                    const isSelectedByActive = selectedSeats[activePassenger.id] === seat.seatNumber;
                    const isOccupied = seat.status === 'booked';

                    let seatStyle = 'bg-white border-slate-300 text-slate-700 hover:border-brand-blue';
                    if (isOccupied) {
                      seatStyle = 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed';
                    } else if (isSelectedByActive) {
                      seatStyle = 'bg-brand-blue border-brand-blue text-white shadow-md font-bold scale-105';
                    } else if (isSelectedByAny) {
                      seatStyle = 'bg-sky-100 border-brand-blue text-brand-blue font-bold';
                    } else if (isBusinessRow) {
                      seatStyle = 'bg-purple-50 border-purple-200 text-purple-900 hover:bg-purple-100';
                    } else if (isExitRow) {
                      seatStyle = 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100';
                    }

                    return (
                      <button
                        key={seat.id}
                        type="button"
                        disabled={isOccupied}
                        onClick={() => handleSeatClick(seat)}
                        className={`w-8 h-8 rounded-lg border text-[11px] flex items-center justify-center font-medium transition-all ${seatStyle}`}
                        title={`${seat.seatNumber} (${seat.cabinClass.toUpperCase()}) ${seat.priceModifier ? `+${seat.priceModifier}₺` : ''}`}
                      >
                        {seat.seatLetter}
                      </button>
                    );
                  })}
                </div>

                {/* Row Number in Aisle */}
                <div className="w-8 text-center text-xs font-bold text-slate-400">
                  {rowNum}
                </div>

                {/* Right 3 Seats (D, E, F) */}
                <div className="flex gap-1.5 sm:gap-2">
                  {rightSeats.map((seat) => {
                    const isSelectedByAny = Object.values(selectedSeats).includes(seat.seatNumber);
                    const isSelectedByActive = selectedSeats[activePassenger.id] === seat.seatNumber;
                    const isOccupied = seat.status === 'booked';

                    let seatStyle = 'bg-white border-slate-300 text-slate-700 hover:border-brand-blue';
                    if (isOccupied) {
                      seatStyle = 'bg-slate-100 border-slate-200 text-slate-300 cursor-not-allowed';
                    } else if (isSelectedByActive) {
                      seatStyle = 'bg-brand-blue border-brand-blue text-white shadow-md font-bold scale-105';
                    } else if (isSelectedByAny) {
                      seatStyle = 'bg-sky-100 border-brand-blue text-brand-blue font-bold';
                    } else if (isBusinessRow) {
                      seatStyle = 'bg-purple-50 border-purple-200 text-purple-900 hover:bg-purple-100';
                    } else if (isExitRow) {
                      seatStyle = 'bg-amber-50 border-amber-300 text-amber-900 hover:bg-amber-100';
                    }

                    return (
                      <button
                        key={seat.id}
                        type="button"
                        disabled={isOccupied}
                        onClick={() => handleSeatClick(seat)}
                        className={`w-8 h-8 rounded-lg border text-[11px] flex items-center justify-center font-medium transition-all ${seatStyle}`}
                        title={`${seat.seatNumber} (${seat.cabinClass.toUpperCase()}) ${seat.priceModifier ? `+${seat.priceModifier}₺` : ''}`}
                      >
                        {seat.seatLetter}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="mt-8 flex items-center justify-between p-4 bg-white rounded-2xl border border-brand-border shadow-subtle">
        <div>
          <span className="text-xs text-brand-muted block">{language === 'tr' ? 'Seçilen Koltuklar:' : 'Selected Seats:'}</span>
          <span className="font-extrabold text-base text-brand-navy">
            {Object.values(selectedSeats).length > 0
              ? Object.values(selectedSeats).join(', ')
              : (language === 'tr' ? 'Otomatik atanacak' : 'Auto assigned at gate')}
          </span>
        </div>

        <button
          onClick={() => setActiveView('checkout')}
          className="px-8 py-3.5 bg-brand-blue hover:bg-blue-600 text-white font-heading font-bold rounded-xl shadow-elevated flex items-center gap-2 group transition-all"
        >
          <span>{t('seat_confirm_btn')}</span>
          <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
