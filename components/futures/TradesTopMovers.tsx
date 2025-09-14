"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Trades from "./Trades";
import TopMovers from "./TopMovers";

export default function TradesTopMovers({ symbol = "BTCUSDT" }: { symbol?: string }) {
  return (
    <div className="w-full rounded-lg bg-transparent">
      <Tabs defaultValue="trades">
        <TabsList className="w-full flex bg-transparent">
          <TabsTrigger
            value="trades"
            className="flex-1 text-sm text-zinc-300 relative"
          >
            Trades
          </TabsTrigger>

          <TabsTrigger
            value="movers"
            className="flex-1 text-sm text-zinc-300 relative"
          >
            Top Movers
          </TabsTrigger>
        </TabsList>
        <TabsContent value="trades" className="p-0">
            <Trades symbol={symbol} />
        </TabsContent>
        <TabsContent value="movers" className="p-0">
            <TopMovers />
        </TabsContent>
      </Tabs>
    </div>
  );
}
