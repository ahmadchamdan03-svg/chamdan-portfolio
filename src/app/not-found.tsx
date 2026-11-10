"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Home, Play, RotateCcw, Volume2, VolumeX, Sparkles } from "lucide-react";

export default function NotFound() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Audio synthesizer for jump and crash blips
  const playBeep = (freq: number, type: OscillatorType = "sine", duration = 0.1) => {
    if (!soundEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // AudioContext unavailable or restricted
    }
  };

  useEffect(() => {
    const saved = localStorage.getItem("santri_jump_highscore");
    if (saved) setHighScore(parseInt(saved, 10) || 0);
  }, []);

  const startGame = () => {
    setIsPlaying(true);
    setGameOver(false);
    setScore(0);
    playBeep(440, "sine", 0.15);
  };

  useEffect(() => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let currentScore = 0;

    // Game state
    const player = {
      x: 50,
      y: 120,
      width: 24,
      height: 34,
      vy: 0,
      gravity: 0.65,
      jumpStrength: -10,
      isGrounded: true,
    };

    interface Obstacle {
      x: number;
      y: number;
      width: number;
      height: number;
    }

    let obstacles: Obstacle[] = [];
    let frameCount = 0;
    let speed = 4;

    const jump = () => {
      if (player.isGrounded) {
        player.vy = player.jumpStrength;
        player.isGrounded = false;
        playBeep(580, "triangle", 0.12);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        jump();
      }
    };

    const handleTouch = (e: TouchEvent | MouseEvent) => {
      e.preventDefault();
      jump();
    };

    window.addEventListener("keydown", handleKeyDown);
    canvas.addEventListener("touchstart", handleTouch, { passive: false });
    canvas.addEventListener("mousedown", handleTouch);

    const groundY = 160;

    const loop = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw starry ground
      ctx.fillStyle = "#1c1917";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "#10b981";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, groundY);
      ctx.lineTo(canvas.width, groundY);
      ctx.stroke();

      // Update Player
      player.vy += player.gravity;
      player.y += player.vy;
      if (player.y >= groundY - player.height) {
        player.y = groundY - player.height;
        player.vy = 0;
        player.isGrounded = true;
      }

      // Draw Santri Character
      // Kopyah / Peci Hitam
      ctx.fillStyle = "#0c0a09";
      ctx.fillRect(player.x + 4, player.y, 16, 7);

      // Wajah Santri
      ctx.fillStyle = "#fbcfe8";
      ctx.fillRect(player.x + 6, player.y + 7, 12, 9);

      // Baju Koko Putih
      ctx.fillStyle = "#f5f5f4";
      ctx.fillRect(player.x + 3, player.y + 16, 18, 10);

      // Sarung Santri Hijau
      ctx.fillStyle = "#059669";
      ctx.fillRect(player.x + 2, player.y + 26, 20, 8);

      // Spawn Obstacles (Tumpukan Kitab Kuning)
      if (frameCount % Math.max(70, 110 - Math.floor(currentScore / 50)) === 0) {
        const obsHeight = 22 + Math.random() * 12;
        obstacles.push({
          x: canvas.width,
          y: groundY - obsHeight,
          width: 18,
          height: obsHeight,
        });
      }

      // Move & Draw Obstacles
      for (let i = obstacles.length - 1; i >= 0; i--) {
        const obs = obstacles[i];
        obs.x -= speed;

        // Draw Kitab Kuning obstacle
        ctx.fillStyle = "#d97706"; // Amber kitab cover
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.fillStyle = "#fef3c7"; // Paper edges
        ctx.fillRect(obs.x + 2, obs.y + 2, obs.width - 4, obs.height - 4);
        ctx.fillStyle = "#78350f";
        ctx.fillRect(obs.x + 4, obs.y + 4, obs.width - 8, obs.height - 8);

        // Collision Check (AABB)
        if (
          player.x < obs.x + obs.width &&
          player.x + player.width > obs.x &&
          player.y < obs.y + obs.height &&
          player.y + player.height > obs.y
        ) {
          // Game Over!
          playBeep(220, "sawtooth", 0.25);
          setIsPlaying(false);
          setGameOver(true);
          return;
        }

        // Passed obstacle score increment
        if (obs.x + obs.width < 0) {
          obstacles.splice(i, 1);
          currentScore += 10;
          setScore(currentScore);
          setHighScore((prev) => {
            const nextMax = Math.max(prev, currentScore);
            localStorage.setItem("santri_jump_highscore", nextMax.toString());
            return nextMax;
          });
          if (currentScore % 100 === 0) {
            speed += 0.5;
            playBeep(880, "sine", 0.1);
          }
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("keydown", handleKeyDown);
      canvas.removeEventListener("touchstart", handleTouch);
      canvas.removeEventListener("mousedown", handleTouch);
    };
  }, [isPlaying, soundEnabled]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-[#0a100d] text-stone-100 selection:bg-emerald-500 selection:text-black">
      <div className="relative max-w-lg w-full p-6 sm:p-8 rounded-3xl bg-stone-900/90 border border-emerald-500/20 shadow-2xl text-center backdrop-blur-xl space-y-6">
        {/* Arabic Spiritual Wisdom Quote */}
        <div className="text-emerald-400 font-serif text-lg tracking-wide">
          أَيْنَ تَذْهَبُونَ
        </div>

        <div>
          <div className="text-5xl sm:text-6xl font-serif font-black text-amber-400 tracking-tight">
            404
          </div>
          <h1 className="text-lg sm:text-xl font-serif font-bold text-white mt-1">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-xs text-stone-400 mt-1 max-w-sm mx-auto">
            Jangan khawatir! Sembari kembali ke jalur, mainkan mini-game retro: bantu santri melompati tumpukan kitab kuning.
          </p>
        </div>

        {/* Mini Game Box */}
        <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800">
          <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 mb-2 px-1">
            <span className="flex items-center gap-1 text-emerald-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Skor: {score}</span>
            </span>
            <span>Tertinggi: {highScore}</span>
            <button
              onClick={() => setSoundEnabled((prev) => !prev)}
              className="text-stone-400 hover:text-white p-1 rounded transition-colors"
              title="Toggle Suara"
            >
              {soundEnabled ? (
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <VolumeX className="w-3.5 h-3.5 text-stone-500" />
              )}
            </button>
          </div>

          <div className="relative overflow-hidden rounded-xl border border-stone-800/80 bg-stone-900">
            <canvas
              ref={canvasRef}
              width={420}
              height={180}
              className="w-full h-[180px] block cursor-pointer"
              onClick={() => {
                if (!isPlaying && !gameOver) startGame();
              }}
            />

            {!isPlaying && !gameOver && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4">
                <button
                  onClick={startGame}
                  className="px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-500/20 transition-all mb-2"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Mulai Main &quot;Santri Jump&quot;</span>
                </button>
                <span className="text-[10px] font-mono text-stone-300">
                  Tekan Spasi / Tap layar untuk lompat
                </span>
              </div>
            )}

            {gameOver && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4">
                <span className="text-rose-400 font-bold text-sm mb-1 font-mono">
                  GAME OVER!
                </span>
                <span className="text-xs text-stone-300 mb-3">
                  Skor Anda: <strong className="text-white">{score}</strong>
                </span>
                <button
                  onClick={startGame}
                  className="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Main Lagi</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Back to Home Button */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium text-xs transition-all border border-stone-700/60"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda Utama</span>
          </Link>
        </div>
      </div>
    </div>
  );
}