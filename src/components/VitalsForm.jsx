import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const VitalsForm = () => {
  const [formData, setFormData] = useState({
    heart_rate: "",
    bp_systolic: "",
    bp_diastolic: "",
    oxygen: "",
    temperature: "",
    sugar: "",
    symptoms: "",
  });

  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/vitals", formData);
      setMessage("✅ Vitals submitted successfully.");
      setIsError(false);
      setFormData({
        heart_rate: "",
        bp_systolic: "",
        bp_diastolic: "",
        oxygen: "",
        temperature: "",
        sugar: "",
        symptoms: "",
      });
    } catch (err) {
      console.error("Error submitting vitals:", err);
      setIsError(true);
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
      } else {
        setMessage("❌ Failed to submit vitals. Please try again.");
      }
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4 text-green-700">Record New Vitals</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {[
          { name: "heart_rate", label: "Heart Rate (bpm)" },
          { name: "bp_systolic", label: "Blood Pressure - Systolic (mmHg)" },
          { name: "bp_diastolic", label: "Blood Pressure - Diastolic (mmHg)" },
          { name: "oxygen", label: "Oxygen Level (%)" },
          { name: "temperature", label: "Body Temperature (°F)" },
          { name: "sugar", label: "Blood Sugar (mg/dL)" },
        ].map((field) => (
          <input
            key={field.name}
            name={field.name}
            placeholder={field.label}
            type="number"
            value={formData[field.name]}
            onChange={handleChange}
            required
            className="border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          />
        ))}

        <textarea
          name="symptoms"
          placeholder="Describe symptoms (optional)"
          value={formData.symptoms}
          onChange={handleChange}
          rows={3}
          className="col-span-1 md:col-span-2 border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400"
        />

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-green-600 text-white font-medium py-2 rounded-lg hover:bg-green-700 transition"
        >
          Submit Vitals
        </button>
      </form>

      {message && (
        <p
          className={`mt-4 text-center text-sm font-medium ${
            isError ? "text-red-600" : "text-green-600"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default VitalsForm;
