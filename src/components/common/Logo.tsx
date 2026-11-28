import React from 'react';
import { useApp } from '../../context/AppContext';

interface LogoProps {
  variant?: 'full' | 'symbol' | 'white';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  customTitle?: string;
  customSubtitle?: string;
  customImage?: string;
  companyName?: string;
  companySubtitle?: string;
  logoImage?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'full',
  className = '',
  size = 'md',
  customTitle,
  customSubtitle,
  customImage,
  companyName: propCompanyName,
  companySubtitle: propCompanySubtitle,
  logoImage: propLogoImage
}) => {
  const { siteContent } = useApp();
  const isWhite = variant === 'white';

  const finalTitle = propCompanyName || customTitle;
  const finalSubtitle = propCompanySubtitle || customSubtitle;
  const finalImage = propLogoImage !== undefined ? propLogoImage : customImage;

  const rawCompanyName = finalTitle || siteContent?.companyName || siteContent?.navbar?.companyName || 'Alpha Airline';
  const companyName = rawCompanyName.toUpperCase() === 'RUMUSKY' ? 'Alpha Airline' : rawCompanyName;
  const rawSubtitle = finalSubtitle || siteContent?.companySubtitle || siteContent?.navbar?.companySubtitle || 'FLY BEYOND BORDERS';
  const companySubtitle = rawSubtitle.toUpperCase() === 'AIRLINES' ? 'FLY BEYOND BORDERS' : rawSubtitle;
  const rawImage = finalImage !== undefined ? finalImage : (siteContent?.customLogoUrl || siteContent?.navbar?.customLogoUrl || '/logos/alpha-airline-logo.png');
  const logoImage = rawImage === '/logos/rumusky-brand-logo.png' || !rawImage ? '/logos/alpha-airline-logo.png' : rawImage;

  const sizeMap = {
    sm: { symbol: 'w-9 h-9 max-w-[36px] max-h-[36px]', text: 'text-base sm:text-lg', sub: 'text-[8px]' },
    md: { symbol: 'w-11 h-11 max-w-[44px] max-h-[44px]', text: 'text-lg sm:text-xl', sub: 'text-[9px]' },
    lg: { symbol: 'w-14 h-14 max-w-[56px] max-h-[56px]', text: 'text-2xl', sub: 'text-[10px]' }
  };

  const { symbol: symbolClass, text: textClass, sub: subClass } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none cursor-pointer ${className}`}>
      {/* Samruk Emblem framed with double gold borders and corner notches */}
      <div
        className={`relative ${symbolClass} rounded-xl flex items-center justify-center shrink-0 overflow-hidden transition-transform duration-200 group-hover:scale-105 bg-[#061322] border border-[#D8AE58]/80 ring-1 ring-[#C49238]/30 shadow-[0_0_16px_rgba(196,146,56,0.22)]`}
      >
        <span className="pointer-events-none absolute top-0.5 left-0.5 w-1.5 h-1.5 border-t border-l border-[#F3DC99]/80 rounded-tl-[2px] z-10" />
        <span className="pointer-events-none absolute top-0.5 right-0.5 w-1.5 h-1.5 border-t border-r border-[#F3DC99]/80 rounded-tr-[2px] z-10" />
        <span className="pointer-events-none absolute bottom-0.5 left-0.5 w-1.5 h-1.5 border-b border-l border-[#F3DC99]/80 rounded-bl-[2px] z-10" />
        <span className="pointer-events-none absolute bottom-0.5 right-0.5 w-1.5 h-1.5 border-b border-r border-[#F3DC99]/80 rounded-br-[2px] z-10" />
        <img
          src={logoImage}
          alt={companyName}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Wordmark */}
      {variant !== 'symbol' && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center tracking-wide">
            <span
              className={`font-heading font-extrabold tracking-wide whitespace-nowrap ${textClass} ${
                isWhite ? 'text-[#FFFDF8]' : 'text-brand-navy'
              }`}
            >
              {companyName}
            </span>
          </div>
          <div className="flex items-center gap-1 -mt-0.5">
            {isWhite && (
              <svg viewBox="0 0 12 12" className="w-2.5 h-2.5 shrink-0 text-[#E6C376]" fill="currentColor" aria-hidden="true">
                <path d="M6 0.5 L7.1 4.4 L10.2 2.4 L8.1 5.3 L11.5 6 L8.1 6.7 L10.2 9.6 L7.1 7.6 L6 11.5 L4.9 7.6 L1.8 9.6 L3.9 6.7 L0.5 6 L3.9 5.3 L1.8 2.4 L4.9 4.4 Z" />
              </svg>
            )}
            <span
              className={`font-semibold tracking-[0.2em] uppercase ${subClass} ${
                isWhite ? 'text-[#E6C376]' : 'text-brand-gold'
              }`}
            >
              {companySubtitle}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
