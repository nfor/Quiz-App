import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { QuizProvider } from "./contexts/QuizContext";
import LoadingSpinner from "./components/LoadingSpinner";

// Lazy load route components for code splitting
const Home = lazy(() => import("./components/Home.jsx"));
const Quiz = lazy(() => import("./components/Quiz.jsx"));
const Results = lazy(() => import("./components/Results.jsx"));
const History = lazy(() => import("./components/History.jsx"));

/**
 * Fallback component while route chunks are loading
 */
function RouteLoadingFallback() {
  return (
    <div className="min-h-screen w-screen bg-[#F3E4F4] flex items-center justify-center">
      <LoadingSpinner />
    </div>
  );
}

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <QuizProvider>
          <Suspense fallback={<RouteLoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/results" element={<Results />} />
              <Route path="/history" element={<History />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </Suspense>
        </QuizProvider>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
