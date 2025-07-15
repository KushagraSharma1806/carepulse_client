import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

const AppointmentTable = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const res = await API.get("/appointments");
        setAppointments(res.data);
      } catch (err) {
        console.error("Error fetching appointments:", err);
        if (err.response?.status === 401) {
          localStorage.removeItem("access_token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const getStatusColor = (status = "") => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          <span className="mr-2">📅</span> Your Appointments
        </h2>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase min-w-[120px]">Reason</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Doctor</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase min-w-[160px]">Scheduled</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase min-w-[160px]">Booked At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {appointments.length > 0 ? (
                appointments.map((appt, index) => (
                  <tr key={appt._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 text-sm text-gray-500">{String(index + 1).padStart(2, '0')}</td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {appt.reason || "—"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {appt.doctor_name || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(appt.status)}`}>
                        {appt.status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {appt.preferred_date ? (
                        <>
                          {new Date(appt.preferred_date + "Z").toLocaleDateString()}
                          {appt.preferred_time && (
                            <span className="ml-1 text-gray-600">at {appt.preferred_time}</span>
                          )}
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {appt.created_at
                        ? new Date(appt.created_at).toLocaleString()
                        : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-4 py-6 text-center text-gray-500">
                    You have no appointments yet. Use the AI Assistant to book one!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AppointmentTable;
