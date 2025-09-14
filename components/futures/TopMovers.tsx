"use client";

import { useEffect, useState } from "react";

type Mover = {
  symbol: string;
  lastPrice: number;
  priceChangePercent: number; // percent (e.g. -2.34 or 5.67)
  priceChange: number; // absolute price change
  volume: number; // quoteVolume or base volume
};

export default function TopMovers({ limit = 12 }: { limit?: number }) {
  const [movers, setMovers] = useState<Mover[]>([]);
  const API = "https://fapi.binance.com/fapi/v1/ticker/24hr";

  useEffect(() => {
    let mounted = true;

    async function fetchTop() {
      try {
        const res = await fetch(API);
        if (!res.ok) throw new Error("fetch failed");
        const data = await res.json(); // array of tickers

        // filter for USDT pairs (futures)
        const usdt = data.filter((t: any) => typeof t.symbol === "string" && t.symbol.endsWith("USDT"));

        const mapped: Mover[] = usdt.map((t: any) => ({
          symbol: t.symbol,
          lastPrice: parseFloat(t.lastPrice),
          priceChangePercent: parseFloat(t.priceChangePercent),
          priceChange: parseFloat(t.priceChange),
          volume: parseFloat(t.quoteVolume || t.volume || 0),
        }));

        // sort by absolute percent change (biggest movers)
        mapped.sort((a, b) => Math.abs(b.priceChangePercent) - Math.abs(a.priceChangePercent));

        const top = mapped.slice(0, limit);
        if (mounted) setMovers(top);
      } catch (err) {
        // در صورتی که درخواست CORS بشکنه یا خطا بیاد، می‌تونی پروکسی سرور بذاری
        // console.error("TopMovers fetch error", err);
      }
    }

    fetchTop();
    const id = setInterval(fetchTop, 30_000); // هر 30 ثانیه آپدیت

    return () => {
      mounted = false;
      clearInterval(id);
    };
  }, [limit]);

  return (
    <div className="p-2">
      <div className="grid grid-cols-3 text-[11px] text-zinc-400 px-1 py-1">
        <div className="text-left">Pair</div>
        <div className="text-center">Last</div>
        <div className="text-center">24h %</div>
      </div>

      <div className="max-h-24 overflow-y-auto custom-scroll">
        {movers.map((m) => {
          const positive = m.priceChangePercent > 0;
          return (
            <div key={m.symbol} className="flex items-center justify-between px-1 py-1">
              <div className="flex-1 text-xs text-zinc-100">{m.symbol.replace("USDT", "/USDT")}</div>
              <div className="w-20 text-left text-xs">{m.lastPrice.toFixed(2)}</div>
              <div className={`w-16 text-left text-xs ${positive ? "text-buy" : "text-sell"}`}>
                {(positive ? "+" : "") + m.priceChangePercent.toFixed(2) + "%"}
              </div>
            </div>
          );
        })}

        {movers.length === 0 && (
          <div className="text-xs text-zinc-500 p-2">Loading top movers…</div>
        )}
      </div>
    </div>
  );
}
