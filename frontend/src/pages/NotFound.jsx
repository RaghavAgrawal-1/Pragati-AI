import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas px-6">
      <div className="text-center">
        <p className="text-[13px] font-medium uppercase tracking-[0.14em] text-muted">404</p>
        <h1 className="mt-3 text-[28px] font-light tracking-tight text-ink">This page does not exist.</h1>
        <p className="mt-2 text-[13px] text-muted">The link may be out of date, or the project may have been removed.</p>
        <Link to="/dashboard" className="mt-6 inline-flex h-10 items-center rounded-md bg-navy px-4 text-[13px] font-medium text-white hover:bg-navy-soft">
          Back to overview
        </Link>
      </div>
    </div>
  );
}
