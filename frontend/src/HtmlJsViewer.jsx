import React from 'react';

export default function HtmlJsViewer({ result, isTrace = false }) {
  return (
    <div className="rounded-xl border bg-white shadow-sm p-4 overflow-auto max-h-[70vh]">
      {isTrace ? (
        <pre className="whitespace-pre-wrap text-sm text-gray-800">{result}</pre>
      ) : (
        <iframe
          title="HTML Viewer"
          srcDoc={result}
          sandbox=""
          className="w-full h-[60vh] border rounded"
        />
      )}
    </div>
  );
}
