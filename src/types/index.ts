export type TabId = 
  | 'beranda'
  | 'materi'
  | 'latihan'
  | 'ulasan'
  | 'contoh'
  | 'tantangan'
  | 'kuis'
  | 'hasil';

export interface MaterialItem {
  id: string;
  number: number; // 1 to 7
  title: string;
  subtitle: string;
  summary: string;
  steps: {
    number: number;
    text: string;
    detail?: string;
  }[];
  proTip: string;
  wordActionPrompt: string; // "Praktikkan di Word kamu sekarang!"
  illustrationType: 'concept_grid' | 'insert_table' | 'column_width' | 'merge_cells' | 'align_center' | 'delete_options' | 'insert_options';
}

export interface FlipCardItem {
  id: number;
  title: string;
  frontSummary: string;
  backDetail: string;
  iconName: string;
  relatedMateri: string;
}

export interface SequenceStepItem {
  id: string;
  order: number;
  text: string;
}

export interface ClassChallengeItem {
  id: string;
  targetGroup: string; // e.g. "Baris 1", "Baris 2", etc.
  title: string;
  description: string;
  subMateriRef: string;
  steps: SequenceStepItem[];
  explanation: string;
}

export interface QuizQuestionItem {
  id: number;
  question: string;
  options: {
    key: 'A' | 'B' | 'C' | 'D';
    text: string;
  }[];
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
  materiRef: string;
  topicTag: string;
}

export type GroupStatus = 'belum_mulai' | 'sedang_dikerjakan' | 'selesai';

export interface GroupScore {
  id: number; // 0 for Baris 1, 1 for Baris 2, etc.
  name: string; // 'Baris 1', 'Baris 2', 'Baris 3', 'Baris 4'
  status: GroupStatus;
  attempts: number; // Jumlah percobaan pada tantangan
  hasError: boolean; // Menandai jika percobaan terakhir masih ada langkah salah
  challengeScore: number; // Poin dari tantangan (0 jika belum selesai)
  challengeCompleted: boolean;
  totalScore?: number; // Sama dengan challengeScore
  quizScore?: number; // Dipertahankan 0 untuk kompatibilitas
}

// ==========================================
// TYPES UNTUK MODE KUIS: "PANGGIL NOMOR ABSEN"
// ==========================================

export interface AbsenQuizSettings {
  totalStudents: number; // default 36
  absentNumbers: number[]; // daftar absen yang tidak hadir
  timeLimit: number; // 0 = tanpa timer, 10, 20, 30 (default 20 detik)
  soundEnabled: boolean; // default true
}

export interface AbsenQuizResult {
  questionId: number;
  absenNumber: number;
  selectedOption: 'A' | 'B' | 'C' | 'D';
  correctOption: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  materiRef: string;
  questionText: string;
}

// Kompatibilitas mundur jika diperlukan
export interface Student {
  id: string;
  name: string;
  groupId: number;
  score: number;
  answeredCount: number;
  correctCount: number;
  hasStar: boolean;
}

export interface QuizSettings {
  timeLimit: number;
  correctPoints: number;
  wrongPoints: number;
  soundEnabled: boolean;
  lifelinesEnabled: boolean;
}

export interface QuestionAnswerRecord {
  questionId: number;
  questionText: string;
  studentId: string;
  studentName: string;
  groupId: number;
  selectedOption: 'A' | 'B' | 'C' | 'D';
  correctOption: 'A' | 'B' | 'C' | 'D';
  isCorrect: boolean;
  pointsEarned: number;
  materiRef: string;
}
