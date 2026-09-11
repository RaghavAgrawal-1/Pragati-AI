import { AlertTriangle } from "lucide-react";
import Button from "../common/Button";

export default function ErrorState({ title = "Unable to load this data.", error, onRetry }) {
  return (
    <div className="flex flex-col items-center px-6 py-14 text-center">
      <AlertTriangle size={22} className="mb-3 text-risk-high" aria-hidden="true" />
      <p className="text-[14px] font-medium text-ink">{title}</p>
      {error?.message && <p className="mt-1.5 max-w-[52ch] text-[13px] leading-relaxed text-muted">{error.message}</p>}
      {onRetry && <Button variant="secondary" size="sm" className="mt-5" onClick={onRetry}>Retry</Button>}
    </div>
  );
}
