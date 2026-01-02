import { QUIZ_SETTINGS } from "../constants/config";

/**
 * Validates quiz parameters before starting a quiz
 * @param {number} topic - The selected topic/category ID
 * @param {string} difficulty - The selected difficulty level
 * @param {number} count - The number of questions requested
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validateQuizParameters(topic, difficulty, count) {
  // Validate topic
  if (!topic || topic <= 0) {
    return {
      isValid: false,
      error: "Please select a valid topic category.",
    };
  }

  // Validate difficulty
  if (!difficulty || !QUIZ_SETTINGS.DIFFICULTIES.includes(difficulty)) {
    return {
      isValid: false,
      error: "Please select a valid difficulty level.",
    };
  }

  // Validate count
  if (!count || !QUIZ_SETTINGS.QUESTION_COUNTS.includes(count)) {
    return {
      isValid: false,
      error: "Please select a valid number of questions.",
    };
  }

  return {
    isValid: true,
    error: null,
  };
}

/**
 * Validates API response for quiz questions
 * @param {Object} data - The API response data
 * @returns {Object} { isValid: boolean, error: string|null }
 */
export function validateQuizResponse(data) {
  if (!data) {
    return {
      isValid: false,
      error: "Invalid response from server.",
    };
  }

  if (data.response_code !== 0) {
    return {
      isValid: false,
      error: "No questions found for this selection. Please try different settings.",
    };
  }

  if (!data.results || data.results.length === 0) {
    return {
      isValid: false,
      error: "No questions available. Please try again later.",
    };
  }

  return {
    isValid: true,
    error: null,
  };
}
