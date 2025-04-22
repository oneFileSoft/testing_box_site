import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import pako from 'pako';
import './RegrReport.css';

export default function RegrReport() {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBuild, setSelectedBuild] = useState(null);
  const [selectedTab, setSelectedTab] = useState('html'); // 'html' or 'console'

  useEffect(() => {
    const fetchRecords = async () => {
      if (!date) return;
      setLoading(true);
      try {
        const response = await axios.get(`/api/getRegrRecords?date=${date}`);
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
    fetchRecords();
  }, [date]);

  const decodeAndDecompress = (bufferObj) => {
    try {
      if (!bufferObj?.data) return '❌ No data';
      const compressed = Uint8Array.from(bufferObj.data);
      return pako.ungzip(compressed, { to: 'string' });
    } catch (e) {
      console.error('Error decompressing:', e);
      return '❌ Failed to decompress';
    }
  };

  const renderContent = () => {
    if (!selectedBuild) return <div>Select a build to view report</div>;

    const title = `Build# ${selectedBuild.buildId} – ${selectedTab === 'html' ? 'HTML (Playwright Report)' : 'Build (Console)'}`;
    const rawContent = selectedTab === 'html'
      ? decodeAndDecompress(selectedBuild.html)
      : decodeAndDecompress(selectedBuild.consol);

    return (
      <>
        <div className="regr-header">
          <h2>{title}</h2>
        </div>
        <div className="regr-body">
          {selectedTab === 'html'
            ? <div dangerouslySetInnerHTML={{ __html: rawContent }} />
            : <pre className="regr-console">{rawContent}</pre>}
        </div>
      </>
    );
  };

  return (
    <div className="regr-container">
      <div className="regr-sidebar">
        {records.map((build) => (
          <div key={build.buildId} className="regr-item">
            <div><b>Build#{build.buildId}</b> - {build.status.toUpperCase()}</div>
            <div className="regr-links">
              <button onClick={() => { setSelectedBuild(build); setSelectedTab('html'); }}>
                HTML
              </button>
              <button onClick={() => { setSelectedBuild(build); setSelectedTab('console'); }}>
                Console
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="regr-content">
        {renderContent()}
      </div>
    </div>
  );
}
