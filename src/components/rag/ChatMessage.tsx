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
//             ? 'bg-white text-[#1a3126] border border-[#F2F0E5] rounded-tl-none'
//             : 'bg-[#1a3126] text-[#F2F0E5] rounded-tr-none shadow-md'
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
//     <div className="mt-6 pt-5 border-t border-[#F2F0E5]">
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
//               <span className="shrink-0 text-[10px] font-bold bg-[#1a3126] text-[#F2F0E5] px-2 py-1 rounded-full">
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
    <div className={`flex flex-col max-w-3xl ${!isAssistant ? 'items-end ml-auto' : 'items-start'}`}>
      <span className={`text-[10px] uppercase tracking-widest mb-2 px-1 ${
        isAssistant ? 'text-[#BB4E2C]' : 'text-[#1a3126]/60'
      }`}>
        {isAssistant ? 'Genie' : 'You'}
      </span>

      <div className={`px-6 py-5 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm ${
        isAssistant
          ? 'bg-white text-[#1a3126] border border-[#F2F0E5] rounded-tl-none'
          : 'bg-[#1a3126] text-[#F2F0E5] rounded-tr-none shadow-md'
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
    <div className="mt-6 pt-5 border-t border-[#F2F0E5]">
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs font-bold uppercase tracking-wider text-[#BB4E2C]">
          Curated Selection ({products.length})
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

function ProductCard({ product }: { product: Product }) {
  const router = useRouter();

  // ✅ Navigate to product page on click
  const handleClick = () => {
    if (product.productUrlSlug) {
      router.push(`/products/${product.productUrlSlug}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="group flex flex-col gap-4 p-4 bg-[#F9F8F6] border border-[#E4E0D0] rounded-xl hover:border-[#BB4E2C]/30 hover:shadow-md hover:bg-white transition-all duration-300 cursor-pointer"
    >
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-2 gap-2">
            <h4 className="font-serif font-medium text-[#1a3126] text-lg group-hover:text-[#BB4E2C] transition-colors">
              {product.productName}
            </h4>
            {product.score && (
              <span className="shrink-0 text-[10px] font-bold bg-[#1a3126] text-[#F2F0E5] px-2 py-1 rounded-full">
                {(product.score * 100).toFixed(0)}% MATCH
              </span>
            )}
          </div>

          {product.shortDescription && (
            <p className="text-[#1a3126]/70 text-xs leading-relaxed line-clamp-2 mb-3">
              {product.shortDescription}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[#1a3126]/60 border-t border-[#1a3126]/5 pt-3 mt-1">
          {product.pricingDetails && (
            <span className="flex items-center gap-1 bg-white px-2 py-1 rounded border border-[#1a3126]/10">
              <span className="font-bold text-[#1a3126]">Price:</span>
              <span className="text-[#BB4E2C] font-semibold">
                Rs {product.pricingDetails.discountedPrice ?? product.pricingDetails.originalPrice}
              </span>
            </span>
          )}
          {product.colors && product.colors.length > 0 && (
            <span>
              <span className="font-semibold text-[#1a3126]">Colors:</span> {product.colors.join(', ')}
            </span>
          )}
          {product.category && <span className="italic">{product.category}</span>}

          {/* ✅ Visual hint that card is clickable */}
          <span className="ml-auto text-[#BB4E2C] text-xs font-medium group-hover:underline">
            View product →
          </span>
        </div>
      </div>
    </div>
  );
}