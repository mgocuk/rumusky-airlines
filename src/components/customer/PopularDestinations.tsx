import React from 'react';
import { useApp } from '../../context/AppContext';
import { INITIAL_DESTINATIONS } from '../../data/seedData';
import { Plane, ArrowUpRight } from 'lucide-react';

export const PopularDestinations: React.FC = () => {
  const { language, t, setSearchQuery } = useApp();

  const handleDestinationClick = (dest: typeof INITIAL_DESTINATIONS[0]) => {
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

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {INITIAL_DESTINATIONS.map((dest) => {
          const cityName = language === 'en' ? dest.cityEn : dest.city;
          const countryName = language === 'en' ? dest.countryEn : dest.country;

          return (
            <div
              key={dest.id}
              onClick={() => handleDestinationClick(dest)}
              className="group bg-white rounded-2xl overflow-hidden border border-brand-border/80 shadow-subtle hover:shadow-elevated hover:border-brand-blue/30 transition-all duration-300 cursor-pointer flex flex-col"
            >
              {/* Image Container */}
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={dest.imageUrl}
                  alt={cityName}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-md bg-brand-navy/85 backdrop-blur-xs text-white text-xs font-bold tracking-wider">
                  {dest.iataCode}
                </div>
              </div>

              {/* Text Info */}
              <div className="p-3.5 flex flex-col justify-between flex-1">
                <div>
                  <h4 className="font-bold text-brand-navy text-sm sm:text-base group-hover:text-brand-blue transition-colors">
                    {cityName}
                  </h4>
                  <p className="text-xs text-brand-muted mt-0.5">{countryName}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-brand-muted uppercase tracking-wider block">
                      {t('starting_from')}
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-brand-navy">
                      {dest.startingPrice.toLocaleString('tr-TR')} {dest.currency}
                    </span>
                  </div>
                  
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-brand-blue flex items-center justify-center group-hover:bg-brand-blue group-hover:text-white transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
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
