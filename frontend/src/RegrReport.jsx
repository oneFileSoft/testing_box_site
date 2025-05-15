import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import pako from 'pako';

export default function RegrReport() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(null);
  const [content, setContent] = useState('');
  const [iframeSrcDoc, setIframeSrcDoc] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch builds for a given date
  const fetchRecords = async (targetDate) => {
    setLoading(true);
    try {
      const resp = await axios.get(`/api/getRegrRecords?date=${targetDate}`);
      setRecords(resp.data.success ? resp.data.builds || [] : []);
    } catch (err) {
      console.error('Fetch error:', err);
      setRecords([]);
    } finally {
      setLoading(false);
      setSelected(null);
      setContent('');
      setIframeSrcDoc('');
    }
  };

  // on mount
  useEffect(() => {
    fetchRecords(date);
  }, []);

  const handleDateChange = (e) => {
    const d = e.target.value;
    setDate(d);
    fetchRecords(d);
  };

  // decompress a pako‐gzipped Uint8Array payload
  const decompress = (bufferObj) => {
    try {
      if (!bufferObj?.data) return '';
      const bin = Uint8Array.from(bufferObj.data);
      return pako.ungzip(bin, { to: 'string' });
    } catch (err) {
      console.error('Decompression error:', err);
      return '';
    }
  };

  // When user clicks one of the build links
  const handleSelect = (buildId, type) => {
    const rec = records.find(r => r.buildId === buildId);
    if (!rec) return;

    // pick the right compressed blob
    let rawBlob;
    if (type === 'console') {
      rawBlob = rec.consol;
    } else if (type === 'html') {
      rawBlob = rec.html;
    } else if (type === 'jmeterrecord') {
      rawBlob = rec.jmeterHtml;
    } else {
      return;
    }

    const text = decompress(rawBlob);
    setSelected({ buildId, type });

    if (type === 'console') {
      // show console in textarea
      setIframeSrcDoc('');
      setContent(text.replace(/\\n/g, '\n'));
    } else {
      // inject a little safe-script to neutralize data-zip URLs if needed
      const safeScript = `
        <script>
          const orig = window.URL;
          window.URL = function(input, base) {
            if (input && typeof input === 'string' && input.endsWith('.zip')) {
              return new orig('about:blank');
            }
            return new orig(input, base);
          };
          window.URL.createObjectURL = orig.createObjectURL.bind(orig);
        </script>
      `;
      // put it right after <head> if present
      let htmlWithScript = text;
      if (text.includes('<head>')) {
        htmlWithScript = text.replace('<head>', `<head>${safeScript}`);
      } else {
        htmlWithScript = safeScript + text;
      }
      setContent('');
      setIframeSrcDoc(htmlWithScript);
    }
  };

  return (
    <div style={{ marginTop: 20, width: '100vw', height: '100vh' }}>
      <div style={{ display: 'flex', height: '100%' }}>
        {/* Sidebar */}
        <div style={{ width: '20%', overflowY: 'auto', padding: 16, borderRight: '1px solid #ddd' }}>
          <h2>Regression builds for:</h2>
          <input type="date" value={date} onChange={handleDateChange} style={{ marginBottom: 16 }} />
          {loading ? (
            <p>Loading…</p>
          ) : records.length === 0 ? (
            <p>No builds</p>
          ) : (
            records.map(r => (
              <div
                key={r.buildId}
                onClick={() => handleSelect(r.buildId, 'html')}
                style={{
                  padding: 8,
                  marginBottom: 8,
                  border: selected?.buildId === r.buildId && selected.type==='html' ? '2px solid #007acc' : '1px solid #ccc',
                  cursor: 'pointer'
                }}
              >
                <strong>Build #{r.buildId}</strong>{' '}
                <span style={{ color: r.status ? 'green' : 'red' }}>
                  {r.status ? 'PASS' : 'FAIL'}
                </span>
                <div style={{ marginTop: 6 }}>
                  <button onClick={e => { e.stopPropagation(); handleSelect(r.buildId, 'html'); }}>
                    Playwright 📝
                  </button>{' '}
                  <button onClick={e => { e.stopPropagation(); handleSelect(r.buildId, 'jmeterrecord'); }}>
                    JMeter 🔥
                  </button>{' '}
                  <button onClick={e => { e.stopPropagation(); handleSelect(r.buildId, 'console'); }}>
                    Console ⚙
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Main view */}
        <div style={{ flexGrow: 1, padding: 16 }}>
          {loading ? (
            <p>Loading…</p>
          ) : !selected ? (
            <p>Select a build and view its report.</p>
          ) : selected.type === 'console' ? (
            <textarea
              readOnly
              value={content}
              style={{ width: '100%', height: '100%', fontFamily: 'monospace' }}
            />
          ) : (
            <iframe
              title="Report"
              sandbox="allow-scripts allow-same-origin"
              srcDoc={iframeSrcDoc}
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

// import React, { useState, useEffect } from 'react';
// import { format } from 'date-fns';
// import axios from 'axios';
// import pako from 'pako';
//
// export default function RegrReport() {
//   const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
//   const [records, setRecords] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [content, setContent] = useState('');
//   const [iframeSrc, setIframeSrc] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [forceRender, setForceRender] = useState(true);
//
//   const fetchRecords = async (targetDate) => {
//     setLoading(true);
//     try {
//       const response = await axios.get(`/api/getRegrRecords?date=${targetDate}`);
//       if (response.data.success) {
//         setRecords(response.data.builds || []);
//       } else {
//         console.error('❌ Failed to fetch records');
//         setRecords([]);
//       }
//     } catch (err) {
//       console.error('🔥 Error fetching data:', err);
//       setRecords([]);
//     } finally {
//       setLoading(false);
//       setSelected(null);
//       setContent('');
//     }
//   };
//
//   useEffect(() => {
//     const timer = setTimeout(() => setForceRender(false), 10);
//     fetchRecords(date);
//     return () => clearTimeout(timer);
//   }, []);
//
//   const handleDateChange = (e) => {
//     const newDate = e.target.value;
//     setDate(newDate);
//     fetchRecords(newDate);
//   };
//
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
//
//   const handleSelect = (buildId, type) => {
//     const record = records.find((r) => r.buildId === buildId);
//     if (!record) return;
//
//     const raw = type === 'html' ? record.html : record.consol;
//     let text = decompress(raw);
//
//     if (type === 'console') {
//       text = text.replace(/\\n/g, '\n').replace(/\r?\n/g, '\n');
//       setContent(text);
//       setIframeSrc(null);
//     } else {
//       const safeScript = `
//         <script>
//           const originalURL = window.URL;
//           window.URL = function(input, base) {
//             if (typeof input === 'string' && input.startsWith('data/') && input.endsWith('.zip')) {
//               return new originalURL('about:blank');
//             }
//             return new originalURL(input, base);
//           };
//           window.URL.createObjectURL = originalURL.createObjectURL.bind(originalURL);
//         </script>
//       `;
//
//       if (text.includes('<head>')) {
//         text = text.replace('<head>', `<head>${safeScript}`);
//       } else if (text.includes('</body>')) {
//         text = text.replace('</body>', `${safeScript}</body>`);
//       } else {
//         text = `${safeScript}${text}`;
//       }
//
//       const blob = new Blob([text], { type: 'text/html' });
//       const url = URL.createObjectURL(blob);
//       setIframeSrc(url);
//       setContent('');
//     }
//
//     setSelected({ buildId, type });
//   };
//
//   return (
//     <div className="w-screen h-screen" style={{ marginTop: '20px' }}>
//       <table style={{ width: '100%', height: '70%', maxHeight: '70%', backgroundColor: 'rgba(237,255,255,1)' }}>
//         <tbody>
//           <tr>
//             <td style={{ width: '20%', height: '90vh', verticalAlign: 'top', padding: '0' }}>
//               <div style={{ height: '100%', maxHeight: 'calc(100vh - 16px)', overflowY: 'auto', padding: '16px' }}>
//                 <h2 className="text-lg font-bold mb-4">Regression builds for:</h2>
//                 <input type="date" value={date} onChange={handleDateChange} className="mb-4 border px-2 py-1 w-full" />
//                 <br />
//                 {loading ? (
//                   <p>Loading...</p>
//                 ) : records.length === 0 ? (
//                   <p>No builds for selected date</p>
//                 ) : (
//                   records.map((rec) => (
//                     <div
//                       key={rec.buildId}
//                       className={`p-2 my-2 build-row border rounded cursor-pointer hover:bg-gray-200 ${
//                         selected?.buildId === rec.buildId ? 'bg-blue-100' : ''
//                       }`}
//                     >
//                       <div className="flex justify-between items-center">
//                         <div className="text-sm font-medium">
//                           <span className="font-semibold text-black">Build #{rec.buildId}</span>{' '}
//                           <span className={rec.status ? 'green-text' : 'red-text'}>
//                             {rec.status ? 'PASS' : 'FAIL'}
//                           </span>
//                         </div>
//                       </div>
//                       <div className="mt-1 space-x-3">
//                         <a href="#" onClick={(e) => { e.preventDefault(); handleSelect(rec.buildId, 'html'); }}
//                           className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer transition" >
//                           <span className="font-semibold text-black">Playwright 📝</span>
//                         </a>
//                         &nbsp;
//                         <a href="#" onClick={(e) => { e.preventDefault(); handleSelect(rec.buildId, 'jmeterrecord'); }}
//                           className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer transition" >
//                           <span className="font-semibold text-black">JMeter 🔥</span></a>
//                         &nbsp;
//                         <a href="#" onClick={(e) => { e.preventDefault(); handleSelect(rec.buildId, 'console'); }}
//                           className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer transition" >
//                           <span>Console ⚙</span></a>
//                       </div>
//                       <hr />
//                     </div>
//                   ))
//                 )}
//                 <div style={{ height: '48px' }} />
//               </div>
//             </td>
//
//             <td style={{ width: '80%', height: '100vh', verticalAlign: 'top', padding: '16px' }}>
//               <div
//                 style={{
//                   display: 'flex',
//                   flexDirection: 'column',
//                   height: '85vh',
//                   border: '1px solid #ccc',
//                   background: '#fff',
//                   padding: 0,
//                   overflow: 'hidden'
//                 }}
//               >
//                 {loading ? (
//                   <textarea
//                     name="message"
//                     value={content}
//                     readOnly
//                     className="w-full h-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                     style={{
//                       flexGrow: 1,
//                       resize: 'none',
//                       border: 'none',
//                       margin: 0,
//                       padding: '12px',
//                       fontFamily: 'monospace',
//                       backgroundColor: 'white',
//                       overflow: 'auto'
//                     }}
//                   />
//                 ) : selected ? (
//                   selected.type === 'html' ? (
//                     <iframe
//                       title="HTML Report"
//                       src={iframeSrc}
//                       sandbox="allow-scripts allow-same-origin"
//                       style={{ width: '100%', height: '100%', border: 'none' }}
//                     />
//                   ) : (
//                     <textarea
//                       name="message"
//                       value={content}
//                       className="w-full h-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//                       style={{ flexGrow: 1, resize: 'none' }}
//                     />
//                   )
//                 ) : (
//                   <p className="text-gray-500 p-4">Select a build and view HTML or Console output.</p>
//                 )}
//               </div>
//             </td>
//           </tr>
//         </tbody>
//       </table>
//     </div>
//   );
// }
