import { useState } from "react";
import {
  Compass,
  Sparkles,
  Building2,
  MapPin,
  Layers,
  Ruler,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Download,
  AlertTriangle,
  Lightbulb,
  Award,
  Phone,
  Mail,
  Loader2,
  ArrowRight,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import PageHeader from "../../components/layout/PageHeader";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import { blueprintService } from "../../services/blueprintService";

export default function BlueprintStudio() {
  const [activeTab, setActiveTab] = useState("generate");

  // Tab 1: Generate state
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState("");
  const [blueprintResult, setBlueprintResult] = useState(null);

  const [genForm, setGenForm] = useState({
    project_type: "Residential 3BHK House",
    location: "Jaipur, Rajasthan",
    plot_width_ft: 30,
    plot_length_ft: 50,
    floors: 1,
    budget_lakhs: 45,
    special_requirements: "Vastu compliant, Rainwater harvesting, Solar rooftop orientation",
  });

  // Tab 2: Enhance state
  const [enhanceLoading, setEnhanceLoading] = useState(false);
  const [enhanceError, setEnhanceError] = useState("");
  const [enhanceResult, setEnhanceResult] = useState(null);

  const [enhanceForm, setEnhanceForm] = useState({
    project_type: "Residential House",
    location: "Mumbai, Maharashtra",
    existing_blueprint_description:
      "30x40 ft G+1 layout with large 22-ft living hall, red clay brick perimeter walls, Western-facing kitchen, and shallow plinth depth without dedicated rainwater sump.",
    floors: 2,
  });

  // Tab 3: Quick Matcher state
  const [quickLocation, setQuickLocation] = useState("Jaipur, Rajasthan");
  const [quickSector, setQuickSector] = useState("Residential");
  const [matchedContractors, setMatchedContractors] = useState([]);
  const [matcherLoading, setMatcherLoading] = useState(false);

  // Handle Generate
  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenLoading(true);
    setGenError("");
    try {
      const data = await blueprintService.generate({
        ...genForm,
        plot_width_ft: parseFloat(genForm.plot_width_ft) || 30,
        plot_length_ft: parseFloat(genForm.plot_length_ft) || 50,
        floors: parseInt(genForm.floors, 10) || 1,
        budget_lakhs: parseFloat(genForm.budget_lakhs) || 45,
      });
      setBlueprintResult(data);
    } catch (err) {
      setGenError(err.message || "Failed to generate blueprint plan.");
    } finally {
      setGenLoading(false);
    }
  };

  // Handle Enhance
  const handleEnhance = async (e) => {
    e.preventDefault();
    setEnhanceLoading(true);
    setEnhanceError("");
    try {
      const data = await blueprintService.enhance({
        ...enhanceForm,
        floors: parseInt(enhanceForm.floors, 10) || 1,
      });
      setEnhanceResult(data);
    } catch (err) {
      setEnhanceError(err.message || "Failed to audit blueprint.");
    } finally {
      setEnhanceLoading(false);
    }
  };

  // Handle Quick Matcher
  const handleQuickMatch = async (e) => {
    e?.preventDefault();
    setMatcherLoading(true);
    try {
      const data = await blueprintService.matchContractors({
        location: quickLocation,
        sector: quickSector,
      });
      setMatchedContractors(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setMatcherLoading(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <PageHeader
        title="AI Blueprint Studio & Location Contractor Match"
        subtitle="Generate architectural CAD layouts, structural BOQs, audit existing drawings, and match verified local builders"
        actions={
          <div className="flex items-center gap-2 rounded-xl bg-slate-100 p-1 text-[12px]">
            <button
              onClick={() => setActiveTab("generate")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition ${
                activeTab === "generate" ? "bg-white text-navy shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              <Compass size={14} />
              <span>Generate Blueprint</span>
            </button>
            <button
              onClick={() => setActiveTab("enhance")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition ${
                activeTab === "enhance" ? "bg-white text-navy shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              <Sparkles size={14} />
              <span>Audit & Enhance</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("matcher");
                if (matchedContractors.length === 0) handleQuickMatch();
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-medium transition ${
                activeTab === "matcher" ? "bg-white text-navy shadow-sm" : "text-muted hover:text-ink"
              }`}
            >
              <Building2 size={14} />
              <span>Match Local Contractors</span>
            </button>
          </div>
        }
      />

      {/* TAB 1: GENERATE BLUEPRINT */}
      {activeTab === "generate" && (
        <div className="grid gap-6 lg:grid-cols-12">
          {/* Left Form: Input Specifications */}
          <div className="lg:col-span-4 space-y-4">
            <Card className="p-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Compass size={18} className="text-navy" />
                <h3 className="text-[14px] font-semibold text-ink">Project Specifications</h3>
              </div>

              {genError && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-2.5 text-[12px] text-red-700">
                  {genError}
                </div>
              )}

              <form onSubmit={handleGenerate} className="mt-4 space-y-3.5 text-[12.5px]">
                <div>
                  <label className="block font-medium text-ink mb-1">Project Type</label>
                  <select
                    value={genForm.project_type}
                    onChange={(e) => setGenForm({ ...genForm, project_type: e.target.value })}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-ink focus:border-navy focus:outline-none"
                  >
                    <option value="Residential 3BHK House">Residential 3BHK House / Villa</option>
                    <option value="Residential 2BHK Independent House">Residential 2BHK Independent House</option>
                    <option value="Commercial Warehouse & Logistics Hub">Commercial Warehouse & Logistics Hub</option>
                    <option value="Railway Station Passenger Terminal">Railway Station Passenger Terminal</option>
                    <option value="Highway Interchange & Bridge Package">Highway Interchange & Bridge Package</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">Target Location (City, State) *</label>
                  <input
                    type="text"
                    value={genForm.location}
                    onChange={(e) => setGenForm({ ...genForm, location: e.target.value })}
                    placeholder="e.g. Jaipur, Rajasthan or Mumbai"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-ink focus:border-navy focus:outline-none"
                    required
                  />
                  <p className="mt-1 text-[10.5px] text-muted">
                    Matches verified contractors headquartered or active in this region.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-ink mb-1">Plot Width (ft)</label>
                    <input
                      type="number"
                      value={genForm.plot_width_ft}
                      onChange={(e) => setGenForm({ ...genForm, plot_width_ft: e.target.value })}
                      min="15"
                      max="300"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-ink focus:border-navy focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-ink mb-1">Plot Length (ft)</label>
                    <input
                      type="number"
                      value={genForm.plot_length_ft}
                      onChange={(e) => setGenForm({ ...genForm, plot_length_ft: e.target.value })}
                      min="20"
                      max="500"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-ink focus:border-navy focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium text-ink mb-1">Storeys / Floors</label>
                    <select
                      value={genForm.floors}
                      onChange={(e) => setGenForm({ ...genForm, floors: e.target.value })}
                      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-ink focus:border-navy focus:outline-none"
                    >
                      <option value="1">G (Ground Only)</option>
                      <option value="2">G + 1 (2 Floors)</option>
                      <option value="3">G + 2 (3 Floors)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-ink mb-1">Budget (₹ Lakhs)</label>
                    <input
                      type="number"
                      value={genForm.budget_lakhs}
                      onChange={(e) => setGenForm({ ...genForm, budget_lakhs: e.target.value })}
                      min="5"
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-ink focus:border-navy focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">Special Design Features</label>
                  <textarea
                    value={genForm.special_requirements}
                    onChange={(e) => setGenForm({ ...genForm, special_requirements: e.target.value })}
                    rows={2}
                    placeholder="e.g. Vastu compliant, rainwater harvesting, solar terrace..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-ink focus:border-navy focus:outline-none"
                  />
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full justify-center"
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
                <Card className="p-5 border border-sky-900/40 bg-slate-900 text-white">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center border-b border-slate-800 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <Compass size={18} className="text-sky-400" />
                        <h3 className="text-[15px] font-bold text-sky-100">
                          {blueprintResult.project_title}
                        </h3>
                      </div>
                      <p className="mt-0.5 text-[11.5px] text-slate-400">
                        {blueprintResult.total_built_up_area_sqft} sq ft built-up • Estimated Outlay: ₹{blueprintResult.estimated_construction_cost_lakhs} Lakhs
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-sky-900/60 border border-sky-600/40 px-2.5 py-0.5 text-[10.5px] text-sky-300 font-mono">
                        NBC 2016 Compliant
                      </span>
                    </div>
                  </div>

                  {/* Render 2D SVG Blueprint */}
                  <div
                    className="mt-4 overflow-hidden rounded-xl bg-[#08101E] p-2"
                    dangerouslySetInnerHTML={{ __html: blueprintResult.svg_blueprint_code }}
                  />
                </Card>

                {/* Spatial Layout & Dimensions Table */}
                <Card className="p-5">
                  <h4 className="text-[13.5px] font-bold text-ink mb-3 flex items-center gap-2">
                    <Ruler size={16} className="text-navy" />
                    Spatial Room Layout & Architectural Zoning
                  </h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[12px]">
                      <thead>
                        <tr className="border-b border-slate-200 bg-slate-50 text-[11px] uppercase tracking-wider text-muted">
                          <th className="py-2.5 px-3">Room / Space</th>
                          <th className="py-2.5 px-3">Dimensions</th>
                          <th className="py-2.5 px-3">Carpet Area</th>
                          <th className="py-2.5 px-3">Vastu / Orientation</th>
                          <th className="py-2.5 px-3">Key Features</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {blueprintResult.spatial_layout.map((room, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50">
                            <td className="py-2 px-3 font-semibold text-ink">{room.name}</td>
                            <td className="py-2 px-3 font-mono text-navy">{room.dimensions}</td>
                            <td className="py-2 px-3 text-muted">{room.area_sqft} sq ft</td>
                            <td className="py-2 px-3">
                              <span className="rounded bg-sky-50 px-2 py-0.5 text-[10.5px] font-medium text-sky-700">
                                {room.orientation}
                              </span>
                            </td>
                            <td className="py-2 px-3 text-[11.5px] text-muted">{room.features}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* Bill of Quantities (BOQ) */}
                <Card className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-[13.5px] font-bold text-ink flex items-center gap-2">
                      <Layers size={16} className="text-emerald-600" />
                      Estimated Bill of Quantities (BOQ & Materials)
                    </h4>
                    <span className="text-[11px] text-muted">CPWD Schedule of Rates 2026</span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {blueprintResult.bill_of_quantities.map((item, idx) => (
                      <div key={idx} className="rounded-xl border border-slate-200 bg-slate-50/60 p-3">
                        <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{item.material}</p>
                        <p className="mt-1 text-[16px] font-bold text-ink">{item.estimated_quantity}</p>
                        <p className="text-[12px] font-semibold text-emerald-700">{item.approx_cost_inr}</p>
                        <p className="mt-1 text-[10px] text-muted leading-snug">{item.benchmark_note}</p>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Recommended Local Contractors for this City */}
                <Card className="p-5 border-l-4 border-l-navy">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-[14px] font-bold text-ink flex items-center gap-2">
                        <ShieldCheck size={18} className="text-navy" />
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
                          className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm hover:border-navy/40 transition"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h5 className="font-bold text-ink text-[13px]">{c.company_name}</h5>
                              <p className="text-[11px] text-muted flex items-center gap-1 mt-0.5">
                                <MapPin size={10} /> {c.headquarters}
                              </p>
                            </div>
                            <span className="rounded bg-navy px-1.5 py-0.5 text-[10px] font-black text-white">
                              {c.rating_grade}
                            </span>
                          </div>

                          <div className="mt-2.5 flex items-center justify-between text-[11px]">
                            <span className="font-medium text-emerald-700">
                              {c.on_time_rate_pct}% On-Time Record
                            </span>
                            <span className="font-semibold text-ink">
                              Score: {c.trust_score}/100
                            </span>
                          </div>

                          <p className="mt-2 text-[10.5px] text-navy font-medium bg-navy/5 p-1.5 rounded">
                            ✓ {c.match_reason}
                          </p>

                          <div className="mt-3 flex items-center gap-2 text-[11px] text-muted border-t border-slate-100 pt-2">
                            {c.contact_phone && (
                              <span className="flex items-center gap-1">
                                <Phone size={11} /> {c.contact_phone}
                              </span>
                            )}
                            {c.contact_email && (
                              <span className="flex items-center gap-1 truncate">
                                <Mail size={11} /> {c.contact_email}
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
              <Card className="p-12 text-center border-dashed border-2">
                <Compass size={40} className="mx-auto text-navy/40" />
                <h4 className="mt-3 text-base font-semibold text-ink">Architectural Blueprint Studio Ready</h4>
                <p className="mt-1 text-[12px] text-muted max-w-md mx-auto">
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
          {/* Left Form: Existing Blueprint Details */}
          <div className="lg:col-span-5 space-y-4">
            <Card className="p-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                <Sparkles size={18} className="text-navy" />
                <h3 className="text-[14px] font-semibold text-ink">Audit & Enhance Existing Drawing</h3>
              </div>

              {enhanceError && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-2.5 text-[12px] text-red-700">
                  {enhanceError}
                </div>
              )}

              <form onSubmit={handleEnhance} className="mt-4 space-y-3.5 text-[12.5px]">
                <div>
                  <label className="block font-medium text-ink mb-1">Project Category</label>
                  <input
                    type="text"
                    value={enhanceForm.project_type}
                    onChange={(e) => setEnhanceForm({ ...enhanceForm, project_type: e.target.value })}
                    placeholder="e.g. 2-Storey Villa or Railway Station Concourse"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-ink focus:border-navy focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">Location (City, State) *</label>
                  <input
                    type="text"
                    value={enhanceForm.location}
                    onChange={(e) => setEnhanceForm({ ...enhanceForm, location: e.target.value })}
                    placeholder="e.g. Mumbai, Maharashtra"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-ink focus:border-navy focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-medium text-ink mb-1">Existing Blueprint Layout / Drawing Notes *</label>
                  <textarea
                    value={enhanceForm.existing_blueprint_description}
                    onChange={(e) => setEnhanceForm({ ...enhanceForm, existing_blueprint_description: e.target.value })}
                    rows={4}
                    placeholder="Describe your current floor plan: room sizes, long spans, wall materials, orientation, and any known structural concerns..."
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-ink focus:border-navy focus:outline-none"
                    required
                  />
                  <p className="mt-1 text-[10.5px] text-muted">
                    Our AI forensic civil engineer will audit the structural integrity, ventilation, and cost optimizations.
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  className="w-full justify-center"
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

          {/* Right: Enhancement Findings & Add-ons */}
          <div className="lg:col-span-7 space-y-4">
            {enhanceResult ? (
              <>
                <Card className="p-5 border-l-4 border-l-emerald-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <h4 className="text-[14px] font-bold text-ink">
                      Audit Complete: {enhanceResult.project_type} ({enhanceResult.location})
                    </h4>
                  </div>
                  <p className="mt-1 text-[12px] text-muted">
                    {enhanceResult.audit_summary}
                  </p>
                </Card>

                {/* Matrix of Add-ons */}
                <div className="space-y-3">
                  {enhanceResult.enhancement_matrix?.map((item, idx) => (
                    <Card key={idx} className="p-4 hover:shadow-sm transition">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-navy/10 text-navy font-bold text-[11px]">
                            {idx + 1}
                          </span>
                          <h5 className="font-bold text-ink text-[13px]">{item.category}</h5>
                        </div>
                        <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10.5px] font-semibold text-emerald-700">
                          {item.cost_impact}
                        </span>
                      </div>

                      <div className="mt-2.5 space-y-1 text-[12px]">
                        <p className="text-slate-700">
                          <strong className="text-slate-900">Current Design Flaw:</strong> {item.observation}
                        </p>
                        <p className="text-amber-800">
                          <strong className="text-amber-900">Risk Identified:</strong> {item.risk}
                        </p>
                        <div className="mt-2 rounded-lg bg-sky-50/80 p-2.5 text-sky-950 border border-sky-100">
                          <strong className="font-semibold text-navy">✨ Recommended AI Add-on:</strong> {item.recommended_addon}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Matched Local Retrofit Contractors */}
                {enhanceResult.recommended_contractors?.length > 0 && (
                  <Card className="p-5">
                    <h5 className="font-bold text-ink text-[13px] mb-2 flex items-center gap-2">
                      <Building2 size={15} className="text-navy" />
                      Verified Contractors to Execute Enhancements in {enhanceResult.location}
                    </h5>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {enhanceResult.recommended_contractors.slice(0, 2).map((c) => (
                        <div key={c.id} className="rounded-lg border border-slate-200 p-3 bg-slate-50/50">
                          <div className="flex justify-between items-center">
                            <h6 className="font-semibold text-ink text-[12.5px]">{c.company_name}</h6>
                            <span className="rounded bg-navy px-1.5 py-0.5 text-[9.5px] text-white font-bold">
                              Grade {c.rating_grade}
                            </span>
                          </div>
                          <p className="text-[11px] text-emerald-700 font-medium mt-1">
                            {c.on_time_rate_pct}% On-Time • Score: {c.trust_score}/100
                          </p>
                          <p className="text-[10.5px] text-muted mt-1">{c.match_reason}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </>
            ) : (
              <Card className="p-12 text-center border-dashed border-2">
                <Sparkles size={40} className="mx-auto text-amber-500/40" />
                <h4 className="mt-3 text-base font-semibold text-ink">Blueprint Forensic Auditor</h4>
                <p className="mt-1 text-[12px] text-muted max-w-md mx-auto">
                  Provide your existing drawing notes to discover structural improvements, seismic reinforcements, cross-ventilation optimizations, and cost-reduction material substitutions.
                </p>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: LOCATION CONTRACTOR MATCHER */}
      {activeTab === "matcher" && (
        <div className="space-y-4">
          <Card className="p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-semibold text-ink flex items-center gap-2">
                  <MapPin size={18} className="text-navy" />
                  Find Top Verified Contractors by Location
                </h3>
                <p className="text-[12px] text-muted">
                  Cross-reference local presence, on-time track record, and verified trust scores for any Indian city.
                </p>
              </div>

              <form onSubmit={handleQuickMatch} className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  value={quickLocation}
                  onChange={(e) => setQuickLocation(e.target.value)}
                  placeholder="Enter city or state (e.g. Jaipur, Mumbai)"
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] text-ink focus:border-navy focus:outline-none"
                  required
                />
                <select
                  value={quickSector}
                  onChange={(e) => setQuickSector(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[12px] text-ink focus:border-navy focus:outline-none"
                >
                  <option value="Residential">Residential & Housing</option>
                  <option value="Highways">Highways & Expressways</option>
                  <option value="Rail">Rail & Metro</option>
                  <option value="Bridges">Bridges & Tunnels</option>
                </select>
                <Button type="submit" variant="primary" size="sm" disabled={matcherLoading}>
                  {matcherLoading ? <Loader2 size={13} className="animate-spin" /> : <Building2 size={13} className="mr-1" />}
                  Search Contractors
                </Button>
              </form>
            </div>

            {/* Contractors List */}
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {matchedContractors.map((c) => (
                <div
                  key={c.id}
                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:border-navy/50 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-ink text-[13.5px]">{c.company_name}</h4>
                        <p className="text-[11px] text-muted flex items-center gap-1 mt-0.5">
                          <MapPin size={11} /> {c.headquarters}
                        </p>
                      </div>
                      <span className="rounded bg-navy px-1.5 py-0.5 text-[10px] font-black text-white">
                        Grade {c.rating_grade}
                      </span>
                    </div>

                    <div className="mt-3 rounded-lg bg-slate-50 p-2.5 flex items-center justify-between text-[11.5px]">
                      <span className="font-medium text-emerald-700">
                        {c.on_time_rate_pct}% On-Time Record
                      </span>
                      <span className="font-bold text-ink">
                        Score: {c.trust_score}/100
                      </span>
                    </div>

                    <p className="mt-2.5 text-[11px] text-navy font-medium bg-navy/5 p-2 rounded">
                      ✓ {c.match_reason}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-muted">
                    <span>{c.contractor_class}</span>
                    <a
                      href={`mailto:${c.contact_email || "contact@pragatai.gov.in"}?subject=Tender Inquiry for ${quickLocation}`}
                      className="inline-flex items-center gap-1 text-navy font-semibold hover:underline"
                    >
                      Inquire <ArrowRight size={11} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
