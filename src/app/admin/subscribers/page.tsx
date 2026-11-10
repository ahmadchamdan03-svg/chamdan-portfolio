"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Subscriber } from "@/types/database";
import {
  Users,
  Send,
  Trash2,
  Mail,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Calendar,
} from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [broadcastTitle, setBroadcastTitle] = useState("");
  const [broadcastContent, setBroadcastContent] = useState("");
  const [broadcasting, setBroadcasting] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  async function fetchSubscribers() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("subscribers")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) {
        setSubscribers(data);
      }
    } catch (err) {
      console.error("Fetch subscribers error:", err);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus subscriber ini dari daftar?")) return;
    try {
      const { error } = await supabase.from("subscribers").delete().eq("id", id);
      if (error) throw error;
      fetchSubscribers();
      setStatusMsg({ type: "success", text: "Pelanggan berhasil dihapus." });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menghapus pelanggan.";
      setStatusMsg({ type: "error", text: msg });
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastContent) return;
    if (subscribers.length === 0) {
      setStatusMsg({ type: "error", text: "Belum ada pelanggan terdaftar untuk menerima siaran." });
      return;
    }

    setBroadcasting(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: broadcastTitle,
          content: broadcastContent,
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Gagal mengirimkan siaran email.");
      }

      setStatusMsg({
        type: "success",
        text: `Siaran email berhasil diproses ke ${json.recipientsCount} pelanggan!`,
      });
      setBroadcastTitle("");
      setBroadcastContent("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat memproses siaran.";
      setStatusMsg({ type: "error", text: msg });
    } finally {
      setBroadcasting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-2.5">
          <Users className="w-7 h-7 text-purple-400" />
          <span>Pelanggan Buletin &amp; Siaran Email</span>
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 mt-1">
          Kelola daftar email pembaca dan kirim buletin pemikiran langsung ke seluruh audiens.
        </p>
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

      {/* Broadcast Composer Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl">
        <div className="flex items-center gap-2.5 mb-4">
          <Send className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-serif font-bold text-white">
            Kirim Siaran Email (Broadcast)
          </h2>
        </div>
        <p className="text-xs text-stone-400 mb-6">
          Pesan ini akan dikirimkan serentak ke {subscribers.length} alamat email pelanggan terdaftar.
        </p>

        <form onSubmit={handleSendBroadcast} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Subjek / Judul Email *
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Risalah Terbaru: Rekonstruksi Nalar Fikih di Era AI"
              value={broadcastTitle}
              onChange={(e) => setBroadcastTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">
              Isi Pesan Email *
            </label>
            <textarea
              required
              rows={5}
              placeholder="Tuliskan isi pesan kabar atau ringkasan risalah di sini..."
              value={broadcastContent}
              onChange={(e) => setBroadcastContent(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 resize-none"
            />
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={broadcasting || subscribers.length === 0}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              {broadcasting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Mengirimkan Siaran...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Kirim Broadcast ke {subscribers.length} Pelanggan</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Subscribers Table */}
      <div className="rounded-3xl bg-stone-900 border border-stone-800 overflow-hidden">
        <div className="p-6 border-b border-stone-800 flex items-center justify-between">
          <h2 className="font-serif font-bold text-white text-base">
            Daftar Pelanggan ({subscribers.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-6 space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-12 rounded-xl" />
            ))}
          </div>
        ) : subscribers.length === 0 ? (
          <div className="p-10 text-center text-sm text-stone-500">
            Belum ada pelanggan buletin yang terdaftar.
          </div>
        ) : (
          <div className="divide-y divide-stone-800/80">
            {subscribers.map((s) => (
              <div
                key={s.id}
                className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-stone-800/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-stone-800 flex items-center justify-center text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium text-xs sm:text-sm text-white">
                      {s.email}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-stone-500 font-mono mt-0.5">
                      <Calendar className="w-3 h-3" />
                      <span>
                        Bergabung:{" "}
                        {new Date(s.created_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(s.id)}
                  className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 hover:text-red-200 transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
