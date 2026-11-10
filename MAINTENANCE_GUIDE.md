# Panduan Perawatan Situs Web & Audit Keamanan
**Portofolio Resmi: Ahmad Chamdan Yuwafin**
Domain: [https://www.chamdan.site](https://www.chamdan.site)

Dokumen ini disusun sebagai panduan teknis operasional jangka panjang agar pemilik situs web dapat memelihara, memperbarui konten, mengamankan data, dan mengatasi kendala teknis secara mandiri.

---

## 1. Pembaruan Konten Melalui Admin CMS

Portal Admin beralamat di: `https://www.chamdan.site/admin` atau `/login`

### Prosedur Masuk (Login)
1. Buka `https://www.chamdan.site/login`.
2. Masukkan alamat surel dan kata sandi yang telah terdaftar di Supabase Auth.
3. Setelah berhasil masuk, Anda akan diarahkan ke dasbor utama `/admin`.

### Mengelola Proyek Studi Kasus (`/admin/projects`)
* **Menambah Proyek Baru**: Klik tombol **Tambah Proyek**, lengkapi formulir (Judul, Deskripsi Singkat, Deskripsi Detail, URL Gambar, Tumpukan Teknologi, Tautan Demo, Tautan GitHub), lalu simpan.
* **Menyunting**: Klik ikon pensil pada baris proyek yang ingin diubah.
* **Menghapus**: Klik ikon tempat sampah merah. Tindakan ini permanen.

### Mengelola Risalah & Karya Tulis (`/admin/writings`)
* Tulis artikel dengan format Markdown atau teks biasa.
* Pastikan kolom `slug` diisi unik dengan huruf kecil dan tanda hubung, contoh: `dialektika-turats-dan-rekayasa-ai`.

### Mengelola Galeri 3D (`/admin/gallery`) & Testimoni (`/admin/testimonials`)
* Unggah foto dokumentasi kegiatan pesantren ke Supabase Storage (atau hosting gambar publik yang aman).
* Salin URL gambar ke formulir galeri/testimoni.

---

## 2. Mengganti Foto Hero Utama (`jacket.png` & `blueshirt.png`)

Efek *Pixel Reveal* pada bagian Hero menggunakan dua berkas foto transparan (PNG tanpa latar belakang) yang disimpan di direktori proyek:
`public/images/hero/jacket.png` (Foto bagian atas : Jas Almamater)
`public/images/hero/blueshirt.png` (Foto bagian bawah : Kemeja Santri Biru)

### Langkah Penggantian Foto
1. Siapkan 2 foto baru dengan posisi tubuh, sudut pandang kamera, dan rasio dimensi yang identik (disarankan resolusi 1200 x 1600 piksel dengan latar belakang transparan).
2. Beri nama berkas tepat sama: `jacket.png` dan `blueshirt.png`.
3. Timpa (replace) berkas lama di folder `public/images/hero/`.
4. Lakukan commit dan deploy:
   ```bash
   git add public/images/hero/
   git commit -m "chore(assets): update hero portrait photos"
   git push origin main
   ```
5. Vercel akan otomatis melakukan build ulang dan menerapkan foto baru ke `www.chamdan.site`.

---

## 3. Mengubah Profil & Bio di Supabase (Tabel `profile`)

Data personal pada Hero dan Tentang Saya terhubung langsung ke tabel `profile` di Supabase.

### Cara Melalui Dasbor Supabase
1. Masuk ke [Supabase Dashboard](https://supabase.com/dashboard).
2. Pilih proyek Anda (Project ID: `cgolcbdcnkmugwnikmwe`).
3. Buka menu **Table Editor** di bilah sisi kiri, lalu klik tabel `profile`.
4. Klik dua kali pada kolom yang ingin diubah:
   * `full_name`: Nama lengkap ("Ahmad Chamdan Yuwafin").
   * `tagline`: Slogan utama santri dan developer.
   * `bio`: Narasi singkat pengantar diri.
   * `location`: Domisili ("Kediri, Jawa Timur, Indonesia").
   * `available_for_work`: Status ketersediaan proyek (`true` / `false`).
5. Simpan perubahan. Halaman web akan menampilkan data terbaru saat dimuat ulang.

---

## 4. Prosedur Cadangan (Backup) Database Supabase

Menjaga salinan data secara berkala sangat dianjurkan untuk mengantisipasi kesalahan input atau bencana sistem.

### Opsi A: Ekspor Manual Tabel ke Berkas CSV (Direkomendasikan & Cepat)
1. Di dasbor Supabase, buka menu **Table Editor**.
2. Pilih tabel yang ingin dicadangkan (misalnya: `projects`, `writings`, `subscribers`, `messages`).
3. Di sudut kanan atas tabel, klik tombol **Export** > **Download CSV**.
4. Simpan berkas CSV tersebut di folder aman komputer Anda atau Google Drive.

### Opsi B: Cadangan SQL Lengkap Melalui Supabase CLI
Bila Anda memasang Supabase CLI di komputer lokal:
```bash
npx supabase db dump -f backup_chamdan_database.sql --db-url "DATABASE_CONNECTION_STRING"
```

---

## 5. Panduan Penanganan Kendala Teknis (Troubleshooting)

### Kendala 1: Situs Menampilkan Halaman Kosong atau 500 Server Error
1. Buka [Vercel Dashboard](https://vercel.com).
2. Pilih proyek `chamdan` > buka tab **Logs** (atau **Runtime Logs**).
3. Cari baris log bertanda merah (ERROR). Catat berkas dan baris yang menyebabkan kendala.
4. Periksa apakah Environment Variables di Vercel masih aktif (khususnya URL dan Kunci Supabase).

### Kendala 2: Formulir Kontak atau Chat AI Gagal Merespons
1. Buka situs web di browser Google Chrome / Brave / Edge.
2. Tekan tombol `F12` atau klik kanan > **Inspect** > buka tab **Console**.
3. Coba kirim pesan atau ajukan pertanyaan ke Khadim AI.
4. Jika muncul status `429 (Too Many Requests)`: Kuota API Gemini atau Resend sementara habis.
5. Jika muncul status `401 / 403`: Periksa apakah kunci API di pengaturan Vercel telah kedaluwarsa.

---

## 6. Audit Keamanan & Higienitas Lingkungan (Environment Safety)

* **Prinsip Kunci Rahasia**: Tidak ada kunci rahasia API (seperti Service Role Key Supabase, Google AI Studio Key, atau Resend API Key) yang boleh ditulis langsung di kode antarmuka (`src/components` atau `src/app`). Seluruhnya wajib dipanggil via `process.env` di API Routes sisi peladen (`src/app/api/.../route.ts`).
* **Kunci Publik Terisolasi**: Variabel berawalan `NEXT_PUBLIC_` hanya boleh digunakan untuk kunci yang memang didesain aman untuk publik (seperti `NEXT_PUBLIC_SUPABASE_ANON_KEY`).
* **Pembaruan Dependensi Berkala**: Jalankan perintah `npm audit` setiap 3 bulan untuk memverifikasi tidak adanya paket dengan celah keamanan kritis.
