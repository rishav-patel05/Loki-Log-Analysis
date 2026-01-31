const BASE_URL = "http://localhost:5000/api/analyze";

/**
 * Analyze logs with optional time range
 *
 * @param {Object} options
 * @param {string|Date} options.start ISO timestamp or Date (optional)
 * @param {string|Date} options.end ISO timestamp or Date (optional)
 */
export async function analyzeLogs(options = {}) {
  const params = new URLSearchParams();

  const now = new Date();

  // ✅ ALWAYS send a time window
  const start =
    options.start
      ? new Date(options.start)
      : new Date(now.getTime() - 60 * 60 * 1000); // default 1 hour

  const end =
    options.end
      ? new Date(options.end)
      : now;

  // 🛡️ Validate dates
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid start or end time");
  }

  params.append("start", start.toISOString());
  params.append("end", end.toISOString());

  const url = `${BASE_URL}?${params.toString()}`;

  const res = await fetch(url, {
    cache: "no-store", // 🔥 prevents stale responses
  });

  if (!res.ok) {
    throw new Error("Failed to analyze logs");
  }

  return res.json();
}
