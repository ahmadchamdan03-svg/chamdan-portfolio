"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Bot, X, Send, Loader2, Mic, MicOff } from "lucide-react";
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
        "Assalamu'alaikum! Saya Usth. Halwaa (Khadim AI). Ingin tahu lebih banyak mengenai karya Kang Chamdan, sanad keilmuan Lirboyo, atau rencana kolaborasi sistem?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const startVoiceInput = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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
  }, [messages, open]);

  const handleSend = async (text?: string) => {
    const prompt = text || input;
    if (!prompt.trim() || loading) return;

    const newMsgs: Message[] = [...messages, { role: "user", content: prompt.trim() }];
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
        setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);
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
      {/* Floating Trigger Button (Bottom-Left) - Compact Size (Fase 98) */}
      <div className="fixed bottom-6 left-6 z-40 group flex items-center">
        <button
          onClick={() => {
            triggerHaptic(20);
            setOpen(!open);
          }}
          className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-stone-900/90 shadow-2xl shadow-stone-950/70 transition-all duration-300 hover:scale-105 active:scale-95 border border-amber-400/50 hover:border-amber-300 cursor-pointer overflow-hidden p-1 backdrop-blur-md"
          aria-label="Tanya Usth. Halwaa"
          title="Tanya Usth. Halwaa"
        >
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-stone-800/50">
            <Image
              src="/images/halwaa.png"
              alt="Usth. Halwaa"
              fill
              sizes="56px"
              className="object-cover object-top group-hover:scale-110 transition-transform duration-300"
              priority
            />
            <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-stone-900 shadow-sm animate-pulse" />
          </div>
        </button>

        {/* Hover Tooltip (Hidden on Mobile) */}
        <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/80 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none hidden md:block border border-white/10 shadow-lg font-sans">
          Usth. Halwaa
        </div>
      </div>

      {/* Centered Chat Modal Dialog (Fase 98) */}
      {open && (
        <div
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-0 md:p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full h-[100dvh] md:h-[600px] md:max-w-2xl bg-zinc-900 border-0 md:border md:border-zinc-800 md:rounded-2xl shadow-2xl flex flex-col overflow-hidden relative">
            {/* Header */}
            <div className="p-4 md:px-6 bg-zinc-950/90 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-amber-400/40 bg-zinc-900 shadow-inner">
                  <Image
                    src="/images/halwaa.png"
                    alt="Usth. Halwaa Avatar"
                    fill
                    className="object-cover object-top"
                  />
                </div>
                <div>
                  <div className="font-serif font-bold text-white text-sm sm:text-base">
                    Usth. Halwaa (Khadim AI)
                  </div>
                  <div className="text-[11px] text-emerald-400 flex items-center gap-1.5 font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Online &bull; Powered by Gemini</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setOpen(false)}
                aria-label="Tutup dialog Khadim AI"
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages List */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 text-xs sm:text-sm"
            >
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed ${
                      m.role === "user"
                        ? "bg-emerald-600 text-white rounded-br-none shadow-md shadow-emerald-950/30"
                        : "bg-zinc-800 text-zinc-100 rounded-bl-none border border-zinc-700/80 shadow-md"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-zinc-800 rounded-2xl px-4 py-3 rounded-bl-none border border-zinc-700 flex items-center gap-2.5 text-zinc-400 text-xs sm:text-sm">
                    <Loader2 className="w-4 h-4 animate-spin text-emerald-400" />
                    <span>Khadim AI sedang mengetik...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions */}
            <div className="px-4 md:px-6 py-2.5 bg-zinc-950/70 border-t border-zinc-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
              {quickQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSend(q)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs text-zinc-300 border border-zinc-700 transition-colors shrink-0"
                >
                  {q}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="w-full p-4 md:px-6 border-t border-zinc-800 bg-zinc-900 flex items-center gap-2.5"
            >
              <input
                type="text"
                aria-label="Tulis pertanyaan untuk asisten AI"
                placeholder={
                  isListening
                    ? "Mendengarkan suara Anda..."
                    : "Tanyakan seputar Kang Chamdan, karya, atau sanad..."
                }
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-grow px-4 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="button"
                onClick={startVoiceInput}
                aria-label={
                  isListening
                    ? "Sedang mendengarkan suara"
                    : "Gunakan input suara mikrofon"
                }
                className={`p-2.5 rounded-xl transition-colors shrink-0 ${
                  isListening
                    ? "bg-red-600 text-white animate-pulse"
                    : "bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700"
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
                aria-label="Kirim pesan pertanyaan ke asisten AI"
                className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white transition-colors shrink-0"
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
