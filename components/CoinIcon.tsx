// // components/CoinIcon.tsx
// 'use client';

// import { useEffect, useState } from 'react';
// import Image from 'next/image';

// interface CoinIconProps {
//   symbol: string;
//   width?: number;
//   height?: number;
//   className?: string;
// }

// const fallbackIcon = "https://via.placeholder.com/32?text=?";

// export function CoinIcon({ symbol, width = 32, height = 32, className }: CoinIconProps) {
//   const [iconUrl, setIconUrl] = useState<string>(fallbackIcon);

//   useEffect(() => {
//     const fetchIcon = async () => {
//       try {
//         const res = await fetch(`"https://api.api-ninjas.com/v1/cryptosymbols/${symbol}`, {
//           headers: {
//             'X-Api-Key': 'VUFeSTVUr0Pm1Tan1eflmg==WTMLFeTNgBxBQKRZ', // کلید خودت رو بذار
//           },
//         });

//         const data = await res.json();
//         setIconUrl(fallbackIcon);
//       } catch (err) {
//         console.error(err);
//         setIconUrl(fallbackIcon);
//       }
//     };

//     fetchIcon();
//   }, [symbol]);

//   return (
//     <Image
//       src={iconUrl}
//       alt={symbol}
//       width={width}
//       height={height}
//       className={className}
//       unoptimized
//     />
//   );
// }
// components/BitcoinIcon.tsx
'use client';

import Image from 'next/image';

interface BitcoinIconProps {
  width?: number;
  height?: number;
  className?: string;
}

export function BitcoinIcon({ width = 32, height = 32, className }: BitcoinIconProps) {
  return (
    <Image
      src="/bitcoin.webp" // مسیر داخل فولدر public
      alt="Bitcoin"
      width={width}
      height={height}
      className={className}
    />
  );
}
