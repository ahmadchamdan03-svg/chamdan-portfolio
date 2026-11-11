"use client";

import { useState } from "react";
import {
  X,
  CreditCard,
  Copy,
  CheckCircle2,
  MessageCircle,
  ShieldCheck,
  Building2,
} from "lucide-react";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemPrice: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  itemName,
  itemPrice,
}: PaymentModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const bankName = "Bank BRI";
  const accountNumber = "320701010266508";
  const accountHolder = "Ahmad Chamdan Yuwafin";

  const handleCopyAccount = () => {
    navigator.clipboard.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const waMessage = `Halo Chamdan, saya ingin memesan *${itemName}* seharga *${itemPrice}*. Berikut bukti transfer pembayaran saya:`;
  const waUrl = `https://wa.me/6285899151685?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-stone-900/95 border border-stone-800 p-6 sm:p-8 shadow-2xl space-y-6 backdrop-blur-xl text-stone-100">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-stone-800">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Pembayaran &amp; Konfirmasi Manual</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-white tracking-tight">
              Konfirmasi Pembayaran
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup modal"
            className="p-1.5 rounded-xl bg-stone-800/60 hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Item Summary */}
        <div className="p-4 rounded-2xl bg-stone-950/80 border border-stone-800/80 flex items-center justify-between">
          <div>
            <div className="text-xs text-stone-400 font-mono">Item / Layanan:</div>
            <div className="text-base font-serif font-bold text-white mt-0.5">
              {itemName}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-stone-400 font-mono">Nominal:</div>
            <div className="text-lg font-mono font-bold text-emerald-400 mt-0.5">
              {itemPrice}
            </div>
          </div>
        </div>

        {/* Bank Transfer Card */}
        <div className="space-y-2.5">
          <p className="text-xs font-mono text-stone-400">
            Silakan transfer ke rekening bank resmi berikut:
          </p>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-stone-900 to-stone-950 border border-emerald-800/30 shadow-inner space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-400" />
                <span className="font-bold text-sm sm:text-base text-white tracking-wide">
                  {bankName}
                </span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                ATM / Mobile Banking
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-xs text-stone-400 font-mono">Nomor Rekening:</div>
              <div className="text-xl sm:text-2xl font-mono font-black tracking-wider text-amber-300">
                {accountNumber}
              </div>
              <div className="text-xs text-stone-300 font-serif">
                a.n. <span className="font-bold text-white">{accountHolder}</span>
              </div>
            </div>

            <button
              onClick={handleCopyAccount}
              className="w-full mt-2 py-2.5 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-mono font-semibold text-stone-200 flex items-center justify-center gap-2 transition-all border border-stone-700/80 cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Nomor Rekening Tersalin!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-amber-400" />
                  <span>Salin Nomor Rekening BRI</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div className="p-3.5 rounded-xl bg-stone-950/60 border border-stone-800 text-xs text-stone-400 space-y-1">
          <p className="font-medium text-stone-300">Langkah Konfirmasi:</p>
          <p>
            Setelah transfer berhasil, kirimkan foto bukti transfer ke WhatsApp dengan mengklik tombol di bawah ini. Layanan / akses Anda akan segera diaktifkan.
          </p>
        </div>

        {/* WhatsApp Action Button */}
        <div className="pt-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all shadow-xl shadow-emerald-950/50 border border-emerald-400/30 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Kirim Bukti Transfer via WA</span>
          </a>
        </div>
      </div>
    </div>
  );
}
