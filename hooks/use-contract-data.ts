"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from "./use-wallet"
import { ethers } from "ethers"

// Level achievement thresholds (direct referrals needed)
export const LEVEL_THRESHOLDS = [
  { level: 1, referrals: 1 },
  { level: 2, referrals: 2 },
  { level: 3, referrals: 3 },
  { level: 4, referrals: 4 },
  { level: 5, referrals: 5 },
  { level: 6, referrals: 6 },
  { level: 7, referrals: 7 },
  { level: 8, referrals: 8 },
  { level: 9, referrals: 9 },
  { level: 10, referrals: 10, name: "Handshake" },
]

// Level rewards in USDT (as per requirements)
// Level 4: $50, Level 5: $100, Level 6: $250, Level 7: $500, Level 8: $1000, Level 9: $2000, Golden Handshake: $3000
export const LEVEL_REWARDS = [
  { level: 4, reward: 50, label: "Level 4" },
  { level: 5, reward: 100, label: "Level 5" },
  { level: 6, reward: 250, label: "Level 6" },
  { level: 7, reward: 500, label: "Level 7" },
  { level: 8, reward: 1000, label: "Level 8" },
  { level: 9, reward: 2000, label: "Level 9" },
  { level: 10, reward: 3000, label: "Golden Handshake" },
]

interface UserStats {
  totalInvestment: number
  gcmBalance: number
  userLevel: number
  totalReferrals: number
  referralEarnings: number
  pendingReferralRewards: number
  globalPoolReward: number
  hasInvested: boolean
}

interface ReferralData {
  directReferrals: string[]
  totalReferrals: number
  pendingRewards: number
  referralCount: number
}

interface LevelRewardStatus {
  level: number
  reward: number
  achieved: boolean
  claimed: boolean
}

interface PresaleData {
  tokenPrice: number
  investmentAmount: number
  globalPool: number
}

export function useContractData() {
  const { contract, address, isConnected, isReady, signer } = useWallet()
  const [presaleData, setPresaleData] = useState<PresaleData | null>(null)
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [levelRewards, setLevelRewards] = useState<LevelRewardStatus[]>([])
  const [loading, setLoading] = useState(false)

  const fetchContractData = useCallback(async () => {
    if (!isConnected || !contract || !address) {
      setUserStats({
        totalInvestment: 0,
        gcmBalance: 0,
        userLevel: 0,
        totalReferrals: 0,
        referralEarnings: 0,
        pendingReferralRewards: 0,
        globalPoolReward: 0,
        hasInvested: false,
      })
      setReferralData({
        directReferrals: [],
        totalReferrals: 0,
        pendingRewards: 0,
        referralCount: 0,
      })
      setLevelRewards([])
      return
    }

    setLoading(true)
    console.log("[v0] fetchContractData called - contract:", !!contract, "address:", address)
    try {
      // Fetch token price (default 0.4 USDT = 1 GCM)
      let tokenPrice = 0.4
      try {
        const price = await contract.gcmPriceInUSDT()
        tokenPrice = Number(ethers.formatUnits(price, 6))
        console.log("[v0] Token price from contract:", tokenPrice)
      } catch (error) {
        console.log("[v0] Using default token price 0.4 USDT")
      }

      // Fetch investment amount (100 USDT)
      let investmentAmount = 100
      try {
        const amount = await contract.INVESTMENT_AMOUNT()
        investmentAmount = Number(ethers.formatUnits(amount, 6))
      } catch (error) {
        console.log("Using default investment amount")
      }

      // Fetch global pool
      let globalPool = 0
      try {
        const pool = await contract.globalPool()
        globalPool = Number(ethers.formatUnits(pool, 6))
      } catch (error) {
        console.log("Could not fetch global pool")
      }

      setPresaleData({
        tokenPrice,
        investmentAmount,
        globalPool,
      })

      // Fetch user investment status
      let hasInvested = false
      let totalInvestment = 0
      let gcmBalance = 0
      try {
        hasInvested = await contract.hasInvested(address)
        console.log("[v0] hasInvested:", hasInvested)
        
        // Fetch total invested regardless of hasInvested flag
        const invested = await contract.totalInvested(address)
        totalInvestment = Number(ethers.formatUnits(invested, 6))
        console.log("[v0] totalInvestment:", totalInvestment)
        
        const tokens = await contract.tokenRewards(address)
        gcmBalance = Number(ethers.formatEther(tokens))
        console.log("[v0] gcmBalance:", gcmBalance)
      } catch (error) {
        console.log("[v0] Error fetching investment status:", error)
      }

      // Fetch user level
      let userLevel = 0
      try {
        const level = await contract.getUserLevel(address)
        userLevel = Number(level)
        console.log("[v0] userLevel:", userLevel)
      } catch (error) {
        console.log("[v0] Error fetching user level:", error)
      }

      // Fetch referral data
      let directReferrals: string[] = []
      let referralCount = 0
      let pendingRewards = 0
      try {
        // Get referral count from contract directly
        const count = await contract.referralCount(address)
        referralCount = Number(count)
        console.log("[v0] referralCount from contract:", referralCount)
        
        // Get direct referrals array
        directReferrals = await contract.getDirectReferrals(address)
        console.log("[v0] directReferrals array length:", directReferrals.length)
        
        // Get pending rewards
        const pending = await contract.pendingReferralRewards(address)
        pendingRewards = Number(ethers.formatUnits(pending, 6))
        console.log("[v0] pendingReferralRewards:", pendingRewards)
      } catch (error) {
        console.log("[v0] Error fetching referral data:", error)
      }

      // Fetch global pool reward
      let globalPoolReward = 0
      try {
        const reward = await contract.getPendingGlobalPoolReward(address)
        globalPoolReward = Number(ethers.formatUnits(reward, 6))
      } catch (error) {
        console.log("Error fetching global pool reward:", error)
      }

      // Fetch level reward statuses
      const levelRewardStatuses: LevelRewardStatus[] = []
      for (const lr of LEVEL_REWARDS) {
        try {
          const status = await contract.getLevelRewardStatus(address, lr.level)
          levelRewardStatuses.push({
            level: lr.level,
            reward: lr.reward,
            achieved: status.achieved,
            claimed: status.claimed,
          })
        } catch (error) {
          levelRewardStatuses.push({
            level: lr.level,
            reward: lr.reward,
            achieved: userLevel >= lr.level,
            claimed: false,
          })
        }
      }
      setLevelRewards(levelRewardStatuses)

      const finalUserStats = {
        totalInvestment,
        gcmBalance,
        userLevel,
        totalReferrals: referralCount,
        referralEarnings: pendingRewards,
        pendingReferralRewards: pendingRewards,
        globalPoolReward,
        hasInvested,
      }
      console.log("[v0] Setting userStats:", finalUserStats)
      setUserStats(finalUserStats)

      const finalReferralData = {
        directReferrals,
        totalReferrals: referralCount,
        pendingRewards,
        referralCount,
      }
      console.log("[v0] Setting referralData:", finalReferralData)
      setReferralData(finalReferralData)

    } catch (error) {
      console.error("Error fetching contract data:", error)
    } finally {
      setLoading(false)
    }
  }, [isConnected, contract, address])

  useEffect(() => {
    fetchContractData()
  }, [fetchContractData])

  // Invest function
  const invest = async (referrerAddress: string) => {
    if (!contract || !address || !signer) {
      throw new Error("Wallet not connected")
    }

    const referrer = referrerAddress && ethers.isAddress(referrerAddress)
      ? referrerAddress
      : "0x0000000000000000000000000000000000000000"

    const tx = await contract.invest(referrer)
    await tx.wait()
    await fetchContractData()
    return tx
  }

  // Claim referral rewards
  const claimReferralRewards = async () => {
    if (!contract || !address) {
      throw new Error("Wallet not connected")
    }

    const tx = await contract.claimReferralRewards()
    await tx.wait()
    await fetchContractData()
    return tx
  }

  // Claim level reward
  const claimLevelReward = async (level: number) => {
    if (!contract || !address) {
      throw new Error("Wallet not connected")
    }

    const tx = await contract.claimLevelReward(level)
    await tx.wait()
    await fetchContractData()
    return tx
  }

  // Claim global pool reward
  const claimGlobalPoolReward = async () => {
    if (!contract || !address) {
      throw new Error("Wallet not connected")
    }

    const tx = await contract.claimFromGlobalPool()
    await tx.wait()
    await fetchContractData()
    return tx
  }

  return {
    presaleData,
    userStats,
    referralData,
    levelRewards,
    loading,
    refetch: fetchContractData,
    invest,
    claimReferralRewards,
    claimLevelReward,
    claimGlobalPoolReward,
    packages: [{ id: 1, price: 100, tokens: 1000, label: "Standard Package" }],
  }
}
