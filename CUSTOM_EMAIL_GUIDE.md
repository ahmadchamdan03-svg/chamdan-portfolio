# Panduan Membuat Email Bisnis Kustom (Custom Domain Email)
**Alamat Contoh: `halo@chamdan.site` atau `ahmad@chamdan.site`**
Tujuan: Diteruskan langsung ke surel pribadi (`ahmadchamdan03@gmail.com`)

Memiliki alamat email kustom berbasis domain Anda sendiri (`@chamdan.site`) meningkatkan kredibilitas di mata klien, pimpinan institusi, dan mitra proyek.

Berikut dua metode gratis dan mudah untuk mengaturnya:

---

## Opsi 1: Cloudflare Email Routing (Gratis 100% & Teruskan ke Gmail)

Opsi ini sangat ideal jika Anda hanya ingin menerima email di Gmail tanpa perlu membuat akun kotak surat baru yang rumit.

### Langkah-langkah
1. **Daftarkan Domain ke Cloudflare**:
   * Buat akun di [Cloudflare](https://dash.cloudflare.com).
   * Tambahkan situs `chamdan.site` dan pilih paket Free (Gratis).
   * Ubah Name Server di Rumahweb ke Name Server yang diberikan Cloudflare.
2. **Aktifkan Email Routing**:
   * Di dasbor Cloudflare, klik menu **Email Routing**.
   * Klik **Configure Email Routing**.
3. **Tambahkan Alamat Tujuan**:
   * Masukkan email pribadi Anda: `ahmadchamdan03@gmail.com`.
   * Cloudflare akan mengirimkan email konfirmasi ke Gmail Anda. Buka dan klik tombol konfirmasi.
4. **Buat Aturan Email Kustom**:
   * Buat Custom Address: `halo@chamdan.site` atau `kontak@chamdan.site`.
   * Action: **Send to** > pilih `ahmadchamdan03@gmail.com`.
5. **Tambahkan Record DNS Otomatis**:
   * Cloudflare akan secara otomatis menambahkan record MX dan TXT SPF yang dibutuhkan.
6. **Selesai**: Setiap pesan yang dikirim ke `halo@chamdan.site` akan langsung masuk ke inbox Gmail Anda.

---

## Opsi 2: Zoho Mail Forever Free Plan (Kotak Surat Penuh & Bisa Kirim)

Jika Anda membutuhkan kotak surat terpisah yang bisa mengirim dan menerima email secara independen:

### Langkah-langkah
1. Kunjungi [Zoho Mail Forever Free Plan](https://www.zoho.com/mail/zohomail-pricing.html) (Gratis hingga 5 pengguna, 5 GB per akun).
2. Daftarkan domain: `chamdan.site`.
3. Verifikasi kepemilikan domain dengan menambahkan record `TXT` di DNS Rumahweb.
4. Tambahkan record MX Zoho Mail di Rumahweb:
   * MX 1: `mx.zoho.com` (Prioritas: 10)
   * MX 2: `mx2.zoho.com` (Prioritas: 20)
   * MX 3: `mx3.zoho.com` (Prioritas: 50)
5. Tambahkan SPF Record: `v=spf1 include:zoho.com ~all`.
6. Buat nama pengguna Anda: `halo@chamdan.site`.
7. Anda dapat mengakses email melalui aplikasi Zoho Mail di ponsel Android/iOS atau mengintegrasikannya ke Gmail via SMTP/POP3.
