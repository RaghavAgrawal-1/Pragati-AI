import AuthVisual from "./AuthVisual";
import LoginForm from "./LoginForm";

export default function LoginCard() {
  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      {/* Halo — a blurred wash under the card so it reads as lifted off the page. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-5 rounded-[44px] bg-gradient-to-br from-[#9FAEE4]/45 via-[#D6CFEF]/40 to-[#B9C5EC]/45 blur-[46px] sm:-inset-8"
      />
      <main className="relative grid min-h-0 flex-1 animate-rise grid-cols-1 overflow-hidden rounded-[22px] border border-white/70 bg-white/95 shadow-card backdrop-blur-xl lg:grid-cols-[1.02fr_1fr] lg:rounded-card">
        <AuthVisual progress={0.68} />
        <LoginForm />
      </main>
    </div>
  );
}
