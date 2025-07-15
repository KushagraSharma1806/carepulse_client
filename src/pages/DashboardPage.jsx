import React, { useState } from "react";
import Navbar from "../components/Navbar";
import VitalsForm from "../components/VitalsForm";
import VitalsChart from "../components/VitalsChart";
import VitalsTable from "../components/VitalsTable";
import ChatWithAI from "../components/ChatWithAI";
import AppointmentTable from "../components/AppointmentTable";
import BMICard from "../components/BMICard";
import WellnessTipCard from "../components/WellnessTipCard";

const DashboardPage = () => {
  const [showBMI, setShowBMI] = useState(false);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-8 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <h1 className="text-3xl font-bold text-green-700 text-center">Welcome to CarePulse Dashboard</h1>

          {/* Wellness Tip and BMI Toggle */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <WellnessTipCard />
            </div>
            <div className="flex justify-end items-start">
              <button
                onClick={() => setShowBMI(!showBMI)}
                className="bg-green-600 hover:bg-green-700 text-white font-medium px-5 py-2 rounded-xl shadow transition w-full lg:w-auto"
              >
                {showBMI ? 'Close BMI Calculator' : 'Open BMI Calculator'}
              </button>
            </div>
          </div>

          {/* BMI Card Section */}
          {showBMI && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <BMICard onClose={() => setShowBMI(false)} />
            </div>
          )}

          {/* Record New Vitals */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-green-700 mb-4">Record New Vitals</h2>
            <VitalsForm />
          </div>

          {/* AI Assistant + Vitals Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-green-700 mb-4">AI Health Assistant</h2>
              <ChatWithAI />
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-green-700 mb-4">Vitals Trends</h2>
              <VitalsChart />
            </div>
          </div>

          {/* Vitals + Appointments History */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-green-700 mb-4">Vitals History</h2>
              <VitalsTable />
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-green-700 mb-4">Appointments</h2>
              <AppointmentTable />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;