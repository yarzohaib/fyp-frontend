
import type { MetadataRoute } from 'next'
 
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL|| 'https://doma-gray.vercel.app'
 
async function fetchPublishedProducts() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/public-products?limit=1000`,
      { next: { revalidate: 3600 } }, // re-fetch sitemap data hourly
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.docs ?? []
  } catch {
    return []
  }
}
 
async function fetchCategories() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/public-categories`,
      { next: { revalidate: 3600 } },
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.docs ?? []
  } catch {
    return []
  }
}
 
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    fetchPublishedProducts(),
    fetchCategories(),
  ])
 
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${BASE_URL}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
 
  const productRoutes: MetadataRoute.Sitemap = products.map((product: any) => ({
    url: `${BASE_URL}/products/${product.slug ?? product.id}`,
    lastModified: new Date(product.updatedAt ?? product.createdAt ?? Date.now()),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))
 
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((cat: any) => ({
    url: `${BASE_URL}/products?category=${cat.id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }))
 
  return [...staticRoutes, ...productRoutes, ...categoryRoutes]
}
 