"use client"
import { useEffect, useState } from "react"

type Props = { symbol: string }

export default function LivePrice({ symbol }: Props) {
  const [price, setPrice] = useState("loading...")

  useEffect(() => {
    const ws = new WebSocket(
      `wss://fstream.binance.com/ws/${symbol.toLowerCase()}@trade`
    )

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setPrice(data.p) // p = price
    }

    return () => ws.close()
  }, [symbol])

  return (
    <div className="p-4 bg-black text-green-400 font-mono rounded-lg shadow">
      Live Price: {price}
    </div>
  )
}
