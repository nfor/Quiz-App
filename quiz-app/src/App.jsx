import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { QuizProvider } from "./contexts/QuizContext";
import Home from "./components/Home";
import Quiz from "./components/Quiz";
import Results from "./components/Results";
import History from "./components/History";

function App() {
  return (
    <ErrorBoundary>
      <QuizProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/quiz" element={<Quiz />} />
            <Route path="/results" element={<Results />} />
            <Route path="/history" element={<History />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </Router>
      </QuizProvider>
    </ErrorBoundary>
  );
}

export default App;
