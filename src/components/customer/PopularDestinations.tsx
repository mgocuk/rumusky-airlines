import React from 'react';
import { useApp } from '../../context/AppContext';
import { PopularDestination } from '../../types';
import { CentralAsianCorner, CentralAsianDivider } from '../common/CentralAsianMotif';
import { ArrowUpRight } from 'lucide-react';

export const PopularDestinations: React.FC = () => {
  const { destinations, language, t, setSearchQuery } = useApp();

  const handleDestinationClick = (dest: PopularDestination) => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 3);
    const dateStr = nextWeek.toISOString().split('T')[0];

    setSearchQuery({
      tripType: 'one-way',
      originIata: 'IST',
      destinationIata: dest.iataCode,
      departureDate: dateStr,
      adults: 1,
      children: 0,
      infants: 0,
      cabinClass: 'economy'
    });
  };

  return (
    <section className="max-w-[1240px] w-full mx-auto px-4 sm:px-6 py-8">
      <CentralAsianDivider className="mb-8" />

      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
        <div>
          <h3 className="text-xl sm:text-2xl font-bold text-brand-navy font-heading">
            {t('destinations_title')}
          </h3>
          <p className="text-sm text-brand-muted mt-1">
            {t('destinations_subtitle')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {destinations.map((dest) => {
          const cityName = language === 'en' ? dest.cityEn : dest.city;
          const countryName = language === 'en' ? dest.countryEn : dest.country;

          return (
            <div
              key={dest.id}
              onClick={() => handleDestinationClick(dest)}
              className="relative group bg-white rounded-2xl overflow-hidden border border-[#D8C7A4] shadow-subtle hover:shadow-elevated hover:border-[#C49238]/80 transition-all duration-300 cursor-pointer flex flex-col"
            >
              {/* Altın üst şerit ve köşe motifleri */}
              <div className="pointer-events-none absolute top-0 inset-x-6 h-[2px] bg-gradient-to-r from-transparent via-[#E6C376]/85 to-transparent z-20" />
              <CentralAsianCorner position="bl" className="absolute bottom-1 left-1 w-6 h-6 opacity-50 z-20" />
              <CentralAsianCorner position="br" className="absolute bottom-1 right-1 w-6 h-6 opacity-50 z-20" />

              {/* Image Container */}
              <div className="relative h-36 sm:h-44 overflow-hidden bg-brand-ivory">
                <img
                  src={dest.imageUrl}
                  alt={cityName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 sm:py-1 rounded-md bg-[#071628]/90 backdrop-blur-xs text-[#ECC97E] border border-[#C49238]/65 text-[10px] sm:text-xs font-bold tracking-wider shadow-xs">
                  {dest.iataCode}
                </div>
              </div>

              {/* Text Info */}
              <div className="p-3 sm:p-3.5 flex flex-col justify-between flex-1">
                <div>
                  <h4 className="font-bold text-brand-navy text-xs sm:text-base group-hover:text-brand-blue transition-colors truncate">
                    {cityName}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-brand-muted mt-0.5 truncate">{countryName}</p>
                </div>

                <div className="mt-3 sm:mt-4 pt-2.5 sm:pt-3 border-t border-brand-border/60 flex items-center justify-between">
                  <div>
                    <span className="text-[9px] sm:text-[10px] text-brand-muted uppercase tracking-wider block">
                      {t('starting_from')}
                    </span>
                    <span className="text-xs sm:text-base font-extrabold text-brand-navy">
                      {dest.startingPrice.toLocaleString('tr-TR')} {dest.currency}
                    </span>
                  </div>

                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-brand-goldLight text-brand-gold border border-brand-gold/30 flex items-center justify-center group-hover:bg-brand-gold group-hover:text-white transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
