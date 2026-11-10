# Catatan Perubahan (Changelog)

Seluruh perubahan penting, evolusi fitur, dan pembaruan arsitektur pada situs web portofolio resmi Ahmad Chamdan Yuwafin didokumentasikan dalam dokumen ini.

Format pencatatan mengacu pada prinsip [Keep a Changelog](https://keepachangelog.com/id/1.0.0/) dan mengikuti standar [Semantic Versioning](https://semver.org/lang/id/).

---

## [1.0.0] : 2026-11-10 (Rilis Perdana / Production Launch)

Peluncuran resmi versi produksi portofolio personal Ahmad Chamdan Yuwafin (Khadimul Ilmi & AI-Driven Web Developer). Dibangun di atas fondasi Next.js 16 (App Router), Supabase PostgreSQL, Tailwind CSS v4, dan terintegrasi dengan Google Gemini 2.5 Flash serta Resend API.

### Fitur Utama yang Dirilis

#### 1. Hero Section & Interaksi Visual
* **Pixel Reveal Senter Kanvas**: Visualisasi transisi interaktif dua lapis potret (Jas Almamater resmi dan Kemeja Santri Biru) berbasis HTML5 Canvas dengan efek dither piksel responsif kursor mouse atau sentuhan jari.
* **Preloading Aset LCP**: Optimasi Largest Contentful Paint dengan pemuatan awal gambar hero berprioritas tinggi dan rasio aspek tetap (Zero Cumulative Layout Shift).
* **Tipografi & Karakter**: Kombinasi font Playfair Display, Inter, dan kaligrafi Arab Amiri "Khadimul Ilmi".

#### 2. Arsitektur Data & Supabase Backend
* **Database Relasional PostgreSQL**: 8 tabel inti terintegrasi (`profile`, `education`, `experience`, `skills`, `projects`, `writings`, `gallery`, `testimonials`, `messages`, `subscribers`).
* **Row Level Security (RLS)**: Pengamanan ketat dengan kebijakan akses publik terbatas (baca data publik, kirim pesan, langganan newsletter) dan akses mutlak mutasi (CUD) hanya untuk sesi terotentikasi.
* **Supabase Authentication**: Sistem login berbasis email dan kata sandi untuk pengamanan portal admin `/admin`.

#### 3. Portal Admin & Manajemen Konten (CMS)
* **Dashboard Navigasi & Statistik**: Pengelolaan seluruh entitas data melalui antarmuka admin yang responsif dan intuitif.
* **CRUD Modul Lengkap**: Manajemen proyek studi kasus, risalah karya tulis, dokumentasi galeri, dan testimoni rekan.
* **Kotak Masuk Pesan**: Pemantauan pesan masuk dari formulir kontak dengan penandaan status baca dan opsi balasan langsung via surel.
* **Pusat Buletin & Siaran (Broadcast)**: Tabel pemantauan pelanggan newsletter dan formulir pengiriman email siaran massal via Resend API dengan eksekusi paralel aman.

#### 4. Generator CV PDF Dinamis
* **Komponen Cetak `@react-pdf/renderer`**: Modul `CVDocument.tsx` dengan palet warna khas Emerald dan Gold.
* **Streaming API Route `/api/cv`**: Agregasi data langsung dari tabel profil, pendidikan, pengalaman, dan keahlian untuk menghasilkan berkas unduhan PDF terkini tanpa ketergantungan berkas statis.

#### 5. Khadim AI Chat Widget
* **Asisten Virtual Cerdas**: Widget percakapan terapung berbasis Google Gemini 2.5 Flash yang memahami profil, karya, dan sanad keilmuan Ahmad Chamdan Yuwafin.
* **Saran Pertanyaan Cepat**: Akses instan pengunjung untuk mengetahui proyek unggulan, latar belakang pesantren Lirboyo, dan jalur kolaborasi.

#### 6. Galeri 3D Silinder Interaktif
* **Panggung Tiga Dimensi WebGL/CSS 3D**: Penjelajahan silinder rotasi berkas dokumentasi haflah akbar, bazar muktamar, dan aktivitas majelis dengan interaksi drag pointer atau sentuhan seluler.
* **Pemuatan Bertahap (Lazy Loading)**: Pemuatan dinamis tanpa SSR di bawah lipatan layar untuk menjaga kecepatan muat halaman utama.

#### 7. Universal Command Palette & Pencarian Cepat
* **Akses Pintas Cmd+K / Ctrl+K**: Palet pencarian instan berbasis `cmdk` yang memindai seluruh bagian halaman, studi kasus proyek, dan risalah secara instan.

#### 8. Sistem Aksesibilitas (A11y) & Performa Tinggi
* **Standar WCAG AA**: Penyesuaian rasio kontras warna teks dan latar belakang gelap, atribut `alt` deskriptif di seluruh elemen citra, dan penautan eksplisit elemen label dengan input formulir.
* **Audit SEO**: Struktur judul hierarkis tunggal `<h1>` di setiap rute, meta tag Open Graph, dan skema JSON-LD Person terstruktur.
