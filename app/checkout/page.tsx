"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"
import { ShoppingCart, Lock, Truck, ArrowRight } from "lucide-react"

interface CartItem {
  productId: string
  name: string
  price: number
  quantity: number
  image?: string
}

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  cardNumber: string
  cardExpiry: string
  cardCVC: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [cart, setCart] = useState<{ items: CartItem[]; total: number } | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    cardNumber: "",
    cardExpiry: "",
    cardCVC: "",
  })

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await apiClient.getCart()
        if (response.success) {
          setCart(response.data)
        } else {
          router.push("/cart")
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error)
        router.push("/cart")
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      return (
        formData.firstName.trim() !== "" &&
        formData.lastName.trim() !== "" &&
        formData.email.trim() !== "" &&
        formData.phone.trim() !== ""
      )
    } else if (step === 2) {
      return (
        formData.address.trim() !== "" &&
        formData.city.trim() !== "" &&
        formData.state.trim() !== "" &&
        formData.zipCode.trim() !== ""
      )
    } else if (step === 3) {
      return (
        formData.cardNumber.replace(/\s/g, "").length === 16 &&
        formData.cardExpiry.trim() !== "" &&
        formData.cardCVC.trim() !== ""
      )
    }
    return false
  }

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1)
    } else {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateStep(3)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all payment details",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)
    try {
      const response = await apiClient.checkout({
        cartItems: cart?.items || [],
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
        },
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        },
        paymentMethod: {
          cardNumber: formData.cardNumber.slice(-4),
          cardType: "Visa",
        } as any,
      })

      if (response.success) {
        try {
          // Persist last order for receipt fallback
          localStorage.setItem("lastOrder", JSON.stringify(response.data))
          // Append to orders history
          const existing = localStorage.getItem("ordersHistory")
          const arr = existing ? (JSON.parse(existing) as any[]) : []
          const dedup = arr.filter((o) => o?.id !== response.data.id)
          dedup.unshift(response.data)
          localStorage.setItem("ordersHistory", JSON.stringify(dedup.slice(0, 50)))
        } catch {}
        toast({
          title: "Order Placed Successfully",
          description: "Redirecting to orders...",
        })
        router.push("/orders")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to place order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

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

  if (!cart || cart.items.length === 0) {
    return (
      <main className="min-h-screen bg-background flex flex-col">
        <Header />
        <section className="flex-1 flex items-center justify-center py-20">
          <div className="text-center animate-fade-in">
            <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4 opacity-50" />
            <h2 className="text-2xl md:text-5xl font-bold text-foreground mb-2">Your cart is empty</h2>
            <p className="text-lg text-muted-foreground mb-6">Add items to your cart before checking out</p>
            <Link href="/products">
              <Button size="lg">Continue Shopping</Button>
            </Link>
          </div>
        </section>
        <Footer />
      </main>
    )
  }

  const total = cart.total * 1.1 // Including 10% tax

  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Secure Checkout</h1>
            <p className="text-lg text-muted-foreground">Complete your purchase safely and securely</p>
          </div>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="flex-1 py-12 md:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 animate-slide-in-left">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Step Indicator */}
                <div className="flex items-center justify-between mb-8">
                  {[1, 2, 3].map((step) => (
                    <div key={step} className="flex items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                          step <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {step}
                      </div>
                      {step < 3 && (
                        <div
                          className={`flex-1 h-1 mx-2 transition-all duration-300 ${
                            step < currentStep ? "bg-primary" : "bg-muted"
                          }`}
                        ></div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Step 1: Personal Information */}
                {currentStep === 1 && (
                  <div className="bg-card border border-border rounded-lg p-6 space-y-4 animate-fade-in">
                    <h2 className="text-2xl font-bold text-foreground mb-6">Personal Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="bg-background border-border"
                      />
                      <Input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="bg-background border-border"
                      />
                    </div>
                    <Input
                      type="email"
                      name="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-background border-border"
                    />
                    <Input
                      type="tel"
                      name="phone"
                      placeholder="Phone Number"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="bg-background border-border"
                    />
                    <Button type="button" onClick={handleNextStep} size="lg" className="w-full mt-6">
                      Continue to Shipping <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}

                {/* Step 2: Shipping Address */}
                {currentStep === 2 && (
                  <div className="bg-card border border-border rounded-lg p-6 space-y-4 animate-fade-in">
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                      <Truck className="w-6 h-6" /> Shipping Address
                    </h2>
                    <Input
                      type="text"
                      name="address"
                      placeholder="Street Address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="bg-background border-border"
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="bg-background border-border"
                      />
                      <Input
                        type="text"
                        name="state"
                        placeholder="State"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="bg-background border-border"
                      />
                    </div>
                    <Input
                      type="text"
                      name="zipCode"
                      placeholder="ZIP Code"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="bg-background border-border"
                    />
                    <div className="flex gap-4 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                        size="lg"
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button type="button" onClick={handleNextStep} size="lg" className="flex-1">
                        Continue to Payment <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment Information */}
                {currentStep === 3 && (
                  <div className="bg-card border border-border rounded-lg p-6 space-y-4 animate-fade-in">
                    <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                      <Lock className="w-6 h-6" /> Payment Information
                    </h2>
                    <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 flex items-center gap-2 mb-4">
                      <Lock className="w-5 h-5 text-primary" />
                      <p className="text-sm text-foreground">Your payment information is secure and encrypted</p>
                    </div>
                    <Input
                      type="text"
                      name="cardNumber"
                      placeholder="Card Number (16 digits)"
                      value={formData.cardNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\s/g, "").slice(0, 16)
                        setFormData((prev) => ({
                          ...prev,
                          cardNumber: value.replace(/(\d{4})/g, "$1 ").trim(),
                        }))
                      }}
                      className="bg-background border-border font-mono"
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        type="text"
                        name="cardExpiry"
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "")
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + "/" + value.slice(2, 4)
                          }
                          setFormData((prev) => ({
                            ...prev,
                            cardExpiry: value,
                          }))
                        }}
                        className="bg-background border-border font-mono"
                      />
                      <Input
                        type="text"
                        name="cardCVC"
                        placeholder="CVC"
                        value={formData.cardCVC}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "").slice(0, 3)
                          setFormData((prev) => ({
                            ...prev,
                            cardCVC: value,
                          }))
                        }}
                        className="bg-background border-border font-mono"
                      />
                    </div>
                    <div className="flex gap-4 mt-6">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCurrentStep(2)}
                        size="lg"
                        className="flex-1"
                      >
                        Back
                      </Button>
                      <Button type="submit" disabled={submitting} size="lg" className="flex-1">
                        {submitting ? "Processing..." : "Place Order"}
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1 animate-slide-in-right">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-20 space-y-6">
                <h2 className="text-xl font-bold text-foreground">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {cart.items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="font-medium text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex justify-between text-foreground">
                    <span>Subtotal</span>
                    <span>${cart.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-foreground">
                    <span>Tax (10%)</span>
                    <span>${(cart.total * 0.1).toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>

                <div className="bg-primary/10 border border-primary/20 rounded-lg p-3 text-sm text-foreground">
                  <p className="font-medium mb-1">Money-back guarantee</p>
                  <p className="text-xs text-muted-foreground">
                    If you're not satisfied, we'll refund your money within 30 days.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
