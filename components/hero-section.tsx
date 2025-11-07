"use client"

export default function HeroSection() {
  return (
    <section className="relative w-full h-[600px] sm:h-[700px] lg:h-[800px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/e7547a86-7aae-4db7-bbd1-f6a5f66e2416-ehcavnsfM1wtvpY7qGvkk4yGgaJh61.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight tracking-tight">
            Alternate Intern
            <br />
            <span className="text-amber-200">Kemnaker</span>
          </h1>

          <p className="text-lg sm:text-xl lg:text-2xl text-amber-50 font-light italic max-w-xl mx-auto">
            Platform alternatif menemukan intern kemnaker
          </p>

          <div className="mt-8 sm:mt-12">
            <p className="text-sm sm:text-base text-amber-100 tracking-widest uppercase font-medium">
              ENJOY~
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
