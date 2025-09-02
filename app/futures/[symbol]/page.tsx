"use client"

import LivePrice from "@/components/futures/LivePrice"
import OrderBook from "@/components/futures/OrderBook"
import { useParams } from "next/navigation"

export default function FuturesPage() {
  const { symbol } = useParams()

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">Futures: {symbol}</h1>
        <LivePrice symbol={symbol as string} />
      </div>
      <div>
        <OrderBook symbol={symbol as string} />
      </div>
    </div>
  )
}
