import { useState } from "react";
import {
  Compass, Sparkles, Building2, CheckCircle2, MapPin, Ruler,
  Layers, Phone, Mail, ShieldCheck, Loader2, Wrench, FileText, ArrowRight,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import PageHeader from "../../components/layout/PageHeader";
import { api } from "../../services/apiClient";

export default function BlueprintStudio() {
  const [activeTab, setActiveTab] = useState("generate"); // 'generate' | 'enhance'

  // Tab 1 Form State
  const [genForm, setGenForm] = useState({
    project_type: "Residential 3BHK House",
    location: "Jaipur, Rajasthan",
    plot_width_ft: 30,
    plot_length_ft: 50,
    floors: 1,
    budget_lakhs: 45,
    special_requirements: "Vastu compliant, Rainwater harvesting, Solar rooftop orientation",
  });
  const [genLoading, setGenLoading] = useState(false);
  const [blueprintResult, setBlueprintResult] = useState(null);
  const [genError, setGenError] = useState("");

  // Tab 2 Form State
  const [enhanceForm, setEnhanceForm] = useState({
    project_type: "2-Storey Residential House",
    location: "Mumbai, Maharashtra",
    existing_blueprint_description: "3BHK layout with 14x18 living room, 12x14 master bed, open kitchen in NW, and 20ft long unsupported slab span in garage.",
  });
  const [enhanceLoading, setEnhanceLoading] = useState(false);
  const [enhanceResult, setEnhanceResult] = useState(null);
  const [enhanceError, setEnhanceError] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenLoading(true);
    setGenError("");
    try {
      const res = await api.post("/api/blueprint/generate", {
        ...genForm,
        plot_width_ft: Number(genForm.plot_width_ft),
        plot_length_ft: Number(genForm.plot_length_ft),
        floors: Number(genForm.floors),
        budget_lakhs: Number(genForm.budget_lakhs),
      });
      setBlueprintResult(res);
    } catch (err) {
      setGenError(err.message || "Failed to generate CAD blueprint.");
    } finally {
      setGenLoading(false);
    }
  };

  const handleEnhance = async (e) => {
    e.preventDefault();
    setEnhanceLoading(true);
    setEnhanceError("");
    try {
      const res = await api.post("/api/blueprint/enhance", enhanceForm);
      setEnhanceResult(res);
    } catch (err) {
      setEnhanceError(err.message || "Failed to audit existing blueprint.");
    } finally {
      setEnhanceLoading(false);
    }
  };

  const inputClass = "w-full rounded-xl border border-white/[0.08] bg-white/[0.05] px-3.5 py-2 text-[12.5px] text-ink placeholder:text-muted focus:border-orange/50 focus:outline-none transition-all";
  const labelClass = "block text-[10.5px] font-bold uppercase tracking-widest text-muted mb-1";

  return (
    <div className="space-y-6 animate-slideUp">
      <PageHeader
        title="AI CAD Blueprint & Architectural Studio"
        subtitle="Generative floor plans, structural BOQ cost estimation, Vastu orientation, and contractor matching engine."
      />

      {/* TABS BAR */}
      <Card className="p-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("generate")}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold transition-all ${
                activeTab === "generate"
                  ? "bg-orange text-white"
                  : "bg-white/[0.04] text-muted hover:bg-white/[0.08] hover:text-ink"
              }`}
            >
              <Compass size={15} />
              Generate 2D CAD Blueprint & BOQ
            </button>
            <button
              onClick={() => setActiveTab("enhance")}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-[12px] font-semibold transition-all ${
                activeTab === "enhance"
                  ? "bg-orange text-white"
                  : "bg-white/[0.04] text-muted hover:bg-white/[0.08] hover:text-ink"
              }`}
            >
              <Wrench size={15} />
              Audit & Enhance Existing Drawing
            </button>
          </div>

          <span className="text-[11px] text-muted font-mono px-2 hidden md:inline">
            Standard: NBC 2016 & IS 456 Civil Engineering Code
          </span>
        </div>
      </Card>

      {/* TAB 1: GENERATE NEW CAD BLUEPRINT */}
      {activeTab === "generate" && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Form */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="p-5">
              <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
                <Compass size={18} className="text-orange" />
                <h3 className="text-[13.5px] font-bold text-ink">Project Specifications</h3>
              </div>

              {genError && (
                <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-3 text-[12px] text-red-300">
                  {genError}
                </div>
              )}

              <form onSubmit={handleGenerate} className="mt-4 space-y-3.5 text-[12.5px]">
                <div>
                  <label className={labelClass}>Project Type</label>
                  <select
                    value={genForm.project_type}
                    onChange={(e) => setGenForm({ ...genForm, project_type: e.target.value })}
                    className={inputClass}
                    style={{ backgroundColor: "#1A1B25", color: "#F0F2F8" }}
                  >
                    <option value="Residential 3BHK House">Residential 3BHK House / Villa</option>
                    <option value="Residential 2BHK Independent House">Residential 2BHK Independent House</option>
                    <option value="Commercial Warehouse & Logistics Hub">Commercial Warehouse & Logistics Hub</option>
                    <option value="Railway Station Passenger Terminal">Railway Station Passenger Terminal</option>
                    <option value="Highway Interchange & Bridge Package">Highway Interchange & Bridge Package</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Target Location (City, State) *</label>
                  <input
                    type="text"
                    value={genForm.location}
                    onChange={(e) => setGenForm({ ...genForm, location: e.target.value })}
                    placeholder="e.g. Jaipur, Rajasthan or Mumbai"
                    className={inputClass}
                    required
                  />
                  <p className="mt-1 text-[10.5px] text-muted">
                    Matches verified contractors headquartered or active in this region.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Plot Width (ft)</label>
                    <input
                      type="number"
                      value={genForm.plot_width_ft}
                      onChange={(e) => setGenForm({ ...genForm, plot_width_ft: e.target.value })}
                      min="15"
                      max="300"
                      className={inputClass}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Plot Length (ft)</label>
                    <input
                      type="number"
                      value={genForm.plot_length_ft}
                      onChange={(e) => setGenForm({ ...genForm, plot_length_ft: e.target.value })}
                      min="20"
                      max="500"
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Storeys / Floors</label>
                    <select
                      value={genForm.floors}
                      onChange={(e) => setGenForm({ ...genForm, floors: e.target.value })}
                      className={inputClass}
                      style={{ backgroundColor: "#1A1B25", color: "#F0F2F8" }}
                    >
                      <option value="1">G (Ground Only)</option>
                      <option value="2">G + 1 (2 Floors)</option>
                      <option value="3">G + 2 (3 Floors)</option>
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Budget (₹ Lakhs)</label>
                    <input
                      type="number"
                      value={genForm.budget_lakhs}
                      onChange={(e) => setGenForm({ ...genForm, budget_lakhs: e.target.value })}
                      min="5"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Special Design Features</label>
                  <textarea
                    value={genForm.special_requirements}
                    onChange={(e) => setGenForm({ ...genForm, special_requirements: e.target.value })}
                    rows={2}
                    placeholder="e.g. Vastu compliant, rainwater harvesting, solar terrace..."
                    className={inputClass}
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full justify-center shadow-submit"
                  disabled={genLoading}
                >
                  {genLoading ? (
                    <>
                      <Loader2 size={15} className="mr-2 animate-spin" />
                      Generating CAD Blueprint...
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} className="mr-2" />
                      Generate Blueprint & Find Contractors
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Right Area: Generated Blueprint & Matched Contractors */}
          <div className="lg:col-span-8 space-y-5">
            {blueprintResult ? (
              <>
                {/* Visual Blueprint SVG Card */}
                <Card className="p-5 border-cyan-500/30 bg-surface-card">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center border-b border-white/[0.06] pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Compass size={18} className="text-cyan-400" />
                        <h3 className="text-[15px] font-bold text-ink">
                          {blueprintResult.project_title}
                        </h3>
                      </div>
                      <p className="mt-0.5 text-[11.5px] text-muted">
                        {blueprintResult.total_built_up_area_sqft} sq ft built-up • Estimated Outlay: ₹{blueprintResult.estimated_construction_cost_lakhs} Lakhs
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-0.5 text-[10.5px] text-cyan-300 font-mono font-bold">
                        NBC 2016 Compliant
                      </span>
                    </div>
                  </div>

                  {/* Render 2D SVG Blueprint */}
                  <div
                    className="mt-4 overflow-hidden rounded-xl bg-[#08101E] border border-white/[0.08] p-3 shadow-inner"
                    dangerouslySetInnerHTML={{ __html: blueprintResult.svg_blueprint_code }}
                  />
                </Card>

                {/* Spatial Layout & Dimensions Table */}
                <Card className="p-5">
                  <h4 className="text-[13.5px] font-bold text-ink mb-3 flex items-center gap-2">
                    <Ruler size={16} className="text-orange" />
                    Spatial Room Layout & Architectural Zoning
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[12px]">
                      <thead>
                        <tr className="border-b border-white/[0.06] bg-white/[0.02] text-[10.5px] uppercase tracking-widest text-muted">
                          <th className="py-2.5 px-3">Room / Space</th>
                          <th className="py-2.5 px-3">Dimensions</th>
                          <th className="py-2.5 px-3">Carpet Area</th>
                          <th className="py-2.5 px-3">Vastu / Orientation</th>
                          <th className="py-2.5 px-3">Key Features</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {blueprintResult.spatial_layout.map((room, idx) => (
                          <tr key={idx} className="hover:bg-white/[0.03] transition-colors">
                            <td className="py-2.5 px-3 font-semibold text-ink">{room.name}</td>
                            <td className="py-2.5 px-3 font-mono text-orange font-bold">{room.dimensions}</td>
                            <td className="py-2.5 px-3 text-muted font-mono">{room.area_sqft} sq ft</td>
                            <td className="py-2.5 px-3">
                              <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-2.5 py-0.5 text-[10.5px] font-bold text-cyan-400">
                                {room.orientation}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-[11.5px] text-muted">{room.features}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Bill of Quantities (BOQ) */}
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-3 border-b border-white/[0.06] pb-3">
                    <h4 className="text-[13.5px] font-bold text-ink flex items-center gap-2">
                      <Layers size={16} className="text-emerald-400" />
                      Estimated Bill of Quantities (BOQ & Materials)
                    </h4>
                    <span className="text-[11px] text-muted font-mono">CPWD Schedule of Rates 2026</span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {blueprintResult.bill_of_quantities.map((item, idx) => (
                      <div key={idx} className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5 space-y-1">
                        <p className="text-[10.5px] font-bold uppercase tracking-widest text-muted">{item.material}</p>
                        <p className="text-[16px] font-extrabold text-ink tabular-nums">{item.estimated_quantity}</p>
                        <p className="text-[12px] font-bold text-emerald-400">{item.approx_cost_inr}</p>
                        <p className="text-[10.5px] text-muted leading-relaxed pt-1 border-t border-white/[0.04]">{item.benchmark_note}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Recommended Local Contractors for this City */}
                <Card className="p-5 border-l-4 border-l-orange">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-[14px] font-bold text-ink flex items-center gap-2">
                        <ShieldCheck size={18} className="text-orange" />
                        Recommended Contractors for {blueprintResult.location}
                      </h4>
                      <p className="text-[11.5px] text-muted">
                        Verified EPC partners with highest on-time delivery records matched for this project
                      </p>
                    </div>
                  </div>

                  {blueprintResult.matched_contractors?.length > 0 ? (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {blueprintResult.matched_contractors.map((c) => (
                        <div
                          key={c.id}
                          className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-3.5 hover:border-orange/30 transition-all"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-bold text-ink text-[13px]">{c.company_name}</h5>
                              <p className="text-[11px] text-muted flex items-center gap-1 mt-0.5">
                                <MapPin size={11} className="text-orange" /> {c.headquarters}
                              </p>
                            </div>
                            <span className="rounded-full bg-orange/15 border border-orange/30 px-2 py-0.5 text-[10.5px] font-bold text-orange">
                              Grade {c.rating_grade}
                            </span>
                          </div>

                          <div className="mt-2.5 flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-emerald-400">
                              {c.on_time_rate_pct}% On-Time Record
                            </span>
                            <span className="font-semibold text-ink">
                              Score: {c.trust_score}/100
                            </span>
                          </div>

                          <p className="mt-2 text-[11px] text-muted font-medium bg-white/[0.04] p-2 rounded-lg border border-white/[0.04]">
                            ✓ {c.match_reason}
                          </p>

                          <div className="mt-3 flex items-center gap-3 text-[11px] text-muted border-t border-white/[0.06] pt-2">
                            {c.contact_phone && (
                              <span className="flex items-center gap-1">
                                <Phone size={11} className="text-muted" /> {c.contact_phone}
                              </span>
                            )}
                            {c.contact_email && (
                              <span className="flex items-center gap-1 truncate">
                                <Mail size={11} className="text-muted" /> {c.contact_email}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[12px] text-muted">No specific local contractors registered for this exact location yet.</p>
                  )}
                </Card>
              </>
            ) : (
              <Card className="p-12 text-center border-dashed border-2 border-white/[0.08]">
                <Compass size={40} className="mx-auto text-orange/50" />
                <h4 className="mt-3 text-base font-bold text-ink">Architectural Blueprint Studio Ready</h4>
                <p className="mt-1 text-[12px] text-muted max-w-md mx-auto leading-relaxed">
                  Configure your project parameters on the left and click <strong>"Generate Blueprint & Find Contractors"</strong> to generate a 2D architectural blueprint layout, structural specifications, material BOQ, and matched contractors!
                </p>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT & ENHANCE EXISTING BLUEPRINT */}
      {activeTab === "enhance" && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Form */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="p-5">
              <div className="flex items-center gap-2 border-b border-white/[0.06] pb-3">
                <Sparkles size={18} className="text-orange" />
                <h3 className="text-[13.5px] font-bold text-ink">Audit & Enhance Existing Drawing</h3>
              </div>

              {enhanceError && (
                <div className="mt-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-3 text-[12px] text-red-300">
                  {enhanceError}
                </div>
              )}

              <form onSubmit={handleEnhance} className="mt-4 space-y-3.5 text-[12.5px]">
                <div>
                  <label className={labelClass}>Project Category</label>
                  <input
                    type="text"
                    value={enhanceForm.project_type}
                    onChange={(e) => setEnhanceForm({ ...enhanceForm, project_type: e.target.value })}
                    placeholder="e.g. 2-Storey Villa or Railway Station Concourse"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Location (City, State) *</label>
                  <input
                    type="text"
                    value={enhanceForm.location}
                    onChange={(e) => setEnhanceForm({ ...enhanceForm, location: e.target.value })}
                    placeholder="e.g. Mumbai, Maharashtra"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Existing Blueprint Layout / Drawing Notes *</label>
                  <textarea
                    value={enhanceForm.existing_blueprint_description}
                    onChange={(e) => setEnhanceForm({ ...enhanceForm, existing_blueprint_description: e.target.value })}
                    rows={4}
                    placeholder="Describe your current floor plan: room sizes, long spans, wall materials, orientation, and any known structural concerns..."
                    className={inputClass}
                    required
                  />
                  <p className="mt-1 text-[10.5px] text-muted">
                    Our AI forensic civil engineer will audit the structural integrity, ventilation, and cost optimizations.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full justify-center shadow-submit"
                  disabled={enhanceLoading}
                >
                  {enhanceLoading ? (
                    <>
                      <Loader2 size={15} className="mr-2 animate-spin" />
                      Auditing Blueprint...
                    </>
                  ) : (
                    <>
                      <Sparkles size={15} className="mr-2" />
                      Run AI Blueprint Audit & Add-ons
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Right: Enhancement Findings */}
          <div className="lg:col-span-7 space-y-4">
            {enhanceResult ? (
              <>
                <Card className="p-5 border-l-4 border-l-emerald-500">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-400" />
                    <h4 className="text-[14px] font-bold text-ink">
                      Audit Complete: {enhanceResult.project_type} ({enhanceResult.location})
                    </h4>
                  </div>
                  <p className="mt-1 text-[12px] text-muted leading-relaxed">
                    {enhanceResult.audit_summary}
                  </p>
                </Card>

                {/* Matrix of Add-ons */}
                <div className="space-y-3">
                  {enhanceResult.enhancement_matrix?.map((item, idx) => (
                    <Card key={idx} className="p-4 hover:border-orange/30 transition-all">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange/15 border border-orange/30 text-orange font-extrabold text-[11px]">
                            {idx + 1}
                          </span>
                          <h5 className="font-bold text-ink text-[13px]">{item.category}</h5>
                        </div>
                        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[10.5px] font-bold text-emerald-400">
                          {item.cost_impact}
                        </span>
                      </div>

                      <div className="mt-2.5 space-y-1.5 text-[12px]">
                        <p className="text-slate-200">
                          <strong className="text-ink">Current Design Flaw:</strong> {item.observation}
                        </p>
                        <p className="text-amber-400">
                          <strong className="text-amber-300">Risk Identified:</strong> {item.risk}
                        </p>
                        <div className="mt-2 rounded-xl bg-orange/[0.06] p-3 text-slate-200 border border-orange/20">
                          <strong className="font-bold text-orange">✨ Recommended AI Add-on:</strong> {item.recommended_addon}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <Card className="p-12 text-center border-dashed border-2 border-white/[0.08]">
                <Wrench size={40} className="mx-auto text-orange/50" />
                <h4 className="mt-3 text-base font-bold text-ink">AI Blueprint Audit Engine Ready</h4>
                <p className="mt-1 text-[12px] text-muted max-w-md mx-auto leading-relaxed">
                  Enter your drawing details on the left to run an automated forensic audit for Vastu compliance, cost-saving structural alterations, and seismic safety checks.
                </p>
              </Card>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
