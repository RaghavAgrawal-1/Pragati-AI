import { useState } from "react";
import { X, Building2, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { contractorService } from "../../services/contractorService";

export default function ContractorOnboardingModal({ isOpen, onClose, onRegistered, onSuccess }) {
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
      const payload = {
        company_name: formData.company_name.trim(),
        registration_no: formData.registration_no.trim(),
        contractor_class: formData.contractor_class || "Class-A Highway & Rail EPC",
        sector_specialization: formData.sector_specialization || "Highways & Expressways",
        headquarters: formData.headquarters.trim() || "Pan-India HQ",
        contact_email: formData.contact_email.trim() || null,
        contact_phone: formData.contact_phone.trim() || null,
        established_year: parseInt(formData.established_year, 10) || 2020,
        initial_project_name: formData.initial_project_name.trim() || null,
        experience_summary: formData.experience_summary.trim() || null,
      };

      const result = await contractorService.register(payload);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        if (onRegistered) onRegistered(result);
        if (onSuccess) onSuccess(result);
        onClose();
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to register contractor. Please check details.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-3.5 py-2 text-[12.5px] text-ink placeholder:text-muted focus:border-orange/50 focus:outline-none transition-all";
  const labelClass = "block text-[10.5px] font-bold uppercase tracking-widest text-muted mb-1";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#141520] p-6 shadow-[0_24px_60px_rgba(0,0,0,0.8)] border border-white/[0.08] animate-slideUp">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/[0.06] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange/15 border border-orange/30 text-orange">
              <Building2 size={20} />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-ink">
                Contractor & Builder Onboarding
              </h3>
              <p className="text-[11.5px] text-muted">
                Register company credentials to join national infrastructure works.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-white/[0.06] hover:text-ink transition"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-3 text-[12.5px] text-red-300">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success ? (
          <div className="my-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
              <CheckCircle2 size={32} />
            </div>
            <h4 className="mt-3 text-base font-bold text-ink">Contractor Enlisted Successfully!</h4>
            <p className="mt-1 text-[12px] text-muted">
              Credentials verified under PM GatiShakti & MoSPI Contractor Trust Framework.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-[12.5px]">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Company Legal Name *</label>
                <input
                  type="text"
                  name="company_name"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="e.g. Larsen & Toubro Construction Ltd"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>GSTIN / Registration No *</label>
                <input
                  type="text"
                  name="registration_no"
                  value={formData.registration_no}
                  onChange={handleChange}
                  placeholder="e.g. 27AAACL1234F1Z5"
                  className={inputClass}
                  required
                />
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Contractor Class Grade</label>
                <select
                  name="contractor_class"
                  value={formData.contractor_class}
                  onChange={handleChange}
                  className={inputClass}
                  style={{ backgroundColor: "#1A1B25", color: "#F0F2F8" }}
                >
                  <option value="Class-A Highway & Rail EPC">Class-A Highway & Rail EPC</option>
                  <option value="Class-B State Highway Partner">Class-B State Highway Partner</option>
                  <option value="Specialist Tunnel & Bridge Contractor">Specialist Tunnel & Bridge Contractor</option>
                  <option value="Urban Metro Infrastructure Specialist">Urban Metro Infrastructure Specialist</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Primary Sector</label>
                <select
                  name="sector_specialization"
                  value={formData.sector_specialization}
                  onChange={handleChange}
                  className={inputClass}
                  style={{ backgroundColor: "#1A1B25", color: "#F0F2F8" }}
                >
                  <option value="Highways & Expressways">Highways & Expressways</option>
                  <option value="Railways & Dedicated Freight">Railways & Dedicated Freight</option>
                  <option value="Bridges & Tunnels">Bridges & Tunnels</option>
                  <option value="Renewable Energy Infrastructure">Renewable Energy Infrastructure</option>
                  <option value="Urban Mobility & Metros">Urban Mobility & Metros</option>
                </select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className={labelClass}>Headquarters (City)</label>
                <input
                  type="text"
                  name="headquarters"
                  value={formData.headquarters}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai, MH"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Contact Email</label>
                <input
                  type="email"
                  name="contact_email"
                  value={formData.contact_email}
                  onChange={handleChange}
                  placeholder="tenders@company.com"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Established Year</label>
                <input
                  type="number"
                  name="established_year"
                  value={formData.established_year}
                  onChange={handleChange}
                  placeholder="2010"
                  className={inputClass}
                />
              </div>
            </div>

            <div>
              <label className={labelClass}>Initial Work Package</label>
              <input
                type="text"
                name="initial_project_name"
                value={formData.initial_project_name}
                onChange={handleChange}
                placeholder="e.g. NH-48 Section 4 Flyover Construction"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Experience & Key Capabilities</label>
              <textarea
                name="experience_summary"
                value={formData.experience_summary}
                onChange={handleChange}
                rows={2}
                placeholder="List major civil engineering works, plant machinery, and safety track record..."
                className={inputClass}
              />
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/[0.06]">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-[12px] font-semibold text-ink hover:bg-white/[0.08] transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 rounded-xl bg-orange px-5 py-2 text-[12px] font-semibold text-white shadow-submit hover:bg-orange-light transition disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Enlisting...
                  </>
                ) : (
                  "Enlist Contractor Credentials"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
