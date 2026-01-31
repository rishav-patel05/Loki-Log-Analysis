export default function AnalyzeButton({ onClick, loading }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      style={{
        padding: "10px 20px",
        fontSize: "16px",
        cursor: "pointer",
      }}
    >
      {loading ? "Analyzing..." : "Analyze Logs"}
    </button>
  );
}
