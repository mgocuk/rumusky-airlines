import React from 'react';

/**
 * Repeating Central Asian (Qoshqar Muyiz & Seljuk 8-point star) ornamental horizontal border.
 */
export const CentralAsianBorder: React.FC<{ className?: string; opacity?: number }> = ({
  className = '',
  opacity = 0.5
}) => (
  <div className={`w-full overflow-hidden pointer-events-none select-none ${className}`} style={{ opacity }}>
    <svg
      className="w-full h-3.5"
      preserveAspectRatio="none"
      viewBox="0 0 600 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <pattern id="ca-border-motif" width="40" height="14" patternUnits="userSpaceOnUse">
          <path
            d="M0 7 H8 C11 7 12 2 15 2 C18 2 17 7 20 7 C23 7 22 12 25 12 C28 12 29 7 32 7 H40"
            stroke="#C49238"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
          <polygon points="20,4.5 22.5,7 20,9.5 17.5,7" fill="#1E5B70" fillOpacity="0.65" />
          <circle cx="8" cy="7" r="1.1" fill="#C49238" />
          <circle cx="32" cy="7" r="1.1" fill="#C49238" />
        </pattern>
      </defs>
      <rect width="600" height="14" fill="url(#ca-border-motif)" />
    </svg>
  </div>
);

/**
 * Corner Central Asian filigree scrollwork accent for light ivory cards.
 */
export const CentralAsianCorner: React.FC<{ position?: 'tl' | 'tr' | 'bl' | 'br'; className?: string }> = ({
  position = 'tl',
  className = ''
}) => {
  const rotationMap = {
    tl: '',
    tr: 'scale-x-[-1]',
    bl: 'scale-y-[-1]',
    br: 'scale-[-1]'
  };

  return (
    <svg
      viewBox="0 0 44 44"
      className={`w-8 h-8 pointer-events-none select-none ${rotationMap[position]} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 2H26C21 2 17 6 17 11C17 15 20 17 23 17C18 19 14 23 14 28C9 28 5 31 2 36V2Z"
        stroke="#C49238"
        strokeOpacity="0.45"
        strokeWidth="1.25"
        fill="#D2A54E"
        fillOpacity="0.08"
      />
      <path
        d="M6 6H14M6 6V14M6 6L12 12"
        stroke="#1E5B70"
        strokeOpacity="0.45"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
};

/**
 * Centered subtle Central Asian section divider with an 8-point Kazakh star.
 */
export const CentralAsianDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-3 select-none ${className}`}>
    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-brand-gold/40 to-brand-gold/60" />
    <svg viewBox="0 0 28 28" className="w-5 h-5 shrink-0" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14 2L17.2 8.8L24 7.8L19.6 13.5L24 19.2L17.2 18.2L14 25L10.8 18.2L4 19.2L8.4 13.5L4 7.8L10.8 8.8L14 2Z"
        stroke="#C49238"
        strokeWidth="1.3"
        fill="#FBF4E4"
      />
      <circle cx="14" cy="13.5" r="2.2" fill="#1E5B70" />
    </svg>
    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-brand-gold/40 to-brand-gold/60" />
  </div>
);
