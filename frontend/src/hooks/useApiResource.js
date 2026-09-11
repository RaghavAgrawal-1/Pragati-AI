import { useCallback, useEffect, useRef, useState } from "react";

/**
 * The one place server state is handled. Every domain hook wraps this, so
 * loading, error, empty and refetch behave identically on every screen.
 *
 * Swap the body for TanStack Query later without touching a single caller.
 */
export function useApiResource(fetcher, deps = [], { enabled = true } = {}) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => { mounted.current = false; };
  }, []);

  const run = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      if (mounted.current) setData(result);
    } catch (err) {
      if (mounted.current) setError(err);
    } finally {
      if (mounted.current) setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...deps]);

  useEffect(() => { run(); }, [run]);

  return { data, error, loading, refetch: run, isDemo: Boolean(data?.__demo) };
}
