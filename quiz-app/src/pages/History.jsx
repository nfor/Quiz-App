// src/pages/History.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function History() {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("quizHistory") || "[]");
    setHistory(stored);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem("quizHistory");
    setHistory([]);
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#F3E4F4]">
      <div className="w-full max-w-5xl flex flex-col items-center px-4 py-8">
        <h1 className="text-3xl font-bold text-[#E90E63] mb-6">Quiz History</h1>

        {history.length === 0 ? (
          <p className="text-gray-700">No past attempts found.</p>
        ) : (
          <ul className="w-full bg-white rounded-xl shadow-md p-6 space-y-4">
            {history.map((h, i) => (
              <li
                key={i}
                className="p-3 rounded-md border shadow-sm flex justify-between text-sm"
              >
                <span>{h.date}</span>
                <span>
                  {h.topic || "General"} ({h.difficulty || "Easy"}) -{" "}
                  {h.score}/{h.total} ({h.percentage}%)
                </span>
              </li>
            ))}
          </ul>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 mt-6 w-full md:w-1/2">
          <button
            onClick={() => navigate("/")}
            className="flex-1 rounded-xl py-4 font-bold bg-[#E90E63] text-white shadow-md hover:bg-[#c20d54]"
          >
            Back Home
          </button>

          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex-1 rounded-xl py-4 font-bold bg-gray-200 text-black shadow-md hover:bg-gray-300"
            >
              Clear History
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
