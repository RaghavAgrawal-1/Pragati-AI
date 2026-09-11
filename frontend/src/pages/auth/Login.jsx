import { Navigate } from "react-router-dom";
import LoginCard from "../../components/auth/LoginCard";
import { useAuth } from "../../hooks/useAuth";

function MarketingNav() {
  return (
    <nav className="flex shrink-0 items-center justify-between gap-6 px-1 pb-5 pt-1">
      <div className="flex items-center gap-3.5">
        <svg width="32" height="32" viewBox="0 0 26 26" fill="none" aria-hidden="true">
          <circle cx="13" cy="13" r="12" stroke="#242E48" strokeWidth="1" opacity=".25" />
          <path d="M13 3a10 10 0 0 1 0 20" stroke="#242E48" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M13 7a6 6 0 0 0 0 12" stroke="#8C99CF" strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="13" cy="13" r="2" fill="#242E48" />
        </svg>
        <span className="block">
          <span className="block text-[19px] font-bold leading-none tracking-[0.2em] sm:text-[22px]">PRAGATI AI</span>
          <span className="mt-1.5 block text-[11px] text-muted">Infrastructure Intelligence</span>
        </span>
      </div>
      <a href="#help" className="hidden text-[12.5px] text-muted transition-colors hover:text-ink sm:block">Need help?</a>
    </nav>
  );
}

export default function Login() {
  const { status } = useAuth();
  if (status === "authenticated") return <Navigate to="/dashboard" replace />;

  return (
    <div className="relative flex h-full min-h-screen flex-col overflow-hidden bg-canvas lg:h-screen lg:min-h-0">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-64 h-[620px] w-[620px] rounded-full bg-[#96A3DC]/25 blur-[100px]" />
        <div className="absolute -bottom-72 -left-44 h-[560px] w-[560px] rounded-full bg-[#C5C1E4]/30 blur-[100px]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-[1180px] flex-1 flex-col px-4 pb-5 pt-4 sm:px-7">
        <MarketingNav />
        <LoginCard />
        <p className="mt-3 shrink-0 text-center text-[11.5px] text-[#9AA0B0]">
          Protected by single sign-on and audit logging on every project workspace.
        </p>
      </div>
    </div>
  );
}
