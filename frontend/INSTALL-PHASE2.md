# Phase 2 — restructure + dashboard

Phase 2 replaces the flat Phase 1 layout with the folder structure you specified.
Old paths are gone, so the copy below intentionally wipes `src` first.

## 1. Dependency

    npm install recharts

(`react-router-dom` and `lucide-react` are already in from Phase 1.)

## 2. Replace src

    cd "D:\college\3rd year\SIH\manthan-web"
    Remove-Item .\src -Recurse -Force
    robocopy "..\p2\src" ".\src" /E
    Copy-Item "..\p2\tailwind.config.js" ".\" -Force

`main.jsx` is not in the package — Vite's original one is fine and still points
at `./index.css` and `./App.jsx`. If you deleted it, recreate:

    import { StrictMode } from "react";
    import { createRoot } from "react-dom/client";
    import App from "./App.jsx";
    import "./index.css";

    createRoot(document.getElementById("root")).render(
      <StrictMode><App /></StrictMode>
    );

## 3. Run

    npm run dev

Sign in with any email and a 6+ character password. With the backend down the
login will report that the server is not responding — that is correct. To see
the dashboard against demo data, run this in the browser console:

    localStorage.setItem("pragati.token", "dev"); location.href = "/dashboard";

## What is real and what is not

Everything on the dashboard except the AI insight comes from
`analyticsService.dashboard()`. When that endpoint 404s, `withFallback` swaps in
`mocks/analytics.js` and the page shows a **Demo data** badge next to the title.
The executive insight and every model metric stay empty until the backend
returns them — they are never fabricated.

Set `VITE_USE_DEMO_DATA=false` in `.env` to turn the fallbacks off and see the
real error and empty states instead.
