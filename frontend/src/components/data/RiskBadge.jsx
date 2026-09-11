import Badge from "../common/Badge";
import { RISK_LEVELS } from "../../constants/riskLevels";
import { formatPercentage } from "../../utils/formatPercentage";
import { riskLevelFromScore } from "../../utils/riskUtils";

/** Dot + label + score. Never colour alone. */
export default function RiskBadge({ level, score, showScore = true }) {
  const key = String(level ?? "").toLowerCase() || riskLevelFromScore(score);
  const meta = RISK_LEVELS[key];
  if (!meta) return <span className="text-[12px] text-muted">—</span>;

  return (
    <Badge className={meta.chip} dot={meta.dot}>
      {meta.label}
      {showScore && score !== undefined && score !== null && (
        <span className="tabular-nums opacity-80">{formatPercentage(score)}</span>
      )}
    </Badge>
  );
}
