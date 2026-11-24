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
      {/* Uploaded Alpha Central Asian Phoenix Emblem */}
      <div
        className={`${symbolClass} rounded-xl flex items-center justify-center shrink-0 overflow-hidden transition-transform duration-200 group-hover:scale-105 bg-[#061322] border border-brand-gold/60 shadow-subtle ring-1 ring-brand-gold/25`}
      >
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
                isWhite ? 'text-white' : 'text-brand-navy'
              }`}
            >
              {companyName}
            </span>
          </div>
          <span
            className={`font-semibold tracking-[0.2em] -mt-0.5 uppercase ${subClass} ${
              isWhite ? 'text-brand-cyan' : 'text-brand-gold'
            }`}
          >
            {companySubtitle}
          </span>
        </div>
      )}
    </div>
  );
};
