import React from 'react';
import { TabId, GroupScore } from '../types';
import { LEARNING_OBJECTIVES, APP_INFO } from '../data/learningData';
import { 
  ArrowRight, CheckSquare, CheckCircle2, 
  Users, Laptop, Monitor
} from 'lucide-react';
import { GroupScoreBoard } from './GroupScoreBoard';
import { playClickSound } from '../utils/sound';

interface HomeSectionProps {
  setActiveTab: (tab: TabId) => void;
  groupScores: GroupScore[];
  onPromptResetChallenge: (groupId: number, groupName: string) => void;
  onPromptResetAllScores: () => void;
  onManualAdjustScore: (groupId: number, challengeDelta: number, quizDelta: number) => void;
}

export const HomeSection: React.FC<HomeSectionProps> = ({
  setActiveTab,
  groupScores,
  onPromptResetChallenge,
  onPromptResetAllScores,
  onManualAdjustScore
}) => {
  const handleGoTo = (tabId: TabId) => {
    playClickSound();
    setActiveTab(tabId);
  };

  return (
    <div className="space-y-12 pb-16">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-900 via-slate-900 to-teal-950 text-white p-8 sm:p-12 shadow-xl border border-sky-800/40">
        <div className="absolute top-0 right-0 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-teal-300">
            <span className="px-3 py-1 bg-sky-800/80 rounded-full border border-sky-600/50">
              {APP_INFO.subject} · {APP_INFO.grade}
            </span>
            <span className="text-slate-400">·</span>
            <span>Usia: {APP_INFO.targetAge}</span>
            <span className="text-slate-400">·</span>
            <span>Versi: Office 2007 - 365</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
            Membuat &amp; Mengatur Tabel di Microsoft Word
          </h1>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl">
            Media pembelajaran interaktif Informatika untuk siswa kelas 10 SMA/MA. 
            Pelajari konsep dan langkah teknisnya, tiru contoh di Microsoft Word asli laptopmu, 
            lalu berkompetisi antar-baris tempat duduk di Smart Board!
          </p>

          {/* Context of Use Notice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-3">
              <Laptop className="w-5 h-5 text-teal-300 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-teal-200 block">Pertemuan 1: Di Laptop Masing-Masing</span>
                <span className="text-slate-300">Buka Microsoft Word asli dan langsung praktikkan contoh Materi 1-7 serta latihan tiru tabel.</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-start gap-3">
              <Monitor className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
              <div className="text-xs">
                <span className="font-bold text-amber-200 block">Pertemuan 2: Smart Board Kelas</span>
                <span className="text-slate-300">Tantangan kelompok 4 Baris tempat duduk dan kuis bersama dengan timer di layar depan.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DUA TOMBOL BESAR (PERTEMUAN 1 & PERTEMUAN 2) */}
      <section className="space-y-4">
        <div className="text-center space-y-1">
          <span className="text-xs font-bold text-teal-700 uppercase tracking-widest">
            Pilihan Alur Belajar
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pilih Pertemuan Pembelajaran
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Klik tombol di bawah sesuai agenda jam pelajaran hari ini:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tombol Besar 1: Pertemuan 1 */}
          <div
            onClick={() => handleGoTo('materi')}
            className="group cursor-pointer p-8 rounded-3xl bg-gradient-to-br from-white to-sky-50 border-2 border-sky-300 hover:border-sky-500 hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-200/40 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-full bg-sky-600 text-white font-extrabold text-xs uppercase tracking-wider">
                  Pertemuan 1
                </span>
                <span className="text-xs font-semibold text-slate-500">Mandiri di Laptop</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 group-hover:text-sky-700 transition-colors">
                  Pertemuan 1: Belajar &amp; Praktik
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Pelajari 7 Materi utama (pengertian tabel, menyisipkan, lebar kolom, merge cells, perataan teks, hapus &amp; sisip baris/kolom) serta selesaikan misi <span className="font-bold text-slate-800">"Tiru Tabel Ini!"</span> di Microsoft Word asli.
                </p>
              </div>

              {/* Sub-features list */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>Materi 1 sampai Materi 7 dengan panduan resmi Word</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>Latihan Terbimbing: Format Absen Siswa Kelas IPA</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-sky-600" />
                  <span>Checklist mandiri &amp; kolom catatan kesulitan</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-sky-200 flex items-center justify-between text-sky-700 font-extrabold text-sm group-hover:translate-x-1 transition-transform">
              <span>Masuk ke Pertemuan 1 Sekarang</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>

          {/* Tombol Besar 2: Pertemuan 2 */}
          <div
            onClick={() => handleGoTo('ulasan')}
            className="group cursor-pointer p-8 rounded-3xl bg-gradient-to-br from-white to-teal-50 border-2 border-teal-300 hover:border-teal-500 hover:shadow-xl transition-all relative overflow-hidden flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-200/40 rounded-full blur-2xl group-hover:scale-125 transition-transform" />
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="px-3.5 py-1 rounded-full bg-teal-600 text-white font-extrabold text-xs uppercase tracking-wider">
                  Pertemuan 2
                </span>
                <span className="text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 font-bold">
                  Smart Board Kelas
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-900 group-hover:text-teal-700 transition-colors">
                  Pertemuan 2: Tantangan &amp; Kuis
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Pemanasan 5 Kartu Balik Ulasan Kilat, demonstrasi Tantangan Contoh oleh Guru, kompetisi urut langkah 4 Kelompok Baris, dan Kuis Bersama 10 soal di Smart Board!
                </p>
              </div>

              {/* Sub-features list */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Ulasan Kilat (5 Flip Card Interaktif)</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Tantangan Contoh Guru (Model 4 Tahap + Timer)</span>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Tantangan 1-4 untuk Baris 1, 2, 3, 4 + Kuis 10 Soal</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-teal-200 flex items-center justify-between text-teal-700 font-extrabold text-sm group-hover:translate-x-1 transition-transform">
              <span>Masuk ke Pertemuan 2 Sekarang</span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </section>

      {/* Papan Skor 4 Kelompok (Smart Board) */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold text-slate-900">
              Klasemen Sementara 4 Baris Tempat Duduk
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-medium">Bisa diatur guru di smart board</span>
        </div>

        <GroupScoreBoard
          scores={groupScores}
          onPromptResetChallenge={onPromptResetChallenge}
          onPromptResetAllScores={onPromptResetAllScores}
          onManualAdjustScore={onManualAdjustScore}
        />
      </section>

      {/* Tujuan Pembelajaran */}
      <section className="space-y-4">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
            Tujuan Pembelajaran Khusus
          </h3>
          <p className="text-xs sm:text-sm text-slate-500">
            Kompetensi yang akan dikuasai setelah menyelesaikan media ini:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {LEARNING_OBJECTIVES.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-start gap-3"
            >
              <div className="w-7 h-7 rounded-xl bg-teal-50 text-teal-800 font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                0{item.id}
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-xs sm:text-sm leading-snug">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
