"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroLoader() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hasSeen = sessionStorage.getItem("chamdan_intro_seen");
    if (!hasSeen) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        sessionStorage.setItem("chamdan_intro_seen", "true");
      }, 1600);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#070c0a] select-none"
        >
          {/* Subtle radiating glow */}
          <div className="absolute w-[400px] h-[400px] bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: [0.5, 1.1, 1], opacity: 1 }}
            exit={{ scale: 3, opacity: 0 }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex items-center justify-center w-28 h-28 rounded-full bg-[#064e3b] border-2 border-[#fbbf24] shadow-[0_0_50px_rgba(251,191,36,0.35)]"
          >
            <span className="font-serif font-black text-6xl text-[#fbbf24] leading-none">
              C
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-6 text-center"
          >
            <p className="font-serif tracking-widest uppercase text-xs text-stone-300 font-semibold">
              Ahmad Chamdan Yuwafin
            </p>
            <p className="font-arabic text-amber-500/80 text-sm mt-1">
              خادم العلم
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
