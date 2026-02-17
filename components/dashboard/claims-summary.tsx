"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, Award, User } from "lucide-react"
import { useContractData } from "@/hooks/use-contract-data"
import { useWallet } from "@/hooks/use-wallet"

export function ClaimsSummary() {
  const { userStats, loading } = useContractData()
  const { isConnected } = useWallet()

  if (!isConnected) {
    return null
  }

  if (loading || !userStats) {
    return (
      <Card className="glass-card border border-primary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
              <DollarSign className="text-primary" size={24} />
            </div>
            Claims & Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatAddress = (addr: string) => {
    if (!addr || addr === "0x0000000000000000000000000000000000000000") {
      return "No Referrer"
    }
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const totalClaimedIncome = userStats?.totalClaimedIncome || 0
  const userLevel = userStats?.userLevel || 0
  const directReferralAddress = userStats?.directReferralAddress || "0x0000000000000000000000000000000000000000"

  return (
    <Card className="glass-card border border-primary/30 hover:border-primary/50 transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
            <DollarSign className="text-primary" size={24} />
          </div>
          Claims & Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Total Claimed Income */}
        <div className="glass-card rounded-xl p-4 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-primary" />
              <span className="text-sm font-medium">Total Claimed Income</span>
            </div>
            <span className="text-xs text-muted-foreground">USDT</span>
          </div>
          <p className="text-2xl font-bold text-primary neon-text">
            ${totalClaimedIncome.toFixed(2)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Cumulative claimed rewards</p>
        </div>

        {/* Current Level */}
        <div className="glass-card rounded-xl p-4 border border-secondary/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-secondary" />
              <span className="text-sm font-medium">Current Level</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold text-secondary neon-text-pink">
              {userLevel >= 10 ? "GH" : `Level ${userLevel}`}
            </p>
            <p className="text-sm text-muted-foreground">
              {userLevel >= 10 ? "(Golden Handshake)" : `(${userLevel} / 10)`}
            </p>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {userLevel >= 10 ? "Highest achievement unlocked" : `Progress towards Golden Handshake`}
          </p>
        </div>

        {/* Direct Referral Wallet Address */}
        <div className="glass-card rounded-xl p-4 border border-accent/20">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <User size={18} className="text-accent" />
              <span className="text-sm font-medium">Direct Referrer</span>
            </div>
          </div>
          <p className="text-lg font-mono text-accent break-all">
            {formatAddress(directReferralAddress)}
          </p>
          {directReferralAddress !== "0x0000000000000000000000000000000000000000" ? (
            <div className="text-xs text-muted-foreground mt-2 flex items-start gap-1">
              <span className="text-green-500 mt-0.5">✓</span>
              <span>Your sponsor's wallet address</span>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground mt-2 flex items-start gap-1">
              <span className="text-yellow-500 mt-0.5">◐</span>
              <span>No sponsor/referrer linked yet</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
