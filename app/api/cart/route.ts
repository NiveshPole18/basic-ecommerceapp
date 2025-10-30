import { type NextRequest, NextResponse } from "next/server"

// Mock cart storage - in production, this would be in a database or session
const carts: Record<string, any> = {}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cartId = searchParams.get("cartId") || "default"

    const cart = carts[cartId] || { items: [], total: 0 }

    return NextResponse.json({
      success: true,
      data: cart,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cartId = "default", productId, quantity, price, name } = body

    if (!carts[cartId]) {
      carts[cartId] = { items: [], total: 0 }
    }

    const existingItem = carts[cartId].items.find((item: any) => item.productId === productId)

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      carts[cartId].items.push({
        productId,
        name,
        price,
        quantity,
      })
    }

    carts[cartId].total = carts[cartId].items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

    return NextResponse.json({ success: true, data: carts[cartId] }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to add to cart" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { cartId = "default", productId, quantity } = body

    if (!carts[cartId]) {
      return NextResponse.json({ success: false, error: "Cart not found" }, { status: 404 })
    }

    const item = carts[cartId].items.find((item: any) => item.productId === productId)

    if (!item) {
      return NextResponse.json({ success: false, error: "Item not found in cart" }, { status: 404 })
    }

    if (quantity <= 0) {
      carts[cartId].items = carts[cartId].items.filter((item: any) => item.productId !== productId)
    } else {
      item.quantity = quantity
    }

    carts[cartId].total = carts[cartId].items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

    return NextResponse.json({
      success: true,
      data: carts[cartId],
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update cart" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cartId = searchParams.get("cartId") || "default"

    delete carts[cartId]

    return NextResponse.json({
      success: true,
      message: "Cart cleared successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to clear cart" }, { status: 500 })
  }
}
