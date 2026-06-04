import { createFileRoute } from "@tanstack/react-router";
import { useState, useCallback, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import { BearCake } from "@/components/BearCake";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HappyBDay To You — ส่งการ์ดวันเกิดน่ารักๆ ให้เพื่อน" },
      { name: "description", content: "สร้างการ์ดอวยพรวันเกิดออนไลน์สุดคิวท์ พร้อมตัวการ์ตูนเป่าเค้กและพลุกระดาษ ส่งลิงก์ให้เพื่อนได้ใน 1 นาที" },
      { property: "og:title", content: "HappyBDay To You — การ์ดวันเกิดสุดคิวท์" },
      { property: "og:description", content: "สร้างการ์ดวันเกิดน่ารักๆ ส่งให้เพื่อนทางลิงก์" },
    ],
  }),
  component: CreatePage,
});

function MusicToggle() {
  const [isPlaying, setIsPlaying] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  const playBirthdayMelody = useCallback(() => {
    if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = new AC();
    }
    
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    if (ctx.state === 'suspended') return;

    const notes: [number, number][] = [
      [392, 0.4], [392, 0.2], [440, 0.6], [392, 0.6], [523, 0.6], [494, 1.2],
      [392, 0.4], [392, 0.2], [440, 0.6], [392, 0.6], [587, 0.6], [523, 1.2],
      [392, 0.4], [392, 0.2], [784, 0.6], [659, 0.6], [523, 0.6], [494, 0.6], [440, 1.2],
      [698, 0.4], [698, 0.2], [659, 0.6], [523, 0.6], [587, 0.6], [523, 1.2],
    ];

    let t = ctx.currentTime + 0.1;
    for (const [freq, dur] of notes) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "triangle";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.1, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + dur);
      t += dur;
    }

    timerRef.current = window.setTimeout(() => {
      playBirthdayMelody();
    }, (t - ctx.currentTime) * 1000);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      playBirthdayMelody();
    } else {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().then(() => {
          audioCtxRef.current = null;
        });
      }
    }

    const unlockAudio = () => {
      if (isPlaying && audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().then(() => {
          playBirthdayMelody();
        });
      }
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };

    window.addEventListener('click', unlockAudio);
    window.addEventListener('touchstart', unlockAudio);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      window.removeEventListener('click', unlockAudio);
      window.removeEventListener('touchstart', unlockAudio);
    };
  }, [isPlaying, playBirthdayMelody]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className={`flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-primary text-2xl text-white shadow-xl transition-all hover:scale-110 active:scale-95 ${isPlaying ? 'animate-wiggle' : ''}`}
        aria-label="Toggle Music"
      >
        {isPlaying ? '🎵' : '🔇'}
      </button>
      {isPlaying && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
        </span>
      )}
    </div>
  );
}

function CreatePage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [error, setError] = useState(false);
  const [isBlown, setIsBlown] = useState(false);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "0506") {
      setIsAuthorized(true);
      setError(false);
    } else {
      setError(true);
      setPasscode("");
      setTimeout(() => setError(false), 1000);
    }
  };

  const fireConfetti = useCallback(() => {
    const colors = ["#ff9eb5", "#ffd56b", "#9be3c5", "#9ccef0", "#ffb787"];
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: colors,
    });
  }, []);

  const playBlowSound = useCallback(() => {
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AC();
      const bufferSize = ctx.sampleRate * 0.5; // 0.5 seconds
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      
      // Fill with white noise
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1000, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.5);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.5, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

      noise.connect(filter).connect(gain).connect(ctx.destination);
      noise.start();
    } catch { /* noop */ }
  }, []);

  const handleBlow = () => {
    playBlowSound();
    setIsBlown(true);
    fireConfetti();
    setTimeout(fireConfetti, 400);
    setTimeout(fireConfetti, 800);
  };

  if (!isAuthorized) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 py-10">
        <div className="w-full space-y-8 rounded-[2.5rem] border border-border/50 bg-card/80 backdrop-blur-sm p-10 text-center shadow-2xl ring-1 ring-black/5 animate-pop-in">
          <div className="mx-auto mb-2 flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-4xl animate-bounce">
            🔐
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">ใส่รหัสลับวันเกิด</h1>
            <p className="text-muted-foreground">กรุณาใส่ วันและเดือน เป็นตัวเลขให้ถูกต้อง</p>
          </div>
          
          <form onSubmit={handleAuth} className="space-y-6">
            <div className="relative">
              <input
                type="text"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value.replace(/\D/g, "").slice(0, 4))}
                placeholder="เช่น 0101"
                className={`w-full rounded-2xl border-2 bg-input/50 px-6 py-4 text-center text-3xl font-bold tracking-[0.5em] outline-none transition-all ${
                  error ? "border-destructive animate-wiggle" : "border-transparent focus:border-primary focus:bg-card"
                }`}
                autoFocus
              />
              {error && <p className="mt-2 text-sm font-semibold text-destructive">รหัสไม่ถูกต้อง ลองใหม่อีกครั้งนะ 🥺</p>}
            </div>
            
            <button
              type="submit"
              className="w-full rounded-2xl bg-primary py-4 text-lg font-bold text-primary-foreground shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              ยืนยันวันเกิด 🎂
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <>
      {isBlown ? (
        <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 pb-10 pt-8 animate-pop-in">
          <h1 className="text-center text-4xl font-bold text-foreground mb-6 drop-shadow-sm">
            เย้! เป่าดับแล้ว 🎂
          </h1>
          <div className="relative my-4 group cursor-pointer" onClick={fireConfetti}>
            <div className="absolute -inset-4 bg-primary/20 rounded-full blur-2xl animate-pulse" />
            <BearCake blown={true} cheering={true} />
          </div>
          <div className="mt-8 w-full space-y-4 rounded-[2.5rem] border border-border/50 bg-card/80 backdrop-blur-sm p-10 text-center shadow-2xl ring-1 ring-black/5 animate-pop-in [animation-delay:200ms]">
            <p className="text-5xl animate-bounce">🎉✨🎈</p>
            <h2 className="text-3xl font-bold text-primary tracking-tight">Happy Birthday!</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              ขอให้มีความสุขมากๆ นะ!<br />
              ขอให้เป็นปีที่ดีและเต็มไปด้วยรอยยิ้ม
            </p>
            <div className="pt-6">
              <button 
                onClick={() => setIsBlown(false)}
                className="rounded-2xl bg-secondary px-8 py-3 text-sm font-semibold text-secondary-foreground hover:bg-secondary/80 transition-all hover:scale-105 active:scale-95"
              >
                ← กลับไปหน้าเป่าเค้ก
              </button>
            </div>
          </div>
          <p className="mt-8 text-xs text-muted-foreground/60 italic">แตะที่น้องหมีเพื่อจุดพลุอีกรอบ! ✨</p>
        </main>
      ) : (
        <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 py-10 overflow-hidden">
          <div className="mb-10 flex w-full justify-center gap-2" aria-hidden="true">
            {["--sprinkle-pink", "--sprinkle-yellow", "--sprinkle-mint", "--sprinkle-sky", "--sprinkle-peach", "--sprinkle-pink", "--sprinkle-yellow"].map((c, i) => (
              <span
                key={i}
                className="block h-4 w-4 rotate-45 rounded-md shadow-sm"
                style={{ backgroundColor: `var(${c})`, animation: `float-bob 3s ease-in-out ${i * 0.2}s infinite` }}
              />
            ))}
          </div>
          <div className="text-center space-y-2 mb-10">
            <h1 className="text-5xl font-bold text-foreground tracking-tighter sm:text-6xl leading-tight">
              Happy birthday <br />
              <span className="text-primary">To You</span>
            </h1>
            <p className="text-lg text-muted-foreground font-medium">มาเป่าเค้กกันดีกว่าาาาาาา 🎂</p>
          </div>
          <div className="my-10 scale-110 sm:scale-125 transition-all duration-700 hover:scale-[1.2] sm:hover:scale-[1.4] drop-shadow-xl">
            <BearCake />
          </div>
          <button
            onClick={handleBlow}
            className="mt-10 group relative flex items-center justify-center overflow-hidden rounded-full bg-primary px-14 py-6 text-2xl font-black text-primary-foreground shadow-[0_10px_0_color-mix(in_oklab,var(--primary)_50%,black)] transition-all hover:scale-105 active:translate-y-2 active:shadow-[0_2px_0_color-mix(in_oklab,var(--primary)_50%,black)]"
          >
            <span className="relative z-10 flex items-center gap-3">🕯️ เป่าเค้กเลย!</span>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </button>
          <div className="mt-12 flex flex-col items-center gap-2">
            <p className="text-sm font-semibold text-muted-foreground/80 animate-pulse">แตะปุ่มเพื่อเซอร์ไพรส์ ✨</p>
            <div className="h-1 w-12 rounded-full bg-primary/20" />
          </div>
          <div className="fixed -bottom-32 -left-32 h-80 w-80 rounded-full bg-primary/10 blur-[100px] animate-pulse" />
          <div className="fixed -top-32 -right-32 h-80 w-80 rounded-full bg-secondary/20 blur-[100px] animate-pulse [animation-delay:1s]" />
        </main>
      )}
      <MusicToggle />
    </>
  );
}
