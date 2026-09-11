export default function Avatar({ name, size = 32, className = "" }) {
  const initial = String(name ?? "U").trim().slice(0, 1).toUpperCase();
  return (
    <span
      className={`grid shrink-0 place-items-center rounded-full bg-navy font-medium text-white ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}
