/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Dark canvas & surfaces
        canvas:  "#0C0D12",
        surface: { DEFAULT: "#111318", card: "#1A1B25", raised: "#1E2030" },
        ink:     "#F0F2F8",
        muted:   "#6B7280",
        line:    "#1E2030",
        subtle:  "#2A2D3E",

        // Orange primary accent
        orange: {
          DEFAULT: "#E85418",
          light:   "#FF6B35",
          dark:    "#B83D0E",
          glow:    "rgba(232,84,24,0.25)",
          muted:   "rgba(232,84,24,0.12)",
        },

        // Semantic navy kept for compatibility
        slateink: "#0F1B2D",
        navy: { DEFAULT: "#E85418", deep: "#B83D0E", soft: "#FF6B35" },
        peri: "#8C99CF",
        lav:  "#1E2030",
        danger: "#EF4444",

        // Risk levels
        risk: {
          low:      "#22C55E",
          medium:   "#F59E0B",
          high:     "#EF4444",
          critical: "#DC2626",
        },

        // Infra domain colors
        infra: {
          safety:          "#E85418",
          "safety-dark":   "#B83D0E",
          "safety-light":  "rgba(232,84,24,0.15)",
          blueprint:       "#0EA5E9",
          cyan:            "#06B6D4",
          "cyan-dark":     "#0E7490",
          "cyan-light":    "#0C1A2E",
          surveyor:        "#22C55E",
          "surveyor-dark": "#15803D",
          "surveyor-light":"#0A1F12",
          steel:           "#1E293B",
          charcoal:        "#0C0D12",
          concrete:        "#64748B",
          girder:          "#1E2030",
          plate:           "#111318",
        },
      },

      fontFamily: {
        sans:  ["Manrope", "Inter", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
        mono:  ["JetBrains Mono", "SFMono-Regular", "Menlo", "Monaco", "Consolas", "monospace"],
      },

      borderRadius: { card: "20px", field: "12px", infra: "10px" },

      boxShadow: {
        card:              "0 0 0 1px rgba(255,255,255,0.04), 0 4px 24px rgba(0,0,0,0.4)",
        lift:              "0 10px 40px rgba(0,0,0,0.5)",
        submit:            "0 8px 24px rgba(232,84,24,0.4)",
        "infra-card":      "0 2px 16px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04)",
        "card-modern":     "0 4px 24px -2px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,255,255,0.04)",
        "card-hover":      "0 16px 48px rgba(0,0,0,0.5), 0 0 0 1px rgba(232,84,24,0.2)",
        "orange-glow":     "0 0 20px -4px rgba(232,84,24,0.5)",
        "orange-sm":       "0 0 12px -2px rgba(232,84,24,0.35)",
        "safety-glow":     "0 0 20px -4px rgba(232,84,24,0.4)",
        "blueprint-glow":  "0 0 15px -3px rgba(6,182,212,0.35)",
        "surveyor-glow":   "0 0 15px -3px rgba(34,197,94,0.35)",
      },

      keyframes: {
        rise:      { from: { opacity: 0, transform: "translateY(14px) scale(.994)" }, to: { opacity: 1, transform: "none" } },
        fadeIn:    { from: { opacity: 0, transform: "translateY(-4px)" }, to: { opacity: 1, transform: "none" } },
        slideUp:   { from: { opacity: 0, transform: "translateY(24px)" }, to: { opacity: 1, transform: "none" } },
        pulseGlow: {
          "0%, 100%": { opacity: 1, transform: "scale(1)" },
          "50%":      { opacity: 0.5, transform: "scale(1.2)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 12px -2px rgba(232,84,24,0.3)" },
          "50%":      { boxShadow: "0 0 24px -2px rgba(232,84,24,0.6)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        barGrow: {
          from: { width: "0%", opacity: 0 },
          to:   { opacity: 1 },
        },
        countUp: {
          from: { opacity: 0, transform: "translateY(8px)" },
          to:   { opacity: 1, transform: "none" },
        },
      },

      animation: {
        rise:      "rise .9s cubic-bezier(.16,.84,.3,1) both",
        fadeIn:    "fadeIn .3s ease both",
        slideUp:   "slideUp .6s cubic-bezier(.16,.84,.3,1) both",
        pulseGlow: "pulseGlow 2s ease-in-out infinite",
        glowPulse: "glowPulse 2.5s ease-in-out infinite",
        shimmer:   "shimmer 2.5s linear infinite",
        barGrow:   "barGrow .8s cubic-bezier(.16,.84,.3,1) both",
        countUp:   "countUp .5s ease both",
      },
    },
  },
  plugins: [],
};
