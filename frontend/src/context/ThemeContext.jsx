import { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "pragati.infra-theme";

export const INFRA_THEMES = [
  {
    id: "safety",
    name: "Heavy Civil",
    subtitle: "Safety Amber & Steel",
    accentColor: "#F59E0B",
    icon: "HardHat",
    badge: "bg-amber-500/10 text-amber-500 border-amber-500/30",
    dot: "bg-amber-500",
  },
  {
    id: "blueprint",
    name: "CAD Blueprint",
    subtitle: "Precision Cyan & Azure",
    accentColor: "#06B6D4",
    icon: "Compass",
    badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30",
    dot: "bg-cyan-400",
  },
  {
    id: "surveyor",
    name: "Surveyor Matrix",
    subtitle: "Geospatial Emerald",
    accentColor: "#10B981",
    icon: "Activity",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    dot: "bg-emerald-400",
  },
];

const ThemeContext = createContext({
  theme: "safety",
  setTheme: () => {},
  currentTheme: INFRA_THEMES[0],
});

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved && ["safety", "blueprint", "surveyor"].includes(saved)
      ? saved
      : "safety";
  });

  const setTheme = (newTheme) => {
    if (["safety", "blueprint", "surveyor"].includes(newTheme)) {
      setThemeState(newTheme);
      localStorage.setItem(STORAGE_KEY, newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const currentTheme =
    INFRA_THEMES.find((t) => t.id === theme) || INFRA_THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, currentTheme, themes: INFRA_THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
