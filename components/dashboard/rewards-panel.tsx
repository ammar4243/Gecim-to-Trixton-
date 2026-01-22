"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Award, Globe, CheckCircle, AlertCircle, Trophy } from "lucide-react"
import { useContractData, LEVEL_REWARDS } from "@/hooks/use-contract-data"
import { useWallet } from "@/hooks/use-wallet"

export function RewardsPanel() {
  const [isClaimingLevel, setIsClaimingLevel] = useState<number | null>(null)
  const [isClaimingGlobal, setIsClaimingGlobal] = useState(false)
  const [status, setStatus] = useState<{ type: "success" | "error" | "idle"; message: string }>({ type: "idle", message: "" })
  
  const { userStats, levelRewards, loading, claimLevelReward, claimGlobalPoolReward } = useContractData()
  const { address } = useWallet()

  const handleClaimLevelReward = async (level: number) => {
    if (!address || !claimLevelReward) return

    setIsClaimingLevel(level)
    setStatus({ type: "idle", message: "" })

    try {
      await claimLevelReward(level)
      setStatus({ type: "success", message: `Level ${level} reward claimed successfully!` })
    } catch (error) {
      console.error("Failed to claim level reward:", error)
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Failed to claim reward" })
    } finally {
      setIsClaimingLevel(null)
    }
  }

  const handleClaimGlobalPool = async () => {
    if (!address || !claimGlobalPoolReward) return

    setIsClaimingGlobal(true)
    setStatus({ type: "idle", message: "" })

    try {
      await claimGlobalPoolReward()
      setStatus({ type: "success", message: "Global pool reward claimed successfully!" })
    } catch (error) {
      console.error("Failed to claim global pool reward:", error)
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Failed to claim reward" })
    } finally {
      setIsClaimingGlobal(false)
    }
  }

  if (loading) {
    return (
      <Card className="glass-card border border-accent/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
              <Award className="text-accent" size={24} />
            </div>
            Rewards
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
            <p className="text-muted-foreground">Loading rewards...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const currentLevel = userStats?.userLevel || 0
  const globalPoolReward = userStats?.globalPoolReward || 0

  // Find next claimable level reward
  const nextClaimableLevelReward = levelRewards.find(lr => lr.achieved && !lr.claimed)

  return (
    <Card className="glass-card border border-accent/30 hover:border-accent/50 transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
            <Award className="text-accent" size={24} />
          </div>
          Rewards
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Level */}
        <div className="glass-card rounded-xl p-4 border border-primary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Your Level</span>
            <Trophy className="text-primary" size={20} />
          </div>
          <div className="text-3xl font-bold text-primary">
            {currentLevel >= 10 ? "Handshake" : `Level ${currentLevel}`}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {currentLevel < 10 
              ? `${10 - currentLevel} more referrals to reach Handshake level`
              : "Maximum level achieved!"
            }
          </p>
        </div>

        {/* Level Reward Claim */}
        {nextClaimableLevelReward && (
          <div className="glass-card rounded-xl p-4 border border-secondary/20">
            <div className="flex items-center justify-between mb-3">
              <div>
                <div className="text-sm text-muted-foreground">Level Reward Available</div>
                <div className="text-xl font-bold text-secondary">
                  ${nextClaimableLevelReward.reward} USDT
                </div>
                <div className="text-xs text-muted-foreground">
                  Level {nextClaimableLevelReward.level} Achievement
                </div>
              </div>
              <Award className="text-secondary" size={32} />
            </div>
            <Button
              className="w-full bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/50 py-5 rounded-xl"
              onClick={() => handleClaimLevelReward(nextClaimableLevelReward.level)}
              disabled={isClaimingLevel !== null}
            >
              {isClaimingLevel === nextClaimableLevelReward.level ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                  Claiming...
                </span>
              ) : (
                `Claim $${nextClaimableLevelReward.reward} Reward`
              )}
            </Button>
          </div>
        )}

        {/* Global Pool Reward */}
        <div className="glass-card rounded-xl p-4 border border-accent/20">
          <div className="flex items-center justify-between mb-3">
            <div>
              <div className="text-sm text-muted-foreground">Global Pool Reward</div>
              <div className="text-xl font-bold text-accent">
                ${globalPoolReward.toFixed(2)} USDT
              </div>
            </div>
            <Globe className="text-accent" size={32} />
          </div>
          <Button
            className="w-full bg-accent/20 hover:bg-accent/30 text-accent border border-accent/50 py-5 rounded-xl"
            onClick={handleClaimGlobalPool}
            disabled={globalPoolReward <= 0 || isClaimingGlobal}
          >
            {isClaimingGlobal ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                Claiming...
              </span>
            ) : globalPoolReward <= 0 ? (
              "No Global Pool Reward"
            ) : (
              `Claim $${globalPoolReward.toFixed(2)} from Global Pool`
            )}
          </Button>
        </div>

        {/* Status Message */}
        {status.type !== "idle" && (
          <div
            className={`flex items-start gap-2 p-3 rounded-lg ${
              status.type === "success"
                ? "bg-green-500/10 text-green-400 border border-green-500/30"
                : "bg-red-500/10 text-red-400 border border-red-500/30"
            }`}
          >
            {status.type === "success" ? (
              <CheckCircle size={16} className="mt-0.5 flex-shrink-0" />
            ) : (
              <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
            )}
            <span className="text-sm">{status.message}</span>
          </div>
        )}

        {/* Info */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>* Level rewards unlock based on referral count</p>
          <p>* Global pool rewards are shared among eligible members</p>
        </div>
      </CardContent>
    </Card>
  )
}
