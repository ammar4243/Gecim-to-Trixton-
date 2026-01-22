"use client"

import Link from "next/link"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Hexagon } from "lucide-react"
import { WalletConnect } from "@/components/wallet-connect"
import { useWallet } from "@/hooks/use-wallet"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { isConnected } = useWallet()

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsOpen(false)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-primary/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Hexagon className="w-8 h-8 text-primary neon-text" fill="currentColor" fillOpacity={0.1} />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">G</span>
              </div>
            </div>
            <span className="text-2xl font-bold text-primary neon-text tracking-wider">GECIM</span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline gap-1">
              <button
                onClick={() => scrollToSection("home")}
                className="text-foreground/80 hover:text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-primary/10"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-foreground/80 hover:text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-primary/10"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("roadmap")}
                className="text-foreground/80 hover:text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-primary/10"
              >
                Roadmap
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-foreground/80 hover:text-primary px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-primary/10"
              >
                Contact
              </button>
            </div>
          </div>

          {/* Wallet Connect Button */}
          <div className="hidden md:flex items-center gap-3">
            <WalletConnect />
            {isConnected && (
              <Link href="/dashboard">
                <Button className="bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50 neon-border">
                  Dashboard
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-primary hover:text-primary/80 p-2">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 glass-card rounded-xl mt-2 border border-primary/20">
              <button
                onClick={() => scrollToSection("home")}
                className="text-foreground/80 hover:text-primary hover:bg-primary/10 block px-4 py-3 rounded-lg text-base font-medium w-full text-left transition-all"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("about")}
                className="text-foreground/80 hover:text-primary hover:bg-primary/10 block px-4 py-3 rounded-lg text-base font-medium w-full text-left transition-all"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection("roadmap")}
                className="text-foreground/80 hover:text-primary hover:bg-primary/10 block px-4 py-3 rounded-lg text-base font-medium w-full text-left transition-all"
              >
                Roadmap
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="text-foreground/80 hover:text-primary hover:bg-primary/10 block px-4 py-3 rounded-lg text-base font-medium w-full text-left transition-all"
              >
                Contact
              </button>
              <div className="px-3 py-2">
                <WalletConnect />
              </div>
              {isConnected && (
                <Link href="/dashboard">
                  <Button className="w-full mt-2 bg-primary/20 hover:bg-primary/30 text-primary border border-primary/50">
                    Dashboard
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
