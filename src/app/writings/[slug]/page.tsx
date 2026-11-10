import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { Suspense } from "react";
import Skeleton from "@/components/ui/Skeleton";
import VoiceReader from "@/components/ui/VoiceReader";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const { data: writings } = await supabase.from("writings").select("slug");
    return (writings || [])
      .filter((w) => w.slug)
      .map((w) => ({ slug: w.slug as string }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const { data: writing } = await supabase
    .from("writings")
    .select("title, description, category")
    .eq("slug", slug)
    .single();

  if (!writing) {
    return {
      title: "Risalah Tidak Ditemukan | Ahmad Chamdan Yuwafin",
    };
  }

  return {
    title: `${writing.title} | Risalah Ahmad Chamdan Yuwafin`,
    description: writing.description,
    openGraph: {
      title: writing.title,
      description: writing.description,
      type: "article",
    },
  };
}

async function WritingContent({ slug }: { slug: string }) {
  const { data: writing, error } = await supabase
    .from("writings")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !writing) {
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Navigation Back */}
      <div className="mb-12">
        <Link
          href="/#writings"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-800 dark:hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Risalah Digital</span>
        </Link>
      </div>

      {/* Article Header */}
      <header className="mb-12 pb-8 border-b border-stone-200 dark:border-stone-800">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-400 border border-emerald-500/30">
              <Tag className="w-3.5 h-3.5" />
              {writing.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
              <Calendar className="w-3.5 h-3.5" />
              {writing.date}
            </span>
          </div>

          <VoiceReader text={writing.content} title={writing.title} />
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-950 dark:text-stone-50 tracking-tight leading-tight mb-6">
          {writing.title}
        </h1>

        <p className="text-base sm:text-lg text-stone-600 dark:text-stone-400 leading-relaxed italic">
          {writing.description}
        </p>

        <div className="mt-6 flex items-center justify-between text-xs text-stone-500 pt-4 border-t border-stone-200/60 dark:border-stone-800/60">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800 dark:text-stone-200">
              Oleh Ahmad Chamdan Yuwafin
            </span>
            <span>&bull;</span>
            <span>Ma&apos;had Aly Lirboyo</span>
          </div>
          <div className="font-serif text-emerald-700 dark:text-emerald-400">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </div>
        </div>
      </header>

      {/* Markdown Content */}
      <div className="prose prose-stone dark:prose-invert prose-emerald max-w-none prose-headings:font-serif prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-p:leading-relaxed prose-li:leading-relaxed">
        <ReactMarkdown>
          {writing.content || "Konten risalah sedang disempurnakan."}
        </ReactMarkdown>
      </div>

      {/* Article Footer */}
      <footer className="mt-16 pt-8 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="/#writings"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 text-xs font-semibold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <div className="text-xs text-stone-500 dark:text-stone-400 font-serif">
          Wallahu a&apos;lam bish-shawab
        </div>
      </footer>
    </div>
  );
}

export default async function WritingDetailPage({ params }: Props) {
  const { slug } = await params;
  return (
    <article className="min-h-screen bg-[#fafaf9] dark:bg-stone-950 text-stone-900 dark:text-stone-100 py-16 sm:py-24 px-4 sm:px-6 transition-colors">
      <Suspense
        fallback={
          <div className="max-w-3xl mx-auto space-y-6">
            <Skeleton className="w-32 h-6" />
            <Skeleton className="w-3/4 h-12" />
            <Skeleton className="w-full h-32" />
          </div>
        }
      >
        <WritingContent slug={slug} />
      </Suspense>
    </article>
  );
}
