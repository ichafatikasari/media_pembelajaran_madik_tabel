export type GameScreen = 'MENU' | 'PLAYING' | 'QUIZ' | 'RESULT' | 'LEADERBOARD';

export type Lane = 0 | 1 | 2; // 0 = Left, 1 = Center, 2 = Right

export interface Question {
  id: string;
  topic: 'coding' | 'print' | 'str' | 'int' | 'float' | 'bool' | 'variabel';
  topicLabel: string;
  question: string;
  codeSnippet?: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface LeaderboardEntry {
  id: string;
  studentName: string;
  score: number;
  distance: number;
  coins: number;
  quizCorrect: boolean;
  questionTopic: string;
  timestamp: number;
  formattedDate: string;
}

export interface Obstacle {
  id: number;
  lane: Lane;
  z: number; // Distance ahead on track (starts far, e.g. 1000 -> 0)
  type: 'train' | 'barrier' | 'cone';
  height: number;
  width: number;
  canDuckUnder: boolean;
  canJumpOver: boolean;
}

export interface Coin {
  id: number;
  lane: Lane;
  z: number;
  collected: boolean;
}

export interface RunnerState {
  lane: Lane;
  targetLane: Lane;
  laneX: number; // Interpolated X position (-1 to 1)
  y: number; // Jump height (0 = ground, >0 = jumping)
  vy: number;
  isJumping: boolean;
  isSliding: boolean;
  slideTimer: number;
  runFrame: number;
}
