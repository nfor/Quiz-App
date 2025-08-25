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
    <div className="min-h-screen w-screen bg-[#F3E4F4] flex justify-center">
      <div className="w-full max-w-3xl mx-auto flex flex-col px-6 py-8">
        <div className="bg-white rounded-lg shadow-md w-full p-8 mb-8">
          <h1 className="text-3xl font-bold text-[#E90E63] mb-8">Quiz History</h1>

          {history.length === 0 ? (
            <p className="text-gray-600 text-lg">No past attempts found.</p>
          ) : (
            <ul className="space-y-4">
              {history.map((h, i) => (
                <li
                  key={i}
                  className="p-4 rounded-lg bg-gray-50 border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:justify-between sm:items-center text-base gap-2"
                >
                  <span className="text-gray-700">{h.date}</span>
                  <span className="font-medium text-gray-900">
                    {h.topic || "General"} ({h.difficulty || "Easy"}) -{" "}
                    {h.score}/{h.total} ({h.percentage}%)
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="flex-1 bg-[#E90E63] text-white font-semibold py-4 px-8 rounded-lg hover:bg-[#D00B56] transition-colors text-center"
          >
            Back Home
          </button>

          {history.length > 0 && (
            <button
              onClick={clearHistory}
              className="flex-1 bg-gray-100 text-gray-700 font-semibold py-4 px-8 rounded-lg hover:bg-gray-200 transition-colors text-center"
            >
              Clear History
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
