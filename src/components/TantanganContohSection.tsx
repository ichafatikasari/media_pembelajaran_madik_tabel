import React, { useState, useEffect } from 'react';
import { DEMO_CHALLENGE } from '../data/learningData';
import { SequenceStepItem } from '../types';
import { 
  HelpCircle, ArrowRight, ArrowUp, ArrowDown, 
  RotateCcw, CheckCircle2, AlertCircle, Clock, 
  Users, Play, Pause, Sparkles, MoveVertical, Check, X
} from 'lucide-react';

interface TantanganContohSectionProps {
  onStartRealChallenge: () => void;
}

export const TantanganContohSection: React.FC<TantanganContohSectionProps> = ({
  onStartRealChallenge
}) => {
  // 4 Guided Stages (1: Baca, 2: Diskusi, 3: Susun, 4: Periksa)
  const [activeStage, setActiveStage] = useState<1 | 2 | 3 | 4>(1);

  // Scrambled steps state
  const [steps, setSteps] = useState<SequenceStepItem[]>(() => {
    // Deliberately scrambled initially
    return [
      { id: 'demo-3', order: 3, text: 'Klik tombol Delete pada pita ribbon' },
      { id: 'demo-1', order: 1, text: 'Klik di dalam salah satu sel pada baris yang ingin dihapus' },
      { id: 'demo-4', order: 4, text: 'Pilih perintah Delete Rows' },
      { id: 'demo-2', order: 2, text: 'Klik tab Layout pada Table Tools di bagian atas' }
    ];
  });

  // Validation state
  const [checkResult, setCheckResult] = useState<{
    tested: boolean;
    isCorrect: boolean;
    results: boolean[];
  }>({
    tested: false,
    isCorrect: false,
    results: []
  });

  // Discussion Timer (1 minute = 60 seconds)
  const [timerSeconds, setTimerSeconds] = useState<number>(60);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setIsTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timerSeconds]);

  const moveStep = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= steps.length) return;
    const newSteps = [...steps];
    const [moved] = newSteps.splice(fromIdx, 1);
    newSteps.splice(toIdx, 0, moved);
    setSteps(newSteps);
    setCheckResult({ tested: false, isCorrect: false, results: [] });
  };

  const handleCheckOrder = () => {
    const results = steps.map((s, idx) => s.order === idx + 1);
    const isAllCorrect = results.every(Boolean);

    setCheckResult({
      tested: true,
      isCorrect: isAllCorrect,
      results
    });
  };

  // Helper to demo a wrong attempt for students to see red state
  const handleShowWrongExample = () => {
    // Shuffle into a wrong state
    setSteps([
      { id: 'demo-4', order: 4, text: 'Pilih perintah Delete Rows' },
      { id: 'demo-1', order: 1, text: 'Klik di dalam salah satu sel pada baris yang ingin dihapus' },
      { id: 'demo-3', order: 3, text: 'Klik tombol Delete pada pita ribbon' },
      { id: 'demo-2', order: 2, text: 'Klik tab Layout pada Table Tools di bagian atas' }
    ]);
    const results = [false, false, false, false];
    setCheckResult({
      tested: true,
      isCorrect: false,
      results
    });
  };

  // Helper to solve correctly for quick demo
  const handleSolveCorrectly = () => {
    setSteps([...DEMO_CHALLENGE.correctSteps]);
    setCheckResult({
      tested: true,
      isCorrect: true,
      results: [true, true, true, true]
    });
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Title & Banner: Clearly Labeled as "CONTOH" */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider mb-1">
            <span className="px-3 py-1 bg-amber-500 text-white rounded-md font-black">
              CONTOH (DEMO GURU)
            </span>
            <span className="text-slate-400">·</span>
            <span className="text-slate-500">TIDAK MENGHITUNG POIN</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Tantangan Contoh: "Cara Bermain di Smart Board"
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Guru menggunakan bagian ini untuk mendemokan 4 tahap bermain kepada seluruh kelas sebelum 
            kelompok Baris 1, 2, 3, dan 4 memulai tantangan sebenarnya.
          </p>
        </div>

        <button
          onClick={onStartRealChallenge}
          className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs sm:text-sm shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          <span>Mulai Tantangan Sebenarnya ➔</span>
        </button>
      </div>

      {/* Mode Tuntunan: 4 Tahap Berurutan (Stepper) */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
              PANDUAN TUNTUNAN BERMAIN (SMART BOARD)
            </span>
            <h2 className="text-lg sm:text-xl font-black text-white mt-0.5">
              4 Tahap Mengerjakan Tantangan Urut Langkah
            </h2>
          </div>

          {/* Step Selector */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {[
              { num: 1, label: 'Tahap 1: Baca' },
              { num: 2, label: 'Tahap 2: Diskusi' },
              { num: 3, label: 'Tahap 3: Susun' },
              { num: 4, label: 'Tahap 4: Periksa' }
            ].map((st) => (
              <button
                key={st.num}
                onClick={() => setActiveStage(st.num as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                  activeStage === st.num
                    ? 'bg-amber-400 text-slate-950 font-black shadow-xs'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Active Stage Explanation Banner */}
        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-black text-base shrink-0">
            {activeStage}
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-black text-amber-300">
              {activeStage === 1 && 'Tahap 1 "Baca Bersama": Semua langkah tampil acak di layar.'}
              {activeStage === 2 && 'Tahap 2 "Diskusi Kelompok": Kelompok berdiskusi menentukan urutan (Saran waktu 1 menit).'}
              {activeStage === 3 && 'Tahap 3 "Susun di Smart Board": Satu perwakilan maju dan menyeret/menekan tombol panah ke urutan benar.'}
              {activeStage === 4 && 'Tahap 4 "Periksa & Evaluasi": Tekan tombol Periksa Jawaban untuk melihat warna hijau/merah.'}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              {activeStage === 1 && 'Seluruh siswa di kelas membaca teks pada setiap kartu langkah yang posisinya masih acak.'}
              {activeStage === 2 && 'Setiap kelompok di barisnya masing-masing bermusyawarah cepat untuk menyepakati urutan nomor 1 sampai selesai.'}
              {activeStage === 3 && 'Gunakan tombol panah Naik (▲) dan Turun (▼) atau geser kartu di layar sentuh Smart Board.'}
              {activeStage === 4 && 'Langkah yang posisinya benar berwarna HIJAU, yang masih keliru berwarna MERAH. Jika salah, kelompok boleh coba lagi!'}
            </p>
          </div>
        </div>

        {/* Discussion Timer Widget (Especially in Tahap 2) */}
        {activeStage === 2 && (
          <div className="p-4 rounded-2xl bg-slate-800 border border-amber-500/40 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-amber-400" />
              <div>
                <span className="text-xs font-bold text-amber-300 block">Timer Saran Waktu Diskusi Baris</span>
                <span className="text-xs text-slate-400">1 Menit untuk berdiskusi sebelum perwakilan maju</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-amber-400 font-mono tabular-nums">
                00:{timerSeconds < 10 ? `0${timerSeconds}` : timerSeconds}
              </span>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="p-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold transition-colors"
              >
                {isTimerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => {
                  setIsTimerRunning(false);
                  setTimerSeconds(60);
                }}
                className="p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-300 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Stage Navigation Button */}
        <div className="flex justify-end">
          {activeStage < 4 ? (
            <button
              onClick={() => setActiveStage((activeStage + 1) as any)}
              className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <span>Lanjut ke Tahap {activeStage + 1}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={() => setActiveStage(1)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors"
            >
              Ulangi Tahap 1
            </button>
          )}
        </div>
      </div>

      {/* Main Interactive Demo Challenge Workspace */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-extrabold text-amber-800 uppercase tracking-wider mb-1">
              <span>Topik Demonstrasi Guru</span>
              <span>·</span>
              <span>Materi 6: Menghapus Baris</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              {DEMO_CHALLENGE.topic}
            </h2>
          </div>

          {/* Quick Demo Controls for Teacher */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleShowWrongExample}
              className="px-3 py-1.5 rounded-xl border border-red-200 bg-red-50 text-red-700 font-bold text-xs hover:bg-red-100 transition-colors"
            >
              Contohkan Hasil Salah (Merah)
            </button>
            <button
              onClick={handleSolveCorrectly}
              className="px-3 py-1.5 rounded-xl border border-teal-200 bg-teal-50 text-teal-800 font-bold text-xs hover:bg-teal-100 transition-colors"
            >
              Contohkan Jawaban Benar (Hijau)
            </button>
          </div>
        </div>

        {/* Cards to Reorder */}
        <div className="space-y-3 max-w-2xl mx-auto">
          {steps.map((st, idx) => {
            const isEvaluated = checkResult.tested;
            const isStepCorrect = checkResult.results[idx];

            let cardStyle = 'bg-slate-50 border-slate-200 hover:border-sky-300';
            if (isEvaluated) {
              cardStyle = isStepCorrect
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950 shadow-xs'
                : 'bg-red-50 border-red-400 text-red-950 shadow-xs animate-shake';
            }

            return (
              <div
                key={st.id}
                className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-3 shadow-xs ${cardStyle}`}
              >
                <div className="flex items-center gap-3.5">
                  <div
                    className={`w-9 h-9 rounded-xl font-black text-xs flex items-center justify-center shrink-0 ${
                      isEvaluated
                        ? isStepCorrect
                          ? 'bg-emerald-600 text-white'
                          : 'bg-red-600 text-white'
                        : 'bg-sky-100 text-sky-900'
                    }`}
                  >
                    {isEvaluated ? (
                      isStepCorrect ? <Check className="w-5 h-5 stroke-[3]" /> : <X className="w-5 h-5 stroke-[3]" />
                    ) : (
                      `#${idx + 1}`
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">
                      Posisi Urutan {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                      {st.text}
                    </p>
                  </div>
                </div>

                {/* Move Controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => moveStep(idx, idx - 1)}
                    disabled={idx === 0}
                    title="Naikkan ke atas"
                    className="p-2 rounded-xl bg-white hover:bg-sky-50 border border-slate-200 text-slate-700 hover:text-sky-700 disabled:opacity-30 transition-colors shadow-xs"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => moveStep(idx, idx + 1)}
                    disabled={idx === steps.length - 1}
                    title="Turunkan ke bawah"
                    className="p-2 rounded-xl bg-white hover:bg-sky-50 border border-slate-200 text-slate-700 hover:text-sky-700 disabled:opacity-30 transition-colors shadow-xs"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Result & Explanation Feedback Box */}
        {checkResult.tested && (
          <div
            className={`p-5 rounded-2xl border max-w-2xl mx-auto space-y-2 animate-in fade-in ${
              checkResult.isCorrect
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-red-50 border-red-300 text-red-950'
            }`}
          >
            <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider">
              {checkResult.isCorrect ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Hebat! Urutan Sangat Tepat!</span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>Ada Langkah yang Masih Keliru (Kartu Merah)!</span>
                </>
              )}
            </div>
            <p className="text-xs sm:text-sm font-medium leading-relaxed">
              {checkResult.isCorrect
                ? 'Semua langkah sudah tersusun secara logis: Klik sel acuan > Buka tab Layout > Klik Delete > Pilih Delete Rows.'
                : 'Perhatikan kartu merah. Pindahkan langkah tersebut ke atas atau ke bawah lalu tekan "Periksa Jawaban" lagi!'}
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
          <button
            onClick={handleCheckOrder}
            className="w-full sm:w-auto px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-xs sm:text-sm font-black transition-all shadow-md flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Periksa Jawaban (Smart Board)</span>
          </button>

          <button
            onClick={() => {
              setSteps([
                { id: 'demo-3', order: 3, text: 'Klik tombol Delete pada pita ribbon' },
                { id: 'demo-1', order: 1, text: 'Klik di dalam salah satu sel pada baris yang ingin dihapus' },
                { id: 'demo-4', order: 4, text: 'Pilih perintah Delete Rows' },
                { id: 'demo-2', order: 2, text: 'Klik tab Layout pada Table Tools di bagian atas' }
              ]);
              setCheckResult({ tested: false, isCorrect: false, results: [] });
            }}
            className="w-full sm:w-auto px-4 py-3 rounded-2xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center justify-center gap-1.5"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Acak Ulang Langkah</span>
          </button>
        </div>

        {/* Aturan Main Tantangan */}
        <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-2 text-xs">
          <span className="font-bold text-slate-800 uppercase tracking-wider block">
            📋 Aturan Main Kompetisi Kelompok (Tantangan 1-4):
          </span>
          <ul className="space-y-1.5 text-slate-600 list-disc pl-5">
            {DEMO_CHALLENGE.rules.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
