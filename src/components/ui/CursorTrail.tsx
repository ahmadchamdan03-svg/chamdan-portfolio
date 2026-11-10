"use client";

import { useEffect, useRef } from "react";

interface Point {
  x: number;
  y: number;
  age: number;
}

export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // Only run on non-touch devices with fine pointers
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

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

    const trail: Point[] = [];
    const maxTrail = 35; // Long tail points
    let mouse = { x: -100, y: -100 };
    let hasMoved = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      hasMoved = true;
      trail.unshift({ x: mouse.x, y: mouse.y, age: 0 });
      if (trail.length > maxTrail) {
        trail.pop();
      }
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animationId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      if (hasMoved && trail.length > 1) {
        // Age points gradually
        for (let i = 0; i < trail.length; i++) {
          trail[i].age += 1;
        }

        // Draw glowing comet trail segments
        ctx.save();
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        for (let i = 0; i < trail.length - 1; i++) {
          const p1 = trail[i];
          const p2 = trail[i + 1];
          const ratio = i / (trail.length - 1); // 0 at head, 1 at tail

          // Interpolate between Purple (#8B5CF6 -> rgb(139, 92, 246)) and Blue (#3B82F6 -> rgb(59, 130, 246))
          const r = Math.round(139 + (59 - 139) * ratio);
          const g = Math.round(92 + (130 - 92) * ratio);
          const b = Math.round(246 + (246 - 246) * ratio);
          const alpha = Math.max(0, (1 - ratio) * 0.75);

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.lineWidth = Math.max(1.5, (1 - ratio) * 8);
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
          ctx.shadowBlur = 14;
          ctx.shadowColor = "rgba(139, 92, 246, 0.6)";
          ctx.stroke();
        }

        // Head glowing particle
        if (trail.length > 0) {
          const head = trail[0];
          ctx.beginPath();
          ctx.arc(head.x, head.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(196, 181, 253, 0.95)";
          ctx.shadowBlur = 18;
          ctx.shadowColor = "#8B5CF6";
          ctx.fill();
        }

        ctx.restore();
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
      className="pointer-events-none fixed inset-0 z-[99] transition-opacity duration-300"
    />
  );
}
