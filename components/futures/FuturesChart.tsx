'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  createChart,
  ColorType,
  CrosshairMode,
  CandlestickData,
  LineData,
  HistogramData,
  IChartApi,
  UTCTimestamp,
} from 'lightweight-charts';

type Props = {
  symbol: string; // مثل BTCUSDT
};

const timeframes: { label: string; value: string }[] = [
  { label: '1H', value: '1h' },
  { label: '1D', value: '1d' },
  { label: '1W', value: '1w' },
  { label: '1M', value: '1M' },
];

export default function FuturesChart({ symbol }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candlesRef = useRef<CandlestickData[]>([]);
  const [interval, setInterval] = useState<string>('1d');

  // محاسبه MA
  const calcMA = (data: CandlestickData[], period: number): LineData[] => {
    const result: LineData[] = [];
    let sum = 0;
    const queue: number[] = [];
    data.forEach((c, i) => {
      const val = Number(c.close);
      queue.push(val);
      sum += val;
      if (queue.length > period) sum -= queue.shift()!;
      if (i >= period - 1) result.push({ time: c.time, value: sum / period });
    });
    return result;
  };

  useEffect(() => {
    if (!containerRef.current) return;

    // حذف چارت قدیمی
    if (chartRef.current) {
      chartRef.current.remove();
      chartRef.current = null;
    }

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height: 520,
      layout: {
        background: { type: ColorType.Solid, color: '#0b0e11' },
        textColor: '#d1d5db',
      },
      grid: {
        vertLines: { color: '#1f2937' },
        horzLines: { color: '#1f2937' },
      },
      crosshair: { mode: CrosshairMode.Normal },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false, timeVisible: true, secondsVisible: false },
    });
    chartRef.current = chart;

    // سری‌ها
    const candleSeries = chart.addCandlestickSeries({
      upColor: '#0ecb81',
      downColor: '#f6465d',
      wickUpColor: '#0ecb81',
      wickDownColor: '#f6465d',
      borderVisible: false,
    });

    const ma7 = chart.addLineSeries({ color: '#ff4ecd', lineWidth: 2 });
    const ma25 = chart.addLineSeries({ color: '#f0b90b', lineWidth: 2 });
    const ma99 = chart.addLineSeries({ color: '#9b59b6', lineWidth: 2 });

    const volume = chart.addHistogramSeries({
      priceFormat: { type: 'volume' },
      priceScaleId: 'volume',
    });
    volume.priceScale().applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });

    // تولتیپ OHLC
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.left = '8px';
    tooltip.style.top = '8px';
    tooltip.style.background = 'rgba(0,0,0,0.6)';
    tooltip.style.color = '#fff';
    tooltip.style.padding = '6px 8px';
    tooltip.style.fontSize = '12px';
    tooltip.style.borderRadius = '6px';
    tooltip.style.pointerEvents = 'none';
    containerRef.current.appendChild(tooltip);

    chart.subscribeCrosshairMove((param) => {
      const d = param.seriesData.get(candleSeries) as CandlestickData | undefined;
      if (!d) return;
      tooltip.innerHTML = `O: ${d.open.toFixed(2)} H: ${d.high.toFixed(2)}<br/>L: ${d.low.toFixed(2)} C: ${d.close.toFixed(2)}`;
    });

    // گرفتن داده اولیه
    const loadData = async () => {
      const res = await fetch(`/api/klines?symbol=${symbol}&interval=${interval}&limit=500`);
      const raw: any[] = await res.json();
      const candles: CandlestickData[] = raw.map((r) => ({
        time: (r[0] / 1000) as UTCTimestamp,
        open: parseFloat(r[1]),
        high: parseFloat(r[2]),
        low: parseFloat(r[3]),
        close: parseFloat(r[4]),
      }));
      candlesRef.current = candles;
      candleSeries.setData(candles);

      // حجم
      const vols: HistogramData[] = raw.map((r, i) => {
        const up = candles[i].close >= candles[i].open;
        return {
          time: (r[0] / 1000) as UTCTimestamp,
          value: parseFloat(r[5]),
          color: up ? '#0ecb81' : '#f6465d',
        };
      });
      volume.setData(vols);

      // MAها
      ma7.setData(calcMA(candles, 7));
      ma25.setData(calcMA(candles, 25));
      ma99.setData(calcMA(candles, 99));
      chart.timeScale().fitContent();
    };
    loadData();

    // وب‌سوکت
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@kline_${interval}`
    );

    ws.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (!msg?.k) return;
      const k = msg.k;
      const t = (k.t / 1000) as UTCTimestamp;
      const fresh: CandlestickData = {
        time: t,
        open: parseFloat(k.o),
        high: parseFloat(k.h),
        low: parseFloat(k.l),
        close: parseFloat(k.c),
      };

      const last = candlesRef.current[candlesRef.current.length - 1];
      if (last && last.time === t) {
        candlesRef.current[candlesRef.current.length - 1] = fresh;
        candleSeries.update(fresh);
      } else {
        candlesRef.current.push(fresh);
        candleSeries.update(fresh);
      }

      volume.update({
        time: t,
        value: parseFloat(k.v),
        color: fresh.close >= fresh.open ? '#0ecb81' : '#f6465d',
      });
    };

    // ریسایز
    const handleResize = () => {
      if (containerRef.current && chartRef.current) {
        chartRef.current.applyOptions({ width: containerRef.current.clientWidth });
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      ws.close();
      tooltip.remove();
      window.removeEventListener('resize', handleResize);
      chart.remove();
      chartRef.current = null;
    };
  }, [symbol, interval]);

  return (
    <div>
      {/* دکمه‌های انتخاب تایم‌فریم */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        {timeframes.map((tf) => (
          <button
            key={tf.value}
            onClick={() => setInterval(tf.value)}
            style={{
              padding: '4px 8px',
              background: interval === tf.value ? '#f0b90b' : '#1f2937',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            {tf.label}
          </button>
        ))}
      </div>
      <div ref={containerRef} style={{ width: '100%', height: 520, position: 'relative' }} />
    </div>
  );
}
