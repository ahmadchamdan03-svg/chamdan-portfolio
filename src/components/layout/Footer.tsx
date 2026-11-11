"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { SocialLink, SiteConfig } from "@/types/database";
import PaymentModal from "@/components/ui/PaymentModal";
import SocialIcon from "@/components/ui/SocialIcon";
import {
  Mail,
  ArrowRight,
  ShieldCheck,
  Building2,
  ExternalLink,
  Loader2,
  Share2,
} from "lucide-react";

interface FooterProps {
  lang?: "ID" | "EN" | "AR";
}

export default function Footer({ lang = "ID" }: FooterProps) {
  // Payment Modal State for Newsletter
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  // Dynamic Data from Supabase
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    id: "default",
    logo_url: "/images/logo.png",
    affiliation_arabic: "ذوو العلى",
    affiliation_text: "Lirboyo",
    full_name: "Ahmad Chamdan Yuwafin (Chamdan)",
    address: "Pondok Pesantren Lirboyo, Kota Kediri, Jawa Timur, Indonesia.",
    email: "ahmadchamdan03@gmail.com",
    phone: "085899151685",
  });

  useEffect(() => {
    async function loadFooterData() {
      try {
        // Fetch social links
        const { data: socialData } = await supabase
          .from("social_links")
          .select("*")
          .order("sort_order", { ascending: true });

        if (socialData && socialData.length > 0) {
          setSocialLinks(socialData);
        }

        // Fetch site config
        const { data: configData } = await supabase
          .from("site_config")
          .select("*")
          .limit(1)
          .single();

        if (configData) {
          setSiteConfig(configData);
        }
      } catch (err) {
        console.error("Footer data fetch error:", err);
      }
    }

    loadFooterData();
  }, []);

  const handleOpenNewsletterPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setPaymentModalOpen(true);
  };

  const getDynamicIcon = (iconName: string) => {
    return <SocialIcon name={iconName} className="w-5 h-5" />;
  };

  const cleanPhone = siteConfig.phone?.replace(/[^0-9]/g, "") || "6285899151685";
  const waPhone = cleanPhone.startsWith("0")
    ? "62" + cleanPhone.slice(1)
    : cleanPhone;

  return (
    <footer className="relative w-full bg-[#080d0b] text-[#f5f5f4] pt-16 pb-8 px-4 sm:px-8 border-t border-stone-800/80 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Newsletter Subscription Strip (Paid Subscription Rp 300.000/Bulan) */}
        <div className="mb-14 p-6 sm:p-8 rounded-3xl bg-stone-900/60 border border-emerald-900/30 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div className="max-w-md">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
              <Mail className="w-3.5 h-3.5" />
              <span>{lang === "ID" ? "Buletin Ilmiah & Riset Digital" : "Scientific Newsletter"}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
              {lang === "ID" ? "Berlangganan (Rp 300.000/Bulan)" : "Subscribe (IDR 300,000/Month)"}
            </h3>
            <p className="text-xs text-stone-400 mt-1">
              {lang === "ID"
                ? "Dapatkan risalah ilmiah eksklusif, analisis kode, dan konsultasi tertutup langsung ke inbox email Anda setiap pekan."
                : "Exclusive scholarly treatises, code analysis, and closed consultations delivered weekly to your inbox."}
            </p>
          </div>

          <form
            onSubmit={handleOpenNewsletterPayment}
            className="w-full md:w-auto flex flex-col sm:flex-row gap-2.5"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              {lang === "ID" ? "Alamat Email Berlangganan" : "Subscription Email Address"}
            </label>
            <input
              id="newsletter-email"
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="nama@domain.com"
              className="px-4 py-2.5 rounded-full bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500 w-full sm:w-64"
            />
            <button
              type="submit"
              aria-label={lang === "ID" ? "Kirim pendaftaran buletin" : "Subscribe to newsletter"}
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-all shadow-md cursor-pointer shrink-0"
            >
              <span>{lang === "ID" ? "Langganan" : "Subscribe"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* 2-Column Grid: Social Channels & Organization Details (Navigation Block Removed per Fase 117) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-16 border-b border-stone-800/80 text-sm">
          {/* Column 1: Akun Digital & Jejaring Sosial (Dynamic from Supabase) */}
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-6 font-mono">
              <Share2 className="w-3.5 h-3.5" />
              <span>{lang === "ID" ? "01 / Jejaring Sosial" : "01 / Digital Channels"}</span>
            </div>

            {socialLinks.length === 0 ? (
              <div className="flex items-center gap-2 text-xs text-stone-500 py-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Memuat kanal media sosial...</span>
              </div>
            ) : (
              <ul className="space-y-3.5">
                {socialLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.platform}
                      className="inline-flex items-center gap-3.5 group text-stone-300 hover:text-emerald-400 transition-colors"
                    >
                      <span className="w-10 h-10 rounded-full bg-zinc-900 border border-zinc-800 group-hover:border-emerald-500 group-hover:bg-zinc-800 flex items-center justify-center text-emerald-400 transition-all shadow-sm shrink-0">
                        {getDynamicIcon(link.icon)}
                      </span>
                      <span className="font-medium text-sm text-stone-300 group-hover:text-emerald-300 transition-colors">
                        {link.platform}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Column 2: Afiliasi & Domisili (Dynamic from Supabase site_config) */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-emerald-500/40 bg-stone-900 shadow-md shrink-0">
                <Image
                  src={siteConfig.logo_url || "/images/logo.png"}
                  width={48}
                  height={48}
                  alt={siteConfig.full_name || "Logo Chamdan"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="font-semibold text-xs tracking-wider uppercase text-emerald-400 font-mono">
                  {lang === "ID" ? "02 / Afiliasi & Domisili" : "02 / Contact & Location"}
                </h4>
                <span className="text-xs font-serif text-stone-400">
                  {siteConfig.affiliation_arabic || "ذوو العلى"} &bull; {siteConfig.affiliation_text || "Lirboyo"}
                </span>
              </div>
            </div>

            <div className="space-y-3 text-stone-300">
              <p className="font-medium text-white text-base">
                {siteConfig.full_name || "Ahmad Chamdan Yuwafin (Chamdan)"}
              </p>
              <p className="text-sm leading-relaxed text-stone-400 max-w-md">
                {siteConfig.address || "Pondok Pesantren Lirboyo, Kota Kediri, Jawa Timur, Indonesia."}
              </p>

              <div className="pt-2 space-y-1.5 text-xs font-mono">
                <p className="text-emerald-300">
                  <span className="text-stone-500 uppercase mr-2">Email:</span>
                  <a
                    href={`mailto:${siteConfig.email || "ahmadchamdan03@gmail.com"}`}
                    className="hover:underline hover:text-emerald-200"
                  >
                    {siteConfig.email || "ahmadchamdan03@gmail.com"}
                  </a>
                </p>
                <p className="text-emerald-300">
                  <span className="text-stone-500 uppercase mr-2">WhatsApp:</span>
                  <a
                    href={`https://wa.me/${waPhone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline hover:text-emerald-200"
                  >
                    {siteConfig.phone || "085899151685"}
                  </a>
                </p>
              </div>

              <div className="pt-4">
                <a
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-300 transition-colors font-mono"
                >
                  <span>Portal Admin</span>
                  <span>&rarr;</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal Links (Live Presence Badge Removed per Fase 121) */}
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
              <span>&bull;</span>
              <a href="/tools/faraidh" className="hover:text-emerald-400 transition-colors">
                {lang === "ID" ? "Kalkulator Faraidh & Zakat" : "Faraidh Calculator"}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 font-mono text-stone-500">
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

      {/* Dynamic Payment Modal for Newsletter */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        itemName="Langganan Bulanan Buletin Ilmiah"
        itemPrice="Rp 300.000"
      />
    </footer>
  );
}
