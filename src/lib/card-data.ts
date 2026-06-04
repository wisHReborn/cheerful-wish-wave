export interface CardData {
  to: string;
  msg: string;
  from: string;
}

export function encodeCard(data: CardData): string {
  const json = JSON.stringify(data);
  // unicode-safe base64
  const b64 = btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeCard(encoded: string): CardData | null {
  try {
    let b64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    const json = decodeURIComponent(escape(atob(b64)));
    const data = JSON.parse(json);
    if (typeof data?.to === "string" && typeof data?.msg === "string" && typeof data?.from === "string") {
      return data;
    }
    return null;
  } catch {
    return null;
  }
}
