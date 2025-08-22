// src/pages/Results.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const { score = 0, total = 0, answers = [], topic, difficulty } =
    location.state || {};

  const [history, setHistory] = useState([]);

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  // Save result on mount
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
      // Remove duplicates: keep only unique attempts based on topic, difficulty, score, total, percentage
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

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#F3E4F4]">
      <div className="w-full max-w-5xl flex flex-col items-center px-4 py-8 text-center">
        {/* Score Box */}
        <div className="bg-white rounded-xl shadow-md w-full max-w-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-[#E90E63] mb-4">
            Quiz Finished!
          </h1>
          <p className="text-lg text-gray-700 mb-2">
            You scored <span className="font-bold">{score}</span> out of{" "}
            <span className="font-bold">{total}</span>
          </p>
          <p className="text-2xl font-extrabold text-gray-900">{percentage}%</p>
        </div>

        {/* Review of questions */}
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6 mb-8 text-left">
          <h2 className="text-xl font-bold mb-4 text-[#E90E63]">Review</h2>
          {answers.map((a, i) => (
            <div key={i} className="mb-4">
              <p
                className="font-semibold text-gray-800"
                dangerouslySetInnerHTML={{ __html: `${i + 1}. ${a.question}` }}
              />
              <p>
                Your Answer:{" "}
                <span
                  className={
                    a.isCorrect ? "text-green-600 font-bold" : "text-red-600 font-bold"
                  }
                  dangerouslySetInnerHTML={{ __html: a.selected || "No Answer" }}
                />
              </p>
              {!a.isCorrect && (
                <p
                  className="text-green-600"
                  dangerouslySetInnerHTML={{ __html: `Correct: ${a.correct}` }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Past History */}
        <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6 mb-8 text-left">
          <h2 className="text-xl font-bold mb-4 text-[#E90E63]">Past Attempts</h2>
          {history.length === 0 ? (
            <p>No past attempts yet.</p>
          ) : (
            <ul className="space-y-2">
              {history.map((h, i) => (
                <li
                  key={i}
                  className="p-3 rounded-md border shadow-sm flex justify-between text-sm"
                >
                  <span>{h.date}</span>
                  <span>
                    {h.topic} ({h.difficulty}) - {h.score}/{h.total} (
                    {h.percentage}%)
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-lg flex flex-col gap-4">
          <button
            onClick={() => navigate("/")}
            className="w-full rounded-xl py-4 font-bold bg-[#E90E63] text-white shadow-md hover:bg-[#c20d54]"
          >
            Try Another Quiz
          </button>
          <button
            onClick={() =>
              navigate("/quiz", {
                state: {
                  topic: topic || "General Knowledge",
                  difficulty: difficulty || "Easy",
                  count: total,
                },
              })
            }
            className="w-full rounded-xl py-4 font-bold bg-white text-black shadow-md hover:bg-gray-100"
          >
            Retake Quiz
          </button>
          <button
  onClick={() => navigate("/history")}
  className="w-full rounded-xl py-4 font-bold bg-gray-200 text-black shadow-md hover:bg-gray-300"
>
  View Full History
</button>

        </div>
      </div>
    </div>
  );
}
