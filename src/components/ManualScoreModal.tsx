import React, { useState } from 'react';
import { Student, GroupScore } from '../types';
import { Edit3, X, Plus, Minus, Users, User } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface ManualScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  groupScores: GroupScore[];
  onAdjustStudentScore: (studentId: string, delta: number) => void;
  onAdjustGroupScore: (groupId: number, challengeDelta: number, quizDelta: number) => void;
}

export const ManualScoreModal: React.FC<ManualScoreModalProps> = ({
  isOpen,
  onClose,
  students,
  groupScores,
  onAdjustStudentScore,
  onAdjustGroupScore
}) => {
  const [activeTab, setActiveTab] = useState<'kelompok' | 'siswa'>('kelompok');
  const [searchStudent, setSearchStudent] = useState('');

  if (!isOpen) return null;

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchStudent.toLowerCase())
  );

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
        className="relative z-10 w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center shrink-0">
              <Edit3 className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 leading-snug">
                Koreksi Poin Manual Guru
              </h3>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Sesuaikan Poin Kelompok atau Per Siswa
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

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('kelompok');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'kelompok'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Koreksi Poin Baris / Kelompok</span>
          </button>
          <button
            onClick={() => {
              playClickSound();
              setActiveTab('siswa');
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
              activeTab === 'siswa'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Koreksi Poin Individu Siswa</span>
          </button>
        </div>

        {/* Tab 1: Kelompok */}
        {activeTab === 'kelompok' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1 flex-1">
            {groupScores.map((grp) => (
              <div key={grp.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm">
                    {grp.name}
                  </span>
                  <span className="font-black text-amber-500 text-base">
                    Total: {grp.totalScore} pt
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 pt-1 border-t border-slate-200">
                  <span>Poin Kuis ({grp.quizScore} pt):</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        playClickSound();
                        onAdjustGroupScore(grp.id, 0, 10);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-teal-600 text-white font-black hover:bg-teal-700 cursor-pointer"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => {
                        playClickSound();
                        onAdjustGroupScore(grp.id, 0, -10);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 font-black hover:bg-slate-300 cursor-pointer"
                    >
                      -10
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Poin Tantangan ({grp.challengeScore} pt):</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        playClickSound();
                        onAdjustGroupScore(grp.id, 10, 0);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-sky-600 text-white font-black hover:bg-sky-700 cursor-pointer"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => {
                        playClickSound();
                        onAdjustGroupScore(grp.id, -10, 0);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 font-black hover:bg-slate-300 cursor-pointer"
                    >
                      -10
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Siswa */}
        {activeTab === 'siswa' && (
          <div className="space-y-3 overflow-hidden flex-1 flex flex-col">
            <input
              type="text"
              value={searchStudent}
              onChange={(e) => setSearchStudent(e.target.value)}
              placeholder="Cari nama siswa..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 focus:border-teal-500 outline-hidden"
            />

            <div className="overflow-y-auto space-y-2 flex-1 pr-1">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  Tidak ada siswa yang cocok.
                </div>
              ) : (
                filteredStudents.map((std) => (
                  <div
                    key={std.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-800 block">
                        {std.name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Baris {std.groupId + 1} · {std.correctCount} benar / {std.answeredCount} jawab
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-black text-sm text-teal-700 tabular-nums">
                        {std.score} pt
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => {
                            playClickSound();
                            onAdjustStudentScore(std.id, 10);
                          }}
                          className="px-2 py-1 rounded-lg bg-teal-600 text-white font-black hover:bg-teal-700 cursor-pointer"
                          title="Tambah 10 poin"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => {
                            playClickSound();
                            onAdjustStudentScore(std.id, 5);
                          }}
                          className="px-2 py-1 rounded-lg bg-teal-100 text-teal-800 font-black hover:bg-teal-200 cursor-pointer"
                          title="Tambah 5 poin"
                        >
                          +5
                        </button>
                        <button
                          onClick={() => {
                            playClickSound();
                            onAdjustStudentScore(std.id, -5);
                          }}
                          className="px-2 py-1 rounded-lg bg-slate-200 text-slate-700 font-black hover:bg-slate-300 cursor-pointer"
                          title="Kurangi 5 poin"
                        >
                          -5
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
          >
            Selesai
          </button>
        </div>
      </div>
    </div>
  );
};
