import React, { useId } from 'react';

/**
 * Symmetrical vector emblem inspired by the Alpha Airline Samruk crest:
 * 8-point Polar Star (Demirkazık), Celestial Arc, layered golden Samruk wings,
 * sleek central Samruk silhouette, and Qoshqar Muyiz (ram's horn) chevron tail.
 */
export const SamrukCrest: React.FC<{ className?: string; showArc?: boolean }> = ({
  className = 'w-20 h-11',
  showArc = true
}) => {
  const uid = useId().replace(/:/g, '');
  const wingGradId = `samruk-wing-${uid}`;
  const starGradId = `samruk-star-${uid}`;

  return (
    <svg
      viewBox="0 0 120 64"
      className={`pointer-events-none select-none ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={wingGradId} x1="8" y1="16" x2="112" y2="54" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F3DC99" />
          <stop offset="35%" stopColor="#D8AE58" />
          <stop offset="70%" stopColor="#C49238" />
          <stop offset="100%" stopColor="#9E6F21" />
        </linearGradient>
        <linearGradient id={starGradId} x1="60" y1="2" x2="60" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF4CC" />
          <stop offset="50%" stopColor="#E6C376" />
          <stop offset="100%" stopColor="#C49238" />
        </linearGradient>
      </defs>

      {/* Gökkubbe Kemeri (Celestial Arc) */}
      {showArc && (
        <g stroke={`url(#${wingGradId})`} strokeWidth="1.15" strokeLinecap="round" opacity="0.9">
          <path d="M22 31 A40 34 0 0 1 51 13.5" />
          <path d="M69 13.5 A40 34 0 0 1 98 31" />
        </g>
      )}

      {/* 8 Köşeli Kutup Yıldızı (Demirkazık) */}
      <path
        d="M60 2 L61.6 10.4 L66 7 L62.6 11.4 L71 13 L62.6 14.6 L66 19 L61.6 15.6 L60 24 L58.4 15.6 L54 19 L57.4 14.6 L49 13 L57.4 11.4 L54 7 L58.4 10.4 Z"
        fill={`url(#${starGradId})`}
      />

      {/* Sol Katmanlı Samruk Kanat Telekleri */}
      <g fill={`url(#${wingGradId})`}>
        <path d="M55 31 C41 28 24 23 9 14 C16 22 28 28 46 33 Z" />
        <path d="M54 34 C40 32 25 29 14 23 C21 29 33 34 49 36.5 Z" opacity="0.92" />
        <path d="M54 37.5 C42 36.5 30 35 20 31 C27 36 37 39 51 40 Z" opacity="0.85" />
        <path d="M55 41 C45 41 36 40 28 37.5 C35 41.5 43 43.5 53 43.5 Z" opacity="0.75" />
      </g>

      {/* Sağ Katmanlı Samruk Kanat Telekleri */}
      <g fill={`url(#${wingGradId})`}>
        <path d="M65 31 C79 28 96 23 111 14 C104 22 92 28 74 33 Z" />
        <path d="M66 34 C80 32 95 29 106 23 C99 29 87 34 71 36.5 Z" opacity="0.92" />
        <path d="M66 37.5 C78 36.5 90 35 100 31 C93 36 83 39 69 40 Z" opacity="0.85" />
        <path d="M65 41 C75 41 84 40 92 37.5 C85 41.5 77 43.5 67 43.5 Z" opacity="0.75" />
      </g>

      {/* Samruk Baş, Boyun ve Göğüs Silüeti */}
      <path
        d="M57 28 C58.5 24 62.5 23.5 65.5 25 C63.5 25.5 62.2 26.8 62.5 29 C63.2 33 63.5 39 60 46.5 C56.5 39 56.8 33 57 28 Z"
        fill={`url(#${wingGradId})`}
      />

      {/* Koçboynuzu (Qoşqar Müyiz) & Bozkır Tamga Kuyruk Şevronu */}
      <path
        d="M60 47.5 L53 56.5 L57.2 53.2 L60 61 L62.8 53.2 L67 56.5 Z"
        fill={`url(#${wingGradId})`}
      />
      <path
        d="M54.5 48 C50.5 47 47.5 49 46 52 C48.5 50.8 51.5 50.5 54 51.8 Z"
        fill={`url(#${wingGradId})`}
        opacity="0.88"
      />
      <path
        d="M65.5 48 C69.5 47 72.5 49 74 52 C71.5 50.8 68.5 50.5 66 51.8 Z"
        fill={`url(#${wingGradId})`}
        opacity="0.88"
      />
    </svg>
  );
};

/**
 * Repeating Central Asian (Qoshqar Muyiz, Samruk Feather Chevron & 8-point Star)
 * crisp 1:1 horizontal border without aspect distortion.
 */
export const CentralAsianBorder: React.FC<{
  className?: string;
  opacity?: number;
  variant?: 'light' | 'dark';
  withMedallion?: boolean;
}> = ({ className = '', opacity = 0.85, variant = 'light', withMedallion = false }) => {
  const uid = useId().replace(/:/g, '');
  const patternId = `ca-border-motif-${uid}`;
  const isDark = variant === 'dark';

  const strokePrimary = isDark ? '#E6C376' : '#C49238';
  const strokeSecondary = isDark ? '#C49238' : '#1E5B70';
  const railColor = isDark ? '#D8AE58' : '#C49238';
  const fillDiamond = isDark ? '#F3DC99' : '#1E5B70';

  return (
    <div
      className={`relative w-full overflow-hidden pointer-events-none select-none ${
        isDark ? 'bg-[#061322]' : ''
      } ${className}`}
      style={{ opacity }}
    >
      <svg
        className="w-full h-4 block"
        width="100%"
        height="16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id={patternId} width="64" height="16" patternUnits="userSpaceOnUse">
            {/* Üst ve alt altın cetvel çizgileri */}
            <line x1="0" y1="1.5" x2="64" y2="1.5" stroke={railColor} strokeWidth="0.7" strokeOpacity="0.45" />
            <line x1="0" y1="14.5" x2="64" y2="14.5" stroke={railColor} strokeWidth="0.7" strokeOpacity="0.45" />

            {/* Qoşqar Müyiz (Koçboynuzu) simetrik bozkır dalgası */}
            <path
              d="M0 8 H8 C11 8 12.5 3.5 16 3.5 C19.5 3.5 19.5 8 23 8 C26.5 8 26.5 12.5 30 12.5 C33.5 12.5 35 8 38 8 H64"
              stroke={strokePrimary}
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeOpacity="0.88"
            />
            {/* Samruk tüy şevronları */}
            <path
              d="M44 5 L49 8 L44 11 M52 5 L57 8 L52 11"
              stroke={strokeSecondary}
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.78"
            />

            {/* 8 köşeli yıldız / elmas düğümü */}
            <polygon points="32,4.5 35.5,8 32,11.5 28.5,8" fill={fillDiamond} fillOpacity="0.82" />
            <circle cx="8" cy="8" r="1.15" fill={strokePrimary} />
            <circle cx="60" cy="8" r="1.15" fill={strokePrimary} />
          </pattern>
        </defs>
        <rect width="100%" height="16" fill={`url(#${patternId})`} />
      </svg>

      {withMedallion && (
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 px-2.5 py-0.5 rounded-full border flex items-center justify-center ${
            isDark
              ? 'bg-[#061322] border-[#E6C376]/60 shadow-[0_0_12px_rgba(196,146,56,0.3)]'
              : 'bg-[#FFFDF8] border-[#C49238]/55 shadow-xs'
          }`}
        >
          <SamrukCrest className="w-7 h-3.5" showArc={false} />
        </div>
      )}
    </div>
  );
};

/**
 * Authentic Central Asian stepped double L-border corner (Ulama knot)
 * paired with 3 curved Samruk wing feathers and an 8-point Polar Star.
 */
export const CentralAsianCorner: React.FC<{
  position?: 'tl' | 'tr' | 'bl' | 'br';
  variant?: 'gold' | 'light';
  className?: string;
}> = ({ position = 'tl', variant = 'gold', className = 'w-12 h-12' }) => {
  const rotationMap = {
    tl: '',
    tr: 'scale-x-[-1]',
    bl: 'scale-y-[-1]',
    br: 'scale-[-1]'
  };

  const isLight = variant === 'light';
  const primary = isLight ? '#F3DC99' : '#C49238';
  const secondary = isLight ? '#D8AE58' : '#1E5B70';
  const fillTint = isLight ? '#E6C376' : '#D2A54E';

  return (
    <svg
      viewBox="0 0 64 64"
      className={`pointer-events-none select-none ${rotationMap[position]} ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Dış kademeli altın L-bordür ve Ulama düğümü */}
      <path
        d="M3 46 V10 C3 6.134 6.134 3 10 3 H46"
        stroke={primary}
        strokeOpacity={isLight ? '0.78' : '0.62'}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M7.5 38 V13 C7.5 9.96 9.96 7.5 13 7.5 H38"
        stroke={secondary}
        strokeOpacity={isLight ? '0.62' : '0.45'}
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Kademeli iç sekizgen köşe girintisi */}
      <path
        d="M12 24 V16 H16 V12 H24"
        stroke={primary}
        strokeOpacity={isLight ? '0.75' : '0.58'}
        strokeWidth="1.15"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Köşeden içe doğru süzülen 3 adet Samruk kanat teleği */}
      <path
        d="M14 14 C23 15 31 19 37 25 C29 22 22 20 14 17 Z"
        fill={fillTint}
        fillOpacity={isLight ? '0.32' : '0.24'}
        stroke={primary}
        strokeOpacity={isLight ? '0.65' : '0.45'}
        strokeWidth="0.9"
      />
      <path
        d="M14 14 C15 23 19 31 25 37 C22 29 20 22 17 14 Z"
        fill={fillTint}
        fillOpacity={isLight ? '0.32' : '0.24'}
        stroke={primary}
        strokeOpacity={isLight ? '0.65' : '0.45'}
        strokeWidth="0.9"
      />
      <path
        d="M16 16 C22 21 26 26 29 31 C24 27 19 22 16 16 Z"
        fill={primary}
        fillOpacity={isLight ? '0.48' : '0.35'}
      />

      {/* Köşe noktasında 8 köşeli Kutup Yıldızı */}
      <path
        d="M10 4 L11 8.5 L14 6 L11.5 9 L16 10 L11.5 11 L14 14 L11 11.5 L10 16 L9 11.5 L6 14 L8.5 11 L4 10 L8.5 9 L6 6 L9 8.5 Z"
        fill={primary}
        fillOpacity={isLight ? '0.92' : '0.85'}
      />
    </svg>
  );
};

/**
 * Centered Central Asian section divider featuring the golden SamrukCrest
 * flanked by tapered horizon lines and diamond accents.
 */
export const CentralAsianDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-3 select-none ${className}`}>
    <div className="flex items-center flex-1 gap-1.5">
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-brand-gold/45 to-brand-gold/80" />
      <span className="w-1.5 h-1.5 rotate-45 bg-brand-gold/75 shrink-0" />
    </div>
    <div className="px-2 py-0.5 rounded-full bg-[#061322]/95 border border-[#D8AE58]/60 shadow-xs flex items-center justify-center shrink-0">
      <SamrukCrest className="w-12 h-6" />
    </div>
    <div className="flex items-center flex-1 gap-1.5">
      <span className="w-1.5 h-1.5 rotate-45 bg-brand-gold/75 shrink-0" />
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-brand-gold/45 to-brand-gold/80" />
    </div>
  </div>
);

/**
 * Reusable Samruk & Central Asian double-bordered container frame
 * with 4-corner filigree accents and optional top Samruk crest crown.
 */
export const SamrukFrame: React.FC<{
  children: React.ReactNode;
  className?: string;
  innerClassName?: string;
  variant?: 'ivory' | 'navy' | 'glass';
  cornerSize?: 'sm' | 'md' | 'lg';
  showCrown?: boolean;
  overflowVisible?: boolean;
}> = ({
  children,
  className = '',
  innerClassName = '',
  variant = 'ivory',
  cornerSize = 'md',
  showCrown = false,
  overflowVisible = false
}) => {
  const sizeClassMap = {
    sm: 'w-7 h-7',
    md: 'w-10 h-10',
    lg: 'w-14 h-14'
  };
  const cornerSizeClass = sizeClassMap[cornerSize];

  const variantClasses = {
    ivory: 'bg-white border border-[#D8C7A4] shadow-elevated',
    navy: 'bg-gradient-to-br from-[#061322] via-[#0B1E35] to-[#061322] border border-[#C49238]/55 text-white shadow-elevated',
    glass: 'bg-white/90 backdrop-blur-md border border-[#C49238]/50 shadow-xl'
  };

  const cornerVariant = variant === 'navy' ? 'light' : 'gold';

  return (
    <div
      className={`relative rounded-3xl ${overflowVisible ? 'overflow-visible' : 'overflow-hidden'} ${variantClasses[variant]} ${className}`}
    >
      {/* Üst kenar altın ışıltı şeridi */}
      <div className="pointer-events-none absolute top-0 inset-x-10 h-[2px] bg-gradient-to-r from-transparent via-[#E6C376]/85 to-transparent z-10" />

      {/* İnce çift iç çerçeve */}
      <div
        className={`pointer-events-none absolute inset-[5px] rounded-[20px] border z-10 ${
          variant === 'navy' ? 'border-[#E6C376]/25' : 'border-[#C49238]/25'
        }`}
      />

      {/* 4 Köşe Samruk & Orta Asya Motifleri */}
      <CentralAsianCorner position="tl" variant={cornerVariant} className={`absolute top-1.5 left-1.5 z-10 ${cornerSizeClass}`} />
      <CentralAsianCorner position="tr" variant={cornerVariant} className={`absolute top-1.5 right-1.5 z-10 ${cornerSizeClass}`} />
      <CentralAsianCorner position="bl" variant={cornerVariant} className={`absolute bottom-1.5 left-1.5 z-10 ${cornerSizeClass}`} />
      <CentralAsianCorner position="br" variant={cornerVariant} className={`absolute bottom-1.5 right-1.5 z-10 ${cornerSizeClass}`} />

      {/* İsteğe bağlı üst kenar Samruk Tacı */}
      {showCrown && (
        <div className="pointer-events-none absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 px-3 py-0.5 rounded-full bg-[#061322] border border-[#E6C376]/75 shadow-[0_2px_10px_rgba(6,19,34,0.28)] flex items-center justify-center">
          <SamrukCrest className="w-10 h-5" />
        </div>
      )}

      <div className={`relative z-20 ${innerClassName}`}>{children}</div>
    </div>
  );
};
