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
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
            Reference Image
          </p>

          <label className="block cursor-pointer overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 transition hover:border-navy/40 hover:bg-slate-100">
            {referenceImage ? (
              <div className="relative">
                <img
                  src={getPreview(referenceImage)}
                  alt="Reference"
                  className="h-48 w-full object-cover"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2">
                  <p className="truncate text-[11px] text-white">
                    {referenceImage.name}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-48 flex-col items-center justify-center">
                <Upload size={24} className="mb-2 text-muted" />
                <p className="text-[13px] font-medium text-ink">
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
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
            Current Image
          </p>

          <label className="block cursor-pointer overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 transition hover:border-navy/40 hover:bg-slate-100">
            {currentImage ? (
              <div className="relative">
                <img
                  src={getPreview(currentImage)}
                  alt="Current"
                  className="h-48 w-full object-cover"
                />

                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2">
                  <p className="truncate text-[11px] text-white">
                    {currentImage.name}
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex h-48 flex-col items-center justify-center">
                <Upload size={24} className="mb-2 text-muted" />
                <p className="text-[13px] font-medium text-ink">
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
          <ArrowRight size={14} />
          <span>Current</span>
          <ArrowRight size={14} />
          <span className="font-medium text-navy">AI Analysis</span>
        </div>
      )}

      {/* Analyze Button */}
      <div className="mt-4 flex justify-end">
        <Button
          variant="primary"
          size="sm"
          onClick={analyze}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 size={15} className="mr-2 animate-spin" />
              Analyzing Images...
            </>
          ) : (
            <>
              <Sparkles size={14} className="mr-2" />
              Analyze Progress
            </>
          )}
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-lg border border-risk-high/20 bg-risk-high/5 p-3 text-[12.5px] text-risk-high">
          {error}
        </div>
      )}

      {/* Results */}
      {result?.success && (
        <div className="mt-5 border-t border-line pt-5">
          {/* Main Metrics */}
          <div className="grid gap-3 md:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-[11px] text-muted">
                Visual Progress
              </p>

              <p className="mt-1 text-2xl font-semibold text-ink">
                {result.progress?.percentage ?? 0}%
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-[11px] text-muted">
                Current Stage
              </p>

              <p className="mt-2 text-[14px] font-semibold text-ink">
                {result.progress?.status ?? "Unknown"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-[11px] text-muted">
                AI Confidence
              </p>

              <p className="mt-2 text-[14px] font-semibold text-ink">
                {result.progress?.confidence ?? 0}%
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-5">
            <div className="mb-2 flex justify-between text-[11px]">
              <span className="font-medium text-ink">
                Construction Progress
              </span>

              <span className="text-muted">
                {result.progress?.percentage ?? 0}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-navy transition-all duration-700"
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
            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                Completed
              </p>

              {result.stages?.completed?.length ? (
                result.stages.completed.map((stage) => (
                  <div
                    key={stage}
                    className="mb-1.5 flex items-center gap-2 text-[12.5px] text-ink"
                  >
                    <CheckCircle2 size={14} />
                    {stage}
                  </div>
                ))
              ) : (
                <p className="text-[12px] text-muted">None detected</p>
              )}
            </div>

            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                In Progress
              </p>

              {result.stages?.in_progress?.length ? (
                result.stages.in_progress.map((stage) => (
                  <div
                    key={stage}
                    className="mb-1.5 text-[12.5px] text-ink"
                  >
                    • {stage}
                  </div>
                ))
              ) : (
                <p className="text-[12px] text-muted">None detected</p>
              )}
            </div>

            <div>
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                Remaining
              </p>

              {result.stages?.remaining?.length ? (
                result.stages.remaining.map((stage) => (
                  <div
                    key={stage}
                    className="mb-1.5 text-[12.5px] text-muted"
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
            <div className="mt-5 rounded-xl border border-risk-high/10 bg-risk-high/5 p-4">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-ink">
                <AlertTriangle size={15} />
                Key Issues Detected
              </div>

              <ul className="mt-2 space-y-1.5">
                {result.key_issues.map((issue) => (
                  <li
                    key={issue}
                    className="text-[12.5px] leading-relaxed text-muted"
                  >
                    • {issue}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommendation */}
          {result.recommendation && (
            <div className="mt-4 rounded-xl border border-navy/10 bg-[#F7F8FC] p-4">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-navy" />

                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                  AI Recommendation
                </p>
              </div>

              <p className="mt-2 text-[12.5px] leading-relaxed text-ink">
                {result.recommendation}
              </p>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}