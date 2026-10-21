import React, { useState, useEffect, useRef } from 'react';
import { QUIZ_QUESTIONS } from '../data/learningData';
import { AbsenQuizSettings, AbsenQuizResult } from '../types';
import { 
  Sparkles, Clock, Check, X, RotateCcw, 
  ArrowRight, ArrowLeft, Volume2, VolumeX, 
  Settings, Maximize, Minimize, Users, 
  HelpCircle, MessageCircle, AlertCircle, ChevronRight, CheckCircle2
} from 'lucide-react';
import { 
  playClickSound, playTickSound, playRaffleSound, 
  playSuspenseDrone, playSuccessSound, playErrorSound, 
  setSoundEnabled, isSoundEnabled 
} from '../utils/sound';

interface KuisBersamaSectionProps {
  settings: AbsenQuizSettings;
  onUpdateSettings: (settings: AbsenQuizSettings) => void;
  calledNumbers: number[];
  onUpdateCalledNumbers: (numbers: number[]) => void;
  quizResults: AbsenQuizResult[];
  onRecordQuizResult: (result: AbsenQuizResult) => void;
  onPromptResetQuiz: () => void;
  onNavigateToHasil: () => void;
}

export const KuisBersamaSection: React.FC<KuisBersamaSectionProps> = ({
  settings,
  onUpdateSettings,
  calledNumbers,
  onUpdateCalledNumbers,
  quizResults,
  onRecordQuizResult,
  onPromptResetQuiz,
  onNavigateToHasil
}) => {
  // Current question index (0 to 9)
  const [currentQIdx, setCurrentQIdx] = useState<number>(0);
  const currentQ = QUIZ_QUESTIONS[currentQIdx] || QUIZ_QUESTIONS[0];
  const totalQuestions = QUIZ_QUESTIONS.length;

  // Active student chosen for current question
  const [activeAbsenNumber, setActiveAbsenNumber] = useState<number | null>(null);

  // Raffle spin state
  const [isRaffling, setIsRaffling] = useState<boolean>(false);
  const [raffleDisplayNum, setRaffleDisplayNum] = useState<number>(1);
  const [showSpotlight, setShowSpotlight] = useState<boolean>(false);

  // Question stage: 'NEED_ROLL' | 'SPOTLIGHT' | 'ANSWERING' | 'CONFIRMING' | 'SUSPENSE' | 'REVEALED'
  const [stage, setStage] = useState<'NEED_ROLL' | 'SPOTLIGHT' | 'ANSWERING' | 'CONFIRMING' | 'SUSPENSE' | 'REVEALED'>('NEED_ROLL');

  // Timer state
  const [timeLeft, setTimeLeft] = useState<number>(settings.timeLimit);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [isFriendDiscussionActive, setIsFriendDiscussionActive] = useState<boolean>(false);
  const [friendDiscussionLeft, setFriendDiscussionLeft] = useState<number>(15);

  // Lifelines (1 per question)
  const [askFriendUsed, setAskFriendUsed] = useState<boolean>(false);
  const [fiftyFiftyUsed, setFiftyFiftyUsed] = useState<boolean>(false);
  const [hiddenOptions, setHiddenOptions] = useState<('A' | 'B' | 'C' | 'D')[]>([]);

  // Answering states
  const [selectedOption, setSelectedOption] = useState<'A' | 'B' | 'C' | 'D' | null>(null);
  const [lastIsCorrect, setLastIsCorrect] = useState<boolean | null>(null);
  const [screenShake, setScreenShake] = useState<boolean>(false);
  const [confettiBurst, setConfettiBurst] = useState<boolean>(false);

  // Modal settings & absent numbers drawer
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const friendTimerRef = useRef<NodeJS.Timeout | null>(null);
  const raffleIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Check if current question was already answered previously
  const existingResult = quizResults.find((r) => r.questionId === currentQ.id);

  // On mount / question change, check if question already has result
  useEffect(() => {
    if (existingResult) {
      setActiveAbsenNumber(existingResult.absenNumber);
      setSelectedOption(existingResult.selectedOption);
      setLastIsCorrect(existingResult.isCorrect);
      setStage('REVEALED');
      setIsTimerRunning(false);
    } else {
      setSelectedOption(null);
      setLastIsCorrect(null);
      setAskFriendUsed(false);
      setFiftyFiftyUsed(false);
      setHiddenOptions([]);
      setIsFriendDiscussionActive(false);
      setTimeLeft(settings.timeLimit);
      setIsTimerRunning(false);
      setShowSpotlight(false);
      setStage('NEED_ROLL');
    }
  }, [currentQIdx, existingResult, settings.timeLimit]);

  // Main Question Countdown Timer
  useEffect(() => {
    if (isTimerRunning && settings.timeLimit > 0 && timeLeft > 0 && !isFriendDiscussionActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            playErrorSound();
            return 0;
          }
          if (prev <= 6) {
            playTickSound(true); // Urgent heartbeat ticking
          } else {
            playTickSound(false);
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning, timeLeft, isFriendDiscussionActive, settings.timeLimit]);

  // Friend Discussion 15s Timer
  useEffect(() => {
    if (isFriendDiscussionActive && friendDiscussionLeft > 0) {
      friendTimerRef.current = setInterval(() => {
        setFriendDiscussionLeft((prev) => {
          if (prev <= 1) {
            setIsFriendDiscussionActive(false);
            setIsTimerRunning(true); // Resume main timer
            return 0;
          }
          playTickSound(false);
          return prev - 1;
        });
      }, 1000);
    } else {
      if (friendTimerRef.current) clearInterval(friendTimerRef.current);
    }
    return () => {
      if (friendTimerRef.current) clearInterval(friendTimerRef.current);
    };
  }, [isFriendDiscussionActive, friendDiscussionLeft]);

  // Handle Fullscreen toggle
  const toggleFullscreen = () => {
    playClickSound();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  // Toggle Sound On/Off
  const handleToggleSound = () => {
    const nextState = !settings.soundEnabled;
    setSoundEnabled(nextState);
    onUpdateSettings({
      ...settings,
      soundEnabled: nextState
    });
    if (nextState) playClickSound();
  };

  // RAFFLE SPIN LOGIC: Pick a random absen number
  const handleStartRaffle = () => {
    if (isRaffling) return;

    // Available numbers: 1 .. totalStudents minus absent and already called
    const allNums = Array.from({ length: settings.totalStudents }, (_, i) => i + 1);
    const availableNums = allNums.filter(
      (n) => !settings.absentNumbers.includes(n) && !calledNumbers.includes(n)
    );

    if (availableNums.length === 0) {
      // If all students have been called, use all present students
      const fallback = allNums.filter((n) => !settings.absentNumbers.includes(n));
      if (fallback.length === 0) return;
      spinWithCandidates(fallback);
    } else {
      spinWithCandidates(availableNums);
    }
  };

  const spinWithCandidates = (candidates: number[]) => {
    setIsRaffling(true);
    playRaffleSound(3500);

    const winner = candidates[Math.floor(Math.random() * candidates.length)];
    const totalSteps = 24;
    let step = 0;
    const duration = 3400; // 3.4 seconds total spin
    const startTime = Date.now();

    const spinInterval = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress >= 1 || step >= totalSteps) {
        // Land on winner!
        setRaffleDisplayNum(winner);
        setIsRaffling(false);
        setActiveAbsenNumber(winner);
        onUpdateCalledNumbers([...calledNumbers, winner]);
        setShowSpotlight(true);
        setStage('SPOTLIGHT');
        playSuccessSound();
      } else {
        step++;
        const randomCandidate = candidates[Math.floor(Math.random() * candidates.length)];
        setRaffleDisplayNum(randomCandidate);
        // Exponential deceleration
        const nextDelay = 40 + Math.pow(progress, 2.5) * 320;
        raffleIntervalRef.current = setTimeout(spinInterval, nextDelay);
      }
    };

    spinInterval();
  };

  // Reroll student if student is excused or unavailable
  const handleRerollStudent = () => {
    playClickSound();
    if (activeAbsenNumber !== null) {
      // Remove this number from called list so it can be called later
      onUpdateCalledNumbers(calledNumbers.filter((n) => n !== activeAbsenNumber));
    }
    setActiveAbsenNumber(null);
    setShowSpotlight(false);
    setSelectedOption(null);
    setStage('NEED_ROLL');
  };

  // Move from Spotlight to Answering Question
  const handleStartAnswering = () => {
    playClickSound();
    setShowSpotlight(false);
    setStage('ANSWERING');
    setTimeLeft(settings.timeLimit);
    if (settings.timeLimit > 0) {
      setIsTimerRunning(true);
    }
  };

  // Lifeline: Tanya Teman (15s pause)
  const handleUseAskFriend = () => {
    if (askFriendUsed || stage !== 'ANSWERING') return;
    playClickSound();
    setAskFriendUsed(true);
    setIsTimerRunning(false);
    setIsFriendDiscussionActive(true);
    setFriendDiscussionLeft(15);
  };

  // Lifeline: 50:50 (Hide 2 wrong options)
  const handleUseFiftyFifty = () => {
    if (fiftyFiftyUsed || stage !== 'ANSWERING') return;
    playClickSound();
    setFiftyFiftyUsed(true);

    const wrongOptions = currentQ.options
      .filter((opt) => opt.key !== currentQ.correctAnswer)
      .map((opt) => opt.key);

    // Shuffle and pick 2 wrong options to hide
    const shuffledWrong = [...wrongOptions].sort(() => 0.5 - Math.random());
    setHiddenOptions(shuffledWrong.slice(0, 2));
  };

  // Teacher clicks option spoken by student
  const handleSelectOption = (key: 'A' | 'B' | 'C' | 'D') => {
    if (stage !== 'ANSWERING' && stage !== 'CONFIRMING') return;
    playClickSound();
    setSelectedOption(key);
  };

  // Teacher initiates "KUNCI JAWABAN"
  const handleLockPrompt = () => {
    if (!selectedOption || stage !== 'ANSWERING') return;
    playClickSound();
    setStage('CONFIRMING');
  };

  // Teacher cancels lock and changes option
  const handleCancelLock = () => {
    playClickSound();
    setStage('ANSWERING');
  };

  // Teacher confirms "YAKIN" -> Suspense Drone -> Reveal
  const handleConfirmLock = () => {
    if (!selectedOption) return;
    setIsTimerRunning(false);
    setIsFriendDiscussionActive(false);
    setStage('SUSPENSE');
    playSuspenseDrone(3);

    setTimeout(() => {
      const isCorrect = selectedOption === currentQ.correctAnswer;
      setLastIsCorrect(isCorrect);
      setStage('REVEALED');

      if (isCorrect) {
        playSuccessSound();
        setConfettiBurst(true);
        setTimeout(() => setConfettiBurst(false), 4000);
      } else {
        playErrorSound();
        setScreenShake(true);
        setTimeout(() => setScreenShake(false), 800);
      }

      // Record result for Class Recap and Remedial Recommendations
      if (activeAbsenNumber !== null) {
        onRecordQuizResult({
          questionId: currentQ.id,
          absenNumber: activeAbsenNumber,
          selectedOption,
          correctOption: currentQ.correctAnswer,
          isCorrect,
          materiRef: currentQ.materiRef,
          questionText: currentQ.question
        });
      }
    }, 2800);
  };

  // Navigation: Next Question
  const handleNextQuestion = () => {
    playClickSound();
    if (currentQIdx < totalQuestions - 1) {
      setCurrentQIdx(currentQIdx + 1);
    } else {
      onNavigateToHasil();
    }
  };

  // Navigation: Prev Question
  const handlePrevQuestion = () => {
    playClickSound();
    if (currentQIdx > 0) {
      setCurrentQIdx(currentQIdx - 1);
    }
  };

  // Navigation: Skip Question
  const handleSkipQuestion = () => {
    playClickSound();
    if (currentQIdx < totalQuestions - 1) {
      setCurrentQIdx(currentQIdx + 1);
    }
  };

  // Toggle absent number in settings
  const toggleAbsentNumber = (num: number) => {
    playClickSound();
    if (settings.absentNumbers.includes(num)) {
      onUpdateSettings({
        ...settings,
        absentNumbers: settings.absentNumbers.filter((n) => n !== num)
      });
    } else {
      onUpdateSettings({
        ...settings,
        absentNumbers: [...settings.absentNumbers, num].sort((a, b) => a - b)
      });
    }
  };

  // SVG circular timer calculation
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const timerPercentage = settings.timeLimit > 0 ? (timeLeft / settings.timeLimit) : 1;
  const strokeDashoffset = circumference - (timerPercentage * circumference);

  const timerColor = 
    timeLeft <= 5 ? '#ef4444' : 
    timeLeft <= 10 ? '#f59e0b' : '#10b981';

  return (
    <div className={`space-y-6 pb-20 ${screenShake ? 'animate-shake' : ''}`}>
      {/* Top Controller Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        {/* Progress & Topic */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-sky-600 text-white font-black text-lg flex items-center justify-center shadow-xs">
            {currentQIdx + 1}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-sky-700">
                Soal {currentQIdx + 1} dari {totalQuestions}
              </span>
              <span className="text-slate-300">·</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 font-extrabold border border-teal-200">
                {currentQ.topicTag}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              Kuis Kelas: Panggil Nomor Absen
            </h2>
          </div>
        </div>

        {/* Global Controls: Sound, Settings, Fullscreen, Reset */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSound}
            title={settings.soundEnabled ? 'Matikan Suara Efek' : 'Nyalakan Suara Efek'}
            className={`p-2.5 rounded-xl border text-xs font-bold transition-colors cursor-pointer ${
              settings.soundEnabled
                ? 'bg-teal-50 border-teal-200 text-teal-700 hover:bg-teal-100'
                : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
            }`}
          >
            {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              playClickSound();
              setShowSettingsModal(true);
            }}
            title="Pengaturan Absen Siswa & Timer"
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Settings className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Pengaturan Absen ({settings.totalStudents - settings.absentNumbers.length} Hadir)</span>
          </button>

          <button
            onClick={toggleFullscreen}
            title="Layar Penuh Smart Board"
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer shadow-xs"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>

          <button
            onClick={() => {
              playClickSound();
              onPromptResetQuiz();
            }}
            title="Reset Seluruh Kuis"
            className="px-3 py-2 rounded-xl border border-red-200 bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Kuis</span>
          </button>
        </div>
      </div>

      {/* STAGE 1: WHEEL / RAFFLE ROLL (WAITING TO PICK STUDENT) */}
      {stage === 'NEED_ROLL' && (
        <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-teal-950 text-white rounded-3xl p-8 sm:p-14 shadow-2xl border border-slate-800 text-center space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <span className="px-3.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 text-xs font-black uppercase tracking-widest inline-block">
              🎲 Pengundian Nomor Absen Siswa
            </span>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Siapa yang Maju untuk Soal {currentQIdx + 1}?
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              Tekan tombol di bawah untuk memutar nomor absen secara acak. Siswa yang terpilih silakan maju ke depan kelas untuk menjawab!
            </p>
          </div>

          {/* Big Raffle Number Slot Machine Display */}
          <div className="relative z-10 py-4 flex flex-col items-center justify-center">
            <div className={`w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-slate-950/80 border-4 border-amber-400/60 shadow-2xl flex flex-col items-center justify-center transition-all ${
              isRaffling ? 'scale-105 border-amber-400 shadow-amber-500/20' : ''
            }`}>
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
                Absen No.
              </span>
              <span className={`text-6xl sm:text-7xl font-black tabular-nums transition-all ${
                isRaffling ? 'text-amber-400 animate-pulse' : 'text-white'
              }`}>
                {raffleDisplayNum}
              </span>
              <span className="text-[10px] text-teal-300 font-bold mt-1">
                {isRaffling ? 'Memutar...' : `dari 1 - ${settings.totalStudents}`}
              </span>
            </div>
          </div>

          {/* Big Action Button */}
          <div className="relative z-10 flex flex-col items-center justify-center gap-4">
            <button
              onClick={handleStartRaffle}
              disabled={isRaffling}
              className={`px-10 py-5 rounded-2xl text-lg sm:text-xl font-black transition-all shadow-xl flex items-center justify-center gap-3 cursor-pointer ${
                isRaffling
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 hover:scale-105 shadow-amber-500/20 active:scale-95'
              }`}
            >
              <Sparkles className="w-6 h-6 fill-current" />
              <span>{isRaffling ? 'SEDANG MEMUTAR NOMOR...' : 'PUTAR NOMOR ABSEN'}</span>
            </button>

            {/* List of Already Called Numbers */}
            <div className="pt-4 text-xs text-slate-300 max-w-xl">
              <span className="font-extrabold text-amber-400">Nomor yang sudah maju: </span>
              {calledNumbers.length > 0 ? (
                <span className="font-mono text-slate-200">
                  {calledNumbers.map((n) => `No. ${n}`).join(', ')}
                </span>
              ) : (
                <span className="text-slate-400 italic">Belum ada nomor yang maju</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STAGE 2: SPOTLIGHT WINNER REVEAL */}
      {stage === 'SPOTLIGHT' && activeAbsenNumber !== null && (
        <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-teal-950 text-white rounded-3xl p-8 sm:p-14 shadow-2xl border-2 border-amber-400 text-center space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-3">
            <span className="px-4 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black uppercase tracking-widest inline-block shadow-md">
              🎉 SISWA TERPILIH UNTUK SOAL {currentQIdx + 1}
            </span>
            <div className="text-5xl sm:text-7xl font-black text-amber-400 tracking-tight py-4 drop-shadow-md">
              Absen No. {activeAbsenNumber} silakan maju!
            </div>
            <p className="text-base sm:text-lg text-slate-200 max-w-xl mx-auto">
              Siswa dengan nomor absen <strong className="text-amber-300 font-extrabold">No. {activeAbsenNumber}</strong>, 
              silakan maju ke depan kelas untuk menjawab soal di smart board.
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-4 pt-6">
            <button
              onClick={handleStartAnswering}
              className="px-9 py-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-base sm:text-lg font-black transition-all shadow-xl hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              <span>Mulai Tampilkan Soal</span>
              <ArrowRight className="w-5 h-5 stroke-[3]" />
            </button>

            <button
              onClick={handleRerollStudent}
              className="px-5 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 text-xs sm:text-sm font-bold transition-all border border-slate-700 flex items-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Putar Ulang Nomor (Jika Izin / Berhalangan)</span>
            </button>
          </div>
        </div>
      )}

      {/* STAGE 3, 4, 5, 6: QUESTION DISPLAY & ANSWERING ARENA */}
      {(stage === 'ANSWERING' || stage === 'CONFIRMING' || stage === 'SUSPENSE' || stage === 'REVEALED') && (
        <div className="space-y-6">
          {/* Active Student Badge + Timer Bar + Lifelines */}
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Student Spotlight Chip */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 font-black text-2xl flex items-center justify-center shadow-md">
                {activeAbsenNumber !== null ? activeAbsenNumber : '?'}
              </div>
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Giliran Menjawab:
                </span>
                <span className="text-xl sm:text-2xl font-black text-slate-900">
                  Absen No. {activeAbsenNumber}
                </span>
              </div>
            </div>

            {/* Circular Countdown Timer or Untimed indicator */}
            <div className="flex items-center gap-6">
              {settings.timeLimit > 0 ? (
                <div className="flex items-center gap-3">
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <svg className="w-16 h-16 transform -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r={radius}
                        stroke="#e2e8f0"
                        strokeWidth="5"
                        fill="transparent"
                      />
                      <circle
                        cx="32"
                        cy="32"
                        r={radius}
                        stroke={timerColor}
                        strokeWidth="5"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        fill="transparent"
                        className="transition-all duration-1000 ease-linear"
                      />
                    </svg>
                    <span className={`absolute text-xl font-black font-mono tabular-nums ${
                      timeLeft <= 5 ? 'text-red-600 scale-110 animate-pulse' : 'text-slate-800'
                    }`}>
                      {timeLeft}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 font-semibold">
                    <span className="font-bold block text-slate-700">Waktu Menjawab</span>
                    <span>{settings.timeLimit} detik</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-slate-100 text-slate-600 text-xs font-bold">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span>Tanpa Batasan Waktu</span>
                </div>
              )}

              {/* Lifeline Buttons */}
              {stage === 'ANSWERING' && (
                <div className="flex items-center gap-2 border-l border-slate-200 pl-4">
                  <button
                    onClick={handleUseAskFriend}
                    disabled={askFriendUsed}
                    title="Tanya Teman: Jeda waktu 15 detik untuk berdiskusi dengan 1 teman"
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                      askFriendUsed
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50'
                        : 'bg-sky-50 text-sky-800 border-sky-200 hover:bg-sky-100 shadow-xs'
                    }`}
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-sky-600" />
                    <span>Tanya Teman {askFriendUsed ? '✓' : ''}</span>
                  </button>

                  <button
                    onClick={handleUseFiftyFifty}
                    disabled={fiftyFiftyUsed}
                    title="50:50: Sembunyikan 2 pilihan salah"
                    className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                      fiftyFiftyUsed
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed opacity-50'
                        : 'bg-teal-50 text-teal-800 border-teal-200 hover:bg-teal-100 shadow-xs'
                    }`}
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
                    <span>50:50 {fiftyFiftyUsed ? '✓' : ''}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Friend Discussion Active Banner */}
          {isFriendDiscussionActive && (
            <div className="p-4 rounded-2xl bg-sky-500 text-white flex items-center justify-between gap-4 animate-in fade-in">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-6 h-6 animate-bounce" />
                <div>
                  <h4 className="font-black text-sm">Bantuan "Tanya Teman" Aktif!</h4>
                  <p className="text-xs text-sky-100">
                    Siswa sedang berdiskusi 15 detik dengan teman sekelas. Waktu kuis utama dijeda!
                  </p>
                </div>
              </div>
              <div className="text-3xl font-black font-mono tabular-nums bg-sky-600 px-4 py-1.5 rounded-xl border border-sky-400">
                {friendDiscussionLeft}s
              </div>
            </div>
          )}

          {/* Question Text Box (Extra Large Typography) */}
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 leading-snug tracking-tight">
              {currentQ.question}
            </h3>

            {/* Options Grid (A, B, C, D) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentQ.options.map((opt) => {
                const isHidden = hiddenOptions.includes(opt.key);
                const isSelected = selectedOption === opt.key;
                const isCorrect = opt.key === currentQ.correctAnswer;

                let cardStyle = 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800';

                if (stage === 'ANSWERING') {
                  if (isSelected) {
                    cardStyle = 'bg-sky-50 border-sky-500 text-sky-950 ring-2 ring-sky-500/30';
                  }
                } else if (stage === 'CONFIRMING') {
                  if (isSelected) {
                    cardStyle = 'bg-amber-50 border-amber-500 text-amber-950 ring-2 ring-amber-500/30 animate-pulse';
                  }
                } else if (stage === 'SUSPENSE') {
                  if (isSelected) {
                    cardStyle = 'bg-amber-100 border-amber-600 text-amber-950 ring-4 ring-amber-400/50 animate-pulse';
                  }
                } else if (stage === 'REVEALED') {
                  if (isCorrect) {
                    cardStyle = 'bg-emerald-500 text-white border-emerald-600 ring-4 ring-emerald-300/60 shadow-lg';
                  } else if (isSelected && !isCorrect) {
                    cardStyle = 'bg-red-500 text-white border-red-600 ring-4 ring-red-300/60 shadow-lg';
                  } else {
                    cardStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                  }
                }

                if (isHidden && stage !== 'REVEALED') {
                  return (
                    <div
                      key={opt.key}
                      className="p-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 flex items-center justify-center text-xs text-slate-400 font-bold italic"
                    >
                      (Opsi {opt.key} Tereliminasi oleh 50:50)
                    </div>
                  );
                }

                return (
                  <button
                    key={opt.key}
                    disabled={stage !== 'ANSWERING' && stage !== 'CONFIRMING'}
                    onClick={() => handleSelectOption(opt.key)}
                    className={`p-5 sm:p-6 rounded-2xl border text-left transition-all flex items-start gap-4 cursor-pointer ${cardStyle} ${
                      stage === 'ANSWERING' ? 'hover:scale-[1.01] active:scale-[0.99]' : ''
                    }`}
                  >
                    <span className={`w-10 h-10 rounded-xl font-black text-lg flex items-center justify-center shrink-0 border ${
                      stage === 'REVEALED' && isCorrect
                        ? 'bg-white text-emerald-700 border-white'
                        : stage === 'REVEALED' && isSelected && !isCorrect
                        ? 'bg-white text-red-700 border-white'
                        : isSelected
                        ? 'bg-sky-600 text-white border-sky-600'
                        : 'bg-white text-slate-700 border-slate-300'
                    }`}>
                      {opt.key}
                    </span>

                    <span className="text-base sm:text-lg font-bold leading-snug pt-1 flex-1">
                      {opt.text}
                    </span>

                    {/* Result Icons */}
                    {stage === 'REVEALED' && (
                      <div className="shrink-0 pt-1">
                        {isCorrect && (
                          <span className="w-8 h-8 rounded-full bg-white text-emerald-600 flex items-center justify-center font-black">
                            ✓
                          </span>
                        )}
                        {isSelected && !isCorrect && (
                          <span className="w-8 h-8 rounded-full bg-white text-red-600 flex items-center justify-center font-black">
                            ✕
                          </span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* CONFIRMATION / LOCK IN FLOW */}
            {stage === 'ANSWERING' && selectedOption && (
              <div className="pt-4 border-t border-slate-100 flex justify-center animate-in fade-in">
                <button
                  onClick={handleLockPrompt}
                  className="px-9 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-base sm:text-lg shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-5 h-5 fill-current" />
                  <span>KUNCI JAWABAN ({selectedOption})</span>
                </button>
              </div>
            )}

            {/* DRAMATIC QUESTION: "YAKIN?" */}
            {stage === 'CONFIRMING' && (
              <div className="p-6 rounded-2xl bg-amber-50 border-2 border-amber-300 text-center space-y-4 animate-in zoom-in-95">
                <div className="text-lg sm:text-xl font-black text-amber-950">
                  Yakin dengan pilihan <span className="text-amber-700 underline font-black text-2xl">"{selectedOption}"</span>?
                </div>
                <p className="text-xs text-amber-800">
                  Pastikan jawaban sudah sesuai dengan ucapan Absen No. {activeAbsenNumber}!
                </p>
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={handleConfirmLock}
                    className="px-8 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-base shadow-md hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>✅ Yakin, Kunci!</span>
                  </button>

                  <button
                    onClick={handleCancelLock}
                    className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 font-bold text-sm transition-all cursor-pointer"
                  >
                    <span>✏️ Ganti Pilihan</span>
                  </button>
                </div>
              </div>
            )}

            {/* SUSPENSE DRONE ANIMATION */}
            {stage === 'SUSPENSE' && (
              <div className="p-8 rounded-2xl bg-slate-900 text-white text-center space-y-3 animate-pulse">
                <div className="text-2xl font-black text-amber-400">
                  Memeriksa Jawaban...
                </div>
                <p className="text-xs text-slate-300">
                  Menegangkan! Apakah pilihan Absen No. {activeAbsenNumber} tepat?
                </p>
              </div>
            )}

            {/* REVEAL RESULT & EXPLANATION BOX */}
            {stage === 'REVEALED' && (
              <div className="space-y-4 pt-2 animate-in fade-in">
                {/* Result Announcement Banner */}
                {lastIsCorrect ? (
                  <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-400 text-emerald-950 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">🎉</span>
                      <div>
                        <h4 className="text-lg font-black text-emerald-900">
                          JAWABAN BENAR!
                        </h4>
                        <p className="text-xs sm:text-sm text-emerald-800 font-semibold">
                          Kerja hebat untuk Absen No. {activeAbsenNumber}! Jawaban tepat sekali.
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-200 text-emerald-900 font-black uppercase tracking-wider shrink-0">
                      Tepat
                    </span>
                  </div>
                ) : (
                  <div className="p-5 rounded-2xl bg-red-50 border-2 border-red-400 text-red-950 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">💡</span>
                      <div>
                        <h4 className="text-lg font-black text-red-900">
                          BELUM TEPAT!
                        </h4>
                        <p className="text-xs sm:text-sm text-red-800 font-semibold">
                          Jawaban yang benar adalah pilihan <strong className="text-red-950 font-black">{currentQ.correctAnswer}</strong>. Mari kita pelajari penjelasannya bersama!
                        </p>
                      </div>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-red-200 text-red-900 font-black uppercase tracking-wider shrink-0">
                      Perlu Ulas
                    </span>
                  </div>
                )}

                {/* Explanation Box Below the Question */}
                <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 text-white space-y-2 border border-slate-800">
                  <div className="flex items-center justify-between text-xs text-amber-400 font-bold">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Penjelasan Guru &amp; Konsep Word:</span>
                    </div>
                    <span className="text-slate-400">{currentQ.materiRef}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </div>

                {/* Navigation Button: Soal Berikutnya */}
                <div className="flex items-center justify-center pt-4">
                  <button
                    onClick={handleNextQuestion}
                    className="px-9 py-4 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-black text-base sm:text-lg shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>{currentQIdx < totalQuestions - 1 ? 'Soal Berikutnya' : 'Lihat Hasil & Rekomendasi Kelas'}</span>
                    <ArrowRight className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TEACHER BOTTOM CONTROLLER BAR (Always Visible) */}
      <div className="bg-slate-100 rounded-2xl p-4 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQIdx === 0}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1 ${
              currentQIdx === 0
                ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Soal Sebelumnya</span>
          </button>

          <button
            onClick={handleSkipQuestion}
            disabled={currentQIdx >= totalQuestions - 1}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1 ${
              currentQIdx >= totalQuestions - 1
                ? 'bg-slate-200 text-slate-400 border-slate-300 cursor-not-allowed'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 cursor-pointer'
            }`}
          >
            <span>Lewati Soal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {activeAbsenNumber !== null && stage !== 'NEED_ROLL' && (
            <button
              onClick={handleRerollStudent}
              title="Ganti nomor absen yang maju"
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>Putar Ulang Nomor</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-3 text-slate-500 font-semibold">
          <span>Siswa Maju: <strong>{calledNumbers.length}</strong> / {settings.totalStudents}</span>
          <span>·</span>
          <span>Soal Selesai: <strong>{quizResults.length}</strong> / {totalQuestions}</span>
        </div>
      </div>

      {/* SETTINGS MODAL: TOTAL SISWA, DAFTAR ABSEN TIDAK HADIR, TIMER */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center font-black">
                  ⚙️
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">
                    Pengaturan Absen Siswa &amp; Kuis
                  </h3>
                  <p className="text-xs text-slate-500">
                    Atur jumlah siswa kelas dan tandai nomor absen yang tidak hadir
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  playClickSound();
                  setShowSettingsModal(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center text-sm font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Input Total Siswa */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                Jumlah Siswa di Kelas (Default 36):
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={settings.totalStudents}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 36;
                    onUpdateSettings({
                      ...settings,
                      totalStudents: Math.max(1, Math.min(val, 50))
                    });
                  }}
                  className="w-28 px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-center text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
                <span className="text-xs text-slate-500">
                  siswa terdaftar di kelas ini
                </span>
              </div>
            </div>

            {/* Timer Selection */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-slate-700 block">
                Waktu Menjawab Tiap Soal:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { label: 'Tanpa Timer', val: 0 },
                  { label: '10 Detik', val: 10 },
                  { label: '20 Detik (Default)', val: 20 },
                  { label: '30 Detik', val: 30 }
                ].map((opt) => (
                  <button
                    key={opt.val}
                    onClick={() => {
                      playClickSound();
                      onUpdateSettings({
                        ...settings,
                        timeLimit: opt.val
                      });
                    }}
                    className={`px-3 py-2.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                      settings.timeLimit === opt.val
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Checkbox Grid Absen yang Tidak Hadir */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                  Centang Absen yang Tidak Hadir (Izin / Sakit):
                </label>
                <span className="text-[11px] text-slate-500 font-bold">
                  {settings.absentNumbers.length} siswa tidak hadir
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Nomor absen yang dicentang TIDAK AKAN IKUT TERUNDI dalam kuis:
              </p>

              <div className="grid grid-cols-6 sm:grid-cols-9 gap-1.5 p-3 rounded-2xl bg-slate-50 border border-slate-200 max-h-48 overflow-y-auto">
                {Array.from({ length: settings.totalStudents }, (_, i) => i + 1).map((num) => {
                  const isAbsent = settings.absentNumbers.includes(num);
                  const isCalled = calledNumbers.includes(num);

                  return (
                    <button
                      key={num}
                      onClick={() => toggleAbsentNumber(num)}
                      className={`p-2 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                        isAbsent
                          ? 'bg-red-500 text-white border-red-600 line-through'
                          : isCalled
                          ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                          : 'bg-white text-slate-800 border-slate-200 hover:bg-slate-100'
                      }`}
                      title={
                        isAbsent
                          ? `Absen ${num} (Tidak Hadir)`
                          : isCalled
                          ? `Absen ${num} (Sudah Maju)`
                          : `Absen ${num} (Hadir)`
                      }
                    >
                      {num}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-white border border-slate-300" />
                  <span>Hadir</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-red-500" />
                  <span>Tidak Hadir (Dilewati)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-200 border border-emerald-400" />
                  <span>Sudah Pernah Maju</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => {
                  playClickSound();
                  setShowSettingsModal(false);
                }}
                className="px-6 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 cursor-pointer"
              >
                Simpan &amp; Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
