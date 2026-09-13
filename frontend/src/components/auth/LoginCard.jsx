// Dark LoginCard — dark glass card instead of pure white
import AuthVisual from "./AuthVisual";
import LoginForm from "./LoginForm";

export default function LoginCard() {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      {/* Halo — subtle orange glow under the card */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-5 rounded-[44px] bg-gradient-to-br from-orange/[0.12] via-orange/[0.06] to-orange/[0.03] blur-[50px] sm:-inset-8"
      />
      <main className="relative grid min-h-0 flex-1 animate-rise grid-cols-1 overflow-hidden rounded-[22px] border border-white/[0.08] bg-[#141520]/95 shadow-[0_32px_80px_rgba(0,0,0,0.6)] backdrop-blur-xl lg:grid-cols-[1.02fr_1fr] lg:rounded-card">
        <AuthVisual progress={0.68} />
        <LoginForm />
      </main>
    </div>
  );
}
