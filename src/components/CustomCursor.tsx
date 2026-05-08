import { useEffect, useRef, useCallback } from "react";

export const CustomCursor = () => {
  const outerRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const currentRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  const animate = useCallback(() => {
    const el = outerRef.current;
    if (!el) return;

    // Spring-like lerp
    currentRef.current.x += (posRef.current.x - currentRef.current.x) * 0.15;
    currentRef.current.y += (posRef.current.y - currentRef.current.y) * 0.15;

    el.style.transform = `translate3d(${currentRef.current.x - 24}px, ${currentRef.current.y - 24}px, 0)`;

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    // Don't run on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  return (
    <div
      ref={outerRef}
      className="pointer-events-none fixed top-0 left-0 z-[9999] hidden md:block h-12 w-12 rounded-full border border-primary/50 bg-primary/20 backdrop-blur-sm will-change-transform"
    >
      <div className="absolute top-1/2 left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary shadow-[0_0_10px_2px_rgba(7,86,177,0.8)]" />
    </div>
  );
};
