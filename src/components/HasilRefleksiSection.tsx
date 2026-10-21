import React, { useEffect } from 'react';
import { GroupScore, AbsenQuizResult } from '../types';
import { MATERIALS, QUIZ_QUESTIONS } from '../data/learningData';
import { 
  Trophy, BookOpen, Printer, RotateCcw, 
  ArrowRight, CheckCircle2, Sparkles, 
  AlertTriangle, HeartHandshake, Check, Award
} from 'lucide-react';
import { playClickSound, playCelebrationSound } from '../utils/sound';

interface HasilRefleksiSectionProps {
  groupScores: GroupScore[];
  quizResults: AbsenQuizResult[];
  onPromptResetChallengeScores: () => void;
  onNavigateToMateri: (materiId: string) => void;
}

export const HasilRefleksiSection: React.FC<HasilRefleksiSectionProps> = ({
  groupScores,
  quizResults,
  onPromptResetChallengeScores,
  onNavigateToMateri
}) => {
  // Play celebration fanfare when viewing results
  useEffect(() => {
    playCelebrationSound();
  }, []);

  // Compute Champion and Juara Bersama for Tantangan Urutkan Langkah
  const maxChallengeScore = Math.max(...groupScores.map((g) => g.challengeScore));
  const topGroups = groupScores.filter((g) => g.challengeScore === maxChallengeScore);
  const minAttempts = Math.min(...topGroups.map((g) => g.attempts));
  const champions = maxChallengeScore > 0 
    ? topGroups.filter((g) => g.attempts === minAttempts) 
    : [];
  const isSharedChampion = champions.length > 1;

  // Sort groups for podium: 1. ChallengeScore desc, 2. Attempts asc, 3. ID asc
  const sortedGroups = [...groupScores].sort((a, b) => {
    if (b.challengeScore !== a.challengeScore) return b.challengeScore - a.challengeScore;
    if (a.challengeCompleted && b.challengeCompleted) return a.attempts - b.attempts;
    return a.id - b.id;
  });

  // Calculate Quiz Statistics (Whole Class)
  const totalQuestions = QUIZ_QUESTIONS.length;
  const answeredCount = quizResults.length;
  const correctCount = quizResults.filter((r) => r.isCorrect).length;

  // Analyze incorrect questions to determine remedial review materials
  const wrongQuestions = quizResults.filter((r) => !r.isCorrect);
  const mistakesByMateri: Record<string, { count: number; questionIds: number[] }> = {};

  wrongQuestions.forEach((r) => {
    if (!mistakesByMateri[r.materiRef]) {
      mistakesByMateri[r.materiRef] = { count: 0, questionIds: [] };
    }
    mistakesByMateri[r.materiRef].count += 1;
    mistakesByMateri[r.materiRef].questionIds.push(r.questionId);
  });

  const materialsWithMistakes = Object.entries(mistakesByMateri)
    .sort(([, a], [, b]) => b.count - a.count)
    .map(([materiRef, data]) => {
      const mat = MATERIALS.find((m) => `Materi ${m.number}` === materiRef || m.title.includes(materiRef));
      return {
        materiRef,
        count: data.count,
        materiId: mat?.id || 'materi-1',
        title: mat ? `${mat.title}` : materiRef,
        subtitle: mat?.subtitle || 'Perlu pemantapan langkah di Microsoft Word'
      };
    });

  const handlePrint = () => {
    playClickSound();
    window.print();
  };

  return (
    <div className="space-y-8 pb-20">
      {/* SPANDUK PENUTUP MERIAH DENGAN KONFETI */}
      <div className="bg-gradient-to-r from-teal-600 via-sky-600 to-indigo-600 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-teal-500/30 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-xs text-white text-xs font-black uppercase tracking-widest border border-white/30">
            <Sparkles className="w-4 h-4 fill-current text-amber-300" />
            <span>Refleksi &amp; Apresiasi Kelas 10</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight drop-shadow-sm">
            Luar biasa, semua sudah berani maju!
          </h1>
          <p className="text-sm sm:text-base text-sky-100 max-w-2xl leading-relaxed font-medium">
            Apresiasi setinggi-tingginya untuk seluruh siswa yang telah berpartisipasi aktif, 
            berani menjawab di depan kelas, dan saling mendukung saat kuis dan tantangan tabel Word.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 shrink-0 print:hidden">
          <button
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold transition-colors flex items-center gap-2 border border-white/40 cursor-pointer shadow-sm"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Rekap</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              onPromptResetChallengeScores();
            }}
            className="px-4 py-2.5 rounded-xl bg-red-950/40 hover:bg-red-950/60 text-red-200 border border-red-400/50 text-xs font-bold transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset Skor Tantangan</span>
          </button>
        </div>
      </div>

      {/* RINGKASAN KELAS KUIS: "Jumlah soal terjawab benar: X dari 10" */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase tracking-wider text-teal-700 bg-teal-50 px-3 py-1 rounded-full border border-teal-200 inline-block">
              📊 Evaluasi Kuis Kelas
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Ringkasan Capaian Bersama Seluruh Kelas
            </h2>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 font-bold block uppercase tracking-wider">
              Total Soal Kuis
            </span>
            <span className="text-sm font-extrabold text-slate-700">
              {answeredCount} dari {totalQuestions} Soal Dimainkan
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Main Stat Card: Jumlah soal terjawab benar */}
          <div className="md:col-span-1 p-6 rounded-3xl bg-gradient-to-br from-teal-50 via-sky-50 to-emerald-50 border-2 border-teal-200 text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
              Jumlah Soal Terjawab Benar
            </span>
            <div className="text-5xl sm:text-6xl font-black text-teal-700 font-mono tabular-nums py-1">
              {correctCount} <span className="text-2xl sm:text-3xl font-bold text-teal-900">/ {totalQuestions}</span>
            </div>
            <p className="text-xs text-teal-800 font-bold">
              {correctCount === 10
                ? '⭐ Nilai Sempurna! 100% Benar!'
                : `${Math.round((correctCount / totalQuestions) * 100)}% Penguasaan Materi`}
            </p>
          </div>

          {/* Qualitative Progress Assessment */}
          <div className="md:col-span-2 space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Tingkat Ketepatan Kelas:</span>
                <span className="font-mono text-teal-700">{Math.round((correctCount / totalQuestions) * 100)}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden border border-slate-200">
                <div
                  className="bg-gradient-to-r from-teal-500 to-emerald-500 h-full rounded-full transition-all duration-1000"
                  style={{ width: `${(correctCount / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {correctCount === 10 && (
                <div className="flex items-center gap-2.5 text-emerald-800 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Sempurna! Seluruh 10 soal dijawab dengan benar. Pemahaman kelas 10 tentang tabel Microsoft Word sudah sangat matang!</span>
                </div>
              )}
              {correctCount >= 7 && correctCount < 10 && (
                <div className="flex items-center gap-2.5 text-teal-800 font-bold">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                  <span>Hebat Sekali! Mayoritas konsep (penyisipan, perataan, merge cells) sudah dipahami dengan baik oleh kelas.</span>
                </div>
              )}
              {correctCount >= 5 && correctCount < 7 && (
                <div className="flex items-center gap-2.5 text-sky-800 font-bold">
                  <Sparkles className="w-5 h-5 text-sky-600 shrink-0" />
                  <span>Bagus! Siswa telah memahami dasar-dasar tabel. Silakan ulas materi di bawah untuk memantapkan fitur lanjutan.</span>
                </div>
              )}
              {correctCount < 5 && (
                <div className="flex items-center gap-2.5 text-amber-800 font-bold">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <span>Tetap semangat! Jadikan hasil ini sebagai panduan belajar untuk mengulas kembali materi yang direkomendasikan.</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PODIUM JUARA KELOMPOK BARIS: HANYA UNTUK TANTANGAN URUTKAN LANGKAH */}
      <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-teal-950 text-white rounded-3xl p-6 sm:p-12 shadow-2xl border border-slate-800 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />

        {/* Podium Header */}
        <div className="text-center space-y-3 relative z-10">
          <span className="text-xs font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-4 py-1.5 rounded-full border border-amber-400/20 inline-block">
            🏆 HASIL AKHIR TANTANGAN URUTKAN LANGKAH (BARIS 1 - 4)
          </span>

          {maxChallengeScore > 0 ? (
            isSharedChampion ? (
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-5xl font-black text-amber-400">
                  Selamat untuk Juara Bersama:{' '}
                  <span className="text-white">
                    {champions.map((c) => c.name).join(' & ')}!
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                  Kelompok-kelompok ini sama-sama meraih nilai tertinggi{' '}
                  <strong className="text-amber-300 font-extrabold">{maxChallengeScore} Poin</strong>{' '}
                  hanya dalam {minAttempts} kali percobaan!
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <h2 className="text-3xl sm:text-5xl font-black text-amber-400">
                  Selamat untuk <span className="text-white">{champions[0]?.name}!</span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
                  Meraih posisi teratas tantangan urut langkah dengan nilai{' '}
                  <strong className="text-amber-300 font-extrabold">{maxChallengeScore} Poin</strong>{' '}
                  dalam {minAttempts} kali percobaan!
                </p>
              </div>
            )
          ) : (
            <div className="space-y-2">
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Klasemen Baris Tempat Duduk
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Peringkat dihitung otomatis berdasarkan poin dan sedikitnya jumlah percobaan.
              </p>
            </div>
          )}
        </div>

        {/* 4 Baris Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 relative z-10">
          {sortedGroups.map((grp) => {
            const isWinner = champions.some((c) => c.id === grp.id);
            const isLeader = sortedGroups[0].id === grp.id && grp.challengeScore > 0;

            let badgeIcon = '🎖️';
            let rankText = 'Peserta';

            if (isWinner) {
              badgeIcon = '🥇';
              rankText = isSharedChampion ? 'JUARA 1 (BERSAMA)' : 'JUARA 1';
            } else if (sortedGroups[1]?.id === grp.id && grp.challengeScore > 0) {
              badgeIcon = '🥈';
              rankText = 'JUARA 2';
            } else if (sortedGroups[2]?.id === grp.id && grp.challengeScore > 0) {
              badgeIcon = '🥉';
              rankText = 'JUARA 3';
            } else if (sortedGroups[3]?.id === grp.id && grp.challengeScore > 0) {
              badgeIcon = '🎖️';
              rankText = 'JUARA 4';
            }

            return (
              <div
                key={grp.name}
                className={`p-5 sm:p-6 rounded-3xl border transition-all text-center flex flex-col justify-between ${
                  isWinner
                    ? 'bg-gradient-to-b from-amber-500/25 to-slate-900/90 border-amber-400 shadow-2xl ring-2 ring-amber-400/40 -translate-y-2'
                    : 'bg-slate-800/80 border-slate-700/80'
                }`}
              >
                <div className="space-y-1">
                  <div className="text-4xl mb-1">{badgeIcon}</div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full inline-block ${
                    isWinner ? 'bg-amber-400 text-slate-950 font-black' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {rankText}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-white mt-2">
                    {grp.name}
                  </h3>
                </div>

                <div className="my-5 space-y-1">
                  <div className="text-4xl sm:text-5xl font-black text-amber-400 font-mono tabular-nums">
                    {grp.challengeScore}
                  </div>
                  <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                    Poin Tantangan
                  </div>
                </div>

                <div className="text-[11px] text-slate-300 pt-3 border-t border-slate-700/60 font-semibold">
                  {grp.attempts > 0 ? `${grp.attempts}x percobaan` : 'Belum selesai'}
                  {grp.status === 'selesai' && (
                    <span className="block text-emerald-400 text-[10px] font-extrabold mt-0.5">
                      ✓ Urutan Benar
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* REKOMENDASI MATERI YANG PERLU DIULAS (REMEDIAL KELAS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Box Rekomendasi Khusus */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Rekomendasi Materi yang Perlu Diulas Guru:</span>
          </div>
          <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
            Fokus Penguatan Konsep Word
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
            Berdasarkan rekaman soal kuis yang dijawab keliru oleh siswa, berikut adalah topik-topik yang disarankan untuk diperjelas kembali di depan kelas:
          </p>

          <div className="space-y-2.5 pt-1">
            {materialsWithMistakes.length > 0 ? (
              materialsWithMistakes.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    playClickSound();
                    onNavigateToMateri(item.materiId);
                  }}
                  className="w-full text-left p-3.5 rounded-2xl bg-amber-50/70 hover:bg-amber-100 border border-amber-200 transition-all flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 rounded-xl bg-amber-200 text-amber-900 font-black text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <span className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-amber-900 block">
                        {item.title}
                      </span>
                      <span className="text-[11px] text-red-600 font-bold block">
                        {item.count}x jawaban keliru pada sesi kuis
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-bold text-amber-800 shrink-0">
                    <span>Buka</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              ))
            ) : (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm font-bold flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-black text-emerald-950">Luar Biasa! Tidak Ada Materi Remedial</div>
                  <div className="text-xs font-medium text-emerald-800 mt-0.5">
                    Semua soal yang dimainkan terjawab dengan tepat, atau belum ada soal kuis yang dijawab keliru.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Akses Cepat Materi 1 - 7 */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-800 uppercase tracking-wider">
              <BookOpen className="w-4 h-4 text-sky-600" />
              <span>Akses Cepat Materi 1 - 7:</span>
            </div>
            <span className="text-[11px] text-slate-400 font-semibold">Tiru di Word Laptop</span>
          </div>

          <div className="space-y-2">
            {MATERIALS.map((m) => (
              <button
                key={m.id}
                onClick={() => {
                  playClickSound();
                  onNavigateToMateri(m.id);
                }}
                className="w-full text-left p-2.5 rounded-2xl bg-slate-50 hover:bg-sky-50 border border-slate-200 hover:border-sky-300 transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-800 font-black text-[10px] flex items-center justify-center shrink-0">
                    {m.number}
                  </span>
                  <span className="text-xs font-bold text-slate-800 group-hover:text-sky-900 truncate max-w-[280px]">
                    {m.title}
                  </span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
