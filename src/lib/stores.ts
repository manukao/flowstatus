import { writable, derived } from 'svelte/store';

interface Session {
  id: string;
  sessionName: string;
  focusedGoal: string;
  duration: number;
  formattedDuration: string;
  focusRating: number;
  score: number;
  timestamp: number;
  isStreakDay: boolean;
}

interface FlowState {
  sessions: Session[];
  streak: number;
  totalScore: number;
  lastSessionDate: Date | null;
}

// Initial state
const initialState: FlowState = {
  sessions: [],
  streak: 0,
  totalScore: 0,
  lastSessionDate: null,
};

// Load state from localStorage if available
const loadState = (): FlowState => {
  if (typeof localStorage === 'undefined') return initialState;

  const savedState = localStorage.getItem('flowStatus');
  if (!savedState) return initialState;

  try {
    const parsedState = JSON.parse(savedState);

    // Convert lastSessionDate string back to Date object if it exists
    if (parsedState.lastSessionDate) {
      parsedState.lastSessionDate = new Date(parsedState.lastSessionDate);
    }

    return parsedState;
  } catch (e) {
    console.error('Failed to parse saved state:', e);
    return initialState;
  }
};

// Create the store
const createFlowStore = () => {
  const { subscribe, set, update } = writable<FlowState>(loadState());

  // Save state to localStorage whenever it changes
  subscribe(state => {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('flowStatus', JSON.stringify(state));
    }
  });

  // Helper to check if a session is from today
  const isToday = (date: Date): boolean => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Helper to check if a session is from yesterday
  const isYesterday = (date: Date): boolean => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    );
  };

  // Calculate score based on duration, rating and streak
  const calculateScore = (
    duration: number,
    rating: number,
    streak: number,
    isFirstSessionOfDay: boolean
  ): number => {
    // Base score: 1 point per minute + rating multiplier
    const minutes = Math.floor(duration / 60);
    const baseScore = Math.max(1, minutes) * rating;

    // Apply streak bonus only for the first session of the day
    const streakBonus = isFirstSessionOfDay ? Math.floor(streak * 1.2) : 0;

    return baseScore + streakBonus;
  };

  // Update streak based on session timestamp
  const updateStreak = (
    currentStreak: number,
    lastSessionDate: Date | null,
    newSessionDate: Date
  ): number => {
    if (!lastSessionDate) return 1; // First session ever

    if (isToday(lastSessionDate)) {
      // Already had a session today, maintain streak
      return currentStreak;
    } else if (isYesterday(lastSessionDate)) {
      // Had a session yesterday, increment streak
      return currentStreak + 1;
    } else {
      // Streak broken, start new streak
      return 1;
    }
  };

  return {
    subscribe,

    // Add a new completed session
    addSession: (sessionData: Omit<Session, 'id' | 'score' | 'timestamp' | 'isStreakDay'>) => {
      update(state => {
        const now = new Date();
        const isFirstSessionOfDay = !state.lastSessionDate || !isToday(state.lastSessionDate);

        // Update streak
        const newStreak = updateStreak(state.streak, state.lastSessionDate, now);

        // Calculate score
        const score = calculateScore(
          sessionData.duration,
          sessionData.focusRating,
          newStreak,
          isFirstSessionOfDay
        );

        // Create new session
        const newSession: Session = {
          id: crypto.randomUUID(),
          ...sessionData,
          score,
          timestamp: now.getTime(),
          isStreakDay: isFirstSessionOfDay,
        };

        // Update total score
        const newTotalScore = state.totalScore + score;

        return {
          sessions: [newSession, ...state.sessions],
          streak: newStreak,
          totalScore: newTotalScore,
          lastSessionDate: now,
        };
      });
    },

    // Reset the store
    reset: () => set(initialState),
  };
};

// Create and export the store
export const flowStore = createFlowStore();
