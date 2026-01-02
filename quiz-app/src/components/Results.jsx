import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { decode } from "html-entities";
import LoadingSpinner from "./LoadingSpinner";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const { score = 0, total = 0, answers = [], topic, difficulty, count } =
    location.state || {};

  const [history, setHistory] = useState([]);
  const [displayScore, setDisplayScore] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const scoreRef = useRef(null);
  const answersRef = useRef([]);
  const buttonsRef = useRef(null);
  const buttonRefs = useRef([]);

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  useEffect(() => {
    // Animate score counter
    gsap.to(scoreRef.current, {
      innerHTML: score,
      duration: 1.5,
      snap: { innerHTML: 1 },
      ease: "power2.out"
    });

    // Animate answer reveals
    gsap.fromTo(
      answersRef.current,
      { 
        opacity: 0, 
        y: 30,
        scale: 0.97
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out",
        delay: 0.3
      }
    );

    // Animate buttons
    gsap.fromTo(
      buttonRefs.current,
      {
        opacity: 0,
        y: 20,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: "power3.out",
        delay: 1.2,
        onComplete: () => {
          // Add hover animations
          buttonRefs.current.forEach(button => {
            button.addEventListener('mouseenter', () => {
              gsap.to(button, {
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out"
              });
            });
            button.addEventListener('mouseleave', () => {
              gsap.to(button, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
              });
            });
          });
        }
      }
    );
  }, [score]);

  useEffect(() => {
    if (total > 0) {
      const attempt = {
        date: new Date().toLocaleString(),
        topic,
        difficulty,
        score,
        total,
        percentage,
      };

      const prev = JSON.parse(localStorage.getItem("quizHistory") || "[]");
      const isDuplicate = prev.some(
        (h) =>
          h.topic === attempt.topic &&
          h.difficulty === attempt.difficulty &&
          h.score === attempt.score &&
          h.total === attempt.total &&
          h.percentage === attempt.percentage
      );
      const updated = isDuplicate ? prev : [attempt, ...prev];
      localStorage.setItem("quizHistory", JSON.stringify(updated));
      setHistory(updated);
    }
  }, [score, total, topic, difficulty, percentage]);

  /**
   * Fetches new questions for the same quiz configuration
   * Allows user to retake the same quiz with new questions
   */
  const retakeQuiz = async () => {
    try {
      setIsLoading(true);
      const categoriesRes = await fetch("https://opentdb.com/api_category.php");
      const categoriesData = await categoriesRes.json();
      const categories = categoriesData.trivia_categories || [];
      
      const selectedCategory = categories.find(cat => cat.name === topic);
      const categoryId = selectedCategory ? selectedCategory.id : "";
      
      const url = `https://opentdb.com/api.php?amount=${count || total}&category=${categoryId}&difficulty=${(difficulty || "easy").toLowerCase()}&type=multiple`;
      const res = await fetch(url);
      const data = await res.json();

      if (!data.results || data.results.length === 0) {
        alert("No questions available. Try again later.");
        setIsLoading(false);
        return;
      }

      navigate("/quiz", {
        state: {
          questions: data.results,
          topic,
          difficulty,
          count: count || total,
        },
      });
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      alert("Could not restart quiz. Please try again later.");
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-screen bg-[#F3E4F4] flex justify-center items-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen bg-[#F3E4F4] flex justify-center">
      <div className="w-full max-w-3xl mx-auto flex flex-col px-6 py-8 text-center">
        <div className="bg-white rounded-lg shadow-md w-full p-8 mb-8">
          <h1 className="text-3xl font-bold text-[#E90E63] mb-4">
            Quiz Finished!
          </h1>
          <p className="text-lg text-gray-700 mb-3">
            You scored <span ref={scoreRef} className="font-bold">0</span> out of{" "}
            <span className="font-bold">{total}</span>
          </p>
          <p className="text-3xl font-extrabold text-gray-900">{percentage}%</p>
        </div>

        <div className="w-full bg-white rounded-lg shadow-md p-8 mb-8 text-left">
          <h2 className="text-2xl font-semibold mb-6 text-[#E90E63]">Review</h2>
          {answers.map((a, i) => (
            <div 
              key={i} 
              className="mb-6 p-4 bg-gray-50 rounded-lg"
              ref={el => answersRef.current[i] = el}
            >
              <p className="text-lg font-semibold text-gray-800 mb-3">
                {i + 1}. {decode(a.question)}
              </p>
              <p className="mb-2">
                Your Answer:{" "}
                <span
                  className={`${
                    a.isCorrect ? "text-green-600" : "text-red-600"
                  } font-bold text-lg`}
                >
                  {decode(a.selected || "No Answer")}
                </span>
              </p>
              {!a.isCorrect && (
                <p className="text-green-600 text-lg">
                  Correct: {decode(a.correct)}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="w-full bg-white rounded-lg shadow-md p-8 text-left">
          <h2 className="text-2xl font-semibold mb-6 text-[#E90E63]">Past Attempts</h2>
          {history.length === 0 ? (
            <p className="text-gray-600 text-lg">No past attempts yet.</p>
          ) : (
            <ul className="space-y-4">
              {history.map((h, i) => (
                <li
                  key={i}
                  className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center text-base gap-2"
                >
                  <span className="text-gray-700">{h.date}</span>
                  <span className="font-medium text-gray-900">
                    {h.topic} ({h.difficulty}) - {h.score}/{h.total} ({h.percentage}%)
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div ref={buttonsRef} className="w-full mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            ref={el => buttonRefs.current[0] = el}
            onClick={() => navigate("/")}
            className="w-full rounded-lg py-3 px-6 font-semibold text-base bg-[#E90E63] text-white shadow-md hover:bg-[#c20d54] transition-all transform"
          >
            Try Another Quiz
          </button>
          <button
            ref={el => buttonRefs.current[1] = el}
            onClick={retakeQuiz}
            className="w-full rounded-lg py-3 px-6 font-semibold text-base bg-white text-gray-800 shadow-md hover:bg-gray-50 transition-all transform"
          >
            Retake Quiz
          </button>
          <button
            ref={el => buttonRefs.current[2] = el}
            onClick={() => navigate("/history")}
            className="w-full rounded-lg py-3 px-6 font-semibold text-base bg-gray-100 text-gray-700 shadow-md hover:bg-gray-200 transition-all transform"
          >
            View History
          </button>
        </div>
      </div>
    </div>
  );
}
