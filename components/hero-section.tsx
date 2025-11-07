"use client"

import { useState, useEffect } from "react"

export default function HeroSection() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative w-full h-[600px] sm:h-[700px] lg:h-[800px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/e7547a86-7aae-4db7-bbd1-f6a5f66e2416-ehcavnsfM1wtvpY7qGvkk4yGgaJh61.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          transform: `translateY(${scrollY * 0.5}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div
        className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight">
            Alternate Intern
            <br />
            <span className="relative inline-block">
              <span className="relative z-10 text-white">Kemnaker</span>
              <span className="absolute inset-0 -m-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg transform -skew-y-1 shadow-lg blur-sm"></span>
              <span className="absolute inset-0 -m-2 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg transform -skew-y-1"></span>
            </span>
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-amber-50 font-light italic max-w-xl mx-auto">
            Platform alternatif menemukan intern kemnaker
          </p>

          <div className="mt-8 sm:mt-12">
            <p className="text-sm sm:text-base text-amber-100 tracking-widest uppercase font-medium">ENJOY~</p>
          </div>
        </div>
      </div>
    </section>
  )
}
