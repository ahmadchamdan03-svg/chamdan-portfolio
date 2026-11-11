"use client";

import { useEffect, useState } from "react";
import { Share2, Printer, CheckCircle2, Clock } from "lucide-react";
import { triggerHaptic } from "@/components/providers/PWAProvider";

interface ArticleInteractionsProps {
  title: string;
  description?: string;
  text: string;
}

export default function ArticleInteractions({
  title,
  description,
  text,
}: ArticleInteractionsProps) {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [copied, setCopied] = useState(false);

  // Calculate read time: average 200 words per minute
  const words = text ? text.trim().split(/\s+/).length : 0;
  const readTimeMinutes = Math.max(1, Math.ceil(words / 200));

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleShare = async () => {
    triggerHaptic(20);
    const shareData = {
      title,
      text: description || title,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback copy to clipboard
      await navigator.clipboard.writeText(
        `*${title}*\nOleh Ahmad Chamdan Yuwafin\n\nBaca selengkapnya di: ${window.location.href}`
      );
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    triggerHaptic(15);
    window.print();
  };

  return (
    <>
      {/* Sticky Reading Progress Bar */}
      <div
        className="fixed top-0 left-0 right-0 h-1 bg-emerald-500/20 z-[999] pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 transition-all duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Meta Bar: Read Time, Share, Print */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-mono">
          <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{readTimeMinutes} mnt baca</span>
        </span>

        <button
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-stone-700 dark:text-stone-300 hover:text-emerald-700 dark:hover:text-emerald-400 font-mono transition-colors"
          title="Bagikan Risalah"
        >
          {copied ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Share2 className="w-3.5 h-3.5" />
          )}
          <span>{copied ? "Tautan Tersalin!" : "Bagikan"}</span>
        </button>

        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-mono transition-colors print:hidden"
          title="Cetak atau Simpan PDF"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Cetak / PDF</span>
        </button>
      </div>
    </>
  );
}
