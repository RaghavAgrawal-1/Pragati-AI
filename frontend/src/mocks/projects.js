/**
 * DEMO DATA — not real figures. Shapes mirror the PAIMANA/MoSPI vocabulary so
 * the real payload drops in unchanged. Anything rendered from here must carry
 * a <DemoBadge />.
 */
export const MOCK_PROJECTS = [
  {
    project_id: "PRJ001", project_name: "Delhi Metro Phase IV — Corridor 3",
    ministry: "Housing and Urban Affairs", sector: "Urban Transport", implementing_agency: "DMRC",
    approved_cost: 84500000000, revised_cost: 96200000000, cumulative_expenditure: 61300000000,
    start_date: "2021-04-12", original_completion_date: "2026-03-31", revised_completion_date: "2027-09-30",
    physical_progress: 0.64, status: "Delayed", milestone_status: "Behind schedule", location: "Delhi",
    risk: { level: "high", score: 0.82 }, updated_at: "2026-09-10T09:20:00Z",
  },
  {
    project_id: "PRJ002", project_name: "Eastern Dedicated Freight Corridor — Package 7",
    ministry: "Railways", sector: "Railways", implementing_agency: "DFCCIL",
    approved_cost: 41200000000, revised_cost: 43100000000, cumulative_expenditure: 38900000000,
    start_date: "2019-08-01", original_completion_date: "2025-06-30", revised_completion_date: "2025-12-31",
    physical_progress: 0.91, status: "On track", milestone_status: "On schedule", location: "Uttar Pradesh",
    risk: { level: "low", score: 0.21 }, updated_at: "2026-09-11T04:10:00Z",
  },
  {
    project_id: "PRJ003", project_name: "NH-44 Six-Laning — Section 12",
    ministry: "Road Transport and Highways", sector: "Roads", implementing_agency: "NHAI",
    approved_cost: 18700000000, revised_cost: 24300000000, cumulative_expenditure: 15100000000,
    start_date: "2022-01-20", original_completion_date: "2025-12-31", revised_completion_date: "2027-06-30",
    physical_progress: 0.38, status: "Delayed", milestone_status: "Critical", location: "Madhya Pradesh",
    risk: { level: "critical", score: 0.89 }, updated_at: "2026-09-11T06:45:00Z",
  },
  {
    project_id: "PRJ004", project_name: "Bharatmala Greenfield Expressway — Pkg 21",
    ministry: "Road Transport and Highways", sector: "Roads", implementing_agency: "NHAI",
    approved_cost: 29800000000, revised_cost: 31100000000, cumulative_expenditure: 12400000000,
    start_date: "2023-02-10", original_completion_date: "2027-03-31", revised_completion_date: "2027-03-31",
    physical_progress: 0.41, status: "On track", milestone_status: "On schedule", location: "Rajasthan",
    risk: { level: "medium", score: 0.44 }, updated_at: "2026-09-09T11:05:00Z",
  },
  {
    project_id: "PRJ005", project_name: "Jal Jeevan Rural Water Grid — Cluster 9",
    ministry: "Jal Shakti", sector: "Water", implementing_agency: "State PHED",
    approved_cost: 9600000000, revised_cost: 11800000000, cumulative_expenditure: 7900000000,
    start_date: "2021-11-05", original_completion_date: "2025-09-30", revised_completion_date: "2026-06-30",
    physical_progress: 0.73, status: "Delayed", milestone_status: "Behind schedule", location: "Bihar",
    risk: { level: "high", score: 0.68 }, updated_at: "2026-09-08T15:30:00Z",
  },
  {
    project_id: "PRJ006", project_name: "Ultra Mega Solar Park — Phase II",
    ministry: "New and Renewable Energy", sector: "Power", implementing_agency: "SECI",
    approved_cost: 22400000000, revised_cost: 22400000000, cumulative_expenditure: 19800000000,
    start_date: "2022-06-18", original_completion_date: "2026-03-31", revised_completion_date: "2026-03-31",
    physical_progress: 0.88, status: "On track", milestone_status: "On schedule", location: "Gujarat",
    risk: { level: "low", score: 0.18 }, updated_at: "2026-09-11T02:15:00Z",
  },
];
