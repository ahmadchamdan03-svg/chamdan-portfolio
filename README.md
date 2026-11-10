# Ahmad Chamdan Yuwafin : Official Portfolio
**Santri Lirboyo, Khadimul Ilmi & AI-Driven Full-Stack Web Developer**

Official Production URL: [https://www.chamdan.site](https://www.chamdan.site)  
Vercel Mirror: [https://chamdan.vercel.app](https://chamdan.vercel.app)

---

## Ringkasan Proyek

Website portofolio resmi Ahmad Chamdan Yuwafin (Chamdan), Mahasantri Ma'had Aly Lirboyo Kediri (Takhassus Fiqh wa Ushuluh). Menyatukan ketelitian tradisi turats klasik Islam dengan rekayasa web mutakhir (Next.js 16, Supabase RLS, AI Automation, dan Three.js).

## Fitur Utama

- **Hero & Kaligrafi**: Canvas PixelReveal interaktif, kaligrafi Arab vertical *Khadimul Ilmi* (خادم العلم), dan blend-mode typography "CHAMDAN".
- **Bento Grid Keahlian**: Integrasi dual-core antara keilmuan ushul fikih/sanad kitab salaf dan keahlian full-stack Next.js/Supabase/AI.
- **Portofolio & Studi Kasus Dinamis**: Menampilkan sistem nyata (Presensi Haflah 3.500+ tamu, Portal A'lawna, Bazar Stan Muktamar NU, Undangan Digital) dengan detail page di `/projects/[id]`.
- **Galeri 3D Interaktif**: Silinder foto 3D melingkar yang dapat diputar dengan mouse drag maupun sentuhan mobile.
- **Risalah Digital (Markdown Reader)**: Pembaca naskah pemikiran ilmiah dan fatwa kontemporer di `/writings/[slug]` didukung Tailwind Typography.
- **Dynamic PDF CV Generator**: Unduh CV resmi yang dihasilkan secara dinamis dari database Supabase melalui endpoint `/api/cv`.
- **Universal Search (Command Palette)**: Akses cepat keyboard shortcut `Cmd + K` atau `Ctrl + K` berbasis `cmdk`.
- **Khadim AI Assistant**: Asisten virtual bertenaga Gemini API untuk konsultasi profil dan proyek.
- **Admin Dashboard (CMS)**: Portal administrasi terlindungi di `/admin` untuk manajemen proyek, tulisan, galeri, testimoni, pelanggan newsletter, dan analitik data.
- **Formulir Kontak & Broadcast**: Proteksi spam honeypot, integrasi email Resend, dan broadcast newsletter email ke pelanggan.

## Teknologi

- **Framework**: Next.js 16 (App Router, Turbopack)
- **Runtime & Library**: React 19, TypeScript 5
- **Styling**: Tailwind CSS v4, Glassmorphism, CSS 3D
- **Database**: Supabase PostgreSQL 15 dengan Row Level Security
- **Animasi**: Framer Motion, Lenis Smooth Scroll
- **Visualisasi**: Recharts & Three.js
- **Dokumen**: @react-pdf/renderer
- **Hosting**: Vercel Edge Network (Team `ular`, Project `chamdan`)

## Menjalankan Proyek Lokal

```bash
# Instal dependensi
npm install

# Jalankan server pengembangan
npm run dev

# Jalankan build produksi
npm run build
```

## Dokumentasi Terkait

- [Panduan Admin Dashboard (CMS)](./PANDUAN_ADMIN.md)
- [Checklist Peluncuran Produksi](./LAUNCH_CHECKLIST.md)
- [Arsitektur Sistem Menyeluruh](./ARSITEKTUR_SISTEM.md)

---
&copy; 2026 Ahmad Chamdan Yuwafin. All rights reserved.
