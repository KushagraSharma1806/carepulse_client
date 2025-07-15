import React, { useState } from "react";

function BMICard({ onClose }) {
  const [form, setForm] = useState({
    height: "",
    weight: "",
    age: "",
    gender: "male",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const calculateBMI = () => {
    const { height, weight, age, gender } = form;

    const h = parseFloat(height);
    const w = parseFloat(weight);
    const a = parseInt(age);

    if (!h || !w || !a || !gender) {
      setError("Please fill all fields correctly.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const heightInMeters = h / 100;
      const bmi = w / (heightInMeters * heightInMeters);

      let status = "Healthy";
      if (bmi < 18.5) status = "Underweight";
      else if (bmi >= 25 && bmi < 29.9) status = "Overweight";
      else if (bmi >= 30) status = "Obese";

      const bmr =
        gender === "male"
          ? 10 * w + 6.25 * h - 5 * a + 5
          : 10 * w + 6.25 * h - 5 * a - 161;

      const calorieIntake = Math.round(bmr * 1.375); // Light activity

      setResult({
        bmi: bmi.toFixed(1),
        status,
        calories: calorieIntake,
      });
      setError("");
      setLoading(false);
    }, 500); // Simulate brief loading
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="bg-white shadow-2xl rounded-2xl p-6 max-w-md w-full mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-green-700">BMI Calculator</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-red-600 text-xl font-bold"
        >
          ×
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <input
            name="height"
            type="number"
            placeholder="Height (cm)"
            value={form.height}
            onChange={handleChange}
            className="w-1/2 px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
          />
          <input
            name="weight"
            type="number"
            placeholder="Weight (kg)"
            value={form.weight}
            onChange={handleChange}
            className="w-1/2 px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="flex gap-3">
          <input
            name="age"
            type="number"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            className="w-1/2 px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
          />
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-1/2 px-3 py-2 border rounded-lg focus:ring-green-500 focus:border-green-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <button
          onClick={calculateBMI}
          disabled={loading}
          className={`w-full flex justify-center items-center py-2 rounded-lg text-white font-semibold transition ${
            loading ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Calculating...
            </>
          ) : (
            "Calculate BMI"
          )}
        </button>

        {error && (
          <p className="text-red-600 text-sm text-center">{error}</p>
        )}

        {result && (
          <div className="mt-4 bg-green-100 text-green-900 p-4 rounded-lg shadow-sm">
            <p className="mb-1"><strong>BMI:</strong> {result.bmi} ({result.status})</p>
            <p><strong>Suggested Calorie Intake:</strong> {result.calories} kcal/day</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default BMICard;
