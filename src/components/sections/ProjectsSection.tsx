"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Project } from "@/types/database";
import { ArrowUpRight, FolderGit2, AlertCircle } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";
import Reveal from "@/components/ui/Reveal";

interface ProjectsSectionProps {
  lang?: "ID" | "EN";
}

function parseTechStack(techStack: unknown): string[] {
  if (!techStack) return [];
  if (Array.isArray(techStack)) {
    return techStack
      .flatMap((item) => {
        if (typeof item === "string") {
          return item.includes(",") ? item.split(",").map((s) => s.trim()) : [item.trim()];
        }
        return [String(item)];
      })
      .filter(Boolean);
  }
  if (typeof techStack === "string") {
    const cleaned = techStack.replace(/^\{|\}$/g, "");
    return cleaned
      .split(",")
      .map((item) => item.replace(/^"|"$/g, "").trim())
      .filter(Boolean);
  }
  return [];
}

export default function ProjectsSection({ lang = "ID" }: ProjectsSectionProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: err } = await supabase
          .from("projects")
          .select("*")
          .order("created_at", { ascending: true });

        if (err) {
          throw err;
        }

        if (data) {
          setProjects(data);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Gagal memuat proyek dari Supabase";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <section id="projects" className="relative w-full py-24 px-4 sm:px-8 bg-[#fafaf9]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 border-b border-stone-200 pb-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-emerald-800 mb-2">
                <FolderGit2 className="w-4 h-4 text-amber-600" />
                <span>{lang === "ID" ? "Portofolio Pilihan" : "Featured Case Studies"}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 tracking-tight">
                {lang === "ID" ? (
                  <>
                    Karya &amp; <span className="text-[#064e3b] italic">Sistem Digital</span>
                  </>
                ) : (
                  <>
                    Selected <span className="text-[#064e3b] italic">Works &amp; Systems</span>
                  </>
                )}
              </h2>
            </div>

            <p className="mt-3 sm:mt-0 text-sm text-stone-500 max-w-md">
              {lang === "ID"
                ? "Implementasi nyata arsitektur full-stack, tata kelola akses pesantren, dan otomatisasi operasional."
                : "Real-world implementations of full-stack web architecture, event gate governance, and operational automation."}
            </p>
          </div>
        </Reveal>

        {/* State: Loading Skeleton Grid */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl overflow-hidden bg-white border border-stone-200 shadow-sm p-6"
              >
                <Skeleton className="w-full aspect-[16/10] rounded-2xl mb-6" />
                <div className="flex gap-2 mb-4">
                  <Skeleton className="w-20 h-6 rounded-full" />
                  <Skeleton className="w-24 h-6 rounded-full" />
                </div>
                <Skeleton className="w-3/4 h-8 mb-3" />
                <Skeleton className="w-full h-4 mb-2" />
                <Skeleton className="w-5/6 h-4 mb-6" />
                <div className="pt-4 border-t border-stone-100 flex justify-between">
                  <Skeleton className="w-24 h-4" />
                  <Skeleton className="w-16 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* State: Error */}
        {error && (
          <div className="p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3 my-8">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-sm">Gagal memuat data dari Supabase</p>
              <p className="text-xs text-amber-700 mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* State: Empty */}
        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-20 text-stone-500">
            <p className="text-sm">Belum ada data proyek di database Supabase.</p>
          </div>
        )}

        {/* State: Success Grid */}
        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.map((item, idx) => (
              <Reveal key={item.id} delay={idx * 0.1}>
                <Link
                  href={`/projects/${item.id}`}
                  className="group relative flex flex-col justify-between rounded-3xl overflow-hidden bg-white border border-stone-200/80 shadow-sm hover:shadow-xl hover:border-emerald-700/30 transition-all duration-300 block h-full"
                >
                  {/* Image Preview Container */}
                  <div className="relative w-full aspect-[16/10] bg-stone-100 overflow-hidden border-b border-stone-100">
                    {item.image_url ? (
                      <Image
                        src={item.image_url}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-400 font-mono text-xs">
                        [PREVIEW IMAGE]
                      </div>
                    )}

                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-stone-900/80 backdrop-blur-md text-[#fbbf24] text-[11px] font-mono tracking-wider font-semibold border border-white/10">
                      PROYEK 0{idx + 1}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-8 flex flex-col flex-grow justify-between">
                    <div>
                      {/* Tech Stack Badges wrapped in individual pills */}
                      <div className="flex flex-wrap items-center gap-2 mb-4">
                        {parseTechStack(item.tech_stack).map((tech, tIdx) => (
                          <span
                            key={tIdx}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-800 border border-emerald-600/20 shadow-xs"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 mb-3 group-hover:text-[#064e3b] transition-colors leading-snug">
                        {item.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-stone-600 leading-relaxed line-clamp-3">
                        {item.description}
                      </p>
                    </div>

                    {/* Footer link */}
                    <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-semibold text-[#064e3b]">
                      <span>Studi Kasus Lengkap</span>
                      <div className="flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        <span>Detail</span>
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
