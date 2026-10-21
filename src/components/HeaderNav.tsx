import React, { useState } from 'react';
import { TabId, GroupScore } from '../types';
import { 
  Sparkles, BookOpen, CheckSquare, 
  Layers, HelpCircle, Swords, Trophy, Award, 
  RotateCcw, Users
} from 'lucide-react';
import { GroupScoreBoard } from './GroupScoreBoard';
import { playClickSound } from '../utils/sound';

interface HeaderNavProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  progressPercent: number;
  groupScores: GroupScore[];
  onPromptResetChallenge: (groupId: number, groupName: string) => void;
  onPromptResetAllScores: () => void;
  onManualAdjustScore: (groupId: number, challengeDelta: number, quizDelta: number) => void;
  onPromptResetAll: () => void;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({
  activeTab,
  setActiveTab,
  progressPercent,
  groupScores,
  onPromptResetChallenge,
  onPromptResetAllScores,
  onManualAdjustScore,
  onPromptResetAll
}) => {
  const [showScoreDrawer, setShowScoreDrawer] = useState(false);

  const navItems = [
    { id: 'beranda' as TabId, label: 'Beranda', icon: Sparkles },
    { id: 'materi' as TabId, label: 'Materi 1-7', icon: BookOpen, session: 'P1' },
    { id: 'latihan' as TabId, label: 'Tiru Tabel Ini', icon: CheckSquare, session: 'P1' },
    { id: 'ulasan' as TabId, label: 'Ulasan Kilat', icon: Layers, session: 'P2' },
    { id: 'contoh' as TabId, label: 'Tantangan Contoh', icon: HelpCircle, session: 'P2' },
    { id: 'tantangan' as TabId, label: 'Tantangan 1-4', icon: Swords, session: 'P2' },
    { id: 'kuis' as TabId, label: 'Kuis Bersama', icon: Trophy, session: 'P2' },
    { id: 'hasil' as TabId, label: 'Hasil & Juara', icon: Award, session: 'P2' }
  ];

  const handleNavClick = (tabId: TabId) => {
    playClickSound();
    setActiveTab(tabId);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 h-16">
          {/* Zone 1: Wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => handleNavClick('beranda')}
              className="flex items-center gap-2 text-left group focus:outline-hidden cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-teal-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform font-black text-base">
                W
              </div>
              <div>
                <span className="text-base font-extrabold text-slate-900 tracking-tight whitespace-nowrap block">
                  Tabel Word X
                </span>
                <span className="text-[10px] text-teal-700 font-bold block uppercase tracking-wider">
                  Informatika Kelas 10
                </span>
              </div>
            </button>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-sky-50 text-sky-800 font-bold border border-sky-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-sky-600' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                  {item.session && (
                    <span className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                      item.session === 'P1' ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {item.session}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Scoreboard Drawer Toggle & Reset */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                playClickSound();
                setShowScoreDrawer(!showScoreDrawer);
              }}
              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-400 font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span>Papan Skor Otomatis</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                onPromptResetAll();
              }}
              title="Reset Semua Kemajuan"
              className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Compact Quick Score Ticker on Header */}
        <div className="hidden lg:flex items-center justify-between pb-2 pt-0.5 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              Skor Terkini:
            </span>
            <GroupScoreBoard
              scores={groupScores}
              onPromptResetChallenge={onPromptResetChallenge}
              onPromptResetAllScores={onPromptResetAllScores}
              onManualAdjustScore={onManualAdjustScore}
              compact
            />
          </div>
          <div className="text-[11px] text-slate-400">
            Smart Board Mode · Peringkat Otomatis
          </div>
        </div>

        {/* Mobile/Tablet Horizontal Scroll Nav */}
        <div className="xl:hidden flex items-center gap-1 overflow-x-auto pb-2 pt-1 border-t border-slate-100 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-sky-600 text-white font-bold'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3 h-3" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Global Progress Line */}
      <div className="w-full bg-slate-100 h-1.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-teal-500 via-sky-500 to-emerald-500 h-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Scoreboard Drawer Overlay for Smart Board */}
      {showScoreDrawer && (
        <div className="bg-slate-950/95 border-b border-slate-800 p-4 transition-all">
          <div className="max-w-7xl mx-auto space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold text-amber-400 uppercase tracking-wider">
                Papan Skor Kelas Terbuka
              </span>
              <button
                onClick={() => {
                  playClickSound();
                  setShowScoreDrawer(false);
                }}
                className="text-slate-400 hover:text-white underline text-xs cursor-pointer"
              >
                Tutup Panel ✕
              </button>
            </div>
            <GroupScoreBoard
              scores={groupScores}
              onPromptResetChallenge={onPromptResetChallenge}
              onPromptResetAllScores={onPromptResetAllScores}
              onManualAdjustScore={onManualAdjustScore}
            />
          </div>
        </div>
      )}
    </header>
  );
};
