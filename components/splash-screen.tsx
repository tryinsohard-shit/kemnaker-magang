"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export function SplashScreen() {
  const [progress, setProgress] = useState(0)
  const [matrixText, setMatrixText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$#@%"
    let interval: NodeJS.Timeout
    let matrixInterval: NodeJS.Timeout

    // Matrix text effect
    matrixInterval = setInterval(() => {
      const randomText = Array(12)
        .fill(0)
        .map(() => characters.charAt(Math.floor(Math.random() * characters.length)))
        .join("")
      setMatrixText(randomText)
    }, 50)

    // Progress bar animation
    interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          clearInterval(matrixInterval)
          setTimeout(() => setIsComplete(true), 500)
          return 100
        }
        return prev + Math.random() * 15 + 5
      })
    }, 200)

    return () => {
      clearInterval(interval)
      clearInterval(matrixInterval)
    }
  }, [])

  return (
    <div
      className={cn(
        "fixed inset-0 z-[60] flex flex-col items-center justify-center transition-opacity duration-500",
        "bg-black",
        isComplete ? "opacity-0 pointer-events-none" : "opacity-100",
      )}
    >
      {/* Scanline effect overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div
          className="absolute inset-0 bg-repeat"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 0, 0.03) 2px, rgba(0, 255, 0, 0.03) 4px)",
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-4 sm:gap-8 px-4">
        {/* Logo/Title */}
        <div className="text-center">
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-white mb-2 tracking-wider sm:tracking-widest font-mono">
            ALTERNATE_INTERN
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 font-mono tracking-wider sm:tracking-widest">[ KEMNAKER ]</p>
        </div>

        {/* Matrix-style loading text */}
        <div className="font-mono text-white text-xs sm:text-sm h-5 sm:h-6 tracking-wide sm:tracking-wider opacity-80">
          {`> SYS_INIT: ${matrixText}`}
        </div>

        {/* Progress bar container */}
        <div className="w-64 sm:w-72 h-1 bg-gray-800 rounded-sm overflow-hidden border border-gray-600">
          <div
            className="h-full bg-white transition-all duration-100 ease-out shadow-lg shadow-white/50"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>

        {/* Progress percentage */}
        <div className="font-mono text-xs text-white tracking-wider sm:tracking-widest opacity-70">
          {`${Math.min(Math.round(progress), 100)}%`}
        </div>

        {/* Loading text */}
        <p className="text-xs text-gray-500 mt-2 sm:mt-4 tracking-wider sm:tracking-widest font-mono">
          INITIALIZING_SYSTEM...
        </p>

        {/* Creator credit */}
        <div className="absolute bottom-4 sm:bottom-8 text-xs text-gray-600 font-mono tracking-wide sm:tracking-wider">
          Created By <span className="text-white">AxLDeV</span>
        </div>
      </div>
    </div>
  )
}
