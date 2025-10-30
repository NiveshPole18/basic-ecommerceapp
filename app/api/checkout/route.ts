import { type NextRequest, NextResponse } from "next/server"

// Mock orders storage
let orders: any[] = []

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { cartItems, customerInfo, shippingAddress, paymentMethod } = body

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json({ success: false, error: "Cart is empty" }, { status: 400 })
    }

    const total = cartItems.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

    const order = {
      id: `ORD-${Date.now()}`,
      items: cartItems,
      customerInfo,
      shippingAddress,
      paymentMethod,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
    }

    orders.push(order)

    return NextResponse.json(
      {
        success: true,
        data: order,
        message: "Order created successfully",
      },
      { status: 201 },
    )
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create order" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")

    if (orderId) {
      const order = orders.find((o) => o.id === orderId)
      if (!order) {
        return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
      }
      return NextResponse.json({ success: true, data: order })
    }

    return NextResponse.json({
      success: true,
      data: orders,
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")

    if (!orderId) {
      return NextResponse.json({ success: false, error: "Order ID is required" }, { status: 400 })
    }

    const initialLength = orders.length
    orders = orders.filter((o) => o.id !== orderId)

    if (orders.length === initialLength) {
      return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully",
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete order" }, { status: 500 })
  }
}
