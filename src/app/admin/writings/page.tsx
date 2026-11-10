"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Writing } from "@/types/database";
import {
  BookOpen,
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

export default function AdminWritingsPage() {
  const [writings, setWritings] = useState<Writing[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("2026");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");

  useEffect(() => {
    fetchWritings();
  }, []);

  async function fetchWritings() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("writings")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setWritings(data);
      }
    } catch (err) {
      console.error("Fetch writings error:", err);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setSlug("");
    setCategory("");
    setDate("2026");
    setDescription("");
    setContent("");
    setLink("");
    setFormOpen(false);
  };

  const handleEdit = (w: Writing) => {
    setEditingId(w.id);
    setTitle(w.title);
    setSlug(w.slug || "");
    setCategory(w.category);
    setDate(w.date);
    setDescription(w.description);
    setContent(w.content || "");
    setLink(w.link || "");
    setFormOpen(true);
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingId) {
      setSlug(generateSlug(val));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    const payload = {
      title,
      slug: slug || generateSlug(title),
      category,
      date,
      description,
      content,
      link: link || null,
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from("writings")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        setStatusMsg({ type: "success", text: "Risalah berhasil diperbarui." });
      } else {
        const { error } = await supabase.from("writings").insert([payload]);
        if (error) throw error;
        setStatusMsg({ type: "success", text: "Risalah baru berhasil ditambahkan." });
      }
      resetForm();
      fetchWritings();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan risalah.";
      setStatusMsg({ type: "error", text: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus risalah karya tulis ini?")) return;
    try {
      const { error } = await supabase.from("writings").delete().eq("id", id);
      if (error) throw error;
      fetchWritings();
      setStatusMsg({ type: "success", text: "Risalah berhasil dihapus." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus risalah.";
      setStatusMsg({ type: "error", text: msg });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-2.5">
            <BookOpen className="w-7 h-7 text-amber-400" />
            <span>Karya Tulis &amp; Risalah Digital</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Kelola publikasi naskah fikih, pemikiran ilmiah, dan kajian turats kontemporer.
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
          <span>Tulis Risalah Baru</span>
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
              {editingId ? "Sunting Risalah" : "Tambah Risalah Baru"}
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
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Judul Risalah *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Judul karya tulis ilmiah..."
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Slug URL *
                </label>
                <input
                  type="text"
                  required
                  placeholder="slug-artikel"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Kategori *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Risalah Fikih, Opini Ilmiah"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Tahun / Tanggal *
                </label>
                <input
                  type="text"
                  required
                  placeholder="2026"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Link Dokumen PDF (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="URL link PDF eksternal..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Deskripsi Singkat (Abstrak) *
              </label>
              <textarea
                required
                rows={2}
                placeholder="Ringkasan isi pembahasan..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Isi Naskah / Konten Markdown
              </label>
              <textarea
                rows={8}
                placeholder="# Bab 1: Pendahuluan&#10;&#10;Tuliskan isi artikel dalam format Markdown lengkap dengan kutipan referensi turats..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 font-mono resize-y"
              />
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
                <span>{editingId ? "Perbarui Risalah" : "Simpan Risalah"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Writings Table */}
      <div className="rounded-3xl bg-stone-900 border border-stone-800 overflow-hidden">
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <h2 className="font-serif font-bold text-white text-base">
            Daftar Risalah Ilmiah ({writings.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-16 rounded-xl" />
            ))}
          </div>
        ) : writings.length === 0 ? (
          <div className="p-10 text-center text-sm text-stone-500">
            Belum ada karya tulis yang terdaftar.
          </div>
        ) : (
          <div className="divide-y divide-stone-800/80">
            {writings.map((w) => (
              <div
                key={w.id}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-stone-800/40 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/20 font-semibold">
                      {w.category}
                    </span>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {w.date}
                    </span>
                    {w.slug && (
                      <span className="text-[10px] text-stone-500 font-mono">
                        /writings/{w.slug}
                      </span>
                    )}
                  </div>
                  <h3 className="font-serif font-bold text-sm text-white truncate">
                    {w.title}
                  </h3>
                  <p className="text-xs text-stone-400 truncate max-w-xl">
                    {w.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {w.slug && (
                    <a
                      href={`/writings/${w.slug}`}
                      target="_blank"
                      className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                      title="Lihat di Web"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    onClick={() => handleEdit(w)}
                    className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                    title="Sunting"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(w.id)}
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
