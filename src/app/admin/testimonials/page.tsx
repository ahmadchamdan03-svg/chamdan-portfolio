"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Testimonial } from "@/types/database";
import {
  MessageSquareQuote,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Upload,
} from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [organization, setOrganization] = useState("");
  const [quote, setQuote] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  async function fetchTestimonials() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("testimonials")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setTestimonials(data);
      }
    } catch (err) {
      console.error("Testimonial fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setRole("");
    setOrganization("");
    setQuote("");
    setAvatarUrl("");
    setFormOpen(false);
  };

  const handleEdit = (t: Testimonial) => {
    setEditingId(t.id);
    setName(t.name);
    setRole(t.role);
    setOrganization(t.organization);
    setQuote(t.quote);
    setAvatarUrl(t.avatar_url || "");
    setFormOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      await supabase.storage.from("portfolio-assets").upload(filePath, file);

      const { data: publicData } = supabase.storage
        .from("portfolio-assets")
        .getPublicUrl(filePath);

      if (publicData?.publicUrl) {
        setAvatarUrl(publicData.publicUrl);
        setStatusMsg({ type: "success", text: "Foto avatar berhasil diunggah." });
      }
    } catch (err) {
      console.error("Avatar upload error:", err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    const payload = {
      name,
      role,
      organization,
      quote,
      avatar_url: avatarUrl || null,
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from("testimonials")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        setStatusMsg({ type: "success", text: "Testimoni berhasil diperbarui." });
      } else {
        const { error } = await supabase.from("testimonials").insert([payload]);
        if (error) throw error;
        setStatusMsg({ type: "success", text: "Testimoni berhasil ditambahkan." });
      }
      resetForm();
      fetchTestimonials();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan testimoni.";
      setStatusMsg({ type: "error", text: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus testimoni ini?")) return;
    try {
      const { error } = await supabase.from("testimonials").delete().eq("id", id);
      if (error) throw error;
      fetchTestimonials();
      setStatusMsg({ type: "success", text: "Testimoni berhasil dihapus." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus testimoni.";
      setStatusMsg({ type: "error", text: msg });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-2.5">
            <MessageSquareQuote className="w-7 h-7 text-emerald-400" />
            <span>Manajemen Testimoni &amp; Apresiasi</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Kelola kutipan apresiasi dan rekomendasi dari para guru, pengasuh, dan kolega.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setFormOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Testimoni</span>
        </button>
      </div>

      {statusMsg && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs ${
            statusMsg.type === "success"
              ? "bg-emerald-950/80 border border-emerald-500/40 text-emerald-300"
              : "bg-red-950/80 border border-red-500/40 text-red-300"
          }`}
        >
          {statusMsg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Form Drawer */}
      {formOpen && (
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-800">
            <h2 className="text-lg font-serif font-bold text-white">
              {editingId ? "Sunting Testimoni" : "Tambah Testimoni Baru"}
            </h2>
            <button
              onClick={resetForm}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Nama Tokoh / Guru *
                </label>
                <input
                  type="text"
                  required
                  placeholder="KH. Abdul Qodir"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Peran / Jabatan *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Dewan Pengasuh & Pimpinan Majelis"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Institusi / Organisasi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Pondok Pesantren Lirboyo"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Isi Kutipan / Apresiasi *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Tuliskan testimoni asli..."
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Foto Avatar
              </label>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <input
                  type="text"
                  placeholder="URL Avatar..."
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="flex-grow px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                />
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs text-stone-200 cursor-pointer border border-stone-700 shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? "Mengunggah..." : "Unggah Avatar"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-stone-800">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 rounded-xl text-xs text-stone-400 hover:text-white"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{editingId ? "Perbarui Testimoni" : "Simpan Testimoni"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Testimonials List */}
      <div className="rounded-3xl bg-stone-900 border border-stone-800 overflow-hidden">
        <div className="p-6 border-b border-stone-800">
          <h2 className="font-serif font-bold text-white text-base">
            Daftar Testimoni ({testimonials.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-16 rounded-xl" />
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <div className="p-10 text-center text-sm text-stone-500">
            Belum ada data testimoni.
          </div>
        ) : (
          <div className="divide-y divide-stone-800/80">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-stone-800/40 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 bg-stone-800 border border-stone-700">
                    <Image
                      src={t.avatar_url || "/images/hero/jacket.png"}
                      alt={`Foto profil: ${t.name}`}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-serif font-bold text-sm text-white truncate">
                      {t.name}
                    </h3>
                    <p className="text-xs text-emerald-400 font-medium">
                      {t.role} &bull; {t.organization}
                    </p>
                    <p className="text-xs text-stone-400 italic line-clamp-2 mt-1">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleEdit(t)}
                    aria-label={`Sunting testimoni dari ${t.name}`}
                    className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                    title="Sunting"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(t.id)}
                    aria-label={`Hapus testimoni dari ${t.name}`}
                    className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 transition-colors"
                    title="Hapus"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
