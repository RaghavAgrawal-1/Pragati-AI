import { useState } from "react";
import { X, Building2, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { contractorService } from "../../services/contractorService";

export default function ContractorOnboardingModal({ isOpen, onClose, onRegistered }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    company_name: "",
    registration_no: "",
    contractor_class: "Class-A Highway & Rail EPC",
    sector_specialization: "Highways & Expressways",
    headquarters: "",
    contact_email: "",
    contact_phone: "",
    established_year: 2020,
    initial_project_name: "",
    experience_summary: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.company_name.trim() || !formData.registration_no.trim()) {
      setError("Please provide Company Name and Registration / GSTIN Number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await contractorService.register({
        ...formData,
        established_year: parseInt(formData.established_year, 10) || 2020,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onRegistered(result);
        onClose();
      }, 1200);
    } catch (err) {
      setError(err.message || "Failed to register contractor. Please check details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy/10 text-navy">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="text-base font-semibold text-ink">
                Contractor & Builder Onboarding
              </h3>
              <p className="text-[12px] text-muted">
                Register company credentials to join national infrastructure works and build verified trust value.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-slate-100 hover:text-ink transition"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-[12.5px] text-red-700">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="my-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 size={32} />
            </div>
            <h4 className="mt-3 text-base font-semibold text-ink">Contractor Enlisted Successfully!</h4>
            <p className="mt-1 text-[12px] text-muted">
              Credentials verified under PM GatiShakti & MoSPI Contractor Trust Framework.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-[12.5px]">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-medium text-ink mb-1">Company Legal Name *</label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="e.g. Apex Infra Construction Ltd"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-ink focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  required
                />
              </div>

              <div>
                <label className="block font-medium text-ink mb-1">GSTIN / CIN / Enlistment ID *</label>
                <input
                  type="text"
                  name="registration_no"
                  value={formData.registration_no}
                  onChange={handleChange}
                  placeholder="e.g. GSTIN-27AAACA1122D1Z5"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-ink focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                  required
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="block font-medium text-ink mb-1">Contractor Enlistment Tier</label>
                <select
                  name="contractor_class"
                  value={formData.contractor_class}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-ink focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                >
                  <option value="Class-1 Super / Mega Infrastructure">Class-1 Super / Mega EPC (&gt;₹500 Cr)</option>
                  <option value="Class-A Highway & Rail EPC">Class-A Highway & Rail (₹100–500 Cr)</option>
                  <option value="Class-B Regional EPC">Class-B Regional EPC (₹25–100 Cr)</option>
                  <option value="Registered New Entrant">Registered New Entrant / Builder</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-ink mb-1">Sector Specialization</label>
                <select
                  name="sector_specialization"
                  value={formData.sector_specialization}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-ink focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                >
                  <option value="Highways & Expressways">Highways & Expressways</option>
                  <option value="High-Speed Rail & Metro">High-Speed Rail & Metro Transit</option>
                  <option value="Bridges & Tunnels">Bridges, Tunnels & Flyovers</option>
                  <option value="Renewable Energy & Power">Renewable Energy & Power</option>
                  <option value="Urban Infrastructure & Smart Cities">Urban Infrastructure & Buildings</option>
                </select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="block font-medium text-ink mb-1">Headquarters</label>
                <input
                  type="text"
                  name="headquarters"
                  value={formData.headquarters}
                  onChange={handleChange}
                  placeholder="e.g. Ahmedabad, Gujarat"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-ink focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                />
              </div>

              <div>
                <label className="block font-medium text-ink mb-1">Contact Email</label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  placeholder="contact@company.com"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-ink focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                />
              </div>

              <div>
                <label className="block font-medium text-ink mb-1">Established Year</label>
                <input
                  type="number"
                  name="established_year"
                  value={formData.established_year}
                  onChange={handleChange}
                  min="1950"
                  max="2026"
                  className="w-full rounded-lg border border-slate-200 px-3 py-2 text-ink focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-ink mb-1">Initial / Current Work Package</label>
              <input
                type="text"
                name="initial_project_name"
                value={formData.initial_project_name}
                onChange={handleChange}
                placeholder="e.g. NH-48 Section 4 Flyover Construction"
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-ink focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
              />
            </div>

            <div>
              <label className="block font-medium text-ink mb-1">Experience Summary & Key Capabilities</label>
              <textarea
                name="experience_summary"
                value={formData.experience_summary}
                onChange={handleChange}
                rows={2}
                placeholder="List major civil engineering works, plant machinery, and safety track record..."
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-ink focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy"
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-slate-200 px-4 py-2 text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-lg bg-navy px-5 py-2 font-medium text-white shadow-sm hover:bg-navy/90 transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Enlisting...
                  </>
                ) : (
                  <>
                    <ShieldCheck size={14} />
                    Register & Generate Trust Profile
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
