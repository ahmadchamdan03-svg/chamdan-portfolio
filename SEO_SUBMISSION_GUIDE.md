# Panduan Google Search Console & Pengindeksan SEO
**Domain: [https://www.chamdan.site](https://www.chamdan.site)**

Dokumen ini memandu langkah demi langkah mendaftarkan situs portofolio ke Google Search Console (GSC) agar halaman situs segera dirayapi (crawled) dan diindeks oleh mesin pencari Google.

---

## 1. Pendaftaran Domain di Google Search Console

1. Kunjungi [Google Search Console](https://search.google.com/search-console).
2. Masuk menggunakan akun Google Anda (disarankan `ahmadchamdan03@gmail.com`).
3. Pada dialog penambahan properti, pilih salah satu metode verifikasi berikut:
   * **Metode Rekomendasi (Domain)**:
     * Masukkan nama domain: `chamdan.site` (tanpa `https://` atau `www`).
     * Google akan memberikan sebuah record DNS bertipe `TXT`, contohnya: `google-site-verification=xxxxxxxxxxxxxxxxxxxx`.
     * Buka panel DNS provider domain Anda (Rumahweb), tambahkan record `TXT` baru dengan nilai tersebut.
     * Kembali ke Google Search Console dan klik tombol **Verifikasi** (Verify).
   * **Metode Alternatif (Prefix URL)**:
     * Masukkan URL lengkap: `https://www.chamdan.site`.
     * Pilih opsi verifikasi **Tag HTML** (HTML tag).
     * Salin nilai kode verifikasi dan masukkan ke tag `<meta name="google-site-verification" content="..." />` di `src/app/layout.tsx`.

---

## 2. Mengirimkan Peta Situs (Sitemap Submission)

Setelah kepemilikan domain berhasil diverifikasi di Google Search Console:

1. Di menu bilah sisi kiri GSC, klik **Peta Situs** (Sitemaps).
2. Pada bagian **Tambahkan peta situs baru** (Add a new sitemap), masukkan jalur berikut:
   `sitemap.xml`
3. Klik tombol **Kirim** (Submit).
4. Google akan membaca berkas `https://www.chamdan.site/sitemap.xml` yang secara otomatis memuat:
   * Beranda (`/`)
   * Seluruh rute studi kasus (`/projects/[id]`)
   * Seluruh risalah digital (`/writings/[slug]`)
   * Halaman login publik (`/login`)
5. Status peta situs akan berubah menjadi **Sukses** (Success) berwarna hijau dalam beberapa menit hingga beberapa jam.

---

## 3. Meminta Pengindeksan Halaman Beranda (URL Inspection)

Agar halaman utama diindeks dalam hitungan hari tanpa menunggu jadwal perayap berkala:

1. Di bilah pencarian paling atas Google Search Console ("Periksa URL apa pun di chamdan.site"), ketik:
   `https://www.chamdan.site/`
2. Tekan Enter. GSC akan memeriksa status URL di indeks Google.
3. Klik tombol **Uji URL Langsung** (Test Live URL) untuk memastikan Googlebot dapat membaca halaman dengan sempurna.
4. Setelah hasil uji hijau, klik tombol **Minta Pengindeksan** (Request Indexing).

---

## 4. Memeriksa Status Pengindeksan di Hasil Pencarian

Untuk mengetahui apakah Google sudah menampilkan situs Anda kepada publik:

1. Buka [Google Search](https://www.google.com).
2. Ketik kata kunci operator penelusuran:
   ```text
   site:chamdan.site
   ```
3. Jika Google sudah selesai mengindeks, halaman beranda dan rute karya tulis Anda akan muncul lengkap dengan judul dan meta deskripsi.
4. Anda juga dapat mencari dengan kata kunci nama Anda: `"Ahmad Chamdan Yuwafin"` atau `"Santri Lirboyo AI Web Developer"`.
