// src/pages/Quiz.jsx
import { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Quiz() {
  const location = useLocation();
  const navigate = useNavigate();

  // dynamic questions passed from Home
  const { questions = [], topic, difficulty, count } = location.state || {};
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]); // collect review data

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-bold">
        No quiz data. Please go back and start again.
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  // stable shuffled options per question index
  const options = useMemo(() => {
    if (!currentQuestion) return [];
    const opts = [
      ...(currentQuestion.incorrect_answers || []),
      currentQuestion.correct_answer,
    ];
    return shuffle(opts);
  }, [currentIndex, questions]);

  const handleAnswer = (option) => {
    setSelected(option);
    // do not update score here; update on Next to avoid double counting
  };

  const handleNext = () => {
    const isCorrect = selected === currentQuestion.correct_answer;

    const entry = {
      question: currentQuestion.question,
      selected,
      correct: currentQuestion.correct_answer,
      isCorrect,
    };

    const nextAnswers = [...answers, entry];
    const finalScore = score + (isCorrect ? 1 : 0);

    // update local state for continuity if there are more questions
    setAnswers(nextAnswers);
    setScore(finalScore);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
    } else {
      // navigate to results with review payload
      navigate("/results", {
        state: {
          score: finalScore,
          total: questions.length,
          answers: nextAnswers,
          topic,
          difficulty,
        },
      });
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
            Question {currentIndex + 1}/{count || questions.length}
          </div>
        </div>

        {/* Question Box */}
        <div className="w-full bg-white rounded-xl shadow-md p-6 mb-6">
          <h2
            className="text-2xl font-bold text-center text-gray-800"
            dangerouslySetInnerHTML={{ __html: currentQuestion.question }}
          />
        </div>

        {/* Options */}
        <div className="w-full flex flex-col gap-4 mb-6">
          {options.map((option, i) => {
            const isSelected = selected === option;
            const isCorrect =
              selected && option === currentQuestion.correct_answer && isSelected;
            const isWrong =
              selected && option !== currentQuestion.correct_answer && isSelected;

            return (
              <button
                key={i}
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
                dangerouslySetInnerHTML={{ __html: option }}
              />
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          disabled={!selected}
          className="w-full md:w-1/2 rounded-xl bg-white/80 text-black font-extrabold py-4 shadow-[0_4px_0_rgba(0,0,0,0.15)] disabled:opacity-50"
        >
          {currentIndex + 1 < questions.length ? "NEXT" : "FINISH"}
        </button>
      </div>
    </div>
  );
}
