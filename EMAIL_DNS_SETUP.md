# Panduan Konfigurasi DNS Resend (SPF, DKIM, DMARC)
**Domain: [chamdan.site](https://chamdan.site)**
Penyedia Domain: Rumahweb
Penyedia Pengiriman Email: [Resend](https://resend.com)

Agar email dari formulir kontak dan siaran buletin dikirim dengan reputasi tinggi (tidak masuk ke folder Spam atau diblokir oleh Gmail/Yahoo), Anda perlu menambahkan record DNS verifikasi domain di panel Rumahweb.

---

## 1. Menambahkan Domain di Dasbor Resend

1. Masuk ke akun Anda di [Resend Dashboard](https://resend.com/overview).
2. Di bilah menu kiri, klik **Domains** > klik tombol **Add Domain**.
3. Masukkan nama domain Anda:
   `chamdan.site`
4. Pilih Region pengiriman (disarankan: *Singapore* atau *US East*).
5. Klik **Add Domain**. Resend akan menghasilkan daftar DNS Records unik untuk domain Anda.

---

## 2. Memasukkan Record DNS di Panel Domain Rumahweb

1. Masuk ke Client Area [Rumahweb](https://clientzone.rumahweb.com).
2. Buka menu **Domains** > pilih domain **chamdan.site** > klik **Kelola DNS** (DNS Management).
3. Tambahkan record-record berikut sesuai data yang ditampilkan di dasbor Resend Anda:

### A. Record DKIM (DomainKeys Identified Mail)
*Kunci kriptografi untuk memvalidasi bahwa email benar-benar dikirim dari chamdan.site.*
* **Tipe**: `CNAME` atau `TXT` (sesuai instruksi Resend)
* **Nama / Host**: `resend._domainkey` (atau sub-kunci unik dari Resend)
* **Nilai / Value / Target**: Nilai token publik yang diberikan Resend (contoh: `feedback-smtp.resend.com` atau string `p=...`)
* **TTL**: `14400` atau `Default`

### B. Record SPF (Sender Policy Framework)
*Mengesahkan server Resend untuk mengirim email atas nama domain chamdan.site.*
* **Tipe**: `TXT`
* **Nama / Host**: `bounces` (atau `@` jika disyaratkan)
* **Nilai / Value**: `v=spf1 include:resend.com ~all`
* **TTL**: `14400` atau `Default`

### C. Record DMARC (Domain-based Message Authentication)
*Kebijakan perlindungan anti-spoofing dan anti-phishing.*
* **Tipe**: `TXT`
* **Nama / Host**: `_dmarc`
* **Nilai / Value**: `v=DMARC1; p=none; rua=mailto:dmarc-reports@chamdan.site;`
* **TTL**: `14400` atau `Default`

### D. Record MX (Mail Exchanger untuk Subdomain Resend)
*Hanya jika Anda menggunakan subdomain bounces dari Resend:*
* **Tipe**: `MX`
* **Nama / Host**: `bounces`
* **Prioritas**: `10`
* **Nilai / Target**: `feedback-smtp.resend.com`

---

## 3. Melakukan Verifikasi di Dasbor Resend

1. Setelah semua record DNS disimpan di Rumahweb, tunggu proses propagasi DNS (biasanya 5 hingga 30 menit).
2. Kembali ke dasbor Resend > buka tab **Domains** > klik tombol **Verify Records**.
3. Jika seluruh baris berstatus **Verified** (centang hijau), domain Anda telah aktif 100%.
4. Kini API pengiriman di situs web (`/api/send-email` dan `/api/broadcast`) dapat mengirimkan email dari alamat resmi seperti `noreply@chamdan.site` atau `newsletter@chamdan.site` langsung ke kotak masuk utama penerima.
