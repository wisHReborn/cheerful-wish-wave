import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { BearCake } from "@/components/BearCake";
import { decodeCard } from "@/lib/card-data";

export const Route = createFileRoute("/wish/$code")({
  head: () => ({
    meta: [
      { title: "🎉 มีคนส่งคำอวยพรวันเกิดมาให้คุณ!" },
      { name: "description", content: "เปิดการ์ดวันเกิดสุดคิวท์ที่เพื่อนส่งให้ พร้อมตัวการ์ตูนเป่าเค้กและพลุกระดาษ" },
      { property: "og:title", content: "🎉 มีคนส่งคำอวยพรวันเกิดมาให้คุณ!" },
      { property: "og:description", content: "แตะเพื่อเป่าเทียนและรับคำอวยพรน่ารักๆ" },
    ],
  }),
  component: WishPage,
});

function WishPage() {
  const { code } = Route.useParams();
  const card = decodeCard(code);
  const [blown, setBlown] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fireConfetti = () => {
    const colors = ["#ff9eb5", "#ffd56b", "#9be3c5", "#9ccef0", "#ffb787"];
    const end = Date.now() + 1200;
    (function frame() {
      confetti({ particleCount: 5, angle: 60, spread: 70, origin: { x: 0, y: 0.8 }, colors });
      confetti({ particleCount: 5, angle: 120, spread: 70, origin: { x: 1, y: 0.8 }, colors });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    confetti({ particleCount: 120, spread: 100, origin: { y: 0.6 }, colors, scalar: 1.1 });
  };

  const playMelody = () => {
    try {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AC();
      // Happy Birthday (simplified)
      const notes: [number, number][] = [
        [392, 0.3], [392, 0.2], [440, 0.5], [392, 0.5], [523, 0.5], [494, 1.0],
        [392, 0.3], [392, 0.2], [440, 0.5], [392, 0.5], [587, 0.5], [523, 1.0],
      ];
      let t = ctx.currentTime;
      for (const [freq, dur] of notes) {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "triangle";
        o.frequency.value = freq;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.18, t + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        o.connect(g).connect(ctx.destination);
        o.start(t);
        o.stop(t + dur);
        t += dur;
      }
    } catch { /* noop */ }
  };

  const handleBlow = () => {
    if (blown) return;
    setBlown(true);
    fireConfetti();
    playMelody();
    setTimeout(fireConfetti, 800);
  };

  useEffect(() => {
    return () => audioRef.current?.pause();
  }, []);

  if (!card) {
    return (
      <main className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-5 text-center">
        <div className="text-6xl">🎈</div>
        <h1 className="mt-4 text-2xl font-bold">การ์ดนี้เปิดไม่ออก</h1>
        <p className="mt-2 text-sm text-muted-foreground">ลิงก์อาจเสียหายหรือไม่ถูกต้อง</p>
        <Link to="/" className="mt-6 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
          ← สร้างการ์ดใหม่
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center px-5 pb-10 pt-8">
      <p className="text-sm font-medium text-muted-foreground">ถึง</p>
      <h1 className="text-center text-3xl font-bold text-foreground">{card.to}</h1>

      <div className="relative my-4">
        {!blown && (
          <span
            className="pointer-events-none absolute inset-0 m-auto block h-40 w-40 rounded-full bg-primary/30 animate-pulse-ring"
            aria-hidden="true"
          />
        )}
        <BearCake blown={blown} cheering={blown} />
      </div>

      {!blown ? (
        <button
          onClick={handleBlow}
          className="mt-2 rounded-full bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-[0_6px_0_color-mix(in_oklab,var(--primary)_50%,black)] transition active:translate-y-1 active:shadow-[0_2px_0_color-mix(in_oklab,var(--primary)_50%,black)]"
        >
          🕯️ แตะเพื่อเป่าเทียน!
        </button>
      ) : (
        <div className="w-full animate-pop-in space-y-4 rounded-3xl border border-border bg-card p-6 text-center shadow-[0_8px_0_color-mix(in_oklab,var(--primary)_18%,transparent)]">
          <p className="text-2xl">🎂🎉🎈</p>
          <h2 className="font-display text-2xl font-bold text-primary">Happy Birthday!</h2>
          <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground">{card.msg}</p>
          <div className="border-t border-dashed border-border pt-3">
            <p className="text-xs text-muted-foreground">ด้วยรักจาก</p>
            <p className="text-lg font-semibold text-foreground">{card.from}</p>
          </div>
          <button
            onClick={fireConfetti}
            className="text-xs font-semibold text-primary hover:underline"
          >
            ✨ พลุอีกครั้ง
          </button>
        </div>
      )}

      <Link to="/" className="mt-8 text-xs text-muted-foreground underline-offset-2 hover:underline">
        สร้างการ์ดของคุณเอง →
      </Link>
    </main>
  );
}
