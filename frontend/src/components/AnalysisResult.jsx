export default function AnalysisResult({ data }) {
  return (
    <>
      {/* Incident Overview */}
      <section style={styles.incidentRow}>
        <div style={styles.severityCard}>
          <span style={styles.severityLabel}>Severity</span>
          <span style={{ ...styles.severityBadge, ...severityColor(data.severity) }}>
            {data.severity}
          </span>
        </div>

        <div style={styles.summaryCard}>
          <span style={styles.cardTitle}>Incident Summary</span>
          <p style={styles.summaryText}>{data.summary}</p>
        </div>
      </section>

      {/* Details */}
      <section style={styles.grid}>
        <Card title="Root Causes" items={data.rootCauses} />
        <Card title="Impacted Areas" items={data.impactedAreas} />
        <Card title="Suggested Actions" items={data.suggestedActions} />
      </section>
    </>
  );
}

function Card({ title, items }) {
  return (
    <div style={styles.card}>
      <span style={styles.cardTitle}>{title}</span>
      {items.length > 0 ? (
        <ul style={styles.list}>
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      ) : (
        <span style={styles.muted}>None detected</span>
      )}
    </div>
  );
}

const severityColor = (level) => {
  if (level === "HIGH") return { background: "#dc2626" };
  if (level === "MEDIUM") return { background: "#f59e0b" };
  return { background: "#16a34a" };
};

const styles = {
  incidentRow: {
    display: "grid",
    gridTemplateColumns: "220px 1fr",
    gap: "20px",
    marginBottom: "24px",
  },
  severityCard: {
    background: "#020617",
    borderRadius: "14px",
    padding: "20px",
    border: "1px solid #1e293b",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  severityLabel: {
    color: "#94a3b8",
    fontSize: "12px",
    marginBottom: "8px",
  },
  severityBadge: {
    color: "white",
    fontWeight: 700,
    padding: "6px 14px",
    borderRadius: "999px",
    width: "fit-content",
    fontSize: "13px",
  },
  summaryCard: {
    background: "#020617",
    borderRadius: "14px",
    padding: "20px",
    border: "1px solid #1e293b",
  },
  summaryText: {
    fontSize: "15px",
    lineHeight: 1.6,
    marginTop: "8px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "20px",
    marginBottom: "24px",
  },
  card: {
    background: "#020617",
    borderRadius: "14px",
    padding: "20px",
    border: "1px solid #1e293b",
  },
  cardTitle: {
    fontWeight: 600,
    fontSize: "14px",
    color: "#38bdf8",
    marginBottom: "10px",
    display: "block",
  },
  list: {
    paddingLeft: "18px",
    lineHeight: 1.6,
  },
  muted: {
    color: "#64748b",
    fontSize: "13px",
  },
};
