// src/pages/Score.jsx
import { useLocation, useNavigate } from "react-router-dom";

export default function Score() {
  const location = useLocation();
  const navigate = useNavigate();
  const { score, total } = location.state || { score: 0, total: 0 };

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#F3E4F4]">
      <div className="w-full max-w-5xl flex flex-col items-center px-4 py-8 text-center">
        {/* Score Box */}
        <div className="bg-white rounded-xl shadow-md w-full max-w-lg p-8 mb-6">
          <h1 className="text-3xl font-bold text-[#E90E63] mb-4">Quiz Finished!</h1>
          <p className="text-lg text-gray-700 mb-2">
            You scored <span className="font-bold">{score}</span> out of{" "}
            <span className="font-bold">{total}</span>
          </p>
          <p className="text-2xl font-extrabold text-gray-900">{percentage}%</p>
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
                state: { topic: "General Knowledge", difficulty: "Easy", count: total },
              })
            }
            className="w-full rounded-xl py-4 font-bold bg-white text-black shadow-md hover:bg-gray-100"
          >
            Retake Quiz
          </button>
        </div>
      </div>
    </div>
  );
}
