"use client"

import { useState, useEffect, useCallback } from "react"
import { useWallet } from "./use-wallet"
import { ethers } from "ethers"
import { CONTRACT_ADDRESS } from "@/lib/web3"

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
  totalClaimedIncome: number
  directReferralAddress: string
}

interface ReferralData {
  directReferrals: string[]
  totalReferrals: number
  pendingRewards: number
  referralCount: number
  indirectReferrals: number
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
  const [indirectReferralCount, setIndirectReferralCount] = useState<number>(0); // Declare indirectReferralCount

  const fetchContractData = useCallback(async () => {
    if (!isConnected || !contract || !address) {
      console.log("[v0] fetchContractData - not connected or missing contract")
      setUserStats({
        totalInvestment: 0,
        gcmBalance: 0,
        userLevel: 0,
        totalReferrals: 0,
        referralEarnings: 0,
        pendingReferralRewards: 0,
        globalPoolReward: 0,
        hasInvested: false,
        totalClaimedIncome: 0,
        directReferralAddress: "0x0000000000000000000000000000000000000000",
      })
      setReferralData({
        directReferrals: [],
        totalReferrals: 0,
        pendingRewards: 0,
        referralCount: 0,
        indirectReferrals: 0,
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
        const price = await contract.gecimPriceInUSDT()
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
        console.log("[v0] Investment amount:", investmentAmount)
      } catch (error) {
        console.log("[v0] Using default investment amount 100")
      }

      // Fetch global pool
      let globalPool = 0
      try {
        const pool = await contract.globalPool()
        globalPool = Number(ethers.formatUnits(pool, 6))
        console.log("[v0] Global pool:", globalPool)
      } catch (error) {
        console.log("[v0] Could not fetch global pool")
      }

      setPresaleData({
        tokenPrice,
        investmentAmount,
        globalPool,
      })

      // Fetch Total Claimed Income
      let totalClaimedIncome = 0
      try {
        const claimed = await contract.claimedIncome(address)
        totalClaimedIncome = Number(ethers.formatUnits(claimed, 6))
        console.log("[v0] Total Claimed Income:", totalClaimedIncome)
      } catch (e) {
        console.log("[v0] claimedIncome function not available:", e)
        totalClaimedIncome = 0
      }

      // Fetch Direct Referrer Address (Parent/Sponsor)
      let directReferralAddress = "0x0000000000000000000000000000000000000000"
      try {
        const referrer = await contract.referrer(address)
        directReferralAddress = referrer || "0x0000000000000000000000000000000000000000"
        console.log("[v0] Direct Referral Address (Referrer):", directReferralAddress)
      } catch (e) {
        console.log("[v0] referrer function not available, trying getReferrer:", e)
        try {
          const referrer = await contract.getReferrer(address)
          directReferralAddress = referrer || "0x0000000000000000000000000000000000000000"
          console.log("[v0] Direct Referral Address (getReferrer):", directReferralAddress)
        } catch (e2) {
          console.log("[v0] getReferrer function not available:", e2)
          directReferralAddress = "0x0000000000000000000000000000000000000000"
        }
      }

      // Fetch user investment status - using correct function names
      let hasInvested = false
      let totalInvestment = 0
      let gcmBalance = 0
      try {
        hasInvested = await contract.hasInvested(address)
        console.log("[v0] hasInvested:", hasInvested)
        
        // If user has invested, show investment amount and calculated GCM tokens
        if (hasInvested) {
          totalInvestment = investmentAmount // 100 USDT
          gcmBalance = investmentAmount / tokenPrice // 100 / 0.4 = 250 GCM
          console.log("[v0] User has invested - Investment:", totalInvestment, "GCM:", gcmBalance)
        }
      } catch (e) {
        console.log("[v0] hasInvested function not available:", e)
      }
      
      // Get user's total investment using userInvested function (if available)
      try {
        const invested = await contract.userInvested(address)
        totalInvestment = Number(ethers.formatUnits(invested, 6))
        console.log("[v0] userInvested (Total Investment):", totalInvestment)
      } catch (e) {
        console.log("[v0] userInvested function not available - using hasInvested flag")
      }

      // Get user's GCM token balance using userBalance function (if available)
      try {
        const balance = await contract.userBalance(address)
        gcmBalance = Number(ethers.formatEther(balance))
        console.log("[v0] userBalance (Available GCM Token):", gcmBalance)
      } catch (e) {
        console.log("[v0] userBalance function not available - using calculated balance")
      }

      // Fetch user level - using userLevel function
      let userLevel = 0
      try {
        const level = await contract.userLevel(address)
        userLevel = Number(level)
        console.log("[v0] userLevel from contract:", userLevel)
      } catch (e) {
        console.log("[v0] userLevel function not available:", e)
        userLevel = 0
      }

      // Fetch referral data
      let directReferrals: string[] = []
      let referralCount = 0
      let totalTeamBusiness = 0 // Using teamVolume function
      let pendingRewards = 0
      
      try {
        directReferrals = await contract.getDirectReferrals(address)
        referralCount = directReferrals.length
        console.log("[v0] directReferrals array length:", directReferrals.length)
        console.log("[v0] directReferrals addresses:", directReferrals)
      } catch (e) {
        console.log("[v0] getDirectReferrals function not available:", e)
      }
      
      // Try to fetch Total Referral Count using referralTree function
      let referralTreeCount = 0
      try {
        const treeCount = await contract.referralTree(address)
        // referralTree returns a count, format with appropriate decimals
        if (treeCount) {
          referralTreeCount = typeof treeCount === 'bigint' ? Number(treeCount) : Number(ethers.formatUnits(treeCount, 0))
          console.log("[v0] referralTree (Total Referral Count):", referralTreeCount)
        }
      } catch (e) {
        console.log("[v0] referralTree function not available:", e)
      }
      
      // Try to fetch Total Team Business using teamVolume function
      try {
        const teamVol = await contract.teamVolume(address)
        // Format with 6 decimals like USDT
        totalTeamBusiness = Number(ethers.formatUnits(teamVol, 6))
        console.log("[v0] teamVolume (Total Team Business):", totalTeamBusiness)
      } catch (e) {
        console.log("[v0] teamVolume function not available:", e)
        totalTeamBusiness = 0
      }
      
      try {
        const pending = await contract.pendingReferralRewards(address)
        pendingRewards = Number(ethers.formatUnits(pending, 6))
        console.log("[v0] pendingReferralRewards:", pendingRewards)
      } catch (e) {
        console.log("[v0] pendingReferralRewards function not available:", e)
      }

      // Fetch level reward statuses - NO DUMMY CALCULATIONS
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
          console.log(`[v0] Could not fetch level ${lr.level} reward status:`, error)
          // Do NOT add dummy status - skip if function doesn't exist
        }
      }
      setLevelRewards(levelRewardStatuses)

      // Calculate Total Referrals based on Total Team Business
      // Formula: (totalTeamBusiness - 100) / 100
      // This works for any value from 100 to 10,000,000+
      let calculatedTotalReferrals = 0
      if (totalTeamBusiness >= 100) {
        calculatedTotalReferrals = Math.floor((totalTeamBusiness - 100) / 100)
      }
      console.log("[v0] Total Referral Calculation: Team Business:", totalTeamBusiness, "→ Referrals:", calculatedTotalReferrals, "Formula: (", totalTeamBusiness, "- 100) / 100")

      const finalUserStats = {
        totalInvestment,
        gcmBalance,
        userLevel,
        totalReferrals: calculatedTotalReferrals,
        referralEarnings: pendingRewards,
        pendingReferralRewards: pendingRewards,
        globalPoolReward: 0,
        hasInvested: hasInvested,
        totalClaimedIncome,
        directReferralAddress,
      }
      console.log("[v0] Setting userStats:", finalUserStats)
      setUserStats(finalUserStats)

      const finalReferralData = {
        directReferrals,
        totalReferrals: calculatedTotalReferrals,
        pendingRewards,
        referralCount,
        indirectReferrals: totalTeamBusiness,
      }
      console.log("[v0] Setting referralData:", finalReferralData)
      setReferralData(finalReferralData)
    } catch (error) {
      console.error("[v0] Error fetching contract data:", error)
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

    console.log("[v0] Invest called with referrer:", referrerAddress)

    try {
      // First, check and handle USDT approval
      const { getUsdtContract } = await import("@/lib/web3")
      const usdtContract = getUsdtContract(signer)
      const investmentAmount = presaleData?.investmentAmount || 100
      const usdtAmount = ethers.parseUnits(investmentAmount.toString(), 6)

      console.log("[v0] Investment amount (USDT):", investmentAmount)
      console.log("[v0] Investment amount (wei):", usdtAmount.toString())

      // Check current allowance
      const currentAllowance = await usdtContract.allowance(address, CONTRACT_ADDRESS)
      console.log("[v0] Current USDT allowance:", ethers.formatUnits(currentAllowance, 6))

      // If allowance is insufficient, approve
      if (currentAllowance < usdtAmount) {
        console.log("[v0] Approving USDT for contract...")
        const approveTx = await usdtContract.approve(CONTRACT_ADDRESS, usdtAmount)
        await approveTx.wait()
        console.log("[v0] USDT approval confirmed")
      }

      // Now call the invest function
      const referrer = referrerAddress && ethers.isAddress(referrerAddress)
        ? referrerAddress
        : ethers.ZeroAddress

      console.log("[v0] Calling contract.invest with referrer:", referrer)
      const tx = await contract.invest(referrer)
      console.log("[v0] Investment transaction sent:", tx.hash)
      await tx.wait()
      console.log("[v0] Investment transaction confirmed")

      await fetchContractData()
      return tx
    } catch (error) {
      console.error("[v0] Investment error:", error)
      throw error
    }
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
