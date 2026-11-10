# Laporan Serah Terima Proyek (Project Handover Report)
**Ahmad Chamdan Yuwafin : Official Portfolio & Digital System**
*Versi 1.0.0 : Status: Production Ready & Live*

Dokumen ini merupakan laporan serah terima resmi (handover) seluruh aset kode, infrastruktur awan, dan hak pengelolaan situs web portofolio personal dari pengembang kepada pemilik situs web, Ahmad Chamdan Yuwafin.

---

## 1. Tautan & Repositori Resmi

* **Domain Utama Produksi**: [https://www.chamdan.site](https://www.chamdan.site)
* **Mirror Domain Vercel**: [https://chamdan.vercel.app](https://chamdan.vercel.app)
* **Portal Admin CMS**: [https://www.chamdan.site/admin](https://www.chamdan.site/admin) (atau `/login`)
* **Repositori GitHub**: [https://github.com/ahmadchamdan03-svg/chamdan-portfolio.git](https://github.com/ahmadchamdan03-svg/chamdan-portfolio.git) (Cabang: `main`)

---

## 2. Layanan & Ekosistem Terhubung

| Layanan / Penyedia | Proyek / Akun Terdaftar | Fungsi Utama |
| :--- | :--- | :--- |
| **Vercel** | Proyek: `chamdan` (Tim: `ular`) | Hosting Next.js, Edge Network, Domain SSL, CI/CD |
| **Supabase** | Proyek ID: `cgolcbdcnkmugwnikmwe` | Database PostgreSQL, Row Level Security, Auth, Storage |
| **Google AI Studio** | Model: `gemini-2.5-flash` | Mesin kecerdasan buatan widget Khadim AI |
| **Resend** | Domain: `chamdan.site` | Pengiriman surel formulir kontak & siaran buletin massal |
| **Rumahweb** | Domain Registrar: `chamdan.site` | Pengaturan DNS Name Server ke Vercel |

---

## 3. Daftar Variabel Lingkungan (Environment Variables)

Semua variabel telah terpasang di dasbor Vercel Settings > Environment Variables:

1. `NEXT_PUBLIC_SUPABASE_URL`: Alamat endpoint REST API Supabase proyek Anda.
2. `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Kunci publik anonim dengan otorisasi terbatas RLS.
3. `SUPABASE_SERVICE_ROLE_KEY`: Kunci peladen administratif Supabase untuk otentikasi internal (rahasia).
4. `GEMINI_API_KEY`: Kunci API Google AI Studio untuk pemrosesan obrolan Khadim AI.
5. `RESEND_API_KEY`: Kunci API Resend untuk pengiriman surel otomatis.

*Catatan Keamanan: Nilai kunci di atas bersifat rahasia dan tidak pernah disimpan dalam kode repositori publik.*

---

## 4. Instruksi Pengelolaan Portal Admin

1. Akses halaman `/login`.
2. Masuk menggunakan surel terdaftar Supabase Auth Anda.
3. Melalui portal `/admin`, Anda memiliki hak penuh untuk:
   * Mengunggah, menyunting, dan menghapus data proyek portofolio.
   * Menulis dan menerbitkan risalah karya tulis (dengan slug URL otomatis).
   * Memperbarui foto dokumentasi galeri 3D dan testimoni mitra.
   * Membaca dan menanggapi pesan langsung dari pengunjung situs.
   * Mengirim email siaran (broadcast newsletter) ke seluruh pengunjung yang mendaftar.

---

## 5. Ringkasan Kelayakan & Kestabilan

* **Zero Error Production Build**: Seluruh 28 rute (statis, dinamis, dan API) terkompilasi bersih tanpa peringatan TypeScript.
* **Aksesibilitas & Kontras**: Telah memenuhi kriteria WCAG AA dengan label navigasi lengkap untuk pembaca layar (screen reader).
* **Performa LCP & CLS**: Aset Hero dimuat lebih awal dengan dimensi rasio tetap untuk mencegah pergeseran tata letak.
