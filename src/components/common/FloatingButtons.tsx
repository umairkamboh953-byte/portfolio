import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bot, Sparkles, MessageCircle } from 'lucide-react';
import { PlatformSettings } from '../../types/index.js';

interface FloatingButtonsProps {
  settings?: PlatformSettings;
}

export const FloatingButtons: React.FC<FloatingButtonsProps> = ({ settings }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Normalize WhatsApp Phone Number
  const rawNumber = settings?.whatsappNumber || '+92 300 1234567';
  const cleanPhone = rawNumber.replace(/[^0-9]/g, '');

  const defaultMessage = encodeURIComponent(
    'Hello Smart Developer! I am browsing your portfolio and would like to inquire about purchasing a ready-made website or hiring you for a custom project.'
  );

  const whatsappUrl = `https://wa.me/${cleanPhone}?text=${defaultMessage}`;

  const handleOpenBot = () => {
    if (typeof window === 'undefined') return;
    const bp = (window as any).botpress;
    if (bp && typeof bp.open === 'function') {
      bp.open();
      return;
    }
    if (bp && typeof bp.toggle === 'function') {
      bp.toggle();
      return;
    }
    // Attempt fallback click on native trigger
    const nativeBtn = document.querySelector(
      'bp-webchat, #bp-webchat, .bpFab, [data-name="fab"], button[aria-label="Open Webchat"]'
    ) as HTMLElement | null;
    if (nativeBtn) {
      nativeBtn.click();
    }
  };

  if (!mounted || typeof document === 'undefined') {
    return null;
  }

  // Render via portal directly to document.body to ensure it stays fixed and always in front
  return createPortal(
    <>
      {/* 1. FLOATING WHATSAPP BUTTON (BOTTOM-LEFT) */}
      <div
        id="smart-developer-floating-whatsapp"
        className="fixed z-[2147483647] flex items-center justify-center pointer-events-auto"
        style={{
          position: 'fixed',
          bottom: 'max(16px, env(safe-area-inset-bottom, 16px))',
          left: 'max(16px, env(safe-area-inset-left, 16px))',
          zIndex: 2147483647,
          WebkitTransform: 'translateZ(0)',
          transform: 'translateZ(0)'
        }}
      >
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          id="floating-whatsapp-btn"
          aria-label="Chat with Smart Developer on WhatsApp"
          title={`Chat on WhatsApp (${rawNumber})`}
          className="group relative flex items-center justify-center rounded-full bg-[#25D366] hover:bg-[#20ba59] active:scale-95 text-white shadow-[0_4px_22px_rgba(37,211,102,0.65)] hover:shadow-[0_6px_30px_rgba(37,211,102,0.85)] transition-all duration-300 border-2 border-white/90 cursor-pointer w-12 h-12 sm:w-13 sm:h-13"
        >
          {/* Ambient Pulsing Radar Ring */}
          <span
            className="absolute inset-0 rounded-full bg-[#25D366] opacity-70 animate-ping pointer-events-none"
            style={{ animationDuration: '2.5s' }}
          />

          {/* Online Status Green Dot with Crisp Border */}
          <span
            className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-300 border-2 border-white shadow-sm"
            title="Online Now"
          />

          {/* Official WhatsApp SVG Icon */}
          <svg
            className="w-6 h-6 fill-white drop-shadow-sm relative z-10 transition-transform duration-200 group-hover:scale-110"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill="#FFFFFF"
              d="M12.04 2C6.49 2 1.98 6.51 1.98 12.06c0 1.77.46 3.5 1.34 5.02L2 22l5.06-1.33c1.47.8 3.12 1.23 4.98 1.23 5.55 0 10.06-4.51 10.06-10.06C22.1 6.51 17.59 2 12.04 2zm0 18.25c-1.57 0-3.1-.42-4.44-1.22l-.32-.19-3.3.86.88-3.21-.21-.33a8.214 8.214 0 0 1-1.26-4.36c0-4.55 3.7-8.25 8.25-8.25 4.55 0 8.25 3.7 8.25 8.25s-3.7 8.25-8.25 8.25z"
            />
            <path
              fill="#FFFFFF"
              d="M17.472 14.382c-.301-.15-1.777-.877-2.053-.977-.275-.1-.475-.15-.675.15-.2.3-.775.977-.95 1.177-.175.2-.35.225-.65.075-.3-.15-1.267-.467-2.413-1.488-.893-.796-1.496-1.78-1.67-2.08-.175-.3-.018-.463.132-.612.135-.135.301-.35.451-.525.15-.175.2-.3.3-.5.1-.2.05-.375-.025-.525-.075-.15-.675-1.625-.925-2.225-.243-.585-.49-.506-.675-.515-.175-.009-.375-.01-.575-.01s-.525.075-.8.375c-.275.3-1.05 1.025-1.05 2.5 0 1.475 1.075 2.9 1.225 3.1.15.2 2.112 3.225 5.118 4.525 2.99 1.294 2.99.862 3.525.812.535-.05 1.725-.705 1.97-1.385.245-.68.245-1.265.17-1.385-.075-.12-.275-.195-.575-.345z"
            />
          </svg>

          {/* Desktop Hover Tooltip */}
          <span className="hidden md:group-hover:inline-flex absolute left-full ml-3 px-3 py-1 bg-[#0A0D15]/95 text-white text-xs font-semibold rounded-lg shadow-xl border border-white/10 whitespace-nowrap items-center gap-1.5 pointer-events-none transition-opacity duration-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
            WhatsApp: {rawNumber}
          </span>
        </a>
      </div>

      {/* 2. FLOATING AI BOT BUTTON (BOTTOM-RIGHT) */}
      <div
        id="smart-developer-floating-bot"
        className="fixed z-[2147483647] flex items-center justify-center pointer-events-auto"
        style={{
          position: 'fixed',
          bottom: 'max(16px, env(safe-area-inset-bottom, 16px))',
          right: 'max(16px, env(safe-area-inset-right, 16px))',
          zIndex: 2147483647,
          WebkitTransform: 'translateZ(0)',
          transform: 'translateZ(0)'
        }}
      >
        <button
          onClick={handleOpenBot}
          id="floating-ai-bot-btn"
          aria-label="Chat with AI Website Sales Assistant"
          title="Chat with AI Sales Assistant"
          className="group relative flex items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 active:scale-95 text-white shadow-[0_4px_22px_rgba(6,182,212,0.65)] hover:shadow-[0_6px_30px_rgba(6,182,212,0.9)] transition-all duration-300 border-2 border-white/90 cursor-pointer w-12 h-12 sm:w-13 sm:h-13"
        >
          {/* Ambient Pulsing Radar Ring */}
          <span
            className="absolute inset-0 rounded-full bg-cyan-400 opacity-60 animate-ping pointer-events-none"
            style={{ animationDuration: '3s' }}
          />

          {/* Online Status Cyan Sparkle Dot */}
          <span
            className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-cyan-300 border-2 border-white shadow-sm flex items-center justify-center"
            title="AI Online"
          >
            <span className="w-1 h-1 rounded-full bg-blue-900" />
          </span>

          {/* Bot Icon */}
          <Bot className="w-6 h-6 text-white drop-shadow-sm relative z-10 transition-transform duration-200 group-hover:scale-110" />

          {/* Desktop Hover Tooltip */}
          <span className="hidden md:group-hover:inline-flex absolute right-full mr-3 px-3 py-1 bg-[#0A0D15]/95 text-white text-xs font-semibold rounded-lg shadow-xl border border-white/10 whitespace-nowrap items-center gap-1.5 pointer-events-none transition-opacity duration-200">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            AI Sales Assistant — Instant Advice
          </span>
        </button>
      </div>
    </>,
    document.body
  );
};
