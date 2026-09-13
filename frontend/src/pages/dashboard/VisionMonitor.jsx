import { useState } from "react";
import {
  Image,
  Loader2,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { visionService } from "../../services/visionService";

export default function VisionMonitor() {
  const [referenceImage, setReferenceImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyze = async () => {
    if (!referenceImage || !currentImage) {
      setError("Please upload both reference and current images.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await visionService.analyze(
        referenceImage,
        currentImage
      );

      setResult(data);
    } catch (err) {
      setError(err.message || "Vision analysis failed.");
    } finally {
      setLoading(false);
    }
  };

  const getPreview = (file) => {
    return file ? URL.createObjectURL(file) : null;
  };

  return (
    <Card className="mt-4 overflow-hidden p-5">
      {/* Header */}
      <div className="mb-5 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy/10">
              <Image size={17} className="text-navy" />
            </div>

            <div>
              <h3 className="text-[14px] font-semibold text-ink">
                Visual Progress Monitor
              </h3>
              <p className="mt-0.5 text-[12px] text-muted">
                AI-powered comparison of project site images
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-muted">
          <Sparkles size={11} />
          AI Vision
        </div>
      </div>

      {/* Image Upload Section */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Reference */}
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted">
            Reference Image
          </p>

          <label className="block cursor-pointer overflow-hidden rounded-xl border border-dashed border-white/[0.12] bg-white/[0.04] transition hover:border-orange/50 hover:bg-white/[0.08]">
            {referenceImage ? (
              <div className="relative">
                <img
                  src={getPreview(referenceImage)}
                  alt="Reference"
                  className="h-48 w-full object-cover"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-black/75 backdrop-blur-sm px-3 py-2 border-t border-white/[0.08]">
                  <p className="truncate text-[11px] font-mono text-ink">
                    {referenceImage.name}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-48 flex-col items-center justify-center">
                <Upload size={24} className="mb-2 text-orange" />
                <p className="text-[13px] font-bold text-ink">
                  Upload earlier image
                </p>
                <p className="mt-1 text-[11px] text-muted">
                  PNG, JPG, WEBP
                </p>
              </div>
            )}

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                setReferenceImage(e.target.files?.[0] ?? null);
                setResult(null);
              }}
            />
          </label>
        </div>

        {/* Current */}
        <div>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted">
            Current Image
          </p>

          <label className="block cursor-pointer overflow-hidden rounded-xl border border-dashed border-white/[0.12] bg-white/[0.04] transition hover:border-orange/50 hover:bg-white/[0.08]">
            {currentImage ? (
              <div className="relative">
                <img
                  src={getPreview(currentImage)}
                  alt="Current"
                  className="h-48 w-full object-cover"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-black/75 backdrop-blur-sm px-3 py-2 border-t border-white/[0.08]">
                  <p className="truncate text-[11px] font-mono text-ink">
                    {currentImage.name}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-48 flex-col items-center justify-center">
                <Upload size={24} className="mb-2 text-orange" />
                <p className="text-[13px] font-bold text-ink">
                  Upload latest image
                </p>
                <p className="mt-1 text-[11px] text-muted">
                  PNG, JPG, WEBP
                </p>
              </div>
            )}

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                setCurrentImage(e.target.files?.[0] ?? null);
                setResult(null);
              }}
            />
          </label>
        </div>
      </div>

      {/* Comparison Indicator */}
      {(referenceImage || currentImage) && (
        <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-muted">
          <span>Reference</span>
          <ArrowRight size={14} className="text-orange" />
          <span>Current</span>
          <ArrowRight size={14} className="text-orange" />
          <span className="font-bold text-orange">AI Telemetry Analysis</span>
        </div>
      )}

      {/* Analyze Button */}
      <div className="mt-4 flex justify-end">
        <Button
          variant="primary"
          size="sm"
          onClick={analyze}
          disabled={loading}
          className="shadow-submit"
        >
          {loading ? (
            <>
              <Loader2 size={15} className="mr-2 animate-spin" />
              Analyzing Site Telemetry...
            </>
          ) : (
            <>
              <Sparkles size={14} className="mr-2" />
              Analyze Visual Progress
            </>
          )}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-[12.5px] text-red-300 font-medium">
          {error}
        </div>
      )}

      {/* Results */}
      {result?.success && (
        <div className="mt-5 border-t border-white/[0.08] pt-5">
          {/* Main Metrics */}
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                Visual Progress
              </p>

              <p className="mt-1 text-2xl font-extrabold text-orange tabular-nums">
                {result.progress?.percentage ?? 0}%
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                Current Stage
              </p>

              <p className="mt-2 text-[14px] font-bold text-ink">
                {result.progress?.status ?? "Unknown"}
              </p>
            </div>

            <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
              <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                AI Confidence
              </p>

              <p className="mt-2 text-[14px] font-extrabold text-emerald-400 tabular-nums">
                {result.progress?.confidence ?? 0}%
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-[11px]">
              <span className="font-bold text-ink">
                Construction Progress
              </span>

              <span className="font-mono text-orange font-bold">
                {result.progress?.percentage ?? 0}%
              </span>
            </div>

            <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.08] border border-white/[0.06]">
              <div
                className="h-full rounded-full bg-orange shadow-[0_0_12px_rgba(232,84,24,0.6)] transition-all duration-700"
                style={{
                  width: `${Math.min(
                    Math.max(result.progress?.percentage ?? 0, 0),
                    100
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Stages */}
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
              <p className="mb-2.5 text-[11px] font-extrabold uppercase tracking-wider text-emerald-400">
                Completed
              </p>

              {result.stages?.completed?.length ? (
                result.stages.completed.map((stage) => (
                  <div
                    key={stage}
                    className="mb-1.5 flex items-center gap-2 text-[12.5px] font-medium text-ink"
                  >
                    <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                    {stage}
                  </div>
                ))
              ) : (
                <p className="text-[12px] text-muted">None detected</p>
              )}
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
              <p className="mb-2.5 text-[11px] font-extrabold uppercase tracking-wider text-orange">
                In Progress
              </p>

              {result.stages?.in_progress?.length ? (
                result.stages.in_progress.map((stage) => (
                  <div
                    key={stage}
                    className="mb-1.5 text-[12.5px] font-semibold text-ink"
                  >
                    • {stage}
                  </div>
                ))
              ) : (
                <p className="text-[12px] text-muted">None detected</p>
              )}
            </div>

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
              <p className="mb-2.5 text-[11px] font-extrabold uppercase tracking-wider text-muted">
                Remaining
              </p>

              {result.stages?.remaining?.length ? (
                result.stages.remaining.map((stage) => (
                  <div
                    key={stage}
                    className="mb-1.5 text-[12.5px] font-medium text-muted"
                  >
                    • {stage}
                  </div>
                ))
              ) : (
                <p className="text-[12px] text-muted">None detected</p>
              )}
            </div>
          </div>

          {/* Key Issues */}
          {result.key_issues?.length > 0 && (
            <div className="mt-5 rounded-xl border border-red-500/25 bg-red-500/[0.08] p-4">
              <div className="flex items-center gap-2 text-[13px] font-bold text-red-400">
                <AlertTriangle size={16} className="text-red-400 shrink-0" />
                Key Issues Detected
              </div>

              <ul className="mt-2.5 space-y-1.5">
                {result.key_issues.map((issue) => (
                  <li
                    key={issue}
                    className="text-[12.5px] leading-relaxed text-red-200/90 font-medium"
                  >
                    • {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendation */}
          {result.recommendation && (
            <div className="mt-4 rounded-xl border border-orange/25 bg-orange/[0.08] p-4">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-orange shrink-0" />

                <p className="text-[11px] font-extrabold uppercase tracking-wider text-orange">
                  AI Recommendation
                </p>
              </div>

              <p className="mt-2 text-[12.5px] leading-relaxed text-ink font-medium">
                {result.recommendation}
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}