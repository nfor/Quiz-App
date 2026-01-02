import { useState, useMemo, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import gsap from "gsap";
import { decode } from "html-entities";
import LoadingSpinner from "./LoadingSpinner";

/**
 * Fisher-Yates shuffle algorithm to randomize array
 * @param {Array} arr - Array to shuffle
 * @returns {Array} Shuffled array
 */
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

  const { questions = [], topic, difficulty, count } = location.state || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const questionRef = useRef(null);
  const optionsRef = useRef([]);
  const nextButtonRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    // Animate question entrance with subtle zoom
    gsap.fromTo(
      questionRef.current,
      { 
        opacity: 0,
        y: -10,
        scale: 0.98
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.35,
        ease: "power3.out",
        clearProps: "all"
      }
    );

    // Create smooth entrance timeline
    const tl = gsap.timeline({ defaults: { ease: "power3.out" }});
    
    // Animate options entrance with subtle fade and rise
    tl.fromTo(
      optionsRef.current,
      { 
        opacity: 0,
        y: 10,
        scale: 0.99
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.3,
        stagger: {
          amount: 0.2,  // Total stagger time
          from: "start",
          ease: "power1.in"
        },
        clearProps: "all"
      }
    );

    // Animate next button
    gsap.fromTo(
      nextButtonRef.current,
      {
        opacity: 0,
        y: 20
      },
      {
        opacity: selected ? 1 : 0.5,
        y: 0,
        duration: 0.5,
        ease: "power2.out",
        delay: 0.3
      }
    );
  }, [currentIndex]);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen flex justify-center items-center text-xl font-bold">
        No quiz data. Please go back and start again.
      </div>
    );
  }

  const currentQuestion = useMemo(() => 
    questions[currentIndex],
    [questions, currentIndex]
  );

  const options = useMemo(() => {
    if (!currentQuestion) return [];
    const opts = [
      ...(currentQuestion.incorrect_answers || []),
      currentQuestion.correct_answer,
    ];
    return shuffle(opts);
  }, [currentIndex, questions]);

  /**
   * Handles user selecting an answer option
   * Updates selected state and animates the UI
   * @param {string} option - The selected answer text
   */
  const handleAnswer = (option) => {
    setSelected(option);
    
    // Animate next button appearance
    gsap.to(nextButtonRef.current, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out"
    });

    // Animate selected option
    const selectedButton = optionsRef.current.find(
      (btn, idx) => idx < options.length && options[idx] === option
    );
    
    if (selectedButton) {
      gsap.to(selectedButton, {
        scale: 1.05,
        duration: 0.2,
        ease: "power2.out"
      });
    }
  };

  /**
   * Handles moving to next question or finishing quiz
   * Validates answer, updates score, and navigates to results if quiz is complete
   */
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

    setAnswers(nextAnswers);
    setScore(finalScore);

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((i) => i + 1);
      setSelected(null);
    } else {
      setIsLoading(true);
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

  const progress = ((currentIndex + 1) / questions.length) * 100;

  // Update progress bar animation
  useEffect(() => {
    if (progressRef.current) {
      gsap.to(progressRef.current, {
        width: `${progress}%`,
        duration: 0.6,
        ease: "power2.inOut"
      });
    }
  }, [progress]);

  return (
    <div className="min-h-screen w-screen bg-[#F3E4F4] flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto flex flex-col px-4 py-6 min-h-[80vh] justify-center">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 w-full items-center mb-4">
          <div className="text-[#E90E63] font-semibold text-base sm:text-lg text-center sm:text-left">
            {topic || "General Knowledge"}
          </div>
          <div className="text-[#E90E63] font-semibold text-base sm:text-lg text-center hidden sm:block">
            {difficulty || "Easy"}
          </div>
          <div className="text-[#E90E63] font-semibold text-base sm:text-lg text-center sm:text-right">
            {currentIndex + 1}/{count || questions.length}
          </div>
        </div>

        <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
          <div
            ref={progressRef}
            className="h-2 bg-[#E90E63] rounded-full"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="w-full bg-white rounded-lg shadow-md p-5 mb-6">
          <h2
            ref={questionRef}
            className="text-lg sm:text-xl font-semibold text-center text-gray-800 leading-snug"
          >
            {decode(currentQuestion.question)}
          </h2>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {options.map((option, i) => {
            const isSelected = selected === option;
            const isCorrect =
              selected && option === currentQuestion.correct_answer && isSelected;
            const isWrong =
              selected && option !== currentQuestion.correct_answer && isSelected;

            return (
              <button
                key={i}
                ref={el => optionsRef.current[i] = el}
                onClick={() => handleAnswer(option)}
                disabled={!!selected}
                className={`w-full rounded-lg py-2.5 px-4 font-medium text-base shadow-sm transition-all hover:shadow-md
                  ${
                    isCorrect
                      ? "bg-green-500 text-white"
                      : isWrong
                      ? "bg-red-500 text-white"
                      : "bg-white text-gray-800 hover:bg-[#E90E63] hover:text-white"
                  }`}
              >
                {decode(option)}
              </button>
            );
          })}
        </div>

        <button
          ref={nextButtonRef}
          onClick={handleNext}
          disabled={!selected}
          className="w-full sm:w-1/2 mx-auto rounded-lg bg-[#E90E63] text-white font-semibold py-3 text-base shadow-md hover:bg-[#c20d54] transition-colors disabled:opacity-50 disabled:hover:bg-[#E90E63]"
        >
          {currentIndex + 1 < questions.length ? "Next Question" : "Finish Quiz"}
        </button>
      </div>
    </div>
  );
}
