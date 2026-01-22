"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, Zap, Shield } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useWallet } from "@/hooks/use-wallet"

export function Hero() {
  const { isConnected, address } = useWallet()

  const handleJoinPresale = () => {
    if (isConnected) {
      window.location.href = "/dashboard"
    } else {
      const element = document.getElementById("presale")
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  return (
    <section id="home" className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center">
          {/* Logo/Character */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="relative w-48 h-48 md:w-64 md:h-64 animate-float">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse-glow" />
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fun-teenager-animation_183364-45262-removebg-preview-dHi4c2pfOi3rARqUmkoiL37hz5SX5G.png"
                  alt="Animated character holding Bitcoin"
                  width={256}
                  height={256}
                  className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
                  priority
                />
              </div>
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-secondary/30 rounded-full animate-ping" />
              <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-primary/40 rounded-full animate-bounce delay-500" />
            </div>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-primary/30 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Next-Gen DeFi Protocol</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 text-balance leading-tight">
            Welcome to the Future of{" "}
            <span className="text-primary neon-text bg-clip-text">GECIM</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-3xl mx-auto text-pretty leading-relaxed">
            Join the revolutionary blockchain ecosystem with Gecim. Secure your position in the next generation
            of decentralized finance with our innovative token presale.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/80 text-primary-foreground text-lg px-8 py-6 rounded-xl neon-border animate-pulse-glow group"
              onClick={handleJoinPresale}
            >
              {isConnected ? "Go to Dashboard" : "Join Presale Now"}
              <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="text-lg px-8 py-6 rounded-xl border-secondary/50 text-secondary hover:bg-secondary/10 bg-transparent"
              onClick={() => document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })}
            >
              Learn More
            </Button>
          </div>

          {isConnected && (
            <div className="mt-4">
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="text-lg px-8 py-6 rounded-xl border-primary/50 text-primary hover:bg-primary/10 bg-transparent">
                  Open Dashboard
                </Button>
              </Link>
            </div>
          )}

          {/* Stats Grid */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="glass-card rounded-2xl p-6 border border-primary/20 hover:border-primary/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-primary neon-text mb-2">210M</div>
              <div className="text-muted-foreground font-medium">Total Supply</div>
            </div>
            <div className="glass-card rounded-2xl p-6 border border-secondary/20 hover:border-secondary/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-secondary" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-secondary neon-text-pink mb-2">$0.01</div>
              <div className="text-muted-foreground font-medium">Presale Price</div>
            </div>
            <div className="glass-card rounded-2xl p-6 border border-accent/20 hover:border-accent/40 transition-all group">
              <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6 text-accent" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-accent mb-2">84M</div>
              <div className="text-muted-foreground font-medium">Presale Supply</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
