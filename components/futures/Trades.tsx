"use client";

import { useEffect, useState } from "react";

type Trade = {
  price: number;
  qty: number;
  time: number;
  isBuyerMaker: boolean; // true => seller-maker => typically red
};

export default function Trades({ symbol = "BTCUSDT", max = 50 }: { symbol?: string; max?: number }) {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    const pair = symbol.toLowerCase();
    const ws = new WebSocket(`wss://fstream.binance.com/ws/${pair}@trade`);

    ws.onmessage = (ev) => {
      const d = JSON.parse(ev.data);
      const trade: Trade = {
        price: parseFloat(d.p),
        qty: parseFloat(d.q),
        time: d.T,
        isBuyerMaker: d.m,
      };

      setTrades((prev) => {
        const updated = [trade, ...prev];
        return updated.slice(0, max);
      });
    };

    ws.onerror = (e) => {
      // console.error("Trades WS error", e);
    };

    return () => {
      ws.close();
    };
  }, [symbol, max]);

  const formatTime = (ts: number) =>
    new Date(ts).toLocaleTimeString("en-GB", { hour12: false });

  return (
    <div className="p-2">
      {/* headers */}
      <div className="grid grid-cols-3 text-[11px] text-zinc-400">
        <div className="text-left">Price (USDT)</div>
        <div className="text-left">Amount (BTC)</div>
        <div className="text-left">Time</div>
      </div>

      {/* rows */}
      <div className="max-h-25 overflow-y-auto custom-scroll">
        {trades.map((t, i) => (
          <div
            key={`${t.time}-${i}`}
            className="grid grid-cols-3 items-center text-xs py-0.5 hover:bg-zinc-900"
          >
            <div className={`text-left text-xs ${t.isBuyerMaker ? "text-sell" : "text-buy"}`}>
              {t.price.toLocaleString()}
            </div>
            <div className="text-left">{t.qty.toFixed(3)}</div>
            <div className="text-left text-zinc-400">{formatTime(t.time)}</div>
          </div>
        ))}
        {trades.length === 0 && (
          <div className="text-zinc-500 p-2">Waiting for trades...</div>
        )}
      </div>
    </div>
  );
}
