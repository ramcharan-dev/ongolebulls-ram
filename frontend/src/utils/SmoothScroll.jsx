import { useEffect, useRef } from "react";
import Lenis from "lenis";

/**
 * Premium Lenis smooth scroll — tight, responsive, buttery.
 * Only mounted on public-facing pages, never on dashboard/admin.
 */
export default function SmoothScroll() {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 0.8,
      easing: (t) => 1 - Math.pow(1 - t, 4),   // quartic ease-out — snappy start, smooth stop
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
      infinite: false,
    });
    lenisRef.current = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    // Respect anchor links
    const handleAnchor = (e) => {
      const href = e.target.closest("a")?.getAttribute("href");
      if (href?.startsWith("#")) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target, { offset: -80 });
        }
      }
    };
    document.addEventListener("click", handleAnchor);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("click", handleAnchor);
      lenis.destroy();
    };
  }, []);

  return null;
}
