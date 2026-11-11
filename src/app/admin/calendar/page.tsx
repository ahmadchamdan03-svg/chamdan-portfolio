"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { CalendarNote, PingHistory, Schedule, SiteConfig } from "@/types/database";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Activity,
  X,
  BookOpen,
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";

export default function AdminCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // Data states
  const [notes, setNotes] = useState<CalendarNote[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [pingHistory, setPingHistory] = useState<PingHistory[]>([]);
  const [nextPingDate, setNextPingDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Manual Ping State
  const [pinging, setPinging] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Note Modal State
  const [modalOpen, setFormModalOpen] = useState(false);
  const [savingNote, setSavingNote] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteDesc, setNoteDesc] = useState("");

  useEffect(() => {
    fetchAllCalendarData();
  }, []);

  async function fetchAllCalendarData() {
    setLoading(true);
    try {
      // 1. Fetch calendar notes
      const { data: notesData } = await supabase
        .from("calendar_notes")
        .select("*")
        .order("created_at", { ascending: false });
      if (notesData) setNotes(notesData);

      // 2. Fetch schedules
      const { data: schedData } = await supabase
        .from("schedules")
        .select("*");
      if (schedData) setSchedules(schedData);

      // 3. Fetch ping history
      const { data: pingData } = await supabase
        .from("ping_history")
        .select("*")
        .order("pinged_at", { ascending: false })
        .limit(10);
      if (pingData) setPingHistory(pingData);

      // 4. Fetch site config for next_ping_date
      const { data: cfg } = await supabase
        .from("site_config")
        .select("next_ping_date")
        .limit(1)
        .single();
      if (cfg?.next_ping_date) setNextPingDate(cfg.next_ping_date);
    } catch (err) {
      console.error("Calendar data fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  // Handle Manual Ping
  const handleManualPing = async () => {
    setPinging(true);
    setStatusMsg(null);
    try {
      const res = await fetch("/api/ping-manual", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Gagal melakukan ping manual");

      setStatusMsg({
        type: "success",
        text: `Ping Supabase berhasil! Jadwal ping berikutnya di-reset ke: ${data.next_ping_date} (+6 hari).`,
      });
      setNextPingDate(data.next_ping_date);
      fetchAllCalendarData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal ping";
      setStatusMsg({ type: "error", text: msg });
    } finally {
      setPinging(false);
    }
  };

  // Add Note
  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTitle.trim()) return;

    setSavingNote(true);
    try {
      const { error } = await supabase.from("calendar_notes").insert([
        {
          title: noteTitle.trim(),
          description: noteDesc.trim() || null,
          date: selectedDate,
        },
      ]);
      if (error) throw error;

      setStatusMsg({
        type: "success",
        text: `Catatan "${noteTitle}" berhasil disimpan untuk tanggal ${selectedDate}.`,
      });
      setNoteTitle("");
      setNoteDesc("");
      setFormModalOpen(false);
      fetchAllCalendarData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menambah catatan";
      setStatusMsg({ type: "error", text: msg });
    } finally {
      setSavingNote(false);
    }
  };

  // Delete Note
  const handleDeleteNote = async (id: string, title: string) => {
    if (!confirm(`Hapus catatan "${title}"?`)) return;
    try {
      const { error } = await supabase.from("calendar_notes").delete().eq("id", id);
      if (error) throw error;
      fetchAllCalendarData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus";
      setStatusMsg({ type: "error", text: msg });
    }
  };

  // Calendar Math
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNamesID = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
  ];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const resetToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today.toISOString().split("T")[0]);
  };

  // Format Islamic Date
  const getHijriDate = (d: Date) => {
    try {
      const formatter = new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura", {
        day: "numeric",
        month: "short",
      });
      return formatter.format(d);
    } catch {
      return "";
    }
  };

  const getFullHijriMonth = (d: Date) => {
    try {
      const formatter = new Intl.DateTimeFormat("id-ID-u-ca-islamic-umalqura", {
        month: "long",
        year: "numeric",
      });
      return formatter.format(d);
    } catch {
      return "";
    }
  };

  // Days Grid Generator
  const calendarCells = [];
  // Empty slots for previous month offset
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const cellDate = new Date(year, month, d);
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    calendarCells.push({ dayNumber: d, dateStr, dateObj: cellDate });
  }

  // Selected date notes & events
  const selectedNotes = notes.filter((n) => n.date === selectedDate);
  const selectedPings = pingHistory.filter(
    (p) => p.pinged_at?.split("T")[0] === selectedDate
  );
  const isSelectedNextPing = nextPingDate === selectedDate;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 font-mono mb-1">
            <CalendarDays className="w-4 h-4" />
            <span>Kalender Masehi & Hijriah</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Kalender &amp; Auto-Ping Supabase
          </h1>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Agenda jadwal santri, catatan harian, dan sistem pemantauan ping otomatis 6 harian.
          </p>
        </div>

        {/* Action Buttons: Manual Ping & Add Note */}
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button
            onClick={handleManualPing}
            disabled={pinging}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm transition-all shadow-md cursor-pointer disabled:opacity-50"
            title="Kirim query ringan SELECT 1 ke Supabase dan reset jadwal berikutnya +6 hari"
          >
            {pinging ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Mem-ping Supabase...</span>
              </>
            ) : (
              <>
                <Activity className="w-4 h-4" />
                <span>Ping Supabase Sekarang</span>
              </>
            )}
          </button>

          <button
            onClick={() => setFormModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Catatan</span>
          </button>
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
          <button
            onClick={() => setStatusMsg(null)}
            className="text-stone-400 hover:text-stone-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Auto-Ping Status Pill Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-stone-400">Jadwal Ping Berikutnya</div>
            <div className="text-sm font-bold font-mono text-emerald-400">
              {nextPingDate || "Belum diset"}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-stone-400">Interval Rutin Vercel Cron</div>
            <div className="text-sm font-bold font-mono text-amber-300">
              Setiap 6 Hari Sekali (00:00 UTC)
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-900/60 border border-stone-800 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-stone-400">Bulan Hijriah Saat Ini</div>
            <div className="text-sm font-serif font-bold text-blue-300">
              {getFullHijriMonth(currentDate)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Dual Calendar Grid & Details Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Calendar Grid */}
        <div className="lg:col-span-8 rounded-3xl border border-stone-800 bg-stone-900/50 backdrop-blur-xl p-5 sm:p-6 space-y-4">
          {/* Calendar Month Navigation Header */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-800">
            <div className="flex items-center gap-3">
              <h2 className="text-lg sm:text-xl font-serif font-bold text-white">
                {monthNamesID[month]} {year}
              </h2>
              <span className="text-xs font-serif text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30">
                {getFullHijriMonth(currentDate)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={resetToToday}
                className="px-3 py-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white text-xs font-mono transition-colors"
              >
                Hari Ini
              </button>
              <button
                onClick={prevMonth}
                aria-label="Bulan sebelumnya"
                className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={nextMonth}
                aria-label="Bulan berikutnya"
                className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Weekday Labels (Sun to Sat) */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2 text-center text-[11px] font-mono text-stone-400 uppercase tracking-wider pb-1">
            {["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jum'at", "Sabtu"].map((w, i) => (
              <div key={w} className={i === 0 ? "text-red-400 font-bold" : ""}>
                {w}
              </div>
            ))}
          </div>

          {/* Date Cells Grid */}
          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {calendarCells.map((cell, idx) => {
              if (!cell) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="min-h-[70px] sm:min-h-[85px] rounded-xl bg-stone-950/20 border border-stone-850/40 opacity-30"
                  />
                );
              }

              const isSelected = cell.dateStr === selectedDate;
              const isToday = cell.dateStr === new Date().toISOString().split("T")[0];
              const isNextPing = cell.dateStr === nextPingDate;
              const dayNotes = notes.filter((n) => n.date === cell.dateStr);
              const dayPings = pingHistory.filter(
                (p) => p.pinged_at?.split("T")[0] === cell.dateStr
              );

              return (
                <div
                  key={cell.dateStr}
                  onClick={() => setSelectedDate(cell.dateStr)}
                  className={`min-h-[70px] sm:min-h-[85px] p-2 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? "bg-emerald-950/60 border-emerald-500 shadow-md shadow-emerald-950/40"
                      : isToday
                      ? "bg-stone-800/80 border-amber-500/60"
                      : "bg-stone-950/60 border-stone-800/80 hover:border-stone-700"
                  }`}
                >
                  {/* Top row: Gregorian Day & Hijri Day */}
                  <div className="flex items-start justify-between">
                    <span
                      className={`text-xs sm:text-sm font-bold font-mono ${
                        isToday
                          ? "text-amber-400 font-black"
                          : isSelected
                          ? "text-emerald-300"
                          : "text-stone-200"
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    <span className="text-[10px] font-serif text-stone-500 leading-none">
                      {getHijriDate(cell.dateObj).split(" ")[0]}
                    </span>
                  </div>

                  {/* Indicators / Event badges */}
                  <div className="space-y-1 mt-1">
                    {isNextPing && (
                      <div className="inline-flex items-center gap-1 px-1 py-0.5 rounded text-[9px] font-mono bg-emerald-500 text-stone-950 font-bold">
                        <Activity className="w-2.5 h-2.5" />
                        <span className="hidden sm:inline">Next Ping</span>
                      </div>
                    )}

                    {dayPings.length > 0 && (
                      <div className="w-2 h-2 rounded-full bg-amber-400 inline-block mr-1" title="Pernah di-ping" />
                    )}

                    {dayNotes.length > 0 && (
                      <div className="px-1.5 py-0.5 rounded text-[9px] bg-stone-800 text-stone-300 truncate max-w-full">
                        {dayNotes[0].title}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Day Details & Agenda */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-3xl border border-stone-800 bg-stone-900/50 backdrop-blur-xl p-6 space-y-5">
            <div>
              <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
                Agenda Tanggal Terpilih
              </div>
              <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
                {selectedDate}
              </h3>
              <p className="text-xs font-serif text-stone-400">
                {getHijriDate(new Date(selectedDate))}
              </p>
            </div>

            {/* Next Ping Highlight if on this date */}
            {isSelectedNextPing && (
              <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2.5">
                <Activity className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>
                  <strong>Jadwal Ping Otomatis Supabase</strong> via Vercel Cron.
                </span>
              </div>
            )}

            {/* Notes List for Selected Date */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-stone-400 border-b border-stone-800 pb-2">
                <span>Catatan &amp; Agenda ({selectedNotes.length})</span>
                <button
                  onClick={() => setFormModalOpen(true)}
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Tambah</span>
                </button>
              </div>

              {selectedNotes.length === 0 ? (
                <div className="text-center py-6 text-stone-500 text-xs">
                  Tidak ada catatan agenda untuk tanggal ini.
                </div>
              ) : (
                <div className="space-y-2">
                  {selectedNotes.map((note) => (
                    <div
                      key={note.id}
                      className="p-3 rounded-xl bg-stone-950/70 border border-stone-800 flex items-start justify-between gap-2"
                    >
                      <div>
                        <h4 className="text-xs font-semibold text-white">
                          {note.title}
                        </h4>
                        {note.description && (
                          <p className="text-[11px] text-stone-400 mt-0.5">
                            {note.description}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => handleDeleteNote(note.id, note.title)}
                        className="text-stone-500 hover:text-red-400 p-1 cursor-pointer"
                        title="Hapus Catatan"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Ping Logs on Selected Date */}
            {selectedPings.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-stone-800">
                <div className="text-xs font-mono text-stone-400">
                  Aktivitas Ping pada Tanggal Ini:
                </div>
                {selectedPings.map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-xl bg-stone-950 border border-stone-800/80 text-xs text-stone-300 flex items-center justify-between"
                  >
                    <span className="capitalize font-mono text-amber-300">
                      Ping {p.type}
                    </span>
                    <span className="text-[11px] text-emerald-400 font-mono">
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Note Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-2xl bg-stone-900 border border-stone-800 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="text-base font-serif font-bold text-white">
                Tambah Catatan Agenda
              </h3>
              <button
                onClick={() => setFormModalOpen(false)}
                className="p-1 rounded text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNote} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Tanggal Agenda
                </label>
                <input
                  type="date"
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Judul Catatan / Agenda <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={noteTitle}
                  onChange={(e) => setNoteTitle(e.target.value)}
                  placeholder="Contoh: Kajian Akbar di Masjid Agung"
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Deskripsi / Keterangan Tambahan
                </label>
                <textarea
                  rows={3}
                  value={noteDesc}
                  onChange={(e) => setNoteDesc(e.target.value)}
                  placeholder="Detail lokasi, kitab yang dibawa, atau audiens..."
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setFormModalOpen(false)}
                  className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-semibold text-stone-300"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={savingNote}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-semibold text-white shadow-md"
                >
                  {savingNote ? "Menyimpan..." : "Simpan Catatan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
