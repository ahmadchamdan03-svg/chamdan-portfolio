"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, Check, X } from "lucide-react";
import { triggerHaptic } from "@/components/providers/PWAProvider";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie_consent");
    if (!consent) {
      // Delay showing by 1.5 seconds for pleasant entrance
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    triggerHaptic(15);
    localStorage.setItem("cookie_consent", "granted");
    setShow(false);
  };

  const handleDecline = () => {
    triggerHaptic(10);
    localStorage.setItem("cookie_consent", "declined");
    setShow(false);
  };

  if (!show) return null;

  return (
    <aside
      aria-label="Persetujuan Privasi & Cookie"
      className="fixed bottom-4 right-4 left-4 sm:left-auto sm:max-w-md z-[80] p-4 rounded-2xl bg-stone-900/95 dark:bg-stone-900/95 border border-stone-800 shadow-2xl backdrop-blur-xl animate-in slide-in-from-bottom duration-300"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 shrink-0">
          <Cookie className="w-4 h-4" />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-semibold text-stone-100 font-sans">
            Privasi & Preferensi Lokal
          </h4>
          <p className="text-stone-400 leading-relaxed">
            Website ini menggunakan penyimpanan lokal (local storage) untuk menyimpan preferensi tema, audio latar, dan analitik performa tanpa melacak data pribadi. Pelajari di{" "}
            <Link
              href="/privacy"
              className="text-emerald-400 hover:underline font-medium"
            >
              Kebijakan Privasi
            </Link>
            .
          </p>
          <div className="flex items-center gap-2 pt-2">
            <button
              onClick={handleAccept}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-md transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Saya Setuju</span>
            </button>
            <button
              onClick={handleDecline}
              className="px-3 py-1.5 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs transition-colors"
            >
              Tolak
            </button>
          </div>
        </div>
        <button
          onClick={handleDecline}
          className="text-stone-500 hover:text-stone-300 p-1 -mr-1 -mt-1"
          aria-label="Tutup Banner"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
