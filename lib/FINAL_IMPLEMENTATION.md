# Smart Contract Data Fetching - Final Implementation

## Functions Used (All Real Data from Smart Contract)

### Read Functions (Fetching User Data)
1. **`userInvested(address)`** - Returns user's total investment amount in USDT (with 6 decimals)
   - Displayed as "Total Investment" in Investment Overview
   - Example: 30000000 wei = 30 USDT

2. **`userBalance(address)`** - Returns user's available GCM token balance (with 18 decimals)
   - Displayed as "GCM Tokens" in Investment Overview
   - Example: 250000000000000000000 wei = 250 GCM

3. **`userLevel(address)`** - Returns user's current level (0-10, or 10+ for "GH")
   - Displayed as "Your Level" in Investment Overview
   - Shows Level number or "GH" (Golden Handshake) for Level 10+

4. **`getDirectReferrals(address)`** - Returns array of direct referral addresses
   - Used to calculate direct referral count
   - Displayed as "Total Referrals" in Investment Overview

5. **`referralTree(address)`** - Returns total referral count (all levels)
   - Returns a count value without decimals
   - Stored but not currently displayed (can be added as needed)

6. **`teamVolume(address)`** - Returns total team business volume (with 6 decimals)
   - Displayed as "Total Team Business" in Referral System
   - Example: 300000000 wei = 300 USDT

7. **`teamVolume(address)`** - Returns total business volume from team
   - Formatted with 6 decimals (like USDT)

8. **`gecimPriceInUSDT()`** - Returns GCM token price in USDT (with 6 decimals)
   - Shows as "@ $0.40/GCM" in Investment Overview

9. **`pendingReferralRewards(address)`** - Returns pending referral rewards (with 6 decimals)
   - Displayed as "Pending Referral Rewards" in Investment Overview

### Write Functions (User Actions)
1. **`invest(referrerAddress)`** - User invests 100 USDT
   - Requires USDT approval first
   - Automatically handled in token-purchase component

## No Dummy Data
- All values are fetched directly from the smart contract
- No calculations or estimates are used
- If a function fails, the value defaults to 0 (no dummy data shown)
- All decimal conversions use proper ethers.js formatting

## Display Locations
- **Investment Overview Component**: Shows Total Investment, GCM Balance, User Level, Total Referrals
- **Referral System Component**: Shows Direct Referrals, Pending Rewards, Total Team Business
- **Token Purchase Component**: Shows USDT balance and approval status for investment
