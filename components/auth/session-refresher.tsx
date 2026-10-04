"use client";

import { useEffect } from "react";

const REFRESH_AFTER_MS = 10 * 60 * 1000;
const LOCK_KEY = "isroot:auth-refresh-lock";
const LAST_REFRESH_KEY = "isroot:auth-refresh-at";

export function SessionRefresher() {
  useEffect(() => {
    let stopped = false;

    async function refreshIfDue(force = false) {
      if (stopped) return;

      const lastRefresh = Number(localStorage.getItem(LAST_REFRESH_KEY) || 0);
      if (!force && Date.now() - lastRefresh < REFRESH_AFTER_MS) return;

      const owner = crypto.randomUUID();
      const existingLock = localStorage.getItem(LOCK_KEY);
      if (existingLock) {
        try {
          if (JSON.parse(existingLock).expiresAt > Date.now()) return;
        } catch {
          // Replace a malformed lock left by an older browser tab.
        }
      }

      // The short local lock prevents multiple tabs from rotating one cookie at once.
      localStorage.setItem(
        LOCK_KEY,
        JSON.stringify({ owner, expiresAt: Date.now() + 15_000 }),
      );
      try {
        if (JSON.parse(localStorage.getItem(LOCK_KEY) || "{}").owner !== owner) return;

        const response = await fetch("/api/auth/refresh", {
          method: "POST",
          cache: "no-store",
          signal: AbortSignal.timeout(10_000),
        });
        if (response.ok) localStorage.setItem(LAST_REFRESH_KEY, String(Date.now()));
      } catch {
        // A later timer or page focus retries if the network is temporarily down.
      } finally {
        try {
          if (JSON.parse(localStorage.getItem(LOCK_KEY) || "{}").owner === owner) {
            localStorage.removeItem(LOCK_KEY);
          }
        } catch {
          localStorage.removeItem(LOCK_KEY);
        }
      }
    }

    // Refresh once on page load so a session is renewed after a browser restart too.
    void refreshIfDue(true);
    const interval = window.setInterval(() => void refreshIfDue(), REFRESH_AFTER_MS);
    const onFocus = () => {
      if (document.visibilityState === "visible") void refreshIfDue();
    };
    document.addEventListener("visibilitychange", onFocus);

    return () => {
      stopped = true;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onFocus);
    };
  }, []);

  return null;
}
