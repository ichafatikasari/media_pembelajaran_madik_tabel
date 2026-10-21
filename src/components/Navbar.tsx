import React, { useState } from 'react';
import { Volume2, VolumeX, Maximize, Minimize, Trophy, BookOpen, RotateCcw } from 'lucide-react';
import { soundFX } from '../utils/audio';

interface NavbarProps {
  isPlaying: boolean;
  onResetActiveTurn?: () => void;
  onOpenLeaderboard: () => void;
  onOpenCheatSheet: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  isPlaying,
  onResetActiveTurn,
  onOpenLeaderboard,
  onOpenCheatSheet
}) => {
  const [isMuted, setIsMuted] = useState(soundFX.getMuted());
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleSound = () => {
    const nextMuted = soundFX.toggleMute();
    setIsMuted(nextMuted);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <header className="w-full bg-slate-900/95 border-b border-slate-800 px-3 md:px-6 py-2.5 backdrop-blur-md sticky top-0 z-40 select-none">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2">
        {/* Brand */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-slate-950 text-lg md:text-xl shadow-lg border border-yellow-200">
            🐍
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-white text-base md:text-lg tracking-tight">
                PYTHON <span className="text-amber-400">SUBWAY</span>
              </span>
              <span className="text-[10px] uppercase font-extrabold bg-sky-500/20 text-sky-300 border border-sky-500/30 px-1.5 py-0.5 rounded">
                Kelas 10
              </span>
            </div>
            <div className="text-[10px] text-slate-400 hidden sm:block">
              Game Kuis Interaktif Smartboard & Laptop
            </div>
          </div>
        </div>

        {/* Right Action Tools */}
        <div className="flex items-center gap-1.5 md:gap-2">
          {/* Reset Active Turn (Only when playing, does NOT touch leaderboard) */}
          {isPlaying && onResetActiveTurn && (
            <button
              type="button"
              onClick={onResetActiveTurn}
              className="px-2.5 md:px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 border border-slate-700 active:scale-95 transition-all"
              title="Reset giliran siswa yang sedang aktif berlari (Papan peringkat tetap aman)"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Reset Giliran Ini</span>
            </button>
          )}

          {/* Quick Cheat Sheet */}
          <button
            type="button"
            onClick={onOpenCheatSheet}
            className="p-2 md:px-3 md:py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 border border-slate-700 active:scale-95 transition-all"
            title="Buka Materi Kilat"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden md:inline">Materi Kilat</span>
          </button>

          {/* Leaderboard button */}
          <button
            type="button"
            onClick={onOpenLeaderboard}
            className="p-2 md:px-3 md:py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 border border-slate-700 active:scale-95 transition-all"
            title="Lihat Papan Peringkat"
          >
            <Trophy className="w-4 h-4" />
            <span className="hidden md:inline">Peringkat</span>
          </button>

          {/* Audio Mute/Unmute */}
          <button
            type="button"
            onClick={toggleSound}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 active:scale-95 transition-all"
            title={isMuted ? 'Nyalakan Suara' : 'Bisukan Suara'}
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
          </button>

          {/* Fullscreen for Smartboard presentation */}
          <button
            type="button"
            onClick={toggleFullscreen}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 active:scale-95 transition-all"
            title="Layar Penuh (Smartboard)"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
