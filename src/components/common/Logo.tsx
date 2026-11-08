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

  const companyName = finalTitle || siteContent?.companyName || siteContent?.navbar?.companyName || 'RUMUSKY';
  const companySubtitle = finalSubtitle || siteContent?.companySubtitle || siteContent?.navbar?.companySubtitle || 'AIRLINES';
  const logoImage = finalImage !== undefined ? finalImage : (siteContent?.customLogoUrl || siteContent?.navbar?.customLogoUrl || '/logos/rumusky-brand-logo.png');
  
  const sizeMap = {
    sm: { symbol: 'w-8 h-8', text: 'text-lg', sub: 'text-[9px]' },
    md: { symbol: 'w-10 h-10', text: 'text-xl', sub: 'text-[10px]' },
    lg: { symbol: 'w-13 h-13', text: 'text-2xl', sub: 'text-xs' }
  };

  const { symbol: symbolClass, text: textClass, sub: subClass } = sizeMap[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none cursor-pointer ${className}`}>
      {/* Custom Logo Image or Default Wing-R Monogram Symbol */}
      {logoImage ? (
        <div className={`${symbolClass} rounded-xl flex items-center justify-center p-1 flex-shrink-0 transition-transform duration-200 group-hover:scale-105 ${isWhite ? 'bg-white shadow-xs' : 'bg-white/95 shadow-2xs border border-slate-100'}`}>
          <img
            src={logoImage}
            alt={companyName}
            className="w-full h-full object-contain"
          />
        </div>
      ) : (
        <svg
          viewBox="0 0 48 48"
          className={`${symbolClass} flex-shrink-0 transition-transform duration-200 group-hover:scale-105`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isWhite ? '#FFFFFF' : '#0D6EFD'} />
              <stop offset="100%" stopColor={isWhite ? '#E0F2FE' : '#00B4DB'} />
            </linearGradient>
            <linearGradient id="wingGradDark" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isWhite ? '#E2E8F0' : '#0B2545'} />
              <stop offset="100%" stopColor={isWhite ? '#CBD5E1' : '#0D6EFD'} />
            </linearGradient>
          </defs>

          {/* Back aerodynamic wing sweep */}
          <path
            d="M6 38L24 10H34L19 32H38L34 38H6Z"
            fill="url(#wingGradDark)"
            opacity={isWhite ? 0.9 : 1}
          />
          {/* Forward dynamic wing / R-curve top */}
          <path
            d="M26 10L21 20H37L42 10H26Z"
            fill="url(#wingGrad)"
          />
          {/* Dynamic jet streak accent */}
          <circle cx="39" cy="20" r="2.5" fill={isWhite ? '#38BDF8' : '#00B4DB'} />
        </svg>
      )}

      {/* Wordmark */}
      {variant !== 'symbol' && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center tracking-wider">
            <span
              className={`font-heading font-extrabold tracking-wider ${textClass} ${
                isWhite ? 'text-white' : 'text-brand-navy'
              }`}
            >
              {companyName}
            </span>
          </div>
          <span
            className={`font-semibold tracking-[0.25em] -mt-0.5 uppercase ${subClass} ${
              isWhite ? 'text-sky-200' : 'text-brand-blue'
            }`}
          >
            {companySubtitle}
          </span>
        </div>
      )}
    </div>
  );
};
