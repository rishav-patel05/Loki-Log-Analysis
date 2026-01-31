import { useState } from "react";

export default function LogsViewer({ logs }) {
  const [open, setOpen] = useState(true);

  if (!logs || logs.length === 0) return null;

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header} onClick={() => setOpen(!open)}>
        <span style={styles.title}>
          {open ? "▼" : "▶"} Analyzed Logs
        </span>
        <span style={styles.count}>{logs.length} entries</span>
      </div>

      {/* Collapsible body */}
      {open && (
        <div style={styles.table}>
          {logs.map((log, i) => (
            <div key={i} style={styles.row}>
              <span style={styles.time}>
                {new Date(Number(log.timestamp) / 1e6).toLocaleTimeString()}
              </span>

              <span style={levelStyle(log.message)}>
                {levelFromMessage(log.message)}
              </span>

              <span style={styles.msg}>{log.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- Helpers ---------- */

const levelFromMessage = (msg) =>
  msg.includes("ERROR")
    ? "ERROR"
    : msg.includes("WARN")
    ? "WARN"
    : "INFO";

const levelStyle = (msg) => ({
  color: msg.includes("ERROR")
    ? "#ef4444"
    : msg.includes("WARN")
    ? "#facc15"
    : "#22c55e",
  fontWeight: 600,
  width: "60px",
});

/* ---------- Styles ---------- */

const styles = {
  wrapper: {
    marginTop: "24px",
    background: "#020617",
    borderRadius: "14px",
    border: "1px solid #1e293b",
    overflow: "hidden",
  },
  header: {
    padding: "14px 18px",
    borderBottom: "1px solid #1e293b",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    cursor: "pointer",
    userSelect: "none",
  },
  title: {
    color: "#38bdf8",
    fontWeight: 600,
    fontSize: "14px",
  },
  count: {
    color: "#94a3b8",
    fontSize: "13px",
  },
  table: {
    fontFamily: "monospace",
    fontSize: "13px",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "90px 70px 1fr",
    gap: "12px",
    padding: "8px 18px",
    borderBottom: "1px solid #020617",
  },
  time: {
    color: "#64748b",
  },
  msg: {
    whiteSpace: "pre-wrap",
  },
};
