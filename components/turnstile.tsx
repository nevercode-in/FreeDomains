"use client";

import { useEffect, useRef } from "react";

export default function TurnstileWidget({
  onVerify,
}: {
  onVerify?: (token: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  

  useEffect(() => {
    if (!window.turnstile || !containerRef.current) return;

    // Prevent duplicate render
    if (widgetIdRef.current) return;

    widgetIdRef.current = window.turnstile.render(containerRef.current, {
      sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!,
      callback: function (token: string) {
        onVerify?.(token);
      },
    });

  }, [onVerify]);

  return <div ref={containerRef}></div>;
}
