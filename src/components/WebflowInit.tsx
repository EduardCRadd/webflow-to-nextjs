"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function WebflowInit() {
  const path = usePathname();

  useEffect(() => {
    let rafId: number;

    /* Does the Interactions JSON exist yet? */
    const hasIxJSON = () =>
      !!document.querySelector('script[type="application/json"][data-wf-page]');

    /* Boot (or reboot) IX2 — returns true once done */
    const mountIx2 = () => {
      const wf = window.Webflow;
      if (!wf || !hasIxJSON()) return false; // still loading

      wf.push?.(() => {
        wf.destroy?.(); // tidy old page
        wf.ready?.(); // flush WF queue
        wf.require?.("ix2")?.init(); // start engine
        /* Re-emit ready-state so PAGE-LOAD triggers always run */
        document.dispatchEvent(new Event("readystatechange"));
      });
      return true;
    };

    /* Poll one frame at a time until everything is present */
    const tick = () => {
      if (!mountIx2()) rafId = requestAnimationFrame(tick);
    };
    tick(); // start polling

    return () => {
      cancelAnimationFrame(rafId); // stop polling
      window.Webflow?.destroy?.(); // cleanup
    };
  }, [path]);

  return null;
}
