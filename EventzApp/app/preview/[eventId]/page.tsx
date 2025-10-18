"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { getEvents, type RedirectConfig } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { ArrowRight, X } from "lucide-react"
import Image from "next/image"

export default function PreviewPage() {
  const params = useParams()
  const router = useRouter()
  const [config, setConfig] = useState<RedirectConfig | null>(null)
  const [countdown, setCountdown] = useState<number>(0)

  useEffect(() => {
    const events = getEvents()
    const event = events.find((e) => e.id === params.eventId)

    if (event) {
      setConfig(event)
      if (event.redirectMode === "auto") {
        setCountdown(event.autoRedirectDelay)
      }
    }
  }, [params.eventId])

  useEffect(() => {
    if (config?.redirectMode === "auto" && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown, config])

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Event Not Found</h1>
          <p className="text-muted-foreground">The event you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const progress =
    config.redirectMode === "auto" ? ((config.autoRedirectDelay - countdown) / config.autoRedirectDelay) * 100 : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 relative">
      <div className="bg-yellow-500 text-black py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <span>Preview Mode - This is how the event will look</span>
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="ml-auto hover:bg-yellow-600">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
            <Image src={config.heroImage || "/placeholder.svg"} alt="Hero" fill className="object-cover" priority />
          </div>

          <div className="space-y-6">
            {config.heroSlogan && (
              <p className="text-primary font-semibold text-lg tracking-wide uppercase">{config.heroSlogan}</p>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-balance leading-tight">
              {config.heroTitle || "Welcome"}
            </h1>

            <p className="text-lg text-muted-foreground text-pretty leading-relaxed">
              {config.heroText || "Discover amazing opportunities with us."}
            </p>

            {config.redirectMode === "auto" && countdown > 0 && (
              <div className="space-y-3 p-6 bg-white rounded-lg shadow-md border">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Redirecting to your destination...</span>
                  <span className="font-bold text-2xl text-primary">{countdown}s</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-1000 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {config.redirectMode === "manual" && (
              <Button size="lg" className="group" disabled>
                Continue to Destination
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
