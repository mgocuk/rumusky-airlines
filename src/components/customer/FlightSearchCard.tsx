import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { SearchQuery, Airport } from '../../types';
import { getFutureDateString } from '../../data/seedData';
import {
  PlaneTakeoff,
  PlaneLanding,
  ArrowLeftRight,
  Calendar as CalendarIcon,
  Users,
  Search,
  Check,
  ChevronDown
} from 'lucide-react';

export const FlightSearchCard: React.FC = () => {
  const { airports, language, t, setSearchQuery } = useApp();

  const [tripType, setTripType] = useState<'one-way' | 'round-trip'>('one-way');
  const [originIata, setOriginIata] = useState('IST');
  const [destinationIata, setDestinationIata] = useState('LHR');
  const [departureDate, setDepartureDate] = useState(getFutureDateString(1));
  const [returnDate, setReturnDate] = useState(getFutureDateString(5));
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [cabinClass, setCabinClass] = useState<'economy' | 'business'>('economy');

  // Autocomplete dropdowns
  const [originOpen, setOriginOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const [passengerOpen, setPassengerOpen] = useState(false);
  const [originFilter, setOriginFilter] = useState('');
  const [destFilter, setDestFilter] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const originRef = useRef<HTMLDivElement>(null);
  const destRef = useRef<HTMLDivElement>(null);
  const passengerRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (originRef.current && !originRef.current.contains(e.target as Node)) {
        setOriginOpen(false);
      }
      if (destRef.current && !destRef.current.contains(e.target as Node)) {
        setDestOpen(false);
      }
      if (passengerRef.current && !passengerRef.current.contains(e.target as Node)) {
        setPassengerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSwapAirports = () => {
    const temp = originIata;
    setOriginIata(destinationIata);
    setDestinationIata(temp);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (originIata === destinationIata) {
      setValidationError(
        language === 'tr'
          ? 'Kalkış ve varış havalimanı aynı olamaz!'
          : 'Origin and destination airports must be different!'
      );
      return;
    }

    setValidationError(null);

    const query: SearchQuery = {
      tripType,
      originIata,
      destinationIata,
      departureDate,
      returnDate: tripType === 'round-trip' ? returnDate : undefined,
      adults,
      children,
      infants,
      cabinClass
    };

    setSearchQuery(query);
  };

  const originAirport = airports.find((a) => a.iataCode === originIata) || airports[0];
  const destAirport = airports.find((a) => a.iataCode === destinationIata) || airports[2];

  const filteredOrigins = airports.filter(
    (a) =>
      a.city.toLowerCase().includes(originFilter.toLowerCase()) ||
      a.cityEn.toLowerCase().includes(originFilter.toLowerCase()) ||
      a.name.toLowerCase().includes(originFilter.toLowerCase()) ||
      a.iataCode.toLowerCase().includes(originFilter.toLowerCase())
  );

  const filteredDests = airports.filter(
    (a) =>
      a.city.toLowerCase().includes(destFilter.toLowerCase()) ||
      a.cityEn.toLowerCase().includes(destFilter.toLowerCase()) ||
      a.name.toLowerCase().includes(destFilter.toLowerCase()) ||
      a.iataCode.toLowerCase().includes(destFilter.toLowerCase())
  );

  const totalPassengers = adults + children + infants;

  return (
    <div className="bg-white rounded-2xl shadow-elevated border border-brand-border/80 p-5 sm:p-6 transition-all duration-200">
      {/* Top Bar: Trip Types & Cabin */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTripType('one-way')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              tripType === 'one-way'
                ? 'bg-brand-navy text-white shadow-xs'
                : 'text-brand-muted hover:bg-slate-100'
            }`}
          >
            {t('search_one_way')}
          </button>
          <button
            type="button"
            onClick={() => setTripType('round-trip')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
              tripType === 'round-trip'
                ? 'bg-brand-navy text-white shadow-xs'
                : 'text-brand-muted hover:bg-slate-100'
            }`}
          >
            {t('search_round_trip')}
          </button>
          <span className="hidden sm:inline-block px-3 py-1 text-xs font-medium text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed">
            {t('search_multi_city')}
          </span>
        </div>

        {/* Cabin Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setCabinClass('economy')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              cabinClass === 'economy'
                ? 'bg-white text-brand-blue shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('search_cabin_economy')}
          </button>
          <button
            type="button"
            onClick={() => setCabinClass('business')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              cabinClass === 'business'
                ? 'bg-white text-brand-blue shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t('search_cabin_business')}
          </button>
        </div>
      </div>

      {validationError && (
        <div className="mt-3 p-3 text-xs font-medium text-rose-700 bg-rose-50 border border-rose-200 rounded-xl">
          {validationError}
        </div>
      )}

      {/* Main Search Form Inputs */}
      <form onSubmit={handleSearchSubmit} className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-3">
        {/* Origin Airport */}
        <div className="lg:col-span-3 relative" ref={originRef}>
          <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1 block">
            {t('search_from')}
          </label>
          <div
            onClick={() => setOriginOpen(!originOpen)}
            className="flex items-center gap-3 p-3 bg-brand-bg rounded-xl border border-brand-border/80 hover:border-brand-blue/60 cursor-pointer transition-all h-[58px]"
          >
            <PlaneTakeoff className="w-5 h-5 text-brand-blue flex-shrink-0" />
            <div className="flex flex-col text-left overflow-hidden">
              <span className="font-extrabold text-brand-navy text-sm leading-tight truncate">
                {language === 'en' ? originAirport.cityEn : originAirport.city} ({originAirport.iataCode})
              </span>
              <span className="text-[10px] text-brand-muted truncate">
                {originAirport.name}
              </span>
            </div>
          </div>

          {/* Autocomplete Dropdown */}
          {originOpen && (
            <div className="absolute top-[82px] left-0 w-full sm:w-80 bg-white rounded-xl shadow-elevated border border-brand-border z-50 p-2 animate-fade-in max-h-72 overflow-y-auto">
              <input
                type="text"
                placeholder={t('search_airport_placeholder')}
                value={originFilter}
                onChange={(e) => setOriginFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-brand-border rounded-lg mb-2 focus:outline-hidden focus:border-brand-blue"
                autoFocus
              />
              <div className="space-y-1">
                {filteredOrigins.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      setOriginIata(a.iataCode);
                      setOriginOpen(false);
                      setOriginFilter('');
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer hover:bg-blue-50 transition-colors ${
                      a.iataCode === originIata ? 'bg-blue-50/80 font-bold text-brand-blue' : 'text-brand-navy'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{language === 'en' ? a.cityEn : a.city} ({a.iataCode})</div>
                      <div className="text-[10px] text-brand-muted">{a.name}</div>
                    </div>
                    {a.iataCode === originIata && <Check className="w-3.5 h-3.5 text-brand-blue" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Airport Swap Button */}
        <div className="lg:col-span-1 flex items-center justify-center -my-2 lg:my-0 lg:pt-5">
          <button
            type="button"
            onClick={handleSwapAirports}
            title={t('search_swap')}
            className="w-9 h-9 rounded-full bg-white border border-brand-border shadow-xs hover:border-brand-blue text-brand-navy hover:text-brand-blue flex items-center justify-center transition-transform active:scale-95 z-10"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>
        </div>

        {/* Destination Airport */}
        <div className="lg:col-span-3 relative" ref={destRef}>
          <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1 block">
            {t('search_to')}
          </label>
          <div
            onClick={() => setDestOpen(!destOpen)}
            className="flex items-center gap-3 p-3 bg-brand-bg rounded-xl border border-brand-border/80 hover:border-brand-blue/60 cursor-pointer transition-all h-[58px]"
          >
            <PlaneLanding className="w-5 h-5 text-brand-cyan flex-shrink-0" />
            <div className="flex flex-col text-left overflow-hidden">
              <span className="font-extrabold text-brand-navy text-sm leading-tight truncate">
                {language === 'en' ? destAirport.cityEn : destAirport.city} ({destAirport.iataCode})
              </span>
              <span className="text-[10px] text-brand-muted truncate">
                {destAirport.name}
              </span>
            </div>
          </div>

          {/* Autocomplete Dropdown */}
          {destOpen && (
            <div className="absolute top-[82px] left-0 w-full sm:w-80 bg-white rounded-xl shadow-elevated border border-brand-border z-50 p-2 animate-fade-in max-h-72 overflow-y-auto">
              <input
                type="text"
                placeholder={t('search_airport_placeholder')}
                value={destFilter}
                onChange={(e) => setDestFilter(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-brand-border rounded-lg mb-2 focus:outline-hidden focus:border-brand-blue"
                autoFocus
              />
              <div className="space-y-1">
                {filteredDests.map((a) => (
                  <div
                    key={a.id}
                    onClick={() => {
                      setDestinationIata(a.iataCode);
                      setDestOpen(false);
                      setDestFilter('');
                    }}
                    className={`flex items-center justify-between p-2 rounded-lg text-xs cursor-pointer hover:bg-blue-50 transition-colors ${
                      a.iataCode === destinationIata ? 'bg-blue-50/80 font-bold text-brand-blue' : 'text-brand-navy'
                    }`}
                  >
                    <div>
                      <div className="font-bold">{language === 'en' ? a.cityEn : a.city} ({a.iataCode})</div>
                      <div className="text-[10px] text-brand-muted">{a.name}</div>
                    </div>
                    {a.iataCode === destinationIata && <Check className="w-3.5 h-3.5 text-brand-blue" />}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Departure & Return Dates */}
        <div className="lg:col-span-3 grid grid-cols-2 gap-2">
          {/* Departure Date */}
          <div>
            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1 block">
              {t('search_departure_date')}
            </label>
            <div className="relative">
              <input
                type="date"
                min={getFutureDateString(0)}
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                className="w-full h-[58px] px-3 py-2 text-xs sm:text-sm font-bold text-brand-navy bg-brand-bg rounded-xl border border-brand-border/80 focus:border-brand-blue focus:outline-hidden"
              />
            </div>
          </div>

          {/* Return Date */}
          <div>
            <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1 block">
              {t('search_return_date')}
            </label>
            <div className="relative">
              <input
                type="date"
                disabled={tripType === 'one-way'}
                min={departureDate}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className={`w-full h-[58px] px-3 py-2 text-xs sm:text-sm font-bold rounded-xl border border-brand-border/80 focus:outline-hidden ${
                  tripType === 'one-way'
                    ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                    : 'bg-brand-bg text-brand-navy focus:border-brand-blue'
                }`}
              />
            </div>
          </div>
        </div>

        {/* Passengers & Search Button */}
        <div className="lg:col-span-2 flex flex-col justify-end">
          <label className="text-[11px] font-bold text-brand-muted uppercase tracking-wider mb-1 block">
            {t('search_passengers')}
          </label>
          <div className="relative" ref={passengerRef}>
            <div
              onClick={() => setPassengerOpen(!passengerOpen)}
              className="flex items-center justify-between p-3 bg-brand-bg rounded-xl border border-brand-border/80 hover:border-brand-blue/60 cursor-pointer h-[58px]"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Users className="w-4 h-4 text-brand-navy flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-brand-navy truncate">
                  {totalPassengers} {language === 'tr' ? 'Yolcu' : 'Pax'}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </div>

            {/* Passenger Selector Popup */}
            {passengerOpen && (
              <div className="absolute top-[68px] right-0 w-64 bg-white rounded-xl shadow-elevated border border-brand-border p-4 z-50 animate-fade-in space-y-3">
                {/* Adults */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-brand-navy">{t('search_adults')}</div>
                    <div className="text-[10px] text-brand-muted">12+ yaş</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setAdults(Math.max(1, adults - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{adults}</span>
                    <button
                      type="button"
                      onClick={() => setAdults(Math.min(9, adults + 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Children */}
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-brand-navy">{t('search_children')}</div>
                    <div className="text-[10px] text-brand-muted">2-11 yaş</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setChildren(Math.max(0, children - 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-xs"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-4 text-center">{children}</span>
                    <button
                      type="button"
                      onClick={() => setChildren(Math.min(5, children + 1))}
                      className="w-7 h-7 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-xs"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setPassengerOpen(false)}
                  className="w-full py-1.5 bg-brand-blue text-white rounded-lg text-xs font-bold"
                >
                  Tamam
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="lg:col-span-12 mt-2">
          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-brand-blue hover:bg-blue-600 text-white font-heading font-bold text-base shadow-elevated flex items-center justify-center gap-2 transition-all active:scale-[0.99]"
          >
            <Search className="w-5 h-5 stroke-[2.5]" />
            <span>{t('search_btn')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
