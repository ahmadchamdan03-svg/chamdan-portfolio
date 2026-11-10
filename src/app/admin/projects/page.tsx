"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Project } from "@/types/database";
import {
  FolderGit2,
  Plus,
  Trash2,
  Edit2,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [longDescription, setLongDescription] = useState("");
  const [role, setRole] = useState("");
  const [platform, setPlatform] = useState("");
  const [domain, setDomain] = useState("");
  const [techStackInput, setTechStackInput] = useState("");
  const [featuresInput, setFeaturesInput] = useState("");
  const [impactInput, setImpactInput] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setProjects(data);
      }
    } catch (err) {
      console.error("Fetch projects error:", err);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setLongDescription("");
    setRole("");
    setPlatform("");
    setDomain("");
    setTechStackInput("");
    setFeaturesInput("");
    setImpactInput("");
    setImageUrl("");
    setFormOpen(false);
  };

  const handleEdit = (p: Project) => {
    setEditingId(p.id);
    setTitle(p.title);
    setDescription(p.description);
    setLongDescription(p.long_description || "");
    setRole(p.role || "");
    setPlatform(p.platform || "");
    setDomain(p.domain || "");
    setTechStackInput(Array.isArray(p.tech_stack) ? p.tech_stack.join(", ") : "");
    setFeaturesInput(Array.isArray(p.features) ? p.features.join("\n") : "");
    setImpactInput(Array.isArray(p.impact) ? p.impact.join("\n") : "");
    setImageUrl(p.image_url || "");
    setFormOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("portfolio-assets")
        .upload(filePath, file);

      if (uploadError) {
        // If storage bucket doesn't exist, we fall back to a data preview or notice
        console.warn("Storage upload failed, bucket might need creation:", uploadError);
      }

      const { data: publicData } = supabase.storage
        .from("portfolio-assets")
        .getPublicUrl(filePath);

      if (publicData?.publicUrl) {
        setImageUrl(publicData.publicUrl);
        setStatusMsg({ type: "success", text: "Gambar berhasil diunggah ke storage." });
      }
    } catch (err) {
      console.error("Upload error:", err);
      setStatusMsg({ type: "error", text: "Gagal mengunggah file gambar." });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    const techStackArray = techStackInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const featuresArray = featuresInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const impactArray = impactInput
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title,
      description,
      long_description: longDescription || null,
      role: role || null,
      platform: platform || null,
      domain: domain || null,
      tech_stack: techStackArray,
      features: featuresArray,
      impact: impactArray,
      image_url: imageUrl || null,
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from("projects")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        setStatusMsg({ type: "success", text: "Proyek berhasil diperbarui." });
      } else {
        const { error } = await supabase.from("projects").insert([payload]);
        if (error) throw error;
        setStatusMsg({ type: "success", text: "Proyek baru berhasil ditambahkan." });
      }
      resetForm();
      fetchProjects();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan data.";
      setStatusMsg({ type: "error", text: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus proyek ini?")) return;
    try {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
      fetchProjects();
      setStatusMsg({ type: "success", text: "Proyek telah dihapus." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus proyek.";
      setStatusMsg({ type: "error", text: msg });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-2.5">
            <FolderGit2 className="w-7 h-7 text-emerald-400" />
            <span>Manajemen Portofolio Proyek</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Tambah, sunting, atau hapus studi kasus sistem digital dan portofolio Anda.
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
          <span>Tambah Proyek Baru</span>
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

      {/* Modal / Form Drawer */}
      {formOpen && (
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-stone-800 shadow-2xl">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-stone-800">
            <h2 className="text-lg font-serif font-bold text-white">
              {editingId ? "Sunting Proyek" : "Tambah Proyek Baru"}
            </h2>
            <button
              onClick={resetForm}
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Judul Proyek *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Nama Sistem / Aplikasi"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Domain / Kategori
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Tata Kelola Pesantren & Event"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Peran / Posisi
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Lead Architect & Developer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Platform / Tipe
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Web App & QR Scanner"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Deskripsi Singkat *
              </label>
              <textarea
                required
                rows={2}
                placeholder="Ringkasan proyek untuk kartu beranda..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Deskripsi Lengkap / Latar Belakang (Halaman Detail)
              </label>
              <textarea
                rows={3}
                placeholder="Penjelasan mendalam mengenai tantangan teknis dan arsitektur..."
                value={longDescription}
                onChange={(e) => setLongDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Fitur Utama (Pisahkan per baris)
                </label>
                <textarea
                  rows={3}
                  placeholder="Scanner QR Realtime&#10;Supabase RLS&#10;Offline Sync"
                  value={featuresInput}
                  onChange={(e) => setFeaturesInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Dampak Nyata / Metrik (Pisahkan per baris)
                </label>
                <textarea
                  rows={3}
                  placeholder="Melayani 3.500+ wali santri&#10;0 data conflict"
                  value={impactInput}
                  onChange={(e) => setImpactInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 resize-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Tech Stack (Pisahkan dengan koma)
              </label>
              <input
                type="text"
                placeholder="Next.js 16, Supabase, Tailwind, TypeScript"
                value={techStackInput}
                onChange={(e) => setTechStackInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                Foto / Tangkapan Layar Proyek
              </label>
              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <input
                  type="text"
                  placeholder="URL Gambar atau pilih file..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="flex-grow px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                />
                <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs text-stone-200 cursor-pointer border border-stone-700 shrink-0">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploadingImage ? "Mengunggah..." : "Unggah File"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploadingImage}
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
                <span>{editingId ? "Perbarui Proyek" : "Simpan Proyek"}</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects Table */}
      <div className="rounded-3xl bg-stone-900 border border-stone-800 overflow-hidden">
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <h2 className="font-serif font-bold text-white text-base">
            Daftar Proyek Terdaftar ({projects.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-16 rounded-xl" />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <div className="p-10 text-center text-sm text-stone-500">
            Belum ada proyek yang terdaftar.
          </div>
        ) : (
          <div className="divide-y divide-stone-800/80">
            {projects.map((p) => (
              <div
                key={p.id}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-stone-800/40 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-0">
                  {p.image_url ? (
                    <div className="relative w-16 h-12 rounded-lg overflow-hidden shrink-0 bg-stone-800 border border-stone-700">
                      <Image
                        src={p.image_url}
                        alt={p.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-12 rounded-lg bg-stone-800 border border-stone-700 flex items-center justify-center text-[10px] text-stone-500 shrink-0">
                      No Img
                    </div>
                  )}

                  <div className="min-w-0">
                    <h3 className="font-serif font-bold text-sm text-white truncate">
                      {p.title}
                    </h3>
                    <p className="text-xs text-stone-400 truncate max-w-md">
                      {p.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      {p.domain && (
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/20">
                          {p.domain}
                        </span>
                      )}
                      <span className="text-[10px] text-stone-500 font-mono">
                        {p.platform}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleEdit(p)}
                    className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors"
                    title="Sunting"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
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
