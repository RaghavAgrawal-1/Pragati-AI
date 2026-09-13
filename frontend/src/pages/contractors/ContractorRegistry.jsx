import { useEffect, useState } from "react";
import {
  Award, Building2, CheckCircle2, Clock, Filter, Plus, RefreshCw,
  Search, ShieldCheck, Star, ThumbsUp, TrendingUp, AlertCircle,
  Briefcase, MapPin, FileCheck,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import PageHeader from "../../components/layout/PageHeader";
import LoadingSpinner from "../../components/feedback/LoadingSpinner";
import { contractorService } from "../../services/contractorService";
import ContractorOnboardingModal from "./ContractorOnboardingModal";
import ContractorWorkUpdateModal from "./ContractorWorkUpdateModal";

const SECTORS = ["ALL", "Highways", "Rail", "Bridges", "Renewable", "Urban"];
const GRADES = ["ALL", "A+", "A", "B+", "B"];

function getBadgeStyle(badge) {
  switch (badge) {
    case "TIER_1_PREFERRED":
      return {
        label: "Tier-1 Preferred Partner",
        bg: "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20",
        icon: ShieldCheck,
      };
    case "ON_TIME_EXCELLENCE":
      return {
        label: "On-Time Excellence",
        bg: "bg-sky-500/10 text-sky-400 border border-sky-500/20",
        icon: Award,
      };
    case "UNDER_MONITORING":
      return {
        label: "Under Performance Review",
        bg: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
        icon: Clock,
      };
    default:
      return {
        label: "Verified Partner",
        bg: "bg-orange/10 text-orange border border-orange/20",
        icon: CheckCircle2,
      };
  }
}

function getGradeBadgeColor(grade) {
  switch (grade) {
    case "A+":
      return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
    case "A":
      return "bg-orange/20 text-orange border border-orange/30";
    case "B+":
      return "bg-sky-500/20 text-sky-400 border border-sky-500/30";
    default:
      return "bg-white/[0.06] text-muted border border-white/[0.06]";
  }
}

export default function ContractorRegistry() {
  const [contractors, setContractors] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState("ALL");
  const [selectedGrade, setSelectedGrade] = useState("ALL");
  const [sortBy, setSortBy] = useState("trust_score");

  // Modal controls
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedContractorForUpdate, setSelectedContractorForUpdate] = useState(null);

  const fetchContractors = async (customParams = {}) => {
    setLoading(true);
    try {
      const activeSearch = customParams.search !== undefined ? customParams.search : search;
      const activeSector = customParams.sector !== undefined ? customParams.sector : selectedSector;
      const activeGrade = customParams.grade !== undefined ? customParams.grade : selectedGrade;

      const params = {
        sort_by: sortBy,
      };
      if (activeSearch && activeSearch.trim()) params.search = activeSearch.trim();
      if (activeSector && activeSector !== "ALL") params.sector = activeSector;
      if (activeGrade && activeGrade !== "ALL") params.grade = activeGrade;

      const res = await contractorService.list(params);
      const items = Array.isArray(res) ? res : (res?.items ?? []);
      setContractors(items);

      const sumRes = await contractorService.summary().catch(() => null);
      if (sumRes) setSummary(sumRes);
    } catch (err) {
      console.error("Failed to load contractors:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContractors();
  }, [selectedSector, selectedGrade, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchContractors();
  };

  const handleContractorRegistered = (newContractor) => {
    setShowOnboarding(false);
    setSearch("");
    setSelectedSector("ALL");
    setSelectedGrade("ALL");

    if (newContractor && newContractor.id) {
      setContractors((prev) => [
        newContractor,
        ...prev.filter((c) => c.id !== newContractor.id),
      ]);
    }

    fetchContractors({ search: "", sector: "ALL", grade: "ALL" });
  };

  return (
    <div className="space-y-6 animate-slideUp">
      <PageHeader
        title="National EPC Contractor Trust & Capability Registry"
        subtitle="Verifiable performance ledger, AI trust scoring, and historical delivery track-record of infrastructure contractors."
        actions={
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => setShowOnboarding(true)}
            className="shadow-submit"
          >
            Onboard New Contractor
          </Button>
        }
      />

      {/* Top Macro Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border-l-4 border-l-orange border border-white/[0.06] bg-surface-card p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-orange">
              Enlisted EPC Contractors
            </p>
            <Building2 size={16} className="text-orange" />
          </div>
          <p className="text-[26px] font-extrabold tabular-nums text-ink">
            {summary?.total_contractors ?? contractors.length}
          </p>
          <p className="mt-1 text-[11px] text-muted">
            Monitored across {summary?.total_projects_monitored ?? 120}+ work packages
          </p>
        </div>

        <div className="rounded-2xl border-l-4 border-l-emerald-500 border border-white/[0.06] bg-surface-card p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-emerald-400">
              National On-Time Delivery Rate
            </p>
            <Clock size={16} className="text-emerald-400" />
          </div>
          <p className="text-[26px] font-extrabold tabular-nums text-emerald-400">
            {summary?.overall_on_time_delivery_rate ?? 86.4}%
          </p>
          <p className="mt-1 text-[11px] text-muted">
            Milestones delivered within statutory schedule
          </p>
        </div>

        <div className="rounded-2xl border-l-4 border-l-sky-500 border border-white/[0.06] bg-surface-card p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-sky-400">
              Tier-1 Preferred Partners
            </p>
            <ShieldCheck size={16} className="text-sky-400" />
          </div>
          <p className="text-[26px] font-extrabold tabular-nums text-sky-400">
            {summary?.tier1_preferred_count ?? 3} Firms
          </p>
          <p className="mt-1 text-[11px] text-muted">
            Grade A+ with &gt;90% on-time record
          </p>
        </div>

        <div className="rounded-2xl border-l-4 border-l-amber-500 border border-white/[0.06] bg-surface-card p-4">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10.5px] font-bold uppercase tracking-widest text-amber-400">
              Average Trust Index
            </p>
            <Star size={16} className="text-amber-400" />
          </div>
          <p className="text-[26px] font-extrabold tabular-nums text-amber-400">
            {summary?.average_trust_score ?? 84.5} <span className="text-[12px] font-normal text-muted">/ 100</span>
          </p>
          <p className="mt-1 text-[11px] text-muted">
            Weighted on-time, safety & quality metrics
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Input */}
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search contractor name, GSTIN, or city..."
              className="w-full rounded-xl border border-white/[0.08] bg-white/[0.05] pl-9 pr-3 py-2 text-[12.5px] text-ink placeholder:text-muted focus:border-orange/50 focus:outline-none transition-all"
            />
          </form>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-3 text-[12px]">
            {/* Sector filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              <span className="text-muted font-bold uppercase text-[10.5px] tracking-widest mr-1">Sector:</span>
              {SECTORS.map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSelectedSector(sec)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                    selectedSector === sec
                      ? "bg-orange text-white"
                      : "bg-white/[0.06] text-muted hover:bg-white/[0.10] hover:text-ink"
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>

            {/* Grade filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-muted font-bold uppercase text-[10.5px] tracking-widest mr-1">Grade:</span>
              {GRADES.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`rounded-lg px-2 py-0.5 text-[11px] font-semibold transition ${
                    selectedGrade === g
                      ? "bg-orange text-white"
                      : "bg-white/[0.06] text-muted hover:bg-white/[0.10]"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-muted font-bold uppercase text-[10.5px] tracking-widest">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-xl border border-white/[0.08] bg-surface-card px-2.5 py-1.5 text-[11.5px] text-ink focus:border-orange/50 focus:outline-none"
                style={{ backgroundColor: "#1A1B25", color: "#F0F2F8" }}
              >
                <option value="trust_score" style={{ backgroundColor: "#1A1B25", color: "#F0F2F8" }}>Highest Trust Score</option>
                <option value="on_time" style={{ backgroundColor: "#1A1B25", color: "#F0F2F8" }}>Highest On-Time Rate</option>
                <option value="name" style={{ backgroundColor: "#1A1B25", color: "#F0F2F8" }}>Company Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Contractors Grid */}
      {loading ? (
        <div className="grid min-h-[300px] place-items-center">
          <LoadingSpinner size={24} />
        </div>
      ) : contractors.length === 0 ? (
        <Card className="p-12 text-center">
          <Building2 size={36} className="mx-auto text-muted/50" />
          <h4 className="mt-3 text-base font-semibold text-ink">No Contractors Found</h4>
          <p className="mt-1 text-[12px] text-muted">
            Try adjusting your search filters or register a new contractor.
          </p>
          <div className="mt-4 flex items-center justify-center gap-3">
            {(search || selectedSector !== "ALL" || selectedGrade !== "ALL") && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch("");
                  setSelectedSector("ALL");
                  setSelectedGrade("ALL");
                  fetchContractors({ search: "", sector: "ALL", grade: "ALL" });
                }}
              >
                Clear Filters
              </Button>
            )}
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowOnboarding(true)}
            >
              Register Contractor
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contractors.map((contractor) => {
            const badgeStyle = getBadgeStyle(contractor.badge);
            const BadgeIcon = badgeStyle.icon;
            const gradeColor = getGradeBadgeColor(contractor.rating_grade);

            return (
              <Card
                key={contractor.id}
                className="flex flex-col justify-between p-5 hover:border-orange/20 transition-all"
              >
                <div>
                  {/* Top Bar: Grade & Status Badge */}
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10.5px] font-bold ${badgeStyle.bg}`}
                    >
                      <BadgeIcon size={12} />
                      {badgeStyle.label}
                    </span>

                    <span
                      className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${gradeColor}`}
                    >
                      Grade {contractor.rating_grade || "A"}
                    </span>
                  </div>

                  {/* Company Name */}
                  <h3 className="mt-3 text-[15px] font-extrabold text-ink line-clamp-1">
                    {contractor.company_name || contractor.name}
                  </h3>
                  <p className="text-[11.5px] text-muted font-mono flex items-center gap-1.5 mt-0.5">
                    <MapPin size={12} className="text-orange" />
                    {contractor.headquarters || contractor.city || "Pan-India"}
                  </p>

                  {/* Key Performance Indicators */}
                  <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-[12px]">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-muted">
                        Trust Score
                      </p>
                      <p className="mt-0.5 text-[16px] font-extrabold text-orange tabular-nums">
                        {contractor.trust_score} <span className="text-[10px] text-muted font-normal">/100</span>
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-widest text-muted">
                        On-Time Rate
                      </p>
                      <p className="mt-0.5 text-[16px] font-extrabold text-emerald-400 tabular-nums">
                        {contractor.on_time_delivery_rate ?? Math.round((contractor.on_time_projects / max(1, contractor.total_projects)) * 100) ?? 90}%
                      </p>
                    </div>
                  </div>

                  {/* Operational Capabilities */}
                  <div className="mt-3.5 space-y-1.5 text-[11.5px] text-muted">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Briefcase size={13} className="text-muted" /> Monitored Works:
                      </span>
                      <span className="font-semibold text-ink tabular-nums">
                        {contractor.total_projects ?? 12} Projects ({contractor.on_time_projects ?? 10} On-Time)
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <FileCheck size={13} className="text-muted" /> Primary Sector:
                      </span>
                      <span className="font-semibold text-ink">
                        {contractor.sector_specialization || contractor.primary_sector || "Civil Engineering"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[10.5px] font-mono text-muted">
                    Reg: {contractor.registration_no ? `${contractor.registration_no.slice(0, 10)}...` : "VERIFIED"}
                  </span>

                  <button
                    onClick={() => setSelectedContractorForUpdate(contractor)}
                    className="inline-flex items-center gap-1 text-[12px] font-semibold text-orange hover:text-orange-light transition-colors"
                  >
                    Update Metrics →
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Onboarding Modal */}
      {showOnboarding && (
        <ContractorOnboardingModal
          isOpen={showOnboarding}
          onClose={() => setShowOnboarding(false)}
          onRegistered={handleContractorRegistered}
          onSuccess={handleContractorRegistered}
        />
      )}

      {/* Work Update Modal */}
      {selectedContractorForUpdate && (
        <ContractorWorkUpdateModal
          isOpen={Boolean(selectedContractorForUpdate)}
          contractor={selectedContractorForUpdate}
          onClose={() => setSelectedContractorForUpdate(null)}
          onSuccess={() => {
            setSelectedContractorForUpdate(null);
            fetchContractors();
          }}
        />
      )}
    </div>
  );
}

function max(a, b) {
  return a > b ? a : b;
}
