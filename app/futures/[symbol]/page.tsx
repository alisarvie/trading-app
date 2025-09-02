// "use client"

// import LivePrice from "@/components/futures/LivePrice"
// import OrderBook from "@/components/futures/OrderBook"
// import { useParams } from "next/navigation"

// export default function FuturesPage() {
//   const { symbol } = useParams()

//   return (
//     <div className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#181A20]">
//       {/* <div>
//         <h1 className="text-2xl font-bold mb-4">Futures: {symbol}</h1>
//         <LivePrice symbol={symbol as string} />
//       </div>
//       <div>
//         <OrderBook symbol={symbol as string} />
//       </div> */}
//       <div className="md:col-span-8">
//           ds
//       </div>
//       <div></div>
//     </div>
//   )
// }
"use client"

import LivePrice from "@/components/futures/LivePrice"
import OrderBook from "@/components/futures/OrderBook"
import { useParams } from "next/navigation"

export default function FuturesPage() {
  const { symbol } = useParams()

  return (
    <div className="grid grid-flow-col grid-rows-20 grid-cols-12 gap-1 text-white h-screen bg-[#0B0E11] pt-1">
      <div className="col-span-8 row-span-1 bg-background">
        sdsfd
      </div>
      <div className="col-span-8 row-span-1 bg-background">
        sdsfd
      </div>
      <div className="col-span-8 row-span-10 bg-background">
        sdsfd
      </div>
      <div className="col-span-10 row-span-8 bg-background">
        sdsfd
      </div>
      <div className="col-span-2 row-span-6 bg-background">
        sdsfd
      </div>
      <div className="col-span-2 row-span-6 bg-background">
        sdsfd
      </div>
      <div className="col-span-2 row-span-12 bg-background">
        sdsfd
      </div>
      <div className="col-span-2 row-span-8 bg-background">
        sdsfd
      </div>
    </div>
  )
}
