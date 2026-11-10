"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";

export default function AmbientAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startAmbient = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Play soft harmonic pentatonic chimes periodically (432Hz based tuning)
      const frequencies = [216, 288, 324, 384, 432, 576];
      let step = 0;

      const playChime = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === "closed") return;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const freq = frequencies[step % frequencies.length];
        step++;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Very soft volume: max 0.04 to remain non-intrusive
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.03, ctx.currentTime + 1.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 4.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 4.6);
      };

      playChime();
      timerRef.current = setInterval(playChime, 4000);
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  };

  const stopAmbient = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    setIsPlaying(false);
  };

  const toggle = () => {
    if (isPlaying) {
      stopAmbient();
    } else {
      startAmbient();
    }
  };

  useEffect(() => {
    return () => {
      stopAmbient();
    };
  }, []);

  return (
    <button
      type="button"
      onClick={toggle}
      className={`flex items-center justify-center w-8 h-8 rounded-full backdrop-blur-md border transition-all duration-300 shadow-md ${
        isPlaying
          ? "bg-emerald-700 border-emerald-400 text-white animate-pulse"
          : "bg-white/90 dark:bg-stone-900/90 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-emerald-600"
      }`}
      aria-label={isPlaying ? "Matikan Musik Latar (Ambient)" : "Nyalakan Musik Latar (Ambient)"}
      title={isPlaying ? "Matikan Musik Latar (Ambient)" : "Nyalakan Musik Latar (Ambient)"}
    >
      {isPlaying ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-stone-400" />}
    </button>
  );
}