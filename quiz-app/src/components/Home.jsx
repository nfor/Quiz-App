import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import LoadingSpinner from "./LoadingSpinner";
import { QUIZ_SETTINGS, API_CONFIG } from "../constants/config";
import { ANIMATION_DURATIONS, ANIMATION_EASES, STAGGER, SCALE, COLORS, OFFSETS, OPACITY } from "../constants/animations";
import { validateQuizParameters, validateQuizResponse } from "../utils/validation";

export default function Home() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [topic, setTopic] = useState(null);
  const [topicName, setTopicName] = useState("");
  const [difficulty, setDifficulty] = useState(QUIZ_SETTINGS.DEFAULT_DIFFICULTY);
  const [count, setCount] = useState(QUIZ_SETTINGS.DEFAULT_QUESTION_COUNT);
  const [search, setSearch] = useState("");
  const [isManualSelection, setIsManualSelection] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [validationError, setValidationError] = useState(null);

  // Refs for animations
  const titleRef = useRef(null);
  const searchRef = useRef(null);
  const selectsContainerRef = useRef(null);
  const selectRefs = useRef([]);
  const startButtonRef = useRef(null);

  // Animation setup
  useEffect(() => {
    // Create timeline for smooth sequence
    const tl = gsap.timeline({ defaults: { ease: ANIMATION_EASES.POWER_OUT }});

    // Title animation with split lines
    tl.fromTo(titleRef.current.children,
      { 
        y: OFFSETS.NORMAL,
        opacity: OPACITY.HIDDEN
      },
      {
        y: 0,
        opacity: OPACITY.VISIBLE,
        duration: ANIMATION_DURATIONS.SLOW,
        stagger: STAGGER.NORMAL
      }
    );

    // Search bar animation
    tl.fromTo(searchRef.current,
      {
        y: OFFSETS.SMALL,
        opacity: OPACITY.HIDDEN,
        scale: 0.95
      },
      {
        y: 0,
        opacity: OPACITY.VISIBLE,
        scale: SCALE.NORMAL,
        duration: ANIMATION_DURATIONS.NORMAL
      },
      "-=0.4"
    );

    // Selects animation
    tl.fromTo(selectRefs.current,
      {
        x: -OFFSETS.SMALL,
        opacity: OPACITY.HIDDEN,
        scale: 0.95
      },
      {
        x: 0,
        opacity: OPACITY.VISIBLE,
        scale: SCALE.NORMAL,
        duration: ANIMATION_DURATIONS.FAST,
        stagger: STAGGER.SMALL
      },
      "-=0.3"
    );

    // Start button animation
    tl.fromTo(startButtonRef.current,
      {
        y: OFFSETS.SMALL,
        opacity: OPACITY.HIDDEN
      },
      {
        y: 0,
        opacity: OPACITY.VISIBLE,
        duration: ANIMATION_DURATIONS.NORMAL,
        ease: ANIMATION_EASES.BACK
      },
      "-=0.2"
    );

    // Add hover animation for the start button
    startButtonRef.current && gsap.to(startButtonRef.current, {
      scale: SCALE.HOVER,
      duration: ANIMATION_DURATIONS.FAST,
      paused: true,
      ease: ANIMATION_EASES.POWER2_OUT
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetch(API_CONFIG.TRIVIA_CATEGORIES_URL)
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.trivia_categories || []);
        if (data.trivia_categories?.length > 0) {
          setTopic(data.trivia_categories[0].id);
          setTopicName(data.trivia_categories[0].name);
        }
      })
      .catch((err) => console.error("Error fetching categories:", err))
      .finally(() => setIsLoading(false));
  }, []);

  const filteredCategories = useMemo(() => 
    categories.filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase())
    ),
    [categories, search]
  );

  const startQuiz = async () => {
    // Validate parameters
    const validation = validateQuizParameters(topic, difficulty, count);
    if (!validation.isValid) {
      setValidationError(validation.error);
      return;
    }

    try {
      setIsLoading(true);
      setValidationError(null);
      const url = `${API_CONFIG.TRIVIA_BASE_URL}?amount=${count}&category=${topic}&difficulty=${difficulty.toLowerCase()}&type=${API_CONFIG.QUESTION_TYPE}`;
      const res = await fetch(url);
      const data = await res.json();

      // Validate response
      const responseValidation = validateQuizResponse(data);
      if (!responseValidation.isValid) {
        setValidationError(responseValidation.error);
        setIsLoading(false);
        return;
      }

      navigate("/quiz", {
        state: { questions: data.results, topic: topicName, difficulty, count },
      });
    } catch (err) {
      console.error("Failed to start quiz:", err);
      setValidationError("Could not fetch quiz data. Please try again later.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isManualSelection && categories.length > 0) {
      setTopic(categories[0].id);
      setTopicName(categories[0].name);
    }
  }, [categories, isManualSelection]);

  return (
    <div className="min-h-screen w-screen bg-[#F3E4F4] flex items-center justify-center p-0 m-0">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center px-6 py-8">
        {validationError && (
          <div className="w-full mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <p className="font-semibold">{validationError}</p>
          </div>
        )}
        <h1 ref={titleRef} className="text-center text-4xl font-extrabold tracking-wide text-[#E90E63] leading-tight mb-6">
          <div>WELCOME TO THE ALX</div>
          <div>QUIZ APP</div>
        </h1>
        <div className="w-full flex flex-col items-center gap-6">
          {isLoading && categories.length === 0 ? (
            <LoadingSpinner />
          ) : (
            <>
              <input
                ref={searchRef}
                type="text"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (e.target.value.length > 0) {
                    setIsDropdownOpen(true);
                  }
                }}
                onFocus={() => setIsDropdownOpen(true)}
                className="w-full rounded-lg bg-white/80 text-black font-medium px-4 py-3 shadow outline-none text-base placeholder-gray-600 focus:bg-white transition-all"
              />
              <div ref={selectsContainerRef} className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                {/* Custom Topic Dropdown */}
                <div className="relative">
                  {/* Dropdown Trigger Button */}
                  <button
                    ref={el => selectRefs.current[0] = el}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full rounded-lg bg-[#E90E63] text-white font-medium px-4 py-3 shadow outline-none text-base text-left flex justify-between items-center hover:bg-[#d00c59] transition-colors"
                  >
                    <span className="truncate">{topicName || "Select Topic"}</span>
                    <svg
                      className={`w-4 h-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Panel */}
                  {isDropdownOpen && (
                    <>
                      {/* Overlay to detect outside clicks */}
                      <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsDropdownOpen(false)}
                      ></div>
                      
                      {/* Dropdown Content */}
                      <div className="absolute left-0 right-0 mt-2 bg-[#E90E63] rounded-lg shadow-lg z-20">
                        {/* Options List */}
                        <div className="max-h-[150px] overflow-y-auto">
                          {filteredCategories.length > 0 ? (
                            filteredCategories.map((cat) => (
                              <button
                                key={cat.id}
                                onClick={() => {
                                  setTopic(cat.id);
                                  setTopicName(cat.name);
                                  setIsManualSelection(true);
                                  setIsDropdownOpen(false);
                                }}
                                className={`w-full px-4 py-2 text-left text-white hover:bg-blue-500 hover:border-0 transition-colors bg-[#E90E63] ${
                                  topic === cat.id ? "font-medium bg-blue-500" : ""
                                }`}
                              >
                                {cat.name}
                              </button>
                            ))
                          ) : (
                            <div className="px-4 py-2 text-white text-center">
                              No categories found
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <select
                  ref={el => selectRefs.current[1] = el}
                  name="difficulty"
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full rounded-lg bg-[#E90E63] text-white font-medium px-4 py-3 shadow outline-none text-base hover:shadow-lg transition-shadow"
                >
                  {QUIZ_SETTINGS.DIFFICULTIES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>

                <select
                  ref={el => selectRefs.current[2] = el}
                  name="count"
                  value={count}
                  onChange={(e) => setCount(Number(e.target.value))}
                  className="w-full rounded-lg bg-[#E90E63] text-white font-medium px-4 py-3 shadow outline-none text-base hover:shadow-lg transition-shadow"
                >
                  {QUIZ_SETTINGS.QUESTION_COUNTS.map((num) => (
                    <option key={num} value={num}>
                      {num} Questions
                    </option>
                  ))}
                </select>
              </div>

              <button
                ref={startButtonRef}
                onClick={startQuiz}
                className="w-full rounded-lg bg-white/80 text-black font-extrabold py-3 text-lg shadow-[0_2px_0_rgba(0,0,0,0.10)] hover:bg-white/90 transition-all transform disabled:opacity-50 disabled:cursor-not-allowed"
                onMouseEnter={() => !isLoading && gsap.to(startButtonRef.current, { scale: SCALE.HOVER, duration: ANIMATION_DURATIONS.FAST })}
                onMouseLeave={() => !isLoading && gsap.to(startButtonRef.current, { scale: SCALE.NORMAL, duration: ANIMATION_DURATIONS.FAST })}
                disabled={!topic || categories.length === 0 || isLoading}
              >
                {isLoading ? "LOADING..." : "START QUIZ"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
