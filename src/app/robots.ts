
import type { MetadataRoute } from 'next'
 
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL|| 'https://doma-gray.vercel.app'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/products', '/products/'],
        disallow: [
          '/profile',
          '/cart',
          '/checkout',
          '/wishlist',
          '/login',
          '/signup',
          '/api/',
          // Vendor routes
          '/dashboard',
          '/orders',
          '/add-product',
          '/VendorProfile',
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  }
}