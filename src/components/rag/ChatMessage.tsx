// import { ReactNode } from 'react';

// export interface Product {
//   id: string;
//   productName: string;
//   shortDescription?: string;
//   pricingDetails?: {
//     originalPrice: number;
//     discountedPrice: number | null;
//   };
//   colors?: string[];
//   category?: string;
//   vendor?: string;
//   size?: string;
//   score?: number;
// }

// interface ChatMessageProps {
//   role: 'user' | 'assistant';
//   content: string;
//   products?: Product[];
// }

// export function ChatMessage({ role, content, products }: ChatMessageProps) {
//   const isAssistant = role === 'assistant';

//   return (
//     <div className={`flex flex-col max-w-3xl ${!isAssistant ? 'items-end ml-auto' : 'items-start'}`}>
//       <span
//         className={`text-[10px] uppercase tracking-widest mb-2 px-1 ${
//           isAssistant ? 'text-[#BB4E2C]' : 'text-[#1a3126]/60'
//         }`}
//       >
//         {isAssistant ? 'Genie' : 'You'}
//       </span>

//       <div
//         className={`px-6 py-5 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm ${
//           isAssistant
//             ? 'bg-white text-[#1a3126] border border-white rounded-tl-none'
//             : 'bg-[#1a3126] text-white rounded-tr-none shadow-md'
//         }`}
//       >
//         <p className="whitespace-pre-wrap">{content}</p>

//         {isAssistant && products && products.length > 0 && (
//           <ProductGrid products={products} />
//         )}
//       </div>
//     </div>
//   );
// }

// function ProductGrid({ products }: { products: Product[] }) {
//   return (
//     <div className="mt-6 pt-5 border-t border-white">
//       <div className="flex items-center justify-between mb-4">
//         <p className="text-xs font-bold uppercase tracking-wider text-[#BB4E2C]">
//           Curated Selection ({products.length})
//         </p>
//       </div>

//       <div className="grid grid-cols-1 gap-4">
//         {products.map((product) => (
//           <ProductCard key={product.id} product={product} />
//         ))}
//       </div>
//     </div>
//   );
// }

// function ProductCard({ product }: { product: Product }) {
//   return (
//     <div className="group flex flex-col sm:flex-row gap-4 p-4 bg-[#F9F8F6] border border-[#E4E0D0] rounded-xl hover:border-[#BB4E2C]/30 hover:shadow-md hover:bg-white transition-all duration-300">
//       <div className="flex-1 flex flex-col justify-between">
//         <div>
//           <div className="flex justify-between items-start mb-2 gap-2">
//             <h4 className="font-serif font-medium text-[#1a3126] text-lg group-hover:text-[#BB4E2C] transition-colors">
//               {product.productName}
//             </h4>
//             {product.score && (
//               <span className="shrink-0 text-[10px] font-bold bg-[#1a3126] text-white px-2 py-1 rounded-full">
//                 {(product.score * 100).toFixed(0)}% MATCH
//               </span>
//             )}
//           </div>

//           {product.shortDescription && (
//             <p className="text-[#1a3126]/70 text-xs leading-relaxed line-clamp-2 mb-3">
//               {product.shortDescription}
//             </p>
//           )}
//         </div>

//         <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#1a3126]/60 border-t border-[#1a3126]/5 pt-3 mt-1">
//           {product.pricingDetails && (
//             <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-[#1a3126]/10">
//               <span className="font-bold text-[#1a3126]">Price:</span>
//               <span className="text-[#BB4E2C] font-semibold">
//                 Rs{product.pricingDetails.discountedPrice ?? product.pricingDetails.originalPrice}
//               </span>
//             </span>
//           )}
//           {product.colors && product.colors.length > 0 && (
//             <span>
//               <span className="font-semibold text-[#1a3126]">Colors:</span> {product.colors.join(', ')}
//             </span>
//           )}
//           {product.category && <span className="italic">{product.category}</span>}
//         </div>
//       </div>
//     </div>
//   );
// }


import { useRouter } from 'next/navigation';

export interface Product {
  id: string;
  productName: string;
  productUrlSlug: string;  // ✅ already in your RAG Product interface
  shortDescription?: string;
  pricingDetails?: {
    originalPrice: number;
    discountedPrice: number | null;
  };
  colors?: string[];
  category?: string;
  vendor?: string;
  size?: string;
  score?: number;
}

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  products?: Product[];
}

export function ChatMessage({ role, content, products }: ChatMessageProps) {
  const isAssistant = role === 'assistant';

  return (
    <div className={`flex flex-col max-w-[88%] ${!isAssistant ? 'items-end ml-auto' : 'items-start'}`}>
      <span className={`text-[10px] uppercase tracking-widest mb-1.5 ${
        isAssistant ? 'text-[#BB4E2C]' : 'text-[#1a3126]/50'
      }`}>
        {isAssistant ? 'DOMA Sense' : 'You'}
      </span>

      <div className={`px-4 py-3.5 text-sm leading-relaxed ${
        isAssistant
          ? 'bg-white text-[#1a3126] border border-gray-100'
          : 'bg-[#1a3126] text-white'
      }`}>
        <p className="whitespace-pre-wrap">{content}</p>

        {isAssistant && products && products.length > 0 && (
          <ProductGrid products={products} />
        )}
      </div>
    </div>
  );
}

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="mt-5 pt-4 border-t border-gray-100">
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#BB4E2C] mb-3">
        Curated picks ({products.length})
      </p>
      <div className="flex flex-col gap-2.5">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const router = useRouter();

  const handleClick = () => {
    if (product.productUrlSlug) {
      router.push(`/products/${product.productUrlSlug}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group flex flex-col gap-2 p-3.5 bg-gray-50 border border-gray-100 hover:border-[#1A3126]/30 hover:bg-white transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-[#1A3126] group-hover:text-[#BB4E2C] transition-colors leading-snug">
          {product.productName}
        </p>
        {product.score && (
          <span className="shrink-0 text-[9px] font-bold bg-[#1A3126] text-white px-1.5 py-0.5">
            {(product.score * 100).toFixed(0)}%
          </span>
        )}
      </div>

      {product.shortDescription && (
        <p className="text-[11px] text-[#1A3126]/55 leading-relaxed line-clamp-2">
          {product.shortDescription}
        </p>
      )}

      <div className="flex items-center justify-between mt-1 pt-2.5 border-t border-gray-100 text-[11px]">
        {product.pricingDetails ? (
          <span className="font-bold text-[#BB4E2C]">
            Rs. {(product.pricingDetails.discountedPrice ?? product.pricingDetails.originalPrice).toLocaleString()}
          </span>
        ) : (
          <span />
        )}
        <span className="text-[#1A3126]/40 group-hover:text-[#BB4E2C] transition-colors font-medium">
          View →
        </span>
      </div>
    </div>
  );
}