import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/feedback/LoadingSpinner";

export default function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  // Session restore in flight — hold rather than flashing the login screen.
  if (status === "checking") {
    return <div className="grid h-screen place-items-center bg-canvas"><LoadingSpinner size={24} /></div>;
  }

  if (status !== "authenticated") {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}
