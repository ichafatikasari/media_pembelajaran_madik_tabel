import React, { useState, useEffect } from 'react';
import { 
  TabId, GroupScore, SequenceStepItem, 
  AbsenQuizSettings, AbsenQuizResult 
} from './types';
import { 
  MATERIALS, CHECKLIST_STEPS, CLASS_CHALLENGES 
} from './data/learningData';
import { HeaderNav } from './components/HeaderNav';
import { HomeSection } from './components/HomeSection';
import { MateriSection } from './components/MateriSection';
import { LatihanSection } from './components/LatihanSection';
import { UlasanSection } from './components/UlasanSection';
import { TantanganContohSection } from './components/TantanganContohSection';
import { TantanganKelasSection } from './components/TantanganKelasSection';
import { KuisBersamaSection } from './components/KuisBersamaSection';
import { HasilRefleksiSection } from './components/HasilRefleksiSection';
import { ConfirmModal } from './components/ConfirmModal';
import { Toast } from './components/Toast';
import { playResetSound } from './utils/sound';

const STORAGE_PREFIX = 'tabelmaster_kelas10_absen_v4';

const INITIAL_GROUPS: GroupScore[] = [
  { id: 0, name: 'Baris 1', status: 'belum_mulai', attempts: 0, hasError: false, challengeScore: 0, totalScore: 0, challengeCompleted: false },
  { id: 1, name: 'Baris 2', status: 'belum_mulai', attempts: 0, hasError: false, challengeScore: 0, totalScore: 0, challengeCompleted: false },
  { id: 2, name: 'Baris 3', status: 'belum_mulai', attempts: 0, hasError: false, challengeScore: 0, totalScore: 0, challengeCompleted: false },
  { id: 3, name: 'Baris 4', status: 'belum_mulai', attempts: 0, hasError: false, challengeScore: 0, totalScore: 0, challengeCompleted: false }
];

const DEFAULT_ABSEN_SETTINGS: AbsenQuizSettings = {
  totalStudents: 36,
  absentNumbers: [],
  timeLimit: 20, // default 20s
  soundEnabled: true
};

// Helper to scramble steps
function scrambleSteps(steps: SequenceStepItem[]): SequenceStepItem[] {
  const arr = [...steps];
  for (let attempt = 0; attempt < 5; attempt++) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    const isSorted = arr.every((st, idx) => st.order === idx + 1);
    if (!isSorted) break;
  }
  return arr;
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('beranda');
  const [selectedMateriId, setSelectedMateriId] = useState<string>(MATERIALS[0].id);

  // Group scores state for Tantangan 1-4 (Single Source of Truth)
  const [groupScores, setGroupScores] = useState<GroupScore[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}_scores`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Storage read error', e);
    }
    return INITIAL_GROUPS;
  });

  // Step cards order per challenge (Single Source of Truth)
  const [challengeSteps, setChallengeSteps] = useState<Record<number, SequenceStepItem[]>>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}_challenge_steps`);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Storage read error', e);
    }
    return {
      0: scrambleSteps(CLASS_CHALLENGES[0].steps),
      1: scrambleSteps(CLASS_CHALLENGES[1].steps),
      2: scrambleSteps(CLASS_CHALLENGES[2].steps),
      3: scrambleSteps(CLASS_CHALLENGES[3].steps)
    };
  });

  // Match evaluation highlights per challenge
  const [matchesState, setMatchesState] = useState<Record<number, boolean[]>>({
    0: [],
    1: [],
    2: [],
    3: []
  });

  // ==========================================
  // ABSEN QUIZ STATE (Single Source of Truth)
  // ==========================================
  const [absenSettings, setAbsenSettings] = useState<AbsenQuizSettings>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}_absen_settings`);
      if (saved) return JSON.parse(saved);
    } catch {
      return DEFAULT_ABSEN_SETTINGS;
    }
    return DEFAULT_ABSEN_SETTINGS;
  });

  const [calledNumbers, setCalledNumbers] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}_called_numbers`);
      if (saved) return JSON.parse(saved);
    } catch {
      return [];
    }
    return [];
  });

  const [quizResults, setQuizResults] = useState<AbsenQuizResult[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}_quiz_results`);
      if (saved) return JSON.parse(saved);
    } catch {
      return [];
    }
    return [];
  });

  // Material completion status
  const [completedMateriIds, setCompletedMateriIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}_materi_done`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Guided checklist status (1-6)
  const [completedChecklist, setCompletedChecklist] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(`${STORAGE_PREFIX}_checklist`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Difficulties note
  const [difficultiesNote, setDifficultiesNote] = useState<string>(() => {
    try {
      return localStorage.getItem(`${STORAGE_PREFIX}_diff_note`) || '';
    } catch {
      return '';
    }
  });

  // Custom Modal State for Confirmations (Zero window.confirm)
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Toast feedback notification state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to LocalStorage (Safe try/catch fallback)
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}_scores`, JSON.stringify(groupScores));
      localStorage.setItem(`${STORAGE_PREFIX}_challenge_steps`, JSON.stringify(challengeSteps));
      localStorage.setItem(`${STORAGE_PREFIX}_absen_settings`, JSON.stringify(absenSettings));
      localStorage.setItem(`${STORAGE_PREFIX}_called_numbers`, JSON.stringify(calledNumbers));
      localStorage.setItem(`${STORAGE_PREFIX}_quiz_results`, JSON.stringify(quizResults));
      localStorage.setItem(`${STORAGE_PREFIX}_materi_done`, JSON.stringify(completedMateriIds));
      localStorage.setItem(`${STORAGE_PREFIX}_checklist`, JSON.stringify(completedChecklist));
      localStorage.setItem(`${STORAGE_PREFIX}_diff_note`, difficultiesNote);
    } catch (e) {
      console.warn('Storage write error', e);
    }
  }, [groupScores, challengeSteps, absenSettings, calledNumbers, quizResults, completedMateriIds, completedChecklist, difficultiesNote]);

  // AUTOMATIC SCORING: When a group completes their challenge with correct order
  const handleChallengeComplete = (
    groupId: number, 
    attempts: number, 
    points: number, 
    matches: boolean[]
  ) => {
    setMatchesState((prev) => ({
      ...prev,
      [groupId]: matches
    }));

    setGroupScores((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            status: 'selesai',
            attempts,
            hasError: false,
            challengeScore: points,
            totalScore: points,
            challengeCompleted: true
          };
        }
        return g;
      })
    );
  };

  // AUTOMATIC SCORING: When a group attempts but there is still an error
  const handleChallengeIncorrectAttempt = (
    groupId: number, 
    attempts: number, 
    matches: boolean[]
  ) => {
    setMatchesState((prev) => ({
      ...prev,
      [groupId]: matches
    }));

    setGroupScores((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            status: 'sedang_dikerjakan',
            attempts,
            hasError: true,
            challengeScore: 0,
            totalScore: 0,
            challengeCompleted: false
          };
        }
        return g;
      })
    );
  };

  // Update step cards sequence from drag/move
  const handleUpdateChallengeSteps = (groupId: number, steps: SequenceStepItem[]) => {
    setChallengeSteps((prev) => ({
      ...prev,
      [groupId]: steps
    }));
  };

  // Clear match highlights for re-attempt
  const handleClearMatches = (groupId: number) => {
    setMatchesState((prev) => ({
      ...prev,
      [groupId]: []
    }));
  };

  // ==========================================
  // RESET ACTIONS WITH PROMPT MODAL & TOAST
  // ==========================================

  // 1. Prompt & Execute: Reset Tantangan Ini
  const promptResetChallenge = (groupId: number, groupName?: string) => {
    const label = groupName || CLASS_CHALLENGES[groupId]?.targetGroup || `Baris ${groupId + 1}`;
    setModalConfig({
      isOpen: true,
      title: `Reset Tantangan ${label}?`,
      message: `Urutan kartu langkah akan diacak kembali ke posisi awal, jumlah percobaan dan poin dikembalikan ke 0, serta status kembali 'Belum mulai'. Kelompok ini dapat mengulang tantangan secara bersih.`,
      confirmLabel: 'Ya, Reset Tantangan',
      cancelLabel: 'Batal',
      onConfirm: () => {
        executeResetChallenge(groupId);
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const executeResetChallenge = (groupId: number) => {
    setGroupScores((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          return {
            ...g,
            status: 'belum_mulai',
            attempts: 0,
            hasError: false,
            challengeScore: 0,
            totalScore: 0,
            challengeCompleted: false
          };
        }
        return g;
      })
    );

    setChallengeSteps((prev) => ({
      ...prev,
      [groupId]: scrambleSteps(CLASS_CHALLENGES[groupId].steps)
    }));

    setMatchesState((prev) => ({
      ...prev,
      [groupId]: []
    }));

    playResetSound();
    setToastMessage('Berhasil direset');
  };

  // 2. Prompt & Execute: Reset Semua Skor Tantangan
  const promptResetAllScores = () => {
    setModalConfig({
      isOpen: true,
      title: 'Reset Skor Semua Baris?',
      message: 'Seluruh 4 tantangan urut langkah akan diacak kembali, jumlah percobaan dan poin tantangan Baris 1 - 4 akan dikembalikan ke 0.',
      confirmLabel: 'Ya, Reset Semua Skor',
      cancelLabel: 'Batal',
      onConfirm: () => {
        executeResetAllScores();
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const executeResetAllScores = () => {
    setGroupScores(INITIAL_GROUPS);

    setChallengeSteps({
      0: scrambleSteps(CLASS_CHALLENGES[0].steps),
      1: scrambleSteps(CLASS_CHALLENGES[1].steps),
      2: scrambleSteps(CLASS_CHALLENGES[2].steps),
      3: scrambleSteps(CLASS_CHALLENGES[3].steps)
    });

    setMatchesState({ 0: [], 1: [], 2: [], 3: [] });

    try {
      localStorage.removeItem(`${STORAGE_PREFIX}_scores`);
      localStorage.removeItem(`${STORAGE_PREFIX}_challenge_steps`);
    } catch (e) {
      console.warn('Storage delete error', e);
    }

    playResetSound();
    setToastMessage('Berhasil direset');
  };

  // 3. Prompt & Execute: Reset Kuis Absen Saja
  const promptResetQuiz = () => {
    setModalConfig({
      isOpen: true,
      title: 'Reset Sesi Kuis Absen?',
      message: 'Daftar nomor absen yang sudah maju dan rekaman jawaban kuis akan dikosongkan. Pengaturan jumlah siswa dan daftar tidak hadir tetap tersimpan.',
      confirmLabel: 'Ya, Reset Kuis',
      cancelLabel: 'Batal',
      onConfirm: () => {
        executeResetQuiz();
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const executeResetQuiz = () => {
    setCalledNumbers([]);
    setQuizResults([]);

    try {
      localStorage.removeItem(`${STORAGE_PREFIX}_called_numbers`);
      localStorage.removeItem(`${STORAGE_PREFIX}_quiz_results`);
    } catch (e) {
      console.warn(e);
    }

    playResetSound();
    setToastMessage('Kuis berhasil direset');
  };

  // 4. Prompt & Execute: Reset Semua Kemajuan (Header Icon)
  const promptResetAllProgress = () => {
    setModalConfig({
      isOpen: true,
      title: 'Mulai Ulang Seluruh Pembelajaran?',
      message: 'Seluruh kemajuan materi, checklist latihan mandiri di Word, catatan kesulitan, skor kelompok baris, dan riwayat kuis akan dihapus.',
      confirmLabel: 'Ya, Mulai Ulang Semua',
      cancelLabel: 'Batal',
      onConfirm: () => {
        executeResetAllProgress();
        setModalConfig((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const executeResetAllProgress = () => {
    executeResetAllScores();
    executeResetQuiz();
    setCompletedMateriIds([]);
    setCompletedChecklist([]);
    setDifficultiesNote('');
    setActiveTab('beranda');

    try {
      localStorage.removeItem(`${STORAGE_PREFIX}_materi_done`);
      localStorage.removeItem(`${STORAGE_PREFIX}_checklist`);
      localStorage.removeItem(`${STORAGE_PREFIX}_diff_note`);
    } catch (e) {
      console.warn('Storage delete error', e);
    }

    playResetSound();
    setToastMessage('Berhasil direset');
  };

  // Manual teacher point override/correction for challenge
  const handleManualAdjustScore = (groupId: number, challengeDelta: number) => {
    setGroupScores((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const newChallenge = Math.max(0, g.challengeScore + challengeDelta);
          const isDone = newChallenge > 0 ? true : g.challengeCompleted;
          return {
            ...g,
            challengeScore: newChallenge,
            totalScore: newChallenge,
            challengeCompleted: isDone,
            status: isDone ? 'selesai' : g.status
          };
        }
        return g;
      })
    );
  };

  const handleToggleMateri = (id: string) => {
    if (completedMateriIds.includes(id)) {
      setCompletedMateriIds(completedMateriIds.filter((item) => item !== id));
    } else {
      setCompletedMateriIds([...completedMateriIds, id]);
    }
  };

  const handleToggleChecklist = (stepId: number) => {
    if (completedChecklist.includes(stepId)) {
      setCompletedChecklist(completedChecklist.filter((id) => id !== stepId));
    } else {
      setCompletedChecklist([...completedChecklist, stepId]);
    }
  };

  const handleNavigateToMateri = (materiId: string) => {
    setSelectedMateriId(materiId);
    setActiveTab('materi');
  };

  // Record answered question in quiz
  const handleRecordQuizResult = (result: AbsenQuizResult) => {
    setQuizResults((prev) => {
      // Replace if question already recorded, or append
      const filtered = prev.filter((r) => r.questionId !== result.questionId);
      return [...filtered, result];
    });
  };

  // Calculate Progress Percent
  const progressPercent = Math.min(
    100,
    Math.round(
      (completedMateriIds.length / MATERIALS.length) * 35 +
      (completedChecklist.length / CHECKLIST_STEPS.length) * 25 +
      (groupScores.filter((g) => g.challengeCompleted).length / 4) * 25 +
      (quizResults.length / 10) * 15
    )
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-teal-100 selection:text-teal-900 relative">
      {/* Top Bar Header with Navigation */}
      <HeaderNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        progressPercent={progressPercent}
        groupScores={groupScores}
        onPromptResetChallenge={promptResetChallenge}
        onPromptResetAllScores={promptResetAllScores}
        onManualAdjustScore={handleManualAdjustScore}
        onPromptResetAll={promptResetAllProgress}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {activeTab === 'beranda' && (
          <HomeSection
            setActiveTab={setActiveTab}
            groupScores={groupScores}
            onPromptResetChallenge={promptResetChallenge}
            onPromptResetAllScores={promptResetAllScores}
            onManualAdjustScore={handleManualAdjustScore}
          />
        )}

        {/* PERTEMUAN 1: BELAJAR & PRAKTIK */}
        {activeTab === 'materi' && (
          <MateriSection
            completedMateriIds={completedMateriIds}
            onToggleMateriComplete={handleToggleMateri}
            onNavigateToLatihan={() => setActiveTab('latihan')}
            selectedMateriId={selectedMateriId}
          />
        )}

        {activeTab === 'latihan' && (
          <LatihanSection
            completedChecklist={completedChecklist}
            onToggleChecklist={handleToggleChecklist}
            difficultiesNote={difficultiesNote}
            setDifficultiesNote={setDifficultiesNote}
            onNavigateToMateri={handleNavigateToMateri}
            onNavigateToPertemuan2={() => setActiveTab('ulasan')}
          />
        )}

        {/* PERTEMUAN 2: TANTANGAN & KUIS */}
        {activeTab === 'ulasan' && (
          <UlasanSection
            onNavigateToContoh={() => setActiveTab('contoh')}
          />
        )}

        {activeTab === 'contoh' && (
          <TantanganContohSection
            onStartRealChallenge={() => setActiveTab('tantangan')}
          />
        )}

        {activeTab === 'tantangan' && (
          <TantanganKelasSection
            groupScores={groupScores}
            challengeSteps={challengeSteps}
            matchesState={matchesState}
            onUpdateSteps={handleUpdateChallengeSteps}
            onClearMatches={handleClearMatches}
            onChallengeComplete={handleChallengeComplete}
            onChallengeIncorrectAttempt={handleChallengeIncorrectAttempt}
            onPromptResetChallenge={promptResetChallenge}
            onPromptResetAllScores={promptResetAllScores}
            onManualAdjustScore={handleManualAdjustScore}
            onNavigateToQuiz={() => setActiveTab('kuis')}
          />
        )}

        {/* KUIS BERSAMA: MODE PANGGIL NOMOR ABSEN */}
        {activeTab === 'kuis' && (
          <KuisBersamaSection
            settings={absenSettings}
            onUpdateSettings={setAbsenSettings}
            calledNumbers={calledNumbers}
            onUpdateCalledNumbers={setCalledNumbers}
            quizResults={quizResults}
            onRecordQuizResult={handleRecordQuizResult}
            onPromptResetQuiz={promptResetQuiz}
            onNavigateToHasil={() => setActiveTab('hasil')}
          />
        )}

        {activeTab === 'hasil' && (
          <HasilRefleksiSection
            groupScores={groupScores}
            quizResults={quizResults}
            onPromptResetChallengeScores={promptResetAllScores}
            onNavigateToMateri={handleNavigateToMateri}
          />
        )}
      </main>

      {/* Confirmation Modal (Zero window.confirm, safe for iframe environments) */}
      <ConfirmModal
        isOpen={modalConfig.isOpen}
        title={modalConfig.title}
        message={modalConfig.message}
        confirmLabel={modalConfig.confirmLabel}
        cancelLabel={modalConfig.cancelLabel}
        onConfirm={modalConfig.onConfirm}
        onCancel={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Toast Notification */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />

      {/* Clean Educational Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 print:hidden mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900">Tabel Word X</span>
            <span>·</span>
            <span>Media Pembelajaran Informatika Kelas 10 SMA/MA</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Kuis Panggil Nomor Absen · Smart Board Layar Sentuh</span>
            <span>·</span>
            <span>Office 2007 - 365</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
