'use client'

import { useState, useEffect } from 'react';
import type { ProductItem } from '@/lib/Types';

export type { ProductItem };

export function useWishlist() {
    const [wishlist, setWishlist] = useState<ProductItem[]>([]);
    const [mounted, setMounted] = useState(false);

    //Loading wishlist from local storage
    useEffect(() => {
        const saved = localStorage.getItem('wishlist');
        if (saved) {
            setWishlist(JSON.parse(saved));
        }
        setMounted(true);
    }, []);

    //Saving wishlist to local storage
    useEffect(() => {
        if (mounted) {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    }, [wishlist, mounted]);

    //Adding a product to the wishlist
    const addToWishlist = (item: ProductItem) => {
        setWishlist((prev) => {
            const exists = prev.some((w) => w.id === item.id);
            if (exists) {
                return prev;
            }
            return [...prev, item];
        });
    }
    const removeFromWishlist = (id: string | number) => {
        setWishlist((prev) => prev.filter((w) => w.id !== id));
    }
    const isInWishlist = (id: string | number) => {
        return wishlist.some((w) => w.id === id);
    }
    const toggleWishlist = (item: ProductItem) => {
        if (isInWishlist(item.id)) {
            removeFromWishlist(item.id);
        } else {
            addToWishlist(item);
        }
    }
    return {
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        toggleWishlist,
    }
}