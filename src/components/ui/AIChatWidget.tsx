"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { X, Send, Loader2, Mic, MicOff } from "lucide-react";
import { triggerHaptic } from "@/components/providers/PWAProvider";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Assalamu'alaikum! Saya Usth. Halwaa, asisten pribadi Kang Chamdan. Ada yang bisa saya bantu terkait karya teknologi, risalah turats, atau rencana kolaborasi sistem?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) setOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  const startVoiceInput = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Browser Anda belum mendukung input suara (Web Speech API).");
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = "id-ID";
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput(transcript);
        }
      };
      recognition.onerror = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, open, loading]);

  const handleSend = async (text?: string) => {
    const prompt = text || input;
    if (!prompt.trim() || loading) return;

    const newMsgs: Message[] = [
      ...messages,
      { role: "user", content: prompt.trim() },
    ];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMsgs }),
      });

      const data = await res.json();
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.reply },
        ]);
      } else {
        throw new Error();
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Afwan, terjadi kendala saat menghubungi server AI. Anda dapat langsung bertanya ke Kang Chamdan via WhatsApp di pojok kanan bawah.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickQuestions = [
    "Apa saja sistem yang dibangun Kang Chamdan?",
    "Bagaimana latar belakang Ma'had Aly Lirboyo?",
    "Cara menghubungi untuk kolaborasi proyek?",
  ];

  return (
    <>
      {/* Floating Trigger Button (Bottom-Left) - Pill Shape (Fase 99) */}
      {!open && (
        <div className="fixed bottom-6 left-6 z-40 animate-in fade-in duration-300">
          <button
            onClick={() => {
              triggerHaptic(20);
              setOpen(true);
            }}
            className="flex items-center gap-3 pl-2 pr-5 py-2 rounded-full bg-emerald-700 dark:bg-zinc-900 border border-emerald-500/40 dark:border-amber-400/40 shadow-2xl shadow-emerald-950/40 dark:shadow-stone-950/80 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer backdrop-blur-md group"
            aria-label="Tanya Usth. Halwaa"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-white/20 dark:border-amber-400/50 bg-stone-800 shrink-0">
              <Image
                src="/images/halwaa.png"
                alt="Usth. Halwaa"
                fill
                sizes="40px"
                className="object-cover object-top group-hover:scale-110 transition-transform duration-300"
                priority
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-zinc-900 shadow-sm animate-pulse" />
            </div>
            <div className="text-left">
              <div className="text-xs sm:text-sm font-bold text-white tracking-tight leading-none mb-0.5">
                Usth. Halwaa
              </div>
              <div className="text-[10px] text-emerald-200 dark:text-emerald-400 font-medium leading-none">
                Asisten AI
              </div>
            </div>
          </button>
        </div>
      )}

      {/* Centered Modal Dialog (Fase 99) */}
      {open && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-3xl h-[85vh] rounded-3xl overflow-hidden flex flex-col shadow-2xl bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 relative">
            {/* Header */}
            <div className="bg-slate-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 px-5 sm:px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border border-amber-400/50 bg-stone-900 shadow-inner shrink-0">
                  <Image
                    src="/images/halwaa.png"
                    alt="Usth. Halwaa"
                    fill
                    sizes="44px"
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-zinc-900 dark:text-white leading-tight">
                    Tanya Usth. Halwaa
                  </h3>
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Asisten Pribadi Chamdan</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                aria-label="Tutup dialog tanya Usth. Halwaa"
                className="p-2 rounded-full text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white hover:bg-slate-200/80 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Area Chat (Scrollable) */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 text-sm bg-slate-50/50 dark:bg-zinc-950"
            >
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.role === "assistant" ? (
                    <div className="flex items-start gap-2.5 max-w-[85%] sm:max-w-[75%]">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border border-amber-400/40 bg-zinc-900 shrink-0 mt-1">
                        <Image
                          src="/images/halwaa.png"
                          alt="Usth. Halwaa"
                          fill
                          sizes="32px"
                          className="object-cover object-top"
                        />
                      </div>
                      <div className="bg-zinc-800 text-zinc-200 rounded-2xl rounded-tl-sm px-4 py-2.5 border border-zinc-700 shadow-sm leading-relaxed text-xs sm:text-sm">
                        {m.content}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-emerald-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[80%] shadow-sm leading-relaxed text-xs sm:text-sm">
                      {m.content}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex justify-start items-start gap-2.5">
                  <div className="relative w-8 h-8 rounded-full overflow-hidden border border-amber-400/40 bg-zinc-900 shrink-0 mt-1">
                    <Image
                      src="/images/halwaa.png"
                      alt="Usth. Halwaa"
                      fill
                      sizes="32px"
                      className="object-cover object-top"
                    />
                  </div>
                  <div className="bg-zinc-800 text-zinc-300 rounded-2xl rounded-tl-sm px-4 py-2.5 border border-zinc-700 flex items-center gap-2 text-xs sm:text-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Usth. Halwaa sedang menulis jawaban...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions */}
            <div className="px-4 sm:px-6 py-2.5 bg-slate-100/80 dark:bg-zinc-900/80 border-t border-slate-200 dark:border-zinc-800 flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white dark:bg-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-700 text-xs text-zinc-700 dark:text-zinc-300 border border-slate-300 dark:border-zinc-700 transition-colors shrink-0 cursor-pointer shadow-xs"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Area Input (Bawah) */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="p-4 sm:px-6 bg-slate-50 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex items-center gap-2.5 shrink-0"
            >
              <input
                type="text"
                aria-label="Tulis pertanyaan untuk Usth. Halwaa"
                placeholder={
                  isListening
                    ? "Mendengarkan suara Anda..."
                    : "Tanyakan seputar Kang Chamdan, karya, atau sanad..."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-full text-zinc-900 dark:text-white px-5 py-3 text-xs sm:text-sm placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:border-emerald-500 shadow-inner transition-colors"
              />
              <button
                type="button"
                onClick={startVoiceInput}
                aria-label={
                  isListening
                    ? "Sedang mendengarkan suara"
                    : "Gunakan input suara mikrofon"
                }
                className={`p-3 rounded-full transition-colors shrink-0 cursor-pointer ${
                  isListening
                    ? "bg-red-600 text-white animate-pulse"
                    : "bg-slate-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white hover:bg-slate-300 dark:hover:bg-zinc-700"
                }`}
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </button>
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Kirim pesan pertanyaan ke Usth. Halwaa"
                className="w-11 h-11 rounded-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white flex items-center justify-center transition-colors shrink-0 shadow-md cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
