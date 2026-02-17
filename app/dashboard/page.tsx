"use client"

import { useWallet } from "@/hooks/use-wallet"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { TokenPurchase } from "@/components/dashboard/token-purchase"
import { InvestmentOverview } from "@/components/dashboard/investment-overview"
import { ReferralSystem } from "@/components/dashboard/referral-system"
import { RewardsPanel } from "@/components/dashboard/rewards-panel"
import { WithdrawalPanel } from "@/components/dashboard/withdrawal-panel"
import { ClaimsSummary } from "@/components/dashboard/claims-summary"
import { WalletConnect } from "@/components/wallet-connect"
import { Card, CardContent } from "@/components/ui/card"
import { Wallet, Hexagon } from "lucide-react"

export default function DashboardPage() {
  const { isConnected } = useWallet()

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>
        
        <Card className="w-full max-w-md mx-4 glass-card border border-primary/30 neon-border relative z-10">
          <CardContent className="p-8 text-center">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse-glow" />
              <div className="relative w-full h-full bg-primary/10 rounded-2xl flex items-center justify-center">
                <Wallet size={40} className="text-primary" />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Hexagon className="w-6 h-6 text-primary" fill="currentColor" fillOpacity={0.1} />
              <h1 className="text-2xl font-bold text-foreground">
                Connect to <span className="text-primary neon-text">GECIM</span>
              </h1>
            </div>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Please connect your wallet to access the Gecim dashboard and manage your investments.
            </p>
            <WalletConnect />
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      {/* Background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Purchase & Investment */}
            <div className="lg:col-span-2 space-y-6">
              <TokenPurchase />
              <InvestmentOverview />
            </div>

            {/* Right Column - Referrals & Rewards */}
            <div className="space-y-6">
              <ClaimsSummary />
              <WithdrawalPanel />
              <RewardsPanel />
              <ReferralSystem />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
