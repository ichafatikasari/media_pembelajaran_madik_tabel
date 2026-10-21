import React from 'react';
import { Delete, CornerDownLeft, Space } from 'lucide-react';

interface VirtualKeyboardProps {
  onKeyPress: (char: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onSubmit: () => void;
  onClose?: () => void;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  onKeyPress,
  onBackspace,
  onClear,
  onSubmit,
  onClose
}) => {
  const row1 = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
  const row2 = ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'];
  const row3 = ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'];
  const row4 = ['Z', 'X', 'C', 'V', 'B', 'N', 'M', '-', '.'];

  return (
    <div className="bg-slate-900/95 border-2 border-amber-400/40 rounded-2xl p-3 md:p-4 shadow-2xl backdrop-blur-md max-w-2xl mx-auto select-none">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-700">
        <span className="text-xs md:text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          Papan Ketik Layar Sentuh Smartboard
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-1 rounded-md"
          >
            Tutup
          </button>
        )}
      </div>

      {/* Number Row */}
      <div className="flex justify-center gap-1 md:gap-1.5 mb-1.5">
        {row1.map((char) => (
          <button
            key={char}
            type="button"
            onClick={() => onKeyPress(char)}
            className="flex-1 h-11 md:h-12 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-slate-200 active:scale-95 font-bold rounded-lg text-base md:text-lg transition-all shadow border border-slate-700 active:bg-amber-400"
          >
            {char}
          </button>
        ))}
      </div>

      {/* Row 2 (Q-P) */}
      <div className="flex justify-center gap-1 md:gap-1.5 mb-1.5">
        {row2.map((char) => (
          <button
            key={char}
            type="button"
            onClick={() => onKeyPress(char)}
            className="flex-1 h-11 md:h-12 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white active:scale-95 font-bold rounded-lg text-base md:text-lg transition-all shadow border border-slate-700 active:bg-amber-400"
          >
            {char}
          </button>
        ))}
      </div>

      {/* Row 3 (A-L) */}
      <div className="flex justify-center gap-1 md:gap-1.5 mb-1.5 px-3 md:px-5">
        {row3.map((char) => (
          <button
            key={char}
            type="button"
            onClick={() => onKeyPress(char)}
            className="flex-1 h-11 md:h-12 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white active:scale-95 font-bold rounded-lg text-base md:text-lg transition-all shadow border border-slate-700 active:bg-amber-400"
          >
            {char}
          </button>
        ))}
      </div>

      {/* Row 4 (Z-M + special) */}
      <div className="flex justify-center gap-1 md:gap-1.5 mb-2">
        <button
          type="button"
          onClick={onClear}
          className="px-2.5 h-11 md:h-12 bg-rose-950/80 hover:bg-rose-600 text-rose-200 font-semibold text-xs md:text-sm rounded-lg border border-rose-800 active:scale-95 transition-all"
        >
          Bersihkan
        </button>
        {row4.map((char) => (
          <button
            key={char}
            type="button"
            onClick={() => onKeyPress(char)}
            className="flex-1 h-11 md:h-12 bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-white active:scale-95 font-bold rounded-lg text-base md:text-lg transition-all shadow border border-slate-700 active:bg-amber-400"
          >
            {char}
          </button>
        ))}
        <button
          type="button"
          onClick={onBackspace}
          className="px-3 h-11 md:h-12 bg-slate-700 hover:bg-slate-600 active:bg-amber-500 text-white font-bold rounded-lg border border-slate-600 flex items-center justify-center active:scale-95 transition-all"
          title="Hapus"
        >
          <Delete className="w-5 h-5" />
        </button>
      </div>

      {/* Bottom Actions Row: Spasi & Mulai */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onKeyPress(' ')}
          className="flex-grow h-12 md:h-13 bg-slate-800 hover:bg-slate-700 active:bg-amber-400 text-slate-200 font-bold rounded-xl border border-slate-700 flex items-center justify-center gap-2 text-sm md:text-base active:scale-98 transition-all"
        >
          <Space className="w-5 h-5 text-amber-400" />
          <span>SPASI</span>
        </button>
        <button
          type="button"
          onClick={onSubmit}
          className="px-6 md:px-8 h-12 md:h-13 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-2 text-base md:text-lg active:scale-95 transition-all"
        >
          <span>Lanjut</span>
          <CornerDownLeft className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
