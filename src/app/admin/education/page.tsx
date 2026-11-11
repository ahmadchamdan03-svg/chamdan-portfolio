"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Education } from "@/types/database";
import {
  GraduationCap,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Search,
} from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";

export default function AdminEducationPage() {
  const [educations, setEducations] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [institution, setInstitution] = useState("");
  const [period, setPeriod] = useState("");
  const [level, setLevel] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    fetchEducations();
  }, []);

  async function fetchEducations() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("education")
        .select("*")
        .order("created_at", { ascending: true });
      if (!error && data) {
        setEducations(data);
      }
    } catch (err) {
      console.error("Education fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setEditingId(null);
    setInstitution("");
    setPeriod("");
    setLevel("");
    setNotes("");
    setFormOpen(false);
  };

  const handleEdit = (item: Education) => {
    setEditingId(item.id);
    setInstitution(item.institution);
    setPeriod(item.period);
    setLevel(item.level || "");
    setNotes(item.notes || "");
    setFormOpen(true);
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Hapus riwayat pendidikan "${name}"?`)) return;

    try {
      const { error } = await supabase.from("education").delete().eq("id", id);
      if (error) throw error;

      setStatusMsg({
        type: "success",
        text: `Data pendidikan "${name}" berhasil dihapus.`,
      });
      fetchEducations();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus data";
      setStatusMsg({ type: "error", text: msg });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!institution.trim() || !period.trim()) {
      setStatusMsg({
        type: "error",
        text: "Nama institusi dan periode wajib diisi.",
      });
      return;
    }

    setSaving(true);
    setStatusMsg(null);

    const payload = {
      institution: institution.trim(),
      period: period.trim(),
      level: level.trim() || null,
      notes: notes.trim() || null,
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from("education")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        setStatusMsg({
          type: "success",
          text: "Data pendidikan berhasil diperbarui.",
        });
      } else {
        const { error } = await supabase.from("education").insert([payload]);
        if (error) throw error;
        setStatusMsg({
          type: "success",
          text: "Data pendidikan baru berhasil ditambahkan.",
        });
      }

      resetForm();
      fetchEducations();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan data";
      setStatusMsg({ type: "error", text: msg });
    } finally {
      setSaving(false);
    }
  };

  const filtered = educations.filter(
    (e) =>
      e.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.level && e.level.toLowerCase().includes(searchQuery.toLowerCase())) ||
      e.period.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Manajemen Riwayat Akademis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Pendidikan & Kesarjanaan
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Kelola rekam jejak studi formal, pesantren, dan sanad keilmuan Islam.
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
          <span>Tambah Pendidikan</span>
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

      {/* Search & Filter Bar */}
      <div className="flex items-center gap-3 bg-stone-900/60 border border-stone-800 rounded-xl px-3.5 py-2">
        <Search className="w-4 h-4 text-stone-400" />
        <input
          type="text"
          placeholder="Cari institusi, jenjang, atau periode..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent text-xs sm:text-sm text-white placeholder-stone-500 focus:outline-none w-full"
        />
      </div>

      {/* Main Content Table */}
      <div className="rounded-2xl border border-stone-800 bg-stone-900/40 backdrop-blur-md overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full bg-stone-800/60 rounded-xl" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-stone-400 space-y-2">
            <GraduationCap className="w-10 h-10 mx-auto text-stone-600 mb-2" />
            <p className="text-sm font-medium text-stone-300">
              Tidak ada data pendidikan ditemukan.
            </p>
            <p className="text-xs text-stone-500">
              Klik &quot;Tambah Pendidikan&quot; untuk menambahkan riwayat pertama Anda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-stone-300">
              <thead className="bg-stone-900/80 text-stone-400 font-mono uppercase text-[11px] tracking-wider border-b border-stone-800">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Institusi / Lembaga</th>
                  <th className="py-3.5 px-4">Periode</th>
                  <th className="py-3.5 px-4">Jenjang / Level</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-stone-800/40 transition-colors"
                  >
                    <td className="py-4 px-4 sm:px-6 font-medium text-white">
                      <div>{item.institution}</div>
                      {item.notes && (
                        <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                          {item.notes}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 font-mono text-emerald-400 whitespace-nowrap">
                      {item.period}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[11px] bg-stone-800 border border-stone-700/60 text-stone-300">
                        {item.level || "-"}
                      </span>
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit"
                          aria-label={`Edit ${item.institution}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.institution)}
                          className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 transition-colors cursor-pointer"
                          title="Hapus"
                          aria-label={`Hapus ${item.institution}`}
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
          <div className="relative w-full max-w-lg rounded-2xl bg-stone-900 border border-stone-800 p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-stone-800">
              <h2 className="text-lg sm:text-xl font-serif font-bold text-white">
                {editingId ? "Edit Riwayat Pendidikan" : "Tambah Riwayat Pendidikan"}
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
                  Institusi / Lembaga Pendidikan <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="Contoh: Ma'had Aly Lirboyo"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Periode <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    placeholder="Contoh: 2022 - Sekarang"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Level / Jenjang
                  </label>
                  <input
                    type="text"
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    placeholder="Contoh: Marhalah Ula (M1)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Catatan / Bidang Keilmuan (Opsional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Konsentrasi Fikih & Ushul Fikih"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
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
                    <span>Simpan Perubahan</span>
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
