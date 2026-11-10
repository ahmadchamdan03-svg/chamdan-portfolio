import Link from "next/link";
import { Compass, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-stone-950 text-stone-100">
      <div className="relative max-w-md w-full p-8 sm:p-10 rounded-3xl bg-stone-900/90 border border-emerald-500/20 shadow-2xl text-center backdrop-blur-xl">
        <div className="text-emerald-400 font-serif text-xl mb-4">
          أَيْنَ تَذْهَبُونَ
        </div>
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-6">
          <Compass className="w-7 h-7" />
        </div>
        <div className="text-6xl font-serif font-black text-amber-400 mb-2">
          404
        </div>
        <h1 className="text-xl sm:text-2xl font-serif font-bold text-white mb-3">
          Halaman Tidak Ditemukan
        </h1>
        <p className="text-sm text-stone-400 mb-8 leading-relaxed">
          Tautan yang Anda tuju mungkin telah dipindahkan, dihapus, atau tidak pernah ada dalam arsip.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all shadow-lg shadow-emerald-950/40 border border-emerald-400/30"
        >
          <Home className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>
      </div>
    </div>
  );
}
