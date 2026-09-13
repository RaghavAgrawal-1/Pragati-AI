export default function PasswordToggle({ visible, onToggle }) {
  return (
    <button
      type="button" onClick={onToggle} aria-label={visible ? "Hide password" : "Show password"}
      className="absolute right-1.5 top-1 grid h-10 w-10 place-items-center rounded-[10px] text-muted transition-colors hover:bg-white/[0.06] hover:text-ink"
    >
      {visible ? (
        <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M3 3l14 14M8.2 8.3a2.4 2.4 0 0 0 3.4 3.4M6.1 6.2C4.3 7.3 2.9 8.9 2 10c1.6 2.7 4.5 5 8 5 1.3 0 2.5-.3 3.6-.8M16.4 12.7c.7-.8 1.2-1.7 1.6-2.7-1.6-2.7-4.5-5-8-5-.6 0-1.2.1-1.8.2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
      ) : (
        <svg width="17" height="17" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M2 10s3-5 8-5 8 5 8 5-3 5-8 5-8-5-8-5z" stroke="currentColor" strokeWidth="1.3" />
          <circle cx="10" cy="10" r="2.4" stroke="currentColor" strokeWidth="1.3" />
        </svg>
      )}
    </button>
  );
}
