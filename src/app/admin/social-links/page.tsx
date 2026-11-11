"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { SocialLink } from "@/types/database";
import {
  Share2,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  ExternalLink,
} from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";
import SocialIcon from "@/components/ui/SocialIcon";

const AVAILABLE_ICONS = [
  { value: "Github", label: "GitHub" },
  { value: "Linkedin", label: "LinkedIn" },
  { value: "Instagram", label: "Instagram" },
  { value: "Twitter", label: "Twitter / X" },
  { value: "Youtube", label: "YouTube" },
  { value: "Facebook", label: "Facebook" },
  { value: "Globe", label: "Website / Web" },
  { value: "Mail", label: "Email" },
  { value: "Link", label: "Tautan Umum" },
];

export default function AdminSocialLinksPage() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [platform, setPlatform] = useState("");
  const [url, setUrl] = useState("");
  const [icon, setIcon] = useState("Link");
  const [sortOrder, setSortOrder] = useState<number>(1);

  useEffect(() => {
    fetchSocialLinks();
  }, []);

  async function fetchSocialLinks() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("social_links")
        .select("*")
        .order("sort_order", { ascending: true });
      if (!error && data) {
        setSocialLinks(data);
      }
    } catch (err) {
      console.error("Social links fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setEditingId(null);
    setPlatform("");
    setUrl("");
    setIcon("Link");
    setSortOrder(socialLinks.length + 1);
    setFormOpen(false);
  };

  const handleEdit = (item: SocialLink) => {
    setEditingId(item.id);
    setPlatform(item.platform);
    setUrl(item.url);
    setIcon(item.icon);
    setSortOrder(item.sort_order ?? 1);
    setFormOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus tautan sosial "${name}"?`)) return;

    try {
      const { error } = await supabase.from("social_links").delete().eq("id", id);
      if (error) throw error;

      setStatusMsg({
        type: "success",
        text: `Tautan "${name}" berhasil dihapus.`,
      });
      fetchSocialLinks();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus tautan";
      setStatusMsg({ type: "error", text: msg });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!platform.trim() || !url.trim()) {
      setStatusMsg({
        type: "error",
        text: "Nama platform dan URL tautan wajib diisi.",
      });
      return;
    }

    setSaving(true);
    setStatusMsg(null);

    const payload = {
      platform: platform.trim(),
      url: url.trim(),
      icon: icon.trim() || "Link",
      sort_order: Number(sortOrder) || 1,
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from("social_links")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        setStatusMsg({
          type: "success",
          text: "Tautan sosial berhasil diperbarui.",
        });
      } else {
        const { error } = await supabase.from("social_links").insert([payload]);
        if (error) throw error;
        setStatusMsg({
          type: "success",
          text: "Tautan sosial baru berhasil ditambahkan.",
        });
      }

      resetForm();
      fetchSocialLinks();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan tautan";
      setStatusMsg({ type: "error", text: msg });
    } finally {
      setSaving(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    return <SocialIcon name={iconName} className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono mb-1">
            <Share2 className="w-4 h-4" />
            <span>Manajemen Kanal Publik</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Akun Digital & Jejaring Sosial
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Atur tautan media sosial dan kanal digital yang tampil pada bagian Footer.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setFormOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-md cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Akun Digital</span>
        </button>
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
          <button
            onClick={() => setStatusMsg(null)}
            className="text-stone-400 hover:text-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Content Table */}
      <div className="rounded-2xl border border-stone-800 bg-stone-900/40 backdrop-blur-md overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full bg-stone-800/60 rounded-xl" />
            ))}
          </div>
        ) : socialLinks.length === 0 ? (
          <div className="p-12 text-center text-stone-400 space-y-2">
            <Share2 className="w-10 h-10 mx-auto text-stone-600 mb-2" />
            <p className="text-sm font-medium text-stone-300">
              Tidak ada tautan sosial ditemukan.
            </p>
            <p className="text-xs text-stone-500">
              Klik &quot;Tambah Akun Digital&quot; untuk menambahkan akun media sosial Anda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-stone-300">
              <thead className="bg-stone-900/80 text-stone-400 font-mono uppercase text-[11px] tracking-wider border-b border-stone-800">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Urutan</th>
                  <th className="py-3.5 px-4">Platform & Ikon</th>
                  <th className="py-3.5 px-4">URL / Tautan</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {socialLinks.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-stone-800/40 transition-colors"
                  >
                    <td className="py-4 px-4 sm:px-6 font-mono text-emerald-400 font-semibold w-16">
                      #{item.sort_order}
                    </td>
                    <td className="py-4 px-4 font-medium text-white">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center text-emerald-400 shrink-0">
                          {getIconComponent(item.icon)}
                        </div>
                        <div>
                          <span className="font-semibold">{item.platform}</span>
                          <span className="text-[11px] text-stone-500 font-mono block">
                            Ikon: {item.icon}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono text-stone-400 max-w-xs truncate">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
                      >
                        <span className="truncate">{item.url}</span>
                        <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                      </a>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit"
                          aria-label={`Edit ${item.platform}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.platform)}
                          className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 transition-colors cursor-pointer"
                          title="Hapus"
                          aria-label={`Hapus ${item.platform}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form: Tambah / Edit */}
      {formOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="relative w-full max-w-md rounded-2xl bg-stone-900 border border-stone-800 p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <h2 className="text-lg sm:text-xl font-serif font-bold text-white">
                {editingId ? "Edit Akun Digital" : "Tambah Akun Digital"}
              </h2>
              <button
                onClick={resetForm}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Platform / Nama Media Sosial <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  placeholder="Contoh: GitHub, LinkedIn, Instagram, X"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  URL / Tautan Profil <span className="text-red-400">*</span>
                </label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://github.com/username"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Ikon Lucide
                  </label>
                  <select
                    value={icon}
                    onChange={(e) => setIcon(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    {AVAILABLE_ICONS.map((ic) => (
                      <option key={ic.value} value={ic.value}>
                        {ic.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Nomor Urut Tampil
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={sortOrder}
                    onChange={(e) => setSortOrder(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-300 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-md cursor-pointer disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <span>Simpan Akun</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
