import React from 'react';

interface NexaLogoProps {
  variant?: 'full' | 'icon-only' | 'wordmark-only';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  glow?: boolean;
  showSubtitle?: boolean;
}

export const NexaLogo: React.FC<NexaLogoProps> = ({
  variant = 'full',
  size = 'md',
  className = '',
  glow = false,
  showSubtitle = true
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <div className={`inline-flex items-center gap-2.5 font-display select-none ${className}`}>
      {variant !== 'wordmark-only' && (
        <div className={`relative ${iconSizes[size]} flex-shrink-0 ${glow ? 'drop-shadow-[0_0_16px_rgba(15,164,175,0.6)]' : ''}`}>
          <svg
            viewBox="0 0 120 120"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full transform transition-transform duration-300 hover:scale-105"
            aria-label="Newta Tech Icon"
          >
            <defs>
              {/* Palette Primary Gradient: 0FA4AF -> AFDDE5 */}
              <linearGradient id="newta-grad-primary" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0FA4AF" />
                <stop offset="100%" stopColor="#AFDDE5" />
              </linearGradient>

              {/* Palette Deep Accent: 003135 -> 0FA4AF */}
              <linearGradient id="newta-grad-accent" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#AFDDE5" />
                <stop offset="60%" stopColor="#0FA4AF" />
                <stop offset="100%" stopColor="#024045" />
              </linearGradient>

              {/* Clean Sheen */}
              <linearGradient id="newta-sheen" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
                <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.1" />
                <stop offset="100%" stopColor="#003135" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Background pill badge for high contrast */}
            <rect width="120" height="120" rx="32" fill="#024045" stroke="#0FA4AF" strokeWidth="2.5" strokeOpacity="0.5" />

            {/* Modern "N" Geometric Ribbon using #AFDDE5 and #0FA4AF */}
            {/* Left Vertical Stem */}
            <path
              d="M32 30C32 25.58 35.58 22 40 22C44.42 22 48 25.58 48 30V90C48 94.42 44.42 98 40 98C35.58 98 32 94.42 32 90V30Z"
              fill="url(#newta-grad-primary)"
            />

            {/* Right Vertical Stem */}
            <path
              d="M72 30C72 25.58 75.58 22 80 22C84.42 22 88 25.58 88 30V90C88 94.42 84.42 98 80 98C75.58 98 72 94.42 72 90V30Z"
              fill="url(#newta-grad-primary)"
            />

            {/* Dynamic Diagonal Ribbon bridging left to right */}
            <path
              d="M40 24L88 88C90.5 91.5 89 96 85 97.5C83 98 80.5 97.5 79 95L31 31C28.5 27.5 30 23 34 21.5C36 21 38.5 21.5 40 24Z"
              fill="url(#newta-grad-accent)"
            />

            {/* Light Accent Node in AFDDE5 */}
            <circle cx="80" cy="30" r="5" fill="#AFDDE5" />
            <circle cx="40" cy="90" r="5" fill="#AFDDE5" />
          </svg>
        </div>
      )}

      {variant !== 'icon-only' && (
        <div className="flex flex-col">
          <div className={`font-bold tracking-tight leading-none ${textSizes[size]}`}>
            <span className="text-white font-extrabold tracking-tight">Newta</span>
            <span className="text-[#0FA4AF] font-black ml-1.5 drop-shadow-[0_0_14px_rgba(15,164,175,0.65)]">Tech</span>
          </div>
          {showSubtitle && (
            <span className="text-[10px] font-mono tracking-wider text-[#AFDDE5]/80 font-medium uppercase mt-0.5">
              powered by <span className="text-[#AFDDE5] font-bold lowercase">waiz/areeb</span>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
