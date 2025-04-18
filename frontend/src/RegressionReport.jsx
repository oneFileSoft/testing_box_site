import React, { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { showToastSuccess, showToastError } from "./utils/toastUtils";
import "./App.css";


export default function RegressionReport() {
  const [date, setDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD
  });

  const [builds, setBuilds] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBuilds = async () => {
    if (!date) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/getBuildRecords?date=${date}`);
      console.log("✅ Builds response:", response.data);
      if (response.data.success) {
        setBuilds(response.data.builds);
      } else {
        console.error("⚠️ Failed to fetch builds:", response.data.message);
      }
    } catch (err) {
      console.error("🔥 Error fetching builds:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBuilds();
  }, [date]);

  return (
    <div className="user-container">
      {/* Header row */}

<div className="home-container">
      {/* Header */}
      <header className="header" >
        <div className="top-bar">
          <h2 className="text-2xl font-bold text-gray-800">Regression Report: </h2>
          <label htmlFor="report-date" className="text-gray-700 font-medium"> Select Date: </label>
          <input id="report-date" type="date" value={date} onChange={e => setDate(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1" />
        </div>
      </header>
</div







      {loading ? (
        <p className="text-gray-500">Loading builds...</p>
      ) : builds.length === 0 ? (
        <p className="text-red-600">No builds found for {date}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table-auto w-full border border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-4 py-2">ID</th>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Created</th>
              </tr>
            </thead>
            <tbody>
              {builds.map(build => (
                <tr key={build.id} className="hover:bg-gray-50">
                  <td className="border px-4 py-2">{build.id}</td>
                  <td className="border px-4 py-2">{build.name}</td>
                  <td className="border px-4 py-2">{build.status}</td>
                  <td className="border px-4 py-2">{build.created}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
