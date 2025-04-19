import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
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
    <div className="flex flex-col h-screen p-4">
      {/* Header with date selector */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Regression tests:</h2>
        <label htmlFor="report-date" className="text-gray-700 mr-2">Select Date</label>
        <input
          id="report-date"
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          className="border border-gray-300 rounded px-2 py-1"
        />
      </div>

      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto border rounded">
        {loading ? (
          <p className="text-center p-4">Loading...</p>
        ) : records.length === 0 ? (
          <h3 className="text-center text-gray-600 p-4">No regression found for this day</h3>
        ) : (
          <div>
            <div className="grid grid-cols-4 gap-4 font-semibold bg-gray-100 p-2 border-b">
              <span>Status</span>
              <span>Build#</span>
              <span>Results</span>
              <span>Created</span>
            </div>
            {records.map((record, index) => (
              <div
                key={index}
                className="grid grid-cols-4 gap-4 items-center h-[50px] border-b border-gray-200 px-2"
              >
                <span className={`font-medium ${record.status ? 'text-green-600' : 'text-red-600'}`}>
                  {record.status ? '✅' : '❌'}
                </span>
                <span>{record.buildId}</span>
                <span
                  className="text-blue-600 cursor-pointer underline"
                  onClick={() => openModal(record)}
                >
                  View Details
                </span>
                <span className="text-sm text-gray-500">
                  {record.created ? format(new Date(record.created), 'yyyy-MM-dd HH:mm:ss') : ''}
                </span>
              </div>
            ))}
          </div>
        )}
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

            {/* Tabs */}
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

            {/* Content */}
            <pre className="whitespace-pre-wrap overflow-y-auto max-h-[70vh] bg-gray-50 p-4 rounded text-sm text-gray-800">
              {modalTab === 'report' ? modalContent.report : modalContent.trace}
            </pre>
          </div>
        </div>
      )}
    </div>
  );

}
