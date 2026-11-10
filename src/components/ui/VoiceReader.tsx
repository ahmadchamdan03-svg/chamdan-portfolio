"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX, Sparkles } from "lucide-react";

interface VoiceReaderProps {
  text: string;
  title: string;
}

export default function VoiceReader({ text, title }: VoiceReaderProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [supported, setSupported] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setSupported(true);
    }
  }, []);

  const handleToggle = () => {
    if (!supported) return;

    if (isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      window.speechSynthesis.cancel();
      const plainText = `${title}. ${text.replace(/[#*`_\[\]]/g, "")}`;
      const utterance = new SpeechSynthesisUtterance(plainText);
      utterance.lang = "id-ID";
      utterance.rate = 0.95; // Slightly slower, respectful scholarly cadence

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      window.speechSynthesis.speak(utterance);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!supported) return null;

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm ${
        isPlaying
          ? "bg-emerald-600 text-white animate-pulse"
          : "bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950 dark:hover:text-emerald-400 border border-stone-300 dark:border-stone-700"
      }`}
      aria-label={isPlaying ? "Hentikan pembacaan suara" : "Dengarkan artikel dengan narator suara AI"}
    >
      {isPlaying ? (
        <>
          <VolumeX className="w-3.5 h-3.5" />
          <span>Hentikan Suara</span>
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Dengarkan Risalah</span>
          <Sparkles className="w-3 h-3 text-amber-500" />
        </>
      )}
    </button>
  );
}