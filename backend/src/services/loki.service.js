import axios from "axios";

/**
 * Clean and normalize log messages
 */
const cleanMessage = (msg) => {
  if (!msg) return "";

  return msg
    .replace(/\u0000/g, "")
    .replace(/[^\x20-\x7E]/g, "")
    .trim();
};

/**
 * Fetch logs from Grafana Loki
 * - Supports custom time range
 * - Strictly filters logs within time window
 * - Sorts logs by timestamp (newest first)
 */
export const fetchRecentLogs = async ({ start, end } = {}) => {
  try {
    const endMs = end ? new Date(end).getTime() : Date.now();
    const startMs = start
      ? new Date(start).getTime()
      : endMs - 60 * 60 * 1000; // default 1 hour

    const endNs = endMs * 1_000_000;
    const startNs = startMs * 1_000_000;

    const response = await axios.get(
      `${process.env.LOKI_BASE_URL}/loki/api/v1/query_range`,
      {
        params: {
          query: '{job="windows"}',
          limit: 100,
          start: startNs,
          end: endNs,
          direction: "backward",
        },
      }
    );

    const results = response.data?.data?.result || [];
    const logs = [];

    for (const stream of results) {
      for (const [timestampNs, message] of stream.values) {
        const timestampMs = Number(timestampNs) / 1_000_000;

        // 🔒 HARD FILTER — STRICT TIME WINDOW
        if (timestampMs < startMs || timestampMs > endMs) continue;

        const cleaned = cleanMessage(message);
        if (cleaned) {
          logs.push({
            timestamp: timestampMs, // ✅ FIX: return milliseconds
            message: cleaned,
          });
        }
      }
    }

    // 🔽 GLOBAL SORT (newest first)
    logs.sort((a, b) => b.timestamp - a.timestamp);

    return logs;
  } catch (error) {
    console.error("Loki fetch failed:", error.message);
    throw new Error("Failed to fetch logs from Loki");
  }
};

export const fetchLogsFromLoki = fetchRecentLogs;
