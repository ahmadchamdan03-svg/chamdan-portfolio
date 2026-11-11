"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/database";
import { Loader2 } from "lucide-react";

interface AboutSectionProps {
  lang?: "ID" | "EN" | "AR";
}

export default function AboutSection({ lang = "ID" }: AboutSectionProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);
        setError(null);

        const { data, error: err } = await supabase
          .from("profile")
          .select("*")
          .limit(1)
          .single();

        if (err) {
          throw err;
        }

        if (data) {
          setProfile(data);
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Gagal memuat profil";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  return (
    <section
      id="about"
      className="relative w-full py-28 px-4 sm:px-8 bg-[#0a100d] text-[#f5f5f4] overflow-hidden"
    >
      {/* Background Ambience Emerald & Gold Glows */}
      <div className="absolute top-1/4 left-1/10 w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* State: Loading Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-12">
            <div className="lg:col-span-7 space-y-4 animate-pulse">
              <div className="h-10 bg-stone-800/60 rounded-xl w-3/4" />
              <div className="h-6 bg-stone-800/40 rounded-lg w-full" />
              <div className="h-6 bg-stone-800/40 rounded-lg w-5/6" />
              <div className="h-12 bg-stone-800/60 rounded-full w-48 mt-6" />
            </div>
            <div className="lg:col-span-5 h-72 bg-stone-800/50 rounded-3xl animate-pulse" />
          </div>
        )}

        {/* State: Error */}
        {error && !loading && (
          <div className="p-6 rounded-2xl bg-amber-950/40 border border-amber-600/30 text-amber-200 my-6">
            <p className="text-sm font-semibold">Catatan: Menggunakan data profil lokal.</p>
            <p className="text-xs text-amber-300 mt-1">{error}</p>
          </div>
        )}

        {/* State: Success */}
        {(!loading || error) && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            {/* Left Column: Big Statement & Narrative */}
            <div className="lg:col-span-7">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white tracking-tight leading-[1.2] mb-6">
                I am Chamdan,{" "}
                <span className="italic text-emerald-400 font-serif">
                  {profile?.tagline ||
                    "Seorang Santri, Khadimul Ilmi yang merajut khazanah dari turats hingga rekayasa AI-Driven Web."}
                </span>
              </h2>

              <p className="text-base sm:text-lg text-stone-300 font-normal leading-relaxed mb-6">
                {profile?.about ||
                  "Membawa tradisi keilmuan pesantren ke dalam teknologi modern. Berpengalaman dalam kepemimpinan organisasi, kesekretariatan, pengajaran kitab salaf, dan perancangan aplikasi web full-stack terintegrasi AI."}
              </p>

              <p className="text-sm text-stone-400 leading-relaxed mb-10 max-w-xl">
                {lang === "ID"
                  ? "Menghadirkan solusi digital yang tidak hanya mutakhir secara teknis, namun berakar pada integritas, adab, dan standar pesantren."
                  : "Delivering digital solutions that are technically cutting-edge, yet firmly grounded in ethics, integrity, and pesantren tradition."}
              </p>
            </div>

            {/* Right Column: Glassmorphism Info Table Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-b from-stone-900/80 to-stone-950/90 backdrop-blur-xl border border-emerald-500/20 shadow-2xl overflow-hidden">
                {/* Subtle card header accent */}
                <div className="flex items-center justify-between pb-6 mb-6 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono uppercase tracking-widest text-stone-300 font-semibold">
                      Profil Ringkas
                    </span>
                  </div>
                </div>

                {/* 4 Info Rows */}
                <dl className="space-y-6 text-sm">
                  {/* Row 1: ROLE */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 pb-4 border-b border-stone-800/60">
                    <dt className="font-mono text-xs text-stone-400 uppercase tracking-wider">
                      ROLE
                    </dt>
                    <dd className="font-medium text-stone-100 text-right sm:max-w-[65%]">
                      Seorang Santri &amp; AI-Driven Web Developer
                    </dd>
                  </div>

                  {/* Row 2: LOCATION */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 pb-4 border-b border-stone-800/60">
                    <dt className="font-mono text-xs text-stone-400 uppercase tracking-wider">
                      LOCATION
                    </dt>
                    <dd className="font-medium text-stone-100 text-right">
                      Kediri, Indonesia
                    </dd>
                  </div>

                  {/* Row 3: STATUS */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 pb-4 border-b border-stone-800/60">
                    <dt className="font-mono text-xs text-stone-400 uppercase tracking-wider">
                      STATUS
                    </dt>
                    <dd className="inline-flex items-center justify-end gap-2 font-medium text-emerald-400 text-right">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      <span>Open for Projects</span>
                    </dd>
                  </div>

                  {/* Row 4: FOCUS */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1">
                    <dt className="font-mono text-xs text-stone-400 uppercase tracking-wider">
                      FOCUS
                    </dt>
                    <dd className="font-medium text-[#fbbf24] text-right">
                      Kitab Salaf &amp; Web AI Automation
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
