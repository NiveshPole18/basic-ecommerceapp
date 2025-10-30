"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import { apiClient } from "@/lib/api-client"

type CartItem = {
  productId: string
  name: string
  price: number
  quantity: number
}

type CartData = {
  items: CartItem[]
  total: number
}

type CartContextValue = {
  count: number
  cart: CartData | null
  refresh: () => Promise<void>
  setCartDirect: (cart: CartData) => void
}

const CartContext = createContext<CartContextValue | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartData | null>(null)
  const [count, setCount] = useState(0)

  const recalc = useCallback((c: CartData | null) => {
    setCount(c?.items?.reduce((sum, i) => sum + (i.quantity ?? 0), 0) ?? 0)
  }, [])

  const refresh = useCallback(async () => {
    try {
      const res = await apiClient.getCart()
      if (res?.success) {
        setCart(res.data)
        recalc(res.data)
      }
    } catch {
      // noop
    }
  }, [recalc])

  const setCartDirect = useCallback((c: CartData) => {
    setCart(c)
    recalc(c)
  }, [recalc])

  useEffect(() => {
    refresh()
  }, [refresh])

  const value = useMemo(() => ({ count, cart, refresh, setCartDirect }), [count, cart, refresh, setCartDirect])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCart must be used within CartProvider")
  return ctx
}
