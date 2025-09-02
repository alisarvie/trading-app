"use client"

import { useEffect, useState } from "react"

type Coin = {
  symbol: string
  price: string
  change: string
}

const coins = ["BTCUSDT", "ETHUSDT", "BNBUSDT"]

export default function MarketGrid() {
  const [data, setData] = useState<Coin[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const results = await Promise.all(
        coins.map(async (c) => {
          const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${c}`)
          const json = await res.json()
          return {
            symbol: json.symbol,
            price: parseFloat(json.lastPrice).toFixed(2),
            change: json.priceChangePercent,
          }
        })
      )
      setData(results)
    }

    fetchData()
    const interval = setInterval(fetchData, 5000) // هر 5 ثانیه آپدیت
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-4 bg-[#181A20] rounded-lg px-2">
      {data.map((coin) => (
        <div key={coin.symbol} className="bg-[#1E2026] rounded-lg text-center flex items-center space-x-1 text-xs">
          <h2 className="">{coin.symbol}</h2>
          {/* <p className="text-xs">${coin.price}</p> */}
          <p
            className={`${
              parseFloat(coin.change) >= 0 ? "text-buy" : "text-sell"
            }`}
          >
            {coin.change}%
          </p>
        </div>
      ))}
    </div>
  )
}
