import React from 'react';

export default function HtmlJsViewer({ result, isTrace = false }) {
  const renderContent = () => {
    if (!result || typeof result !== 'string') {
      return <div className="text-red-600">❌ Invalid content</div>;
    }

    if (isTrace) {
      return <pre className="whitespace-pre-wrap text-sm text-gray-800">{result}</pre>;
    }

    return (
      <iframe
        title="HTML Viewer"
        srcDoc={result}
        sandbox="allow-scripts allow-same-origin"
        className="w-full h-full border-none rounded"
      />
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-lg w-[95vw] h-[90vh] p-2 overflow-hidden">
        <button
          onClick={() => window.history.back()} // replace with setShowModal(false) if needed
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
        >
          ❌
        </button>
        <div className="w-full h-full">{renderContent()}</div>
      </div>
    </div>
  );
}
