export const apiClient = {
  async getProducts(category?: string) {
    const url = new URL("/api/products", window.location.origin)
    if (category) url.searchParams.append("category", category)
    const res = await fetch(url)
    return res.json()
  },

  async getProduct(id: string) {
    const res = await fetch(`/api/products/${id}`)
    return res.json()
  },

  async getCart(cartId?: string) {
    const url = new URL("/api/cart", window.location.origin)
    if (cartId) url.searchParams.append("cartId", cartId)
    const res = await fetch(url)
    return res.json()
  },

  async addToCart(item: {
    cartId?: string
    productId: string
    quantity: number
    price: number
    name: string
  }) {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    })
    return res.json()
  },

  async updateCartItem(productId: string, quantity: number, cartId?: string) {
    const res = await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartId, productId, quantity }),
    })
    return res.json()
  },

  async clearCart(cartId?: string) {
    const url = new URL("/api/cart", window.location.origin)
    if (cartId) url.searchParams.append("cartId", cartId)
    const res = await fetch(url, { method: "DELETE" })
    return res.json()
  },

  async checkout(data: {
    cartItems: any[]
    customerInfo: any
    shippingAddress: any
    paymentMethod: string
  }) {
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return res.json()
  },

  async getOrder(orderId: string) {
    const url = new URL("/api/checkout", window.location.origin)
    url.searchParams.append("orderId", orderId)
    const res = await fetch(url)
    return res.json()
  },

  async getOrders() {
    const res = await fetch("/api/checkout")
    return res.json()
  },

  async deleteOrder(orderId: string) {
    const url = new URL("/api/checkout", window.location.origin)
    url.searchParams.append("orderId", orderId)
    const res = await fetch(url, { method: "DELETE" })
    return res.json()
  },
}
