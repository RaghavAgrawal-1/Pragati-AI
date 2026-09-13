import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BrainCircuit,
  IndianRupee,
  Loader2,
  RefreshCw,
  ShieldAlert,
  Timer,
  TrendingUp,
  Image,
  Upload,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  FileText,
} from "lucide-react";
import { visionService } from "../../services/visionService";
import MoSPIBriefModal from "../../components/common/MoSPIBriefModal";

import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import RiskBadge from "../../components/data/RiskBadge";
import ErrorState from "../../components/feedback/ErrorState";
import { projectService } from "../../services/projectService";
import { api } from "../../services/apiClient";
import { formatCurrency } from "../../utils/formatCurrency";

function getRisk(project) {
  const cost =
    project.revised_cost && project.approved_cost
      ? ((project.revised_cost - project.approved_cost) /
          project.approved_cost) *
        100
      : 0;

  const progress = Number(project.physical_progress ?? 0);
  const status = String(project.status ?? "").toLowerCase();

  let score = 0;

  if (cost > 20) score += 40;
  else if (cost > 10) score += 30;
  else if (cost > 5) score += 10;

  if (progress < 30) score += 40;
  else if (progress < 50) score += 30;
  else if (progress < 70) score += 15;
  else score += 5;

  if (
    status.includes("delay") ||
    status.includes("stop") ||
    status.includes("critical")
  ) {
    score += 30;
  }

  if (score >= 70) return { level: "HIGH", score };
  if (score >= 40) return { level: "MEDIUM", score };
  return { level: "LOW", score };
}

export default function ProjectDetails() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [referenceImage, setReferenceImage] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [visionResult, setVisionResult] = useState(null);
  const [visionLoading, setVisionLoading] = useState(false);
  const [visionError, setVisionError] = useState("");
  const [briefOpen, setBriefOpen] = useState(false);

  const loadProject = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await projectService.get(id);
      setProject(data);
    } catch (err) {
      setError(err.message || "Unable to load project.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProject();
  }, [id]);

  const risk = useMemo(
    () => (project ? getRisk(project) : null),
    [project]
  );

  const runAnalysis = async () => {
    setAnalyzing(true);
    setError("");

    try {
      const response = await api.post(`/api/agent/analyze/${id}`);
      const data = response.result ?? response;

      setAnalysis(data);
    } catch (err) {
      setError(err.message || "AI analysis failed.");
    } finally {
      setAnalyzing(false);
    }
  };
  const runVisionAnalysis = async () => {
    if (!referenceImage || !currentImage) {
      setVisionError("Please upload both reference and current images.");
      return;
    }

    setVisionLoading(true);
    setVisionError("");
    setVisionResult(null);

    try {
      const data = await visionService.analyze(
        referenceImage,
        currentImage
      );

      setVisionResult(data);
    } catch (err) {
      setVisionError(
        err.message || "Visual progress analysis failed."
      );
    } finally {
      setVisionLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <PageHeader
          title="Project Intelligence"
          subtitle="Loading project information..."
        />

        <Card className="flex items-center justify-center p-12">
          <Loader2 className="animate-spin text-navy" size={22} />
        </Card>
      </>
    );
  }

  if (error && !project) {
    return (
      <>
        <PageHeader title="Project Intelligence" />
        <ErrorState message={error} />
      </>
    );
  }

  if (!project) return null;

  const approved = Number(project.approved_cost ?? 0);
  const revised = Number(project.revised_cost ?? approved);
  const progress = Number(project.physical_progress ?? 0);

  const costIncrease =
    approved > 0 ? ((revised - approved) / approved) * 100 : 0;

  return (
    <>
      {/* Header */}
      <div className="mb-4">
        <Link
          to="/projects"
          className="mb-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-muted hover:text-navy"
        >
          <ArrowLeft size={14} />
          Back to Projects
        </Link>

        <PageHeader
          title={project.name || project.project_name || "Project"}
          subtitle={`${project.project_id || id} • ${
            project.sector || "Unknown sector"
          }`}
          actions={
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setBriefOpen(true)}
              >
                <FileText size={14} className="mr-1.5 text-primary-600" />
                Export MoSPI Brief
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={loadProject}
                disabled={loading}
              >
                <RefreshCw size={14} className="mr-1.5" />
                Refresh
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={runAnalysis}
                disabled={analyzing}
              >
                {analyzing ? (
                  <>
                    <Loader2
                      size={14}
                      className="mr-1.5 animate-spin"
                    />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <BrainCircuit
                      size={14}
                      className="mr-1.5"
                    />
                    Run AI Analysis
                  </>
                )}
              </Button>
            </div>
          }
        />
      </div>

      {/* Project Overview */}
      <Card className="p-5">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div>
            <p className="text-[11px] uppercase tracking-wide text-muted">
              Project Overview
            </p>

            <div className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-[12.5px] text-muted">
              <span>
                Ministry:{" "}
                <strong className="font-medium text-ink">
                  {project.ministry || "—"}
                </strong>
              </span>

              <span>
                Agency:{" "}
                <strong className="font-medium text-ink">
                  {project.implementing_agency || "—"}
                </strong>
              </span>

              <span>
                Location:{" "}
                <strong className="font-medium text-ink">
                  {project.location || "—"}
                </strong>
              </span>
            </div>
          </div>

          {risk && (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-wide text-muted">
                  Portfolio Risk
                </p>

                <p className="text-xl font-semibold text-ink">
                  {risk.score}/100
                </p>
              </div>

              <RiskBadge level={risk.level} />
            </div>
          )}
        </div>
      </Card>

      {/* KPI Cards */}
      <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted">
            <IndianRupee size={16} />
            <span className="text-[11px]">Approved Cost</span>
          </div>

          <p className="mt-2 text-xl font-semibold text-ink">
            {formatCurrency(approved)}
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted">
            <TrendingUp size={16} />
            <span className="text-[11px]">Revised Cost</span>
          </div>

          <p className="mt-2 text-xl font-semibold text-ink">
            {formatCurrency(revised)}
          </p>

          <p className="mt-1 text-[11px] text-risk-high">
            +{costIncrease.toFixed(1)}% escalation
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted">
            <ShieldAlert size={16} />
            <span className="text-[11px]">
              Physical Progress
            </span>
          </div>

          <p className="mt-2 text-xl font-semibold text-ink">
            {progress}%
          </p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-2 text-muted">
            <Timer size={16} />
            <span className="text-[11px]">Status</span>
          </div>

          <p className="mt-2 text-[14px] font-semibold text-ink">
            {project.status || "Unknown"}
          </p>
        </Card>
      </div>

      {/* Progress */}
      <Card className="mt-4 p-5">
        <div className="flex justify-between">
          <div>
            <h3 className="text-[14px] font-semibold text-ink">
              Project Progress
            </h3>

            <p className="mt-0.5 text-[11px] text-muted">
              Current physical completion
            </p>
          </div>

          <span className="text-[14px] font-semibold text-navy">
            {progress}%
          </span>
        </div>

        <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-navy transition-all"
            style={{
              width: `${Math.min(Math.max(progress, 0), 100)}%`,
            }}
          />
        </div>
      </Card>

      {/* AI Risk Intelligence */}
      <Card className="mt-4 p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-[14px] font-semibold text-ink">
              <BrainCircuit size={17} className="text-navy" />
              AI Risk Intelligence
            </h3>

            <p className="mt-0.5 text-[11px] text-muted">
              Combined rule-based and ML assessment
            </p>
          </div>

          {analysis?.risk_level && (
            <RiskBadge level={analysis.risk_level} />
          )}
        </div>

        {analysis ? (
          <div className="mt-5">

            {/* ML Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

              {/* Risk Score */}
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-[11px] text-muted">
                  Risk Score
                </p>

                <p className="mt-1 text-2xl font-semibold text-ink">
                  {analysis.risk_score ?? risk.score}
                </p>
              </div>

              {/* Cost Probability */}
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-[11px] text-muted">
                  Cost Overrun Probability
                </p>

                <p className="mt-1 text-xl font-semibold text-ink">
                  {analysis.ml_prediction
                    ?.cost_overrun_probability != null
                    ? `${(
                        analysis.ml_prediction
                          .cost_overrun_probability * 100
                      ).toFixed(1)}%`
                    : "—"}
                </p>
              </div>

              {/* Estimated Cost Overrun */}
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-[11px] text-muted">
                  Estimated Cost Overrun
                </p>

                <p className="mt-1 text-xl font-semibold text-ink">
                  {analysis.ml_prediction
                    ?.estimated_cost_overrun_pct != null
                    ? `${analysis.ml_prediction.estimated_cost_overrun_pct.toFixed(
                        1
                      )}%`
                    : "—"}
                </p>
              </div>

              {/* Time Probability */}
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-[11px] text-muted">
                  Time Overrun Probability
                </p>

                <p className="mt-1 text-xl font-semibold text-ink">
                  {analysis.ml_prediction
                    ?.time_overrun_probability != null
                    ? `${(
                        analysis.ml_prediction
                          .time_overrun_probability * 100
                      ).toFixed(1)}%`
                    : "—"}
                </p>

                <p className="mt-1 text-[10px] text-muted">
                  ML schedule-risk signal
                </p>
              </div>
            </div>

            {/* Time Prediction */}
            <div className="mt-3 rounded-lg border border-slate-200 bg-white p-3">
              <p className="text-[12px] text-muted">
                ML Time Overrun Prediction
              </p>

              <p className="mt-1 text-[13px] font-semibold text-ink">
                {analysis.ml_prediction?.time_overrun_prediction === 1
                  ? "Likely time overrun"
                  : "No time overrun currently predicted"}
              </p>
            </div>

            {/* Contributing Factors */}
            {analysis.reasons?.length > 0 && (
              <div className="mt-5">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-muted">
                  Contributing Factors
                </p>

                <div className="space-y-2">
                  {analysis.reasons.map((reason, index) => (
                    <div
                      key={index}
                      className="rounded-lg bg-slate-50 p-3 text-[12.5px] text-ink"
                    >
                      • {reason}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {analysis.recommendations?.length > 0 && (
              <div className="mt-5 rounded-lg border border-navy/10 bg-[#F7F8FC] p-4">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
                  Recommended Actions
                </p>

                <ul className="mt-2 space-y-1.5">
                  {analysis.recommendations.map(
                    (item, index) => (
                      <li
                        key={index}
                        className="text-[12.5px] leading-relaxed text-ink"
                      >
                        • {item}
                      </li>
                    )
                  )}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <div className="mt-5 rounded-lg border border-dashed border-slate-300 p-6 text-center">
            <BrainCircuit
              size={24}
              className="mx-auto text-muted"
            />

            <p className="mt-2 text-[13px] font-medium text-ink">
              No AI analysis has been run yet
            </p>

            <p className="mt-1 text-[11px] text-muted">
              Run AI Analysis to generate risk signals and
              recommendations.
            </p>
          </div>
        )}
      </Card>

      {/* Visual Progress Monitor */}
      <Card className="mt-4 p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-[14px] font-semibold text-ink">
              <Image size={17} className="text-navy" />
              Visual Progress Monitor
            </h3>

            <p className="mt-0.5 text-[11px] text-muted">
              Compare site images using AI vision to estimate physical progress.
            </p>
          </div>

          <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-medium text-muted">
            <Sparkles size={11} />
            AI Vision
          </div>
        </div>

        {/* Image Uploads */}
        <div className="mt-5 grid gap-4 md:grid-cols-2">

          {/* Reference Image */}
          <label className="block cursor-pointer overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100">
            {referenceImage ? (
              <div className="relative">
                <img
                  src={URL.createObjectURL(referenceImage)}
                  alt="Reference project"
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
                  Reference Image
                </p>

                <p className="mt-1 text-[11px] text-muted">
                  Upload earlier project image
                </p>
              </div>
            )}

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                setReferenceImage(e.target.files?.[0] ?? null);
                setVisionResult(null);
              }}
            />
          </label>

          {/* Current Image */}
          <label className="block cursor-pointer overflow-hidden rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100">
            {currentImage ? (
              <div className="relative">
                <img
                  src={URL.createObjectURL(currentImage)}
                  alt="Current project"
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
                  Current Image
                </p>

                <p className="mt-1 text-[11px] text-muted">
                  Upload latest project image
                </p>
              </div>
            )}

            <input
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              className="hidden"
              onChange={(e) => {
                setCurrentImage(e.target.files?.[0] ?? null);
                setVisionResult(null);
              }}
            />
          </label>
        </div>

        {/* Analyze Button */}
        <div className="mt-4 flex justify-end">
          <Button
            variant="primary"
            size="sm"
            onClick={runVisionAnalysis}
            disabled={visionLoading}
          >
            {visionLoading ? (
              <>
                <Loader2
                  size={14}
                  className="mr-1.5 animate-spin"
                />
                Analyzing Images...
              </>
            ) : (
              <>
                <Sparkles size={14} className="mr-1.5" />
                Analyze Visual Progress
              </>
            )}
          </Button>
        </div>

        {/* Vision Error */}
        {visionError && (
          <div className="mt-4 rounded-lg border border-risk-high/20 bg-risk-high/5 p-3 text-[12px] text-risk-high">
            {visionError}
          </div>
        )}

        {/* Vision Results */}
        {visionResult?.success && (
          <div className="mt-5 border-t border-white/[0.08] pt-5">

            {/* Metrics */}
            <div className="grid gap-4 md:grid-cols-3">

              <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  Visual Progress
                </p>

                <p className="mt-1 text-2xl font-extrabold text-orange tabular-nums">
                  {visionResult.progress?.percentage ?? 0}%
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  Current Stage
                </p>

                <p className="mt-2 text-[14px] font-bold text-ink">
                  {visionResult.progress?.status ?? "Unknown"}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-white/[0.04] p-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  AI Confidence
                </p>

                <p className="mt-2 text-[14px] font-extrabold text-emerald-400 tabular-nums">
                  {visionResult.progress?.confidence ?? 0}%
                </p>
              </div>

            </div>

            {/* Progress Bar */}
            <div className="mt-5">
              <div className="mb-2 flex justify-between text-[11px]">
                <span className="font-bold text-ink">
                  AI Estimated Physical Progress
                </span>

                <span className="font-mono text-orange font-bold">
                  {visionResult.progress?.percentage ?? 0}%
                </span>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-white/[0.08] border border-white/[0.06]">
                <div
                  className="h-full rounded-full bg-orange shadow-[0_0_12px_rgba(232,84,24,0.6)] transition-all duration-700"
                  style={{
                    width: `${Math.min(
                      Math.max(
                        Number(
                          visionResult.progress?.percentage ?? 0
                        ),
                        0
                      ),
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

                {visionResult.stages?.completed?.length ? (
                  visionResult.stages.completed.map((stage) => (
                    <div
                      key={stage}
                      className="mb-1.5 flex items-center gap-2 text-[12.5px] font-medium text-ink"
                    >
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                      {stage}
                    </div>
                  ))
                ) : (
                  <p className="text-[12px] text-muted">
                    None detected
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                <p className="mb-2.5 text-[11px] font-extrabold uppercase tracking-wider text-orange">
                  In Progress
                </p>

                {visionResult.stages?.in_progress?.length ? (
                  visionResult.stages.in_progress.map((stage) => (
                    <div
                      key={stage}
                      className="mb-1.5 text-[12.5px] font-semibold text-ink"
                    >
                      • {stage}
                    </div>
                  ))
                ) : (
                  <p className="text-[12px] text-muted">
                    None detected
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                <p className="mb-2.5 text-[11px] font-extrabold uppercase tracking-wider text-muted">
                  Remaining
                </p>

                {visionResult.stages?.remaining?.length ? (
                  visionResult.stages.remaining.map((stage) => (
                    <div
                      key={stage}
                      className="mb-1.5 text-[12.5px] font-medium text-muted"
                    >
                      • {stage}
                    </div>
                  ))
                ) : (
                  <p className="text-[12px] text-muted">
                    None detected
                  </p>
                )}
              </div>

            </div>

            {/* Key Issues */}
            {visionResult.key_issues?.length > 0 && (
              <div className="mt-5 rounded-xl border border-red-500/25 bg-red-500/[0.08] p-4">
                <div className="flex items-center gap-2 text-[13px] font-bold text-red-400">
                  <AlertTriangle size={16} className="text-red-400 shrink-0" />
                  Key Issues Detected
                </div>

                <ul className="mt-2.5 space-y-1.5">
                  {visionResult.key_issues.map((issue) => (
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
            {visionResult.recommendation && (
              <div className="mt-4 rounded-xl border border-orange/25 bg-orange/[0.08] p-4">
                <div className="flex items-center gap-2">
                  <Sparkles size={15} className="text-orange shrink-0" />

                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-orange">
                    AI Vision Recommendation
                  </p>
                </div>

                <p className="mt-2 text-[12.5px] leading-relaxed text-ink font-medium">
                  {visionResult.recommendation}
                </p>
              </div>
            )}
          </div>
        )}
      </Card>

      {error && (
        <div className="mt-4 rounded-lg border border-risk-high/20 bg-risk-high/5 p-3 text-[12px] text-risk-high">
          {error}
        </div>
      )}

      {/* Official MoSPI Executive Brief Printable Modal */}
      <MoSPIBriefModal
        isOpen={briefOpen}
        onClose={() => setBriefOpen(false)}
        project={project}
        risk={risk}
        visionResult={visionResult}
      />
    </>
  );
}