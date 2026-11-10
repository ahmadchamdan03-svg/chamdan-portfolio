"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { GalleryItem } from "@/types/database";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  async function fetchGallery() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setItems(data);
      }
    } catch (err) {
      console.error("Gallery fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `gallery/${fileName}`;

      await supabase.storage.from("portfolio-assets").upload(filePath, file);

      const { data: publicData } = supabase.storage
        .from("portfolio-assets")
        .getPublicUrl(filePath);

      if (publicData?.publicUrl) {
        setImageUrl(publicData.publicUrl);
        setStatusMsg({ type: "success", text: "Gambar berhasil diunggah." });
      }
    } catch (err) {
      console.error("Upload error:", err);
      setStatusMsg({ type: "error", text: "Gagal mengunggah file." });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !imageUrl) return;

    setSaving(true);
    try {
      const { error } = await supabase.from("gallery").insert([
        {
          title,
          image_url: imageUrl,
        },
      ]);
      if (error) throw error;

      setStatusMsg({ type: "success", text: "Foto galeri 3D berhasil ditambahkan." });
      setTitle("");
      setImageUrl("");
      setFormOpen(false);
      fetchGallery();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan foto.";
      setStatusMsg({ type: "error", text: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus foto ini dari galeri 3D?")) return;
    try {
      const { error } = await supabase.from("gallery").delete().eq("id", id);
      if (error) throw error;
      fetchGallery();
      setStatusMsg({ type: "success", text: "Foto berhasil dihapus." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus foto.";
      setStatusMsg({ type: "error", text: msg });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-2.5">
            <ImageIcon className="w-7 h-7 text-sky-400" />
            <span>Galeri 3D Interaktif</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Kelola foto-foto yang berputar pada silinder 3D di halaman utama portofolio.
          </p>
        </div>

        <button
          onClick={() => setFormOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Foto Baru</span>
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
              Tambah Foto ke Galeri 3D
            </h2>
            <button
              onClick={() => setFormOpen(false)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Keterangan / Judul Foto *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Majelis Pembacaan Kitab Ihya' Ulumiddin"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                File Gambar / URL *
              </label>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <input
                  type="text"
                  required
                  placeholder="URL gambar atau unggah file..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-grow px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                />
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs text-stone-200 cursor-pointer border border-stone-700 shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? "Mengunggah..." : "Unggah File"}</span>
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
                onClick={() => setFormOpen(false)}
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
                <span>Simpan Foto</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 p-4">
              <Skeleton className="w-full aspect-[4/3] rounded-xl mb-3" />
              <Skeleton className="w-3/4 h-4" />
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="col-span-full p-10 text-center text-sm text-stone-500">
            Belum ada foto dalam galeri 3D.
          </div>
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="group relative rounded-2xl overflow-hidden bg-stone-900 border border-stone-800 shadow-md hover:border-emerald-500/40 transition-all"
            >
              <div className="relative w-full aspect-[4/3] bg-stone-950">
                <Image
                  src={item.image_url}
                  alt={`Preview foto galeri: ${item.title}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 100vw, 33vw"
                />
              </div>

              <div className="p-4 flex items-center justify-between gap-3">
                <h3 className="text-xs font-semibold text-white line-clamp-1">
                  {item.title}
                </h3>
                <button
                  onClick={() => handleDelete(item.id)}
                  aria-label={`Hapus foto ${item.title}`}
                  className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 transition-colors shrink-0"
                  title="Hapus"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
