import { useNavigate } from "react-router-dom";

export default function Results() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Your Score: 8 / 10</h2>

      <button
        onClick={() => navigate("/")}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        Back to Home
      </button>

      <button
        onClick={() => navigate("/quiz")}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      >
        Retake Quiz
      </button>
    </div>
  );
}
