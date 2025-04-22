
import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import pako from 'pako';

export default function RegrReport() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [records, setRecords] = useState([]);
  const [selected, setSelected] = useState(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRecords = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/api/getRegrRecords?date=${date}`);
        if (response.data.success) {
          setRecords(response.data.builds || []);
        } else {
          console.error('❌ Failed to fetch records');
        }
      } catch (err) {
        console.error('🔥 Error fetching data:', err);
      } finally {
        setLoading(false);
        setSelected(null);
        setContent('');
      }
    };

    fetchRecords();
  }, [date]);

  const decompress = (bufferObj) => {
    try {
      if (!bufferObj?.data) return '❌ No data found';
      const compressed = Uint8Array.from(bufferObj.data);
      return pako.ungzip(compressed, { to: 'string' });
    } catch (err) {
      console.error('❌ Error decompressing content:', err);
      return '❌ Decompression failed';
    }
  };

  const handleSelect = (buildId, type) => {
    const record = records.find((r) => r.buildId === buildId);
    if (!record) return;

    const raw = type === 'html' ? record.html : record.consol;
    const text = decompress(raw);
    setSelected({ buildId, type });
    setContent(text);
  };

 return (
   <div
     className="w-screen h-screen bg-cover bg-center"
     style={{ backgroundImage: `url('/logo.jpg')` }}
   >
     <div className="flex flex-row w-full h-full bg-white bg-opacity-90 overflow-hidden">

       {/* Left Panel (Sidebar) */}
       <div className="w-[20%] h-full overflow-y-auto border-r p-4 bg-gray-100">
         <h2 className="text-lg font-bold mb-4">Regression builds for:</h2>
         <input
           type="date"
           value={date}
           onChange={(e) => setDate(e.target.value)}
           className="mb-4 border px-2 py-1 w-full"
         />
         {loading ? (
           <p>Loading...</p>
         ) : records.length === 0 ? (
           <p>No builds for selected date</p>
         ) : (
           records.map((rec) => (
             <div
               key={rec.buildId}
               className={`p-2 my-2 border rounded cursor-pointer hover:bg-gray-200 ${
                 selected?.buildId === rec.buildId ? 'bg-blue-100' : ''
               }`}
             >
               <div className="flex justify-between items-center">
                 <div className="font-semibold">Build #{rec.buildId}</div>
                 <div className="flex items-center space-x-2">
                   <span
                     className={`w-3 h-3 rounded-full ${
                       rec.status ? 'bg-green-500' : 'bg-red-500'
                     }`}
                   ></span>
                   <span
                     className={`text-sm font-medium ${
                       rec.status ? 'text-green-700' : 'text-red-600'
                     }`}
                   >
                     {rec.status ? 'PASS' : 'FAIL'}
                   </span>
                 </div>
               </div>
               <div className="mt-1 space-x-3">
                 <button
                   onClick={() => handleSelect(rec.buildId, 'html')}
                   className="text-blue-500 hover:underline text-sm"
                 >
                   HTML
                 </button>
                 <button
                   onClick={() => handleSelect(rec.buildId, 'console')}
                   className="text-blue-500 hover:underline text-sm"
                 >
                   Console
                 </button>
               </div>
             </div>
           ))
         )}
       </div>

       {/* Right Panel */}
       <div className="w-[80%] h-full p-4 flex flex-col overflow-hidden">
         {selected ? (
           <>
             <h2 className="text-xl font-bold mb-4">
               Build #{selected.buildId} –{' '}
               {selected.type === 'html' ? 'Playwright Report' : 'Console'}
             </h2>
             <div className="flex-grow min-h-0 border bg-white shadow rounded overflow-auto">
               {selected.type === 'html' ? (
                 <iframe
                   title="HTML Report"
                   srcDoc={content}
                   className="w-full h-full border-0"
                 />
               ) : (
                 <pre className="whitespace-pre-wrap text-sm">{content}</pre>
               )}
             </div>
           </>
         ) : (
           <p className="text-gray-500">Select a build and view HTML or Console output.</p>
         )}
       </div>
     </div>
   </div>
 );

}
