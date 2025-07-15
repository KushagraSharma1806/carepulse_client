import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const ChatWithAI = () => {
  const [symptoms, setSymptoms] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [appointmentLoading, setAppointmentLoading] = useState(false);
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [showBookingFields, setShowBookingFields] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    setResponse("");
    setShowBookingFields(false); // reset when new analysis is done

    try {
      const res = await API.post("/analyze-symptoms", { symptoms });
      setResponse(res.data.analysis || "No specific advice returned.");
    } catch (err) {
      console.error("Error talking to AI:", err);
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
      } else {
        setResponse("❌ Failed to connect to AI assistant. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!preferredDate || !preferredTime) {
      alert("❗ Please select both preferred date and time.");
      return;
    }

    setAppointmentLoading(true);
    try {
      const payload = {
        reason: symptoms,
        notes: `AI recommendation: ${response}`,
        preferred_date: preferredDate,
        preferred_time: preferredTime,
      };

      const res = await API.post("/appointments", payload);
      alert("✅ Appointment booked successfully!\n\n" + JSON.stringify(res.data, null, 2));
    } catch (err) {
      console.error("Booking error:", err);
      const detail = err.response?.data?.detail;
      alert(`❌ Failed to book appointment:\n${typeof detail === "string" ? detail : JSON.stringify(detail)}`);
      if (err.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
      }
    } finally {
      setAppointmentLoading(false);
    }
  };

  const shouldSuggestAppointment = () => {
    const suggestionKeywords = ["appointment", "consult", "book", "doctor"];
    return suggestionKeywords.some(word => response.toLowerCase().includes(word));
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <div className="flex items-center gap-3 mb-4">
        <div className="bg-green-100 p-2 rounded-full">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-green-700">CarePulse AI Assistant</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="symptoms" className="block text-sm font-medium text-gray-700 mb-1">
            Describe your symptoms
          </label>
          <textarea
            id="symptoms"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            rows="4"
            placeholder="E.g., headache, fever, chest pain..."
            value={symptoms}
            onChange={(e) => setSymptoms(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !symptoms.trim()}
          className={`w-full flex justify-center items-center py-3 px-4 rounded-lg text-white font-medium transition ${
            loading || !symptoms.trim()
              ? "bg-green-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            "Analyze Symptoms"
          )}
        </button>
      </form>

      {response && (
        <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-600 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="bg-green-100 p-2 rounded-full">
              <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800 mb-2">AI Health Advice</h3>
              <p className="text-gray-700 whitespace-pre-wrap">{response}</p>

              {shouldSuggestAppointment() && (
                <>
                  {!showBookingFields ? (
                    <button
                      onClick={() => setShowBookingFields(true)}
                      className="mt-4 inline-flex items-center px-4 py-2 rounded-md text-sm font-medium bg-green-600 text-white hover:bg-green-700"
                    >
                      Book Appointment Now
                    </button>
                  ) : (
                    <>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Date</label>
                          <input
                            type="date"
                            value={preferredDate}
                            onChange={(e) => setPreferredDate(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Time</label>
                          <input
                            type="time"
                            value={preferredTime}
                            onChange={(e) => setPreferredTime(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                          />
                        </div>
                      </div>

                      <button
                        onClick={handleBookAppointment}
                        disabled={appointmentLoading}
                        className={`mt-4 inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition ${
                          appointmentLoading
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : "bg-green-600 text-white hover:bg-green-700"
                        }`}
                      >
                        {appointmentLoading ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Booking...
                          </>
                        ) : (
                          "Confirm Booking"
                        )}
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWithAI;
