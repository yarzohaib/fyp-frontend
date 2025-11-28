'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useCart } from '@/hooks/use-cart'
import { Trash2 } from 'lucide-react'

export default function CartPage() {
    const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart()
    const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

    const toggleItemSelection = (id: string) => {
        const newSelected = new Set(selectedItems)
        if (newSelected.has(id)) {
            newSelected.delete(id)
        } else {
            newSelected.add(id)
        }
        setSelectedItems(newSelected)
    }

    const toggleSelectAll = () => {
        if (selectedItems.size === cart.length) {
            setSelectedItems(new Set())
        } else {
            setSelectedItems(new Set(cart.map((item, idx) => `${item.id}-${item.color}-${idx}`)))
        }
    }

    const getSelectedTotal = () => {
        return cart
            .filter((_, idx) => selectedItems.has(`${cart[idx].id}-${cart[idx].color}-${idx}`))
            .reduce((total, item) => total + item.price * item.quantity, 0)
    }

    const getSelectedCount = () => {
        return cart.filter((_, idx) => selectedItems.has(`${cart[idx].id}-${cart[idx].color}-${idx}`))
            .reduce((count, item) => count + item.quantity, 0)
    }

    if (cart.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>
                    <Card className="border-border">
                        <CardContent className="p-12 text-center">
                            <p className="text-foreground/70 mb-6">Your cart is empty</p>
                            <Link href="/">
                                <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full">
                                    Continue Shopping
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <Card className="border-border">
                            <CardHeader className="border-b border-border">
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        checked={selectedItems.size === cart.length && cart.length > 0}
                                        onCheckedChange={toggleSelectAll}
                                    />
                                    <CardTitle className="text-lg">Items in Cart ({cart.length})</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <div className="divide-y divide-border">
                                    {cart.map((item, idx) => {
                                        const itemId = `${item.id}-${item.color}-${idx}`
                                        const isSelected = selectedItems.has(itemId)

                                        return (
                                            <div key={itemId} className="p-4 flex gap-4 hover:bg-secondary/20 transition-colors">
                                                <Checkbox
                                                    checked={isSelected}
                                                    onCheckedChange={() => toggleItemSelection(itemId)}
                                                />

                                                {/* Product Image */}
                                                <Link href={item.slug ? `/products/${item.slug}` : `/products/${item.id}`}>
                                                    <div className="relative h-24 w-24 flex-shrink-0 rounded-lg overflow-hidden bg-secondary/20">
                                                        <Image
                                                            src={item.image || '/placeholder.svg'}
                                                            alt={item.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                </Link>

                                                {/* Product Details */}
                                                <div className="flex-1 min-w-0">
                                                    <Link href={item.slug ? `/products/${item.slug}` : `/products/${item.id}`}>
                                                        <h3 className="font-semibold text-foreground hover:underline">{item.name}</h3>
                                                    </Link>
                                                    {item.color && (
                                                        <p className="text-sm text-foreground/70">Color: {item.color}</p>
                                                    )}
                                                    <p className="text-sm font-semibold text-accent mt-1">${item.price}</p>
                                                </div>

                                                {/* Quantity Controls */}
                                                <div className="flex flex-col items-end gap-3">
                                                    <div className="flex items-center border border-border rounded-lg">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1, item.color)}
                                                            className="px-2 py-1 text-foreground hover:bg-secondary/20"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="px-3 py-1 text-foreground text-sm">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1, item.color)}
                                                            className="px-2 py-1 text-foreground hover:bg-secondary/20"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => removeFromCart(item.id, item.color)}
                                                        className="text-accent hover:text-accent/80 transition-colors"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>

                                                {/* Line Total */}
                                                <div className="text-right">
                                                    <p className="font-semibold text-foreground">
                                                        ${(item.price * item.quantity).toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <Card className="border-border sticky top-4">
                            <CardHeader className="border-b border-border">
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-4">
                                <div className="space-y-2 pb-4 border-b border-border">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-foreground/70">Subtotal</span>
                                        <span className="text-foreground">${getCartTotal().toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-foreground/70">Selected Items</span>
                                        <span className="text-foreground">{getSelectedCount()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-foreground/70">Selected Total</span>
                                        <span className="font-semibold text-accent">${getSelectedTotal().toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="space-y-2 pb-4 border-b border-border">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-foreground/70">Shipping</span>
                                        <span className="text-foreground">Calculated at checkout</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-foreground/70">Tax</span>
                                        <span className="text-foreground">Calculated at checkout</span>
                                    </div>
                                </div>

                                <div className="flex justify-between font-bold">
                                    <span className="text-foreground">Total</span>
                                    <span className="text-accent">${getSelectedTotal().toFixed(2)}</span>
                                </div>

                                <Button
                                    disabled={selectedItems.size === 0}
                                    className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full py-6 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Proceed to Checkout
                                </Button>

                                <Link href="/">
                                    <Button
                                        variant="outline"
                                        className="w-full border-border text-foreground hover:bg-secondary/20 rounded-full"
                                    >
                                        Continue Shopping
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
