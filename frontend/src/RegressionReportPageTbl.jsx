import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';  // Add this import
import axios from 'axios';
import pako from 'pako';

export default function RegressionReportPageTbl() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTab, setModalTab] = useState('report');
  const [modalContent, setModalContent] = useState({ report: '', trace: '' });

  const fetchRecords = async () => {
    if (!date) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/getRegrRecords?date=${date}`);
      console.log("✅ Records response:", response.data);
      if (response.data.success) {
        setRecords(response.data.builds || []);
      } else {
        console.error("⚠️ Failed to fetch records:", response.data.message);
        setRecords([]);
      }
    } catch (err) {
      console.error("🔥 Error fetching records:", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [date]);

  const decodeAndDecompress = (bufferObj) => {
    try {
      if (!bufferObj?.data) return '❌ No data';
      const compressed = Uint8Array.from(bufferObj.data);
      return pako.ungzip(compressed, { to: 'string' });
    } catch (e) {
      console.error('Error decompressing binary buffer:', e);
      return '❌ Failed to decompress content';
    }
  };

  const openModal = (record) => {
    setModalContent({
      report: decodeAndDecompress(record.html),
      trace: decodeAndDecompress(record.consol)
    });
    setModalTab('report');
    setModalVisible(true);
  };

  return (
    <div className="user-container p-4 flex flex-col flex-1 min-h-0">
      {/* Top bar: title + date input */}
      <div className="shrink-0 mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Regression tests:</h2>
        <div>
          <label htmlFor="report-date" className="text-gray-700 mr-2">Select Date</label>
          <input id="report-date" type="date" value={date} onChange={e => setDate(e.target.value)} className="border border-gray-300 rounded px-2 py-1" />
        </div>
      </div>

      {/* Scrollable table area
      <div className="overflow-y-auto flex-1 border rounded">*/}
      <div className="my_scr border rounded max-h-[70vh]">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="border px-4 py-2 text-left bg-gray-100">Status</th>
              <th className="border px-4 py-2 text-left bg-gray-100">Build #</th>
              <th className="border px-4 py-2 text-left bg-gray-100">Regression Results</th>
              <th className="border px-4 py-2 text-left bg-gray-100">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4">Loading...</td>
              </tr>
            ) : records.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">No regression found for this day</td>
              </tr>
            ) : (
              records.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className={`border px-4 py-2 font-medium ${record.status ? 'text-green-600' : 'text-red-600'}`}>
                    {record.status ? '✅ Pass' : '❌ Fail'}
                  </td>
                  <td className="border px-4 py-2">{record.buildId}</td>
                  <td className="border px-4 py-2">
                    <span
                      className="text-blue-600 cursor-pointer underline"
                      onClick={() => openModal(record)}
                    >
                      View Details
                    </span>
                  </td>
                  <td className="border px-4 py-2 text-sm text-gray-600">
                    {record.created ? format(new Date(record.created), 'yyyy-MM-dd HH:mm:ss') : ''}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white max-w-4xl w-full p-4 rounded shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setModalVisible(false)}
            >
              ✖
            </button>

            <div className="flex space-x-4 border-b mb-4">
              <button
                className={`pb-2 font-semibold ${modalTab === 'report' ? 'border-b-2 border-blue-500 text-blue-700' : 'text-gray-600'}`}
                onClick={() => setModalTab('report')}
              >
                📝 Report
              </button>
              <button
                className={`pb-2 font-semibold ${modalTab === 'trace' ? 'border-b-2 border-blue-500 text-blue-700' : 'text-gray-600'}`}
                onClick={() => setModalTab('trace')}
              >
                ⚙️ Build Trace
              </button>
            </div>

            <pre className="whitespace-pre-wrap overflow-y-auto max-h-[70vh] bg-gray-50 p-4 rounded text-sm text-gray-800">
              {modalTab === 'report' ? modalContent.report : modalContent.trace}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
