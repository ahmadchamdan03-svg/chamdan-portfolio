# Strategi Pencadangan Database (Database Backup Strategy)
**Proyek: Supabase PostgreSQL (`cgolcbdcnkmugwnikmwe`)**
Target Situs: [https://www.chamdan.site](https://www.chamdan.site)

Dokumen ini memaparkan prosedur pencadangan data komprehensif, mulai dari ekspor berkala manual hingga otomatisasi pencadangan via GitHub Actions.

---

## 1. Cadangan Otomatis Supabase (Daily Backup & PITR)

### A. Cadangan Bawaan Supabase
* Pada seluruh proyek Supabase (termasuk paket Free), Supabase menjalankan pencadangan fisik harian (*daily automated backups*) pada level infrastruktur cloud.
* Untuk memeriksa status cadangan:
  1. Masuk ke [Supabase Dashboard](https://supabase.com/dashboard/project/cgolcbdcnkmugwnikmwe).
  2. Buka menu **Database** > **Backups**.
  3. Di tab **Scheduled Backups**, Anda dapat melihat riwayat salinan harian.

### B. Point-in-Time Recovery (PITR)
* Untuk proyek tingkat Enterprise atau paket Pro, fitur Point-in-Time Recovery (PITR) memungkinkan database dipulihkan ke detik spesifik mana pun dalam 7 hingga 30 hari terakhir jika terjadi kesalahan hapus data yang tidak disengaja.

---

## 2. Ekspor Mandiri Berkala (CSV & SQL Dump)

### Ekspor Tabel Cepat (CSV)
Bagi pengguna harian, cara paling aman dan ringan adalah mengunduh data tabel inti:
1. Buka **Table Editor** di Supabase.
2. Pilih tabel: `projects`, `writings`, `subscribers`, `messages`, `gallery`, `testimonials`.
3. Klik tombol **Export** di sudut kanan atas > pilih **Download CSV**.
4. Beri nama berkas dengan tanggal: `backup_projects_2026-11-10.csv`.

### Ekspor Skema & Data Lengkap (SQL Dump)
Menggunakan terminal lokal dengan Supabase CLI:
```bash
# Ekspor seluruh data tabel publik
npx supabase db dump --db-url "postgresql://postgres:[PASSWORD]@db.cgolcbdcnkmugwnikmwe.supabase.co:5432/postgres" --data-only -f backup_data_chamdan.sql

# Ekspor struktur skema tabel dan kebijakan RLS
npx supabase db dump --db-url "postgresql://postgres:[PASSWORD]@db.cgolcbdcnkmugwnikmwe.supabase.co:5432/postgres" --schema-only -f backup_schema_chamdan.sql
```

---

## 3. Otomatisasi Pencadangan dengan GitHub Actions (Opsional)

Anda dapat membuat alur kerja otomatis di GitHub Actions yang mencadangkan tabel setiap minggu ke artefak GitHub atau penyimpanan cloud.

Contoh berkas konfigurasi `.github/workflows/db-backup.yml`:

```yaml
name: Weekly Database Backup

on:
  schedule:
    # Berjalan setiap hari Minggu pukul 00:00 UTC
    - cron: '0 0 * * 0'
  workflow_dispatch: # Memungkinkan tombol trigger manual

jobs:
  backup:
    runs-on: ubuntu-latest
    steps:
      - name: Pasang PostgreSQL Client Tools
        run: sudo apt-get update && sudo apt-get install -y postgresql-client

      - name: Ekspor Database dari Supabase
        env:
          DB_URL: ${{ secrets.SUPABASE_DB_URL }}
        run: |
          mkdir -p backups
          TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
          pg_dump "$DB_URL" --format=c --file="backups/chamdan_db_$TIMESTAMP.dump"

      - name: Simpan Berkas Dump sebagai Artefak GitHub
        uses: actions/upload-artifact@v4
        with:
          name: supabase-backup
          path: backups/*.dump
          retention-days: 30
```
