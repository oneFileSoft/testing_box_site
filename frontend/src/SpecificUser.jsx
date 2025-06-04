{showReload && (
  <div style={{ textAlign: "center", marginBottom: "12px" }}>
    <button
      className="btn-reload"
      onClick={handleReload}
      disabled={loading}
      style={{
        padding: "8px 16px",
        fontSize: "1rem",
        backgroundColor: "#f59e0b", // amber-500
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      Reload Latest
    </button>
  </div>
)}
