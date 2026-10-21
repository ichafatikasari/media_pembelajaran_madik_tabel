import React, { useState } from 'react';
import { CLASS_CHALLENGES, calculateChallengePoints } from '../data/learningData';
import { SequenceStepItem, GroupScore } from '../types';
import { 
  Swords, ArrowRight, ArrowUp, ArrowDown, 
  RotateCcw, CheckCircle2, AlertCircle, Trophy, 
  Check, X, Sparkles, Lock
} from 'lucide-react';
import { GroupScoreBoard } from './GroupScoreBoard';
import { playClickSound, playSuccessSound, playErrorSound } from '../utils/sound';

interface TantanganKelasSectionProps {
  groupScores: GroupScore[];
  challengeSteps: Record<number, SequenceStepItem[]>;
  matchesState: Record<number, boolean[]>;
  onUpdateSteps: (groupId: number, steps: SequenceStepItem[]) => void;
  onClearMatches: (groupId: number) => void;
  onChallengeComplete: (groupId: number, attempts: number, points: number, matches: boolean[]) => void;
  onChallengeIncorrectAttempt: (groupId: number, attempts: number, matches: boolean[]) => void;
  onPromptResetChallenge: (groupId: number, groupName: string) => void;
  onPromptResetAllScores: () => void;
  onManualAdjustScore: (groupId: number, challengeDelta: number, quizDelta: number) => void;
  onNavigateToQuiz: () => void;
}

export const TantanganKelasSection: React.FC<TantanganKelasSectionProps> = ({
  groupScores,
  challengeSteps,
  matchesState,
  onUpdateSteps,
  onClearMatches,
  onChallengeComplete,
  onChallengeIncorrectAttempt,
  onPromptResetChallenge,
  onPromptResetAllScores,
  onManualAdjustScore,
  onNavigateToQuiz
}) => {
  // Active Challenge index: 0 = Baris 1, 1 = Baris 2, 2 = Baris 3, 3 = Baris 4
  const [activeChallengeIdx, setActiveChallengeIdx] = useState<number>(0);
  const currentChallenge = CLASS_CHALLENGES[activeChallengeIdx];
  const activeGroup = groupScores[activeChallengeIdx] || {
    id: activeChallengeIdx,
    name: currentChallenge.targetGroup,
    status: 'belum_mulai',
    attempts: 0,
    hasError: false,
    challengeScore: 0,
    quizScore: 0,
    totalScore: 0,
    challengeCompleted: false
  };

  // Confetti trigger state
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  const currentSteps = challengeSteps[activeChallengeIdx] || currentChallenge.steps;
  const currentMatches = matchesState[activeChallengeIdx] || [];
  const isCompleted = activeGroup.challengeCompleted;
  const hasEvaluated = currentMatches.length > 0 || isCompleted;

  // Move step up or down (Only if NOT locked / not completed)
  const moveStep = (fromIdx: number, toIdx: number) => {
    if (isCompleted) return;
    if (toIdx < 0 || toIdx >= currentSteps.length) return;

    playClickSound();

    const newSteps = [...currentSteps];
    const [moved] = newSteps.splice(fromIdx, 1);
    newSteps.splice(toIdx, 0, moved);

    // Update single source of truth in App.tsx
    onUpdateSteps(activeChallengeIdx, newSteps);
    onClearMatches(activeChallengeIdx);
  };

  // AUTOMATIC SCORING HANDLER
  const handleCheckAnswer = () => {
    if (isCompleted) return;

    const currentAttempts = activeGroup.attempts + 1;
    const matches = currentSteps.map((st, idx) => st.order === idx + 1);
    const isAllCorrect = matches.every(Boolean);

    if (isAllCorrect) {
      playSuccessSound();
      // 1. Calculate automatic points based on configured ATTEMPT_SCORES array
      const earnedPoints = calculateChallengePoints(currentAttempts);

      // 2. Trigger confetti effect
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

      // 3. Mark complete & automatically credit points to group in state
      onChallengeComplete(activeChallengeIdx, currentAttempts, earnedPoints, matches);
    } else {
      playErrorSound();
      // Record incorrect attempt, keep points at 0, mark hasError = true
      onChallengeIncorrectAttempt(activeChallengeIdx, currentAttempts, matches);
    }
  };

  // Count correct matches
  const correctCount = currentMatches.filter(Boolean).length;
  const totalCount = currentSteps.length;

  return (
    <div className="space-y-8 pb-16 relative">
      {/* Visual Confetti Animation Container */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-teal-900/20 backdrop-blur-xs transition-opacity" />
          <div className="text-center p-8 bg-white/95 rounded-3xl shadow-2xl border-4 border-emerald-400 z-10 animate-bounce">
            <span className="text-6xl block">🎉 🏆 🌟</span>
            <h2 className="text-3xl font-black text-slate-900 mt-2">
              SELESAI! {activeGroup.name} BENAR SEMUA!
            </h2>
            <p className="text-lg font-extrabold text-emerald-700 mt-1">
              +{activeGroup.challengeScore} Poin Otomatis Masuk ke Papan Skor!
            </p>
          </div>
        </div>
      )}

      {/* Top Title & Classroom Info */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-teal-700 uppercase tracking-wider mb-1">
            <Swords className="w-4 h-4 text-teal-600" />
            <span>Pertemuan 2 · Kompetisi Smart Board Kelas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Tantangan 1-4: Urutkan Langkah (Papan Skor Otomatis)
          </h1>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            Poin dihitung <span className="font-bold text-slate-800">secara otomatis oleh sistem</span> saat seluruh langkah tepat. 
            Semakin sedikit percobaan, semakin tinggi poin yang diraih!
          </p>
        </div>

        <button
          onClick={() => {
            playClickSound();
            onNavigateToQuiz();
          }}
          className="px-5 py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-all shrink-0"
        >
          <span>Lanjut ke Kuis Bersama</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Real-time Classroom Scoreboard Always Visible */}
      <GroupScoreBoard
        scores={groupScores}
        onPromptResetChallenge={onPromptResetChallenge}
        onPromptResetAllScores={onPromptResetAllScores}
        onManualAdjustScore={onManualAdjustScore}
      />

      {/* 4 Group Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {CLASS_CHALLENGES.map((ch, idx) => {
          const isCurrent = idx === activeChallengeIdx;
          const grp = groupScores[idx] || { challengeCompleted: false, challengeScore: 0, hasError: false, attempts: 0 };
          const isDone = grp.challengeCompleted;

          return (
            <button
              key={ch.id}
              onClick={() => {
                playClickSound();
                setActiveChallengeIdx(idx);
              }}
              className={`p-4 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                isCurrent
                  ? 'bg-sky-50 border-sky-500 ring-2 ring-sky-500/20 shadow-sm'
                  : isDone
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-black uppercase tracking-wider ${
                  isCurrent ? 'text-sky-800' : 'text-slate-500'
                }`}>
                  Tantangan 0{idx + 1}
                </span>
                {isDone ? (
                  <span className="text-xs font-black text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>+{grp.challengeScore} pt</span>
                  </span>
                ) : grp.hasError ? (
                  <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">
                    Ada yang keliru
                  </span>
                ) : null}
              </div>

              <div className="my-1.5">
                <span className="text-base font-black text-slate-900 block">
                  {ch.targetGroup}
                </span>
                <span className="text-xs text-slate-500 line-clamp-1 font-medium">
                  {ch.title.split(':')[1]?.trim() || ch.title}
                </span>
              </div>

              <div className="text-[11px] font-semibold pt-1 border-t border-slate-100 flex items-center justify-between">
                <span className={isDone ? 'text-emerald-700 font-bold' : isCurrent ? 'text-sky-700 font-bold' : 'text-slate-400'}>
                  {isDone ? 'Urutan Benar Semua ✓' : isCurrent ? 'Aktif di Smart Board' : 'Antrean Baris'}
                </span>
                {grp.attempts > 0 && (
                  <span className="text-[10px] text-slate-400">
                    {grp.attempts}x coba
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Challenge Workspace Card (Smart Board Responsive) */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-md space-y-6">
        {/* Active Challenge Header Banner */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-lg font-black text-xs uppercase tracking-wider">
                Giliran: {currentChallenge.targetGroup}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Terkait {currentChallenge.subMateriRef}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2">
              {currentChallenge.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed font-medium">
              {currentChallenge.description}
            </p>
          </div>

          {/* Teacher Reset This Challenge Button (Modal Prompt without window.confirm) */}
          <button
            onClick={() => {
              playClickSound();
              onPromptResetChallenge(activeChallengeIdx, activeGroup.name);
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-1.5 shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Tantangan Ini</span>
          </button>
        </div>

        {/* Live Status Bar */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
          <div className="flex items-center gap-3">
            <span className="text-slate-500 font-medium">Status Giliran:</span>
            {isCompleted ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-black text-xs bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>SELESAI (Terkunci)</span>
              </span>
            ) : activeGroup.attempts > 0 ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs bg-sky-100 text-sky-800 border border-sky-300">
                <span>Sedang Dikerjakan</span>
              </span>
            ) : (
              <span className="inline-flex items-center px-3 py-1 rounded-full font-semibold text-xs bg-slate-200 text-slate-700">
                Belum Mulai
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div>
              <span className="text-slate-400 mr-1.5">Percobaan:</span>
              <span className="font-black text-slate-900 tabular-nums">
                {activeGroup.attempts} kali
              </span>
            </div>
            <div>
              <span className="text-slate-400 mr-1.5">Poin Tantangan:</span>
              <span className={`font-black text-base tabular-nums ${
                isCompleted ? 'text-teal-600' : 'text-slate-400'
              }`}>
                {activeGroup.challengeScore} Poin
              </span>
            </div>
          </div>
        </div>

        {/* Step Cards (Locked when completed, Movable when not) */}
        <div className="space-y-3 max-w-2xl mx-auto">
          {currentSteps.map((st, idx) => {
            const isEvaluated = currentMatches.length > 0 || isCompleted;
            const isStepCorrect = isCompleted ? true : currentMatches[idx];

            let cardStyle = 'bg-slate-50 border-slate-200 hover:border-sky-300';
            if (isEvaluated) {
              cardStyle = isStepCorrect
                ? 'bg-emerald-50 border-2 border-emerald-400 text-emerald-950 shadow-xs'
                : 'bg-red-50 border-2 border-red-400 text-red-950 shadow-xs';
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
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-red-600 text-white shadow-xs'
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
                      Langkah Urutan {idx + 1}
                    </span>
                    <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                      {st.text}
                    </p>
                  </div>
                </div>

                {/* Move Controls (Disabled and Locked when Completed) */}
                <div className="flex items-center gap-1 shrink-0">
                  {isCompleted ? (
                    <div className="p-2 text-emerald-600" title="Terkunci: Sudah selesai">
                      <Lock className="w-4 h-4" />
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => moveStep(idx, idx - 1)}
                        disabled={idx === 0}
                        title="Naikkan ke atas"
                        className="p-2 sm:p-2.5 rounded-xl bg-white hover:bg-sky-50 border border-slate-200 text-slate-700 hover:text-sky-700 disabled:opacity-25 transition-colors shadow-xs cursor-pointer"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => moveStep(idx, idx + 1)}
                        disabled={idx === currentSteps.length - 1}
                        title="Turunkan ke bawah"
                        className="p-2 sm:p-2.5 rounded-xl bg-white hover:bg-sky-50 border border-slate-200 text-slate-700 hover:text-sky-700 disabled:opacity-25 transition-colors shadow-xs cursor-pointer"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Evaluation Banner (Real-time feedback) */}
        {hasEvaluated && (
          <div
            className={`p-5 rounded-2xl border max-w-2xl mx-auto space-y-2 animate-in fade-in ${
              isCompleted
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-red-50 border-red-300 text-red-950'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-black text-xs sm:text-sm uppercase tracking-wider">
                {isCompleted ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Luar Biasa, {currentChallenge.targetGroup}! Urutan Benar Semua!</span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <span>Ada Langkah yang Masih Keliru! ({correctCount} dari {totalCount} langkah sudah benar)</span>
                  </>
                )}
              </div>

              {isCompleted && (
                <span className="text-xs font-black text-emerald-800 bg-white px-3 py-1 rounded-xl border border-emerald-300 shadow-xs">
                  +{activeGroup.challengeScore} Poin Otomatis
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm font-semibold leading-relaxed">
              {isCompleted
                ? currentChallenge.explanation
                : 'Periksa kartu yang berwarna merah. Kelompok boleh berdiskusi lagi, menukar posisi langkah, dan menekan tombol "Periksa Jawaban" kembali!'}
            </p>
          </div>
        )}

        {/* Check & Navigate Buttons Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 border-t border-slate-100">
          {!isCompleted ? (
            <button
              onClick={handleCheckAnswer}
              className="w-full sm:w-auto px-7 py-3.5 bg-sky-600 hover:bg-sky-700 text-white rounded-2xl text-sm font-black transition-all shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] cursor-pointer"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>Periksa Jawaban ({currentChallenge.targetGroup})</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700 bg-emerald-50 px-4 py-2.5 rounded-2xl border border-emerald-200">
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Tantangan {currentChallenge.targetGroup} Selesai &amp; Terkunci!</span>
            </div>
          )}

          {activeChallengeIdx < CLASS_CHALLENGES.length - 1 ? (
            <button
              onClick={() => {
                playClickSound();
                setActiveChallengeIdx(activeChallengeIdx + 1);
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Lanjut ke Tantangan 0{activeChallengeIdx + 2} ({CLASS_CHALLENGES[activeChallengeIdx + 1].targetGroup})</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => {
                playClickSound();
                onNavigateToQuiz();
              }}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-400 text-xs sm:text-sm font-black transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Semua Baris Selesai! Mulai Kuis Bersama</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
