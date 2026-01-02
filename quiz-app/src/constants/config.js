// API Configuration
export const API_CONFIG = {
  TRIVIA_BASE_URL: import.meta.env.VITE_TRIVIA_API_URL || "https://opentdb.com/api.php",
  TRIVIA_CATEGORIES_URL: import.meta.env.VITE_TRIVIA_CATEGORIES_URL || "https://opentdb.com/api_category.php",
  QUESTION_TYPE: "multiple",
};

// Quiz Settings
export const QUIZ_SETTINGS = {
  DIFFICULTIES: ["Easy", "Medium", "Hard"],
  QUESTION_COUNTS: [3, 5, 10],
  DEFAULT_DIFFICULTY: "Easy",
  DEFAULT_QUESTION_COUNT: 3,
};

// Local Storage Keys
export const STORAGE_KEYS = {
  QUIZ_HISTORY: "quizHistory",
};

// Response Codes
export const RESPONSE_CODES = {
  SUCCESS: 0,
  NO_QUESTIONS: 1,
  INVALID_PARAMETER: 2,
  TOKEN_NOT_RETURNED: 3,
  TOKEN_EMPTY: 4,
  RATE_LIMIT: 5,
};

// UI Configuration
export const UI_CONFIG = {
  MAX_CATEGORY_DROPDOWN_HEIGHT: "150px",
  BUTTON_DISABLED_OPACITY: 0.5,
};
