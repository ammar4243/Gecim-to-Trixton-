"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, User, Wallet, TrendingUp, Hexagon, Users, Trophy, LayoutDashboard } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useWallet } from "@/hooks/use-wallet"
import { useContractData } from "@/hooks/use-contract-data"

export function DashboardHeader() {
  const { address } = useWallet()
  const { userStats, loading } = useContractData()
  const pathname = usePathname()

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard/family", label: "Family", icon: Users },
    { href: "/dashboard/achievement", label: "Achievement", icon: Trophy },
  ]

  return (
    <header className="glass border-b border-primary/20">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="outline" size="sm" className="border-primary/50 text-primary hover:bg-primary/10 bg-transparent">
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Hexagon className="w-10 h-10 text-primary" fill="currentColor" fillOpacity={0.1} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">G</span>
                </div>
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-foreground">
                  <span className="text-primary neon-text">GECIM</span> Dashboard
                </h1>
                <p className="text-muted-foreground text-sm">Manage your GCM tokens and investments</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 glass-card px-4 py-2 rounded-xl border border-primary/30">
            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
              <User size={16} className="text-primary" />
            </div>
            <span className="text-sm font-mono text-foreground hidden sm:block">
              {address ? formatAddress(address) : "Not Connected"}
            </span>
          </div>
        </div>

        {/* Dashboard Navigation */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "default" : "outline"}
                  size="sm"
                  className={`flex items-center gap-2 ${
                    isActive
                      ? "bg-primary/20 text-primary border border-primary/50 hover:bg-primary/30"
                      : "border-muted/30 text-muted-foreground hover:bg-muted/10 hover:text-foreground bg-transparent"
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{item.label}</span>
                </Button>
              </Link>
            )
          })}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="glass-card border border-primary/30 hover:border-primary/50 transition-all">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
                <Wallet size={24} className="text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Investment</p>
                <p className="text-2xl font-bold text-primary neon-text">
                  {loading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    `$${userStats?.totalInvestment?.toFixed(2) || "0.00"}`
                  )}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card border border-secondary/30 hover:border-secondary/50 transition-all">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-12 h-12 bg-secondary/20 rounded-xl flex items-center justify-center">
                <TrendingUp size={24} className="text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">GCM Balance</p>
                <p className="text-2xl font-bold text-secondary neon-text-pink">
                  {loading ? (
                    <span className="animate-pulse">Loading...</span>
                  ) : (
                    userStats?.gcmBalance?.toLocaleString() || "0"
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </header>
  )
}
