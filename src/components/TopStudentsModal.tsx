import React from 'react';
import { Student } from '../types';
import { Trophy, X, Star, Award, Users } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface TopStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
}

export const TopStudentsModal: React.FC<TopStudentsModalProps> = ({
  isOpen,
  onClose,
  students
}) => {
  if (!isOpen) return null;

  // Sort students by score descending, then by correctCount descending
  const sortedStudents = [...students].sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (b.correctCount !== a.correctCount) return b.correctCount - a.correctCount;
    return a.name.localeCompare(b.name);
  });

  const top5 = sortedStudents.slice(0, 5);

  const getRankBadge = (idx: number) => {
    switch (idx) {
      case 0:
        return <span className="text-2xl" title="Peringkat 1">🥇</span>;
      case 1:
        return <span className="text-2xl" title="Peringkat 2">🥈</span>;
      case 2:
        return <span className="text-2xl" title="Peringkat 3">🥉</span>;
      default:
        return <span className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 font-black text-xs flex items-center justify-center">#{idx + 1}</span>;
    }
  };

  const getGroupBadge = (groupId: number) => {
    const colors = [
      'bg-sky-100 text-sky-800 border-sky-200',
      'bg-teal-100 text-teal-800 border-teal-200',
      'bg-amber-100 text-amber-800 border-amber-200',
      'bg-purple-100 text-purple-800 border-purple-200'
    ];
    return (
      <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border ${colors[groupId] || colors[0]}`}>
        Baris {groupId + 1}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={() => {
          playClickSound();
          onClose();
        }}
      />

      {/* Modal Dialog Content */}
      <div 
        role="dialog"
        aria-modal="true"
        className="relative z-10 w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 space-y-6 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
              <Trophy className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 leading-snug">
                Papan Peringkat Siswa (Top 5)
              </h3>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Skor Kuis Giliran Siswa
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            aria-label="Tutup"
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top 5 Highlight Cards */}
        <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
          {top5.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm font-semibold">
              Belum ada siswa yang menjawab kuis.
            </div>
          ) : (
            top5.map((std, idx) => {
              const isLeader = idx === 0 && std.score > 0;
              return (
                <div
                  key={std.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                    isLeader
                      ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-400/40 shadow-xs'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 flex items-center justify-center shrink-0">
                      {getRankBadge(idx)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-extrabold text-slate-900">
                          {std.name}
                        </span>
                        {std.hasStar && (
                          <span title="Pernah menjawab benar">⭐</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {getGroupBadge(std.groupId)}
                        <span className="text-[11px] text-slate-400 font-semibold">
                          {std.correctCount} benar dari {std.answeredCount} soal
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xl sm:text-2xl font-black text-amber-500 font-mono tabular-nums">
                      {std.score}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">
                      Poin
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Total siswa: <strong>{students.length} orang</strong></span>
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
