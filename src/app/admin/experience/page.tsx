"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Experience } from "@/types/database";
import {
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
} from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [organization, setOrganization] = useState("");
  const [period, setPeriod] = useState("");
  const [sortOrder, setSortOrder] = useState<number>(1);

  useEffect(() => {
    fetchExperiences();
  }, []);

  async function fetchExperiences() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("experience")
        .select("*")
        .order("sort_order", { ascending: true });
      if (!error && data) {
        setExperiences(data);
      }
    } catch (err) {
      console.error("Experience fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setEditingId(null);
    setOrganization("");
    setPeriod("");
    setSortOrder(experiences.length + 1);
    setFormOpen(false);
  };

  const handleEdit = (item: Experience) => {
    setEditingId(item.id);
    setOrganization(item.organization);
    setPeriod(item.period);
    setSortOrder(item.sort_order ?? 1);
    setFormOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    const payload = {
      organization: organization.trim(),
      period: period.trim(),
      sort_order: Number(sortOrder) || 1,
      roles: [] as string[],
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from("experience")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        setStatusMsg({
          type: "success",
          text: "Pengalaman berhasil diperbarui.",
        });
      } else {
        const { error } = await supabase.from("experience").insert([payload]);
        if (error) throw error;
        setStatusMsg({
          type: "success",
          text: "Pengalaman baru berhasil ditambahkan.",
        });
      }
      resetForm();
      fetchExperiences();
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menyimpan pengalaman.";
      setStatusMsg({ type: "error", text: msg });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus pengalaman di "${name}"?`)) return;
    try {
      const { error } = await supabase
        .from("experience")
        .delete()
        .eq("id", id);
      if (error) throw error;
      fetchExperiences();
      setStatusMsg({ type: "success", text: "Pengalaman berhasil dihapus." });
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Gagal menghapus pengalaman.";
      setStatusMsg({ type: "error", text: msg });
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/30 text-emerald-400">
              <Briefcase className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Pengalaman & Pengabdian
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Kelola daftar institusi, lembaga, dan periode pengabdian kepesantrenan.
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setFormOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-emerald-950/40 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Pengalaman</span>
        </button>
      </div>

      {/* Alerts */}
      {statusMsg && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-xs sm:text-sm ${
            statusMsg.type === "success"
              ? "bg-emerald-950/60 border border-emerald-500/40 text-emerald-200"
              : "bg-red-950/60 border border-red-500/40 text-red-200"
          }`}
        >
          {statusMsg.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Table */}
      <div className="rounded-2xl bg-stone-900/60 border border-stone-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-stone-950/80 border-b border-stone-800 text-stone-400 font-mono uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6 w-16">Urutan</th>
                <th className="py-3.5 px-4 sm:px-6">Lembaga / Institusi</th>
                <th className="py-3.5 px-4 sm:px-6">Periode</th>
                <th className="py-3.5 px-4 sm:px-6 text-right w-28">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/60 text-stone-200">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4 sm:px-6">
                      <Skeleton className="w-6 h-4" />
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <Skeleton className="w-48 h-4" />
                    </td>
                    <td className="py-4 px-4 sm:px-6">
                      <Skeleton className="w-28 h-4" />
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <Skeleton className="w-16 h-8 ml-auto rounded-lg" />
                    </td>
                  </tr>
                ))
              ) : experiences.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-12 text-center text-stone-500">
                    Belum ada data pengalaman. Klik &quot;Tambah Pengalaman&quot; untuk menambahkan.
                  </td>
                </tr>
              ) : (
                experiences.map((item, idx) => (
                  <tr
                    key={item.id}
                    className="hover:bg-stone-800/30 transition-colors"
                  >
                    <td className="py-4 px-4 sm:px-6 font-mono text-stone-400">
                      {item.sort_order ?? idx + 1}
                    </td>
                    <td className="py-4 px-4 sm:px-6 font-medium text-white">
                      {item.organization}
                    </td>
                    <td className="py-4 px-4 sm:px-6 font-mono text-xs text-emerald-400">
                      {item.period}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.organization)}
                          className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 border border-red-800/40 transition-colors cursor-pointer"
                          title="Hapus"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form */}
      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) resetForm();
          }}
        >
          <div className="relative w-full max-w-lg rounded-2xl bg-stone-950 border border-stone-800 p-6 sm:p-8 shadow-2xl text-stone-100">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800 mb-6">
              <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-400" />
                <span>
                  {editingId ? "Edit Pengalaman" : "Tambah Pengalaman Baru"}
                </span>
              </h2>
              <button
                onClick={resetForm}
                className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-stone-400 mb-1.5">
                  Lembaga / Institusi *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Pondok Pesantren Lirboyo (P3TQ)"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-400 mb-1.5">
                  Periode / Tahun *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: 2024 - Sekarang atau 2021 - 2023"
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-stone-400 mb-1.5">
                  Urutan Tampil (Sort Order)
                </label>
                <input
                  type="number"
                  min="1"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 1)}
                  className="w-full px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  Angka lebih kecil tampil lebih awal (teratas).
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-800 mt-6">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-emerald-950/40 cursor-pointer disabled:opacity-50"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{editingId ? "Simpan Perubahan" : "Tambahkan"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
