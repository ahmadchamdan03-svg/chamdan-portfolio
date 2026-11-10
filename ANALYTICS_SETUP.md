# Panduan Integrasi Google Analytics 4 (GA4)
**Domain: [https://www.chamdan.site](https://www.chamdan.site)**

Dokumen ini memandu langkah-langkah membuat properti Google Analytics 4 (GA4) dan menghubungkan Measurement ID ke aplikasi Next.js 16 untuk memantau data demografi pengunjung, halaman terpopuler, dan sumber traffic.

---

## 1. Membuat Akun & Properti GA4

1. Buka [Google Analytics](https://analytics.google.com).
2. Masuk menggunakan akun Google (`ahmadchamdan03@gmail.com`).
3. Klik tombol **Admin** (ikon gerigi di kiri bawah) > klik **Buat Properti** (Create Property).
4. Masukkan nama properti: `Ahmad Chamdan Portfolio`.
5. Pilih Zona Waktu: `Indonesia (WIB)` dan Mata Uang: `IDR (Rp)`.
6. Pilih Kategori Industri: *Technology / Education*.
7. Pada menu **Pilih Platform**, pilih **Web**.
8. Masukkan URL Situs: `https://www.chamdan.site` dan Nama Aliran Data: `chamdan.site web stream`.
9. Klik **Buat Aliran** (Create Stream).
10. Salin **ID Pengukuran** (Measurement ID) Anda yang berformat:
    `G-XXXXXXXXXX`

---

## 2. Menghubungkan ID Pengukuran ke Next.js 16

Next.js menyediakan paket resmi berkinerja tinggi `@next/third-parties/google` yang memuat script analitik secara asinkron tanpa memperlambat skor LCP atau Core Web Vitals.

### Cara 1: Menggunakan `@next/third-parties/google` (Direkomendasikan)
1. Pasang paket di proyek:
   ```bash
   npm install @next/third-parties@latest
   ```
2. Tambahkan komponen `<GoogleAnalytics />` di dalam `src/app/layout.tsx`:
   ```tsx
   import { GoogleAnalytics } from "@next/third-parties/google";

   export default function RootLayout({ children }: { children: React.ReactNode }) {
     return (
       <html lang="id">
         <body>
           {children}
         </body>
         <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || "G-XXXXXXXXXX"} />
       </html>
     );
   }
   ```
3. Tambahkan variabel lingkungan di dasbor Vercel Settings > Environment Variables:
   * **Key**: `NEXT_PUBLIC_GA_ID`
   * **Value**: `G-XXXXXXXXXX` (ID dari Google Analytics Anda)

---

## 3. Verifikasi Data Real-Time di Google Analytics

1. Setelah deploy ke Vercel selesai, buka situs `https://www.chamdan.site` di tab baru.
2. Buka dasbor Google Analytics > menu **Laporan** (Reports) > **Waktu Nyata** (Realtime).
3. Anda akan melihat minimal 1 pengguna aktif di peta Indonesia dengan halaman aktif `/`.
