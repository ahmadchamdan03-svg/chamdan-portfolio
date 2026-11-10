import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  CheckCircle2,
  TrendingUp,
  Share2,
  Layers,
  Sparkles,
} from "lucide-react";
import { Suspense } from "react";
import Skeleton from "@/components/ui/Skeleton";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  try {
    const { data: projects } = await supabase.from("projects").select("id");
    return (projects || []).map((p) => ({ id: p.id }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: project } = await supabase
    .from("projects")
    .select("title, description")
    .eq("id", id)
    .single();

  if (!project) {
    return {
      title: "Proyek Tidak Ditemukan | Ahmad Chamdan Yuwafin",
    };
  }

  return {
    title: `${project.title} | Case Study Ahmad Chamdan Yuwafin`,
    description: project.description,
    openGraph: {
      title: project.title,
      description: project.description,
    },
  };
}

async function ProjectContent({ id }: { id: string }) {
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !project) {
    notFound();
  }

  const shareText = encodeURIComponent(
    `Lihat studi kasus proyek "${project.title}" oleh Ahmad Chamdan Yuwafin: https://www.chamdan.site/projects/${project.id}`
  );
  const waShareUrl = `https://api.whatsapp.com/send?text=${shareText}`;
  const liShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://www.chamdan.site/projects/${project.id}`)}`;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Link */}
      <div className="mb-10">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Portofolio Proyek</span>
        </Link>
      </div>

      {/* Case Study Header */}
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-2.5 mb-4">
          {project.domain && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 border border-emerald-500/30">
              {project.domain}
            </span>
          )}
          {project.platform && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
              {project.platform}
            </span>
          )}
          {project.role && (
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-500/30">
              Peran: {project.role}
            </span>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-950 dark:text-stone-50 tracking-tight mb-6">
          {project.title}
        </h1>

        <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400 leading-relaxed max-w-3xl">
          {project.description}
        </p>
      </header>

      {/* Project Hero Showcase Image */}
      {project.image_url && (
        <div className="relative w-full aspect-video sm:aspect-[21/9] rounded-3xl overflow-hidden mb-12 border border-stone-200 dark:border-stone-800 shadow-2xl bg-stone-900 group">
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            priority
            className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </div>
      )}

      {/* Deep Dive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {/* Main Case Study Narrative */}
        <div className="md:col-span-2 space-y-8">
          <section className="p-8 rounded-3xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 shadow-lg">
            <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span>Latar Belakang & Tantangan</span>
            </h2>
            <div className="text-sm sm:text-base text-stone-700 dark:text-stone-300 leading-relaxed space-y-4">
              <p>
                {project.long_description ||
                  `${project.title} dikembangkan guna menjawab kebutuhan operasional berskala besar di lingkungan pesantren dan majelis ilmiah, dengan mengutamakan performa tanpa jeda dan keandalan data.`}
              </p>
            </div>
          </section>

          {/* Key Features List */}
          {project.features && project.features.length > 0 && (
            <section className="p-8 rounded-3xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 shadow-lg">
              <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-6 flex items-center gap-2">
                <Layers className="w-5 h-5 text-emerald-600" />
                <span>Fitur Utama & Arsitektur</span>
              </h2>
              <ul className="space-y-3.5">
                {project.features.map((feat: string, idx: number) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-sm sm:text-base text-stone-700 dark:text-stone-300"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 shadow-md">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-4">
              Tech Stack
            </h3>
            <div className="flex flex-wrap gap-2">
              {project.tech_stack.map((tech: string, i: number) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          {project.impact && project.impact.length > 0 && (
            <div className="p-6 rounded-3xl bg-emerald-950 text-white border border-emerald-500/30 shadow-xl">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                <span>Dampak Nyata</span>
              </h3>
              <ul className="space-y-3">
                {project.impact.map((imp: string, i: number) => (
                  <li
                    key={i}
                    className="text-xs sm:text-sm text-stone-200 leading-relaxed flex items-start gap-2"
                  >
                    <span className="text-amber-400 font-bold">&bull;</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="p-6 rounded-3xl bg-white dark:bg-stone-900/80 border border-stone-200 dark:border-stone-800 shadow-md">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-4 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              <span>Bagikan Studi Kasus</span>
            </h3>
            <div className="flex flex-col gap-2">
              <a
                href={waShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors"
              >
                Bagikan ke WhatsApp
              </a>
              <a
                href={liShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0077b5] hover:bg-[#006097] text-white text-xs font-semibold transition-colors"
              >
                Bagikan ke LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Navigation */}
      <div className="pt-8 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <Link
          href="/#projects"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
        <div className="text-xs text-stone-400">
          Ahmad Chamdan Yuwafin &copy; 2026
        </div>
      </div>
    </div>
  );
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-16 sm:py-24 px-4 sm:px-6 transition-colors">
      <Suspense
        fallback={
          <div className="max-w-4xl mx-auto space-y-6">
            <Skeleton className="w-32 h-6" />
            <Skeleton className="w-3/4 h-12" />
            <Skeleton className="w-full aspect-[21/9] rounded-3xl" />
          </div>
        }
      >
        <ProjectContent id={id} />
      </Suspense>
    </div>
  );
}
