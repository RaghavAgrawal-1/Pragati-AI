import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import AppShell from "../components/layout/AppShell";
import LoadingSpinner from "../components/feedback/LoadingSpinner";

const Login = lazy(() => import("../pages/auth/Login"));
const ForgotPassword = lazy(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/auth/ResetPassword"));

const Dashboard = lazy(() => import("../pages/dashboard/Dashboard"));
const Projects = lazy(() => import("../pages/projects/Projects"));
const ProjectDetails = lazy(() => import("../pages/projects/ProjectDetails"));
const ProjectTimeline = lazy(() => import("../pages/projects/ProjectTimeline"));
const ProjectPerformance = lazy(() => import("../pages/projects/ProjectPerformance"));
const Performance = lazy(() => import("../pages/projects/Performance"));
const PredictionCenter = lazy(() => import("../pages/predictions/PredictionCenter"));
const CostPrediction = lazy(() => import("../pages/predictions/CostPrediction"));
const TimePrediction = lazy(() => import("../pages/predictions/TimePrediction"));
const RiskIntelligence = lazy(() => import("../pages/risk/RiskIntelligence"));
const Warnings = lazy(() => import("../pages/warnings/Warnings"));
const WarningDetails = lazy(() => import("../pages/warnings/WarningDetails"));
const Interventions = lazy(() => import("../pages/interventions/Interventions"));
const ContractorRegistry = lazy(() => import("../pages/contractors/ContractorRegistry"));
const BlueprintStudio = lazy(() => import("../pages/blueprint/BlueprintStudio"));
const PortfolioAnalytics = lazy(() => import("../pages/analytics/PortfolioAnalytics"));
const CostEscalation = lazy(() => import("../pages/analytics/CostEscalation"));
const Benchmarking = lazy(() => import("../pages/analytics/Benchmarking"));
const Assistant = lazy(() => import("../pages/assistant/Assistant"));
const Settings = lazy(() => import("../pages/settings/Settings"));
const NotFound = lazy(() => import("../pages/NotFound"));

export default function AppRoutes() {
  return (
    <Suspense fallback={<div className="grid min-h-[50vh] place-items-center"><LoadingSpinner size={24} /></div>}>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<Dashboard />} />

            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/projects/:id/timeline" element={<ProjectTimeline />} />
            <Route path="/projects/:id/performance" element={<ProjectPerformance />} />
            <Route path="/performance" element={<Performance />} />

            <Route path="/predictions" element={<PredictionCenter />} />
            <Route path="/predictions/cost" element={<CostPrediction />} />
            <Route path="/predictions/time" element={<TimePrediction />} />
            <Route path="/risk" element={<RiskIntelligence />} />
            <Route path="/blueprint" element={<BlueprintStudio />} />

            <Route path="/warnings" element={<Warnings />} />
            <Route path="/warnings/:id" element={<WarningDetails />} />
            <Route path="/interventions" element={<Interventions />} />
            <Route path="/contractors" element={<ContractorRegistry />} />

            <Route path="/analytics" element={<PortfolioAnalytics />} />
            <Route path="/analytics/cost" element={<CostEscalation />} />
            <Route path="/analytics/benchmark" element={<Benchmarking />} />

            <Route path="/assistant" element={<Assistant />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
