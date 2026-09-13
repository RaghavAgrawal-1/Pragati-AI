import { useEffect, useState } from "react";
import {
  Award,
  Building2,
  CheckCircle2,
  Clock,
  Filter,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  Star,
  ThumbsUp,
  TrendingUp,
  AlertCircle,
  Briefcase,
  MapPin,
  FileCheck,
} from "lucide-react";
import Card from "../../components/common/Card";
import Button from "../../components/common/Button";
import PageHeader from "../../components/layout/PageHeader";
import LoadingSpinner from "../../components/feedback/LoadingSpinner";
import { contractorService } from "../../services/contractorService";
import ContractorOnboardingModal from "./ContractorOnboardingModal";
import ContractorWorkUpdateModal from "./ContractorWorkUpdateModal";

const SECTORS = [
  "ALL",
  "Highways",
  "Rail",
  "Bridges",
  "Renewable",
  "Urban",
];

const GRADES = ["ALL", "A+", "A", "B+", "B"];

function getBadgeStyle(badge) {
  switch (badge) {
    case "TIER_1_PREFERRED":
      return {
        label: "Tier-1 Preferred Partner",
        bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
        icon: ShieldCheck,
      };
    case "ON_TIME_EXCELLENCE":
      return {
        label: "On-Time Excellence",
        bg: "bg-sky-50 text-sky-700 border-sky-200",
        icon: Award,
      };
    case "UNDER_MONITORING":
      return {
        label: "Under Performance Review",
        bg: "bg-amber-50 text-amber-700 border-amber-200",
        icon: Clock,
      };
    default:
      return {
        label: "Verified Partner",
        bg: "bg-indigo-50 text-indigo-700 border-indigo-200",
        icon: CheckCircle2,
      };
  }
}

function getGradeBadgeColor(grade) {
  switch (grade) {
    case "A+":
      return "bg-emerald-600 text-white";
    case "A":
      return "bg-navy text-white";
    case "B+":
      return "bg-sky-600 text-white";
    default:
      return "bg-slate-600 text-white";
  }
}

export default function ContractorRegistry() {
  const [contractors, setContractors] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedSector, setSelectedSector] = useState("ALL");
  const [selectedGrade, setSelectedGrade] = useState("ALL");
  const [sortBy, setSortBy] = useState("trust_score");

  // Modals
  const [onboardingOpen, setOnboardingOpen] = useState(false);
  const [selectedContractor, setSelectedContractor] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [listData, summaryData] = await Promise.all([
        contractorService.list({
          search: search || undefined,
          sector: selectedSector !== "ALL" ? selectedSector : undefined,
          grade: selectedGrade !== "ALL" ? selectedGrade : undefined,
          sort_by: sortBy,
        }),
        contractorService.summary(),
      ]);
      setContractors(Array.isArray(listData) ? listData : []);
      setSummary(summaryData);
    } catch (err) {
      console.error("Error fetching contractor data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedSector, selectedGrade, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <PageHeader
        title="Contractor & Builder Trust Registry"
        subtitle="National performance ratings, on-time delivery credentials, and vendor onboarding under PM GatiShakti & MoSPI"
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="secondary"
              size="sm"
              onClick={fetchData}
              disabled={loading}
            >
              <RefreshCw size={14} className="mr-1.5" />
              Refresh
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setOnboardingOpen(true)}
            >
              <Plus size={15} className="mr-1.5" />
              Register as New Contractor
            </Button>
          </div>
        }
      />

      {/* Top Macro Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 border-l-4 border-l-navy">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
              Enlisted EPC Contractors
            </p>
            <Building2 size={18} className="text-navy" />
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">
            {summary?.total_contractors ?? contractors.length}
          </p>
          <p className="mt-0.5 text-[11px] text-muted">
            Monitored across {summary?.total_projects_monitored ?? 120}+ work packages
          </p>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
              National On-Time Delivery Rate
            </p>
            <Clock size={18} className="text-emerald-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-emerald-700">
            {summary?.overall_on_time_delivery_rate ?? 86.4}%
          </p>
          <p className="mt-0.5 text-[11px] text-muted">
            Milestones delivered within statutory schedule
          </p>
        </Card>

        <Card className="p-4 border-l-4 border-l-sky-600">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
              Tier-1 Preferred Partners
            </p>
            <ShieldCheck size={18} className="text-sky-600" />
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">
            {summary?.tier1_preferred_count ?? 3} Firms
          </p>
          <p className="mt-0.5 text-[11px] text-muted">
            Grade A+ with &gt;90% on-time record
          </p>
        </Card>

        <Card className="p-4 border-l-4 border-l-amber-500">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
              Average Trust Index
            </p>
            <Star size={18} className="text-amber-500" />
          </div>
          <p className="mt-2 text-2xl font-bold text-ink">
            {summary?.average_trust_score ?? 84.5} <span className="text-[13px] font-normal text-muted">/ 100</span>
          </p>
          <p className="mt-0.5 text-[11px] text-muted">
            Weighted on-time, safety & quality metrics
          </p>
        </Card>
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
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-9 pr-3 py-2 text-[12.5px] text-ink focus:border-navy focus:bg-white focus:outline-none focus:ring-1 focus:ring-navy"
            />
          </form>

          {/* Filters & Sorting */}
          <div className="flex flex-wrap items-center gap-3 text-[12px]">
            {/* Sector filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto py-1">
              <span className="text-muted font-medium mr-1">Sector:</span>
              {SECTORS.map((sec) => (
                <button
                  key={sec}
                  onClick={() => setSelectedSector(sec)}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium transition ${
                    selectedSector === sec
                      ? "bg-navy text-white"
                      : "bg-slate-100 text-muted hover:bg-slate-200 hover:text-ink"
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>

            {/* Grade filter */}
            <div className="flex items-center gap-1.5">
              <span className="text-muted font-medium mr-1">Grade:</span>
              {GRADES.map((g) => (
                <button
                  key={g}
                  onClick={() => setSelectedGrade(g)}
                  className={`rounded-md px-2 py-0.5 text-[11px] font-semibold transition ${
                    selectedGrade === g
                      ? "bg-slate-900 text-white"
                      : "bg-slate-100 text-muted hover:bg-slate-200"
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>

            {/* Sort */}
            <div className="flex items-center gap-1.5 ml-auto">
              <span className="text-muted font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-[11.5px] text-ink focus:border-navy focus:outline-none"
              >
                <option value="trust_score">Highest Trust Score</option>
                <option value="on_time">Highest On-Time Rate</option>
                <option value="name">Company Name (A-Z)</option>
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
          <Button
            variant="primary"
            size="sm"
            className="mt-4"
            onClick={() => setOnboardingOpen(true)}
          >
            Register New Contractor
          </Button>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {contractors.map((contractor) => {
            const badgeMeta = getBadgeStyle(contractor.badge);
            const BadgeIcon = badgeMeta.icon;
            const onTimePct = Math.round(
              (contractor.on_time_projects / Math.max(contractor.total_projects, 1)) * 100
            );

            return (
              <Card
                key={contractor.id}
                className="p-5 flex flex-col justify-between hover:shadow-md transition border border-slate-200/80"
              >
                <div>
                  {/* Top Row: Company & Badge */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-[14.5px] font-bold text-ink hover:text-navy transition">
                          {contractor.company_name}
                        </h3>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-black tracking-wide ${getGradeBadgeColor(
                            contractor.rating_grade
                          )}`}
                        >
                          {contractor.rating_grade}
                        </span>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted">
                        <span className="flex items-center gap-1">
                          <MapPin size={11} />
                          {contractor.headquarters}
                        </span>
                        <span>•</span>
                        <span>{contractor.registration_no}</span>
                      </div>
                    </div>

                    {/* Trust Score circular block */}
                    <div className="text-right shrink-0">
                      <div className="text-xl font-black text-navy">
                        {contractor.trust_score}
                      </div>
                      <p className="text-[9.5px] uppercase font-semibold tracking-wider text-muted">
                        Trust Score
                      </p>
                    </div>
                  </div>

                  {/* Verification Badge */}
                  <div className="mt-3 flex items-center justify-between">
                    <div
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10.5px] font-medium ${badgeMeta.bg}`}
                    >
                      <BadgeIcon size={12} />
                      <span>{badgeMeta.label}</span>
                    </div>

                    <span className="text-[11px] text-slate-500 font-medium">
                      {contractor.contractor_class}
                    </span>
                  </div>

                  {/* On-Time Delivery Progress Metric */}
                  <div className="mt-4 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                    <div className="flex items-center justify-between text-[11.5px]">
                      <span className="font-semibold text-ink flex items-center gap-1.5">
                        <Clock size={13} className="text-emerald-600" />
                        On-Time Completion Rate
                      </span>
                      <span className="font-bold text-emerald-700">{onTimePct}%</span>
                    </div>

                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-200">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-500"
                        style={{ width: `${Math.min(100, onTimePct)}%` }}
                      />
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-muted">
                      <span>
                        <strong className="text-ink font-medium">{contractor.on_time_projects}</strong> On-Time Delivered
                      </span>
                      <span>
                        <strong className="text-amber-600 font-medium">{contractor.delayed_projects}</strong> Delayed
                      </span>
                      <span>
                        <strong className="text-ink font-medium">{contractor.total_projects}</strong> Total Works
                      </span>
                    </div>
                  </div>

                  {/* Key Achievements or Works */}
                  {contractor.key_achievements && (
                    <div className="mt-3 rounded-lg border border-slate-100 bg-white p-2.5">
                      <p className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                        Track Record & Achievements
                      </p>
                      <p className="mt-1 text-[11.5px] text-ink leading-relaxed line-clamp-2">
                        {contractor.key_achievements}
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Footer: Rating + Actions */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11.5px]">
                    <div className="flex items-center text-amber-400">
                      <Star size={13} fill="currentColor" />
                    </div>
                    <span className="font-semibold text-ink">
                      {contractor.market_rating_avg?.toFixed(1) ?? "4.5"}
                    </span>
                    <span className="text-muted text-[11px]">
                      ({contractor.market_reviews_count} reviews)
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedContractor(contractor)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[11.5px] font-medium text-navy hover:bg-slate-50 hover:border-slate-300 shadow-sm transition"
                  >
                    <ThumbsUp size={12} />
                    <span>Update / Give Feedback</span>
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Onboarding Modal */}
      <ContractorOnboardingModal
        isOpen={onboardingOpen}
        onClose={() => setOnboardingOpen(false)}
        onRegistered={(newContractor) => {
          fetchData();
        }}
      />

      {/* Update Work / Give Feedback Modal */}
      <ContractorWorkUpdateModal
        isOpen={!!selectedContractor}
        contractor={selectedContractor}
        onClose={() => setSelectedContractor(null)}
        onUpdated={(updated) => {
          fetchData();
        }}
      />
    </div>
  );
}
