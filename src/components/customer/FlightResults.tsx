import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Flight } from '../../types';
import {
  ArrowLeft,
  Plane,
  Clock,
  Briefcase,
  SlidersHorizontal,
  ChevronRight,
  Filter,
  CheckCircle2,
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';

export const FlightResults: React.FC = () => {
  const {
    searchQuery,
    flights,
    language,
    t,
    selectFlightForBooking,
    setActiveView,
    setFlightDetailsModal
  } = useApp();

  // Filters & Sorting state
  const [sortBy, setSortBy] = useState<'cheapest' | 'fastest' | 'earliest'>('cheapest');
  const [directOnly, setDirectOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState<number>(30000);

  if (!searchQuery) {
    return (
      <div className="py-20 text-center">
        <p className="text-brand-muted mb-4">{t('results_no_flights')}</p>
        <button
          onClick={() => setActiveView('home')}
          className="px-6 py-2.5 bg-brand-blue text-white rounded-xl font-bold"
        >
          {t('nav_search_flights')}
        </button>
      </div>
    );
  }

  // Filter flights matching origin and destination
  let matchingFlights = flights.filter((f) => {
    const matchesRoute =
      f.originAirport.iataCode === searchQuery.originIata &&
      f.destinationAirport.iataCode === searchQuery.destinationIata;

    const matchesPrice = (searchQuery.cabinClass === 'business' ? f.priceBusiness : f.priceEconomy) <= maxPrice;
    return matchesRoute && matchesPrice && f.bookingStatus === 'open';
  });

  // If no exact match (e.g., custom airports selected during demo), show available route demo flights
  const isFallback = matchingFlights.length === 0;
  if (isFallback) {
    matchingFlights = flights.filter(f => f.bookingStatus === 'open').slice(0, 4);
  }

  // Sorting
  matchingFlights.sort((a, b) => {
    const priceA = searchQuery.cabinClass === 'business' ? a.priceBusiness : a.priceEconomy;
    const priceB = searchQuery.cabinClass === 'business' ? b.priceBusiness : b.priceEconomy;

    if (sortBy === 'cheapest') return priceA - priceB;
    if (sortBy === 'fastest') return a.durationMinutes - b.durationMinutes;
    if (sortBy === 'earliest') return a.departureTime.localeCompare(b.departureTime);
    return 0;
  });

  const formatTime = (isoString: string) => {
    return isoString.split('T')[1].substring(0, 5);
  };

  const formatDuration = (mins: number) => {
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}s ${m > 0 ? `${m}dk` : ''}`;
  };

  return (
    <div className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-8">
      {/* Top Breadcrumb & Route Summary */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('home')}
            className="p-2 rounded-xl bg-white border border-brand-border text-brand-navy hover:text-brand-blue transition-colors shadow-xs"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-heading text-brand-navy flex items-center gap-2">
              <span>{searchQuery.originIata}</span>
              <span className="text-brand-blue font-light">→</span>
              <span>{searchQuery.destinationIata}</span>
            </h2>
            <p className="text-xs text-brand-muted mt-0.5">
              {searchQuery.departureDate} • {searchQuery.adults + searchQuery.children} {t('search_passengers')} • {searchQuery.cabinClass === 'business' ? t('search_cabin_business') : t('search_cabin_economy')}
            </p>
          </div>
        </div>

        {/* Sorting Pills */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-brand-border/80 shadow-xs">
          <button
            onClick={() => setSortBy('cheapest')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              sortBy === 'cheapest' ? 'bg-brand-navy text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('results_sort_cheapest')}
          </button>
          <button
            onClick={() => setSortBy('fastest')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              sortBy === 'fastest' ? 'bg-brand-navy text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('results_sort_fastest')}
          </button>
          <button
            onClick={() => setSortBy('earliest')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              sortBy === 'earliest' ? 'bg-brand-navy text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('results_sort_earliest')}
          </button>
        </div>
      </div>

      {isFallback && (
        <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            {language === 'tr'
              ? 'Seçtiğiniz tarih için tam eşleşen tarife bulunamadı; alternatif müsait RUMUSKY uçuşları listeleniyor.'
              : 'Exact schedule not found for selected date; displaying available alternative RUMUSKY flights.'}
          </span>
        </div>
      )}

      {/* Main Grid: Filters & Flight Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Filter Sidebar */}
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-white rounded-2xl p-5 border border-brand-border/80 shadow-subtle">
            <h4 className="font-bold text-sm text-brand-navy font-heading flex items-center gap-2 mb-4">
              <SlidersHorizontal className="w-4 h-4 text-brand-blue" />
              <span>{t('results_filter_title')}</span>
            </h4>

            {/* Direct Flights Filter */}
            <div className="space-y-3 pb-4 border-b border-slate-100">
              <label className="flex items-center gap-2 text-xs font-semibold text-brand-navy cursor-pointer">
                <input
                  type="checkbox"
                  checked={directOnly}
                  onChange={(e) => setDirectOnly(e.target.checked)}
                  className="w-4 h-4 text-brand-blue rounded border-slate-300 focus:ring-brand-blue"
                />
                <span>{t('results_direct_only')}</span>
              </label>
            </div>

            {/* Price Slider */}
            <div className="pt-4">
              <div className="flex items-center justify-between text-xs font-bold text-brand-navy mb-2">
                <span>{t('results_filter_price')}</span>
                <span className="text-brand-blue font-extrabold">{maxPrice.toLocaleString('tr-TR')} ₺</span>
              </div>
              <input
                type="range"
                min="2000"
                max="30000"
                step="500"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-brand-blue"
              />
              <div className="flex justify-between text-[10px] text-brand-muted mt-1">
                <span>2.000 ₺</span>
                <span>30.000 ₺</span>
              </div>
            </div>
          </div>
        </div>

        {/* Flight Cards List */}
        <div className="lg:col-span-3 space-y-4">
          <div className="text-xs font-semibold text-brand-muted mb-2">
            {matchingFlights.length} {t('results_found')}
          </div>

          {matchingFlights.map((flight) => {
            const price = searchQuery.cabinClass === 'business' ? flight.priceBusiness : flight.priceEconomy;
            const availableSeats = searchQuery.cabinClass === 'business' ? flight.availableBusinessSeats : flight.availableEconomySeats;

            return (
              <div
                key={flight.id}
                className="bg-white rounded-2xl border border-brand-border/80 shadow-subtle hover:shadow-elevated hover:border-brand-blue/40 transition-all duration-200 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
              >
                {/* Flight Route and Timings */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-brand-blue text-xs font-extrabold">
                      {flight.flightNumber}
                    </span>
                    <span className="text-xs text-brand-muted font-medium">
                      {flight.aircraftModel}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold">
                      <CheckCircle2 className="w-3 h-3" />
                      {t('results_direct')}
                    </span>
                  </div>

                  <div className="flex items-center justify-between max-w-md">
                    {/* Departure */}
                    <div className="text-left">
                      <div className="text-2xl font-black font-heading text-brand-navy">
                        {formatTime(flight.departureTime)}
                      </div>
                      <div className="text-xs font-extrabold text-brand-navy mt-0.5">
                        {flight.originAirport.iataCode}
                      </div>
                      <div className="text-[11px] text-brand-muted">
                        {flight.originAirport.city}
                      </div>
                    </div>

                    {/* Flight Duration Visual Bar */}
                    <div className="flex-1 px-6 text-center">
                      <div className="text-[11px] text-brand-muted font-medium mb-1 flex items-center justify-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDuration(flight.durationMinutes)}</span>
                      </div>
                      <div className="relative flex items-center">
                        <div className="h-[2px] w-full bg-slate-200"></div>
                        <Plane className="w-4 h-4 text-brand-blue absolute left-1/2 -translate-x-1/2 transform rotate-90" />
                      </div>
                      <div className="text-[10px] text-brand-cyan font-semibold mt-1">
                        {flight.originAirport.iataCode} - {flight.destinationAirport.iataCode}
                      </div>
                    </div>

                    {/* Arrival */}
                    <div className="text-right">
                      <div className="text-2xl font-black font-heading text-brand-navy">
                        {formatTime(flight.arrivalTime)}
                      </div>
                      <div className="text-xs font-extrabold text-brand-navy mt-0.5">
                        {flight.destinationAirport.iataCode}
                      </div>
                      <div className="text-[11px] text-brand-muted">
                        {flight.destinationAirport.city}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 text-xs text-brand-muted">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      {flight.baggageAllowanceKg} kg {t('results_baggage')}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-600 font-semibold">
                      {availableSeats} boş koltuk
                    </span>
                    <span>•</span>
                    <button
                      onClick={() => setFlightDetailsModal(flight)}
                      className="text-brand-blue font-bold hover:underline flex items-center gap-1"
                    >
                      <Info className="w-3.5 h-3.5" />
                      <span>{t('results_view_details')}</span>
                    </button>
                  </div>
                </div>

                {/* Price & Selection Button */}
                <div className="md:border-l md:border-slate-100 md:pl-6 flex flex-col justify-between items-start md:items-end min-w-[170px]">
                  <div>
                    <span className="text-[10px] text-brand-muted uppercase tracking-wider block md:text-right">
                      Kişi Başı
                    </span>
                    <div className="text-2xl sm:text-3xl font-black font-heading text-brand-navy md:text-right">
                      {price.toLocaleString('tr-TR')} ₺
                    </div>
                  </div>

                  <button
                    onClick={() => selectFlightForBooking(flight)}
                    className="mt-4 w-full md:w-auto px-6 py-3 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-heading font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
                  >
                    <span>{t('results_select_flight')}</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
