import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan | Ahmad Chamdan Yuwafin",
  description: "Syarat dan ketentuan penggunaan situs web portofolio resmi Ahmad Chamdan Yuwafin.",
};

export default function TermsPage() {
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
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>Ketentuan Layanan &amp; Etika Penggunaan</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-stone-900 tracking-tight mb-4">
            Syarat &amp; Ketentuan
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 font-mono">
            Berlaku mulai: Januari 2026 &bull; Terakhir diperbarui: 10 November 2026
          </p>
        </header>

        <div className="prose prose-stone max-w-none text-sm sm:text-base leading-relaxed space-y-6">
          <section>
            <h2 className="text-xl font-serif font-bold text-stone-900 mb-2">1. Ketentuan Umum</h2>
            <p className="text-stone-700">
              Dengan mengakses dan menggunakan situs web <code>https://www.chamdan.site</code>, Anda menyatakan setuju untuk terikat oleh Syarat dan Ketentuan ini, seluruh hukum dan peraturan perundang-undangan Republik Indonesia yang berlaku, serta etika keilmuan pesantren.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-stone-900 mb-2">2. Hak Kekayaan Intelektual</h2>
            <p className="text-stone-700">
              Seluruh materi di dalam situs web ini, mencakup namun tidak terbatas pada artikel risalah, dokumentasi foto kegiatan, kode arsitektur antarmuka, dan logo grafis, merupakan kekayaan intelektual milik <strong>Ahmad Chamdan Yuwafin</strong> kecuali dinyatakan sebaliknya (seperti foto kemitraan atau lisensi pustaka terbuka).
            </p>
            <ul className="list-disc pl-6 space-y-2 text-stone-700">
              <li>
                <strong>Karya Tulis &amp; Pemikiran</strong>: Anda diperkenankan mengutip sebagian isi risalah untuk keperluan ilmiah dan diskusi dengan mencantumkan rujukan atribusi nama penulis dan tautan sumber asli.
              </li>
              <li>
                <strong>Kode Sumber Terbuka</strong>: Kode yang saya publikasikan secara terbuka di repositori GitHub tunduk pada lisensi terbuka (MIT License) masing-masing repositori.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-stone-900 mb-2">3. Penggunaan Asisten Khadim AI</h2>
            <p className="text-stone-700">
              Widget percakapan Khadim AI didukung oleh model bahasa Google Gemini 2.5 Flash yang dirancang untuk mempermudah pengunjung mempelajari karya dan profil saya. Tanggapan dari Khadim AI bersifat informatif dan tidak dapat dijadikan fatwa hukum syariah mengikat atau kontrak hukum formal tanpa konfirmasi langsung dari saya.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-stone-900 mb-2">4. Batasan Tanggung Jawab</h2>
            <p className="text-stone-700">
              Situs ini disediakan dalam kondisi apa adanya (&ldquo;as is&rdquo;). Meskipun saya berupaya semaksimal mungkin menjaga keakuratan informasi dan keandalan sistem, saya tidak bertanggung jawab atas kerugian tidak langsung yang timbul akibat gangguan konektivitas atau ketidaktersediaan sementara pada layanan pihak ketiga.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-serif font-bold text-stone-900 mb-2">5. Kontak &amp; Narahubung</h2>
            <p className="text-stone-700">
              Pertanyaan mengenai Syarat dan Ketentuan ini dapat dialamatkan langsung ke:
              <br />
              <strong>Ahmad Chamdan Yuwafin</strong>
              <br />
              Pondok Pesantren Lirboyo, Kota Kediri, Jawa Timur, Indonesia
              <br />
              Surel: <a href="mailto:ahmadchamdan03@gmail.com" className="text-emerald-700 font-semibold underline">ahmadchamdan03@gmail.com</a>
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}