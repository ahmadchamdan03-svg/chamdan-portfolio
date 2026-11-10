"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, X, Send, Sparkles, Loader2, Mic, MicOff } from "lucide-react";

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
        "Assalamu'alaikum! Saya Khadim AI. Ingin tahu lebih banyak mengenai karya Kang Chamdan, sanad keilmuan Lirboyo, atau rencana kolaborasi sistem?",
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
      {/* Floating Trigger Button (Bottom-Left) */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 left-6 z-40 group flex items-center gap-2.5 px-4 py-3 rounded-full bg-stone-900/90 hover:bg-stone-900 text-stone-100 shadow-xl shadow-stone-950/40 backdrop-blur-md transition-all duration-300 hover:scale-105 active:scale-95 border border-amber-500/30 cursor-pointer"
        aria-label="Tanya Khadim AI"
      >
        <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "6s" }} />
        </div>
        <span className="text-xs font-semibold tracking-wide hidden sm:inline-block">
          Tanya Khadim AI
        </span>
      </button>

      {/* Chat Window Dialog */}
      {open && (
        <div className="fixed bottom-24 left-4 sm:left-6 z-50 w-[92vw] sm:w-96 rounded-3xl bg-stone-900/95 border border-emerald-500/30 shadow-2xl backdrop-blur-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="p-4 bg-emerald-950/90 border-b border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-amber-300 font-bold text-xs border border-emerald-500/40">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="font-serif font-bold text-white text-xs sm:text-sm">
                  Khadim AI
                </div>
                <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Online &bull; Powered by Gemini</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setOpen(false)}
              aria-label="Tutup dialog Khadim AI"
              className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-emerald-900/40 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages List */}
          <div ref={scrollRef} className="p-4 space-y-3 h-80 overflow-y-auto text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                    m.role === "user"
                      ? "bg-emerald-600 text-white rounded-br-none"
                      : "bg-stone-800 text-stone-200 rounded-bl-none border border-stone-700/80"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-stone-800 rounded-2xl px-3.5 py-2.5 rounded-bl-none border border-stone-700 flex items-center gap-2 text-stone-400 text-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span>Khadim AI sedang mengetik...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick Suggestions */}
          <div className="px-3 py-2 bg-stone-950/60 border-t border-stone-800/80 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full bg-stone-800 hover:bg-stone-700 text-[10px] text-stone-300 border border-stone-700 transition-colors shrink-0"
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
            className="p-3 bg-stone-900 border-t border-stone-800 flex items-center gap-2"
          >
            <input
              type="text"
              aria-label="Tulis pertanyaan untuk asisten AI"
              placeholder={isListening ? "Mendengarkan suara Anda..." : "Tanyakan sesuatu..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-grow px-3.5 py-2 rounded-xl bg-stone-950 border border-stone-800 text-xs text-white placeholder-stone-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="button"
              onClick={startVoiceInput}
              aria-label={isListening ? "Sedang mendengarkan suara" : "Gunakan input suara mikrofon"}
              className={`p-2 rounded-xl transition-colors shrink-0 ${
                isListening
                  ? "bg-red-600 text-white animate-pulse"
                  : "bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700"
              }`}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Kirim pesan pertanyaan ke asisten AI"
              className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
