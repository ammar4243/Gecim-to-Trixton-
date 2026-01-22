"use client"

import { useWallet } from "@/hooks/use-wallet"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { WalletConnect } from "@/components/wallet-connect"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Hexagon, Trophy, Award, Star, Lock, CheckCircle, AlertCircle, Sparkles } from "lucide-react"
import { useContractData } from "@/hooks/use-contract-data"
import { useState } from "react"

// Level achievements with rewards (updated as per requirements)
const ACHIEVEMENTS = [
  { level: 4, reward: 50, label: "Level 4", description: "Reach Level 4" },
  { level: 5, reward: 100, label: "Level 5", description: "Reach Level 5" },
  { level: 6, reward: 250, label: "Level 6", description: "Reach Level 6" },
  { level: 7, reward: 500, label: "Level 7", description: "Reach Level 7" },
  { level: 8, reward: 1000, label: "Level 8", description: "Reach Level 8" },
  { level: 9, reward: 2000, label: "Level 9", description: "Reach Level 9" },
  { level: 10, reward: 3000, label: "Golden Handshake", description: "Reach Level 10", isGolden: true },
]

export default function AchievementPage() {
  const { isConnected } = useWallet()
  const { userStats, levelRewards, loading, claimLevelReward } = useContractData()
  const [claimingLevel, setClaimingLevel] = useState<number | null>(null)
  const [status, setStatus] = useState<{ type: "success" | "error" | "idle"; message: string }>({ type: "idle", message: "" })

  const handleClaimReward = async (level: number) => {
    if (!claimLevelReward) return

    setClaimingLevel(level)
    setStatus({ type: "idle", message: "" })

    try {
      await claimLevelReward(level)
      setStatus({ type: "success", message: `Level ${level} reward claimed successfully!` })
    } catch (error) {
      console.error("Failed to claim reward:", error)
      setStatus({ type: "error", message: error instanceof Error ? error.message : "Failed to claim reward" })
    } finally {
      setClaimingLevel(null)
    }
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center relative">
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
              Please connect your wallet to view your achievements.
            </p>
            <WalletConnect />
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentLevel = userStats?.userLevel || 0
  const totalPossibleRewards = ACHIEVEMENTS.reduce((sum, a) => sum + a.reward, 0)
  const claimedTotal = levelRewards.filter(lr => lr.claimed).reduce((sum, lr) => sum + lr.reward, 0)

  console.log("[v0] Achievement Page - userStats:", userStats)
  console.log("[v0] Achievement Page - levelRewards:", levelRewards)
  console.log("[v0] Achievement Page - currentLevel:", currentLevel)

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8 space-y-8">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">
              Level <span className="text-primary neon-text">Achievements</span>
            </h1>
            <p className="text-muted-foreground">Unlock rewards by reaching new levels</p>
          </div>

          {/* Current Level Card */}
          <Card className="glass-card border border-primary/30 neon-border max-w-xl mx-auto">
            <CardContent className="p-8 text-center">
              <div className="relative w-28 h-28 mx-auto mb-6">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse-glow" />
                <div className="relative w-full h-full bg-primary/10 rounded-full border-4 border-primary flex items-center justify-center">
                  <div className="text-center">
                    <Trophy className="w-10 h-10 text-primary mx-auto mb-1" />
                    <span className="text-2xl font-bold text-primary">
                      {currentLevel >= 10 ? "GH" : currentLevel}
                    </span>
                  </div>
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-2">
                {currentLevel >= 10 ? "Golden Handshake" : `Level ${currentLevel}`}
              </h2>
              <p className="text-muted-foreground">
                {currentLevel >= 10 
                  ? "Congratulations! You've reached the maximum level!"
                  : currentLevel >= 4
                    ? `${10 - currentLevel} more levels to reach Golden Handshake`
                    : `${4 - currentLevel} more levels to unlock your first reward`
                }
              </p>
            </CardContent>
          </Card>

          {/* Status Message */}
          {status.type !== "idle" && (
            <div
              className={`max-w-xl mx-auto flex items-start gap-2 p-4 rounded-lg ${
                status.type === "success"
                  ? "bg-green-500/10 text-green-400 border border-green-500/30"
                  : "bg-red-500/10 text-red-400 border border-red-500/30"
              }`}
            >
              {status.type === "success" ? (
                <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              )}
              <span>{status.message}</span>
            </div>
          )}

          {/* Achievement Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ACHIEVEMENTS.map((achievement) => {
              const levelReward = levelRewards.find(lr => lr.level === achievement.level)
              const isAchieved = currentLevel >= achievement.level || levelReward?.achieved
              const isClaimed = levelReward?.claimed
              const canClaim = isAchieved && !isClaimed

              return (
                <Card 
                  key={achievement.level}
                  className={`glass-card border transition-all ${
                    achievement.isGolden
                      ? isClaimed 
                        ? "border-yellow-500/50 bg-yellow-500/5" 
                        : isAchieved 
                          ? "border-yellow-500/50 neon-border bg-yellow-500/5" 
                          : "border-yellow-500/20 opacity-75"
                      : isClaimed 
                        ? "border-green-500/30" 
                        : isAchieved 
                          ? "border-secondary/50 neon-border-pink" 
                          : "border-muted/30 opacity-75"
                  }`}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                            achievement.isGolden
                              ? isClaimed 
                                ? "bg-yellow-500/30" 
                                : isAchieved 
                                  ? "bg-yellow-500/20" 
                                  : "bg-yellow-500/10"
                              : isClaimed 
                                ? "bg-green-500/20" 
                                : isAchieved 
                                  ? "bg-secondary/20" 
                                  : "bg-muted/20"
                          }`}
                        >
                          {isClaimed ? (
                            <CheckCircle className={achievement.isGolden ? "text-yellow-500" : "text-green-500"} size={28} />
                          ) : isAchieved ? (
                            achievement.isGolden ? (
                              <Sparkles className="text-yellow-500" size={28} />
                            ) : (
                              <Award className="text-secondary" size={28} />
                            )
                          ) : (
                            <Lock className="text-muted-foreground" size={28} />
                          )}
                        </div>
                        <div>
                          <div className={`text-lg font-bold ${achievement.isGolden ? "text-yellow-500" : ""}`}>
                            {achievement.label}
                          </div>
                          <div className="text-xs text-muted-foreground">{achievement.description}</div>
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Reward Amount */}
                    <div className={`text-center py-5 glass-card rounded-xl border ${
                      achievement.isGolden ? "border-yellow-500/20" : "border-muted/20"
                    }`}>
                      <div className="flex items-center justify-center gap-2 mb-1">
                        <Star className={`${
                          achievement.isGolden 
                            ? "text-yellow-500" 
                            : isClaimed 
                              ? "text-green-500" 
                              : isAchieved 
                                ? "text-secondary" 
                                : "text-muted-foreground"
                        }`} size={24} />
                        <span className={`text-4xl font-bold ${achievement.isGolden ? "text-yellow-500" : ""}`}>
                          ${achievement.reward}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">USDT Reward</div>
                    </div>

                    {/* Progress or Claim Button */}
                    {isClaimed ? (
                      <div className={`flex items-center justify-center gap-2 py-3 rounded-xl border ${
                        achievement.isGolden 
                          ? "bg-yellow-500/10 border-yellow-500/30" 
                          : "bg-green-500/10 border-green-500/30"
                      }`}>
                        <CheckCircle className={achievement.isGolden ? "text-yellow-500" : "text-green-500"} size={18} />
                        <span className={`font-medium ${achievement.isGolden ? "text-yellow-400" : "text-green-400"}`}>
                          Reward Claimed
                        </span>
                      </div>
                    ) : canClaim ? (
                      <Button
                        className={`w-full py-5 rounded-xl ${
                          achievement.isGolden
                            ? "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-500 border border-yellow-500/50"
                            : "bg-secondary/20 hover:bg-secondary/30 text-secondary border border-secondary/50"
                        }`}
                        onClick={() => handleClaimReward(achievement.level)}
                        disabled={claimingLevel !== null}
                      >
                        {claimingLevel === achievement.level ? (
                          <span className="flex items-center gap-2">
                            <div className={`w-4 h-4 border-2 border-t-transparent rounded-full animate-spin ${
                              achievement.isGolden ? "border-yellow-500" : "border-secondary"
                            }`} />
                            Claiming...
                          </span>
                        ) : (
                          `Claim $${achievement.reward} Reward`
                        )}
                      </Button>
                    ) : (
                      <div className="py-3">
                        <div className="text-sm text-muted-foreground text-center mb-2">
                          Progress to unlock
                        </div>
                        <div className="relative h-3 bg-muted/20 rounded-full overflow-hidden">
                          <div 
                            className={`absolute inset-y-0 left-0 rounded-full transition-all ${
                              achievement.isGolden 
                                ? "bg-gradient-to-r from-yellow-500 to-yellow-400" 
                                : "bg-gradient-to-r from-primary to-secondary"
                            }`}
                            style={{ 
                              width: `${Math.min(100, (currentLevel / achievement.level) * 100)}%` 
                            }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground text-center mt-2">
                          Level {currentLevel} / {achievement.level}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Total Rewards Summary */}
          <Card className="glass-card border border-accent/30 max-w-xl mx-auto">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">Total Possible Rewards</div>
                  <div className="text-3xl font-bold text-accent">${totalPossibleRewards.toLocaleString()} USDT</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Claimed So Far</div>
                  <div className="text-3xl font-bold text-green-400">
                    ${claimedTotal.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
