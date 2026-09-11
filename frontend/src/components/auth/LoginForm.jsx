import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import InputField from "./InputField";
import PasswordToggle from "./PasswordToggle";
import { useAuth } from "../../hooks/useAuth";
import { isEmail } from "../../utils/validation";

function TextGlow() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -left-16 -top-10 h-64 w-64 rounded-full bg-[#AEB9E6]/40 blur-[70px]" />
      <div className="absolute left-24 top-4 h-44 w-56 rounded-full bg-[#D9D3F0]/50 blur-[60px]" />
    </div>
  );
}

/** Maps transport failures onto something the user can act on. */
function messageFor(err) {
  if (err?.status === 401) return "That email and password don't match an account.";
  if (err?.status === 0) return "The server is not responding. Check that the backend is running.";
  if (err?.status === 403) return "This account does not have access to the monitoring platform.";
  if (err?.status >= 500) return "The server ran into a problem. Try again in a moment.";
  return err?.message ?? "Unable to sign in.";
}

export default function LoginForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState({});
  const [visible, setVisible] = useState(false);
  const [remember, setRemember] = useState(true);
  const [status, setStatus] = useState("idle");
  const [serverError, setServerError] = useState("");

  const emailError = touched.email && !isEmail(email) ? "Enter a valid work email address." : "";
  const pwError = touched.password && password.length < 6 ? "Passwords are at least 6 characters." : "";
  const ready = isEmail(email) && password.length >= 6;
  const loading = status === "loading";

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!ready || loading) return;
    setStatus("loading");
    setServerError("");
    try {
      await login({ email, password, remember });
      navigate(location.state?.from ?? "/dashboard", { replace: true });
    } catch (err) {
      setServerError(messageFor(err));
      setStatus("error");
    }
  }

  return (
    <div className="relative flex min-h-0 flex-col justify-center px-6 py-7 sm:px-10 lg:px-[54px] lg:py-8">
      <TextGlow />

      <div className="relative">
        <h1 className="text-[27px] font-light leading-[1.08] tracking-tight lg:text-[33px]">Welcome back.</h1>
        <p className="mb-5 mt-2.5 max-w-[34ch] text-[13px] leading-relaxed text-muted">
          Sign in to continue monitoring your projects smarter.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {status === "error" && (
            <div role="alert" className="mb-3.5 flex items-start gap-2.5 rounded-xl border border-danger/20 bg-[#FDF6F5] px-3.5 py-2.5 text-[12.5px] leading-relaxed text-[#8E443E]">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="mt-px shrink-0" aria-hidden="true">
                <circle cx="8" cy="8" r="6.6" stroke="#B4554E" strokeWidth="1.2" />
                <path d="M8 4.8v3.6M8 11h.01" stroke="#B4554E" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
              <span>{serverError}</span>
            </div>
          )}

          <InputField
            id="email" label="Work email" type="email" value={email} onChange={setEmail}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            error={emailError} placeholder="you@ministry.gov.in" autoComplete="email"
          />

          <InputField
            id="password" label="Password" type={visible ? "text" : "password"} value={password} onChange={setPassword}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            error={pwError} placeholder="••••••••" autoComplete="current-password"
            trailing={<PasswordToggle visible={visible} onToggle={() => setVisible((v) => !v)} />}
          />

          <div className="mb-4 mt-0.5 flex items-center justify-between">
            <label className="flex cursor-pointer select-none items-center gap-2.5 text-[12.5px] text-muted">
              <span className={`grid h-[17px] w-[17px] place-items-center rounded-[5px] border transition-colors ${remember ? "border-navy bg-navy" : "border-[#D7D9E4] bg-white"}`}>
                {remember && (
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2.5 6.3l2.3 2.3L9.5 3.9" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} className="absolute h-px w-px opacity-0" />
              Keep me signed in
            </label>

            <Link to="/forgot-password" className="border-b border-transparent pb-px text-[12.5px] text-muted transition-colors hover:border-[#C9CDDA] hover:text-ink">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit" disabled={!ready || loading}
            className="flex h-[48px] w-full items-center justify-center gap-2.5 rounded-field bg-gradient-to-br from-navy-deep to-navy-soft
                       text-sm font-medium text-white shadow-submit transition-all hover:-translate-y-px active:translate-y-0
                       disabled:pointer-events-none disabled:opacity-45 disabled:shadow-none"
          >
            {loading ? (
              <>
                <span className="h-[15px] w-[15px] animate-spin rounded-full border-2 border-white/35 border-t-white" />
                Signing in
              </>
            ) : "Sign in"}
          </button>
        </form>

        <p className="mt-5 text-[12.5px] leading-relaxed text-muted">
          Access is issued by your administrator. Contact your nodal officer if you need an account.
        </p>
      </div>
    </div>
  );
}
