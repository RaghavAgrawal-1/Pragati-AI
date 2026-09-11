import { useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../../services/authService";
import { isEmail } from "../../utils/validation";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | loading | sent | error
  const [error, setError] = useState("");

  const invalid = touched && !isEmail(email);

  async function submit(e) {
    e.preventDefault();
    setTouched(true);
    if (!isEmail(email) || status === "loading") return;
    setStatus("loading");
    try {
      await authService.requestPasswordReset(email);
      setStatus("sent");
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-canvas px-5">
      <div className="w-full max-w-[420px] rounded-xl border border-line bg-white p-8 shadow-sm">
        {status === "sent" ? (
          <>
            <h1 className="text-[24px] font-light tracking-tight text-ink">Reset link sent.</h1>
            <p className="mt-3 text-[13px] leading-relaxed text-muted">
              If an account exists for {email}, a reset link is on its way. It expires in 30 minutes.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-[24px] font-light tracking-tight text-ink">Reset your password.</h1>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              Enter the email registered to your account and we will send a reset link.
            </p>

            <form onSubmit={submit} noValidate className="mt-6">
              {status === "error" && (
                <p className="mb-4 rounded-md border border-danger/20 bg-danger/5 px-3 py-2 text-[12.5px] text-danger">
                  Unable to send reset link. {error}
                </p>
              )}

              <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-slate-700">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="you@ministry.gov.in"
                aria-invalid={invalid}
                className={`h-11 w-full rounded-md border px-3 text-sm outline-none transition-all focus:ring-4 ${
                  invalid ? "border-danger/50 focus:ring-danger/10" : "border-line focus:border-peri focus:ring-peri/15"
                }`}
              />
              {invalid && <p className="mt-1.5 text-[11.5px] text-danger">Enter a valid email address.</p>}

              <button
                type="submit"
                disabled={status === "loading"}
                className="mt-5 h-11 w-full rounded-md bg-navy text-[13.5px] font-medium text-white transition-colors hover:bg-navy-soft disabled:opacity-50"
              >
                {status === "loading" ? "Sending…" : "Send reset link"}
              </button>
            </form>
          </>
        )}

        <Link to="/login" className="mt-6 inline-block text-[12.5px] text-muted hover:text-ink">
          Back to login
        </Link>
      </div>
    </div>
  );
}
