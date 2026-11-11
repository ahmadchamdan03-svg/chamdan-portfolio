"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  LayoutDashboard,
  FolderGit2,
  BookOpen,
  Image as ImageIcon,
  MessageSquareQuote,
  Briefcase,
  GraduationCap,
  Calendar,
  Share2,
  CalendarDays,
  Settings,
  Users,
  BarChart3,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/admin", label: "Ringkasan", icon: LayoutDashboard },
  { href: "/admin/projects", label: "Proyek", icon: FolderGit2 },
  { href: "/admin/writings", label: "Karya Tulis", icon: BookOpen },
  { href: "/admin/gallery", label: "Galeri 3D", icon: ImageIcon },
  { href: "/admin/testimonials", label: "Testimoni", icon: MessageSquareQuote },
  { href: "/admin/experience", label: "Pengalaman", icon: Briefcase },
  { href: "/admin/education", label: "Pendidikan", icon: GraduationCap },
  { href: "/admin/schedules", label: "Jadwal Kajian", icon: Calendar },
  { href: "/admin/social-links", label: "Akun Digital", icon: Share2 },
  { href: "/admin/calendar", label: "Kalender", icon: CalendarDays },
  { href: "/admin/settings", label: "Pengaturan Situs", icon: Settings },
  { href: "/admin/subscribers", label: "Subscribers", icon: Users },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col md:flex-row">
      {/* Mobile Header Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-stone-900 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-white text-sm">
            C
          </div>
          <span className="font-serif font-bold text-sm text-white">
            Admin Panel
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-stone-800 text-stone-300"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileOpen ? "block" : "hidden"
        } md:flex flex-col justify-between w-full md:w-64 bg-stone-900/95 border-r border-stone-800 p-6 shrink-0 backdrop-blur-xl md:min-h-screen`}
      >
        <div>
          {/* Brand */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 flex items-center justify-center font-bold text-amber-300 font-serif text-lg shadow-md border border-emerald-500/30">
              C
            </div>
            <div>
              <div className="font-serif font-bold text-white text-sm">
                Chamdan CMS
              </div>
              <div className="text-[11px] text-emerald-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Admin Console</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  prefetch={true}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-950/40"
                      : "text-stone-400 hover:text-white hover:bg-stone-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Sidebar Actions */}
        <div className="pt-6 border-t border-stone-800/80 space-y-2 mt-6">
          <Link
            href="/"
            target="_blank"
            prefetch={true}
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-stone-400 hover:text-stone-200 hover:bg-stone-800/40 transition-colors"
          >
            <span>Lihat Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Keluar (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-grow p-4 sm:p-8 md:p-10 max-w-7xl overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
