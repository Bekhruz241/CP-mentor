
export enum Role {
  USER = 'user',
  MENTOR = 'mentor'
}

export interface Problem {
  id: string; // Codeforces ID like 123A
  title: string;
  rating: number;
  tags: string[];
}

export interface DailySet {
  date: string;
  topic: string;
  problems: Problem[];
  isRestDay: boolean;
  restReason?: string;
  completed: boolean;
  solvedIds: string[];
}

export interface Message {
  id: string;
  role: Role;
  text: string;
  timestamp: number;
}

export interface UserProfile {
  name: string;
  currentRating: number;
  targetRating: number;
  startDate: string;
  targetDate: string;
}

export interface AppState {
  profile: UserProfile;
  dailySets: Record<string, DailySet>;
  messages: Message[];
  restDays: string[]; // List of YYYY-MM-DD
}
