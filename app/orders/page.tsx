"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import { Trash2 } from "lucide-react"

type Order = {
  id: string
  items: Array<{ productId: string; name: string; price: number; quantity: number }>
  customerInfo: { firstName: string; lastName: string; email: string; phone: string }
  shippingAddress: { address: string; city: string; state: string; zipCode: string }
  paymentMethod: { cardNumber: string; cardType: string }
  total: number
  status: string
  createdAt: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingOrderId, setDeletingOrderId] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        const results: Order[] = []
        // Load from localStorage history first for resilience
        try {
          const raw = localStorage.getItem("ordersHistory")
          if (raw) {
            const parsed = JSON.parse(raw) as Order[]
            results.push(...parsed)
          }
        } catch {}

        // Load from API (in-memory), may be empty on fresh boot
        try {
          const res = await apiClient.getOrders()
          if (res?.success && Array.isArray(res.data)) {
            // Deduplicate by id, prefer API data ordering (assume newest first)
            const seen = new Set<string>()
            const merged: Order[] = []
            for (const o of res.data as Order[]) {
              if (o?.id && !seen.has(o.id)) {
                seen.add(o.id)
                merged.push(o)
              }
            }
            for (const o of results) {
              if (o?.id && !seen.has(o.id)) {
                seen.add(o.id)
                merged.push(o)
              }
            }
            setOrders(merged)
          } else {
            setOrders(results)
          }
        } catch {
          setOrders(results)
        }
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleDeleteOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to delete this order?")) {
      return
    }

    setDeletingOrderId(orderId)
    try {
      const response = await apiClient.deleteOrder(orderId)
      if (response?.success) {
        // Remove from state
        setOrders((prev) => prev.filter((order) => order.id !== orderId))
        // Remove from localStorage
        try {
          const raw = localStorage.getItem("ordersHistory")
          if (raw) {
            const parsed = JSON.parse(raw) as Order[]
            const updated = parsed.filter((o) => o.id !== orderId)
            localStorage.setItem("ordersHistory", JSON.stringify(updated))
          }
        } catch {}
      } else {
        alert("Failed to delete order")
      }
    } catch (error) {
      console.error("Error deleting order:", error)
      alert("Error deleting order")
    } finally {
      setDeletingOrderId(null)
    }
  }

  const totalCount = useMemo(() => orders.length, [orders])

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">My Orders</h1>
            <p className="text-lg text-muted-foreground">View your placed orders and receipts</p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : totalCount === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <h2 className="text-2xl font-bold text-foreground mb-2">No orders yet</h2>
              <p className="text-muted-foreground mb-6">Place an order to see it here</p>
              <Link href="/products">
                <Button size="lg">Shop Products</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order, idx) => (
                <div
                  key={order.id}
                  className="bg-card border border-border rounded-lg p-6 animate-fade-in"
                  style={{ animationDelay: `${idx * 40}ms` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID</p>
                      <p className="font-semibold text-foreground">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Placed On</p>
                      <p className="font-semibold text-foreground">{new Date(order.createdAt).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-semibold text-primary">${(order.total * 1.1).toFixed(2)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/receipt/${order.id}`}>
                        <Button size="sm" className="whitespace-nowrap">
                          View Receipt
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        className="whitespace-nowrap"
                        onClick={() => handleDeleteOrder(order.id)}
                        disabled={deletingOrderId === order.id}
                      >
                        {deletingOrderId === order.id ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-2">Customer</h3>
                      <p className="text-sm text-muted-foreground">
                        {order.customerInfo.firstName} {order.customerInfo.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{order.customerInfo.email}</p>
                      <p className="text-sm text-muted-foreground">{order.customerInfo.phone}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-2">Shipping</h3>
                      <p className="text-sm text-muted-foreground">{order.shippingAddress.address}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-2">Payment</h3>
                      <p className="text-sm text-muted-foreground">{order.paymentMethod.cardType}</p>
                      <p className="text-sm text-muted-foreground">Card ending in {order.paymentMethod.cardNumber}</p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-foreground mb-2">Items</h3>
                    <div className="divide-y divide-border">
                      {order.items.map((item) => (
                        <div key={item.productId} className="py-2 flex justify-between text-sm">
                          <span className="text-foreground">
                            {item.name} × {item.quantity}
                          </span>
                          <span className="text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}
