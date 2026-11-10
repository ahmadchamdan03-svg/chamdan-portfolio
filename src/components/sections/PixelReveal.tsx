"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";

interface PixelRevealProps {
  jacketSrc?: string;
  blueshirtSrc?: string;
  alt?: string;
}

export default function PixelReveal({
  jacketSrc = "/images/hero/jacket.png",
  blueshirtSrc = "/images/hero/blueshirt.png",
  alt = "Ahmad Chamdan Yuwafin",
}: PixelRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const jacketImgRef = useRef<HTMLImageElement | null>(null);
  const isImageLoadedRef = useRef(false);

  // Mouse tracker
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -9999,
    y: -9999,
    active: false,
  });

  const [isReady, setIsReady] = useState(false);

  // Redraw canvas with jacket image
  const redrawJacket = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx || !jacketImgRef.current) return;

    ctx.save();
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(jacketImgRef.current, 0, 0, canvas.width, canvas.height);
    ctx.restore();
  }, []);

  // Initialize and load jacket image into canvas
  useEffect(() => {
    const img = new window.Image();
    img.src = jacketSrc;
    img.crossOrigin = "anonymous";
    img.onload = () => {
      jacketImgRef.current = img;
      isImageLoadedRef.current = true;
      setIsReady(true);
      resizeCanvas();
    };

    const resizeCanvas = () => {
      const container = containerRef.current;
      const canvas = canvasRef.current;
      if (!container || !canvas || !jacketImgRef.current) return;

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      // Set internal canvas resolution to match container
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }

      redrawJacket();
    };

    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [jacketSrc, redrawJacket]);

  // Animation loop for pixel dither reveal
  useEffect(() => {
    if (!isReady) return;

    let animId: number;

    const render = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container || !jacketImgRef.current) {
        animId = requestAnimationFrame(render);
        return;
      }

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        animId = requestAnimationFrame(render);
        return;
      }

      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      // 1. Redraw base jacket image with slight blend
      ctx.save();
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Fast restore: redraw original jacket
      ctx.globalCompositeOperation = "source-over";
      ctx.clearRect(0, 0, rect.width, rect.height);
      ctx.drawImage(jacketImgRef.current, 0, 0, rect.width, rect.height);

      // 2. If mouse is active, punch through with dithered halftone pixel pattern
      if (mouseRef.current.active) {
        const { x, y } = mouseRef.current;
        const radius = 130; // Radius of flashlight reveal
        const gridSize = 7; // Size of each dither cell

        ctx.globalCompositeOperation = "destination-out";

        // Halftone / Dither circle around cursor
        for (let dy = -radius; dy <= radius; dy += gridSize) {
          for (let dx = -radius; dx <= radius; dx += gridSize) {
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < radius) {
              const px = x + dx;
              const py = y + dy;

              // Normalized distance: 0 at center, 1 at edge
              const norm = dist / radius;

              // Center is 100% transparent cutout, edge has smaller pixel dots (dither effect)
              let dotSize = gridSize;
              if (norm > 0.45) {
                dotSize = gridSize * (1 - (norm - 0.45) / 0.55);
              }

              if (dotSize > 0.8) {
                const offset = (gridSize - dotSize) / 2;
                ctx.beginPath();
                ctx.rect(px + offset, py + offset, dotSize, dotSize);
                ctx.fill();
              }
            }
          }
        }
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animId);
  }, [isReady]);

  // Handle pointer interactions
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  };

  const handleMouseLeave = () => {
    mouseRef.current.active = false;
  };

  // Touch handlers for mobile
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
      active: true,
    };
  };

  const handleTouchEnd = () => {
    mouseRef.current.active = false;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchMove}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full max-w-[480px] sm:max-w-[540px] md:max-w-[600px] aspect-[800/1050] mx-auto select-none cursor-crosshair overflow-visible"
    >
      {/* Layer 1 (Bottom): Blue Shirt Photo (Revealed Layer) */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src={blueshirtSrc}
          alt={`${alt} : Potret santri Khadimul Ilmi berbusana kemeja biru Lirboyo`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 600px"
          className="object-contain object-bottom drop-shadow-[0_20px_35px_rgba(4,120,87,0.15)]"
        />
      </div>

      {/* Immediate LCP Base Layer (Jacket Photo): Ensures 0 CLS and immediate LCP before canvas is ready */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          isReady ? "opacity-0" : "opacity-100"
        }`}
      >
        <Image
          src={jacketSrc}
          alt={`${alt} : Potret santri Khadimul Ilmi berbusana jas almamater resmi`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 600px"
          className="object-contain object-bottom drop-shadow-[0_20px_35px_rgba(4,120,87,0.15)]"
        />
      </div>

      {/* Layer 2 (Top): HTML Canvas with Jacket & Real-time Dither Cutout */}
      <canvas
        ref={canvasRef}
        aria-label={`${alt} : Kanvas interaktif senter piksel potret almamater dan santri`}
        className="absolute inset-0 w-full h-full pointer-events-auto"
        style={{ touchAction: "none" }}
      />

      {/* Subtle indicator prompt for visitors */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-stone-900/80 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium tracking-wide pointer-events-none backdrop-blur-sm shadow-md">
        Arahkan kursor atau sentuh foto untuk efek senter piksel
      </div>
    </div>
  );
}
