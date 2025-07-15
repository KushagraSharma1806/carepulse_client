import React, { useEffect, useState } from "react";
import API from "../api"; // ✅ Central API instance

const VitalsTable = () => {
  const [vitals, setVitals] = useState([]);

  useEffect(() => {
    const fetchVitals = async () => {
      try {
        const response = await API.get("/vitals");
        setVitals(response.data);
      } catch (error) {
        console.error("Failed to fetch vitals:", error);
      }
    };

    fetchVitals();
  }, []);

  return (
    <div className="overflow-x-auto">
      <h2 className="text-xl font-semibold text-green-700 mb-4">Vitals History</h2>
      <div className="shadow overflow-hidden rounded-2xl border border-gray-200">
        <table className="min-w-full bg-white">
          <thead className="bg-green-50">
            <tr>
              <th className="px-4 py-3 text-sm font-semibold text-left text-green-800">Timestamp</th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-green-800">Heart Rate</th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-green-800">BP (Sys/Dia)</th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-green-800">Oxygen (%)</th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-green-800">Temp (°F)</th>
              <th className="px-4 py-3 text-sm font-semibold text-center text-green-800">Sugar (mg/dL)</th>
              <th className="px-4 py-3 text-sm font-semibold text-left text-green-800">Symptoms</th>
            </tr>
          </thead>
          <tbody>
            {vitals.length > 0 ? (
              vitals.map((vital) => (
                <tr key={vital.id} className="border-t text-sm text-gray-700 hover:bg-green-50 transition">
                  <td className="px-4 py-3">{new Date(vital.timestamp).toLocaleString()}</td>
                  <td className="px-4 py-3 text-center">{vital.heart_rate}</td>
                  <td className="px-4 py-3 text-center">
                    {vital.bp_systolic}/{vital.bp_diastolic}
                  </td>
                  <td className="px-4 py-3 text-center">{vital.oxygen}</td>
                  <td className="px-4 py-3 text-center">{vital.temperature}</td>
                  <td className="px-4 py-3 text-center">{vital.sugar}</td>
                  <td className="px-4 py-3">{vital.symptoms}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="px-4 py-4 text-center text-gray-500 italic">
                  No vitals data available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VitalsTable;

