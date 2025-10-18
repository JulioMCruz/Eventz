/**
 * Check if a wallet address is an admin
 */
export function isAdminWallet(walletAddress: string | undefined): boolean {
  if (!walletAddress) return false

  const adminAddress = process.env.NEXT_PUBLIC_ADMIN_WALLET_ADDRESS
  if (!adminAddress) return false

  // Normalize addresses to lowercase for comparison
  return walletAddress.toLowerCase() === adminAddress.toLowerCase()
}

/**
 * Get the admin wallet address from env
 */
export function getAdminWalletAddress(): string | undefined {
  return process.env.NEXT_PUBLIC_ADMIN_WALLET_ADDRESS
}
