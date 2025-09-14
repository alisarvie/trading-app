
"use client"

import CryptoChart from "@/components/futures/FuturesChart"
import FinancialChart from "@/components/futures/FuturesChart"
import LivePrice from "@/components/futures/LivePrice"
import MarketGrid from "@/components/futures/MarketGrid"
import OrderBook from "@/components/futures/OrderBook"
import FuturesOrderForm from "@/components/futures/OrderEntryForm"
import SymbolOverview from "@/components/futures/SymbolOverview"
import Trades from "@/components/futures/Trades"
import TradesTopMovers from "@/components/futures/TradesTopMovers"
import { useParams } from "next/navigation"

export default function FuturesPage() {
  const { symbol } = useParams()

  return (
    <>
      <div className="grid grid-flow-col grid-rows-40 grid-cols-12 gap-1 text-white h-screen bg-[#0B0E11] pt-1">
        <div className="col-span-8 row-span-2 bg-background rounded-lg flex items-center">
          <MarketGrid />
        </div>
        <div className="col-span-8 row-span-3 bg-background rounded-lg flex items-center">
          <SymbolOverview symbols={[symbol as string]} />
        </div>
        <div className="col-span-8 row-span-21 bg-background rounded-lg">

        </div>
        <div className="col-span-10 row-span-12 bg-background rounded-lg">
          history
        </div>
        <div className="col-span-2 row-span-18 bg-background rounded-lg">
          <OrderBook/>
        </div>
        <div className="col-span-2 row-span-8 bg-background rounded-lg">
          <TradesTopMovers/>
        </div>
        <div className="col-span-2 row-span-26 bg-background rounded-lg">
          <FuturesOrderForm/>
        </div>
        <div className="col-span-2 row-span-12 bg-background rounded-lg">
          sdsfd
        </div>
      </div>
      <CryptoChart symbol={symbol as string} theme="dark" />
    </>

  )
}
