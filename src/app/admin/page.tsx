"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import {
  FolderGit2,
  BookOpen,
  Image as ImageIcon,
  Users,
  Mail,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({
    projects: 0,
    writings: 0,
    gallery: 0,
    testimonials: 0,
    subscribers: 0,
    messages: 0,
  });
  const [recentMessages, setRecentMessages] = useState<
    { id: string; name: string; email: string; message: string; created_at: string }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [
          projCount,
          writCount,
          gallCount,
          testCount,
          subCount,
          msgCount,
          latestMsgs,
        ] = await Promise.all([
          supabase.from("projects").select("*", { count: "exact", head: true }),
          supabase.from("writings").select("*", { count: "exact", head: true }),
          supabase.from("gallery").select("*", { count: "exact", head: true }),
          supabase.from("testimonials").select("*", { count: "exact", head: true }),
          supabase.from("subscribers").select("*", { count: "exact", head: true }),
          supabase.from("messages").select("*", { count: "exact", head: true }),
          supabase.from("messages").select("*").order("created_at", { ascending: false }).limit(5),
        ]);

        setStats({
          projects: projCount.count || 0,
          writings: writCount.count || 0,
          gallery: gallCount.count || 0,
          testimonials: testCount.count || 0,
          subscribers: subCount.count || 0,
          messages: msgCount.count || 0,
        });

        if (latestMsgs.data) {
          setRecentMessages(latestMsgs.data);
        }
      } catch (err) {
        console.error("Failed to load admin stats:", err);
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const statCards = [
    { label: "Total Proyek", count: stats.projects, href: "/admin/projects", icon: FolderGit2, color: "text-emerald-400" },
    { label: "Karya Tulis", count: stats.writings, href: "/admin/writings", icon: BookOpen, color: "text-amber-400" },
    { label: "Foto Galeri 3D", count: stats.gallery, href: "/admin/gallery", icon: ImageIcon, color: "text-sky-400" },
    { label: "Pelanggan Buletin", count: stats.subscribers, href: "/admin/subscribers", icon: Users, color: "text-purple-400" },
    { label: "Pesan Masuk", count: stats.messages, href: "#messages", icon: Mail, color: "text-rose-400" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
          Ringkasan Portofolio
        </h1>
        <p className="text-sm text-stone-400 mt-1">
          Selamat datang di konsol admin Ahmad Chamdan Yuwafin. Pantau dan kelola seluruh konten website Anda.
        </p>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-5 rounded-2xl bg-stone-900 border border-stone-800">
                <Skeleton className="w-8 h-8 rounded-lg mb-3" />
                <Skeleton className="w-16 h-8 mb-1" />
                <Skeleton className="w-24 h-4" />
              </div>
            ))
          : statCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <Link
                  key={idx}
                  href={card.href}
                  className="p-5 rounded-2xl bg-stone-900/80 hover:bg-stone-900 border border-stone-800 hover:border-emerald-500/40 transition-all group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs text-stone-400 font-medium">{card.label}</span>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <div className="flex items-baseline justify-between">
                    <span className="text-3xl font-bold font-serif text-white">
                      {card.count}
                    </span>
                    <ArrowRight className="w-4 h-4 text-stone-600 group-hover:text-emerald-400 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              );
            })}
      </div>

      {/* Recent Messages Section */}
      <div id="messages" className="rounded-3xl bg-stone-900/80 border border-stone-800 p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-serif font-bold text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-emerald-400" />
              <span>Pesan Masuk Terbaru</span>
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              Pesan yang dikirimkan oleh pengunjung melalui formulir kontak.
            </p>
          </div>
          <span className="text-xs text-stone-500 font-mono">
            Total {stats.messages} Pesan
          </span>
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-16 rounded-xl" />
            ))}
          </div>
        ) : recentMessages.length === 0 ? (
          <div className="p-8 text-center text-sm text-stone-500">
            Belum ada pesan masuk yang tersimpan di database.
          </div>
        ) : (
          <div className="divide-y divide-stone-800/80">
            {recentMessages.map((msg) => (
              <div key={msg.id} className="py-4 first:pt-0 last:pb-0 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-sm text-stone-200">
                    {msg.name}{" "}
                    <span className="text-xs text-stone-400 font-normal">
                      (&lt;{msg.email}&gt;)
                    </span>
                  </div>
                  <span className="text-[11px] text-stone-500 font-mono">
                    {new Date(msg.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-xs text-stone-400 leading-relaxed">
                  {msg.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
