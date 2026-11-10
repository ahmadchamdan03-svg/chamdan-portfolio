# Arsitektur Sistem Website Portofolio
**Ahmad Chamdan Yuwafin (www.chamdan.site)**

Dokumen ini mendokumentasikan arsitektur teknis menyeluruh, arsitektur data, alur otentikasi, dan pola rendering yang diimplementasikan pada portofolio resmi Ahmad Chamdan Yuwafin.

---

## 1. Stack Teknologi Utama

| Layer | Komponen / Library | Fungsi |
|---|---|---|
| **Framework** | Next.js 16 (App Router) | Server-Side Rendering, Static Generation, Dynamic Route Handlers |
| **Bahasa** | TypeScript 5 | Type-safety penuh di seluruh modul database dan komponen UI |
| **Styling** | Tailwind CSS v4 | Utilitas styling modern, Glassmorphism, CSS 3D Transforms |
| **Database & Auth** | Supabase (PostgreSQL 15) | Relational database, Row Level Security (RLS), Auth, Storage |
| **Animasi & Interaksi** | Framer Motion & Lenis | Smooth scrolling, scroll-triggered reveals, page transitions |
| **Grafika 3D** | Three.js & CSS 3D Engine | Curved cylindrical photo gallery, canvas pixel reveal |
| **Dokumen PDF** | @react-pdf/renderer | Dynamic PDF CV generation and streaming |
| **Pencarian** | cmdk | Universal search Command Palette modal (Cmd+K) |
| **Kecerdasan Buatan** | Google Gemini API | Asisten "Khadim AI" untuk menjawab pertanyaan pengunjung |
| **Deployment** | Vercel (Production) | Global Edge Network, Analytics, Speed Insights |

---

## 2. Struktur Direktori Proyek

```
src/
├── app/
│   ├── layout.tsx                # Root layout dengan Font Amiri, Playfair, Inter & JSON-LD
│   ├── page.tsx                  # Beranda perakitan seluruh 10 section portofolio
│   ├── template.tsx              # Transisi halus antar halaman (Framer Motion)
│   ├── error.tsx                 # Error boundary elegan tema Emerald & Gold
│   ├── global-error.tsx          # Critical system error handler
│   ├── not-found.tsx             # Halaman 404 kustom
│   ├── opengraph-image.tsx       # Dynamic OG image generator via ImageResponse
│   ├── sitemap.ts                # Sitemap XML dinamis dari Supabase
│   ├── robots.ts                 # Robots.txt crawler rules
│   ├── login/page.tsx            # Portal login admin Supabase Auth
│   ├── admin/                    # Admin Dashboard (CMS)
│   │   ├── layout.tsx            # Admin sidebar navigation
│   │   ├── page.tsx              # Overview metrik & pesan masuk
│   │   ├── projects/page.tsx     # CRUD studi kasus proyek
│   │   ├── writings/page.tsx     # CRUD risalah digital & editor Markdown
│   │   ├── gallery/page.tsx      # CRUD foto galeri 3D & upload file
│   │   ├── testimonials/page.tsx # CRUD testimoni & rekomendasi guru
│   │   ├── subscribers/page.tsx  # Kelola pelanggan buletin & kirim broadcast
│   │   └── analytics/page.tsx    # Grafik visualisasi data via Recharts
│   ├── projects/[id]/page.tsx    # Dynamic Case Study detail page
│   ├── writings/[slug]/page.tsx  # Dynamic Risalah Digital reader
│   └── api/
│       ├── cv/route.ts           # Dynamic PDF CV generation & stream
│       ├── chat/route.ts         # Khadim AI Gemini API endpoint
│       ├── send-email/route.ts   # Form kontak & Resend notification
│       └── broadcast/route.ts    # Broadcast email ke seluruh subscriber
├── components/
│   ├── layout/                   # Navbar, Footer, SmoothScroll
│   ├── sections/                 # Hero, About, Skills, Projects, Gallery, Writings, Testimonials, Experience, Education, Contact
│   ├── ui/                       # Skeleton, Reveal, CursorTrail, WhatsAppButton, AIChatWidget, CommandPalette
│   └── pdf/                      # CVDocument (@react-pdf/renderer)
├── lib/
│   └── supabase.ts               # Supabase Client singleton
└── types/
    └── database.ts               # Skema TypeScript untuk seluruh entitas database
```

---

## 3. Keamanan Data & Row Level Security (RLS)

1. **Akses Publik (Read-Only)**:
   - `profile`, `projects`, `skills`, `experience`, `education`, `gallery`, `writings`, `testimonials`: Diizinkan `SELECT` untuk semua pengunjung publik.
2. **Akses Tulis Publik Terbatas**:
   - `messages`: Pengunjung diizinkan melakukan `INSERT` (dengan proteksi bot honeypot pada API route).
   - `subscribers`: Pengunjung diizinkan melakukan `INSERT` alamat email untuk berlangganan buletin.
3. **Akses Penuh Admin Terautentikasi**:
   - Seluruh mutasi data (`INSERT`, `UPDATE`, `DELETE`) pada konten utama dibatasi hanya untuk sesi pengguna dengan role `authenticated`.
