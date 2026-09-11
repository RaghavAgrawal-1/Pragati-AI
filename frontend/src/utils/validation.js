export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const isEmail = (value) => EMAIL_RE.test(String(value ?? "").trim());

export const minLength = (value, n) => String(value ?? "").length >= n;

/** Four independent signals rather than one opaque score. */
export function passwordStrength(pw = "") {
  const checks = [pw.length >= 10, /[a-z]/.test(pw) && /[A-Z]/.test(pw), /\d/.test(pw), /[^A-Za-z0-9]/.test(pw)];
  const score = checks.filter(Boolean).length;
  return { score, label: ["Too short", "Weak", "Fair", "Good", "Strong"][score] };
}
