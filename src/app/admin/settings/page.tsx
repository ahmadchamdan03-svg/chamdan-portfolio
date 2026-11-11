"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { SiteConfig } from "@/types/database";
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Building2,
  Mail,
  Phone,
  MapPin,
  Image as ImageIcon,
} from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form Fields
  const [configId, setConfigId] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState("/images/logo.png");
  const [affiliationArabic, setAffiliationArabic] = useState("ذوو العلى");
  const [affiliationText, setAffiliationText] = useState("Lirboyo");
  const [fullName, setFullName] = useState("Ahmad Chamdan Yuwafin (Chamdan)");
  const [address, setAddress] = useState(
    "Pondok Pesantren Lirboyo, Kota Kediri, Jawa Timur, Indonesia."
  );
  const [email, setEmail] = useState("ahmadchamdan03@gmail.com");
  const [phone, setPhone] = useState("085899151685");

  useEffect(() => {
    fetchSiteConfig();
  }, []);

  async function fetchSiteConfig() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("site_config")
        .select("*")
        .limit(1)
        .single();

      if (data) {
        setConfigId(data.id);
        if (data.logo_url) setLogoUrl(data.logo_url);
        if (data.affiliation_arabic) setAffiliationArabic(data.affiliation_arabic);
        if (data.affiliation_text) setAffiliationText(data.affiliation_text);
        if (data.full_name) setFullName(data.full_name);
        if (data.address) setAddress(data.address);
        if (data.email) setEmail(data.email);
        if (data.phone) setPhone(data.phone);
      }
    } catch (err) {
      console.error("Site config fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    const payload = {
      logo_url: logoUrl.trim() || "/images/logo.png",
      affiliation_arabic: affiliationArabic.trim(),
      affiliation_text: affiliationText.trim(),
      full_name: fullName.trim(),
      address: address.trim(),
      email: email.trim(),
      phone: phone.trim(),
    };

    try {
      if (configId) {
        const { error } = await supabase
          .from("site_config")
          .update(payload)
          .eq("id", configId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("site_config").insert([payload]);
        if (error) throw error;
      }

      setStatusMsg({
        type: "success",
        text: "Pengaturan situs dan footer berhasil disimpan ke Supabase.",
      });
      fetchSiteConfig();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan pengaturan";
      setStatusMsg({ type: "error", text: msg });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono mb-1">
            <Settings className="w-4 h-4" />
            <span>Konfigurasi Entitas & Identitas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Pengaturan Situs
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Kelola profil afiliansi, domisili pesantren, kontak, dan logo yang tampil di Footer.
          </p>
        </div>
      </div>

      {/* Status Alert */}
      {statusMsg && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between text-xs sm:text-sm ${
            statusMsg.type === "success"
              ? "bg-emerald-950/70 border border-emerald-500/40 text-emerald-300"
              : "bg-red-950/70 border border-red-500/40 text-red-300"
          }`}
        >
          <div className="flex items-center gap-2.5">
            {statusMsg.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            )}
            <span>{statusMsg.text}</span>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-4 p-8 rounded-2xl border border-stone-800 bg-stone-900/40">
          <Skeleton className="h-10 w-full bg-stone-800 rounded-xl" />
          <Skeleton className="h-10 w-full bg-stone-800 rounded-xl" />
          <Skeleton className="h-24 w-full bg-stone-800 rounded-xl" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo & Identity Preview Card */}
          <div className="p-6 rounded-2xl border border-stone-800 bg-stone-900/40 backdrop-blur-md space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-300 font-mono flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              <span>Logo & Simbol Resmi</span>
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="relative w-16 h-16 rounded-full bg-stone-950 border border-emerald-500/40 overflow-hidden shrink-0 flex items-center justify-center shadow-lg">
                <Image
                  src={logoUrl || "/images/logo.png"}
                  alt="Logo Preview"
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1 w-full">
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  URL Logo / Gambar Profil
                </label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="/images/logo.png atau URL Supabase Storage"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Afiliasi Pesantren Card */}
          <div className="p-6 rounded-2xl border border-stone-800 bg-stone-900/40 backdrop-blur-md space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-300 font-mono flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Afiliasi Kelembagaan</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Afiliasi Arab (Khazanah)
                </label>
                <input
                  type="text"
                  dir="rtl"
                  value={affiliationArabic}
                  onChange={(e) => setAffiliationArabic(e.target.value)}
                  placeholder="ذوو العلى"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-sm sm:text-base text-white focus:outline-none focus:border-emerald-500 font-serif"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Afiliasi Latin (Institusi)
                </label>
                <input
                  type="text"
                  value={affiliationText}
                  onChange={(e) => setAffiliationText(e.target.value)}
                  placeholder="Lirboyo"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Nama Lengkap & Panggilan
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ahmad Chamdan Yuwafin (Chamdan)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Domisili & Kontak Card */}
          <div className="p-6 rounded-2xl border border-stone-800 bg-stone-900/40 backdrop-blur-md space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-300 font-mono flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Domisili & Saluran Kontak</span>
            </h2>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1.5">
                Alamat Domisili Lengkap
              </label>
              <textarea
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Pondok Pesantren Lirboyo, Kota Kediri, Jawa Timur, Indonesia."
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-stone-400" />
                  <span>Email Resmi</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ahmadchamdan03@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-stone-400" />
                  <span>WhatsApp / Telepon</span>
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="085899151685"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-lg shadow-emerald-950/40 cursor-pointer disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Menyimpan Pengaturan...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
