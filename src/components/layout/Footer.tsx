"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { ArrowRight, CheckCircle2, AlertCircle, Loader2, Mail } from "lucide-react";

interface FooterProps {
  lang?: "ID" | "EN" | "AR";
}

export default function Footer({ lang = "ID" }: FooterProps) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [subError, setSubError] = useState<string | null>(null);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setSubmitting(true);
    setSubError(null);

    try {
      const { error } = await supabase.from("subscribers").insert([{ email: email.trim() }]);

      if (error) {
        if (error.code === "23505") {
          throw new Error(
            lang === "ID"
              ? "Alamat email ini sudah terdaftar sebagai pelanggan."
              : "This email is already subscribed."
          );
        }
        throw new Error(error.message);
      }

      setSubscribed(true);
      setEmail("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal berlangganan buletin.";
      setSubError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="relative w-full bg-[#080d0b] text-[#f5f5f4] pt-16 pb-8 px-4 sm:px-8 border-t border-stone-800/80 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Newsletter Subscription Strip */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-stone-900/60 border border-emerald-900/30 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div className="max-w-md">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
              <Mail className="w-3.5 h-3.5" />
              <span>{lang === "ID" ? "Buletin Ilmiah & Teknologi" : "Newsletter & Updates"}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
              {lang === "ID" ? "Dapatkan Tulisan & Update Terbaru" : "Stay in the Knowledge Loop"}
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              {lang === "ID"
                ? "Kajian fikih kontemporer, arsitektur AI, dan riset teknologi langsung ke email Anda."
                : "Islamic jurisprudence insights, AI architectures, and technical deep-dives to your inbox."}
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex flex-col sm:flex-row gap-2.5">
            {subscribed ? (
              <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-950 text-emerald-300 text-xs font-medium border border-emerald-500/30">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{lang === "ID" ? "Terima kasih telah berlangganan!" : "Subscribed successfully!"}</span>
              </div>
            ) : (
              <>
                <label htmlFor="newsletter-email" className="sr-only">
                  {lang === "ID" ? "Alamat Email Berlangganan" : "Subscription Email Address"}
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="Masukkan email Anda..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2.5 rounded-full bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 w-full sm:w-64"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  aria-label={lang === "ID" ? "Kirim pendaftaran buletin" : "Subscribe to newsletter"}
                  className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <>
                      <span>{lang === "ID" ? "Langganan" : "Subscribe"}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        </div>

        {subError && (
          <div className="mb-8 p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs flex items-center gap-2 max-w-md">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{subError}</span>
          </div>
        )}

        {/* 3-Column Grid Layout: Menu, Social, Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-16 border-b border-stone-800/80 text-sm">
          {/* Column 1: Menu / Navigasi */}
          <div>
            <h4 className="font-semibold text-xs tracking-wider uppercase text-emerald-400 mb-4 font-mono">
              {lang === "ID" ? "01 / Navigasi Utama" : "01 / Navigation"}
            </h4>
            <ul className="space-y-2.5 text-stone-300">
              <li>
                <a href="#home" className="hover:text-emerald-400 transition-colors">
                  {lang === "ID" ? "Beranda (Home)" : "Home"}
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-emerald-400 transition-colors">
                  {lang === "ID" ? "Profil Pribadi (About)" : "About"}
                </a>
              </li>
              <li>
                <a href="#skills" className="hover:text-emerald-400 transition-colors">
                  {lang === "ID" ? "Keahlian & Turats (Skills)" : "Skills & Expertise"}
                </a>
              </li>
              <li>
                <a href="#projects" className="hover:text-emerald-400 transition-colors">
                  {lang === "ID" ? "Karya & Portofolio (Projects)" : "Projects"}
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-emerald-400 transition-colors">
                  {lang === "ID" ? "Galeri 3D Interaktif (Gallery)" : "3D Gallery"}
                </a>
              </li>
              <li>
                <a href="#writings" className="hover:text-emerald-400 transition-colors">
                  {lang === "ID" ? "Risalah Digital (Writings)" : "Treatises"}
                </a>
              </li>
              <li>
                <a href="#testimonials" className="hover:text-emerald-400 transition-colors">
                  {lang === "ID" ? "Apresiasi & Testimoni" : "Endorsements"}
                </a>
              </li>
              <li>
                <a href="#experience" className="hover:text-emerald-400 transition-colors">
                  {lang === "ID" ? "Jejak Rekam (Experience)" : "Experience Timeline"}
                </a>
              </li>
              <li>
                <a href="#education" className="hover:text-emerald-400 transition-colors">
                  {lang === "ID" ? "Pendidikan & Sanad" : "Education & Sanad"}
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-emerald-400 transition-colors">
                  {lang === "ID" ? "Layanan & Harga (Services)" : "Services & Pricing"}
                </a>
              </li>
              <li>
                <a href="#schedule" className="hover:text-emerald-400 transition-colors">
                  {lang === "ID" ? "Jadwal Kajian (Schedule)" : "Teaching Schedule"}
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-emerald-400 transition-colors">
                  {lang === "ID" ? "Kontak & Diskusi" : "Contact"}
                </a>
              </li>
              <li>
                <Link href="/verify-sanad" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                  {lang === "ID" ? "Verifikasi Sanad (SHA-256) 🛡️" : "Verify Sanad (SHA-256) 🛡️"}
                </Link>
              </li>
              <li>
                <Link href="/tools/faraidh" className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors">
                  {lang === "ID" ? "Kalkulator Faraidh & Zakat ⚖️" : "Faraidh & Zakat Calculator ⚖️"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Social / Jejaring Sosial */}
          <div>
            <h4 className="font-semibold text-xs tracking-wider uppercase text-emerald-400 mb-4 font-mono">
              {lang === "ID" ? "02 / Jejaring Sosial" : "02 / Social Channels"}
            </h4>
            <ul className="space-y-2.5 text-stone-300">
              <li>
                <a
                  href="https://github.com/ahmadchamdan03-svg"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Kunjungi profil GitHub Ahmad Chamdan Yuwafin"
                  className="inline-flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <svg className="w-4 h-4 fill-current text-emerald-400" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                  <span>GitHub (@ahmadchamdan03-svg)</span>
                </a>
              </li>
              <li>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Kunjungi profil LinkedIn Ahmad Chamdan Yuwafin"
                  className="inline-flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <svg className="w-4 h-4 fill-current text-emerald-400" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                  <span>LinkedIn Profile</span>
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Kunjungi profil Instagram Ahmad Chamdan Yuwafin"
                  className="inline-flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <svg className="w-4 h-4 fill-current text-emerald-400" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span>Instagram Profile</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact / Afiliasi */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/images/logo.png"
                width={40}
                height={40}
                alt="Logo Chamdan"
                className="w-10 h-10 rounded-full border border-emerald-500/40 bg-stone-900 shadow-md object-cover"
              />
              <div>
                <h4 className="font-semibold text-xs tracking-wider uppercase text-emerald-400 font-mono">
                  {lang === "ID" ? "03 / Afiliasi & Domisili" : "03 / Contact & Location"}
                </h4>
                <span className="text-[11px] font-serif text-stone-400">ذوو العلى &bull; Lirboyo</span>
              </div>
            </div>
            <div className="space-y-3 text-stone-300">
              <p className="font-medium text-white">Ahmad Chamdan Yuwafin (Chamdan)</p>
              <p className="text-sm leading-relaxed text-stone-400">
                Pondok Pesantren Lirboyo, Kota Kediri, Jawa Timur, Indonesia.
              </p>
              <p className="text-xs font-mono text-emerald-300">
                Email:{" "}
                <a
                  href="mailto:ahmadchamdan03@gmail.com"
                  className="hover:underline hover:text-emerald-200"
                >
                  ahmadchamdan03@gmail.com
                </a>
              </p>
              <p className="text-xs font-mono text-emerald-300">
                WhatsApp / Telp:{" "}
                <a
                  href="https://wa.me/6285899151685"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline hover:text-emerald-200"
                >
                  085899151685
                </a>
              </p>
              <div className="pt-2">
                <a
                  href="/login"
                  className="text-[11px] text-stone-600 hover:text-stone-400 transition-colors"
                >
                  Portal Admin &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Legal Links & Engine */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <p>© 2026 Ahmad Chamdan Yuwafin. All rights reserved.</p>
            <div className="flex items-center gap-3 text-stone-400">
              <a href="/privacy" className="hover:text-emerald-400 transition-colors">
                {lang === "ID" ? "Kebijakan Privasi" : "Privacy Policy"}
              </a>
              <span>&bull;</span>
              <a href="/terms" className="hover:text-emerald-400 transition-colors">
                {lang === "ID" ? "Syarat & Ketentuan" : "Terms of Service"}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3 font-mono text-stone-500">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Sistem Aktif &bull; Live Presence</span>
            </span>
            <span>Next.js 16 &bull; Supabase &bull; Vercel</span>
          </div>
        </div>

        {/* Giant Outro Typography: CHAMDAN */}
        <div className="mt-12 sm:mt-16 text-center select-none overflow-hidden">
          <div className="font-sans font-black text-[15vw] leading-[0.75] tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white/20 via-white/10 to-transparent">
            CHAMDAN
          </div>
        </div>
      </div>
    </footer>
  );
}
