-- Seed data for Ahmad Chamdan Yuwafin Portfolio
-- Profile
INSERT INTO public.profile (name, tagline, about)
VALUES (
  'Ahmad Chamdan Yuwafin',
  'Santri Lirboyo, Khadimul Ilmi dan AI-Driven Web Developer',
  'Membawa tradisi keilmuan pesantren ke dalam rekayasa teknologi modern. Berpengalaman dalam kepemimpinan organisasi, kesekretariatan, pengajaran kitab salaf, dan perancangan aplikasi web full-stack terintegrasi AI.'
) ON CONFLICT DO NOTHING;

-- Projects
INSERT INTO public.projects (title, description, tech_stack, image_url)
VALUES 
(
  'Sistem Presensi & Administrasi Digital Haflah P3TQ',
  'Platform web terpusat untuk operasional kepanitiaan Haul & Haflah P3TQ-MHMTQ Lirboyo Kediri. Mengakomodasi otentikasi berbasis 4 peran kepanitiaan, live counter kehadiran gerbang, verifikasi manual, hingga sinkronisasi data presensi secara real-time.',
  ARRAY['Next.js', 'React', 'TypeScript', 'Supabase', 'Row Level Security', 'Tailwind CSS', 'Vercel', 'QR Code Scanner Engine'],
  '/images/projects/haflah-presensi.png'
),
(
  'Website Angkatan & Portal Wisuda A''lawna',
  'Portal web representatif angkatan tamatan Aliyah P3TQ-MHMTQ ''Alawna''. Menampilkan arsip dokumentasi wisuda akbar, data statistik santriwati & dewan asatidz, serta asisten virtual cerdas terintegrasi (A''lawna Intelligence).',
  ARRAY['Next.js', 'React', 'Tailwind CSS', 'Vercel', 'Generative AI Widget', 'Responsive UI/UX'],
  '/images/projects/alawna-portal.png'
),
(
  'Sistem Penjualan & Otomasi Pelaporan Buku Dzaween',
  'Sistem otomasi pencatatan kasir dan pelaporan omzet penjualan buku terpadu untuk stan bazar Tim Dzaween pada perhelatan Muktamar NU Ke-35. Menggabungkan form transaksi cepat, reminder disiplin shift otomatis, dan rekapan penjualan harian via WhatsApp Bot.',
  ARRAY['Google Forms & Sheets', 'Fonnte WhatsApp API', 'Google Apps Script', 'Cron/Event Triggers', 'Automated Auditing'],
  '/images/projects/dzaween-sales.png'
),
(
  'Portal Undangan Digital Interaktif Wali Santri',
  'Portal undangan digital berbasis web yang dipersonalisasi khusus bagi setiap wali santri Haflah P3TQ-MHMTQ. Menghadirkan pengalaman interaktif dari pembukaan sampul undangan eksklusif, formulir estimasi kehadiran dua zona, hingga navigasi denah lokasi dan asisten virtual (Usth. Tanya).',
  ARRAY['Next.js', 'Tailwind CSS', 'Mobile-First Responsive', 'Tailwind Glassmorphism', 'Usth. Tanya AI Assistant'],
  '/images/projects/undangan-digital.png'
) ON CONFLICT DO NOTHING;


-- Experience
INSERT INTO public.experience (organization, period, roles)
VALUES 
(
  'Pondok Pesantren Lirboyo (P3TQ-MHMTQ)',
  '2024 - Sekarang',
  ARRAY[
    'Rois Am Pondok Pesantren (Koordinator Kepemimpinan & Ketertiban Santri)',
    'Khadimul Ilmi & Pengajar Kitab Salaf (Fikih, Nahwu Sharaf & Falak)',
    'Lead Pengarah Transformasi Digital & Tata Kelola Administrasi Pesantren'
  ]
),
(
  'Kepanitiaan Haul & Haflah Akbar P3TQ-MHMTQ',
  '2025 - 2027',
  ARRAY[
    'Fullstack Lead & System Architect (Platform Presensi & Portal Undangan Digital)',
    'Koordinator Tata Kelola Akses Multi-Otoritas & 1.490+ Kuota Undangan',
    'Integrator Otomasi AI Concierge Lapangan & Scanner Real-Time'
  ]
),
(
  'Badan Musyawarah Koordinasi Gabungan (BMKG) Santri',
  '2023 - 2025',
  ARRAY[
    'Ketua Umum BMKG (Memimpin Konsolidasi Organisasi Lintas Wilayah)',
    'Inisiator Digitalisasi Database Anggota & Sistem Pelaporan Berkala',
    'Fasilitator Forum Musyawarah Ilmiah & Bahtsul Masail Antar-Pondok'
  ]
),
(
  'Tim Pemasaran Dzaween Naja - Lirboyo Press',
  '2025 - 2026',
  ARRAY[
    'Workflow & Automation Engineer (Bazar Stan Muktamar NU Ke-35)',
    'Pengembang Bot WhatsApp Fonnte Terjadwal & Integrasi Google Apps Script',
    'Supervisor Rekonsiliasi Kas Masuk & Laporan Omzet Penjualan Per-Shift'
  ]
) ON CONFLICT DO NOTHING;

-- Education
INSERT INTO public.education (institution, level, period, notes)
VALUES
(
  'Ma''had Aly Lirboyo Kediri',
  'Marhalah Ula (Sarjana / S1 Kepesantrenan)',
  '2022 - Sekarang',
  'Takhassus Fikih & Ushul Fikih (Kajian Fikih Kebangsaan, Kaidah Fikih Kontemporer, dan Metodologi Bahtsul Masail).'
),
(
  'Madrasah Hidayatul Mubtadi''in (MHM) Lirboyo',
  'Pendidikan Diniyah Formal Salafiyah (Wustha - Ulya)',
  '2017 - 2023',
  'Tamatan Aliyah MHM. Pendalaman intensif Turats Klasik: Fathul Qorib, Fathul Mu''in, Alfiyah Ibnu Malik, & Jauharul Maknun.'
),
(
  'Sanad Al-Qur''anul Karim (Metode Usmani)',
  'Sanad Tahfiz & Tartil Al-Qur''an',
  '2020 - 2022',
  'Tersambung sanad muttashil melalui Masyayikh Huffadz Pondok Pesantren Lirboyo dengan penekanan tajwid dan makhorijul huruf mutqin.'
),
(
  'Sanad Keilmuan Kitab Salaf & Diniyah',
  'Ijazah Sanad Keilmuan Turats Pesantren',
  '2018 - Sekarang',
  'Sanad riwayah dan dirayah kitab-kitab Fikih Madzhab Syafi''i, Ushul Fikih, Hadis Kutubus Sittah, dan Tasawuf dari Masyayikh Lirboyo.'
) ON CONFLICT DO NOTHING;
