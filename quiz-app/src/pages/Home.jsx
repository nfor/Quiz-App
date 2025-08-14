// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const TOPICS = ["General Knowledge", "Science", "History", "Entertainment"];
const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const QUESTION_COUNTS = [3, 5, 10];

export default function Home() {
  const navigate = useNavigate();

  const [topic, setTopic] = useState(TOPICS[0]);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);
  const [count, setCount] = useState(QUESTION_COUNTS[0]);

  const startQuiz = () => {
    navigate("/quiz", { state: { topic, difficulty, count } });
  };

  return (
    <div className="min-h-screen w-full flex justify-center bg-[#F3E4F4]">
      {/* Content container */}
      <div className="w-full max-w-5xl flex flex-col items-center px-4">
        {/* Title */}
        <h1 className="mt-10 text-center text-5xl md:text-6xl font-extrabold tracking-wide text-[#E90E63] leading-tight">
          WELCOME TO THE ALX
          <br />
          QUIZ APP
        </h1>

        {/* Main controls */}
        <div className="w-full mt-10 grid gap-8">
          {/* Search bar */}
          <div className="flex justify-center">
            <input
              type="text"
              placeholder="Search topics..."
              className="w-full md:w-2/3 rounded-xl bg-[#E90E63] text-white placeholder-white text-center py-3 shadow-md outline-none"
            />
          </div>

          {/* Dropdowns */}
          <div className="flex flex-wrap justify-center gap-4">
            {/* Topic */}
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="rounded-xl bg-[#E90E63] text-white font-medium px-4 py-3 shadow-md outline-none"
            >
              {TOPICS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            {/* Difficulty */}
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="rounded-xl bg-[#E90E63] text-white font-medium px-6 py-3 shadow-md outline-none"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Question Count */}
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="rounded-xl bg-[#E90E63] text-white font-medium px-6 py-3 shadow-md outline-none"
            >
              {QUESTION_COUNTS.map((num) => (
                <option key={num} value={num}>
                  {num} Questions
                </option>
              ))}
            </select>
          </div>

          {/* Start button */}
          <div className="flex justify-center">
            <button
              onClick={startQuiz}
              className="w-full md:w-2/3 rounded-xl bg-white/80 text-black font-extrabold py-4 shadow-[0_4px_0_rgba(0,0,0,0.15)]"
            >
              START QUIZ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
