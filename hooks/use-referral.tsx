"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useSearchParams } from "next/navigation"

interface ReferralContextType {
  referralAddress: string | null
  setReferralAddress: (address: string) => void
  generateReferralLink: (address: string) => string
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined)

export function ReferralProvider({ children }: { children: ReactNode }) {
  const [referralAddress, setReferralAddressState] = useState<string | null>(null)
  const searchParams = useSearchParams()

  useEffect(() => {
    // Check for referral parameter in URL
    const refParam = searchParams.get("ref")
    if (refParam && refParam.startsWith("0x") && refParam.length === 42) {
      setReferralAddressState(refParam)
      // Store in localStorage for persistence
      localStorage.setItem("referralAddress", refParam)
      console.log("[v0] Referral address captured from URL:", refParam)
    } else {
      // Check localStorage for existing referral
      const stored = localStorage.getItem("referralAddress")
      if (stored) {
        setReferralAddressState(stored)
        console.log("[v0] Referral address loaded from storage:", stored)
      }
    }
  }, [searchParams])

  const setReferralAddress = (address: string) => {
    setReferralAddressState(address)
    localStorage.setItem("referralAddress", address)
    console.log("[v0] Referral address set:", address)
  }

  const generateReferralLink = (address: string) => {
    const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://trixton.io"
    return `${baseUrl}?ref=${address}`
  }

  return (
    <ReferralContext.Provider
      value={{
        referralAddress,
        setReferralAddress,
        generateReferralLink,
      }}
    >
      {children}
    </ReferralContext.Provider>
  )
}

export function useReferral() {
  const context = useContext(ReferralContext)
  if (context === undefined) {
    throw new Error("useReferral must be used within a ReferralProvider")
  }
  return context
}
