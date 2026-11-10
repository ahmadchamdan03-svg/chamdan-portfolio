"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { GalleryItem } from "@/types/database";
import { ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

interface GallerySectionProps {
  lang?: "ID" | "EN" | "AR";
}

export default function GallerySection({ lang = "ID" }: GallerySectionProps) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentRotation = useRef(0);

  useEffect(() => {
    async function fetchGallery() {
      try {
        const { data, error } = await supabase
          .from("gallery")
          .select("*")
          .order("created_at", { ascending: true });

        if (!error && data && data.length > 0) {
          setItems(data);
        } else {
          // Fallback static items
          setItems([
            {
              id: "1",
              title: "Sistem Presensi & Scanner Gerbang Haflah",
              image_url: "/images/projects/haflah-presensi.png",
              created_at: new Date().toISOString(),
            },
            {
              id: "2",
              title: "Portal Wisuda Akbar & AI Guide A'lawna",
              image_url: "/images/projects/alawna-portal.png",
              created_at: new Date().toISOString(),
            },
            {
              id: "3",
              title: "Bazar Stan Muktamar NU Ke-35 Dzaween Press",
              image_url: "/images/projects/dzaween-sales.png",
              created_at: new Date().toISOString(),
            },
            {
              id: "4",
              title: "Portal Undangan Digital Interaktif Wali Santri",
              image_url: "/images/projects/undangan-digital.png",
              created_at: new Date().toISOString(),
            },
          ]);
        }
      } catch (e) {
        console.error("Gallery fetch error:", e);
      } finally {
        setLoading(false);
      }
    }

    fetchGallery();
  }, []);

  const count = items.length || 6;
  const angleStep = 360 / count;

  // Next / Prev actions
  const nextSlide = () => {
    const newIdx = (activeIndex + 1) % count;
    setActiveIndex(newIdx);
    setRotation((prev) => prev - angleStep);
    currentRotation.current -= angleStep;
  };

  const prevSlide = () => {
    const newIdx = (activeIndex - 1 + count) % count;
    setActiveIndex(newIdx);
    setRotation((prev) => prev + angleStep);
    currentRotation.current += angleStep;
  };

  // Drag handling
  const handlePointerDown = (clientX: number) => {
    isDragging.current = true;
    startX.current = clientX;
  };

  const handlePointerMove = (clientX: number) => {
    if (!isDragging.current) return;
    const deltaX = clientX - startX.current;
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        prevSlide();
      } else {
        nextSlide();
      }
      isDragging.current = false;
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const radius = 320; // Radius in pixels for curved carousel

  return (
    <section id="gallery" className="py-24 sm:py-32 bg-[#0c1410] text-stone-100 relative overflow-hidden">
      {/* Subtle ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-emerald-900/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight">
              {lang === "ID" ? "Jejak Rekam & Arsip Visual" : "Visual Archive & Milestones"}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-stone-300">
              {lang === "ID"
                ? "Putar dan geser silinder foto untuk menjelajahi dokumentasi proyek, santri, dan pengabdian."
                : "Rotate and swipe the photo cylinder to explore project records, pesantren life, and dedication."}
            </p>
          </div>
        </Reveal>

        {/* 3D Carousel Stage */}
        <div
          className="relative w-full h-[460px] sm:h-[520px] flex items-center justify-center select-none cursor-grab active:cursor-grabbing"
          style={{ perspective: "1100px" }}
          onMouseDown={(e) => handlePointerDown(e.clientX)}
          onMouseMove={(e) => handlePointerMove(e.clientX)}
          onMouseUp={handlePointerUp}
          onTouchStart={(e) => handlePointerDown(e.touches[0].clientX)}
          onTouchMove={(e) => handlePointerMove(e.touches[0].clientX)}
          onTouchEnd={handlePointerUp}
        >
          {/* Cylinder Ring */}
          <div
            className="relative w-[280px] sm:w-[340px] h-[360px] sm:h-[400px] transition-transform duration-700 ease-out"
            style={{
              transformStyle: "preserve-3d",
              transform: `rotateY(${rotation}deg)`,
            }}
          >
            {items.map((item, idx) => {
              const itemAngle = idx * angleStep;
              const isSelected = idx === activeIndex;

              return (
                <div
                  key={item.id}
                  className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl border transition-all duration-500"
                  style={{
                    transform: `rotateY(${itemAngle}deg) translateZ(${radius}px)`,
                    borderColor: isSelected ? "rgba(251, 191, 36, 0.8)" : "rgba(255, 255, 255, 0.15)",
                    boxShadow: isSelected
                      ? "0 20px 40px -15px rgba(16, 185, 129, 0.4), 0 0 25px rgba(251, 191, 36, 0.3)"
                      : "0 10px 25px -10px rgba(0, 0, 0, 0.5)",
                    backfaceVisibility: "hidden",
                  }}
                  onClick={() => {
                    const diff = idx - activeIndex;
                    setActiveIndex(idx);
                    setRotation((prev) => prev - diff * angleStep);
                    currentRotation.current -= diff * angleStep;
                  }}
                >
                  <div className="relative w-full h-full bg-stone-900 group">
                    <Image
                      src={item.image_url}
                      alt={`Dokumentasi arsip visual: ${item.title}`}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 280px, 340px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5">
                      <div className="text-[11px] font-mono font-semibold text-amber-400 mb-1">
                        {String(idx + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
                      </div>
                      <h3 className="text-sm sm:text-base font-serif font-bold text-white line-clamp-2">
                        {item.title}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Carousel Controls & Active Title Bar */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-xl mx-auto p-4 rounded-2xl bg-stone-900/80 border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-emerald-950 border border-emerald-600/40 flex items-center justify-center text-emerald-400">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs text-stone-400 font-mono">
                {String(activeIndex + 1).padStart(2, "0")} of {String(count).padStart(2, "0")}
              </div>
              <div className="text-sm font-semibold text-white line-clamp-1">
                {items[activeIndex]?.title || "Dokumentasi Portofolio"}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              aria-label="Foto Sebelumnya"
              className="p-2.5 rounded-full bg-stone-800 hover:bg-emerald-700 text-stone-200 hover:text-white transition-colors border border-stone-700"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Foto Selanjutnya"
              className="p-2.5 rounded-full bg-stone-800 hover:bg-emerald-700 text-stone-200 hover:text-white transition-colors border border-stone-700"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
