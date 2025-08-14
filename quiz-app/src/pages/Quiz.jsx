// src/pages/Quiz.jsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const SAMPLE_QUESTIONS = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "Madrid", "Paris", "Lisbon"],
    answer: "Paris",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Mars", "Venus", "Jupiter", "Saturn"],
    answer: "Mars",
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    options: [
      "William Wordsworth",
      "William Shakespeare",
      "Jane Austen",
      "Mark Twain",
    ],
    answer: "William Shakespeare",
  },
];

export default function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();

  const { topic, difficulty, count } = location.state || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);

  const currentQuestion = SAMPLE_QUESTIONS[currentIndex];

  const handleAnswer = (option) => {
    setSelected(option);
    if (option === currentQuestion.answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 < SAMPLE_QUESTIONS.length) {
      setSelected(null);
      setCurrentIndex(currentIndex + 1);
    } else {
      navigate("/results", { state: { score, total: SAMPLE_QUESTIONS.length } });
    }
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#F3E4F4]">
      <div className="w-full max-w-5xl flex flex-col items-center px-4 py-8">
        {/* Header */}
        <div className="flex flex-wrap justify-between w-full items-center mb-8">
          <div className="text-[#E90E63] font-bold text-xl">
            Topic: {topic || "General Knowledge"}
          </div>
          <div className="text-[#E90E63] font-bold text-xl">
            Difficulty: {difficulty || "Easy"}
          </div>
          <div className="text-[#E90E63] font-bold text-xl">
            Question {currentIndex + 1}/{count || SAMPLE_QUESTIONS.length}
          </div>
        </div>

        {/* Question Box */}
        <div className="w-full bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-center text-gray-800">
            {currentQuestion.question}
          </h2>
        </div>

        {/* Options */}
        <div className="w-full flex flex-col gap-4 mb-6">
          {currentQuestion.options.map((option) => {
            const isSelected = selected === option;
            const isCorrect =
              selected && option === currentQuestion.answer && isSelected;
            const isWrong =
              selected && option !== currentQuestion.answer && isSelected;

            return (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                disabled={!!selected}
                className={`w-full rounded-xl py-4 font-medium text-lg shadow-md
                  ${
                    isCorrect
                      ? "bg-green-500 text-white"
                      : isWrong
                      ? "bg-red-500 text-white"
                      : "bg-[#E90E63] text-white hover:bg-[#c20d54]"
                  }`}
              >
                {option}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={!selected}
          className="w-full md:w-1/2 rounded-xl bg-white/80 text-black font-extrabold py-4 shadow-[0_4px_0_rgba(0,0,0,0.15)] disabled:opacity-50"
        >
          {currentIndex + 1 < SAMPLE_QUESTIONS.length ? "NEXT" : "FINISH"}
        </button>
      </div>
    </div>
  );
}
