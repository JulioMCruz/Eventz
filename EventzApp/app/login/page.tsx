"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, ArrowRight, AlertCircle, LogOut } from "lucide-react"
import { useWalletAuth } from "@/lib/web3-auth"

export default function LoginPage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { authenticateWallet, isAuthenticated, logout } = useWalletAuth()
  const [error, setError] = useState<string | null>(null)
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  useEffect(() => {
    const authenticate = async () => {
      if (isConnected && address && !isAuthenticating) {
        setIsAuthenticating(true)
        setError(null)

        try {
          const user = await authenticateWallet()
          if (user && isAuthenticated()) {
            router.push("/events")
          } else {
            setError("Authentication failed. Please try disconnecting and reconnecting your wallet.")
            setIsAuthenticating(false)
          }
        } catch (err) {
          console.error("Authentication error:", err)
          setError("Failed to authenticate. Please try again.")
          setIsAuthenticating(false)
        }
      }
    }

    authenticate()
  }, [isConnected, address, router, authenticateWallet, isAuthenticated, isAuthenticating])

  if (isConnected && address) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-3 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-2xl">Wallet Connected</CardTitle>
            <CardDescription>
              {error ? "Authentication Failed" : "Authenticating your wallet..."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/50 border">
                <p className="text-sm text-muted-foreground text-center break-all">{address}</p>
              </div>

              {error ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <div className="flex gap-2">
                      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                  </div>
                  <Button onClick={logout} variant="destructive" className="w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    Disconnect Wallet
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>Connect your wallet to access the admin dashboard</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex justify-center">
              <ConnectButton />
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Supported Wallets</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-lg bg-muted/50 border">
                <p className="text-xs font-medium">MetaMask</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border">
                <p className="text-xs font-medium">WalletConnect</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border">
                <p className="text-xs font-medium">Coinbase</p>
              </div>
              <div className="p-3 rounded-lg bg-muted/50 border">
                <p className="text-xs font-medium">Rainbow</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t space-y-3">
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <p className="text-xs text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> Only wallet addresses registered as admin can access the dashboard.
              </p>
            </div>

            <Button variant="outline" className="w-full" onClick={() => router.push("/")}>
              Back to Home
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
