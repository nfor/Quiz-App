/**
 * Centralized error handling utility
 * Provides consistent error logging and user feedback
 */

export const ErrorHandler = {
  /**
   * Logs error to console and tracks it
   * @param {string} context - Where the error occurred
   * @param {Error} error - The error object
   */
  log: (context, error) => {
    console.error(`[${context}] Error:`, error);
  },

  /**
   * Creates a user-friendly error message
   * @param {Error|string} error - The error
   * @param {string} fallbackMessage - Default message if error is unclear
   * @returns {string} User-friendly error message
   */
  getMessage: (error, fallbackMessage = "An unexpected error occurred") => {
    if (typeof error === 'string') {
      return error;
    }
    if (error?.message) {
      return error.message;
    }
    return fallbackMessage;
  },

  /**
   * Handles API fetch errors
   * @param {Error} error - The fetch error
   * @param {string} action - What action was being performed
   * @returns {string} Error message for user
   */
  handleFetchError: (error, action = "fetching data") => {
    ErrorHandler.log('Fetch Error', error);
    
    if (error instanceof TypeError) {
      return `Network error while ${action}. Please check your connection.`;
    }
    
    return `Could not complete ${action}. Please try again later.`;
  },

  /**
   * Handles API response errors
   * @param {Object} data - API response data
   * @returns {string|null} Error message or null if no error
   */
  handleApiResponse: (data) => {
    if (!data) {
      return "Invalid response from server.";
    }

    const responseErrors = {
      1: "No questions found. Try different settings.",
      2: "Invalid request parameters.",
      3: "Could not return a token.",
      4: "Token has returned all possible questions.",
      5: "Too many requests. Please wait a moment.",
    };

    return responseErrors[data.response_code] || null;
  },
};

/**
 * React component to display error messages
 */
export function ErrorAlert({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="w-full mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg flex justify-between items-center">
      <p className="font-semibold">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-700 hover:text-red-900 font-bold"
        >
          ×
        </button>
      )}
    </div>
  );
}
