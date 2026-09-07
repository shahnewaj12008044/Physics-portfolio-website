"use client";

import { useEffect, useRef, type RefObject } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  life: number; // 1 -> 0
  kind: "neutron" | "fragment" | "energy";
  /**
   * True only for free neutrons fired in from outside the nucleus. Secondary
   * neutrons released BY a fission start inside the nucleus radius, so if they
   * were allowed to trigger fission they would detonate again on their very
   * first frame and the chain reaction would run away and lock the tab.
   */
  primary: boolean;
}

interface Props {
  /**
   * Element whose centre the nucleus should sit on. Lets the hero place the
   * atom in its right-hand column while the canvas itself stays full-bleed,
   * so neutrons still streak across the entire section.
   */
  anchorRef?: RefObject<HTMLElement>;
}

/**
 * Interactive nuclear fission animation. A free neutron periodically streaks
 * into a heavy nucleus, which bursts into fragments, fresh neutrons, and
 * energy particles — the classic chain-reaction motif. Rendered on a canvas
 * with requestAnimationFrame; respects prefers-reduced-motion.
 */
export default function FissionCanvas({ anchorRef }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // Nucleus centre in canvas-local coordinates.
    const center = { x: 0, y: 0 };

    const measureCenter = () => {
      const anchor = anchorRef?.current;
      if (anchor) {
        const a = anchor.getBoundingClientRect();
        const c = canvas.getBoundingClientRect();
        if (a.width > 0 && a.height > 0) {
          center.x = a.left - c.left + a.width / 2;
          center.y = a.top - c.top + a.height / 2;
          return;
        }
      }
      center.x = width / 2;
      center.y = height / 2;
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth;
      height = parent.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      measureCenter();
    };
    resize();
    window.addEventListener("resize", resize);

    // Re-measure once layout and fonts settle, and whenever the anchor resizes.
    let observer: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      observer = new ResizeObserver(() => resize());
      if (canvas.parentElement) observer.observe(canvas.parentElement);
      if (anchorRef?.current) observer.observe(anchorRef.current);
    }

    const particles: Particle[] = [];
    const MAX_PARTICLES = 260;
    let nucleusPulse = 0;

    const spawnFission = () => {
      nucleusPulse = 1;
      if (particles.length > MAX_PARTICLES) return;
      const fragmentCount = 2;
      const neutronCount = 3;
      const energyCount = 14;

      for (let i = 0; i < fragmentCount; i++) {
        const angle = Math.PI * (i === 0 ? 0.15 : 1.15) + Math.random() * 0.4;
        const speed = 1.2 + Math.random() * 0.8;
        particles.push({
          x: center.x,
          y: center.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 10 + Math.random() * 4,
          color: "#34f5a0",
          life: 1,
          kind: "fragment",
          primary: false,
        });
      }
      for (let i = 0; i < neutronCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2.4 + Math.random() * 1.6;
        particles.push({
          x: center.x,
          y: center.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 4,
          color: "#22d3ee",
          life: 1,
          kind: "neutron",
          primary: false,
        });
      }
      for (let i = 0; i < energyCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 3 + Math.random() * 3;
        particles.push({
          x: center.x,
          y: center.y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 1.5 + Math.random() * 1.5,
          color: Math.random() > 0.5 ? "#a855f7" : "#3b82f6",
          life: 1,
          kind: "energy",
          primary: false,
        });
      }
    };

    /**
     * Free neutrons enter from the far edge of the section, mostly from the
     * left, so the incoming track sweeps the full width of the hero before it
     * reaches the nucleus sitting on the right.
     */
    const spawnIncomingNeutron = () => {
      const fromLeft = Math.random() > 0.25;
      const x = fromLeft ? -20 : width + 20;
      const y = center.y + (Math.random() - 0.5) * Math.min(height * 0.45, 180);
      const travel = Math.max(Math.abs(center.x - x), 1);
      const speed = 3.6;
      particles.push({
        x,
        y,
        vx: (fromLeft ? 1 : -1) * speed,
        vy: ((center.y - y) / travel) * speed,
        radius: 4,
        color: "#22d3ee",
        life: 1,
        kind: "neutron",
        primary: true,
      });
    };

    let frame = 0;
    let raf = 0;

    const draw = () => {
      // Cheap periodic re-measure keeps the nucleus locked to its column
      // across breakpoint changes and late layout shifts.
      if (frame % 20 === 0) measureCenter();

      ctx.clearRect(0, 0, width, height);

      // Nucleus glow
      const pulseR = 26 + nucleusPulse * 18;
      const grad = ctx.createRadialGradient(
        center.x,
        center.y,
        2,
        center.x,
        center.y,
        pulseR + 26
      );
      grad.addColorStop(0, "rgba(34,211,238,0.9)");
      grad.addColorStop(0.5, "rgba(52,245,160,0.35)");
      grad.addColorStop(1, "rgba(5,7,13,0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(center.x, center.y, pulseR + 26, 0, Math.PI * 2);
      ctx.fill();

      // Orbiting electron shells give a recognisable atom silhouette
      const shellRx = Math.max(60, Math.min(width * 0.09, 110));
      const shellRy = shellRx * 0.37;
      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.strokeStyle = "rgba(34,211,238,0.22)";
      ctx.lineWidth = 1.2;
      for (let s = 0; s < 3; s++) {
        ctx.save();
        ctx.rotate((s * Math.PI) / 3 + frame * 0.002);
        ctx.beginPath();
        ctx.ellipse(0, 0, shellRx, shellRy, 0, 0, Math.PI * 2);
        ctx.stroke();
        const ea = frame * 0.02 + (s * Math.PI * 2) / 3;
        ctx.beginPath();
        ctx.fillStyle = "rgba(168,85,247,0.85)";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#a855f7";
        ctx.arc(Math.cos(ea) * shellRx, Math.sin(ea) * shellRy, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.restore();
      }
      ctx.restore();

      // Nucleon cluster
      const nucleons = 8;
      for (let i = 0; i < nucleons; i++) {
        const a = (i / nucleons) * Math.PI * 2 + frame * 0.01;
        const r = 12;
        const nx = center.x + Math.cos(a) * r;
        const ny = center.y + Math.sin(a) * r;
        ctx.beginPath();
        ctx.fillStyle = i % 2 === 0 ? "#22d3ee" : "#34f5a0";
        ctx.arc(nx, ny, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      nucleusPulse *= 0.92;

      // Particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Only an incoming free neutron detonates the nucleus.
        if (
          p.primary &&
          p.kind === "neutron" &&
          Math.hypot(p.x - center.x, p.y - center.y) < pulseR
        ) {
          particles.splice(i, 1);
          spawnFission();
          continue;
        }

        // Incoming neutrons keep full brightness until they hit or leave.
        if (!p.primary) p.life -= 0.012;

        const alpha = Math.max(p.life, 0);
        ctx.beginPath();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = alpha;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;

        if (
          p.life <= 0 ||
          p.x < -40 ||
          p.x > width + 40 ||
          p.y < -40 ||
          p.y > height + 40
        ) {
          particles.splice(i, 1);
        }
      }

      frame++;
      // Periodically launch a neutron at the nucleus
      if (frame % 150 === 0) spawnIncomingNeutron();

      raf = requestAnimationFrame(draw);
    };

    if (reduced) {
      // Draw a single static frame
      draw();
      cancelAnimationFrame(raf);
    } else {
      setTimeout(spawnIncomingNeutron, 600);
      raf = requestAnimationFrame(draw);
    }

    // Click to fire a neutron manually
    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const dx = center.x - x;
      const dy = center.y - y;
      const mag = Math.hypot(dx, dy) || 1;
      particles.push({
        x,
        y,
        vx: (dx / mag) * 4,
        vy: (dy / mag) * 4,
        radius: 4,
        color: "#22d3ee",
        life: 1,
        kind: "neutron",
        primary: true,
      });
    };
    canvas.addEventListener("click", onClick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("click", onClick);
      observer?.disconnect();
    };
  }, [anchorRef]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full cursor-crosshair"
      aria-hidden
    />
  );
}
