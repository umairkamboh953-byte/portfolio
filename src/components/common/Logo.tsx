import React from 'react';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ className = '', iconOnly = false, size = 'md' }) => {
  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl',
  };

  return (
    <div className={`inline-flex items-center gap-2.5 font-bold tracking-tight text-white select-none ${className}`}>
      {/* Modern Developer Tech Symbol: Code Terminal & Precision Diamond Crest */}
      <div className={`relative ${iconSizes[size]} shrink-0 flex items-center justify-center`}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_12px_rgba(0,102,255,0.45)]"
        >
          <defs>
            <linearGradient id="smartDevGrad1" x1="2" y1="4" x2="34" y2="32" gradientUnits="userSpaceOnUse">
              <stop stopColor="#0066FF" />
              <stop offset="0.6" stopColor="#00D2FF" />
              <stop offset="1" stopColor="#00F0FF" />
            </linearGradient>
            <linearGradient id="smartDevGrad2" x1="18" y1="10" x2="18" y2="28" gradientUnits="userSpaceOnUse">
              <stop stopColor="#00F0FF" />
              <stop offset="1" stopColor="#0052CC" />
            </linearGradient>
          </defs>

          {/* Left Code Bracket < */}
          <path
            d="M12 11L5 18L12 25"
            stroke="url(#smartDevGrad1)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Right Code Bracket > */}
          <path
            d="M24 11L31 18L24 25"
            stroke="url(#smartDevGrad1)"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Central Dev Slash / */}
          <path
            d="M20 9L16 27"
            stroke="url(#smartDevGrad2)"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </svg>
      </div>

      {!iconOnly && (
        <span className={`${textSizes[size]} font-extrabold tracking-tight text-white whitespace-nowrap`}>
          Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-cyan-400 font-medium">Developer</span>
        </span>
      )}
    </div>
  );
};
