import { createContext, useCallback, useContext, useMemo, useState } from "react";

const UIContext = createContext(null);

let seq = 0;

export function UIProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const toast = useCallback((message, { tone = "info", timeout = 4000 } = {}) => {
    const id = ++seq;
    setToasts((t) => [...t, { id, message, tone }]);
    if (timeout) setTimeout(() => dismiss(id), timeout);
    return id;
  }, [dismiss]);

  const value = useMemo(() => ({ toasts, toast, dismiss }), [toasts, toast, dismiss]);
  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside <UIProvider>");
  return ctx;
}
