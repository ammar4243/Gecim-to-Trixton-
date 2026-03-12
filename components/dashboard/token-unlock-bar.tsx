"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Lock, Unlock } from "lucide-react"

interface TokenUnlockBarProps {
  investmentTimestamp: number | null
  isLoading: boolean
}

export function TokenUnlockBar({ investmentTimestamp, isLoading }: TokenUnlockBarProps) {
  const [countdownData, setCountdownData] = useState<{
    months: number
    days: number
    hours: number
    minutes: number
    seconds: number
    percentage: number
    unlockDate: Date
    isUnlocked: boolean
  } | null>(null)

  useEffect(() => {
    console.log("[v0] TokenUnlockBar received investmentTimestamp:", investmentTimestamp)
    if (!investmentTimestamp || investmentTimestamp === 0) {
      console.log("[v0] TokenUnlockBar: No investment timestamp, hiding bar")
      setCountdownData(null)
      return
    }

    const calculateCountdown = () => {
      const investmentDate = new Date(investmentTimestamp * 1000) // Convert Unix timestamp to ms
      const unlockDate = new Date(investmentDate.getTime() + 6 * 30 * 24 * 60 * 60 * 1000) // Add 6 months (approximation: 6 * 30 days)
      const now = new Date()
      console.log("[v0] TokenUnlockBar calculateCountdown - investmentDate:", investmentDate, "unlockDate:", unlockDate, "now:", now)

      const isUnlocked = now >= unlockDate
      let remaining = unlockDate.getTime() - now.getTime()

      if (isUnlocked) {
        remaining = 0
      }

      // Calculate time units
      const totalSeconds = Math.floor(remaining / 1000)
      const seconds = totalSeconds % 60
      const totalMinutes = Math.floor(totalSeconds / 60)
      const minutes = totalMinutes % 60
      const totalHours = Math.floor(totalMinutes / 60)
      const hours = totalHours % 24
      const totalDays = Math.floor(totalHours / 24)
      
      // Calculate months and days more accurately
      let tempDate = new Date(investmentDate)
      let months = 0
      while (tempDate <= unlockDate && months < 6) {
        tempDate.setMonth(tempDate.getMonth() + 1)
        months++
      }
      
      const days = Math.floor((unlockDate.getTime() - investmentDate.getTime() - (months * 30 * 24 * 60 * 60 * 1000)) / (24 * 60 * 60 * 1000))

      // Calculate percentage of 6 months elapsed
      const totalMonths = 6
      const elapsedMonths = ((new Date().getTime() - investmentDate.getTime()) / (1000 * 60 * 60 * 24 * 30))
      const percentage = Math.min(100, Math.max(0, (elapsedMonths / totalMonths) * 100))

      setCountdownData({
        months: Math.max(0, months - 1),
        days: Math.max(0, days),
        hours: Math.max(0, hours),
        minutes: Math.max(0, minutes),
        seconds: Math.max(0, seconds),
        percentage,
        unlockDate,
        isUnlocked,
      })
    }

    calculateCountdown()
    const interval = setInterval(calculateCountdown, 1000)

    return () => clearInterval(interval)
  }, [investmentTimestamp])

  if (isLoading) {
    return (
      <div className="glass-card rounded-xl p-6 border border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading unlock data...</p>
        </div>
      </div>
    )
  }

  // Don't show the bar if user hasn't invested yet
  if (!countdownData) {
    return null
  }

  return (
    <div className="glass-card rounded-xl p-6 border border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {countdownData.isUnlocked ? (
              <>
                <Unlock className="text-green-500" size={24} fill="currentColor" />
                <div>
                  <p className="font-semibold text-green-400">Tokens Unlocked</p>
                  <p className="text-sm text-muted-foreground">Your 6-month lock period is complete</p>
                </div>
              </>
            ) : (
              <>
                <Lock className="text-primary" size={24} />
                <div>
                  <p className="font-semibold text-primary">Token Unlock In Progress</p>
                  <p className="text-sm text-muted-foreground">6-month lock period from investment date</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-3 bg-muted/30 rounded-full overflow-hidden border border-primary/20">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-300"
              style={{ width: `${countdownData.percentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground text-right">
            {countdownData.percentage.toFixed(1)}% Complete
          </p>
        </div>

        {/* Unlock Date */}
        <div className="bg-muted/20 rounded-lg p-3">
          <p className="text-xs text-muted-foreground mb-1">Unlock Date</p>
          <p className="font-mono text-sm font-semibold text-primary">
            {countdownData.unlockDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {countdownData.unlockDate.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            })}
          </p>
        </div>

        {/* Countdown Timer */}
        {!countdownData.isUnlocked && (
          <div className="grid grid-cols-4 gap-2">
            <div className="glass-card rounded-lg p-3 border border-primary/20 text-center">
              <p className="text-2xl font-bold text-primary">{countdownData.months}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {countdownData.months === 1 ? "Month" : "Months"}
              </p>
            </div>
            <div className="glass-card rounded-lg p-3 border border-primary/20 text-center">
              <p className="text-2xl font-bold text-primary">{countdownData.days}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {countdownData.days === 1 ? "Day" : "Days"}
              </p>
            </div>
            <div className="glass-card rounded-lg p-3 border border-primary/20 text-center">
              <p className="text-2xl font-bold text-primary">{countdownData.hours}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {countdownData.hours === 1 ? "Hour" : "Hours"}
              </p>
            </div>
            <div className="glass-card rounded-lg p-3 border border-primary/20 text-center">
              <p className="text-2xl font-bold text-primary">{countdownData.minutes}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {countdownData.minutes === 1 ? "Minute" : "Minutes"}
              </p>
            </div>
          </div>
        )}

        {/* Investment Start Date */}
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-primary/20 pt-3">
          <span>Investment Started:</span>
          <span className="font-mono text-primary">
            {new Date(investmentTimestamp * 1000).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>
    </div>
  )
}
