import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Zap } from "lucide-react"

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary/10 to-accent/5 py-20 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 animate-bounce-in">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Premium Tech Accessories</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground text-balance animate-slide-in-up">
            Elevate Your Tech Game
          </h1>

          <p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance animate-slide-in-up"
            style={{ animationDelay: "100ms" }}
          >
            Discover our curated collection of high-quality electronics and accessories designed for modern
            professionals.
          </p>

          <div
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4 animate-slide-in-up"
            style={{ animationDelay: "200ms" }}
          >
            <Link href="/products">
              <Button size="lg" className="w-full sm:w-auto group">
                Shop Now
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
