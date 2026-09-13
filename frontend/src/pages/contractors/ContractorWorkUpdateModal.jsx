import { useState } from "react";
import { X, Trophy, CheckCircle, Clock, Star, MessageSquare, Loader2, AlertCircle } from "lucide-react";
import { contractorService } from "../../services/contractorService";

export default function ContractorWorkUpdateModal({ isOpen, onClose, contractor, onUpdated }) {
  const [activeTab, setActiveTab] = useState("milestone"); // "milestone" | "review"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Milestone work update form
  const [workData, setWorkData] = useState({
    project_name: "",
    milestone_name: "Subgrade & Earthworks",
    physical_progress_pct: 100,
    is_completed: true,
    completed_on_time: true,
  });

  // Review / Feedback form
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
        onUpdated(updated);
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
        onUpdated(updated);
        onClose();
      }, 1100);
    } catch (err) {
      setError(err.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between border-b border-slate-100 pb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-semibold text-ink">{contractor.company_name}</h3>
              <span className="rounded-full bg-navy/10 px-2 py-0.5 text-[10.5px] font-semibold text-navy">
                Grade {contractor.rating_grade}
              </span>
            </div>
            <p className="text-[12px] text-muted">
              {contractor.registration_no} • {contractor.sector_specialization}
            </p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-slate-100 hover:text-ink">
            <X size={18} />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="mt-4 flex rounded-xl bg-slate-100 p-1 text-[12px]">
          <button
            type="button"
            onClick={() => { setActiveTab("milestone"); setError(""); }}
            className={`flex-1 rounded-lg py-1.5 font-medium transition ${
              activeTab === "milestone" ? "bg-white text-navy shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            Update Milestone Progress
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab("review"); setError(""); }}
            className={`flex-1 rounded-lg py-1.5 font-medium transition ${
              activeTab === "review" ? "bg-white text-navy shadow-sm" : "text-muted hover:text-ink"
            }`}
          >
            Submit On-Time Feedback
          </button>
        </div>

        {error && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-[12px] text-red-700">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 text-[12px] text-emerald-800">
            <CheckCircle size={15} />
            <span>{success}</span>
          </div>
        )}

        {activeTab === "milestone" ? (
          <form onSubmit={handleWorkSubmit} className="mt-4 space-y-3.5 text-[12.5px]">
            <div>
              <label className="block font-medium text-ink mb-1">Project Name *</label>
              <input
                type="text"
                value={workData.project_name}
                onChange={(e) => setWorkData({ ...workData, project_name: e.target.value })}
                placeholder="e.g. Vadodara-Mumbai Expressway Package 7"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-ink focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-ink mb-1">Milestone Completed</label>
              <select
                value={workData.milestone_name}
                onChange={(e) => setWorkData({ ...workData, milestone_name: e.target.value })}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-ink focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
              >
                <option value="Subgrade & Earthworks">Subgrade & Earthworks</option>
                <option value="Piers & Foundation Viaducts">Piers & Foundation Viaducts</option>
                <option value="Superstructure & Girder Launch">Superstructure & Girder Launch</option>
                <option value="Track / Bituminous Paving">Track / Bituminous Paving</option>
                <option value="Final Commissioning & Handover">Final Commissioning & Handover</option>
              </select>
            </div>

            <div>
              <label className="block font-medium text-ink mb-1">Physical Completion: {workData.physical_progress_pct}%</label>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={workData.physical_progress_pct}
                onChange={(e) => setWorkData({ ...workData, physical_progress_pct: e.target.value })}
                className="w-full accent-navy"
              />
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={workData.completed_on_time}
                  onChange={(e) => setWorkData({ ...workData, completed_on_time: e.target.checked })}
                  className="rounded border-slate-300 text-navy focus:ring-navy h-4 w-4"
                />
                <span className="text-ink font-medium">Delivered strictly within scheduled deadline</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={workData.is_completed}
                  onChange={(e) => setWorkData({ ...workData, is_completed: e.target.checked })}
                  className="rounded border-slate-300 text-navy focus:ring-navy h-4 w-4"
                />
                <span className="text-muted">Marks this entire project work package as 100% completed</span>
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-navy px-4 py-1.5 font-medium text-white shadow-sm hover:bg-navy/90 disabled:opacity-50"
              >
                {loading ? <Loader2 size={13} className="animate-spin" /> : <Trophy size={13} />}
                Update & Recalculate Trust
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleReviewSubmit} className="mt-4 space-y-3.5 text-[12.5px]">
            <div>
              <label className="block font-medium text-ink mb-1">Reviewer Name & Authority Designation *</label>
              <input
                type="text"
                value={reviewData.author_name}
                onChange={(e) => setReviewData({ ...reviewData, author_name: e.target.value })}
                placeholder="e.g. NHAI Regional Project Director / Citizen Oversight"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-ink focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                required
              />
            </div>

            <div>
              <label className="block font-medium text-ink mb-1">Performance & Quality Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewData({ ...reviewData, rating: star })}
                    className="p-1 text-amber-400 hover:scale-110 transition"
                  >
                    <Star
                      size={20}
                      fill={star <= reviewData.rating ? "currentColor" : "none"}
                      stroke="currentColor"
                    />
                  </button>
                ))}
                <span className="text-[13px] font-semibold text-ink ml-1">{reviewData.rating}.0 / 5.0</span>
              </div>
            </div>

            <div className="rounded-xl border border-emerald-100 bg-emerald-50/50 p-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reviewData.delivery_on_time}
                  onChange={(e) => setReviewData({ ...reviewData, delivery_on_time: e.target.checked })}
                  className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                />
                <span className="text-emerald-950 font-medium">Verify: Delivered on-time with zero avoidable slippage</span>
              </label>
              <p className="mt-1 text-[11px] text-emerald-800 ml-6">
                Positive verification boosts contractor's National Trust Grade and grants Tier-1 priority for upcoming tenders.
              </p>
            </div>

            <div>
              <label className="block font-medium text-ink mb-1">Evaluation Comments & Feedback *</label>
              <textarea
                value={reviewData.feedback_text}
                onChange={(e) => setReviewData({ ...reviewData, feedback_text: e.target.value })}
                rows={3}
                placeholder="Detailed assessment of construction quality, safety adherence, and timely delivery..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-ink focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                required
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 px-3.5 py-1.5 text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-1.5 font-medium text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
              >
                {loading ? <Loader2 size={13} className="animate-spin" /> : <MessageSquare size={13} />}
                Publish Verified Feedback
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
