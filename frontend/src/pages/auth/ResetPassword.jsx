import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { authService } from "../../services/authService";
import { isEmail } from "../../utils/validation";

/** Length, case mix, digits and symbols — four independent signals, not a score. */
function strengthOf(pw) {
  const checks = [pw.length >= 10, /[a-z]/.test(pw) && /[A-Z]/.test(pw), /\d/.test(pw), /[^A-Za-z0-9]/.test(pw)];
  const score = checks.filter(Boolean).length;
  return { score, label: ["Too short", "Weak", "Fair", "Good", "Strong"][score] };
}

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const strength = useMemo(() => strengthOf(password), [password]);
  const mismatch = confirm.length > 0 && confirm !== password;
  const ready = password.length >= 8 && !mismatch && confirm.length > 0;

  async function submit(e) {
    e.preventDefault();
    if (!ready || status === "loading") return;
    setStatus("loading");
    try {
      await authService.resetPassword(token, password);
      setStatus("done");
      setTimeout(() => navigate("/login"), 1800);
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-canvas px-5">
      <div className="w-full max-w-[420px] rounded-xl border border-line bg-white p-8 shadow-sm">
        {status === "done" ? (
          <>
            <h1 className="text-[24px] font-light tracking-tight text-ink">Password updated.</h1>
            <p className="mt-3 text-[13px] text-muted">Taking you to the login screen.</p>
          </>
        ) : (
          <>
            <h1 className="text-[24px] font-light tracking-tight text-ink">Set a new password.</h1>

            <form onSubmit={submit} noValidate className="mt-6">
              {status === "error" && (
                <p className="mb-4 rounded-md border border-danger/20 bg-danger/5 px-3 py-2 text-[12.5px] text-danger">
                  {error} The link may have expired — request a new one.
                </p>
              )}

              <label htmlFor="pw" className="mb-1.5 block text-xs font-medium text-slate-700">New password</label>
              <input
                id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="h-11 w-full rounded-md border border-line px-3 text-sm outline-none transition-all focus:border-peri focus:ring-4 focus:ring-peri/15"
              />

              <div className="mt-2 flex items-center gap-2">
                <div className="flex h-1 flex-1 gap-1" aria-hidden="true">
                  {[0, 1, 2, 3].map((i) => (
                    <span key={i} className={`h-full flex-1 rounded-full ${i < strength.score ? "bg-navy" : "bg-slate-200"}`} />
                  ))}
                </div>
                <span className="text-[11px] text-muted">{strength.label}</span>
              </div>

              <label htmlFor="confirm" className="mb-1.5 mt-4 block text-xs font-medium text-slate-700">Confirm password</label>
              <input
                id="confirm" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)}
                aria-invalid={mismatch}
                className={`h-11 w-full rounded-md border px-3 text-sm outline-none transition-all focus:ring-4 ${
                  mismatch ? "border-danger/50 focus:ring-danger/10" : "border-line focus:border-peri focus:ring-peri/15"
                }`}
              />
              {mismatch && <p className="mt-1.5 text-[11.5px] text-danger">Passwords do not match.</p>}

              <button
                type="submit" disabled={!ready || status === "loading"}
                className="mt-5 h-11 w-full rounded-md bg-navy text-[13.5px] font-medium text-white transition-colors hover:bg-navy-soft disabled:opacity-50"
              >
                {status === "loading" ? "Updating…" : "Reset password"}
              </button>
            </form>
          </>
        )}

        <Link to="/login" className="mt-6 inline-block text-[12.5px] text-muted hover:text-ink">Back to login</Link>
      </div>
    </div>
  );
}
