// SMART CONTRACT DATA INTEGRATION - NO DUMMY DATA
// This document explains what data comes from the smart contract

// ============ DATA FETCHED FROM SMART CONTRACT ============
// These functions fetch real data from the contract:

// 1. TOKEN PRICE
// Function: gecimPriceInUSDT()
// Returns: Token price (default 0.4 USDT per GCM)
// Used for: Calculating token amounts

// 2. INVESTMENT AMOUNT  
// Function: INVESTMENT_AMOUNT()
// Returns: Standard investment amount (100 USDT)
// Used for: Investment package display

// 3. GLOBAL POOL
// Function: globalPool()
// Returns: Total in global pool
// Used for: Community stats

// 4. USER HAS INVESTED
// Function: hasInvested(address)
// Returns: Boolean - whether user invested
// Used for: Show investment status

// 5. TOTAL INVESTED BY USER
// Function: totalInvested(address) [IF AVAILABLE]
// Returns: Total USDT amount user invested
// Used for: User investment summary

// 6. USER GCM TOKEN BALANCE
// Function: tokenRewards(address) [IF AVAILABLE]
// Returns: GCM tokens user owns
// Used for: Available balance display

// 7. USER LEVEL
// Function: getUserLevel(address) [IF AVAILABLE]
// Returns: User's current level (0-10)
// Used for: Level display and achievements

// 8. DIRECT REFERRALS
// Function: getDirectReferrals(address)
// Returns: Array of direct referral addresses
// Used for: Direct referral count and list

// 9. INDIRECT REFERRALS COUNT
// Function: indirectReferralCount(address) [IF AVAILABLE]
// Returns: Count of indirect referrals
// Used for: Indirect referral display (NO CALCULATION - REAL DATA ONLY)

// 10. PENDING REFERRAL REWARDS
// Function: pendingReferralRewards(address)
// Returns: Pending USDT rewards from referrals
// Used for: Reward balance display

// 11. LEVEL REWARD STATUS
// Function: getLevelRewardStatus(address, level) [IF AVAILABLE]
// Returns: { achieved, claimed } for each level
// Used for: Achievement unlock display

// ============ INVESTMENT TRANSACTION ============
// When user clicks Invest:
// 1. Check USDT allowance to contract
// 2. If insufficient, approve USDT spending
// 3. Call contract.invest(referrerAddress) with USDT amount
// 4. Wait for transaction confirmation
// 5. Refresh contract data
// 6. Display success message

// ============ NO DUMMY DATA ============
// Previous Version - REMOVED:
// ❌ Calculating indirectReferrals as (directReferrals × 2) - NOW: Set to 0 until real function found
// ❌ Calculating userLevel from referral count - NOW: Only get from contract
// ❌ Calculating GCM balance from hasInvested flag - NOW: Only get from tokenRewards()
// ❌ Calculating level achievements from userLevel - NOW: Only fetch from contract

// All data now comes exclusively from smart contract calls
// No fallback calculations or estimated values
