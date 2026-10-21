import React, { useState } from 'react';
import { VirtualKeyboard } from './VirtualKeyboard';
import { 
  Play, Trophy, BookOpen, Keyboard, Smartphone, 
  Sparkles, User, AlertCircle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight
} from 'lucide-react';

interface StartScreenProps {
  studentName: string;
  setStudentName: (name: string) => void;
  onStartGame: () => void;
  onOpenLeaderboard: () => void;
  onOpenCheatSheet: () => void;
  totalStudentsRecorded: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  studentName,
  setStudentName,
  onStartGame,
  onOpenLeaderboard,
  onOpenCheatSheet,
  totalStudentsRecorded
}) => {
  const [showVirtualKeyboard, setShowVirtualKeyboard] = useState<boolean>(false);
  const [nameError, setNameError] = useState<string>('');

  const handleStart = () => {
    if (!studentName.trim()) {
      setNameError('Nama siswa harus diisi sebelum memulai permainan!');
      return;
    }
    setNameError('');
    onStartGame();
  };

  // Virtual Keyboard Handlers
  const handleVirtualKeyPress = (char: string) => {
    setNameError('');
    setStudentName(studentName + char);
  };

  const handleVirtualBackspace = () => {
    setStudentName(studentName.slice(0, -1));
  };

  const handleVirtualClear = () => {
    setStudentName('');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-3 md:p-6 select-none animate-fade-in">
      {/* Hero Badge & Title */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/40 text-amber-300 text-xs md:text-sm font-extrabold mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>INFORMATIKA KELAS 10 SMA/MA • 1 SISWA = 1 SOAL</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-none mb-2">
          PYTHON <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">SUBWAY QUIZ</span>
        </h1>

        <p className="text-xs md:text-base text-slate-300 max-w-2xl mx-auto">
          Lari di jalur subway, hindari rintangan, kumpulkan token, dan selesaikan tantangan soal teori dasar Python!
        </p>
      </div>

      {/* Main Form Box: Manual Name Input (Smartboard & Laptop Friendly) */}
      <div className="bg-slate-900/90 border-2 border-slate-700/80 rounded-3xl p-5 md:p-8 shadow-2xl mb-6 backdrop-blur-md">
        <div className="flex items-center justify-between gap-2 mb-3">
          <label htmlFor="student-name-input" className="text-sm md:text-base font-extrabold text-white flex items-center gap-2">
            <User className="w-5 h-5 text-amber-400" />
            <span>Masukkan Nama Siswa yang Maju:</span>
          </label>

          {/* Toggle Virtual Keyboard Button */}
          <button
            type="button"
            onClick={() => setShowVirtualKeyboard(!showVirtualKeyboard)}
            className={`px-3 py-1.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-1.5 transition-all border ${
              showVirtualKeyboard 
                ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md' 
                : 'bg-slate-800 text-amber-300 hover:bg-slate-700 border-slate-600'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            <span>{showVirtualKeyboard ? 'Tutup Papan Ketik Layar' : 'Papan Ketik Layar (Smartboard)'}</span>
          </button>
        </div>

        {/* Input Field (Works with Physical Keyboard and On-Screen Keyboard) */}
        <div className="relative mb-2">
          <input
            id="student-name-input"
            type="text"
            value={studentName}
            onChange={(e) => {
              setNameError('');
              setStudentName(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleStart();
            }}
            placeholder="Ketik nama siswa di sini (contoh: Aditya X-A)..."
            autoComplete="off"
            className="w-full h-14 md:h-16 px-4 md:px-5 bg-slate-950 border-2 border-slate-600 focus:border-amber-400 rounded-2xl text-white text-lg md:text-2xl font-bold placeholder:text-slate-500 placeholder:font-normal outline-none transition-all shadow-inner"
          />

          {studentName && (
            <button
              type="button"
              onClick={() => setStudentName('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg font-bold"
            >
              Hapus
            </button>
          )}
        </div>

        {nameError && (
          <div className="flex items-center gap-2 text-rose-400 text-xs md:text-sm font-semibold mb-3">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{nameError}</span>
          </div>
        )}

        {/* Virtual On-Screen Keyboard for Smartboard touch */}
        {showVirtualKeyboard && (
          <div className="mt-4 pt-4 border-t border-slate-800">
            <VirtualKeyboard
              onKeyPress={handleVirtualKeyPress}
              onBackspace={handleVirtualBackspace}
              onClear={handleVirtualClear}
              onSubmit={handleStart}
              onClose={() => setShowVirtualKeyboard(false)}
            />
          </div>
        )}

        {/* Big Play Button */}
        <div className="mt-5">
          <button
            type="button"
            onClick={handleStart}
            className="w-full h-16 md:h-20 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xl md:text-2xl rounded-2xl shadow-xl flex items-center justify-center gap-3 active:scale-98 transition-all cursor-pointer border-2 border-yellow-200"
          >
            <Play className="w-7 h-7 md:w-8 md:h-8 fill-slate-950" />
            <span>MULAI BERLARI & TANTANGAN KUIS</span>
          </button>
        </div>
      </div>

      {/* Dual Controls Guide (Laptop & Smartboard) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Laptop Controls Guide */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 font-bold text-amber-300 text-sm md:text-base mb-2">
            <Keyboard className="w-5 h-5 text-amber-400" />
            <span>Kontrol Laptop (Kibor)</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs md:text-sm text-slate-300">
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
              <span className="p-1 bg-slate-800 rounded text-amber-300 font-mono font-bold flex items-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <span>Pindah Jalur Kiri / Kanan</span>
            </div>
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2">
              <span className="p-1 bg-slate-800 rounded text-amber-300 font-mono font-bold flex items-center gap-1">
                <ArrowUp className="w-3.5 h-3.5" /> Space
              </span>
              <span>Lompat Rintangan</span>
            </div>
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex items-center gap-2 col-span-2">
              <span className="p-1 bg-slate-800 rounded text-amber-300 font-mono font-bold flex items-center gap-1">
                <ArrowDown className="w-3.5 h-3.5" /> S
              </span>
              <span>Slide / Tunduk di Bawah Palang</span>
            </div>
          </div>
        </div>

        {/* Smartboard Controls Guide */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-2 font-bold text-sky-300 text-sm md:text-base mb-2">
            <Smartphone className="w-5 h-5 text-sky-400" />
            <span>Kontrol Layar Sentuh / Smartboard</span>
          </div>
          <div className="space-y-2 text-xs md:text-sm text-slate-300">
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              <strong className="text-sky-300">Tombol On-Screen Besar:</strong> Tersedia tombol [KIRI], [LOMPAT], [SLIDE], [KANAN] berukuran besar di bawah layar game.
            </div>
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              <strong className="text-sky-300">Gesture Swipe (Usap Layar):</strong> Usap jari ke kiri/kanan untuk berpindah, usap ke atas untuk lompat, usap ke bawah untuk slide.
            </div>
          </div>
        </div>
      </div>

      {/* Quick Navigation: Materi Kilat & Leaderboard */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={onOpenCheatSheet}
          className="px-5 py-3 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-sm md:text-base rounded-2xl border border-slate-700 flex items-center gap-2 active:scale-95 transition-all shadow"
        >
          <BookOpen className="w-5 h-5 text-sky-400" />
          <span>Buka Materi Kilat Python</span>
        </button>

        <button
          type="button"
          onClick={onOpenLeaderboard}
          className="px-5 py-3 bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-sm md:text-base rounded-2xl border border-slate-700 flex items-center gap-2 active:scale-95 transition-all shadow"
        >
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>Lihat Papan Peringkat ({totalStudentsRecorded} Siswa)</span>
        </button>
      </div>
    </div>
  );
};
