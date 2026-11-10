"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Testimonial } from "@/types/database";
import { Quote, Star, ShieldCheck } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import Skeleton from "@/components/ui/Skeleton";

interface TestimonialsSectionProps {
  lang?: "ID" | "EN";
}

const TRUST_PARTNERS = [
  "Pondok Pesantren Lirboyo Kediri",
  "Ma'had Aly Lirboyo (Takhassus Fiqh)",
  "Lembaga Ittihadul Mutakharrijin",
  "Dzaween Press Muktamar NU Ke-35",
  "Kepanitiaan Haflah Akhirussanah",
  "Komunitas Santri Developer Indonesia",
];

export default function TestimonialsSection({
  lang = "ID",
}: TestimonialsSectionProps) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const { data, error } = await supabase
          .from("testimonials")
          .select("*")
          .order("created_at", { ascending: true });

        if (!error && data && data.length > 0) {
          setTestimonials(data);
        } else {
          // Fallback static
          setTestimonials([
            {
              id: "1",
              name: "KH. Abdul Qodir",
              role: "Dewan Pengasuh & Pimpinan Majelis",
              organization: "Pondok Pesantren Lirboyo",
              quote:
                "Kang Chamdan adalah potret santri yang tawadhu sekaligus cerdas menjembatani nilai turats dengan kebutuhan zaman. Sistem presensi digital Haflah yang ia bangun terbukti mengamankan tata kelola ribuan tamu tanpa cela.",
              avatar_url: "/images/hero/blueshirt.png",
              created_at: new Date().toISOString(),
            },
            {
              id: "2",
              name: "Ust. M. Ridwan Hakim",
              role: "Ketua Panitia Haflah Akhirussanah",
              organization: "Kepanitiaan Haflah P3TQ",
              quote:
                "Arsitektur web yang dirancang sangat tangguh. Live scanner gerbang tetap responsif meskipun diakses secara simultan di jam-jam puncak kedatangan wali santri. Kerja yang sangat teliti dan bertanggung jawab.",
              avatar_url: "/images/hero/jacket.png",
              created_at: new Date().toISOString(),
            },
            {
              id: "3",
              name: "Ahmad Zarkasyi, S.Kom.",
              role: "Lead Engineering Colleague",
              organization: "Komunitas Developer Santri",
              quote:
                "Jarang sekali menemukan developer yang menguasai Next.js 16, Supabase RLS, dan otomasi AI sedalam ini, sembari tetap memegang teguh kaidah ushul fikih dan adab keilmuan pesantren.",
              avatar_url: "/images/hero/jacket.png",
              created_at: new Date().toISOString(),
            },
          ]);
        }
      } catch (err) {
        console.error("Testimonial fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTestimonials();
  }, []);

  return (
    <section id="testimonials" className="py-24 sm:py-32 bg-[#fafaf9] dark:bg-stone-950 text-stone-900 dark:text-stone-100 relative overflow-hidden transition-colors">
      {/* Trust Signals Marquee Banner */}
      <div className="mb-20 border-y border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-900/60 py-4 backdrop-blur-sm overflow-hidden">
        <div className="flex items-center gap-8 whitespace-nowrap animate-marquee">
          {[...TRUST_PARTNERS, ...TRUST_PARTNERS].map((partner, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2.5 text-xs sm:text-sm font-semibold tracking-wider text-stone-600 dark:text-stone-400 uppercase"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{partner}</span>
              <span className="text-stone-400 dark:text-stone-600 mx-3">&bull;</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{lang === "ID" ? "Apresiasi & Testimoni" : "Endorsements & Trust"}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold tracking-tight">
              {lang === "ID"
                ? "Kepercayaan Para Guru & Mitra"
                : "Trusted by Mentors & Collaborators"}
            </h2>
            <p className="mt-4 text-sm sm:text-base text-stone-600 dark:text-stone-400">
              {lang === "ID"
                ? "Integritas kerja, adab keilmuan, dan keandalan sistem yang telah teruji di lingkungan majelis pesantren dan ekosistem digital."
                : "Proven reliability, scholarly integrity, and high-impact engineering acknowledged across pesantren leadership and developers."}
            </p>
          </div>
        </Reveal>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-lg flex flex-col justify-between"
              >
                <div>
                  <Skeleton className="w-10 h-10 rounded-full mb-6" />
                  <Skeleton className="w-full h-4 mb-3" />
                  <Skeleton className="w-5/6 h-4 mb-3" />
                  <Skeleton className="w-3/4 h-4 mb-6" />
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-stone-100 dark:border-stone-800">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="space-y-2 flex-grow">
                    <Skeleton className="w-24 h-4" />
                    <Skeleton className="w-32 h-3" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            testimonials.map((item, index) => (
              <Reveal key={item.id} delay={index * 0.15}>
                <div className="h-full flex flex-col justify-between p-8 rounded-3xl bg-white/80 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800/80 shadow-xl shadow-stone-900/5 backdrop-blur-xl hover:-translate-y-1.5 transition-all duration-300 group">
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
                      <Quote className="w-5 h-5 fill-current opacity-80" />
                    </div>
                    <p className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed italic mb-8">
                      &ldquo;{item.quote}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-3.5 pt-6 border-t border-stone-100 dark:border-stone-800/80">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-emerald-600/30 shrink-0 bg-stone-200 dark:bg-stone-800">
                      <Image
                        src={item.avatar_url || "/images/hero/jacket.png"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 dark:text-stone-100 truncate">
                        {item.name}
                      </h3>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400 font-medium truncate">
                        {item.role}
                      </p>
                      <p className="text-[11px] text-stone-500 dark:text-stone-400 truncate">
                        {item.organization}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
