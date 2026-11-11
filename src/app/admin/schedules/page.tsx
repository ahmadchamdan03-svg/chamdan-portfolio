"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Schedule } from "@/types/database";
import {
  Calendar,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  X,
  Search,
  Clock,
  MapPin,
  User,
} from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";

const CATEGORIES = [
  { value: "Turats", label: "Turats" },
  { value: "Fikih", label: "Kajian Fikih" },
  { value: "Tahfidz", label: "Tahfidz & Tajwid" },
  { value: "Ma'had Aly", label: "Ma'had Aly" },
  { value: "Santri Tech Lab", label: "Santri Tech Lab" },
  { value: "Umum", label: "Kajian Umum" },
];

export default function AdminSchedulesPage() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
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
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Turats");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [speaker, setSpeaker] = useState("Ahmad Chamdan Yuwafin");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchSchedules();
  }, []);

  async function fetchSchedules() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("schedules")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setSchedules(data);
      }
    } catch (err) {
      console.error("Schedules fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setCategory("Turats");
    setDate("");
    setTime("");
    setLocation("");
    setSpeaker("Ahmad Chamdan Yuwafin");
    setDescription("");
    setFormOpen(false);
  };

  const handleEdit = (item: Schedule) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category || "Turats");
    setDate(item.date);
    setTime(item.time);
    setLocation(item.location);
    setSpeaker(item.speaker || "");
    setDescription(item.description || "");
    setFormOpen(true);
  };

  const handleDelete = async (id: string, itemTitle: string) => {
    if (!confirm(`Hapus jadwal kajian "${itemTitle}"?`)) return;

    try {
      const { error } = await supabase.from("schedules").delete().eq("id", id);
      if (error) throw error;

      setStatusMsg({
        type: "success",
        text: `Jadwal "${itemTitle}" berhasil dihapus.`,
      });
      fetchSchedules();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus jadwal";
      setStatusMsg({ type: "error", text: msg });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date.trim() || !time.trim() || !location.trim()) {
      setStatusMsg({
        type: "error",
        text: "Judul, tanggal/hari, waktu, dan lokasi wajib diisi.",
      });
      return;
    }

    setSaving(true);
    setStatusMsg(null);

    const payload = {
      title: title.trim(),
      category: category.trim(),
      date: date.trim(),
      time: time.trim(),
      location: location.trim(),
      speaker: speaker.trim() || null,
      description: description.trim() || null,
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from("schedules")
          .update(payload)
          .eq("id", editingId);
        if (error) throw error;
        setStatusMsg({
          type: "success",
          text: "Jadwal kajian berhasil diperbarui.",
        });
      } else {
        const { error } = await supabase.from("schedules").insert([payload]);
        if (error) throw error;
        setStatusMsg({
          type: "success",
          text: "Jadwal kajian baru berhasil ditambahkan.",
        });
      }

      resetForm();
      fetchSchedules();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyimpan jadwal";
      setStatusMsg({ type: "error", text: msg });
    } finally {
      setSaving(false);
    }
  };

  const filtered = schedules.filter(
    (s) =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.date.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono mb-1">
            <Calendar className="w-4 h-4" />
            <span>Agenda & Halaqah</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Jadwal Kajian
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Atur agenda kajian kitab turats, halaqah santri, dan sesi mentoring developer.
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
          <span>Tambah Jadwal</span>
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
          placeholder="Cari judul kajian, kategori, waktu, atau lokasi..."
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
            <Calendar className="w-10 h-10 mx-auto text-stone-600 mb-2" />
            <p className="text-sm font-medium text-stone-300">
              Tidak ada jadwal kajian ditemukan.
            </p>
            <p className="text-xs text-stone-500">
              Klik &quot;Tambah Jadwal&quot; untuk menambahkan agenda pertama Anda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm text-stone-300">
              <thead className="bg-stone-900/80 text-stone-400 font-mono uppercase text-[11px] tracking-wider border-b border-stone-800">
                <tr>
                  <th className="py-3.5 px-4 sm:px-6">Kajian & Kitab</th>
                  <th className="py-3.5 px-4">Kategori</th>
                  <th className="py-3.5 px-4">Hari & Waktu</th>
                  <th className="py-3.5 px-4">Lokasi & Pengampu</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/60">
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-stone-800/40 transition-colors"
                  >
                    <td className="py-4 px-4 sm:px-6 font-medium text-white max-w-xs">
                      <div className="font-serif font-bold text-sm sm:text-base text-stone-100">
                        {item.title}
                      </div>
                      {item.description && (
                        <div className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">
                          {item.description}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-mono bg-emerald-950/80 border border-emerald-500/30 text-emerald-300">
                        {item.category}
                      </span>
                    </td>
                    <td className="py-4 px-4 whitespace-nowrap text-stone-300">
                      <div className="font-medium text-amber-300 text-xs">
                        {item.date}
                      </div>
                      <div className="text-[11px] text-stone-400 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-stone-500" />
                        <span>{item.time}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs text-stone-300">
                      <div className="flex items-center gap-1 text-stone-300 line-clamp-1">
                        <MapPin className="w-3 h-3 text-stone-500 shrink-0" />
                        <span>{item.location}</span>
                      </div>
                      {item.speaker && (
                        <div className="flex items-center gap-1 text-[11px] text-stone-400 mt-0.5">
                          <User className="w-3 h-3 text-stone-500 shrink-0" />
                          <span>{item.speaker}</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-4 sm:px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 rounded-lg bg-stone-800/80 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer"
                          title="Edit"
                          aria-label={`Edit ${item.title}`}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id, item.title)}
                          className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 transition-colors cursor-pointer"
                          title="Hapus"
                          aria-label={`Hapus ${item.title}`}
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
                {editingId ? "Edit Jadwal Kajian" : "Tambah Jadwal Kajian"}
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
                  Judul Kajian <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Kajian Kitab Al-Asybah wan Nadza'ir"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Kategori <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Hari / Tanggal <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    placeholder="Contoh: Setiap Sabtu Malam Ahad"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Waktu / Jam <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="Contoh: 19:45 - 21:30 WIB"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Pengampu / Narasumber
                  </label>
                  <input
                    type="text"
                    value={speaker}
                    onChange={(e) => setSpeaker(e.target.value)}
                    placeholder="Contoh: Ahmad Chamdan Yuwafin"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Lokasi / Majelis <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Contoh: Gedung Ma'had Aly Lirboyo, Lt. 2"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1.5">
                  Deskripsi / Kitab Rujukan (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Contoh: Membahas kaidah-kaidah fikih dalam penentuan fatwa kontemporer."
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
