"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useCart } from "@/lib/cart-context"
import { RotatingTorusBackground } from "@/components/3d-backgrounds"

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface CartData {
  items: CartItem[]
  total: number
}

export default function CartPage() {
  const [cart, setCart] = useState<CartData | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const { toast } = useToast()
  const { setCartDirect, refresh } = useCart()

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await apiClient.getCart()
        if (response.success) {
          setCart(response.data)
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [])

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    setUpdating(productId)
    try {
      const response = await apiClient.updateCartItem(productId, newQuantity)
      if (response.success && cart) {
        setCart(response.data)
        setCartDirect(response.data)
        toast({
          title: "Cart updated",
          description: "Item quantity has been updated.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
  }

  const handleRemoveItem = async (productId: string) => {
    setUpdating(productId)
    try {
      const response = await apiClient.updateCartItem(productId, 0)
      if (response.success && cart) {
        setCart(response.data)
        setCartDirect(response.data)
        toast({
          title: "Item removed",
          description: "Item has been removed from your cart.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      })
    } finally {
      setUpdating(null)
    }
  }

  const handleClearCart = async () => {
    try {
      const response = await apiClient.clearCart()
      if (response.success) {
        const empty = { items: [], total: 0 }
        setCart(empty)
        setCartDirect(empty)
        toast({
          title: "Cart cleared",
          description: "Your cart has been cleared.",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear cart",
        variant: "destructive",
      })
    }
  }

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero Section with 3D Background */}
      <section className="relative bg-gradient-to-br from-primary/10 to-accent/5 py-12 md:py-16 overflow-hidden">
        <RotatingTorusBackground />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Shopping Cart</h1>
            <p className="text-lg text-muted-foreground">Review and manage your items before checkout</p>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="flex-1 py-12 md:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-6">Add some products to get started</p>
              <Link href="/products">
                <Button size="lg" className="gap-2">
                  Continue Shopping
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4 animate-slide-in-left">
                {cart.items.map((item, index) => (
                  <div
                    key={item.productId}
                    className="bg-card border border-border rounded-lg p-4 md:p-6 hover:border-primary transition-all duration-300 animate-fade-in"
                    style={{
                      animationDelay: `${index * 50}ms`,
                    }}
                  >
                    <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                      {/* Product Image */}
                      <div className="relative w-full sm:w-20 md:w-24 h-32 sm:h-20 md:h-24 flex-shrink-0 bg-muted rounded-lg overflow-hidden">
                        <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h3 className="font-semibold text-foreground text-base md:text-lg">{item.name}</h3>
                          <p className="text-primary font-bold mt-1">${item.price.toFixed(2)}</p>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          <button
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                            disabled={updating === item.productId}
                            className="p-1 hover:bg-muted rounded transition-colors disabled:opacity-50"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                            disabled={updating === item.productId}
                            className="p-1 hover:bg-muted rounded transition-colors disabled:opacity-50"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Price and Remove */}
                      <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-between gap-4">
                        <p className="font-bold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                        <button
                          onClick={() => handleRemoveItem(item.productId)}
                          disabled={updating === item.productId}
                          className="p-2 hover:bg-destructive/10 text-destructive rounded transition-colors disabled:opacity-50"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1 animate-slide-in-right">
                <div className="bg-card border border-border rounded-lg p-6 sticky top-20 space-y-6">
                  <h2 className="text-xl font-bold text-foreground">Order Summary</h2>

                  <div className="space-y-3 border-b border-border pb-4">
                    <div className="flex justify-between text-foreground text-sm md:text-base">
                      <span>Subtotal</span>
                      <span>${cart.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-foreground text-sm md:text-base">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between text-foreground text-sm md:text-base">
                      <span>Tax</span>
                      <span>${(cart.total * 0.1).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between text-lg font-bold text-foreground">
                    <span>Total</span>
                    <span className="text-primary">${(cart.total * 1.1).toFixed(2)}</span>
                  </div>

                  <Link href="/checkout" className="block">
                    <Button size="lg" className="w-full gap-2">
                      Proceed to Checkout
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>

                  <Button variant="outline" size="lg" className="w-full bg-transparent" onClick={handleClearCart}>
                    Clear Cart
                  </Button>

                  <Link href="/products" className="block">
                    <Button variant="ghost" size="lg" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
