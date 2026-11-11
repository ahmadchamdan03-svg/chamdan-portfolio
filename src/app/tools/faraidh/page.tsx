"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calculator,
  Scale,
  Coins,
  Share2,
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Copy,
  Info,
} from "lucide-react";

export default function FaraidhCalculatorPage() {
  const [activeTab, setActiveTab] = useState<"faraidh" | "zakat">("faraidh");

  // --- State Faraidh ---
  const [totalTirkah, setTotalTirkah] = useState<number>(100000000);
  const [debtTirkah, setDebtTirkah] = useState<number>(0);
  const [wasiatTirkah, setWasiatTirkah] = useState<number>(0);

  const [spouse, setSpouse] = useState<"none" | "husband" | "wife">("wife");
  const [numWives, setNumWives] = useState<number>(1);
  const [numSons, setNumSons] = useState<number>(1);
  const [numDaughters, setNumDaughters] = useState<number>(2);
  const [hasFather, setHasFather] = useState<boolean>(true);
  const [hasMother, setHasMother] = useState<boolean>(true);

  // --- State Zakat ---
  const [goldPrice, setGoldPrice] = useState<number>(1500000); // Rp / gram
  const [cashAsset, setCashAsset] = useState<number>(150000000);
  const [businessAsset, setBusinessAsset] = useState<number>(0);
  const [goldAssetGrams, setGoldAssetGrams] = useState<number>(0);
  const [shortTermDebt, setShortTermDebt] = useState<number>(0);

  const [copied, setCopied] = useState(false);

  // --- Logika Faraidh Turats ---
  const netTirkah = Math.max(0, totalTirkah - debtTirkah - Math.min(wasiatTirkah, (totalTirkah - debtTirkah) / 3));
  const hasChild = numSons > 0 || numDaughters > 0;

  interface ShareResult {
    waris: string;
    furudh: string;
    nominal: number;
    notes: string;
  }

  const shares: ShareResult[] = [];

  let allocatedAmount = 0;

  // 1. Pasangan (Suami / Istri)
  if (spouse === "husband") {
    const fraction = hasChild ? 1 / 4 : 1 / 2;
    const furudhStr = hasChild ? "1/4" : "1/2";
    const amount = netTirkah * fraction;
    allocatedAmount += amount;
    shares.push({
      waris: "Suami",
      furudh: furudhStr,
      nominal: amount,
      notes: hasChild ? "Karena mayit memiliki keturunan (furu')" : "Karena mayit tidak memiliki anak",
    });
  } else if (spouse === "wife") {
    const fraction = hasChild ? 1 / 8 : 1 / 4;
    const furudhStr = hasChild ? "1/8" : "1/4";
    const amount = netTirkah * fraction;
    allocatedAmount += amount;
    shares.push({
      waris: numWives > 1 ? `Istri (${numWives} orang)` : "Istri",
      furudh: furudhStr,
      nominal: amount,
      notes: `${numWives > 1 ? `Dibagi rata ${numWives} orang. ` : ""}${hasChild ? "Karena mayit memiliki keturunan" : "Karena tanpa keturunan"}`,
    });
  }

  // 2. Ibu
  if (hasMother) {
    const fraction = hasChild ? 1 / 6 : 1 / 3;
    const furudhStr = hasChild ? "1/6" : "1/3";
    const amount = netTirkah * fraction;
    allocatedAmount += amount;
    shares.push({
      waris: "Ibu",
      furudh: furudhStr,
      nominal: amount,
      notes: hasChild ? "Mendapat 1/6 karena ada anak" : "Mendapat 1/3 (tanpa anak/jamak saudara)",
    });
  }

  // 3. Ayah
  if (hasFather) {
    if (numSons > 0) {
      // Hanya 1/6 furudh mahdl
      const amount = netTirkah * (1 / 6);
      allocatedAmount += amount;
      shares.push({
        waris: "Ayah",
        furudh: "1/6",
        nominal: amount,
        notes: "Mendapat 1/6 (bersama anak laki-laki)",
      });
    } else if (numDaughters > 0) {
      // 1/6 + nanti ashobah ma'al ghoir jika ada sisa
      const amount = netTirkah * (1 / 6);
      allocatedAmount += amount;
      shares.push({
        waris: "Ayah",
        furudh: "1/6 + Sisa",
        nominal: amount,
        notes: "1/6 furudh dan menerima sisa jika masih ada",
      });
    } else {
      // Ashobah murni
      const remainingForFather = Math.max(0, netTirkah - allocatedAmount);
      allocatedAmount += remainingForFather;
      shares.push({
        waris: "Ayah",
        furudh: "Ashobah (Sisa)",
        nominal: remainingForFather,
        notes: "Menerima seluruh sisa harta (karena tidak ada anak)",
      });
    }
  }

  // 4. Keturunan (Anak Laki-laki & Perempuan)
  const remainingTirkah = Math.max(0, netTirkah - allocatedAmount);

  if (numSons > 0) {
    // Ashobah bil-ghoir (Anak laki-laki 2 bagian, anak perempuan 1 bagian)
    const totalSharesCount = numSons * 2 + numDaughters;
    const unitShare = remainingTirkah / totalSharesCount;

    const sonTotal = unitShare * 2 * numSons;
    shares.push({
      waris: `Anak Laki-laki (${numSons} orang)`,
      furudh: "Ashobah bil-Ghoir",
      nominal: sonTotal,
      notes: `Masing-masing @ Rp ${(unitShare * 2).toLocaleString("id-ID")}`,
    });

    if (numDaughters > 0) {
      const daughterTotal = unitShare * numDaughters;
      shares.push({
        waris: `Anak Perempuan (${numDaughters} orang)`,
        furudh: "Ashobah bil-Ghoir (1:2)",
        nominal: daughterTotal,
        notes: `Masing-masing @ Rp ${unitShare.toLocaleString("id-ID")}`,
      });
    }
  } else if (numDaughters > 0) {
    // Anak perempuan tanpa anak laki-laki
    const fraction = numDaughters === 1 ? 1 / 2 : 2 / 3;
    const furudhStr = numDaughters === 1 ? "1/2" : "2/3";
    const amount = Math.min(remainingTirkah, netTirkah * fraction);
    shares.push({
      waris: numDaughters === 1 ? "Anak Perempuan (Tunggal)" : `Anak Perempuan (${numDaughters} orang)`,
      furudh: furudhStr,
      nominal: amount,
      notes: numDaughters === 1 ? "Separuh harta" : `Dua pertiga dibagi rata ${numDaughters} orang`,
    });
  }

  // --- Logika Zakat Mal ---
  const nisabGoldGrams = 85;
  const nisabNominal = nisabGoldGrams * goldPrice;
  const totalZakatAsset = cashAsset + businessAsset + goldAssetGrams * goldPrice - shortTermDebt;
  const isZakatObligatory = totalZakatAsset >= nisabNominal;
  const zakatToPay = isZakatObligatory ? totalZakatAsset * 0.025 : 0;

  const handleCopySummary = () => {
    let summaryText = "";
    if (activeTab === "faraidh") {
      summaryText = `*RINGKASAN PERHITUNGAN FARAIDH (WARIS ISLAM)*\nWebsite: www.chamdan.site/tools/faraidh\n\n`;
      summaryText += `Harta Bersih: Rp ${netTirkah.toLocaleString("id-ID")}\n`;
      summaryText += `Hasil Pembagian:\n`;
      shares.forEach((s) => {
        summaryText += `- ${s.waris} [${s.furudh}]: Rp ${s.nominal.toLocaleString("id-ID")} (${s.notes})\n`;
      });
      summaryText += `\n_Dihitung berdasar kaidah Turats Fiqh Syafi'iyyah (Matan Ar-Rohabiyyah)_`;
    } else {
      summaryText = `*RINGKASAN PERHITUNGAN ZAKAT MAL*\nWebsite: www.chamdan.site/tools/faraidh\n\n`;
      summaryText += `Nisab (85g Emas): Rp ${nisabNominal.toLocaleString("id-ID")}\n`;
      summaryText += `Harta Wajib Zakat: Rp ${totalZakatAsset.toLocaleString("id-ID")}\n`;
      summaryText += `Status: ${isZakatObligatory ? "WAJIB ZAKAT" : "Belum Mencapai Nisab"}\n`;
      if (isZakatObligatory) {
        summaryText += `Zakat (2.5%): Rp ${zakatToPay.toLocaleString("id-ID")}\n`;
      }
    }

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-stone-950 text-[#1c1917] dark:text-stone-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation & Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors mb-6 group font-mono"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Beranda Portofolio</span>
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-6">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif italic text-stone-900 dark:text-stone-50">
                Kalkulator Faraidh & Zakat
              </h1>
              <p className="mt-1 text-sm text-stone-600 dark:text-stone-400 font-sans">
                Aplikasi utilitas syariah berbasis kaidah klasik Turats (Matan Ar-Rahabiyyah & Fathul Qorib).
              </p>
            </div>

            <div className="inline-flex p-1 bg-stone-200/60 dark:bg-stone-900/80 rounded-xl border border-stone-300 dark:border-stone-800 self-start sm:self-auto">
              <button
                onClick={() => setActiveTab("faraidh")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
                  activeTab === "faraidh"
                    ? "bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-400 shadow-sm font-semibold"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900"
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Waris (Faraidh)</span>
              </button>
              <button
                onClick={() => setActiveTab("zakat")}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all ${
                  activeTab === "zakat"
                    ? "bg-white dark:bg-stone-800 text-emerald-800 dark:text-emerald-400 shadow-sm font-semibold"
                    : "text-stone-600 dark:text-stone-400 hover:text-stone-900"
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>Zakat Mal</span>
              </button>
            </div>
          </div>
        </div>

        {activeTab === "faraidh" ? (
          /* TAB FARAIDH */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Form Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-6 rounded-2xl bg-white/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 backdrop-blur-md shadow-sm space-y-5">
                <h2 className="text-base font-semibold font-serif flex items-center gap-2 text-stone-900 dark:text-stone-100">
                  <Calculator className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>1. Harta Tirkah Peninggalan</span>
                </h2>

                <div>
                  <label className="block text-xs font-mono text-stone-600 dark:text-stone-400 mb-1">
                    Total Harta Kotor (Rp)
                  </label>
                  <input
                    type="number"
                    value={totalTirkah}
                    onChange={(e) => setTotalTirkah(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-stone-600 dark:text-stone-400 mb-1">
                      Hutang & Tajhiz (Rp)
                    </label>
                    <input
                      type="number"
                      value={debtTirkah}
                      onChange={(e) => setDebtTirkah(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-stone-600 dark:text-stone-400 mb-1">
                      Wasiat Sah (Maks 1/3)
                    </label>
                    <input
                      type="number"
                      value={wasiatTirkah}
                      onChange={(e) => setWasiatTirkah(Number(e.target.value) || 0)}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs flex justify-between items-center">
                  <span className="font-medium text-emerald-900 dark:text-emerald-300">Tirkah Bersih yang Dibagi:</span>
                  <span className="font-mono font-bold text-emerald-800 dark:text-emerald-400 text-sm">
                    Rp {netTirkah.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Ahli Waris Configuration */}
              <div className="p-6 rounded-2xl bg-white/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 backdrop-blur-md shadow-sm space-y-5">
                <h2 className="text-base font-semibold font-serif flex items-center gap-2 text-stone-900 dark:text-stone-100">
                  <Scale className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>2. Ahli Waris yang Ada</span>
                </h2>

                {/* Pasangan */}
                <div>
                  <label className="block text-xs font-mono text-stone-600 dark:text-stone-400 mb-2">
                    Pasangan Hidup (Zawj / Zawjah)
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["wife", "husband", "none"] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSpouse(opt)}
                        className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all ${
                          spouse === opt
                            ? "bg-emerald-700 text-white border-emerald-700 dark:bg-emerald-600"
                            : "bg-stone-100 dark:bg-stone-800 border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300"
                        }`}
                      >
                        {opt === "wife" ? "Istri" : opt === "husband" ? "Suami" : "Tidak Ada"}
                      </button>
                    ))}
                  </div>
                  {spouse === "wife" && (
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-xs text-stone-500 font-mono">Jumlah Istri:</span>
                      {[1, 2, 3, 4].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setNumWives(num)}
                          className={`w-7 h-7 rounded text-xs font-mono ${
                            numWives === num
                              ? "bg-emerald-600 text-white font-bold"
                              : "bg-stone-200 dark:bg-stone-800 text-stone-700 dark:text-stone-300"
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Orang Tua */}
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasFather}
                      onChange={(e) => setHasFather(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-medium">Ayah Kandung</span>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/40 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasMother}
                      onChange={(e) => setHasMother(e.target.checked)}
                      className="rounded text-emerald-600 focus:ring-emerald-500"
                    />
                    <span className="text-xs font-medium">Ibu Kandung</span>
                  </label>
                </div>

                {/* Anak */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-stone-600 dark:text-stone-400 mb-1">
                      Anak Laki-laki (Ibn)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={numSons}
                      onChange={(e) => setNumSons(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-stone-600 dark:text-stone-400 mb-1">
                      Anak Perempuan (Bint)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={numDaughters}
                      onChange={(e) => setNumDaughters(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Results Column */}
            <div className="lg:col-span-6 space-y-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-serif italic text-stone-900 dark:text-stone-50">
                    Hasil Pembagian Waris
                  </h2>
                  <button
                    onClick={handleCopySummary}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 transition-colors"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Tersalin!" : "Salin Hasil"}</span>
                  </button>
                </div>

                <div className="divide-y divide-stone-200 dark:divide-stone-800">
                  {shares.map((sh, idx) => (
                    <div key={idx} className="py-3.5 flex items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-stone-900 dark:text-stone-100">{sh.waris}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {sh.furudh}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">{sh.notes}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-sm font-bold text-stone-900 dark:text-emerald-400">
                          Rp {Math.round(sh.nominal).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex justify-between items-center text-xs text-stone-500 font-mono">
                  <span>Total Terbagi:</span>
                  <span className="font-bold text-stone-800 dark:text-stone-200">
                    Rp {shares.reduce((acc, s) => acc + s.nominal, 0).toLocaleString("id-ID")}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2.5">
                  <BookOpen className="w-4 h-4 shrink-0 mt-0.5" />
                  <p>
                    Perhitungan didasarkan pada madzhab Syafi'i. Untuk kasus khusus (Aul, Radd, Ghorrowain, Kalalah, atau Hajb Nuqshan/Hirman jamak saudara), disarankan bermusyawarah langsung dengan asatidz ahli faraidh pesantren.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* TAB ZAKAT MAL */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6 space-y-6">
              <div className="p-6 rounded-2xl bg-white/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 backdrop-blur-md shadow-sm space-y-5">
                <h2 className="text-base font-semibold font-serif flex items-center gap-2 text-stone-900 dark:text-stone-100">
                  <Coins className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>1. Nisab & Nilai Acuan Emas</span>
                </h2>

                <div>
                  <label className="block text-xs font-mono text-stone-600 dark:text-stone-400 mb-1">
                    Harga Emas Murni Saat Ini (Rp / Gram)
                  </label>
                  <input
                    type="number"
                    value={goldPrice}
                    onChange={(e) => setGoldPrice(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                  <p className="text-[11px] text-stone-500 mt-1 font-mono">
                    Nisab Zakat Mal (85 Gram Emas): Rp {nisabNominal.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-white/70 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 backdrop-blur-md shadow-sm space-y-5">
                <h2 className="text-base font-semibold font-serif flex items-center gap-2 text-stone-900 dark:text-stone-100">
                  <Coins className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>2. Harta Tabungan & Usaha (Telah Mencapai 1 Haul)</span>
                </h2>

                <div>
                  <label className="block text-xs font-mono text-stone-600 dark:text-stone-400 mb-1">
                    Uang Tunai, Tabungan, Deposito (Rp)
                  </label>
                  <input
                    type="number"
                    value={cashAsset}
                    onChange={(e) => setCashAsset(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-600 dark:text-stone-400 mb-1">
                    Aset Perniagaan / Nilai Barang Dagangan (Rp)
                  </label>
                  <input
                    type="number"
                    value={businessAsset}
                    onChange={(e) => setBusinessAsset(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-600 dark:text-stone-400 mb-1">
                    Emas Simpanan Tidak Dipakai (Gram)
                  </label>
                  <input
                    type="number"
                    value={goldAssetGrams}
                    onChange={(e) => setGoldAssetGrams(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-stone-600 dark:text-stone-400 mb-1">
                    Hutang Jatuh Tempo Tahun Ini (Pengurang) (Rp)
                  </label>
                  <input
                    type="number"
                    value={shortTermDebt}
                    onChange={(e) => setShortTermDebt(Number(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-6">
              <div className="p-6 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-serif italic text-stone-900 dark:text-stone-50">
                    Hasil Kalkulasi Zakat Mal
                  </h2>
                  <button
                    onClick={handleCopySummary}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 transition-colors"
                  >
                    {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? "Tersalin!" : "Salin Ringkasan"}</span>
                  </button>
                </div>

                <div className="p-4 rounded-xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800 space-y-3 font-mono text-xs">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Nisab Acuan:</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      Rp {nisabNominal.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Total Harta Kena Zakat:</span>
                    <span className="font-semibold text-stone-800 dark:text-stone-200">
                      Rp {totalZakatAsset.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-stone-200 dark:border-stone-800">
                    <span className="text-stone-500 font-sans font-medium">Status Kewajiban:</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        isZakatObligatory
                          ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300"
                          : "bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300"
                      }`}
                    >
                      {isZakatObligatory ? "WAJIB ZAKAT" : "BELUM WAJIB ZAKAT"}
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-center space-y-1">
                  <span className="text-xs text-emerald-700 dark:text-emerald-400 font-mono">
                    Besaran Zakat yang Harus Dikeluarkan (2.5%)
                  </span>
                  <div className="text-2xl sm:text-3xl font-serif font-bold text-emerald-900 dark:text-emerald-300">
                    Rp {Math.round(zakatToPay).toLocaleString("id-ID")}
                  </div>
                  {!isZakatObligatory && (
                    <p className="text-[11px] text-stone-500 pt-1">
                      Harta belum memenuhi batas nisab 85 gram emas. Namun tetap sangat dianjurkan berinfaq/sedekah sukarela.
                    </p>
                  )}
                </div>

                <div className="p-4 rounded-xl bg-stone-100 dark:bg-stone-800/50 text-xs text-stone-600 dark:text-stone-400 space-y-1">
                  <div className="flex items-center gap-1.5 font-semibold text-stone-800 dark:text-stone-200">
                    <Info className="w-3.5 h-3.5" />
                    <span>Ketentuan Syariah:</span>
                  </div>
                  <p>
                    Zakat Mal dikeluarkan setelah harta dimiliki genap satu tahun hijriyah (Haul) dan berada di atas nisab sepanjang tahun tanpa berkurang di bawah nisab menurut qaul mu'tamad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
