import React from 'react';
import { ArrowLeft, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react';

interface TouchControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onJump: () => void;
  onSlide: () => void;
  disabled?: boolean;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onMoveLeft,
  onMoveRight,
  onJump,
  onSlide,
  disabled = false
}) => {
  // Prevent context menu and accidental zoom on repeated rapid taps
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent, action: () => void) => {
    if (disabled) return;
    e.preventDefault();
    action();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-2 py-2 select-none pointer-events-auto">
      {/* Smartboard notice badge */}
      <div className="flex items-center justify-between mb-1.5 px-2">
        <span className="text-[11px] md:text-xs font-bold text-amber-300/90 uppercase tracking-widest flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
          KONTROL SENTUH SMARTBOARD & LAPTOP
        </span>
        <span className="text-[11px] md:text-xs text-slate-400 font-medium">
          (Bisa sentuh tombol di bawah atau geser/swipe layar)
        </span>
      </div>

      {/* Button Layout: Large, Finger-Friendly Targets for Smartboard */}
      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {/* Button: KIRI */}
        <button
          type="button"
          onTouchStart={(e) => handleTouchStart(e, onMoveLeft)}
          onMouseDown={(e) => handleTouchStart(e, onMoveLeft)}
          disabled={disabled}
          className="h-16 md:h-20 bg-gradient-to-b from-sky-600 to-sky-800 hover:from-sky-500 hover:to-sky-700 active:from-sky-400 active:to-sky-600 active:scale-95 text-white font-extrabold rounded-2xl shadow-xl border-2 border-sky-400/50 flex flex-col items-center justify-center gap-0.5 md:gap-1 transition-all touch-manipulation cursor-pointer group"
        >
          <ArrowLeft className="w-7 h-7 md:w-8 md:h-8 text-amber-300 group-hover:scale-110 transition-transform" />
          <span className="text-xs md:text-sm tracking-wide">KIRI</span>
        </button>

        {/* Button: LOMPAT (Accent) */}
        <button
          type="button"
          onTouchStart={(e) => handleTouchStart(e, onJump)}
          onMouseDown={(e) => handleTouchStart(e, onJump)}
          disabled={disabled}
          className="h-16 md:h-20 bg-gradient-to-b from-amber-500 to-amber-700 hover:from-amber-400 hover:to-amber-600 active:from-amber-300 active:to-amber-500 active:scale-95 text-slate-950 font-black rounded-2xl shadow-xl border-2 border-yellow-300 flex flex-col items-center justify-center gap-0.5 md:gap-1 transition-all touch-manipulation cursor-pointer group"
        >
          <ArrowUp className="w-7 h-7 md:w-8 md:h-8 text-slate-950 group-hover:-translate-y-1 transition-transform" />
          <span className="text-xs md:text-sm tracking-wider font-extrabold">LOMPAT</span>
        </button>

        {/* Button: SLIDE / TUNDUK */}
        <button
          type="button"
          onTouchStart={(e) => handleTouchStart(e, onSlide)}
          onMouseDown={(e) => handleTouchStart(e, onSlide)}
          disabled={disabled}
          className="h-16 md:h-20 bg-gradient-to-b from-indigo-600 to-indigo-800 hover:from-indigo-500 hover:to-indigo-700 active:from-indigo-400 active:to-indigo-600 active:scale-95 text-white font-extrabold rounded-2xl shadow-xl border-2 border-indigo-400/50 flex flex-col items-center justify-center gap-0.5 md:gap-1 transition-all touch-manipulation cursor-pointer group"
        >
          <ArrowDown className="w-7 h-7 md:w-8 md:h-8 text-amber-300 group-hover:translate-y-1 transition-transform" />
          <span className="text-xs md:text-sm tracking-wide">SLIDE</span>
        </button>

        {/* Button: KANAN */}
        <button
          type="button"
          onTouchStart={(e) => handleTouchStart(e, onMoveRight)}
          onMouseDown={(e) => handleTouchStart(e, onMoveRight)}
          disabled={disabled}
          className="h-16 md:h-20 bg-gradient-to-b from-sky-600 to-sky-800 hover:from-sky-500 hover:to-sky-700 active:from-sky-400 active:to-sky-600 active:scale-95 text-white font-extrabold rounded-2xl shadow-xl border-2 border-sky-400/50 flex flex-col items-center justify-center gap-0.5 md:gap-1 transition-all touch-manipulation cursor-pointer group"
        >
          <ArrowRight className="w-7 h-7 md:w-8 md:h-8 text-amber-300 group-hover:scale-110 transition-transform" />
          <span className="text-xs md:text-sm tracking-wide">KANAN</span>
        </button>
      </div>
    </div>
  );
};
