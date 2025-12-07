// // // 'use client'

// // // //import Image from 'next/image'
// // // import Link from 'next/link'
// // // import { useState } from 'react'
// // // import { Button } from '@/components/ui/button'
// // // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// // // import { Checkbox } from '@/components/ui/checkbox'
// // // import { useBackendCart } from '@/hooks/use-backend-cart'
// // // import { Trash2 } from 'lucide-react'

// // // export default function CartPage() {
// // //   const { cart, removeFromCart, updateQuantity,  loading, error } = useBackendCart()
// // //   const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

// // //   if (!cart) {
// // //     return (
// // //       <div className="min-h-[calc(100vh-80px)] bg-background">
// // //         <div className="max-w-7xl mx-auto px-4 py-12">
// // //           <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>
// // //           <Card className="border-border">
// // //             <CardContent className="p-12 text-center">
// // //               <p className="text-foreground/70 mb-6">Your cart is empty</p>
// // //               <Link href="/">
// // //                 <Button className="bg-foreground text-background hover:bg-foreground/90 rounded-full">
// // //                   Continue Shopping
// // //                 </Button>
// // //               </Link>
// // //             </CardContent>
// // //           </Card>
// // //         </div>
// // //       </div>
// // //     )
// // //   }

// // //   const toggleItemSelection = (id: string) => {
// // //     const newSelected = new Set(selectedItems)
// // //     if (newSelected.has(id)) {
// // //       newSelected.delete(id)
// // //     } else {
// // //       newSelected.add(id)
// // //     }
// // //     setSelectedItems(newSelected)
// // //   }

// // //   const toggleSelectAll = () => {
// // //     if (selectedItems.size === cart.items.length) {
// // //       setSelectedItems(new Set())
// // //     } else {
// // //       setSelectedItems(new Set(cart.items.map((_, idx) => idx.toString())))
// // //     }
// // //   }

// // //   const getSelectedTotal = () => {
// // //     return cart.items
// // //       .filter((_, idx) => selectedItems.has(idx.toString()))
// // //       .reduce((total, item) => total + item.lineTotal, 0)
// // //   }

// // //   const getSelectedCount = () => {
// // //     return cart.items
// // //       .filter((_, idx) => selectedItems.has(idx.toString()))
// // //       .reduce((count, item) => count + item.quantity, 0)
// // //   }

// // //   // Get selected items data for checkout
// // //   const getSelectedItemsData = () => {
// // //     const selected = cart.items
// // //       .map((item, idx) => selectedItems.has(idx.toString()) ? item : null)
// // //       .filter(Boolean)
    
// // //     return btoa(JSON.stringify(selected))
// // //   }

// // //   return (
// // //     <div className="min-h-[calc(100vh-80px)] bg-background">
// // //       <div className="max-w-7xl mx-auto px-4 py-12">
// // //         <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

// // //         {error && (
// // //           <div className="mb-4 p-4 rounded-lg bg-red-100 text-red-700 border border-red-300">
// // //             {error}
// // //           </div>
// // //         )}

// // //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// // //           {/* Cart Items */}
// // //           <div className="lg:col-span-2">
// // //             <Card className="border-border">
// // //               <CardHeader className="border-b border-border">
// // //                 <div className="flex items-center gap-3">
// // //                   <Checkbox
// // //                     checked={selectedItems.size === cart.items.length && cart.items.length > 0}
// // //                     onCheckedChange={toggleSelectAll}
// // //                   />
// // //                   <CardTitle className="text-lg">Items in Cart ({cart.items.length})</CardTitle>
// // //                 </div>
// // //               </CardHeader>
// // //               <CardContent className="p-0">
// // //                 <div className="divide-y divide-border">
// // //                   {cart.items.map((item, idx) => {
// // //                     const productId = typeof item.product === 'string' ? item.product : item.product.id
// // //                     const productTitle = typeof item.product === 'string' ? 'Product' : item.product.title
// // //                     const isSelected = selectedItems.has(idx.toString())

// // //                     return (
// // //                       <div key={`${productId}-${idx}`} className="p-4 flex gap-4 hover:bg-secondary/20 transition-colors">
// // //                         <Checkbox
// // //                           checked={isSelected}
// // //                           onCheckedChange={() => toggleItemSelection(idx.toString())}
// // //                         />

// // //                         {/* Product Details */}
// // //                         <div className="flex-1 min-w-0">
// // //                           <h3 className="font-semibold text-foreground">{productTitle}</h3>
// // //                           <p className="text-sm font-semibold text-accent mt-1">Rs. {item.unitPrice}</p>
// // //                         </div>

// // //                         {/* Quantity Controls */}
// // //                         <div className="flex flex-col items-end gap-3">
// // //                           <div className="flex items-center border border-border rounded-lg">
// // //                             <button
// // //                               onClick={() => updateQuantity(productId, item.quantity - 1)}
// // //                               className="px-2 py-1 text-foreground hover:bg-secondary/20"
// // //                               disabled={loading}
// // //                             >
// // //                               −
// // //                             </button>
// // //                             <span className="px-3 py-1 text-foreground text-sm">{item.quantity}</span>
// // //                             <button
// // //                               onClick={() => updateQuantity(productId, item.quantity + 1)}
// // //                               className="px-2 py-1 text-foreground hover:bg-secondary/20"
// // //                               disabled={loading}
// // //                             >
// // //                               +
// // //                             </button>
// // //                           </div>

// // //                           <button
// // //                             onClick={() => removeFromCart(productId)}
// // //                             className="text-accent hover:text-accent/80 transition-colors disabled:opacity-50"
// // //                             disabled={loading}
// // //                           >
// // //                             <Trash2 className="h-4 w-4" />
// // //                           </button>
// // //                         </div>

// // //                         {/* Line Total */}
// // //                         <div className="text-right">
// // //                           <p className="font-semibold text-foreground">
// // //                             Rs. {item.lineTotal.toFixed(2)}
// // //                           </p>
// // //                         </div>
// // //                       </div>
// // //                     )
// // //                   })}
// // //                 </div>
// // //               </CardContent>
// // //             </Card>
// // //           </div>

// // //           {/* Order Summary */}
// // //           <div className="lg:col-span-1">
// // //             <Card className="border-border sticky top-4">
// // //               <CardHeader className="border-b border-border">
// // //                 <CardTitle>Order Summary</CardTitle>
// // //               </CardHeader>
// // //               <CardContent className="p-4 space-y-4">
// // //                 <div className="space-y-2 pb-4 border-b border-border">
// // //                   <div className="flex justify-between text-sm">
// // //                     <span className="text-foreground/70">Subtotal</span>
// // //                     <span className="text-foreground">Rs. {cart.subtotal.toFixed(2)}</span>
// // //                   </div>
// // //                   <div className="flex justify-between text-sm">
// // //                     <span className="text-foreground/70">Selected Items</span>
// // //                     <span className="text-foreground">{getSelectedCount()}</span>
// // //                   </div>
// // //                   <div className="flex justify-between text-sm">
// // //                     <span className="text-foreground/70">Selected Total</span>
// // //                     <span className="font-semibold text-accent">Rs. {getSelectedTotal().toFixed(2)}</span>
// // //                   </div>
// // //                 </div>

// // //                 <div className="space-y-2 pb-4 border-b border-border">
// // //                   <div className="flex justify-between text-sm">
// // //                     <span className="text-foreground/70">Shipping</span>
// // //                     <span className="text-foreground">Calculated at checkout</span>
// // //                   </div>
// // //                   <div className="flex justify-between text-sm">
// // //                     <span className="text-foreground/70">Tax</span>
// // //                     <span className="text-foreground">Calculated at checkout</span>
// // //                   </div>
// // //                 </div>

// // //                 <div className="flex justify-between font-bold">
// // //                   <span className="text-foreground">Total</span>
// // //                   <span className="text-accent">Rs. {getSelectedTotal().toFixed(2)}</span>
// // //                 </div>

// // //                 <Link href={`/checkout?items=${getSelectedItemsData()}`}>
// // //                   <Button
// // //                     disabled={selectedItems.size === 0 || loading}
// // //                     className="w-full bg-foreground text-background hover:bg-foreground/90 rounded-full py-6 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
// // //                   >
// // //                     {loading ? 'Processing...' : 'Proceed to Checkout'}
// // //                   </Button>
// // //                 </Link>

// // //                 <Link href="/products">
// // //                   <Button
// // //                     variant="outline"
// // //                     className="w-full border-border text-foreground hover:bg-secondary/20 rounded-full"
// // //                   >
// // //                     Continue Shopping
// // //                   </Button>
// // //                 </Link>
// // //               </CardContent>
// // //             </Card>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   )
// // // }

// // 'use client'

// // import Link from 'next/link'
// // import { useState } from 'react'
// // import { Button } from '@/components/ui/button'
// // import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// // import { Checkbox } from '@/components/ui/checkbox'
// // import { useBackendCart } from '@/hooks/use-backend-cart'
// // import { Trash2, ShoppingBag } from 'lucide-react'

// // export default function CartPage() {
// //   const { cart, removeFromCart, updateQuantity, loading, error } = useBackendCart()
// //   const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

// //   if (!cart) {
// //     return (
// //       <div className="min-h-[calc(100vh-80px)]" style={{ backgroundColor: '#F2F0E5' }}>
// //         <div className="max-w-7xl mx-auto px-4 py-12">
// //           <h1 className="text-3xl font-bold mb-8" style={{ color: '#1a3126' }}>Shopping Cart</h1>
// //           <Card className="border-0 shadow-lg" style={{ backgroundColor: 'white' }}>
// //             <CardContent className="p-12 text-center">
// //               <ShoppingBag className="w-16 h-16 mx-auto mb-4" style={{ color: '#BB4E2C', opacity: 0.3 }} />
// //               <p className="text-lg mb-2" style={{ color: '#1a3126' }}>Your cart is empty</p>
// //               <p className="mb-6" style={{ color: '#1a3126', opacity: 0.6 }}>Start adding items to get started</p>
// //               <Link href="/">
// //                 <Button className="rounded-full px-8 py-6 text-white font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: '#BB4E2C' }}>
// //                   Continue Shopping
// //                 </Button>
// //               </Link>
// //             </CardContent>
// //           </Card>
// //         </div>
// //       </div>
// //     )
// //   }

// //   const toggleItemSelection = (id: string) => {
// //     const newSelected = new Set(selectedItems)
// //     if (newSelected.has(id)) {
// //       newSelected.delete(id)
// //     } else {
// //       newSelected.add(id)
// //     }
// //     setSelectedItems(newSelected)
// //   }

// //   const toggleSelectAll = () => {
// //     if (selectedItems.size === cart.items.length) {
// //       setSelectedItems(new Set())
// //     } else {
// //       setSelectedItems(new Set(cart.items.map((_, idx) => idx.toString())))
// //     }
// //   }

// //   const getSelectedTotal = () => {
// //     return cart.items
// //       .filter((_, idx) => selectedItems.has(idx.toString()))
// //       .reduce((total, item) => total + item.lineTotal, 0)
// //   }

// //   const getSelectedCount = () => {
// //     return cart.items
// //       .filter((_, idx) => selectedItems.has(idx.toString()))
// //       .reduce((count, item) => count + item.quantity, 0)
// //   }

// //   const getSelectedItemsData = () => {
// //     const selected = cart.items
// //       .map((item, idx) => selectedItems.has(idx.toString()) ? item : null)
// //       .filter(Boolean)
    
// //     return btoa(JSON.stringify(selected))
// //   }

// //   return (
// //     <div className="min-h-[calc(100vh-80px)]" style={{ backgroundColor: '#F2F0E5' }}>
// //       <div className="max-w-7xl mx-auto px-4 py-12">
// //         <h1 className="text-3xl font-bold mb-8" style={{ color: '#1a3126' }}>Shopping Cart</h1>

// //         {error && (
// //           <div className="mb-4 p-4 rounded-lg text-white border-0" style={{ backgroundColor: '#BB4E2C' }}>
// //             {error}
// //           </div>
// //         )}

// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
// //           {/* Cart Items */}
// //           <div className="lg:col-span-2">
// //             <Card className="border-0 shadow-lg" style={{ backgroundColor: 'white' }}>
// //               <CardHeader style={{ borderBottom: '1px solid #F2F0E5' }}>
// //                 <div className="flex items-center gap-3">
// //                   <Checkbox
// //                     checked={selectedItems.size === cart.items.length && cart.items.length > 0}
// //                     onCheckedChange={toggleSelectAll}
// //                     className="border-2"
// //                     style={{ borderColor: '#1a3126' }}
// //                   />
// //                   <CardTitle className="text-lg" style={{ color: '#1a3126' }}>
// //                     Items in Cart ({cart.items.length})
// //                   </CardTitle>
// //                 </div>
// //               </CardHeader>
// //               <CardContent className="p-0">
// //                 <div className="divide-y" style={{ borderColor: '#F2F0E5' }}>
// //                   {cart.items.map((item, idx) => {
// //                     const productId = typeof item.product === 'string' ? item.product : item.product.id
// //                     const productTitle = typeof item.product === 'string' ? 'Product' : item.product.title
// //                     const isSelected = selectedItems.has(idx.toString())

// //                     return (
// // //                       <div key={`${productId}-${idx}`} className="p-6 flex gap-4 transition-colors">
// // //                         <Checkbox
// // //                           checked={isSelected}
// // //                           onCheckedChange={() => toggleItemSelection(idx.toString())}
// // //                           className="border-2 mt-1"
// // //                           style={{ borderColor: '#1a3126' }}
// // //                         />

// // //                         {/* Product Details */}
// // //                         <div className="flex-1 min-w-0">
// // //                           <h3 className="font-semibold text-lg" style={{ color: '#1a3126' }}>
// // //                             {productTitle}
// // //                           </h3>
// // //                           <p className="text-base font-bold mt-2" style={{ color: '#BB4E2C' }}>
// // //                             Rs. {item.unitPrice.toLocaleString()}
// // //                           </p>
// // //                         </div>

// // //                         {/* Quantity Controls */}
// // //                         <div className="flex flex-col items-end gap-3">
// // //                           <div className="flex items-center border-2 rounded-full overflow-hidden" style={{ borderColor: '#1a3126' }}>
// // //                             <button
// // //                               onClick={() => updateQuantity(productId, item.quantity - 1)}
// // //                               className="px-4 py-2 font-semibold hover:opacity-70 transition-opacity"
// // //                               style={{ color: '#1a3126', backgroundColor: isSelected ? 'white' : '#F2F0E5' }}
// // //                               disabled={loading}
// // //                             >
// // //                               −
// // //                             </button>
// // //                             <span className="px-4 py-2 font-semibold min-w-[3rem] text-center" style={{ color: '#1a3126' }}>
// // //                               {item.quantity}
// // //                             </span>
// // //                             <button
// // //                               onClick={() => updateQuantity(productId, item.quantity + 1)}
// // //                               className="px-4 py-2 font-semibold hover:opacity-70 transition-opacity"
// // //                               style={{ color: '#1a3126', backgroundColor: isSelected ? 'white' : '#F2F0E5' }}
// // //                               disabled={loading}
// // //                             >
// // //                               +
// // //                             </button>
// // //                           </div>

// // //                           <button
// // //                             onClick={() => removeFromCart(productId)}
// // //                             className="hover:opacity-70 transition-opacity disabled:opacity-50"
// // //                             style={{ color: '#BB4E2C' }}
// // //                             disabled={loading}
// // //                           >
// // //                             <Trash2 className="h-5 w-5" />
// // //                           </button>
// // //                         </div>

// // //                         {/* Line Total */}
// // //                         <div className="text-right">
// // //                           <p className="font-bold text-lg" style={{ color: '#1a3126' }}>
// // //                             Rs. {item.lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
// // //                           </p>
// // //                         </div>
// // //                       </div>
// // //                     )
// // //                   })}
// // //                 </div>
// // //               </CardContent>
// // //             </Card>
// // //           </div>

// // //           {/* Order Summary */}
// // //           <div className="lg:col-span-1">
// // //             <Card className="border-0 shadow-lg sticky top-4" style={{ backgroundColor: 'white' }}>
// // //               <CardHeader style={{ borderBottom: '1px solid #F2F0E5' }}>
// // //                 <CardTitle style={{ color: '#1a3126' }}>Order Summary</CardTitle>
// // //               </CardHeader>
// // //               <CardContent className="p-6 space-y-6">
// // //                 <div className="space-y-3 pb-6" style={{ borderBottom: '1px solid #F2F0E5' }}>
// // //                   <div className="flex justify-between">
// // //                     <span style={{ color: '#1a3126', opacity: 0.7 }}>Subtotal</span>
// // //                     <span className="font-semibold" style={{ color: '#1a3126' }}>
// // //                       Rs. {cart.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
// // //                     </span>
// // //                   </div>
// // //                   <div className="flex justify-between">
// // //                     <span style={{ color: '#1a3126', opacity: 0.7 }}>Selected Items</span>
// // //                     <span className="font-semibold" style={{ color: '#1a3126' }}>
// // //                       {getSelectedCount()}
// // //                     </span>
// // //                   </div>
// // //                   <div className="flex justify-between">
// // //                     <span style={{ color: '#1a3126', opacity: 0.7 }}>Selected Total</span>
// // //                     <span className="font-bold text-lg" style={{ color: '#BB4E2C' }}>
// // //                       Rs. {getSelectedTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
// // //                     </span>
// // //                   </div>
// // //                 </div>

// // //                 <div className="space-y-3 pb-6" style={{ borderBottom: '1px solid #F2F0E5' }}>
// // //                   <div className="flex justify-between text-sm">
// // //                     <span style={{ color: '#1a3126', opacity: 0.7 }}>Shipping</span>
// // //                     <span style={{ color: '#1a3126' }}>Calculated at checkout</span>
// // //                   </div>
// // //                   <div className="flex justify-between text-sm">
// // //                     <span style={{ color: '#1a3126', opacity: 0.7 }}>Tax</span>
// // //                     <span style={{ color: '#1a3126' }}>Calculated at checkout</span>
// // //                   </div>
// // //                 </div>

// // //                 <div className="flex justify-between items-center py-2">
// // //                   <span className="text-xl font-bold" style={{ color: '#1a3126' }}>Total</span>
// // //                   <span className="text-2xl font-bold" style={{ color: '#BB4E2C' }}>
// // //                     Rs. {getSelectedTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
// // //                   </span>
// // //                 </div>

// // //                 <Link href={`/checkout?items=${getSelectedItemsData()}`}>
// // //                   <Button
// // //                     disabled={selectedItems.size === 0 || loading}
// // //                     className="w-full text-white rounded-full py-6 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
// // //                     style={{ backgroundColor: '#BB4E2C' }}
// // //                   >
// // //                     {loading ? 'Processing...' : 'Proceed to Checkout'}
// // //                   </Button>
// // //                 </Link>

// // //                 <Link href="/products">
// // //                   <Button
// // //                     variant="outline"
// // //                     className="w-full rounded-full py-6 font-semibold border-2 hover:opacity-70 transition-opacity"
// // //                     style={{ 
// // //                       borderColor: '#1a3126',
// // //                       color: '#1a3126',
// // //                       backgroundColor: 'transparent'
// // //                     }}
// // //                   >
// // //                     Continue Shopping
// // //                   </Button>
// // //                 </Link>
// // //               </CardContent>
// // //             </Card>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   )
// // // }


// 'use client'

// import Link from 'next/link'
// import Image from 'next/image'
// import { useState } from 'react'
// import { Button } from '@/components/ui/button'
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
// import { Checkbox } from '@/components/ui/checkbox'
// import { useBackendCart } from '@/hooks/use-backend-cart'
// import { Trash2, ShoppingBag } from 'lucide-react'

// export default function CartPage() {
//   const { cart, removeFromCart, updateQuantity, loading, error } = useBackendCart()
//   const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

//   if (!cart) {
//     return (
//       <div className="min-h-[calc(100vh-80px)] relative">
//         <Image
//           src="/cartWhite.webp"
//           alt="Background"
//           fill
//           className="object-cover"
//           priority
//         />
//         <div className="relative z-10">
//           <div className="max-w-7xl mx-auto px-4 py-12">
//             <h1 className="text-3xl font-bold mb-8" style={{ color: '#1a3126' }}>Shopping Cart</h1>
//             <Card className="border-0 shadow-lg" style={{ backgroundColor: 'white' }}>
//               <CardContent className="p-12 text-center">
//                 <ShoppingBag className="w-16 h-16 mx-auto mb-4" style={{ color: '#BB4E2C', opacity: 0.3 }} />
//                 <p className="text-lg mb-2" style={{ color: '#1a3126' }}>Your cart is empty</p>
//                 <p className="mb-6" style={{ color: '#1a3126', opacity: 0.6 }}>Start adding items to get started</p>
//                 <Link href="/">
//                   <Button className="rounded-full px-8 py-6 text-white font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: '#BB4E2C' }}>
//                     Continue Shopping
//                   </Button>
//                 </Link>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   const toggleItemSelection = (id: string) => {
//     const newSelected = new Set(selectedItems)
//     if (newSelected.has(id)) {
//       newSelected.delete(id)
//     } else {
//       newSelected.add(id)
//     }
//     setSelectedItems(newSelected)
//   }

//   const toggleSelectAll = () => {
//     if (selectedItems.size === cart.items.length) {
//       setSelectedItems(new Set())
//     } else {
//       setSelectedItems(new Set(cart.items.map((_, idx) => idx.toString())))
//     }
//   }

//   const getSelectedTotal = () => {
//     return cart.items
//       .filter((_, idx) => selectedItems.has(idx.toString()))
//       .reduce((total, item) => total + item.lineTotal, 0)
//   }

//   const getSelectedCount = () => {
//     return cart.items
//       .filter((_, idx) => selectedItems.has(idx.toString()))
//       .reduce((count, item) => count + item.quantity, 0)
//   }

//   const getSelectedItemsData = () => {
//     const selected = cart.items
//       .map((item, idx) => selectedItems.has(idx.toString()) ? item : null)
//       .filter(Boolean)
    
//     return btoa(JSON.stringify(selected))
//   }

//   return (
//     <div className="min-h-[calc(100vh-80px)] relative">
//       <Image
//         src="/cartWhite.jpg"
//         alt="Background"
//         fill
//         className="object-cover"
//         priority
//       />
//       <div className="relative z-10">
//         <div className="max-w-7xl mx-auto px-4 py-12">
//           <h1 className="text-3xl font-bold mb-8" style={{ color: '#1a3126' }}>Shopping Cart</h1>

//           {error && (
//             <div className="mb-4 p-4 rounded-lg text-white border-0" style={{ backgroundColor: '#BB4E2C' }}>
//               {error}
//             </div>
//           )}

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* Cart Items */}
//             <div className="lg:col-span-2">
//               <Card className="border-0 shadow-lg" style={{ backgroundColor: 'white' }}>
//                 <CardHeader style={{ borderBottom: '1px solid #F2F0E5' }}>
//                   <div className="flex items-center gap-3">
//                     <Checkbox
//                       checked={selectedItems.size === cart.items.length && cart.items.length > 0}
//                       onCheckedChange={toggleSelectAll}
//                       className="border-2"
//                       style={{ borderColor: '#1a3126' }}
//                     />
//                     <CardTitle className="text-lg" style={{ color: '#1a3126' }}>
//                       Items in Cart ({cart.items.length})
//                     </CardTitle>
//                   </div>
//                 </CardHeader>
//                 <CardContent className="p-0">
//                   <div className="divide-y" style={{ borderColor: '#F2F0E5' }}>
//                     {cart.items.map((item, idx) => {
//                       const productId = typeof item.product === 'string' ? item.product : item.product.id
//                       const productTitle = typeof item.product === 'string' ? 'Product' : item.product.title
//                       const isSelected = selectedItems.has(idx.toString())

//                       return (
//                         <div 
//                           key={`${productId}-${idx}`} 
//                           className="p-6 flex gap-4 transition-colors"
//                           style={{ 
//                             backgroundColor: isSelected ? 'white' : 'white'
//                           }}
//                         >
//                           <Checkbox
//                             checked={isSelected}
//                             onCheckedChange={() => toggleItemSelection(idx.toString())}
//                             className="border-2 mt-1"
//                             style={{ borderColor: '#1a3126' }}
//                           />

//                           {/* Product Details */}
//                           <div className="flex-1 min-w-0">
//                             <h3 className="font-semibold text-lg" style={{ color: '#1a3126' }}>
//                               {productTitle}
//                             </h3>
//                             <p className="text-base font-bold mt-2" style={{ color: '#BB4E2C' }}>
//                               Rs. {item.unitPrice.toLocaleString()}
//                             </p>
//                           </div>

//                           {/* Quantity Controls */}
//                           <div className="flex flex-col items-end gap-3">
//                             <div className="flex items-center border-2 rounded-full overflow-hidden" style={{ borderColor: '#1a3126' }}>
//                               <button
//                                 onClick={() => updateQuantity(productId, item.quantity - 1)}
//                                 className="px-4 py-2 font-semibold hover:opacity-70 transition-opacity"
//                                 style={{ color: '#1a3126', backgroundColor: isSelected ? 'white' : 'white' }}
//                                 disabled={loading}
//                               >
//                                 −
//                               </button>
//                               <span className="px-4 py-2 font-semibold min-w-12 text-center" style={{ color: '#1a3126' }}>
//                                 {item.quantity}
//                               </span>
//                               <button
//                                 onClick={() => updateQuantity(productId, item.quantity + 1)}
//                                 className="px-4 py-2 font-semibold hover:opacity-70 transition-opacity"
//                                 style={{ color: '#1a3126', backgroundColor: isSelected ? 'white' : 'white' }}
//                                 disabled={loading}
//                               >
//                                 +
//                               </button>
//                             </div>

//                             <button
//                               onClick={() => removeFromCart(productId)}
//                               className="hover:opacity-70 transition-opacity disabled:opacity-50"
//                               style={{ color: '#BB4E2C' }}
//                               disabled={loading}
//                             >
//                               <Trash2 className="h-5 w-5" />
//                             </button>
//                           </div>

//                           {/* Line Total */}
//                           <div className="text-right">
//                             <p className="font-bold text-lg" style={{ color: '#1a3126' }}>
//                               Rs. {item.lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                             </p>
//                           </div>
//                         </div>
//                       )
//                     })}
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>

//             {/* Order Summary */}
//             <div className="lg:col-span-1">
//               <Card className="border-0 shadow-lg sticky top-4" style={{ backgroundColor: 'white' }}>
//                 <CardHeader style={{ borderBottom: '1px solid #F2F0E5' }}>
//                   <CardTitle style={{ color: '#1a3126' }}>Order Summary</CardTitle>
//                 </CardHeader>
//                 <CardContent className="p-6 space-y-6">
//                   <div className="space-y-3 pb-6" style={{ borderBottom: '1px solid #F2F0E5' }}>
//                     <div className="flex justify-between">
//                       <span style={{ color: '#1a3126', opacity: 0.7 }}>Subtotal</span>
//                       <span className="font-semibold" style={{ color: '#1a3126' }}>
//                         Rs. {cart.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span style={{ color: '#1a3126', opacity: 0.7 }}>Selected Items</span>
//                       <span className="font-semibold" style={{ color: '#1a3126' }}>
//                         {getSelectedCount()}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span style={{ color: '#1a3126', opacity: 0.7 }}>Selected Total</span>
//                       <span className="font-bold text-lg" style={{ color: '#BB4E2C' }}>
//                         Rs. {getSelectedTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                       </span>
//                     </div>
//                   </div>

//                   <div className="space-y-3 pb-6" style={{ borderBottom: '1px solid #F2F0E5' }}>
//                     <div className="flex justify-between text-sm">
//                       <span style={{ color: '#1a3126', opacity: 0.7 }}>Shipping</span>
//                       <span style={{ color: '#1a3126' }}>Calculated at checkout</span>
//                     </div>
//                     <div className="flex justify-between text-sm">
//                       <span style={{ color: '#1a3126', opacity: 0.7 }}>Tax</span>
//                       <span style={{ color: '#1a3126' }}>Calculated at checkout</span>
//                     </div>
//                   </div>

//                   <div className="flex justify-between items-center py-2">
//                     <span className="text-xl font-bold" style={{ color: '#1a3126' }}>Total</span>
//                     <span className="text-2xl font-bold" style={{ color: '#BB4E2C' }}>
//                       Rs. {getSelectedTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                     </span>
//                   </div>

//                   <Link href={`/checkout?items=${getSelectedItemsData()}`}>
//                     <Button
//                       disabled={selectedItems.size === 0 || loading}
//                       className="w-full text-white rounded-full py-6 font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
//                       style={{ backgroundColor: '#BB4E2C' }}
//                     >
//                       {loading ? 'Processing...' : 'Proceed to Checkout'}
//                     </Button>
//                   </Link>
// <div className='px-2'></div>
//                   <Link href="/products">
//                     <Button
//                       variant="outline"
//                       className="w-full rounded-full py-6 font-semibold border-2 hover:opacity-70 transition-opacity"
//                       style={{ 
//                         borderColor: '#1a3126',
//                         color: '#1a3126',
//                         backgroundColor: 'transparent'
//                       }}
//                     >
//                       Continue Shopping
//                     </Button>
//                   </Link>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useBackendCart } from '@/hooks/use-backend-cart'
import { Trash2, ShoppingBag } from 'lucide-react'

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, loading, error } = useBackendCart()
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  if (!cart) {
    return (
      <div className="min-h-[calc(100vh-80px)] relative">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/cartWhite.webp"
            alt="Background"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </div>
        
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <h1 className="text-2xl sm:text-3xl font-medium font-serif mb-6 sm:mb-8" style={{ color: '#1a3126' }}>
              Shopping Cart
            </h1>
            <Card className="border-0 shadow-lg" style={{ backgroundColor: 'white' }}>
              <CardContent className="p-8 sm:p-12 text-center">
                <ShoppingBag className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4" style={{ color: '#BB4E2C', opacity: 0.3 }} />
                <p className="text-base sm:text-lg mb-2" style={{ color: '#1a3126' }}>Your cart is empty</p>
                <p className="text-sm sm:text-base mb-6" style={{ color: '#1a3126', opacity: 0.6 }}>
                  Start adding items to get started
                </p>
                <Link href="/">
                  <Button className="rounded-full px-6 sm:px-8 py-4 sm:py-6 text-white font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: '#BB4E2C' }}>
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

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
    if (selectedItems.size === cart.items.length) {
      setSelectedItems(new Set())
    } else {
      setSelectedItems(new Set(cart.items.map((_, idx) => idx.toString())))
    }
  }

  const getSelectedTotal = () => {
    return cart.items
      .filter((_, idx) => selectedItems.has(idx.toString()))
      .reduce((total, item) => total + item.lineTotal, 0)
  }

  const getSelectedCount = () => {
    return cart.items
      .filter((_, idx) => selectedItems.has(idx.toString()))
      .reduce((count, item) => count + item.quantity, 0)
  }

  const getSelectedItemsData = () => {
    const selected = cart.items
      .map((item, idx) => selectedItems.has(idx.toString()) ? item : null)
      .filter(Boolean)
    
    return btoa(JSON.stringify(selected))
  }

  return (
    <div className="min-h-[calc(100vh-80px)] relative">
      {/* Background Image - Fixed to use .webp */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/cartWhite.webp"
          alt="Background"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>
      
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-2xl sm:text-3xl font-medium font-serif mb-6 sm:mb-8" style={{ color: '#1a3126' }}>
            Shopping Cart
          </h1>

          {error && (
            <div className="mb-4 p-3 sm:p-4 rounded-lg text-white border-0 text-sm sm:text-base" style={{ backgroundColor: '#BB4E2C' }}>
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-lg" style={{ backgroundColor: 'white' }}>
                <CardHeader style={{ borderBottom: '1px solid #F2F0E5' }} className="p-4 sm:p-6">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={selectedItems.size === cart.items.length && cart.items.length > 0}
                      onCheckedChange={toggleSelectAll}
                      className="border-2"
                      style={{ borderColor: '#1a3126' }}
                    />
                    <CardTitle className="text-base sm:text-lg" style={{ color: '#1a3126' }}>
                      Items in Cart ({cart.items.length})
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y" style={{ borderColor: '#F2F0E5' }}>
                    {cart.items.map((item, idx) => {
                      const productId = typeof item.product === 'string' ? item.product : item.product.id
                      const productTitle = typeof item.product === 'string' ? 'Product' : item.product.title
                      const isSelected = selectedItems.has(idx.toString())

                      return (
                        <div 
                          key={`${productId}-${idx}`} 
                          className="p-4 sm:p-6"
                          style={{ backgroundColor: 'white' }}
                        >
                          {/* Mobile Layout */}
                          <div className="flex flex-col sm:hidden gap-3">
                            <div className="flex gap-3">
                              <Checkbox
                                checked={isSelected}
                                onCheckedChange={() => toggleItemSelection(idx.toString())}
                                className="border-2 mt-1"
                                style={{ borderColor: '#1a3126' }}
                              />
                              <div className="flex-1">
                                <h3 className="font-semibold text-base" style={{ color: '#1a3126' }}>
                                  {productTitle}
                                </h3>
                                <p className="text-sm font-bold mt-1" style={{ color: '#BB4E2C' }}>
                                  Rs. {item.unitPrice.toLocaleString()}
                                </p>
                              </div>
                              <button
                                onClick={() => removeFromCart(productId)}
                                className="hover:opacity-70 transition-opacity disabled:opacity-50 h-fit"
                                style={{ color: '#BB4E2C' }}
                                disabled={loading}
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            
                            <div className="flex items-center justify-between pl-8">
                              <div className="flex items-center border-2 rounded-full overflow-hidden" style={{ borderColor: '#1a3126' }}>
                                <button
                                  onClick={() => updateQuantity(productId, item.quantity - 1)}
                                  className="px-3 py-1 text-sm font-semibold hover:opacity-70 transition-opacity"
                                  style={{ color: '#1a3126' }}
                                  disabled={loading}
                                >
                                  −
                                </button>
                                <span className="px-3 py-1 text-sm font-semibold min-w-10 text-center" style={{ color: '#1a3126' }}>
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(productId, item.quantity + 1)}
                                  className="px-3 py-1 text-sm font-semibold hover:opacity-70 transition-opacity"
                                  style={{ color: '#1a3126' }}
                                  disabled={loading}
                                >
                                  +
                                </button>
                              </div>
                              
                              <p className="font-bold text-base" style={{ color: '#1a3126' }}>
                                Rs. {item.lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </p>
                            </div>
                          </div>

                          {/* Desktop Layout */}
                          <div className="hidden sm:flex gap-4 items-start">
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={() => toggleItemSelection(idx.toString())}
                              className="border-2 mt-1"
                              style={{ borderColor: '#1a3126' }}
                            />

                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-lg" style={{ color: '#1a3126' }}>
                                {productTitle}
                              </h3>
                              <p className="text-base font-bold mt-2" style={{ color: '#BB4E2C' }}>
                                Rs. {item.unitPrice.toLocaleString()}
                              </p>
                            </div>

                            <div className="flex flex-col items-end gap-3">
                              <div className="flex items-center border-2 rounded-full overflow-hidden" style={{ borderColor: '#1a3126' }}>
                                <button
                                  onClick={() => updateQuantity(productId, item.quantity - 1)}
                                  className="px-4 py-2 font-semibold hover:opacity-70 transition-opacity"
                                  style={{ color: '#1a3126' }}
                                  disabled={loading}
                                >
                                  −
                                </button>
                                <span className="px-4 py-2 font-semibold min-w-12 text-center" style={{ color: '#1a3126' }}>
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() => updateQuantity(productId, item.quantity + 1)}
                                  className="px-4 py-2 font-semibold hover:opacity-70 transition-opacity"
                                  style={{ color: '#1a3126' }}
                                  disabled={loading}
                                >
                                  +
                                </button>
                              </div>

                              <button
                                onClick={() => removeFromCart(productId)}
                                className="hover:opacity-70 transition-opacity disabled:opacity-50"
                                style={{ color: '#BB4E2C' }}
                                disabled={loading}
                              >
                                <Trash2 className="h-5 w-5" />
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="font-bold text-lg" style={{ color: '#1a3126' }}>
                                Rs. {item.lineTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </p>
                            </div>
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
              <Card className="border-0 shadow-lg lg:sticky lg:top-4" style={{ backgroundColor: 'white' }}>
                <CardHeader style={{ borderBottom: '1px solid #F2F0E5' }} className="p-4 sm:p-6">
                  <CardTitle className="text-lg sm:text-xl" style={{ color: '#1a3126' }}>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                  <div className="space-y-2 sm:space-y-3 pb-4 sm:pb-6" style={{ borderBottom: '1px solid #F2F0E5' }}>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: '#1a3126', opacity: 0.7 }}>Subtotal</span>
                      <span className="font-semibold" style={{ color: '#1a3126' }}>
                        Rs. {cart.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: '#1a3126', opacity: 0.7 }}>Selected Items</span>
                      <span className="font-semibold" style={{ color: '#1a3126' }}>
                        {getSelectedCount()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm sm:text-base" style={{ color: '#1a3126', opacity: 0.7 }}>Selected Total</span>
                      <span className="font-bold text-base sm:text-lg" style={{ color: '#BB4E2C' }}>
                        Rs. {getSelectedTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 sm:space-y-3 pb-4 sm:pb-6" style={{ borderBottom: '1px solid #F2F0E5' }}>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span style={{ color: '#1a3126', opacity: 0.7 }}>Shipping</span>
                      <span style={{ color: '#1a3126' }}>Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span style={{ color: '#1a3126', opacity: 0.7 }}>Tax</span>
                      <span style={{ color: '#1a3126' }}>Calculated at checkout</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-lg sm:text-xl font-bold" style={{ color: '#1a3126' }}>Total</span>
                    <span className="text-xl sm:text-2xl font-bold" style={{ color: '#BB4E2C' }}>
                      Rs. {getSelectedTotal().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>

                  <Link href={`/checkout?items=${getSelectedItemsData()}`}>
                    <Button
                      disabled={selectedItems.size === 0 || loading}
                      className="w-full text-white rounded-full py-4 sm:py-6 text-sm sm:text-base font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                      style={{ backgroundColor: '#BB4E2C' }}
                    >
                      {loading ? 'Processing...' : 'Proceed to Checkout'}
                    </Button>
                  </Link>

                  <div className="h-2"></div>

                  <Link href="/products">
                    <Button
                      variant="outline"
                      className="w-full rounded-full py-4 sm:py-6 text-sm sm:text-base font-semibold border-2 hover:opacity-70 transition-opacity"
                      style={{ 
                        borderColor: '#1a3126',
                        color: '#1a3126',
                        backgroundColor: 'transparent'
                      }}
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
    </div>
  )
}