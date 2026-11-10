"use client";

import { useState } from "react";
import { Mail, ArrowUp, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

interface ContactSectionProps {
  lang?: "ID" | "EN";
}

export default function ContactSection({ lang = "ID" }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    website: "", // Honeypot field
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal mengirim pesan.");
      }

      setSuccess(true);
      setFormData({ name: "", email: "", message: "", website: "" });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim pesan.";
      setErrorMessage(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact"
      className="relative w-full pt-28 pb-16 px-4 sm:px-8 bg-[#0a100d] text-[#f5f5f4] overflow-hidden"
    >
      {/* Background Accent Glows */}
      <div className="absolute top-1/4 left-1/3 w-[550px] h-[550px] bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <Reveal>
          {/* Glassmorphism Main CTA Card */}
          <div className="relative rounded-3xl bg-stone-900/60 backdrop-blur-2xl border border-emerald-900/40 p-8 sm:p-12 md:p-16 shadow-2xl overflow-hidden">
            {/* Inner Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

            {/* Status Indicator */}
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-medium mb-8">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span>Open for projects &amp; academic discussions</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              {/* Left Column: Headline & Direct Contact */}
              <div className="lg:col-span-6 space-y-6">
                <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight text-white leading-tight">
                  {lang === "ID" ? (
                    <>
                      Ada rencana proyek? <br />
                      <span className="text-[#fbbf24] italic font-serif">Mari bermusyawarah.</span>
                    </>
                  ) : (
                    <>
                      Have a project in mind? <br />
                      <span className="text-[#fbbf24] italic font-serif">Let&apos;s collaborate.</span>
                    </>
                  )}
                </h2>

                <p className="text-stone-400 text-sm sm:text-base leading-relaxed max-w-lg">
                  {lang === "ID"
                    ? "Terbuka untuk kolaborasi digitalisasi pesantren, arsitektur web modern, integrasi AI, maupun riset ilmiah seputar turats Islam."
                    : "Available for institutional pesantren digitalization, full-stack web applications, AI automation, or academic research."}
                </p>

                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <a
                    href="mailto:ahmadchamdan03@gmail.com"
                    className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white text-stone-950 hover:bg-[#fbbf24] font-semibold text-xs sm:text-sm transition-all duration-300 shadow-xl"
                  >
                    <Mail className="w-4 h-4 text-emerald-800" />
                    <span>ahmadchamdan03@gmail.com</span>
                  </a>

                  <button
                    type="button"
                    onClick={scrollToTop}
                    className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-stone-800/80 hover:bg-stone-700 text-stone-200 text-xs sm:text-sm font-medium border border-stone-700 hover:border-emerald-500/50 transition-all shadow-md"
                    aria-label="Kembali ke atas"
                  >
                    <span>{lang === "ID" ? "Ke Atas" : "Back to top"}</span>
                    <ArrowUp className="w-4 h-4 text-emerald-400" />
                  </button>
                </div>
              </div>

              {/* Right Column: Interactive Contact Form */}
              <div className="lg:col-span-6">
                <form
                  onSubmit={handleSubmit}
                  className="p-6 sm:p-8 rounded-2xl bg-stone-950/60 border border-stone-800 shadow-xl backdrop-blur-md space-y-4"
                >
                  {/* Honeypot field for bot suppression */}
                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    className="hidden"
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {success && (
                    <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold">
                          {lang === "ID" ? "Jazakallahu Khairan!" : "Thank You!"}
                        </div>
                        <div className="text-xs text-emerald-300/80 mt-0.5">
                          {lang === "ID"
                            ? "Pesan Anda telah berhasil disimpan. Saya akan merespons melalui email secepatnya."
                            : "Your message has been received. I will reply to your email shortly."}
                        </div>
                      </div>
                    </div>
                  )}

                  {errorMessage && (
                    <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/40 text-red-300 text-sm flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                      <div>{errorMessage}</div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                      {lang === "ID" ? "Nama Lengkap" : "Full Name"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Gus Hilmy / John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-stone-900/90 border border-stone-800 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                      {lang === "ID" ? "Alamat Email" : "Email Address"}
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="nama@domain.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-stone-900/90 border border-stone-800 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-400 mb-1.5">
                      {lang === "ID" ? "Pesan / Rencana Proyek" : "Message / Project Inquiry"}
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Tuliskan ide, kebutuhan teknis, atau pertanyaan Anda di sini..."
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-stone-900/90 border border-stone-800 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold text-sm transition-all shadow-lg shadow-emerald-950/40 border border-emerald-400/30 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Mengirim Pesan...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>{lang === "ID" ? "Kirim Pesan Sekarang" : "Send Message"}</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Social Media Link Bar */}
            <div className="mt-14 pt-8 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-6">
              <span className="text-xs font-mono uppercase tracking-widest text-stone-400">
                {lang === "ID" ? "Terhubung di Jejaring Digital:" : "Connect on Social Channels:"}
              </span>

              <div className="flex flex-wrap items-center gap-3">
                {/* GitHub */}
                <a
                  href="https://github.com/ahmadchamdan03-svg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-800/60 hover:bg-stone-800 border border-stone-700/60 hover:border-emerald-500/40 text-stone-300 hover:text-white text-xs font-medium transition-all"
                >
                  <svg className="w-4 h-4 fill-current text-emerald-400" viewBox="0 0 24 24">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    />
                  </svg>
                  <span>GitHub</span>
                </a>

                {/* LinkedIn */}
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-800/60 hover:bg-stone-800 border border-stone-700/60 hover:border-emerald-500/40 text-stone-300 hover:text-white text-xs font-medium transition-all"
                >
                  <svg className="w-4 h-4 fill-current text-emerald-400" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                  <span>LinkedIn</span>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-stone-800/60 hover:bg-stone-800 border border-stone-700/60 hover:border-emerald-500/40 text-stone-300 hover:text-white text-xs font-medium transition-all"
                >
                  <svg className="w-4 h-4 fill-current text-emerald-400" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                  <span>Instagram</span>
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
