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
