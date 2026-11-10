# Panduan Pemantauan Keandalan Situs (Uptime Monitoring)
**Domain: [https://www.chamdan.site](https://www.chamdan.site)**

Sistem pemantauan waktu aktif (*uptime monitor*) bertugas melakukan *ping* ke situs web Anda secara otomatis setiap beberapa menit. Jika situs mengalami kendala (HTTP 500, time out, atau down), sistem akan segera mengirimkan notifikasi instan ke WhatsApp atau Email Anda.

---

## 1. Rekomendasi Layanan Pemantauan Gratis

1. **UptimeRobot** ([uptimerobot.com](https://uptimerobot.com)) : Paket gratis hingga 50 monitor dengan interval pengecekan per 5 menit. Sangat stabil dan mendukung peringatan via Email dan integrasi webhook.
2. **Better Stack** ([betterstack.com](https://betterstack.com)) : Antarmuka modern, pemantauan status per 3 menit gratis, serta status page publik yang elegan.

---

## 2. Langkah Menyiapkan UptimeRobot untuk `chamdan.site`

1. Kunjungi [UptimeRobot](https://uptimerobot.com) dan buat akun baru.
2. Setelah masuk ke dasbor, klik tombol **+ Add New Monitor**.
3. Isi parameter pemantauan:
   * **Monitor Type**: `HTTP(s)`
   * **Friendly Name**: `Ahmad Chamdan Portfolio Main`
   * **URL (or IP)**: `https://www.chamdan.site`
   * **Monitoring Interval**: `5 minutes`
   * **Monitor Timeout**: `30 seconds`
4. Pada bagian **Select "Alert Contacts To Notify"**, centang alamat surel pribadi Anda (`ahmadchamdan03@gmail.com`).
5. Klik **Create Monitor**.

### Menambahkan Monitor Kedua (API Health Check)
Buat satu monitor tambahan untuk mengawasi kesehatan endpoint API:
* **Friendly Name**: `Chamdan Site API Health`
* **URL**: `https://www.chamdan.site/api/health` (atau endpoint chat)
* **Monitoring Interval**: `5 minutes`

---

## 3. Menghubungkan Peringatan ke WhatsApp (Opsional via Webhook)

Jika Anda ingin notifikasi langsung masuk ke nomor WhatsApp:
1. Di UptimeRobot, buka menu **Settings** > **Alert Contacts** > **Add Alert Contact**.
2. Pilih tipe: **Web-hook** atau **Telegram**.
3. Hubungkan dengan bot Telegram pribadi atau gateway WhatsApp (seperti Fonnte atau Wablas).
4. Setiap kali situs web tidak dapat diakses lebih dari 1 menit, Anda akan menerima pesan darurat di ponsel Anda.
