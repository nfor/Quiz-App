import { useNavigate } from "react-router-dom";

export default function Quiz() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h2 className="text-xl font-semibold mb-4">Question 1</h2>

      <p className="mb-6">What planet is known as the Red Planet?</p>

      <div className="flex flex-col gap-3 mb-6">
        <button className="border p-2 rounded hover:bg-gray-200">Mars</button>
        <button className="border p-2 rounded hover:bg-gray-200">Venus</button>
        <button className="border p-2 rounded hover:bg-gray-200">Jupiter</button>
        <button className="border p-2 rounded hover:bg-gray-200">Saturn</button>
      </div>

      <button
        onClick={() => navigate("/results")}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
      >
        Finish Quiz
      </button>
    </div>
  );
}
