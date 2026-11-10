"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  Search,
  Compass,
  FileText,
  FolderGit2,
  GraduationCap,
  Briefcase,
  Layers,
  User,
  Mail,
  ExternalLink,
  BookOpen,
} from "lucide-react";

interface SearchItem {
  id: string;
  title: string;
  subtitle?: string;
  url: string;
  isExternal?: boolean;
}

export default function CommandPalette({
  isOpen,
  setIsOpen,
}: {
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}) {
  const [openInternal, setOpenInternal] = useState(false);
  const isControlled = typeof isOpen === "boolean";
  const open = isControlled ? isOpen : openInternal;
  const setOpen = isControlled ? (setIsOpen || (() => {})) : setOpenInternal;

  const [projects, setProjects] = useState<SearchItem[]>([]);
  const [writings, setWritings] = useState<SearchItem[]>([]);
  const router = useRouter();

  // Global keydown handler
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(!open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, setOpen]);

  // Fetch projects and writings from Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        const [projRes, writRes] = await Promise.all([
          supabase.from("projects").select("id, title, platform, domain"),
          supabase.from("writings").select("id, title, category, slug, link"),
        ]);

        if (projRes.data) {
          setProjects(
            projRes.data.map((p) => ({
              id: p.id,
              title: p.title,
              subtitle: p.platform || p.domain || "Case Study",
              url: `/projects/${p.id}`,
            }))
          );
        }

        if (writRes.data) {
          setWritings(
            writRes.data.map((w) => ({
              id: w.id,
              title: w.title,
              subtitle: w.category || "Risalah Ilmiah",
              url: w.slug ? `/writings/${w.slug}` : (w.link || "#"),
              isExternal: !w.slug && !!w.link,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch search items:", err);
      }
    }
    fetchData();
  }, []);

  const navigateTo = (url: string, isExternal?: boolean) => {
    setOpen(false);
    if (isExternal) {
      window.open(url, "_blank");
    } else if (url.startsWith("#")) {
      const el = document.querySelector(url);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(url);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center pt-24 sm:pt-32 p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setOpen(false)}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl bg-white/95 dark:bg-stone-900/95 border border-stone-200 dark:border-stone-800 shadow-2xl shadow-black/30 backdrop-blur-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Command label="Universal Search" className="flex flex-col w-full">
          <div className="flex items-center px-4 border-b border-stone-200 dark:border-stone-800">
            <Search className="w-5 h-5 text-stone-400 shrink-0 mr-3" />
            <Command.Input
              placeholder="Cari proyek, risalah, atau navigasi... (Tekan Esc untuk tutup)"
              className="w-full py-4 bg-transparent text-sm text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none"
              autoFocus
            />
            <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-mono text-stone-400 bg-stone-100 dark:bg-stone-800 rounded border border-stone-300 dark:border-stone-700">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-80 overflow-y-auto p-2 space-y-1">
            <Command.Empty className="p-6 text-center text-sm text-stone-500">
              Tidak ada hasil yang cocok dengan pencarian Anda.
            </Command.Empty>

            {/* Kategori Navigasi */}
            <Command.Group heading="Navigasi Halaman" className="px-2 py-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
              <Command.Item
                onSelect={() => navigateTo("#about")}
                className="flex items-center gap-3 px-3 py-2 text-sm text-stone-800 dark:text-stone-200 rounded-lg cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
              >
                <User className="w-4 h-4 text-emerald-600" />
                <span>Tentang Chamdan (Profil & Filosofi)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo("#skills")}
                className="flex items-center gap-3 px-3 py-2 text-sm text-stone-800 dark:text-stone-200 rounded-lg cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
              >
                <Layers className="w-4 h-4 text-emerald-600" />
                <span>Keahlian & Teknologi (Bento Grid)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo("#projects")}
                className="flex items-center gap-3 px-3 py-2 text-sm text-stone-800 dark:text-stone-200 rounded-lg cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
              >
                <FolderGit2 className="w-4 h-4 text-emerald-600" />
                <span>Proyek Unggulan (Case Studies)</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo("#experience")}
                className="flex items-center gap-3 px-3 py-2 text-sm text-stone-800 dark:text-stone-200 rounded-lg cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
              >
                <Briefcase className="w-4 h-4 text-emerald-600" />
                <span>Pengalaman & Pengabdian</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo("#education")}
                className="flex items-center gap-3 px-3 py-2 text-sm text-stone-800 dark:text-stone-200 rounded-lg cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
              >
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                <span>Pendidikan & Sanad Keilmuan</span>
              </Command.Item>
              <Command.Item
                onSelect={() => navigateTo("#contact")}
                className="flex items-center gap-3 px-3 py-2 text-sm text-stone-800 dark:text-stone-200 rounded-lg cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
              >
                <Mail className="w-4 h-4 text-emerald-600" />
                <span>Kontak & Kolaborasi</span>
              </Command.Item>
            </Command.Group>

            {/* Kategori Proyek */}
            {projects.length > 0 && (
              <Command.Group heading="Proyek & Portofolio" className="px-2 py-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider mt-2">
                {projects.map((proj) => (
                  <Command.Item
                    key={proj.id}
                    onSelect={() => navigateTo(proj.url)}
                    className="flex items-center justify-between px-3 py-2 text-sm text-stone-800 dark:text-stone-200 rounded-lg cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <FolderGit2 className="w-4 h-4 text-amber-500" />
                      <div>
                        <div className="font-medium">{proj.title}</div>
                        {proj.subtitle && (
                          <div className="text-xs text-stone-400">{proj.subtitle}</div>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-stone-400 flex items-center gap-1">
                      Detail &rarr;
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}

            {/* Kategori Karya Tulis */}
            {writings.length > 0 && (
              <Command.Group heading="Risalah & Karya Tulis" className="px-2 py-1.5 text-[11px] font-semibold text-stone-400 uppercase tracking-wider mt-2">
                {writings.map((w) => (
                  <Command.Item
                    key={w.id}
                    onSelect={() => navigateTo(w.url, w.isExternal)}
                    className="flex items-center justify-between px-3 py-2 text-sm text-stone-800 dark:text-stone-200 rounded-lg cursor-pointer hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-4 h-4 text-emerald-500" />
                      <div>
                        <div className="font-medium">{w.title}</div>
                        {w.subtitle && (
                          <div className="text-xs text-stone-400">{w.subtitle}</div>
                        )}
                      </div>
                    </div>
                    <span className="text-xs text-stone-400 flex items-center gap-1">
                      {w.isExternal ? <ExternalLink className="w-3.5 h-3.5" /> : "Baca \u2192"}
                    </span>
                  </Command.Item>
                ))}
              </Command.Group>
            )}
          </Command.List>

          <div className="px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
            <span>Gunakan panah untuk navigasi, enter untuk memilih</span>
            <span className="flex items-center gap-1">
              <span>Universal Search</span>
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
            </span>
          </div>
        </Command>
      </div>
    </div>
  );
}
