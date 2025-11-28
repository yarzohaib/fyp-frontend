import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

interface RelatedProduct {
    id: string
    slug: string
    title: string
    price: number
    image: string
    inStock: boolean
}

interface RelatedProductsProps {
    products: RelatedProduct[]
}

export function RelatedProducts({ products }: RelatedProductsProps) {
    return (
        <div className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-8">Other Products You Might Like</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                    <Link key={product.id} href={`/products/${product.slug}`}>
                        <Card className="group overflow-hidden border-border hover:shadow-lg transition-shadow duration-300">
                            <CardContent className="p-0">
                                <div className="relative aspect-square overflow-hidden bg-secondary/20">
                                    <Image
                                        src={product.image || "/placeholder.svg"}
                                        alt={product.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                                <div className="p-4">
                                    <h3 className="text-sm font-medium text-foreground mb-1 text-balance">{product.title}</h3>
                                    <p className="text-sm font-semibold text-accent">${product.price}</p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}
