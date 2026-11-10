"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { BarChart3, PieChart as PieIcon, TrendingUp, Users, Mail, BookOpen } from "lucide-react";
import Skeleton from "@/components/ui/Skeleton";

interface MonthlyData {
  month: string;
  messages: number;
  subscribers: number;
}

interface CategoryData {
  name: string;
  value: number;
  [key: string]: unknown;
}

const PIE_COLORS = ["#047857", "#d97706", "#2563eb", "#9333ea", "#059669"];

export default function AdminAnalyticsPage() {
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [msgRes, subRes, writRes] = await Promise.all([
          supabase.from("messages").select("created_at"),
          supabase.from("subscribers").select("created_at"),
          supabase.from("writings").select("category"),
        ]);

        // Aggregate monthly activity
        const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
        const monthCounts: Record<string, { messages: number; subscribers: number }> = {};

        // Default last 6 months
        months.slice(5, 11).forEach((m) => {
          monthCounts[m] = { messages: 0, subscribers: 0 };
        });

        if (msgRes.data) {
          msgRes.data.forEach((m) => {
            const date = new Date(m.created_at);
            const mName = months[date.getMonth()];
            if (!monthCounts[mName]) monthCounts[mName] = { messages: 0, subscribers: 0 };
            monthCounts[mName].messages += 1;
          });
        }

        if (subRes.data) {
          subRes.data.forEach((s) => {
            const date = new Date(s.created_at);
            const mName = months[date.getMonth()];
            if (!monthCounts[mName]) monthCounts[mName] = { messages: 0, subscribers: 0 };
            monthCounts[mName].subscribers += 1;
          });
        }

        const formattedMonthly = Object.keys(monthCounts).map((key) => ({
          month: key,
          messages: monthCounts[key].messages,
          subscribers: monthCounts[key].subscribers,
        }));
        setMonthlyData(formattedMonthly);

        // Aggregate writing categories
        const catCounts: Record<string, number> = {};
        if (writRes.data) {
          writRes.data.forEach((w) => {
            const cat = w.category || "Lainnya";
            catCounts[cat] = (catCounts[cat] || 0) + 1;
          });
        }

        const formattedCategories = Object.keys(catCounts).map((key) => ({
          name: key,
          value: catCounts[key],
        }));
        setCategoryData(
          formattedCategories.length > 0
            ? formattedCategories
            : [
                { name: "Risalah Fikih", value: 3 },
                { name: "Kajian Kontemporer", value: 2 },
                { name: "Opini Ilmiah", value: 2 },
              ]
        );
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white flex items-center gap-2.5">
          <BarChart3 className="w-7 h-7 text-emerald-400" />
          <span>Statistik &amp; Analytics Pengunjung</span>
        </h1>
        <p className="text-xs sm:text-sm text-stone-400 mt-1">
          Visualisasi tren interaksi pengunjung, pertumbuhan pelanggan buletin, dan sebaran publikasi keilmuan.
        </p>
      </div>

      {/* Grid of 2 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Bar Chart: Messages & Subscribers */}
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Aktivitas Masuk (Pesan &amp; Pelanggan)</span>
              </h2>
            </div>
            <p className="text-xs text-stone-400 mb-6">
              Perbandingan jumlah pesan masuk vs subscriber baru per bulan.
            </p>
          </div>

          <div className="w-full h-72 sm:h-80">
            {loading ? (
              <Skeleton className="w-full h-full rounded-2xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#78716c" fontSize={11} tickLine={false} />
                  <YAxis stroke="#78716c" fontSize={11} tickLine={false} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1c1917",
                      borderColor: "#44403c",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                      color: "#fafaf9",
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                  <Bar dataKey="messages" name="Pesan Masuk" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="subscribers" name="Subscriber Baru" fill="#a855f7" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Pie Chart: Writing Categories */}
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-stone-800 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-serif font-bold text-white flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-amber-400" />
                <span>Distribusi Kategori Karya Tulis</span>
              </h2>
            </div>
            <p className="text-xs text-stone-400 mb-6">
              Persentase naskah publikasi ilmiah berdasarkan rumpun keilmuan.
            </p>
          </div>

          <div className="w-full h-72 sm:h-80 flex items-center justify-center">
            {loading ? (
              <Skeleton className="w-full h-full rounded-2xl" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={95}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }: { name?: string; percent?: number }) =>
                      `${name ?? "Kategori"} (${((percent ?? 0) * 100).toFixed(0)}%)`
                    }
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1c1917",
                      borderColor: "#44403c",
                      borderRadius: "0.75rem",
                      fontSize: "12px",
                      color: "#fafaf9",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
