import { useState } from "react";
import { X, Trophy, CheckCircle, Clock, Star, MessageSquare, Loader2, AlertCircle } from "lucide-react";
import { contractorService } from "../../services/contractorService";

export default function ContractorWorkUpdateModal({ isOpen, onClose, contractor, onUpdated, onSuccess }) {
  const [activeTab, setActiveTab] = useState("milestone");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [workData, setWorkData] = useState({
    project_name: "",
    milestone_name: "Subgrade & Earthworks",
    physical_progress_pct: 100,
    is_completed: true,
    completed_on_time: true,
  });

  const [reviewData, setReviewData] = useState({
    author_name: "",
    rating: 5,
    feedback_text: "",
    delivery_on_time: true,
  });

  if (!isOpen || !contractor) return null;

  const handleWorkSubmit = async (e) => {
    e.preventDefault();
    if (!workData.project_name.trim()) {
      setError("Please specify the Project Name.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const updated = await contractorService.updateWork(contractor.id, {
        ...workData,
        physical_progress_pct: parseFloat(workData.physical_progress_pct) || 100,
      });
      setSuccess("Milestone verified! Contractor Trust Score updated.");
      setTimeout(() => {
        setSuccess("");
        if (onUpdated) onUpdated(updated);
        if (onSuccess) onSuccess(updated);
        onClose();
      }, 1100);
    } catch (err) {
      setError(err.message || "Failed to update milestone.");
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewData.author_name.trim() || !reviewData.feedback_text.trim()) {
      setError("Please enter reviewer name and feedback comments.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const updated = await contractorService.submitReview(contractor.id, {
        ...reviewData,
        rating: parseFloat(reviewData.rating),
      });
      setSuccess("Official feedback recorded! On-time delivery credential awarded.");
      setTimeout(() => {
        setSuccess("");
        if (onUpdated) onUpdated(updated);
        if (onSuccess) onSuccess(updated);
        onClose();
      }, 1100);
    } catch (err) {
      setError(err.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-3.5 py-2 text-[12.5px] text-ink placeholder:text-muted focus:border-orange/50 focus:outline-none transition-all";
  const labelClass = "block text-[10.5px] font-bold uppercase tracking-widest text-muted mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#141520] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.8)] border border-white/[0.08] animate-slideUp">
        <div className="flex items-start justify-between border-b border-white/[0.06] pb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-[15px] font-bold text-ink">{contractor.name || contractor.company_name}</h3>
              <span className="rounded-full bg-orange/15 border border-orange/30 px-2.5 py-0.5 text-[10.5px] font-bold text-orange">
                Grade {contractor.rating_grade}
              </span>
            </div>
            <p className="text-[11.5px] text-muted font-mono mt-0.5">
              {contractor.gstin || contractor.registration_no} • {contractor.primary_sector || contractor.sector_specialization}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-white/[0.06] hover:text-ink transition">
            <X size={18} />
          </button>
        </div>

        {/* Tab switch */}
        <div className="mt-4 flex rounded-full bg-white/[0.04] border border-white/[0.06] p-1">
          <button
            onClick={() => { setActiveTab("milestone"); setError(""); }}
            className={`flex-1 rounded-full py-1.5 text-[12px] font-semibold transition ${
              activeTab === "milestone" ? "bg-orange text-white" : "text-muted hover:text-ink"
            }`}
          >
            Update Milestone
          </button>
          <button
            onClick={() => { setActiveTab("review"); setError(""); }}
            className={`flex-1 rounded-full py-1.5 text-[12px] font-semibold transition ${
              activeTab === "review" ? "bg-orange text-white" : "text-muted hover:text-ink"
            }`}
          >
            Performance Review
          </button>
        </div>

        {error && (
          <div className="mt-3.5 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-3 text-[12.5px] text-red-300">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="my-6 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <CheckCircle size={28} />
            </div>
            <h4 className="mt-3 text-[14.5px] font-bold text-ink">{success}</h4>
          </div>
        ) : activeTab === "milestone" ? (
          <form onSubmit={handleWorkSubmit} className="mt-4 space-y-3.5 text-[12.5px]">
            <div>
              <label className={labelClass}>Work Package / Project Name *</label>
              <input
                type="text"
                value={workData.project_name}
                onChange={(e) => setWorkData({ ...workData, project_name: e.target.value })}
                placeholder="e.g. NH-48 Section 4 Expressway"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Milestone Completed</label>
              <select
                value={workData.milestone_name}
                onChange={(e) => setWorkData({ ...workData, milestone_name: e.target.value })}
                className={inputClass}
                style={{ backgroundColor: "#1A1B25", color: "#F0F2F8" }}
              >
                <option value="Subgrade & Earthworks">Subgrade & Earthworks (Stage 01)</option>
                <option value="Foundation & Piling Works">Foundation & Piling Works (Stage 02)</option>
                <option value="Superstructure & Deck Laying">Superstructure & Deck Laying (Stage 03)</option>
                <option value="Pavement & Bituminous Layer">Pavement & Bituminous Layer (Stage 04)</option>
                <option value="Signalling & Final Commissioning">Signalling & Final Commissioning (Stage 05)</option>
              </select>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Physical Progress (% Target)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={workData.physical_progress_pct}
                  onChange={(e) => setWorkData({ ...workData, physical_progress_pct: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="flex flex-col justify-end">
                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] p-2.5 text-[12px] text-ink">
                  <input
                    type="checkbox"
                    checked={workData.completed_on_time}
                    onChange={(e) => setWorkData({ ...workData, completed_on_time: e.target.checked })}
                    className="accent-orange h-4 w-4"
                  />
                  <span>Delivered On Time</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-[12px] font-semibold text-ink hover:bg-white/[0.08]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-orange px-5 py-2 text-[12px] font-semibold text-white shadow-submit hover:bg-orange-light disabled:opacity-50"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : "Verify Milestone Update"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleReviewSubmit} className="mt-4 space-y-3.5 text-[12.5px]">
            <div>
              <label className={labelClass}>Reviewing Authority / Officer Name *</label>
              <input
                type="text"
                value={reviewData.author_name}
                onChange={(e) => setReviewData({ ...reviewData, author_name: e.target.value })}
                placeholder="e.g. Chief Engineer, MoRTH Nodal Division"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label className={labelClass}>Performance Rating (1 to 5 Stars)</label>
              <select
                value={reviewData.rating}
                onChange={(e) => setReviewData({ ...reviewData, rating: Number(e.target.value) })}
                className={inputClass}
                style={{ backgroundColor: "#1A1B25", color: "#F0F2F8" }}
              >
                <option value="5">5 ★★★★★ — Outstanding Execution</option>
                <option value="4">4 ★★★★☆ — Good On-Time Record</option>
                <option value="3">3 ★★★☆☆ — Average Execution Pace</option>
                <option value="2">2 ★★☆☆☆ — Minor Delays Observed</option>
                <option value="1">1 ★☆☆☆☆ — Severe Delay / Breach</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Official Performance Assessment Comments *</label>
              <textarea
                rows={3}
                value={reviewData.feedback_text}
                onChange={(e) => setReviewData({ ...reviewData, feedback_text: e.target.value })}
                placeholder="Provide official assessment on contractor site mobilization, safety standards, and engineering quality..."
                className={inputClass}
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-[12px] font-semibold text-ink hover:bg-white/[0.08]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-orange px-5 py-2 text-[12px] font-semibold text-white shadow-submit hover:bg-orange-light disabled:opacity-50"
              >
                {loading ? <Loader2 size={15} className="animate-spin" /> : "Submit Official Assessment"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
