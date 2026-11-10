"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error captured:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-stone-950 text-stone-100">
      <div className="relative max-w-lg w-full p-8 sm:p-10 rounded-3xl bg-stone-900/90 border border-emerald-500/20 shadow-2xl shadow-emerald-950/40 text-center backdrop-blur-xl">
        {/* Arabic Calligraphy reminder */}
        <div className="mb-4 text-emerald-400 font-serif text-xl sm:text-2xl tracking-wide opacity-90">
          لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ
        </div>

        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-6">
          <AlertTriangle className="w-7 h-7" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-3">
          Terjadi Kesalahan pada Sistem
        </h1>
        <p className="text-sm sm:text-base text-stone-400 mb-8 leading-relaxed">
          Maaf atas ketidaknyamanan ini. Sistem mengalami kendala tak terduga saat memproses permintaan Anda.
        </p>

        {error.digest && (
          <div className="mb-6 px-3 py-1.5 rounded-lg bg-stone-800/80 border border-stone-700 font-mono text-xs text-stone-400 inline-block">
            Digest Code: {error.digest}
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-950/40 border border-emerald-400/30"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Muat Ulang Halaman</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-sm transition-all border border-stone-700"
          >
            <Home className="w-4 h-4" />
            <span>Ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
