import { useState } from "react";
import { analyzeLogs } from "./services/api";
import AnalysisResult from "./components/AnalysisResult";
import LogsViewer from "./components/LogsViewer";

/**
 * Preset time ranges (in minutes)
 */
const TIME_PRESETS = {
  "2m": 2,
  "5m": 5,
  "15m": 15,
  "1h": 60,
  "3h": 180,
  "6h": 360,
  "12h": 720,
  "24h": 1440,
};

export default function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const [preset, setPreset] = useState("1h");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [useCustom, setUseCustom] = useState(false);

  const handleAnalyze = async () => {
    try {
      setLoading(true);
      setData(null); // ✅ IMPORTANT: clear old analysis

      let options = {};

      if (useCustom && customFrom && customTo) {
        options.start = new Date(customFrom).toISOString();
        options.end = new Date(customTo).toISOString();
      } else {
        const minutes = TIME_PRESETS[preset];
        const end = new Date();
        const start = new Date(end.getTime() - minutes * 60 * 1000);

        options.start = start.toISOString();
        options.end = end.toISOString();
      }

      const result = await analyzeLogs(options);
      setData(result);
    } catch (err) {
      console.error(err);
      alert("Failed to analyze logs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <h1>Loki Log Analysis</h1>

          <div style={styles.controls}>
            {/* Time preset dropdown */}
            <select
              value={preset}
              onChange={(e) => {
                setPreset(e.target.value);
                setUseCustom(false);
              }}
              style={styles.select}
            >
              {Object.keys(TIME_PRESETS).map((key) => (
                <option key={key} value={key}>
                  Last {key}
                </option>
              ))}
              <option value="custom">Custom</option>
            </select>

            {/* Custom time range */}
            {preset === "custom" && (
              <div style={styles.customRange}>
                <input
                  type="datetime-local"
                  value={customFrom}
                  onChange={(e) => {
                    setCustomFrom(e.target.value);
                    setUseCustom(true);
                  }}
                  style={styles.input}
                />
                <span style={{ color: "#94a3b8" }}>→</span>
                <input
                  type="datetime-local"
                  value={customTo}
                  onChange={(e) => {
                    setCustomTo(e.target.value);
                    setUseCustom(true);
                  }}
                  style={styles.input}
                />
              </div>
            )}

            <button
              onClick={handleAnalyze}
              style={styles.button}
              disabled={loading}
            >
              {loading ? "Analyzing…" : "Analyze Logs"}
            </button>
          </div>
        </header>

        {data && (
          <>
            <AnalysisResult data={data} />
            <LogsViewer logs={data.logs} />
          </>
        )}
      </div>
    </div>
  );
}

/* -------------------- Styles -------------------- */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a0f1c",
    color: "#e5e7eb",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "32px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "32px",
    flexWrap: "wrap",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  select: {
    background: "#020617",
    color: "#e5e7eb",
    border: "1px solid #1e293b",
    borderRadius: "8px",
    padding: "8px 12px",
  },
  customRange: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  input: {
    background: "#020617",
    color: "#e5e7eb",
    border: "1px solid #1e293b",
    borderRadius: "8px",
    padding: "6px 8px",
  },
  button: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    fontWeight: 600,
    cursor: "pointer",
    boxShadow: "0 0 12px rgba(37,99,235,0.35)",
    opacity: 1,
  },
};
