import React, { useState } from 'react';
import { GroupScore } from '../types';
import { 
  Trophy, RotateCcw, CheckCircle2, 
  AlertCircle, Edit3
} from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface GroupScoreBoardProps {
  scores: GroupScore[];
  onPromptResetChallenge: (groupId: number, groupName: string) => void;
  onPromptResetAllScores: () => void;
  onManualAdjustScore?: (groupId: number, challengeDelta: number, quizDelta: number) => void;
  compact?: boolean;
}

export const GroupScoreBoard: React.FC<GroupScoreBoardProps> = ({
  scores,
  onPromptResetChallenge,
  onPromptResetAllScores,
  onManualAdjustScore,
  compact = false
}) => {
  const [showManualEditor, setShowManualEditor] = useState<boolean>(false);

  // Sorting logic for Tantangan Urutkan Langkah:
  // 1. Primary: challengeScore descending
  // 2. Secondary (Tie-breaker): Fewer attempts ranks higher
  // 3. Tertiary: Group ID ascending
  const rankedScores = [...scores].sort((a, b) => {
    if (b.challengeScore !== a.challengeScore) {
      return b.challengeScore - a.challengeScore;
    }
    // Tie-breaker: if both completed, group with fewer attempts ranks higher
    if (a.challengeCompleted && b.challengeCompleted) {
      return a.attempts - b.attempts;
    }
    // If one is completed and one is not
    if (a.challengeCompleted && !b.challengeCompleted) return -1;
    if (!a.challengeCompleted && b.challengeCompleted) return 1;
    return a.id - b.id;
  });

  const getRankBadge = (rankIdx: number, score: number) => {
    if (score === 0 && rankedScores.every((s) => s.challengeScore === 0)) {
      return <span className="font-bold text-slate-400">#{rankIdx + 1}</span>;
    }
    switch (rankIdx) {
      case 0:
        return (
          <span className="inline-flex items-center gap-1 font-extrabold text-amber-500">
            <span className="text-xl">🥇</span>
            <span className="text-xs bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-400/40">Ke-1</span>
          </span>
        );
      case 1:
        return (
          <span className="inline-flex items-center gap-1 font-extrabold text-slate-300">
            <span className="text-xl">🥈</span>
            <span className="text-xs bg-slate-300/20 text-slate-200 px-2 py-0.5 rounded-full border border-slate-300/40">Ke-2</span>
          </span>
        );
      case 2:
        return (
          <span className="inline-flex items-center gap-1 font-extrabold text-amber-700">
            <span className="text-xl">🥉</span>
            <span className="text-xs bg-amber-700/20 text-amber-200 px-2 py-0.5 rounded-full border border-amber-700/40">Ke-3</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 font-bold text-slate-400">
            <span className="text-lg">🎖️</span>
            <span className="text-xs">Ke-4</span>
          </span>
        );
    }
  };

  // Compact Mode (for ticker in header bar)
  if (compact) {
    return (
      <div className="flex items-center gap-2 overflow-x-auto py-1 text-xs">
        {rankedScores.map((grp, rankIdx) => {
          return (
            <div
              key={grp.id}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border whitespace-nowrap transition-all ${
                rankIdx === 0 && grp.challengeScore > 0
                  ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold shadow-xs'
                  : 'bg-white border-slate-200 text-slate-700'
              }`}
            >
              <span className="font-bold">{grp.name}:</span>
              <span className="font-black tabular-nums text-teal-700">
                {grp.challengeScore} pt
              </span>
              <span className="text-[10px] text-slate-400">
                ({grp.attempts > 0 ? `${grp.attempts}x` : '0x'})
              </span>
              {grp.status === 'selesai' ? (
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Urutan benar semua" />
              ) : grp.hasError ? (
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title="Ada yang keliru" />
              ) : null}
            </div>
          );
        })}
      </div>
    );
  }

  // Full Smart Board Display Mode
  return (
    <div className="bg-slate-900 text-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-slate-800 space-y-5">
      {/* Smart Board Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-lg sm:text-xl tracking-tight text-white uppercase">
                Papan Skor Tantangan Kelompok
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase tracking-wider">
                Otomatis
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Peringkat &amp; poin khusus Tantangan Urutkan Langkah Baris 1 - 4 (Smart Board Mode)
            </p>
          </div>
        </div>

        {/* Teacher Global Control Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {onManualAdjustScore && (
            <button
              onClick={() => {
                playClickSound();
                setShowManualEditor(!showManualEditor);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-colors flex items-center gap-1.5 border border-slate-700 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span>{showManualEditor ? 'Tutup Koreksi' : 'Koreksi Poin Guru'}</span>
            </button>
          )}

          <button
            onClick={() => {
              playClickSound();
              onPromptResetAllScores();
            }}
            title="Reset Seluruh Papan Skor Tantangan"
            className="px-3 py-1.5 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800/60 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Skor Tantangan</span>
          </button>
        </div>
      </div>

      {/* Manual Point Correction Drawer (Optional for Teacher) */}
      {showManualEditor && onManualAdjustScore && (
        <div className="p-4 bg-slate-800/90 rounded-2xl border border-amber-500/40 space-y-3 animate-in fade-in">
          <div className="flex items-center justify-between text-xs text-amber-300 font-bold">
            <span>⚙️ Koreksi Poin Tantangan Guru (Jika ada situasi penyesuaian khusus):</span>
            <button
              onClick={() => {
                playClickSound();
                setShowManualEditor(false);
              }}
              className="text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {scores.map((grp) => (
              <div key={grp.id} className="p-3 bg-slate-900 rounded-xl border border-slate-700 text-xs space-y-2">
                <div className="font-extrabold text-white flex justify-between">
                  <span>{grp.name}</span>
                  <span className="text-amber-400">{grp.challengeScore} pt</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Poin Tantangan:</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => {
                        playClickSound();
                        onManualAdjustScore(grp.id, 10, 0);
                      }}
                      className="px-2.5 py-1 rounded bg-teal-800 hover:bg-teal-700 text-white font-bold cursor-pointer"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => {
                        playClickSound();
                        onManualAdjustScore(grp.id, -10, 0);
                      }}
                      className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                    >
                      -10
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Table for the 4 Groups (Extra Large Legibility for Smart Board) */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60 shadow-inner">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-800/80 text-slate-400 text-xs sm:text-sm font-black uppercase tracking-wider border-b border-slate-700/80">
              <th className="py-3.5 px-4 w-28 text-center">Peringkat</th>
              <th className="py-3.5 px-4">Kelompok</th>
              <th className="py-3.5 px-4">Status Tantangan</th>
              <th className="py-3.5 px-4 text-center">Percobaan</th>
              <th className="py-3.5 px-5 text-right font-black text-amber-400">Poin</th>
              <th className="py-3.5 px-3 text-center print:hidden">Aksi Guru</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70 text-sm sm:text-base font-semibold">
            {rankedScores.map((grp, rankIdx) => {
              const isLeader = rankIdx === 0 && grp.challengeScore > 0;

              return (
                <tr
                  key={grp.id}
                  className={`transition-colors ${
                    isLeader
                      ? 'bg-amber-500/10 hover:bg-amber-500/15'
                      : 'hover:bg-slate-800/40'
                  }`}
                >
                  {/* Peringkat */}
                  <td className="py-4 px-4 text-center">
                    {getRankBadge(rankIdx, grp.challengeScore)}
                  </td>

                  {/* Kelompok */}
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-base sm:text-lg">
                        {grp.name}
                      </span>
                      {isLeader && (
                        <span className="text-xs bg-amber-400 text-slate-950 font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                          Memimpin
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Status Tantangan + Lencana Error/Success */}
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {grp.status === 'selesai' ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Urutan benar semua</span>
                        </span>
                      ) : grp.status === 'sedang_dikerjakan' ? (
                        <>
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                            Sedang dikerjakan
                          </span>
                          {grp.hasError && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-red-500/20 text-red-300 border border-red-500/40 animate-pulse">
                              <AlertCircle className="w-3.5 h-3.5 text-red-400" />
                              <span>Ada yang keliru</span>
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                          Belum mulai
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Jumlah Percobaan */}
                  <td className="py-4 px-4 text-center tabular-nums">
                    {grp.attempts > 0 ? (
                      <span className="px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-black text-slate-200">
                        {grp.attempts}x
                      </span>
                    ) : (
                      <span className="text-slate-500 text-xs">-</span>
                    )}
                  </td>

                  {/* Poin Tantangan (Huruf Besar & Jelas) */}
                  <td className="py-4 px-5 text-right tabular-nums">
                    <span className="text-2xl sm:text-3xl font-black text-amber-400">
                      {grp.challengeScore}
                    </span>
                  </td>

                  {/* Aksi Guru (Reset Tantangan Ini) */}
                  <td className="py-4 px-3 text-center print:hidden">
                    <button
                      onClick={() => {
                        playClickSound();
                        onPromptResetChallenge(grp.id, grp.name);
                      }}
                      title={`Reset Tantangan ${grp.name}`}
                      className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-300 text-xs font-bold transition-colors border border-slate-700 cursor-pointer"
                    >
                      Reset
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Point Rules Reminder Footer Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-bold text-amber-400">Sistem Poin Tantangan Otomatis:</span>
          <span>Percobaan 1: <strong>100 pt</strong></span>
          <span>·</span>
          <span>Percobaan 2: <strong>80 pt</strong></span>
          <span>·</span>
          <span>Percobaan 3: <strong>60 pt</strong></span>
          <span>·</span>
          <span>Percobaan 4: <strong>40 pt</strong></span>
          <span>·</span>
          <span>Percobaan 5+: <strong>20 pt</strong></span>
        </div>
        <div className="text-slate-500 text-[11px]">
          *Kuis kelas bersenang-senang dan tidak memengaruhi poin baris
        </div>
      </div>
    </div>
  );
};
