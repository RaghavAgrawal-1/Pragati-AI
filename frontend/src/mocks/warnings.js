/** DEMO DATA — not real. */
export const MOCK_WARNINGS = {
  counts: { critical: 14, high: 38, medium: 62, resolved: 211 },
  items: [
    {
      id: "ALT-2041", severity: "critical", type: "cost_escalation",
      project_id: "PRJ003", project_name: "NH-44 Six-Laning — Section 12",
      message: "Revised cost has crossed 30% above the approved outlay.",
      detected_at: "2026-09-11T06:45:00Z", recommended_action: "Review budget allocation with the implementing agency.",
    },
    {
      id: "ALT-2039", severity: "high", type: "schedule_delay",
      project_id: "PRJ001", project_name: "Delhi Metro Phase IV — Corridor 3",
      message: "Completion has slipped by 18 months against the original date.",
      detected_at: "2026-09-10T09:20:00Z", recommended_action: "Investigate milestone delays on the tunnelling package.",
    },
    {
      id: "ALT-2036", severity: "high", type: "low_progress",
      project_id: "PRJ005", project_name: "Jal Jeevan Rural Water Grid — Cluster 9",
      message: "Physical progress is trailing the expected curve for this stage.",
      detected_at: "2026-09-08T15:30:00Z", recommended_action: "Increase monitoring frequency to fortnightly.",
    },
  ],
};
