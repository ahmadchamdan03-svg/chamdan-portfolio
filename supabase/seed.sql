-- Master Seed Data for Ahmad Chamdan Yuwafin Portfolio
-- Target: Supabase PostgreSQL (`cgolcbdcnkmugwnikmwe`)

-- 1. Profile
INSERT INTO public.profile (name, tagline, about)
VALUES (
  'Ahmad Chamdan Yuwafin',
  'Santri Lirboyo, Khadimul Ilmi dan AI-Driven Web Developer',
  'Membawa tradisi keilmuan pesantren ke dalam rekayasa teknologi modern. Berpengalaman dalam kepemimpinan organisasi, kesekretariatan, pengajaran kitab salaf, dan perancangan aplikasi web full-stack terintegrasi AI.'
) ON CONFLICT DO NOTHING;

-- 2. Projects (4 Case Studies)
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

-- 3. Education (11 Riwayat Lengkap: RA Doko s.d. MHMTQ/P3TQ)
INSERT INTO public.education (institution, level, period, notes)
VALUES
(
  'RA Kusuma Mulia Doko Kediri',
  'Pendidikan Anak Usia Dini (Raudhatul Athfal)',
  '2007 - 2009',
  'Pendidikan dasar anak usia dini berkarakter Islami dan penanaman budi pekerti pesantren sejak belia.'
),
(
  'MI / SDN Doko Kediri',
  'Madrasah Ibtidaiyah / Sekolah Dasar',
  '2009 - 2015',
  'Pendidikan formal dasar dengan penekanan pada literasi, numerasi, dan akhlak mulia.'
),
(
  'MTsN 2 Kota Kediri',
  'Madrasah Tsanawiyah Negeri',
  '2015 - 2018',
  'Jenjang pendidikan menengah pertama dengan penguatan sains, bahasa Arab, dan kepemimpinan OSIS.'
),
(
  'Pondok Pesantren Darul Falah Amtsilati Jepara',
  'Pendidikan Kilat Metode Amtsilati',
  '2017',
  'Pendalaman metode akselerasi membaca kitab kuning gundul dan gramatika Arab nahwu-sharaf.'
),
(
  'Madrasah Hidayatul Mubtadi''in (MHM) Ibtidaiyyah Lirboyo',
  'Pendidikan Diniyah Salafiyah Tingkat Ibtidaiyyah',
  '2017 - 2020',
  'Fondasi gramatika bahasa Arab kitab salaf: Jurumiyyah, Imrithi, Maqshud, dan dasar fikih Safinatun Naja.'
),
(
  'Madrasah Hidayatul Mubtadi''in (MHM) Tsanawiyyah / Wustha Lirboyo',
  'Pendidikan Diniyah Salafiyah Tingkat Wustha',
  '2020 - 2022',
  'Pendalaman matan fikih Fathul Qorib, Fathul Mu''in, kaidah Ushul Fikih Ghoyatul Wushul, dan Qawa''id Fiqhiyyah.'
),
(
  'Madrasah Hidayatul Mubtadi''in (MHM) Aliyah / Ulya Lirboyo',
  'Pendidikan Diniyah Salafiyah Tingkat Ulya',
  '2022 - 2023',
  'Tamatan Aliyah MHM. Pendalaman tuntas Alfiyah Ibnu Malik 1.000 bait, Jauharul Maknun, & Jam''ul Jawami''.'
),
(
  'Ma''had Aly Lirboyo Kediri',
  'Marhalah Ula (Sarjana / S1 Kepesantrenan)',
  '2022 - Sekarang',
  'Takhassus Fikih & Ushul Fikih (Kajian Fikih Kebangsaan, Kaidah Fikih Kontemporer, dan Metodologi Bahtsul Masail).'
),
(
  'Sanad Al-Qur''anul Karim (Metode Usmani)',
  'Sanad Tahfiz & Tartil Al-Qur''an',
  '2020 - 2022',
  'Tersambung sanad muttashil melalui Masyayikh Huffadz Pondok Pesantren Lirboyo dengan tajwid dan makhorijul huruf mutqin.'
),
(
  'Sanad Keilmuan Kitab Salaf & Diniyah',
  'Ijazah Sanad Keilmuan Turats Pesantren',
  '2018 - Sekarang',
  'Sanad riwayah dan dirayah kitab-kitab Fikih Madzhab Syafi''i, Ushul Fikih, Hadis Kutubus Sittah, dan Tasawuf dari Masyayikh Lirboyo.'
),
(
  'P3TQ & MHMTQ Lirboyo Kediri',
  'Pendidikan Tahsin & Tilawah Al-Qur''an Lanjutan',
  '2023 - Sekarang',
  'Lembaga pembinaan tahsin, kepanitiaan Haflah Akhirussanah, dan khidmah kepemimpinan santri Lirboyo.'
) ON CONFLICT DO NOTHING;

-- 4. Experience (8 Riwayat: MTsN, Amtsilati, MHM, Ma'had Aly, BMKG/Eksternal, P3TQ-MHMTQ, Dzaween)
INSERT INTO public.experience (organization, period, roles)
VALUES 
(
  'Organisasi Kesiswaan MTsN',
  '2016 - 2018',
  ARRAY[
    'Pengurus OSIS & Koordinator Sie Keagamaan Madrasah',
    'Inisiator Forum Kajian Keislaman Pelajar & Lomba Kaligrafi',
    'Koordinator Kedisiplinan & Pembinaan Karakter Santri Pelajar'
  ]
),
(
  'Pesantren Amtsilati Jepara',
  '2017 - 2018',
  ARRAY[
    'Peserta Terpilih Program Akselerasi Metode Amtsilati',
    'Tutor Sebaya Praktik Membaca Kitab Kuning Gundul',
    'Koordinator Halaqah Musyawarah Nahwu & Sharaf Terpadu'
  ]
),
(
  'Madrasah Hidayatul Mubtadi''in (MHM) Lirboyo',
  '2019 - 2023',
  ARRAY[
    'Ketua Musyawarah (Syawir) Tingkat Ibtidaiyyah & Tsanawiyyah',
    'Pengajar Diniyah Kitab Fikih & Nahwu untuk Santri Junior',
    'Panitia Teknis Pelaksanaan Ujian Imtihan Caturwulan MHM'
  ]
),
(
  'Ma''had Aly Lirboyo (Takhassus Fikih)',
  '2022 - Sekarang',
  ARRAY[
    'Fasilitator Forum Diskusi Bahtsul Masail Ilmiah Mahasantri',
    'Penulis Risalah Fikih Kontemporer & Isu Kebangsaan Aktual',
    'Tim Peneliti Integrasi Nalar Fikih dengan Etika Kecerdasan Buatan (AI)'
  ]
),
(
  'Organisasi Eksternal & Kemasyarakatan',
  '2023 - 2025',
  ARRAY[
    'Ketua Umum BMKG (Badan Musyawarah Koordinasi Gabungan Santri)',
    'Inisiator Digitalisasi Database Anggota Lintas Wilayah',
    'Koordinator Bakti Sosial & Layanan Dakwah Kemasyarakatan'
  ]
),
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
  'Tim Pemasaran Dzaween Naja - Lirboyo Press',
  '2025 - 2026',
  ARRAY[
    'Workflow & Automation Engineer (Bazar Stan Muktamar NU Ke-35)',
    'Pengembang Bot WhatsApp Fonnte Terjadwal & Integrasi Google Apps Script',
    'Supervisor Rekonsiliasi Kas Masuk & Laporan Omzet Penjualan Per-Shift'
  ]
) ON CONFLICT DO NOTHING;

-- 5. Skills (6 Kategori Keahlian Lengkap)
INSERT INTO public.skills (category, items)
VALUES
(
  'Teknologi (Web & Software Engineering)',
  ARRAY[
    'Next.js 14 / 15 / 16 (App Router)',
    'React 19 & TypeScript',
    'Tailwind CSS v4 & Glassmorphism',
    'HTML Canvas & Dither Shaders',
    'Framer Motion & Animation',
    'RESTful API & Server Actions'
  ]
),
(
  'Data (Database, Backend & Security)',
  ARRAY[
    'Supabase (PostgreSQL)',
    'Row Level Security (RLS)',
    'Relational Schema Design & Indexing',
    'Database Triggers & SQL Functions',
    'Role-Based Access Control (RBAC)',
    'Vercel Edge Network'
  ]
),
(
  'Desain (UI/UX & Visual Experience)',
  ARRAY[
    'Figma UI/UX Prototyping',
    'Design Systems & Token Architecture',
    'Micro-Interactions & Shaders',
    '3D Curved Gallery (WebGL/Three.js)',
    'Responsive Mobile-First Ergonomics',
    'WCAG AA Accessibility Compliance'
  ]
),
(
  'Keagamaan (Turats & Sanad Keilmuan)',
  ARRAY[
    'Fikih Madzhab Syafi''i & Ushul Fikih',
    'Kaidah Fikih Kebangsaan & Kontemporer',
    'Metodologi Bahtsul Masail',
    'Alfiyah Ibnu Malik & Balaghah',
    'Sanad Al-Qur''anul Karim (Metode Usmani)',
    'Ilmu Falakiyah & Astronomi Hisab'
  ]
),
(
  'Kepemimpinan (Manajemen & Organisasi Pesantren)',
  ARRAY[
    'Rois Am (Pimpinan Tertinggi Ketertiban Pondok)',
    'Ketua Umum BMKG Santri Lirboyo',
    'Biro Kesekretariatan & Tata Persuratan',
    'Manajemen Kepanitiaan Akbar & 1.490+ Tamu',
    'Manajemen Alur Kerja Shift & Koordinasi Tim'
  ]
),
(
  'Teknis Bangunan (Keteknikan & Sarpras Pesantren)',
  ARRAY[
    'Perencanaan Tata Ruang & Sarana Prasarana',
    'Pengawasan Teknis Perawatan Bangunan Pesantren',
    'Instalasi Jaringan Listrik & Tata Suara Majelis',
    'Logistik Fasilitas & Pengadaan Inventaris Akbar',
    'Estimasi Kebutuhan Material & Manajemen Pembangunan'
  ]
) ON CONFLICT DO NOTHING;
