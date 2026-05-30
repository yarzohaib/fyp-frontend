'use client';

import { Search, X } from 'lucide-react';

interface HeroSearchProps {
  value: string;
  onSearch: (query: string) => void;
}

export function HeroSearch({ value, onSearch }: HeroSearchProps) {
  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="h-36 sm:h-44 md:h-52 bg-cover bg-center"
        style={{ backgroundImage: `url('/heroGreen2.webp')` }}
      >
        <div className="absolute inset-0 " />
        <div className="relative flex h-full flex-col items-center justify-center gap-3 px-4 sm:px-6">
          <p className="text-white/80 text-xs font-semibold tracking-[0.3em] uppercase">
            Find your perfect piece
          </p>
          <div className="w-full max-w-xl">
            <div className="flex items-center gap-3 bg-white px-5 py-3 shadow-lg">
              <Search className="h-4 w-4 text-gray-400 shrink-0" />
              <input
                type="text"
                value={value}
                onChange={(e) => onSearch(e.target.value)}
                placeholder="Search products..."
                className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 placeholder:text-gray-400"
                autoComplete="off"
              />
              {value && (
                <button
                  onClick={() => onSearch('')}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
