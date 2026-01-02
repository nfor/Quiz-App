import { createContext, useContext, useReducer } from 'react';

const QuizContext = createContext();

// Initial state
const initialState = {
  questions: [],
  currentIndex: 0,
  score: 0,
  answers: [],
  topic: null,
  topicName: '',
  difficulty: 'Easy',
  count: 3,
  isLoading: false,
  error: null,
};

// Action types
export const QUIZ_ACTIONS = {
  SET_QUESTIONS: 'SET_QUESTIONS',
  SET_CURRENT_INDEX: 'SET_CURRENT_INDEX',
  SET_SCORE: 'SET_SCORE',
  ADD_ANSWER: 'ADD_ANSWER',
  SET_TOPIC: 'SET_TOPIC',
  SET_TOPIC_NAME: 'SET_TOPIC_NAME',
  SET_DIFFICULTY: 'SET_DIFFICULTY',
  SET_COUNT: 'SET_COUNT',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  RESET_QUIZ: 'RESET_QUIZ',
  INITIALIZE_QUIZ: 'INITIALIZE_QUIZ',
};

// Reducer function
function quizReducer(state, action) {
  switch (action.type) {
    case QUIZ_ACTIONS.SET_QUESTIONS:
      return { ...state, questions: action.payload };
    case QUIZ_ACTIONS.SET_CURRENT_INDEX:
      return { ...state, currentIndex: action.payload };
    case QUIZ_ACTIONS.SET_SCORE:
      return { ...state, score: action.payload };
    case QUIZ_ACTIONS.ADD_ANSWER:
      return { ...state, answers: [...state.answers, action.payload] };
    case QUIZ_ACTIONS.SET_TOPIC:
      return { ...state, topic: action.payload };
    case QUIZ_ACTIONS.SET_TOPIC_NAME:
      return { ...state, topicName: action.payload };
    case QUIZ_ACTIONS.SET_DIFFICULTY:
      return { ...state, difficulty: action.payload };
    case QUIZ_ACTIONS.SET_COUNT:
      return { ...state, count: action.payload };
    case QUIZ_ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };
    case QUIZ_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };
    case QUIZ_ACTIONS.INITIALIZE_QUIZ:
      return {
        ...state,
        questions: action.payload.questions,
        currentIndex: 0,
        score: 0,
        answers: [],
        topic: action.payload.topic,
        topicName: action.payload.topicName,
        difficulty: action.payload.difficulty,
        count: action.payload.count,
      };
    case QUIZ_ACTIONS.RESET_QUIZ:
      return initialState;
    default:
      return state;
  }
}

// Provider component
export function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  return (
    <QuizContext.Provider value={{ state, dispatch }}>
      {children}
    </QuizContext.Provider>
  );
}

// Custom hook to use context
export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within QuizProvider');
  }
  return context;
}
