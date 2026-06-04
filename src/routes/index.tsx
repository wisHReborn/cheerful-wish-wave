import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { BearCake } from "@/components/BearCake";
import { encodeCard } from "@/lib/card-data";

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

function CreatePage() {
  const [to, setTo] = useState("");
  const [msg, setMsg] = useState("");
  const [from, setFrom] = useState("");
  const [copied, setCopied] = useState(false);

  const link = useMemo(() => {
    if (!to.trim() || !msg.trim() || !from.trim()) return "";
    const code = encodeCard({ to: to.trim(), msg: msg.trim(), from: from.trim() });
    if (typeof window === "undefined") return `/wish/${code}`;
    return `${window.location.origin}/wish/${code}`;
  }, [to, msg, from]);

  const previewPath = useMemo(() => {
    if (!link) return "";
    return new URL(link).pathname;
  }, [link]);

  const handleCopy = async () => {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* noop */
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col items-center px-5 pb-16 pt-10">
      {/* Bunting */}
      <div className="mb-2 flex w-full justify-center gap-1.5" aria-hidden="true">
        {["sprinkle-pink", "sprinkle-yellow", "sprinkle-mint", "sprinkle-sky", "sprinkle-peach", "sprinkle-pink", "sprinkle-yellow"].map((c, i) => (
          <span
            key={i}
            className={`block h-3 w-3 rotate-45 rounded-sm bg-${c}`}
            style={{ animation: `float-bob 3s ease-in-out ${i * 0.15}s infinite` }}
          />
        ))}
      </div>

      <h1 className="text-center text-4xl font-bold text-foreground">
        HappyBDay <span className="text-primary">To You</span>
      </h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        สร้างการ์ดวันเกิดสุดคิวท์ใน 1 นาที 🎂
      </p>

      <div className="my-2">
        <BearCake />
      </div>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="w-full space-y-4 rounded-3xl border border-border bg-card p-6 shadow-[0_8px_0_color-mix(in_oklab,var(--primary)_15%,transparent)]"
      >
        <Field label="ถึงเพื่อน (To)" value={to} onChange={setTo} placeholder="ชื่อเพื่อนที่จะอวยพร" />
        <div>
          <label className="mb-1.5 block text-sm font-medium text-foreground">ข้อความอวยพร</label>
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="สุขสันต์วันเกิดนะเพื่อน ขอให้มีความสุขมากๆ 🎉"
            rows={4}
            maxLength={400}
            className="w-full resize-none rounded-2xl border border-input bg-input/30 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-card"
          />
          <p className="mt-1 text-right text-xs text-muted-foreground">{msg.length}/400</p>
        </div>
        <Field label="จากใคร (From)" value={from} onChange={setFrom} placeholder="ชื่อของคุณ" />

        <button
          type="button"
          onClick={handleCopy}
          disabled={!link}
          className="w-full rounded-2xl bg-primary px-5 py-4 text-base font-semibold text-primary-foreground shadow-[0_5px_0_color-mix(in_oklab,var(--primary)_50%,black)] transition active:translate-y-0.5 active:shadow-[0_2px_0_color-mix(in_oklab,var(--primary)_50%,black)] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {copied ? "✓ คัดลอกลิงก์แล้ว!" : "🎁 สร้างลิงก์อวยพร"}
        </button>

        {link && (
          <div className="space-y-2 rounded-2xl bg-muted p-3 text-xs">
            <p className="break-all text-muted-foreground">{link}</p>
            <Link
              to="/wish/$code"
              params={{ code: previewPath.split("/").pop() ?? "" }}
              className="inline-block font-semibold text-primary underline-offset-2 hover:underline"
            >
              👀 ดูตัวอย่างการ์ด →
            </Link>
          </div>
        )}
      </form>
    </main>
  );
}

function Field({
  label, value, onChange, placeholder,
}: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-foreground">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={60}
        className="w-full rounded-2xl border border-input bg-input/30 px-4 py-3 text-sm outline-none transition focus:border-primary focus:bg-card"
      />
    </div>
  );
}
