"use client"

import { useEffect, useState } from "react"
import { getDefaultEvent, type RedirectConfig } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { ArrowRight, LogIn } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  const [config, setConfig] = useState<RedirectConfig | null>(null)
  const [countdown, setCountdown] = useState<number | null>(null)

  useEffect(() => {
    const loadedConfig = getDefaultEvent()
    setConfig(loadedConfig)

    if (loadedConfig.redirectMode === "auto") {
      setCountdown(loadedConfig.autoRedirectDelay)
    }
  }, [])

  useEffect(() => {
    if (countdown === null || countdown <= 0 || !config) return

    if (countdown === 0) {
      window.location.href = config.redirectUrl
      return
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, config])

  const handleRedirect = () => {
    if (config) {
      window.location.href = config.redirectUrl
    }
  }

  const getProgress = () => {
    if (!config || countdown === null) return 0
    return ((config.autoRedirectDelay - countdown) / config.autoRedirectDelay) * 100
  }

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <Link
        href="/login"
        className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-muted/50"
      >
        <LogIn className="h-4 w-4" />
        <span className="hidden sm:inline">Login</span>
      </Link>

      <div className="w-full max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Image */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
            <Image src={config.heroImage || "/placeholder.svg"} alt="Hero" fill className="object-cover" priority />
          </div>

          {/* Right side - Content */}
          <div className="space-y-6">
            <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium">
              {config.heroSlogan}
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-balance leading-tight">{config.heroTitle}</h1>

            <p className="text-xl text-muted-foreground text-pretty leading-relaxed">{config.heroText}</p>

            <div className="pt-4">
              {config.redirectMode === "auto" && countdown !== null ? (
                <div className="space-y-4">
                  <div className="space-y-3 p-6 bg-muted/50 rounded-xl border border-border">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">Redirecting to your destination...</p>
                      <span className="text-2xl font-bold text-primary">{countdown}s</span>
                    </div>
                    <div className="relative h-2 bg-background rounded-full overflow-hidden">
                      <div
                        className="absolute inset-y-0 left-0 bg-primary transition-all duration-1000 ease-linear rounded-full"
                        style={{ width: `${getProgress()}%` }}
                      />
                    </div>
                  </div>

                  <Button size="lg" onClick={handleRedirect} className="text-lg px-8 py-6 group w-full sm:w-auto">
                    Continue Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              ) : (
                <Button size="lg" onClick={handleRedirect} className="text-lg px-8 py-6 group">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
