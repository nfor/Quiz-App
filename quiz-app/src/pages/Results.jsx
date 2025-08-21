// src/pages/Results.jsx
import { useLocation, useNavigate } from "react-router-dom";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();

  const { score = 0, total = 0, answers = [], topic, difficulty } = location.state || {};

  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#F3E4F4]">
      <div className="w-full max-w-5xl flex flex-col items-center px-4 py-8">
        {/* Score Box */}
        <div className="bg-white rounded-xl shadow-md w-full max-w-lg p-8 mb-6 text-center">
          <h1 className="text-3xl font-bold text-[#E90E63] mb-4">Quiz Finished!</h1>
          <p className="text-lg text-gray-700 mb-2">
            You scored <span className="font-bold">{score}</span> out of{" "}
            <span className="font-bold">{total}</span>
          </p>
          <p className="text-2xl font-extrabold text-gray-900">{percentage}%</p>
          {topic && (
            <p className="text-sm text-gray-500 mt-2">
              Topic: {topic} | Difficulty: {difficulty}
            </p>
          )}
        </div>

        {/* Review Section */}
        <div className="w-full bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Review</h2>
          <div className="flex flex-col gap-6">
            {answers.map((ans, i) => (
              <div key={i} className="border-b pb-4">
                {/* Question */}
                <p
                  className="font-semibold mb-2"
                  dangerouslySetInnerHTML={{ __html: `${i + 1}. ${ans.question}` }}
                />
                {/* Your Answer */}
                <p
                  className={`mb-1 ${
                    ans.isCorrect ? "text-green-600 font-bold" : "text-red-600 font-bold"
                  }`}
                  dangerouslySetInnerHTML={{
                    __html: `Your answer: ${ans.selected || "No answer"}`,
                  }}
                />
                {/* Correct Answer */}
                {!ans.isCorrect && (
                  <p
                    className="text-gray-700"
                    dangerouslySetInnerHTML={{
                      __html: `Correct answer: ${ans.correct}`,
                    }}
                  />
                )}
              </div>
            ))}
          </div>
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
                  questions: answers.map((a) => ({
                    question: a.question,
                    correct_answer: a.correct,
                    incorrect_answers: [], // cannot rebuild full set unless stored
                  })),
                  topic,
                  difficulty,
                  count: total,
                },
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
