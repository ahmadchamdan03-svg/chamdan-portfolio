"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global critical error:", error);
  }, [error]);

  return (
    <html lang="id">
      <body className="min-h-screen flex items-center justify-center p-6 bg-stone-950 text-stone-100 font-sans">
        <div className="relative max-w-lg w-full p-8 sm:p-10 rounded-3xl bg-stone-900 border border-emerald-500/20 shadow-2xl text-center">
          <div className="mb-4 text-emerald-400 font-serif text-2xl">
            لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ
          </div>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 mb-6">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-white mb-3">
            Kesalahan Global Sistem
          </h1>
          <p className="text-sm text-stone-400 mb-8">
            Terjadi kendala kritis pada antarmuka aplikasi. Silakan muat ulang.
          </p>
          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Muat Ulang Halaman</span>
          </button>
        </div>
      </body>
    </html>
  );
}
