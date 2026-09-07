"use client";

import { useEffect, useRef, useState } from "react";

interface TrailDot {
  x: number;
  y: number;
  id: number;
}

/**
 * Desktop-only custom cursor styled as a glowing neutron particle with a
 * fading particle trail. Disabled on touch / coarse pointers and when the
 * user prefers reduced motion.
 */
export default function NeutronCursor() {
  const [enabled, setEnabled] = useState(false);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [trail, setTrail] = useState<TrailDot[]>([]);
  const idRef = useRef(0);

  useEffect(() => {
    const fine =
      window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!fine || reduced) return;

    setEnabled(true);
    document.body.classList.add("custom-cursor");

    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      idRef.current += 1;
      const dot = { x: e.clientX, y: e.clientY, id: idRef.current };
      setTrail((prev) => [...prev.slice(-8), dot]);

      const target = e.target as HTMLElement;
      const interactive = target.closest(
        "a, button, [role='button'], input, textarea, select"
      );
      setHovering(Boolean(interactive));
    };

    window.addEventListener("mousemove", move);
    return () => {
      window.removeEventListener("mousemove", move);
      document.body.classList.remove("custom-cursor");
    };
  }, []);

  // Continuously drain the trail so dots fade after the pointer stops.
  useEffect(() => {
    if (!enabled) return;
    const interval = setInterval(() => {
      setTrail((prev) => prev.slice(1));
    }, 60);
    return () => clearInterval(interval);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden>
      {trail.map((dot, i) => (
        <span
          key={dot.id}
          className="absolute rounded-full bg-quantum-cyan"
          style={{
            left: dot.x,
            top: dot.y,
            width: 4 + i,
            height: 4 + i,
            opacity: (i + 1) / (trail.length * 2.5),
            transform: "translate(-50%, -50%)",
            filter: "blur(1px)",
          }}
        />
      ))}

      {/* Core neutron */}
      <div
        className="absolute rounded-full transition-[width,height] duration-200"
        style={{
          left: pos.x,
          top: pos.y,
          width: hovering ? 26 : 16,
          height: hovering ? 26 : 16,
          transform: "translate(-50%, -50%)",
          background:
            "radial-gradient(circle at 35% 35%, #a5f3fc, #22d3ee 55%, #0891b2)",
          boxShadow:
            "0 0 12px rgba(34,211,238,0.8), 0 0 28px rgba(34,211,238,0.45)",
        }}
      />
      {/* Orbit ring on hover */}
      <div
        className="absolute rounded-full border border-quantum-cyan/50 transition-all duration-200"
        style={{
          left: pos.x,
          top: pos.y,
          width: hovering ? 44 : 0,
          height: hovering ? 44 : 0,
          transform: "translate(-50%, -50%)",
          opacity: hovering ? 1 : 0,
        }}
      />
    </div>
  );
}
