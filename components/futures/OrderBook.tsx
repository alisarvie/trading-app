"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

type Level = {
  price: number;
  qty: number;
  total: number;
};

export default function OrderBook() {
  const [asks, setAsks] = useState<Level[]>([]);
  const [bids, setBids] = useState<Level[]>([]);
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const [prevPrice, setPrevPrice] = useState<number | null>(null);
  const [priceColor, setPriceColor] = useState("text-white");
  const [direction, setDirection] = useState<"up" | "down" | null>(null);

  useEffect(() => {
    // WebSocket اوردر بوک
    const ws = new WebSocket(
      "wss://fstream.binance.com/ws/btcusdt@depth20@500ms"
    );

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newAsks: Level[] = [];
      const newBids: Level[] = [];

      let totalAsk = 0;
      for (const [p, q] of data.a) {
        const price = parseFloat(p);
        const qty = parseFloat(q);
        if (qty > 0) {
          totalAsk += qty;
          newAsks.push({ price, qty, total: totalAsk });
        }
      }

      let totalBid = 0;
      for (const [p, q] of data.b) {
        const price = parseFloat(p);
        const qty = parseFloat(q);
        if (qty > 0) {
          totalBid += qty;
          newBids.push({ price, qty, total: totalBid });
        }
      }

      setAsks(newAsks.slice(0, 7));
      setBids(newBids.slice(0, 7));
    };

    // WebSocket آخرین قیمت
    const wsTrade = new WebSocket(
      "wss://fstream.binance.com/ws/btcusdt@ticker"
    );

    wsTrade.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.c) {
        const newPrice = parseFloat(data.c);

        if (prevPrice !== null) {
          if (newPrice > prevPrice) {
            setPriceColor("text-buy");
            setDirection("up");
          } else if (newPrice < prevPrice) {
            setPriceColor("text-sell");
            setDirection("down");
          }
        }

        setPrevPrice(newPrice);
        setLastPrice(newPrice);
      }
    };

    return () => {
      ws.close();
      wsTrade.close();
    };
  }, [prevPrice]);

  const midPrice = useMemo(() => {
    if (!asks.length || !bids.length) return null;
    return (asks[0].price + bids[0].price) / 2;
  }, [asks, bids]);

  const renderRow = (row: Level, color: string) => (
    <div
      key={row.price}
      className="grid grid-cols-3 text-xs px-2 py-0.5 hover:bg-zinc-900"
    >
      <div className={`text-left ${color}`}>{row.price.toLocaleString()}</div>
      <div className="text-right">{row.qty.toFixed(3)}</div>
      <div className="text-right">{row.total.toFixed(3)}</div>
    </div>
  );

  return (
    <div className="rounded-lg w-full">
      {/* Header */}
      <div className="flex items-center justify-between px-2 py-2 border-b border-zinc-800">
        <h3 className="text-sm font-medium text-white">Order Book</h3>
        <span className="text-xs text-zinc-400">BTC/USDT</span>
      </div>

      {/* Column headers */}
      <div className="grid grid-cols-3 text-[11px] text-zinc-400 px-2 py-1">
        <div className="text-left">Price (USDT)</div>
        <div className="text-right">Size (BTC)</div>
        <div className="text-right">Sum (BTC)</div>
      </div>

      {/* Asks */}
      <div>{asks.map((ask) => renderRow(ask, "text-sell"))}</div>

      {/* Last Price */}
      <div
        className={`flex items-center py-3 px-2 font-semibold text-lg transition-colors duration-300 ${priceColor}`}
      >
        {lastPrice ? lastPrice.toLocaleString() : "---"}
        {direction === "up" && <ArrowUp size={16} className="ml-2 text-buy" />}
        {direction === "down" && <ArrowDown size={16} className="ml-2 text-sell" />}
        {midPrice && (
          <span className="ml-1 text-xs text-zinc-400">
            {midPrice.toFixed(1)}
          </span>
        )}

      </div>

      {/* Bids */}
      <div>{bids.map((bid) => renderRow(bid, "text-buy"))}</div>
    </div>
  );
}
