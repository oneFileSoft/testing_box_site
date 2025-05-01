import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import pako from 'pako';

export default function RegrReport() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(null);
  const [content, setContent] = useState('');
  const [iframeSrc, setIframeSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [forceRender, setForceRender] = useState(true);

  const fetchRecords = async (targetDate) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/getRegrRecords?date=${targetDate}`);
      if (response.data.success) {
        setRecords(response.data.builds || []);
      } else {
        console.error('❌ Failed to fetch records');
        setRecords([]);
      }
    } catch (err) {
      console.error('🔥 Error fetching data:', err);
      setRecords([]);
    } finally {
      setLoading(false);
      setSelected(null);
      setContent('');
      setIframeSrc(null);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setForceRender(false), 10);
    fetchRecords(date);
    return () => clearTimeout(timer);
  }, []);

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setDate(newDate);
    fetchRecords(newDate);
  };

//   const decompress = (bufferObj) => {
//     try {
//       if (!bufferObj?.data) return '❌ No data found';
//       const compressed = Uint8Array.from(bufferObj.data);
//       return pako.ungzip(compressed, { to: 'string' });
//     } catch (err) {
//       console.error('❌ Error decompressing content:', err);
//       return '❌ Decompression failed';
//     }
//   };
const decompress = (bufferObj) => {
  try {
    if (!bufferObj?.data) return '❌ No data found';
    const compressed = Uint8Array.from(bufferObj.data);
    let html = pako.ungzip(compressed, { to: 'string' });

    // ✅ Strip invalid data URLs (e.g., data/xyz.zip)
    html = html.replace(/"data\/[a-f0-9]{40}\.zip"/g, '""');

    return html;
  } catch (err) {
    console.error('❌ Error decompressing content:', err);
    return '❌ Decompression failed';
  }
};

  const handleSelect = (buildId, type) => {
    const record = records.find((r) => r.buildId === buildId);
    if (!record) return;

    const raw = type === 'html' ? record.html : record.consol;
    let text = decompress(raw);

    if (type === 'console') {
      text = text.replace(/\\n/g, '\n').replace(/\r?\n/g, '\n');
      setContent(text);
      setIframeSrc(null);
    } else {
      text = text.replace(/new URL\("data\/[a-f0-9]{40}\.zip"\)/g, 'new URL("about:blank")');
      const blob = new Blob([text], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setIframeSrc(url);
      setContent('');
    }

    setSelected({ buildId, type });
  };

  return (
    <div className="w-screen h-screen" style={{ marginTop: '20px' }}>
      <table style={{ width: '100%', height: '70%', maxHeight: '70%', backgroundColor: 'rgba(237,255,255,1)' }}>
        <tbody>
          <tr>
            <td style={{ width: '20%', height: '90vh', verticalAlign: 'top', padding: '0' }}>
              <div style={{ height: '100%', maxHeight: 'calc(100vh - 16px)', overflowY: 'auto', padding: '16px' }}>
                <h2 className="text-lg font-bold mb-4">Regression builds for:</h2>
                <input
                  type="date"
                  value={date}
                  onChange={handleDateChange}
                  className="mb-4 border px-2 py-1 w-full"
                />
                <br />
                {loading ? (
                  <p>Loading...</p>
                ) : records.length === 0 ? (
                  <p>No builds for selected date</p>
                ) : (
                  records.map((rec) => (
                    <div
                      key={rec.buildId}
                      className={`p-2 my-2 build-row border rounded cursor-pointer hover:bg-gray-200 ${
                        selected?.buildId === rec.buildId ? 'bg-blue-100' : ''
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-sm font-medium">
                          <span className="font-semibold text-black">Build #{rec.buildId}</span>{' '}
                          <span className={rec.status ? 'green-text' : 'red-text'}>
                            {rec.status ? 'PASS' : 'FAIL'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-1 space-x-3">
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSelect(rec.buildId, 'html');
                          }}
                          className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer transition"
                        >
                          <span className="font-semibold text-black">Playwright 📝</span>
                        </a>
                        &nbsp;
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleSelect(rec.buildId, 'console');
                          }}
                          className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer transition"
                        >
                          <span>Console ⚙</span>
                        </a>
                      </div>
                      <hr />
                    </div>
                  ))
                )}
                <div style={{ height: '48px' }} />
              </div>
            </td>
            <td style={{ width: '80%', height: '100vh', verticalAlign: 'top', padding: '16px' }}>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '85vh',
                  border: '1px solid #ccc',
                  background: '#fff',
                  padding: 0,
                  overflow: 'hidden'
                }}
              >
                {loading ? (
                  <textarea
                    name="message"
                    value={content}
                    readOnly
                    className="w-full h-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{
                      flexGrow: 1,
                      resize: 'none',
                      border: 'none',
                      margin: 0,
                      padding: '12px',
                      fontFamily: 'monospace',
                      backgroundColor: 'white',
                      overflow: 'auto'
                    }}
                  />
                ) : selected ? (
                  selected.type === 'html' ? (
                    <iframe
                      title="HTML Report"
                      src={iframeSrc}
                      sandbox="allow-scripts allow-same-origin"
                      style={{ width: '100%', height: '100%', border: 'none' }}
                    />
                  ) : (
                    <textarea
                      name="message"
                      value={content}
                      className="w-full h-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      style={{ flexGrow: 1, resize: 'none' }}
                    />
                  )
                ) : (
                  <p className="text-gray-500 p-4">Select a build and view HTML or Console output.</p>
                )}
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
