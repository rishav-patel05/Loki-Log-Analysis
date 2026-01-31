export default function TimeRangeSelector({ value, onChange, custom, onCustomChange }) {
  return (
    <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.select}
      >
        <option value="2m">Last 2 min</option>
        <option value="5m">Last 5 min</option>
        <option value="15m">Last 15 min</option>
        <option value="1h">Last 1 hour</option>
        <option value="3h">Last 3 hours</option>
        <option value="6h">Last 6 hours</option>
        <option value="12h">Last 12 hours</option>
        <option value="24h">Last 24 hours</option>
        <option value="custom">Custom</option>
      </select>

      {value === "custom" && (
        <>
          <input
            type="datetime-local"
            value={custom.start}
            onChange={(e) => onCustomChange({ ...custom, start: e.target.value })}
            style={styles.input}
          />
          <input
            type="datetime-local"
            value={custom.end}
            onChange={(e) => onCustomChange({ ...custom, end: e.target.value })}
            style={styles.input}
          />
        </>
      )}
    </div>
  );
}

const styles = {
  select: {
    background: "#0b1220",
    color: "#e5e7eb",
    border: "1px solid #1f2937",
    borderRadius: 8,
    padding: "8px 12px",
  },
  input: {
    background: "#0b1220",
    color: "#e5e7eb",
    border: "1px solid #1f2937",
    borderRadius: 8,
    padding: "8px",
  },
};
