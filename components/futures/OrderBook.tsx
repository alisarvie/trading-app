"use client"

import { useEffect, useState, useRef } from "react"
import { motion } from "framer-motion"

type Order = [string, string] // [price, quantity]

interface OrderBookData {
  bids: Order[]
  asks: Order[]
}

type Props = { symbol: string }

export default function OrderBook({ symbol }: Props) {
  const [orders, setOrders] = useState<OrderBookData>({ bids: [], asks: [] })
  const prevOrders = useRef<OrderBookData>({ bids: [], asks: [] })

  useEffect(() => {
    const ws = new WebSocket(
      `wss://fstream.binance.com/ws/${symbol.toLowerCase()}@depth20@500ms`
    )

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setOrders({
        bids: data.b?.slice(0, 20) || [],
        asks: data.a?.slice(0, 20) || [],
      })
    }

    return () => ws.close()
  }, [symbol])

  return (
    <div className="grid grid-cols-2 gap-4 p-4 border rounded-2xl shadow bg-white/5">
      {/* Bids */}
      <div>
        <h2 className="font-bold mb-2 text-green-500">Bids</h2>
        <ul className="space-y-1">
          {orders.bids.map(([price, qty], i) => {
            const changed = prevOrders.current.bids[i]?.[1] !== qty
            return (
              <motion.li
                key={`bid-${i}`}
                initial={{ backgroundColor: "transparent" }}
                animate={{
                  backgroundColor: changed ? "rgba(16,185,129,0.2)" : "transparent",
                }}
                transition={{ duration: 0.4 }}
                className="flex justify-between px-2 py-1 rounded"
              >
                <span className="text-green-500">{price}</span>
                <span className="text-gray-400">{qty}</span>
              </motion.li>
            )
          })}
        </ul>
      </div>

      {/* Asks */}
      <div>
        <h2 className="font-bold mb-2 text-red-500">Asks</h2>
        <ul className="space-y-1">
          {orders.asks.map(([price, qty], i) => {
            const changed = prevOrders.current.asks[i]?.[1] !== qty
            return (
              <motion.li
                key={`ask-${i}`}
                initial={{ backgroundColor: "transparent" }}
                animate={{
                  backgroundColor: changed ? "rgba(239,68,68,0.2)" : "transparent",
                }}
                transition={{ duration: 0.4 }}
                className="flex justify-between px-2 py-1 rounded"
              >
                <span className="text-red-500">{price}</span>
                <span className="text-gray-400">{qty}</span>
              </motion.li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
