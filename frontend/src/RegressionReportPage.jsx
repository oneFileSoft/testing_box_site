import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import pako from 'pako';

export default function RegressionReportPage() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchRecords = async () => {
    if (!date) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/getRegrRecords?date=${date}`);
      console.log("✅ Records response:", response.data);
      if (response.data.success) {
        setRecords(response.data.records);
      } else {
        console.error("⚠️ Failed to fetch records:", response.data.message);
      }
    } catch (err) {
      console.error("🔥 Error fetching records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, [date]);

  const decodeAndDecompress = (bufferObj) => {
    try {
      const compressed = Uint8Array.from(bufferObj.data);
      const decompressed = pako.ungzip(compressed, { to: 'string' });
      return decompressed;
    } catch (e) {
      console.error('Error decompressing binary buffer:', e);
      return '❌ Failed to decompress content';
    }
  };

  const openModal = (encodedData) => {
    const content = decodeAndDecompress(encodedData);
    setModalContent(content);
    setModalVisible(true);
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center justify-between mb-4 border-b pb-2">
        <h2 className="text-xl font-bold text-gray-800 mr-4">Regression tests:</h2>
        <label htmlFor="report-date" className="text-gray-700 mr-2">Select Date</label>
        <input
          id="report-date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <p>Loading...</p>
        ) : records.length === 0 ? (
          <h3 className="text-center text-gray-600">No regression found for this day</h3>
        ) : (
          <div>
            {records.map((record, index) => (
              <div
                key={index}
                className="grid grid-cols-3 gap-4 items-center h-[50px] border-b border-gray-200 px-2"
              >
                <span className={`font-medium ${record.status ? 'text-green-600' : 'text-red-600'}`}>
                  {record.status ? '✅' : '❌'} {record.buildId}
                </span>
                <span className="text-blue-600 cursor-pointer underline" onClick={() => openModal(record.html)}>Show Report</span>
                <span className="text-blue-600 cursor-pointer underline" onClick={() => openModal(record.consol)}>Show Build Trace</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white max-w-3xl w-full p-4 rounded shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setModalVisible(false)}
            >
              ✖
            </button>
            <pre className="whitespace-pre-wrap overflow-y-auto max-h-[70vh]">
              {modalContent}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
