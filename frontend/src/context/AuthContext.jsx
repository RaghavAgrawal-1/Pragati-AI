import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { authService } from "../services/authService";
import { tokenStore } from "../services/apiClient";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("checking"); // checking | authenticated | guest

  useEffect(() => {
    let alive = true;
    (async () => {
      if (!tokenStore.get()) {
        if (alive) setStatus("guest");
        return;
      }
      try {
        const me = await authService.me();
        if (!alive) return;
        setUser(me);
        setStatus(me ? "authenticated" : "guest");
      } catch {
        // Backend unreachable: trust the stored token rather than locking the
        // user out of an app that may be running against demo data.
        if (alive) setStatus("authenticated");
      }
    })();
    return () => { alive = false; };
  }, []);

  const login = useCallback(async (credentials) => {
    const session = await authService.login(credentials);
    setUser(session.user ?? { email: credentials.email });
    setStatus("authenticated");
    return session;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setStatus("guest");
  }, []);

  const value = useMemo(
    () => ({ user, status, isAuthenticated: status === "authenticated", login, logout }),
    [user, status, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
