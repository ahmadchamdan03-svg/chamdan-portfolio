"use client";

import React, { useEffect, useState } from "react";
import { WifiOff, Download, X } from "lucide-react";

export function triggerHaptic(pattern: number | number[] = 15) {
  if (typeof window !== "undefined" && "navigator" in window && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Haptics optional
    }
  }
}

export default function PWAProvider({ children }: { children: React.ReactNode }) {
  const [isOffline, setIsOffline] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPill, setShowInstallPill] = useState(false);

  useEffect(() => {
    // 1. Register Service Worker
    if (typeof window !== "undefined" && "serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .then(() => {
          // SW registered successfully
        })
        .catch((err) => {
          console.warn("ServiceWorker registration failed:", err);
        });
    }

    // 2. Online / Offline listeners
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    if (typeof window !== "undefined") {
      setIsOffline(!navigator.onLine);
      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // 3. BeforeInstallPrompt for PWA install pill
      const handleBeforeInstall = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowInstallPill(true);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstall);

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
        window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    triggerHaptic([20, 40, 20]);
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstallPill(false);
    }
    setDeferredPrompt(null);
  };

  return (
    <>
      {children}

      {/* Offline Alert Banner */}
      {isOffline && (
        <aside
          role="status"
          aria-live="polite"
          className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-amber-500/90 dark:bg-amber-600/90 text-white text-xs font-medium shadow-lg backdrop-blur-md animate-fade-in"
        >
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>Mode Luring Aktif: Membaca dari arsip cache lokal.</span>
        </aside>
      )}

      {/* Install PWA Prompt Pill */}
      {showInstallPill && (
        <aside
          aria-label="Pasang Aplikasi Web"
          className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-3 px-4 py-2.5 rounded-full bg-emerald-950/90 border border-emerald-500/30 text-emerald-200 text-xs font-mono shadow-2xl backdrop-blur-md"
        >
          <Download className="w-4 h-4 text-emerald-400 animate-bounce" />
          <span>Pasang Web Portofolio di Layar Utama?</span>
          <button
            onClick={handleInstallClick}
            className="px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 font-sans font-semibold hover:bg-emerald-400 transition-colors"
          >
            Pasang
          </button>
          <button
            onClick={() => setShowInstallPill(false)}
            className="p-1 text-slate-400 hover:text-white"
            aria-label="Tutup"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </aside>
      )}
    </>
  );
}
