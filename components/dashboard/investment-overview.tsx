"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp, Coins, Users, Hexagon } from "lucide-react"
import { useContractData } from "@/hooks/use-contract-data"
import { useWallet } from "@/hooks/use-wallet"

export function InvestmentOverview() {
  const { userStats, presaleData, referralData, loading } = useContractData()
  const { isReady, isConnected, connect } = useWallet()

  if (!isConnected) {
    return (
      <Card className="glass-card border border-secondary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-secondary" size={24} />
            </div>
            Investment Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground mb-4">Connect your wallet to view investment data</p>
          <button
            onClick={connect}
            className="bg-primary/20 text-primary border border-primary/50 px-6 py-3 rounded-xl hover:bg-primary/30 transition-all neon-border"
          >
            Connect Wallet
          </button>
        </CardContent>
      </Card>
    )
  }

  if (loading || !isReady) {
    return (
      <Card className="glass-card border border-secondary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-secondary" size={24} />
            </div>
            Investment Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading investment data...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Get data from contract
  const totalInvestmentUSD = userStats?.totalInvestment || 0
  const gcmTokens = userStats?.gcmBalance || 0
  const userLevel = userStats?.userLevel || 0
  const totalReferrals = referralData?.referralCount || 0
  const pendingReferralRewards = userStats?.pendingReferralRewards || 0
  const globalPoolReward = userStats?.globalPoolReward || 0
  const tokenPrice = presaleData?.tokenPrice || 0.4

  return (
    <Card className="glass-card border border-secondary/30 hover:border-secondary/50 transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
            <TrendingUp className="text-secondary" size={24} />
          </div>
          Investment Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="glass-card rounded-xl p-4 border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign size={16} className="text-primary" />
              <span className="text-sm font-medium">Total Investment</span>
            </div>
            <p className="text-2xl font-bold text-primary neon-text">${totalInvestmentUSD}</p>
            <p className="text-sm text-muted-foreground">USDT invested</p>
          </div>

          <div className="glass-card rounded-xl p-4 border border-secondary/20">
            <div className="flex items-center gap-2 mb-2">
              <Coins size={16} className="text-secondary" />
              <span className="text-sm font-medium">GCM Tokens</span>
            </div>
            <p className="text-2xl font-bold text-secondary neon-text-pink">{gcmTokens.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">@ ${tokenPrice}/GCM</p>
          </div>

          <div className="glass-card rounded-xl p-4 border border-accent/20">
            <div className="flex items-center gap-2 mb-2">
              <Users size={16} className="text-accent" />
              <span className="text-sm font-medium">Total Referrals</span>
            </div>
            <p className="text-2xl font-bold text-accent">{totalReferrals}</p>

          </div>

          <div className="glass-card rounded-xl p-4 border border-green-500/20">
            <div className="flex items-center gap-2 mb-2">
              <Hexagon size={16} className="text-green-500" />
              <span className="text-sm font-medium">Your Level</span>
            </div>
            <p className="text-2xl font-bold text-green-500">
              {userLevel >= 10 ? "GH" : `Level ${userLevel}`}
            </p>
            <p className="text-sm text-muted-foreground">
              {userLevel >= 10 ? "Golden Handshake" : `${10 - userLevel} to GH`}
            </p>
          </div>
        </div>

        {/* Earnings Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card rounded-xl p-4 border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Pending Referral Rewards</span>
              <DollarSign size={16} className="text-primary" />
            </div>
            <p className="text-xl font-bold text-primary">${pendingReferralRewards.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">Claimable from referral earnings</p>
          </div>

          <div className="glass-card rounded-xl p-4 border border-secondary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Global Pool Reward</span>
              <DollarSign size={16} className="text-secondary" />
            </div>
            <p className="text-xl font-bold text-secondary">${globalPoolReward.toFixed(2)}</p>
            <p className="text-xs text-muted-foreground mt-1">From global pool distribution</p>
          </div>
        </div>

        {/* Investment Status */}
        {userStats?.hasInvested ? (
          <div className="glass-card rounded-xl p-4 border border-green-500/30 bg-green-500/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                <Hexagon className="text-green-500" size={20} fill="currentColor" fillOpacity={0.2} />
              </div>
              <div>
                <p className="font-medium text-green-400">Active Investor</p>
                <p className="text-sm text-muted-foreground">
                  You have invested ${totalInvestmentUSD} USDT and received {gcmTokens.toLocaleString()} GCM tokens
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-xl p-4 border border-yellow-500/30 bg-yellow-500/5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center">
                <Hexagon className="text-yellow-500" size={20} fill="currentColor" fillOpacity={0.2} />
              </div>
              <div>
                <p className="font-medium text-yellow-400">Not Yet Invested</p>
                <p className="text-sm text-muted-foreground">
                  Invest $100 USDT to receive GCM tokens and start earning referral rewards
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
