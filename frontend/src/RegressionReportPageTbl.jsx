
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import pako from 'pako';
import HtmlJsViewer from './HtmlJsViewer';

export default function RegressionReportPageTbl() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTab, setModalTab] = useState('report');
  const [modalContent, setModalContent] = useState({ report: '', trace: '' });
  const [modalLoading, setModalLoading] = useState(false);

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

  const openModal = (record, type) => {
    setModalLoading(true);
    setModalTab(type);
    setModalVisible(true);
    setTimeout(() => {
      const content = decodeAndDecompress(type === 'report' ? record.html : record.consol);
      setModalContent(prev => ({ ...prev, [type]: content }));
      setModalLoading(false);
    }, 100); // Allow modal to render before decompressing
  };

  return (
    <div className="user-regr p-4 flex flex-col flex-1 min-h-0 text-lg w-[70%] mx-auto">
      <div className="shrink-0 mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Regression tests:</h2>
        <div>
          <label htmlFor="report-date" className="text-gray-700 mr-2">Select Date</label>
          <input id="report-date" type="date" value={date} onChange={e => setDate(e.target.value)} className="border border-gray-300 rounded px-2 py-1" />
        </div>
      </div>

      <div className="my_scr border rounded max-h-[70vh]">
        <table className="min-w-full table-auto border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="border px-4 py-2 text-left">Status</th>
              <th className="border px-4 py-2 text-left">Build #</th>
              <th className="border px-4 py-2 text-left">Report</th>
              <th className="border px-4 py-2 text-left">Trace</th>
              <th className="border px-4 py-2 text-left">Created</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" className="text-center py-4">Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-4 text-gray-500">No regression found for this day</td></tr>
            ) : (
              records.map((record, index) => (
                <tr key={index} className="hover:bg-gray-50 border-t">
                  <td className={`border px-4 py-2 font-medium ${record.status ? 'text-green-600' : 'text-red-600'}`}>
                    {record.status ? '✅ Pass' : '❌ Fail'}
                  </td>
                  <td className="border px-4 py-2">{record.buildId}</td>
                  <td className="border px-4 py-2">
                    <span className="text-blue-600 cursor-pointer underline" onClick={() => openModal(record, 'report')}>
                      View Playwright Report
                    </span>
                  </td>
                  <td className="border px-4 py-2">
                    <span className="text-blue-600 cursor-pointer underline" onClick={() => openModal(record, 'trace')}>
                      Show Build Trace
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

      {modalVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white max-w-5xl w-full p-4 rounded shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={() => setModalVisible(false)}
              aria-label="Close modal"
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

            {modalLoading ? (
              <div className="text-center py-10 text-gray-600">Loading content...</div>
            ) : (
              <HtmlJsViewer
                result={modalTab === 'report' ? modalContent.report : modalContent.trace}
                isTrace={modalTab === 'trace'}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
