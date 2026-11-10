"use client";

import { useEffect, useState } from "react";
import { Sparkles, X, Award, CheckCircle } from "lucide-react";

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

export default function EasterEgg() {
  const [inputSequence, setInputSequence] = useState<string[]>([]);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      const expectedKey = KONAMI_CODE[inputSequence.length];

      if (key === expectedKey || (expectedKey && key.toLowerCase() === expectedKey.toLowerCase())) {
        const nextSeq = [...inputSequence, key];
        setInputSequence(nextSeq);

        if (nextSeq.length === KONAMI_CODE.length) {
          setUnlocked(true);
          setInputSequence([]);
        }
      } else {
        setInputSequence([]);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [inputSequence]);

  if (!unlocked) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
      onClick={() => setUnlocked(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Easter Egg Santri Terbuka"
    >
      <div
        className="relative max-w-md w-full p-8 rounded-3xl bg-stone-900 border-2 border-amber-500/80 shadow-2xl text-center text-white space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setUnlocked(false)}
          aria-label="Tutup pesan rahasia"
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-white bg-stone-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-400 animate-bounce">
          <Sparkles className="w-8 h-8" />
        </div>

        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950 text-amber-300 border border-amber-500/30 text-xs font-mono uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5" />
            <span>Konami Code Diaktifkan</span>
          </div>
          <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
            Barakallahu Fik!
          </h2>
          <p className="font-arabic text-xl text-amber-300 mt-2 leading-loose">
            طَلَبُ الْعِلْمِ فَرِيْضَةٌ عَلَى كُلِّ مُسْلِمٍ
          </p>
          <p className="text-xs text-stone-300 mt-3 italic leading-relaxed">
            &ldquo;Menuntut ilmu adalah kewajiban bagi setiap muslim.&rdquo;
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-stone-950 border border-emerald-500/30 text-left text-xs space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold font-mono">
            <CheckCircle className="w-4 h-4" />
            <span>Sanad Developer Santri Terbuka</span>
          </div>
          <p className="text-stone-300 leading-relaxed">
            Anda berhasil menemukan fitur rahasia! Situs ini dibangun dengan dedikasi penuh memadukan tradisi keilmuan Turats Pondok Pesantren Lirboyo dengan rekayasa Next.js 16 dan Supabase.
          </p>
        </div>

        <button
          onClick={() => setUnlocked(false)}
          className="w-full py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors shadow-lg"
        >
          Lanjutkan Eksplorasi Portofolio
        </button>
      </div>
    </div>
  );
}