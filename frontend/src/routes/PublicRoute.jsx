import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LoadingSpinner from "../components/feedback/LoadingSpinner";

/** Keeps signed-in users out of /login and the password screens. */
export default function PublicRoute() {
  const { status } = useAuth();

  if (status === "checking") {
    return <div className="grid h-screen place-items-center bg-canvas"><LoadingSpinner size={24} /></div>;
  }

  return status === "authenticated" ? <Navigate to="/dashboard" replace /> : <Outlet />;
}
