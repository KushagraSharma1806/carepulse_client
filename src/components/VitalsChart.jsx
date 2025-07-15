import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useVitalsWebSocket from "../hooks/useVitalsWebSocket";
import API from "../api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const VitalsChart = () => {
  const [vitals, setVitals] = useState([]);
  const [filterDays, setFilterDays] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const lineColors = {
    heart_rate: "#e63946",
    bp_systolic: "#2a9d8f",
    bp_diastolic: "#264653",
    oxygen: "#1d3557",
    temperature: "#f4a261",
    sugar: "#6a4c93",
  };

  const alertThresholds = {
    heart_rate: { min: 60, max: 100, emoji: "❤️", label: "Heart Rate" },
    oxygen: { min: 95, max: 100, emoji: "🫁", label: "Oxygen Level" },
    bp_systolic: { min: 90, max: 120, emoji: "💥", label: "Systolic BP" },
    bp_diastolic: { min: 60, max: 80, emoji: "💢", label: "Diastolic BP" },
    temperature: { min: 97, max: 99, emoji: "🌡️", label: "Temperature" },
    sugar: { min: 70, max: 140, emoji: "🩸", label: "Sugar Level" },
  };

  const fetchVitals = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = filterDays === "all" ? "/vitals" : `/vitals?days=${filterDays}`;
      const response = await API.get(url);
      setVitals(response.data.reverse());
      setError(null);
    } catch (error) {
      console.error("Error fetching vitals:", error);
      setError("Failed to load vitals data");
      if (error.response?.status === 401) {
        localStorage.removeItem("access_token");
        navigate("/login");
      }
    } finally {
      setIsLoading(false);
    }
  }, [filterDays, navigate]);

  useVitalsWebSocket((msg) => {
    if (msg.event === "new_vitals") {
      fetchVitals();
    }
  });

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchVitals();
  }, [fetchVitals, navigate]);

  const getAlerts = (latest) => {
    if (!latest) return [];
    return Object.entries(alertThresholds)
      .filter(([key, { min, max }]) => latest[key] < min || latest[key] > max)
      .map(([key, threshold]) => ({
        ...threshold,
        value: latest[key],
        key,
      }));
  };

  const latestVitals = vitals[0];
  const alerts = getAlerts(latestVitals);

  const renderLatestDot = (props, color) => {
    if (props.index === vitals.length - 1) {
      return (
        <g>
          <circle
            cx={props.cx}
            cy={props.cy}
            r={8}
            fill={color}
            stroke="#fff"
            strokeWidth={2}
            className="animate-ping"
          />
          <circle
            cx={props.cx}
            cy={props.cy}
            r={4}
            fill={color}
            stroke="#fff"
            strokeWidth={2}
          />
        </g>
      );
    }
    return null;
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-green-700">Vitals Trend Overview</h2>
        <select
          value={filterDays}
          onChange={(e) => setFilterDays(e.target.value)}
          className="bg-green-50 text-green-900 border border-green-300 px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          disabled={isLoading}
        >
          <option value="all">All Time</option>
          <option value="1">Last 24 Hours</option>
          <option value="7">Last 7 Days</option>
          <option value="30">Last 30 Days</option>
        </select>
      </div>

      {isLoading && (
        <div className="text-center py-8 text-green-600">Loading vitals data...</div>
      )}
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
          {error}
        </div>
      )}

      {!isLoading && vitals.length > 0 && (
        <div className="mb-4 space-y-2">
          {alerts.length === 0 ? (
            <div className="bg-green-100 text-green-800 p-3 rounded-lg">
              ✅ All vitals are within normal range
            </div>
          ) : (
            alerts.map((alert, idx) => (
              <div
                key={alert.key}
                className="bg-red-100 text-red-800 p-3 rounded-lg animate-pulse"
              >
                {alert.emoji} {alert.label}: {alert.value} (Normal: {alert.min}–{alert.max})
              </div>
            ))
          )}
        </div>
      )}

      {!isLoading && vitals.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={vitals}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(t) => new Date(t).toLocaleTimeString()}
              minTickGap={20}
            />
            <YAxis />
            <Tooltip
              formatter={(value, name) => {
                const threshold = alertThresholds[name];
                const label = threshold
                  ? `${threshold.label}${value < threshold.min || value > threshold.max ? " (Abnormal)" : ""}`
                  : name;
                return [`${value}`, label];
              }}
              labelFormatter={(label) => `Time: ${new Date(label).toLocaleString()}`}
            />
            <Legend />
            {Object.entries(lineColors).map(([key, color]) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={color}
                strokeWidth={2}
                activeDot={{ r: 6 }}
                dot={(props) => renderLatestDot(props, color)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        !isLoading && (
          <div className="text-center py-8 text-gray-500">
            No vitals data available.
          </div>
        )
      )}
    </div>
  );
};

export default VitalsChart;
