// src/pages/Home.jsx
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const QUESTION_COUNTS = [3, 5, 10];

export default function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [topic, setTopic] = useState(null);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);
  const [count, setCount] = useState(QUESTION_COUNTS[0]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("https://opentdb.com/api_category.php")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.trivia_categories || []);
        if (data.trivia_categories?.length > 0) {
          setTopic(data.trivia_categories[0].id);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const startQuiz = async () => {
    try {
      const url = `https://opentdb.com/api.php?amount=${count}&category=${topic}&difficulty=${difficulty.toLowerCase()}&type=multiple`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.response_code !== 0 || data.results.length === 0) {
        alert("No questions found for this selection. Try again.");
        return;
      }

      navigate("/quiz", {
        state: { questions: data.results, topic, difficulty, count },
      });
    } catch (err) {
      console.error("Failed to start quiz:", err);
      alert("Could not fetch quiz data. Please try again later.");
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    // Full viewport background
    <div className="min-h-screen w-screen bg-[#F3E4F4] flex items-center justify-center p-0 m-0">
      {/* Centered content container */}
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center px-6 py-8">
        {/* Title */}
        <h1 className="text-center text-4xl font-extrabold tracking-wide text-[#E90E63] leading-tight mb-6">
          WELCOME TO THE ALX <br /> QUIZ APP
        </h1>

        {/* Main controls */}
        <div className="w-full flex flex-col items-center gap-6">
          {/* Search bar */}
          <input
            type="text"
            name="search"
            placeholder="Search topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg bg-[#E90E63] text-white placeholder-white text-center py-3 shadow outline-none text-base"
          />

          {/* Dropdowns */}
          <div className="flex flex-wrap justify-between gap-4 w-full">
            <select
              name="topic"
              value={topic || ''}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-1 rounded-lg bg-[#E90E63] text-white font-medium px-4 py-3 shadow outline-none text-base"
            >
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>

            <select
              name="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="flex-1 rounded-lg bg-[#E90E63] text-white font-medium px-4 py-3 shadow outline-none text-base"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            <select
              name="count"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="flex-1 rounded-lg bg-[#E90E63] text-white font-medium px-4 py-3 shadow outline-none text-base"
            >
              {QUESTION_COUNTS.map((num) => (
                <option key={num} value={num}>
                  {num} Questions
                </option>
              ))}
            </select>
          </div>

          {/* Start button */}
          <button
            onClick={startQuiz}
            className="w-full rounded-lg bg-white/80 text-black font-extrabold py-3 text-lg shadow-[0_2px_0_rgba(0,0,0,0.10)] hover:bg-white/90 transition-colors"
            disabled={!topic || categories.length === 0}
          >
            START QUIZ
          </button>
        </div>
      </div>
    </div>
  );
}
