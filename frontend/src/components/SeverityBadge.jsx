const colors = {
  LOW: "#16a34a",
  MEDIUM: "#eab308",
  HIGH: "#dc2626",
};

export default function SeverityBadge({ severity }) {
  return (
    <span
      style={{
        marginLeft: "10px",
        padding: "4px 10px",
        borderRadius: "999px",
        fontSize: "13px",
        fontWeight: 700,
        background: colors[severity],
        color: "#020617",
      }}
    >
      {severity}
    </span>
  );
}
