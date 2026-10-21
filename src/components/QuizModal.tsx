import React, { useState } from 'react';
import { Question } from '../types/game';
import { soundFX } from '../utils/audio';
import confetti from 'canvas-confetti';
import { CheckCircle2, XCircle, Award, Sparkles, BookOpen, ArrowRight, User } from 'lucide-react';

interface QuizModalProps {
  question: Question;
  studentName: string;
  distance: number;
  coins: number;
  onFinishRound: (isCorrect: boolean, totalScore: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  question,
  studentName,
  distance,
  coins,
  onFinishRound
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);

  const optionLetters = ['A', 'B', 'C', 'D'];

  const handleSelectOption = (index: number) => {
    if (hasAnswered) return;
    setSelectedOption(index);
    setHasAnswered(true);

    const isCorrect = index === question.correctIndex;

    if (isCorrect) {
      soundFX.playCorrect();
      // Launch celebratory confetti for the classroom smartboard
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    } else {
      soundFX.playWrong();
    }
  };

  const isCorrect = selectedOption === question.correctIndex;
  const distancePoints = distance * 2;
  const coinPoints = coins * 15;
  const quizPoints = isCorrect ? 150 : 0;
  const totalScore = distancePoints + coinPoints + quizPoints;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-3xl bg-slate-900 border-4 border-amber-400/80 rounded-3xl shadow-2xl p-4 md:p-8 text-white max-h-[92vh] overflow-y-auto">
        
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 mb-4 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="w-6 h-6" />
            </span>
            <div>
              <div className="text-[11px] md:text-xs font-bold text-amber-400 uppercase tracking-widest">
                Tantangan Subway Surfers: 1 Siswa = 1 Soal
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
                Kuis Kilat Teori Python
              </h2>
            </div>
          </div>

          {/* Student Info Badge */}
          <div className="flex items-center gap-2 bg-slate-800/90 px-3.5 py-1.5 rounded-full border border-sky-400/40">
            <User className="w-4 h-4 text-sky-400" />
            <span className="text-xs md:text-sm font-bold text-slate-200">
              Siswa: <span className="text-amber-300 font-extrabold">{studentName || 'Siswa Kelas 10'}</span>
            </span>
          </div>
        </div>

        {/* Question Topic Badge & Stats bar */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs md:text-sm font-extrabold bg-sky-500/20 text-sky-300 border border-sky-500/40">
            <BookOpen className="w-4 h-4" />
            Materi: {question.topicLabel}
          </span>
          <div className="text-xs md:text-sm text-slate-300 font-medium flex items-center gap-3">
            <span>🏃 Jarak: <strong className="text-white">{distance}m</strong></span>
            <span>🪙 Koin: <strong className="text-amber-400">{coins}</strong></span>
          </div>
        </div>

        {/* Question Text */}
        <div className="mb-4">
          <h3 className="text-lg md:text-2xl font-bold text-slate-100 leading-snug">
            {question.question}
          </h3>

          {/* Code Snippet Box (if applicable) */}
          {question.codeSnippet && (
            <div className="mt-3 p-3 md:p-4 rounded-xl bg-slate-950 border border-slate-700 font-mono text-sm md:text-base text-emerald-400 overflow-x-auto shadow-inner">
              <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 font-sans">
                Contoh Kode Python:
              </div>
              <pre className="whitespace-pre">{question.codeSnippet}</pre>
            </div>
          )}
        </div>

        {/* 4 Options (A, B, C, D) - Giant Tap Targets for Smartboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {question.options.map((optionText, idx) => {
            let btnStyle = "bg-slate-800/90 hover:bg-slate-750 border-slate-700 text-slate-100";
            let badgeStyle = "bg-slate-700 text-amber-300 border-slate-600";

            if (hasAnswered) {
              if (idx === question.correctIndex) {
                // Correct answer glows green
                btnStyle = "bg-emerald-950/90 border-emerald-400 text-emerald-100 ring-2 ring-emerald-400/80 shadow-lg";
                badgeStyle = "bg-emerald-500 text-slate-950 border-emerald-400";
              } else if (idx === selectedOption) {
                // Wrong chosen answer turns red
                btnStyle = "bg-rose-950/90 border-rose-500 text-rose-100 ring-2 ring-rose-500/80";
                badgeStyle = "bg-rose-500 text-white border-rose-400";
              } else {
                btnStyle = "bg-slate-800/50 border-slate-700/60 text-slate-400 opacity-60";
              }
            }

            return (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectOption(idx)}
                disabled={hasAnswered}
                className={`min-h-[64px] md:min-h-[76px] p-3 md:p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-3 active:scale-98 shadow-md touch-manipulation cursor-pointer ${btnStyle}`}
              >
                <span className={`w-9 h-9 md:w-11 md:h-11 rounded-xl font-black text-base md:text-lg flex items-center justify-center shrink-0 border ${badgeStyle}`}>
                  {optionLetters[idx]}
                </span>
                <span className="text-sm md:text-base font-semibold leading-snug flex-1">
                  {optionText}
                </span>
                {hasAnswered && idx === question.correctIndex && (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 animate-bounce" />
                )}
                {hasAnswered && idx === selectedOption && idx !== question.correctIndex && (
                  <XCircle className="w-6 h-6 text-rose-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Post-Answer Educational Explanation & Score Breakdown */}
        {hasAnswered && (
          <div className="space-y-4 animate-fade-in">
            {/* Result Notification Banner */}
            <div className={`p-4 rounded-2xl border-2 flex items-start gap-3.5 ${
              isCorrect 
                ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200' 
                : 'bg-rose-950/60 border-rose-500/60 text-rose-200'
            }`}>
              {isCorrect ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-7 h-7 text-rose-400 shrink-0 mt-0.5" />
              )}
              <div className="space-y-1">
                <div className="font-extrabold text-base md:text-lg">
                  {isCorrect ? '🎉 LUAR BIASA! Jawaban Tepat (+150 Poin Kuis)' : '💡 Belum Tepat, Mari Kita Pelajari Bersama!'}
                </div>
                <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
                  <strong className="text-amber-300">Penjelasan Guru:</strong> {question.explanation}
                </p>
              </div>
            </div>

            {/* Score Calculation Box */}
            <div className="bg-slate-950/90 border border-slate-700 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-4 text-xs md:text-sm text-slate-300">
                <div>
                  <span className="text-slate-400 block">Lari:</span>
                  <span className="font-bold text-white">{distance}m × 2 = +{distancePoints}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Koin:</span>
                  <span className="font-bold text-amber-400">{coins} × 15 = +{coinPoints}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Kuis:</span>
                  <span className={`font-bold ${isCorrect ? 'text-emerald-400' : 'text-slate-400'}`}>
                    +{quizPoints}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-amber-400" />
                <div className="text-right">
                  <span className="text-[10px] text-amber-300 uppercase tracking-widest block font-bold">TOTAL SKOR</span>
                  <span className="text-2xl md:text-3xl font-black text-amber-400">{totalScore}</span>
                </div>
              </div>
            </div>

            {/* Next Student Button */}
            <button
              type="button"
              onClick={() => onFinishRound(isCorrect, totalScore)}
              className="w-full h-14 md:h-16 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black rounded-2xl text-base md:text-xl shadow-xl flex items-center justify-center gap-2 active:scale-98 transition-all cursor-pointer border-2 border-yellow-200"
            >
              <span>Simpan Skor & Giliran Siswa Berikutnya</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
