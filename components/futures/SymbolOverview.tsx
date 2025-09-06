// 'use client';
// import { formatNumber } from '@/utils/FormatNumber';
// import Image from 'next/image';
// import { useEffect, useState } from 'react';
// import { BitcoinIcon } from '../CoinIcon';

// interface FuturesData {
//     lastPrice: string;
//     priceChangePercent: string;
//     high24h: string;
//     low24h: string;
//     volumeBTC: string;
//     volumeUSDT: string;
//     markPrice: string;
//     indexPrice: string;
//     fundingRate: string;
//     fundingCountdown: string;
//     openInterest: string;
// }

// interface Props {
//     symbols: string[];
// }

// export default function SymbolOverview({ symbols }: Props) {
//     const [gridData, setGridData] = useState<Record<string, FuturesData>>({});

//     useEffect(() => {
//         const sockets: Record<string, WebSocket> = {};

//         symbols.forEach((sym) => {
//             // ✅ ticker stream
//             const wsTicker = new WebSocket(
//                 `wss://fstream.binance.com/ws/${sym.toLowerCase()}@ticker`
//             );

//             wsTicker.onmessage = (event) => {
//                 const d = JSON.parse(event.data);
//                 setGridData((prev) => ({
//                     ...prev,
//                     [sym]: {
//                         ...prev[sym],
//                         lastPrice: parseFloat(d.c).toFixed(2),
//                         priceChangePercent: parseFloat(d.P).toFixed(2),
//                         high24h: parseFloat(d.h).toFixed(2),
//                         low24h: parseFloat(d.l).toFixed(2),
//                         volumeBTC: parseFloat(d.v).toFixed(2),
//                         volumeUSDT: parseFloat(d.q).toFixed(2),
//                     },
//                 }));
//             };
//             sockets[sym + '_ticker'] = wsTicker;

//             // ✅ mark price stream
//             const wsMark = new WebSocket(
//                 `wss://fstream.binance.com/ws/${sym.toLowerCase()}@markPrice`
//             );

//             wsMark.onmessage = (event) => {
//                 const d = JSON.parse(event.data);
//                 const countdown = new Date(d.T - Date.now()).toISOString().substr(11, 8); // hh:mm:ss
//                 setGridData((prev) => ({
//                     ...prev,
//                     [sym]: {
//                         ...prev[sym],
//                         markPrice: parseFloat(d.p).toFixed(2),
//                         indexPrice: parseFloat(d.i).toFixed(2),
//                         fundingRate: (parseFloat(d.r) * 100).toFixed(4) + '%',
//                         fundingCountdown: countdown,
//                     },
//                 }));
//             };
//             sockets[sym + '_mark'] = wsMark;

//             // ✅ open interest stream
//             const wsOI = new WebSocket(
//                 `wss://fstream.binance.com/ws/${sym.toLowerCase()}@openInterest`
//             );

//             wsOI.onmessage = (event) => {
//                 const d = JSON.parse(event.data);
//                 setGridData((prev) => ({
//                     ...prev,
//                     [sym]: {
//                         ...prev[sym],
//                         openInterest: parseFloat(d.oi).toFixed(2),
//                     },
//                 }));
//             };
//             sockets[sym + '_oi'] = wsOI;
//         });

//         return () => {
//             Object.values(sockets).forEach((ws) => ws.close());
//         };
//     }, [symbols]);

//     return (
//         <div>
//             <table className="text-xs">
//                 <thead>
//                     <tr className="text-TertiaryText font-light text-xs">
//                         <th className="px-4">Symbol</th>
//                         <th className="px-4">Mark</th>
//                         <th className="px-4">Index</th>
//                         <th className="px-4">Funding/Countdown</th>
//                         <th className="px-4">24h Change %</th>
//                         <th className="px-4">24h High</th>
//                         <th className="px-4">24h Low</th>
//                         <th className="px-4">Volume (BTC)</th>
//                         <th className="px-4">Volume (USDT)</th>
//                         <th className="px-4">Open Interest (USDT)</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {symbols.map((sym) => {
//                         const data = gridData[sym];
//                         return (
//                             <tr key={sym} className="text-center">
//                                 <td className="font-bold px-4 flex items-center gap-2">
//                                     <BitcoinIcon width={20} height={20} className="rounded-full" />
//                                     <span>{sym.toUpperCase()}</span>
//                                     <div className="flex items-center gap-2">
//                                         {/* آیکون */}
//                                         <img
//                                             src="https://cryptoicons.org/api/icon/btc/32"
//                                             alt="BTC"
//                                             className="w-6 h-6"
//                                         />

//                                         {/* اسم و Perp */}
//                                         <span className="font-bold">BTCUSDT</span>
//                                         <span className="text-xs text-gray-400">Perp</span>

//                                         {/* قیمت لحظه‌ای */}
//                                         <span className="text-green-500 text-lg font-bold">
//                                             {data?.lastPrice || "..."}
//                                         </span>

//                                         {/* تغییرات */}
//                                         <div className="flex flex-col text-xs ml-2">
//                                             <span className={parseFloat(data?.priceChange || "0") >= 0 ? "text-green-500" : "text-red-500"}>
//                                                 {data?.priceChange || "..."}
//                                             </span>
//                                             <span className={parseFloat(data?.priceChangePercent || "0") >= 0 ? "text-green-500" : "text-red-500"}>
//                                                 {data?.priceChangePercent ? `${data.priceChangePercent}%` : "..."}
//                                             </span>
//                                         </div>
//                                     </div>

//                                 </td>
//                                 <td className="px-4">{data?.markPrice || '...'}</td>
//                                 <td className="px-4">{data?.indexPrice || '...'}</td>
//                                 <td className="px-4">
//                                     <div className="flex items-center gap-2">
//                                         <span
//                                             className={
//                                                 data
//                                                     ? parseFloat(data.fundingRate) > 0.05
//                                                         ? "text-orange-500"
//                                                         : parseFloat(data.fundingRate) > 0
//                                                             ? "text-green-500"
//                                                             : "text-red-500"
//                                                     : ""
//                                             }
//                                         >
//                                             {data?.fundingRate || "..."}
//                                         </span>
//                                         <span className="text-gray-400">/</span>
//                                         <span>{data?.fundingCountdown || "..."}</span>
//                                     </div>
//                                 </td>
//                                 <td
//                                     className={`px-4 ${data && parseFloat(data.priceChangePercent) >= 0
//                                         ? 'text-buy'
//                                         : 'text-sell'
//                                         }`}
//                                 >
//                                     {data?.priceChangePercent
//                                         ? `${data.priceChangePercent}%`
//                                         : '...'}
//                                 </td>
//                                 <td className="px-4">{formatNumber(data?.high24h) || '...'}</td>
//                                 <td className="px-4">{formatNumber(data?.low24h) || '...'}</td>
//                                 <td className="px-4">{formatNumber(data?.volumeBTC) || '...'}</td>
//                                 <td className="px-4">
//                                     {formatNumber(data?.volumeUSDT) || '...'}
//                                 </td>
//                                 <td className="px-4">
//                                     {formatNumber(data?.openInterest) || '...'}
//                                 </td>
//                             </tr>
//                         );
//                     })}
//                 </tbody>
//             </table>
//         </div>
//     );
// }
'use client';
import { formatNumber } from '@/utils/FormatNumber';
import { useEffect, useState } from 'react';
import { BitcoinIcon } from '../CoinIcon';

interface FuturesData {
    lastPrice: string;
    priceChangePercent: string;
    high24h: string;
    low24h: string;
    volumeBTC: string;
    volumeUSDT: string;
    markPrice: string;
    indexPrice: string;
    fundingRate: string;
    fundingCountdown: string;
    openInterest: string;
}

interface Props {
    symbols: string[];
}

export default function SymbolOverview({ symbols }: Props) {
    const [gridData, setGridData] = useState<Record<string, FuturesData>>({});

    useEffect(() => {
        const sockets: Record<string, WebSocket> = {};

        symbols.forEach((sym) => {
            // ✅ ticker stream
            const wsTicker = new WebSocket(
                `wss://fstream.binance.com/ws/${sym.toLowerCase()}@ticker`
            );

            wsTicker.onmessage = (event) => {
                const d = JSON.parse(event.data);
                setGridData((prev) => ({
                    ...prev,
                    [sym]: {
                        ...prev[sym],
                        lastPrice: parseFloat(d.c).toFixed(2),
                        priceChangePercent: parseFloat(d.P).toFixed(2),
                        high24h: parseFloat(d.h).toFixed(2),
                        low24h: parseFloat(d.l).toFixed(2),
                        volumeBTC: parseFloat(d.v).toFixed(2),
                        volumeUSDT: parseFloat(d.q).toFixed(2),
                    },
                }));
            };
            sockets[sym + '_ticker'] = wsTicker;

            // ✅ mark price stream
            const wsMark = new WebSocket(
                `wss://fstream.binance.com/ws/${sym.toLowerCase()}@markPrice`
            );

            wsMark.onmessage = (event) => {
                const d = JSON.parse(event.data);
                const countdown = new Date(d.T - Date.now()).toISOString().substr(11, 8); // hh:mm:ss
                setGridData((prev) => ({
                    ...prev,
                    [sym]: {
                        ...prev[sym],
                        markPrice: parseFloat(d.p).toFixed(2),
                        indexPrice: parseFloat(d.i).toFixed(2),
                        fundingRate: (parseFloat(d.r) * 100).toFixed(4) + '%',
                        fundingCountdown: countdown,
                    },
                }));
            };
            sockets[sym + '_mark'] = wsMark;

            // ✅ open interest stream
            const wsOI = new WebSocket(
                `wss://fstream.binance.com/ws/${sym.toLowerCase()}@openInterest`
            );

            wsOI.onmessage = (event) => {
                const d = JSON.parse(event.data);
                setGridData((prev) => ({
                    ...prev,
                    [sym]: {
                        ...prev[sym],
                        openInterest: parseFloat(d.oi).toFixed(2),
                    },
                }));
            };
            sockets[sym + '_oi'] = wsOI;
        });

        return () => {
            Object.values(sockets).forEach((ws) => ws.close());
        };
    }, [symbols]);

    return (
        <div className='flex items-center px-4'>
            {symbols.map((sym) => {
                const data = gridData[sym];
                return (
                    <div key={sym} className="flex items-center gap-2">
                        <BitcoinIcon width={20} height={20} className="rounded-full" />
                        <span className="font-bold pr-6 text-xl">{sym.toUpperCase()}</span>
                        <div className="flex flex-col items-start">
                            <span className="text-green-500 font-bold text-lg">
                                {data?.lastPrice || '...'}
                            </span>
                            <span
                                className={`text-xs ${data && parseFloat(data.priceChangePercent) >= 0
                                        ? 'text-buy'
                                        : 'text-sell'
                                    }`}
                            >
                                {data?.priceChangePercent
                                    ? `${data.priceChangePercent}%`
                                    : '...'}
                            </span>
                        </div>
                    </div>
                );
            })}
            <table className="text-xs">
                <thead>
                    <tr className="text-TertiaryText font-light text-xs text-start">
                        <th className="px-4 text-start">Mark</th>
                        <th className="px-4 text-start">Index</th>
                        <th className="px-4 text-start">Funding/Countdown</th>
                        <th className="px-4 text-start">24h Change %</th>
                        <th className="px-4 text-start">24h High</th>
                        <th className="px-4 text-start">24h Low</th>
                        <th className="px-4 text-start">Volume (BTC)</th>
                        <th className="px-4 text-start">Volume (USDT)</th>
                        <th className="px-4 text-start">Open Interest (USDT)</th>
                    </tr>
                </thead>
                <tbody>
                    {symbols.map((sym) => {
                        const data = gridData[sym];
                        return (
                            <tr key={sym} className="text-start">
                                <td className="px-4">{data?.markPrice || "..."}</td>
                                <td className="px-4">{data?.indexPrice || "..."}</td>
                                <td className="px-4">
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={
                                                data
                                                    ? parseFloat(data.fundingRate) > 0.05
                                                        ? "text-orange-500"
                                                        : parseFloat(data.fundingRate) > 0
                                                            ? "text-green-500"
                                                            : "text-red-500"
                                                    : ""
                                            }
                                        >
                                            {data?.fundingRate || "..."}
                                        </span>
                                        <span className="text-gray-400">/</span>
                                        <span>{data?.fundingCountdown || "..."}</span>
                                    </div>
                                </td>
                                <td
                                    className={`px-4 ${data && parseFloat(data.priceChangePercent) >= 0
                                            ? "text-buy"
                                            : "text-sell"
                                        }`}
                                >
                                    {data?.priceChangePercent
                                        ? `${data.priceChangePercent}%`
                                        : "..."}
                                </td>
                                <td className="px-4">{formatNumber(data?.high24h) || "..."}</td>
                                <td className="px-4">{formatNumber(data?.low24h) || "..."}</td>
                                <td className="px-4">{formatNumber(data?.volumeBTC) || "..."}</td>
                                <td className="px-4">
                                    {formatNumber(data?.volumeUSDT) || "..."}
                                </td>
                                <td className="px-4">
                                    {formatNumber(data?.openInterest) || "..."}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
