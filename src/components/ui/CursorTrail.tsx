"use client";

import { useEffect, useRef } from "react";

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Only run on non-touch devices with fine pointers
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const points: { x: number; y: number; alpha: number; radius: number }[] = [];
    let mouse = { x: -100, y: -100 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      points.push({
        x: mouse.x,
        y: mouse.y,
        alpha: 0.35,
        radius: 12,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = points.length - 1; i >= 0; i--) {
        const p = points[i];
        p.alpha -= 0.015;
        p.radius += 0.4;

        if (p.alpha <= 0) {
          points.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        // Emerald/Gold soft subtle gradient
        ctx.fillStyle = `rgba(16, 185, 129, ${p.alpha * 0.4})`;
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 transition-opacity duration-300"
      style={{ opacity: 0.8 }}
    />
  );
}
