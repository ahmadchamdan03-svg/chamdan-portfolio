# Panduan Operasional Admin Dashboard (CMS)
**Ahmad Chamdan Yuwafin Portfolio (chamdan.site)**

Dokumen ini berisi panduan teknis dan operasional bagi Administrator (Kang Chamdan) dalam mengelola seluruh konten dan data pada website portofolio `www.chamdan.site`.

---

## 1. Akses Portal Admin

- **URL Login**: `https://www.chamdan.site/login`
- **Kredensial**: Menggunakan akun Supabase Authentication (Email dan Kata Sandi admin yang terdaftar di proyek Supabase `cgolcbdcnkmugwnikmwe`).
- **Dashboard Utama**: `https://www.chamdan.site/admin`

---

## 2. Fitur & Modul Dashboard

### A. Ringkasan & Pesan Masuk (`/admin`)
- Menampilkan total metrik: Proyek, Karya Tulis, Foto Galeri 3D, Pelanggan Buletin, dan Pesan Masuk.
- Tabel **Pesan Masuk Terbaru**: Melihat nama, email, dan pesan yang dikirim pengunjung melalui formulir kontak.

### B. Manajemen Proyek (`/admin/projects`)
- **Tambah Proyek Baru**:
  - Judul Proyek, Domain/Kategori, Peran/Posisi, Platform.
  - Deskripsi Singkat (tampil di kartu beranda).
  - Deskripsi Lengkap & Latar Belakang (tampil di halaman detail `/projects/[id]`).
  - Fitur Utama (dipisahkan baris baru).
  - Dampak Nyata / Metrik (dipisahkan baris baru).
  - Tech Stack (dipisahkan koma, contoh: `Next.js 16, Supabase, Tailwind, TypeScript`).
  - Unggah foto tangkapan layar langsung ke Supabase Storage (`portfolio-assets`) atau masukkan URL gambar.
- **Sunting / Hapus Proyek**: Klik tombol pensil untuk mengedit atau tombol tempat sampah untuk menghapus.

### C. Karya Tulis & Risalah Digital (`/admin/writings`)
- **Tulis Risalah Baru**:
  - Judul Risalah (otomatis menghasilkan slug URL ramah SEO).
  - Kategori (contoh: `Risalah Fikih`, `Kajian Kontemporer`, `Opini Ilmiah`).
  - Tahun/Tanggal publikasi.
  - Ringkasan / Abstrak.
  - Isi Naskah Lengkap dalam format **Markdown** (`# Judul`, `## Sub-judul`, teks tebal, poin, kutipan kitab).
  - Link Dokumen PDF (opsional jika memiliki berkas fisik).
- Pembaca dapat membaca naskah langsung di halaman dinamis `/writings/[slug]`.

### D. Galeri 3D Interaktif (`/admin/gallery`)
- Mengelola foto-foto yang berputar pada silinder 3D di beranda.
- Unggah file dokumentasi majelis, kegiatan pesantren, atau tangkapan layar sistem.
- Masukkan keterangan foto yang akan tampil pada indikator "01 / 06".

### E. Testimoni & Apresiasi Guru (`/admin/testimonials`)
- Mengelola rekomendasi dan kutipan dari dewan pengasuh, ketua panitia, dan kolega teknis.
- Menyertakan nama, jabatan/peran, institusi (contoh: *Pondok Pesantren Lirboyo*), isi kutipan, dan foto avatar.

### F. Pelanggan Buletin & Siaran Email (`/admin/subscribers`)
- Melihat daftar email pengunjung yang berlangganan newsletter melalui footer.
- **Kirim Broadcast**:
  - Isi judul dan pesan kabar / ringkasan artikel baru.
  - Tekan tombol **Kirim Broadcast** untuk mengirimkan email secara serentak ke seluruh pelanggan via endpoint `/api/broadcast`.

### G. Statistik & Analytics (`/admin/analytics`)
- **Grafik Batang (Bar Chart)**: Memantau volume pesan masuk dan penambahan subscriber per bulan.
- **Grafik Lingkaran (Pie Chart)**: Melihat sebaran karya tulis berdasarkan rumpun keilmuan.

---

## 3. Keamanan & Kebijakan Data
- Seluruh tabel database dilindungi oleh Supabase Row Level Security (RLS).
- Aksi tulis/ubah/hapus dibatasi khusus bagi sesi terotentikasi.
- Endpoint kontak dilengkapi honeypot bot-filtering untuk mencegah spam otomatis.
