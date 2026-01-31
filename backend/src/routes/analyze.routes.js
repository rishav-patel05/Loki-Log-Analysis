import express from "express";
import { fetchLogsFromLoki } from "../services/loki.service.js";
import { analyzeLogs } from "../services/openai.service.js";

const router = express.Router();

/**
 * GET /api/analyze
 * Performs AI-based analysis on recent Loki logs
 * Supports optional time range:
 *   ?start=ISO_DATE&end=ISO_DATE
 */
router.get("/analyze", async (req, res) => {
  try {
    let { start, end } = req.query;

    const now = Date.now();

    // ✅ Normalize + defaults
    const endMs = end ? new Date(end).getTime() : now;
    const startMs = start
      ? new Date(start).getTime()
      : endMs - 60 * 60 * 1000; // default = last 1 hour

    // ❌ Invalid date protection
    if (isNaN(startMs) || isNaN(endMs)) {
      return res.status(400).json({
        error: "Invalid start or end timestamp"
      });
    }

    // 🔁 Auto-fix inverted ranges
    const finalStart = Math.min(startMs, endMs);
    const finalEnd = Math.max(startMs, endMs);

    const startISO = new Date(finalStart).toISOString();
    const endISO = new Date(finalEnd).toISOString();

    // 🧪 Debug (keep this for now)
    console.log("Analyze request time range:", {
      start: startISO,
      end: endISO
    });

    // 1️⃣ Fetch logs from Loki (STRICT window)
    const logs = await fetchLogsFromLoki({
      start: startISO,
      end: endISO
    });

    // 🟢 No logs → clean empty response
    if (!logs || logs.length === 0) {
      return res.json({
        analyzedAt: new Date().toISOString(),
        logCount: 0,
        summary: "No logs available for analysis in selected time range",
        severity: "LOW",
        rootCauses: [],
        impactedAreas: [],
        suggestedActions: [],
        logs: []
      });
    }

    // 2️⃣ Analyze logs using OpenAI
    console.log(`Analyzing ${logs.length} logs with OpenAI...`);
    const aiResult = await analyzeLogs(logs);

    // 3️⃣ Structured response (UNCHANGED)
    res.json({
      analyzedAt: new Date().toISOString(),
      analysisType: "incident_analysis",
      logCount: logs.length,

      summary: aiResult.summary || "No summary generated",
      severity: aiResult.severity || "LOW",
      rootCauses: aiResult.rootCauses || [],
      impactedAreas: aiResult.impactedAreas || [],
      suggestedActions: aiResult.suggestedActions || [],

      // 👇 real logs for UI trust
      logs
    });

  } catch (error) {
    console.error("Analyze error:", error);

    res.status(500).json({
      error: "Failed to analyze logs",
      details: error.message
    });
  }
});

export default router;
