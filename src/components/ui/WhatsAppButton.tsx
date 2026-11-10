"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const phoneNumber = "6285899151685";
  const defaultMessage = encodeURIComponent(
    "Halo Chamdan, saya melihat portofolio Anda dan ingin berdiskusi."
  );
  const waUrl = `https://wa.me/${phoneNumber}?text=${defaultMessage}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Hubungi Ahmad Chamdan Yuwafin via WhatsApp"
      className="fixed bottom-6 right-6 z-40 group flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-xl shadow-emerald-900/20 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 border border-emerald-400/30"
    >
      <MessageCircle className="w-5 h-5 text-white animate-pulse" />
      <span className="text-xs font-semibold tracking-wide hidden sm:inline-block">
        Tanya via WhatsApp
      </span>
      {/* Tooltip ping indicator */}
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
      </span>
    </a>
  );
}
