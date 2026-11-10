import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kebijakan Privasi | Ahmad Chamdan Yuwafin",
  description: "Kebijakan privasi dan tata kelola perlindungan data pengunjung situs web resmi Ahmad Chamdan Yuwafin.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#fafaf9] text-stone-900 py-16 px-4 sm:px-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 hover:text-emerald-950 mb-10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Beranda</span>
        </Link>

        <header className="mb-12 border-b border-stone-200 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Kepatuhan & Transparansi Data</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 tracking-tight mb-4">
            Kebijakan Privasi
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-mono">
            Berlaku mulai: Januari 2026 &bull; Terakhir diperbarui: 10 November 2026
          </p>
        </header>

        <div className="prose prose-stone max-w-none text-sm sm:text-base leading-relaxed space-y-6">
          <section>
            <h2 className="text-xl font-serif font-bold text-stone-900 mb-2">1. Pendahuluan</h2>
            <p className="text-stone-700">
              Situs web personal ini dioperasikan oleh <strong>Ahmad Chamdan Yuwafin</strong> (&ldquo;saya&rdquo;) yang beralamat di Pondok Pesantren Lirboyo, Kota Kediri, Jawa Timur, Indonesia. Saya menghargai privasi setiap pengunjung dan berkomitmen penuh untuk melindungi informasi pribadi yang Anda percayakan saat berinteraksi dengan layanan digital di domain <code>https://www.chamdan.site</code>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-stone-900 mb-2">2. Data yang Dikumpulkan</h2>
            <p className="text-stone-700">
              Saya hanya mengumpulkan data yang diberikan secara sadar dan sukarela oleh pengunjung melalui dua sarana interaksi:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-stone-700">
              <li>
                <strong>Formulir Kontak</strong>: Nama lengkap, alamat email, dan isi pesan atau rencana proyek yang Anda kirimkan.
              </li>
              <li>
                <strong>Langganan Buletin (Newsletter)</strong>: Alamat email yang Anda masukkan di bagian footer untuk menerima artikel ilmiah dan pembaruan sistem.
              </li>
              <li>
                <strong>Data Teknis Otomatis</strong>: Log peramban standar seperti alamat IP anonim, tipe peramban, dan waktu kunjungan yang dicatat secara agregat oleh infrastruktur Vercel untuk analitik performa.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-stone-900 mb-2">3. Tujuan Penggunaan Data</h2>
            <p className="text-stone-700">
              Informasi yang Anda berikan dimanfaatkan semata-mata untuk:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-stone-700">
              <li>Merespons pertanyaan, tawaran kolaborasi, atau undangan diskusi yang Anda sampaikan.</li>
              <li>Mengirimkan buletin berkala seputar fikih kontemporer, arsitektur AI, dan riset teknologi pesantren (hanya jika Anda mendaftar buletin).</li>
              <li>Memantau stabilitas teknis dan mengoptimalkan kecepatan muat situs web.</li>
            </ul>
            <p className="text-stone-700 font-medium">
              Data Anda tidak akan pernah dijual, disewakan, atau dibagikan kepada pihak ketiga untuk kepentingan komersial maupun periklanan.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-stone-900 mb-2">4. Penyimpanan &amp; Pengamanan Data</h2>
            <p className="text-stone-700">
              Data formulir dan kontak disimpan secara aman di pangkalan data cloud <strong>Supabase</strong> (PostgreSQL) yang dilindungi oleh enkripsi standar industri dan kebijakan <em>Row Level Security (RLS)</em>. Akses administratif ke database hanya dapat dilakukan melalui kredensial otentikasi saya secara langsung.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-stone-900 mb-2">5. Hak Pengunjung</h2>
            <p className="text-stone-700">
              Anda berhak setiap saat untuk meminta salinan data Anda, meminta penghapusan alamat email Anda dari tabel pelanggan buletin, atau meminta penghapusan riwayat percakapan. Hubungi saya langsung melalui surel di <a href="mailto:ahmadchamdan03@gmail.com" className="text-emerald-700 font-semibold underline">ahmadchamdan03@gmail.com</a>.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}