import React from 'react';

interface MandalaProps {
  className?: string;
  size?: number;
}

export const Mandala: React.FC<MandalaProps> = ({ className = '', size = 500 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 500 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none opacity-20 transition-opacity duration-700 animate-mandala-spin-slow ${className}`}
      aria-hidden="true"
    >
      <circle cx="250" cy="250" r="230" stroke="currentColor" strokeWidth="1.5" strokeDasharray="6 6" />
      <circle cx="250" cy="250" r="190" stroke="currentColor" strokeWidth="1" />
      <circle cx="250" cy="250" r="150" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 8" />
      <circle cx="250" cy="250" r="100" stroke="currentColor" strokeWidth="1" />
      <circle cx="250" cy="250" r="50" stroke="currentColor" strokeWidth="2" />
      <circle cx="250" cy="250" r="8" fill="currentColor" />

      {/* 16 Radial Petals */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 360) / 16;
        return (
          <g key={i} transform={`rotate(${angle} 250 250)`}>
            <path
              d="M250 100 C235 150 230 190 250 210 C270 190 265 150 250 100 Z"
              stroke="currentColor"
              strokeWidth="1.2"
              fill="none"
            />
            <path
              d="M250 40 C220 100 220 160 250 190 C280 160 280 100 250 40 Z"
              stroke="currentColor"
              strokeWidth="1"
              strokeOpacity="0.7"
              fill="none"
            />
            <circle cx="250" cy="40" r="3" fill="currentColor" />
            <circle cx="250" cy="90" r="2" fill="currentColor" />
          </g>
        );
      })}
    </svg>
  );
};
