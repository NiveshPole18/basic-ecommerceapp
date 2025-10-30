"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import { CheckCircle, Download, Home, Package, Truck } from "lucide-react"

interface Order {
  id: string
  items: Array<{
    productId: string
    name: string
    price: number
    quantity: number
  }>
  customerInfo: {
    firstName: string
    lastName: string
    email: string
    phone: string
  }
  shippingAddress: {
    address: string
    city: string
    state: string
    zipCode: string
  }
  paymentMethod: {
    cardNumber: string
    cardType: string
  }
  total: number
  status: string
  createdAt: string
}

export default function ReceiptPage({ params }: { params: { orderId: string } }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        // Immediate optimistic load from localStorage
        try {
          const cached = localStorage.getItem("lastOrder")
          if (cached) {
            const parsed = JSON.parse(cached) as Order
            if (parsed?.id === params.orderId) {
              setOrder(parsed)
            }
          }
        } catch {}

        // Then attempt to fetch from API and prefer fresh data when available
        const response = await apiClient.getOrder(params.orderId)
        const apiOrder = response?.data
        if (response?.success && apiOrder?.id === params.orderId) {
          setOrder(apiOrder)
        } else {
          // Ensure fallback if API didn't return the expected order
          try {
            const cached = localStorage.getItem("lastOrder")
            if (cached) {
              const parsed = JSON.parse(cached) as Order
              if (parsed?.id === params.orderId) {
                setOrder((prev) => prev ?? parsed)
              }
            }
          } catch {}
        }
      } catch (error) {
        console.error("Failed to fetch order:", error)
        // Final fallback
        try {
          const cached = localStorage.getItem("lastOrder")
          if (cached) {
            const parsed = JSON.parse(cached) as Order
            if (parsed?.id === params.orderId) {
              setOrder((prev) => prev ?? parsed)
            }
          }
        } catch {}
      } finally {
        setLoading(false)
      }
    }

    fetchOrder()
  }, [params.orderId])

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!order) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Header />
        <section className="flex-1 flex items-center justify-center py-20">
          <div className="text-center animate-fade-in">
            <h2 className="text-2xl font-bold text-foreground mb-2">Order Not Found</h2>
            <p className="text-muted-foreground mb-6">We couldn't find your order</p>
            <Link href="/products">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  const orderDate = new Date(order.createdAt)
  const estimatedDelivery = new Date(orderDate.getTime() + 5 * 24 * 60 * 60 * 1000)
  const total = order.total * 1.1

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Success Section */}
      <section className="bg-gradient-to-br from-green-500/10 to-green-500/5 py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-green-500/20 rounded-full blur-xl animate-pulse"></div>
                <CheckCircle className="w-20 h-20 text-green-500 relative" />
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Order Confirmed!</h1>
            <p className="text-lg text-muted-foreground mb-2">Thank you for your purchase</p>
            <p className="text-sm text-muted-foreground">Order ID: {order.id}</p>
          </div>
        </div>
      </section>

      {/* Receipt Content */}
      <section className="flex-1 py-12 md:py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Order Status Timeline */}
            <div className="bg-card border border-border rounded-lg p-6 animate-slide-in-left">
              <h2 className="text-xl font-bold text-foreground mb-6">Order Status</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                    <CheckCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Order Confirmed</p>
                    <p className="text-sm text-muted-foreground">
                      {orderDate.toLocaleDateString()} at {orderDate.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 opacity-50">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Package className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Processing</p>
                    <p className="text-sm text-muted-foreground">Your order is being prepared</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 opacity-50">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                    <Truck className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Shipped</p>
                    <p className="text-sm text-muted-foreground">
                      Estimated delivery: {estimatedDelivery.toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-in-right">
              {/* Shipping Information */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                  <Truck className="w-5 h-5" /> Shipping Address
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">
                    {order.customerInfo.firstName} {order.customerInfo.lastName}
                  </p>
                  <p>{order.shippingAddress.address}</p>
                  <p>
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  </p>
                  <p className="pt-2 border-t border-border mt-2">{order.customerInfo.email}</p>
                  <p>{order.customerInfo.phone}</p>
                </div>
              </div>

              {/* Payment Information */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Payment Method</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground">{order.paymentMethod.cardType}</p>
                  <p>Card ending in {order.paymentMethod.cardNumber}</p>
                  <p className="pt-2 border-t border-border mt-2">
                    <span className="text-foreground font-semibold">Total Paid:</span> ${total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-card border border-border rounded-lg p-6 animate-fade-in">
              <h3 className="text-lg font-bold text-foreground mb-6">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={item.productId}
                    className="flex justify-between items-center pb-4 border-b border-border last:border-0"
                    style={{
                      animation: `fade-in 0.5s ease-out ${index * 100}ms forwards`,
                      opacity: 0,
                    }}
                  >
                    <div>
                      <p className="font-medium text-foreground">{item.name}</p>
                      <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <p className="font-semibold text-foreground">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>

              {/* Order Total */}
              <div className="mt-6 pt-6 border-t border-border space-y-3">
                <div className="flex justify-between text-foreground">
                  <span>Subtotal</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-foreground">
                  <span>Tax (10%)</span>
                  <span>${(order.total * 0.1).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-in-left">
              <Button size="lg" variant="outline" className="flex-1 gap-2 bg-transparent">
                <Download className="w-4 h-4" /> Download Receipt
              </Button>
              <Link href="/products" className="flex-1">
                <Button size="lg" className="w-full gap-2">
                  <Home className="w-4 h-4" /> Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
