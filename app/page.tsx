"use client"

import { Shader, ChromaFlow, Swirl } from "shaders/react"
import { CustomCursor } from "@/components/custom-cursor"
import { GrainOverlay } from "@/components/grain-overlay"
import { WorkSection } from "@/components/sections/work-section"
import { ContactSection } from "@/components/sections/contact-section"
import { MagneticButton } from "@/components/magnetic-button"
import { useRef, useEffect, useState } from "react"

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentSection, setCurrentSection] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const touchStartY = useRef(0)
  const touchStartX = useRef(0)
  const shaderContainerRef = useRef<HTMLDivElement>(null)
  const scrollThrottleRef = useRef<number>()

  useEffect(() => {
    const checkShaderReady = () => {
      if (shaderContainerRef.current) {
        const canvas = shaderContainerRef.current.querySelector("canvas")
        if (canvas && canvas.width > 0 && canvas.height > 0) {
          setIsLoaded(true)
          return true
        }
      }
      return false
    }

    if (checkShaderReady()) return

    const intervalId = setInterval(() => {
      if (checkShaderReady()) {
        clearInterval(intervalId)
      }
    }, 100)

    const fallbackTimer = setTimeout(() => {
      setIsLoaded(true)
    }, 1500)

    return () => {
      clearInterval(intervalId)
      clearTimeout(fallbackTimer)
    }
  }, [])

  const scrollToSection = (index: number) => {
    if (scrollContainerRef.current) {
      const sectionWidth = scrollContainerRef.current.offsetWidth
      scrollContainerRef.current.scrollTo({
        left: sectionWidth * index,
        behavior: "smooth",
      })
      setCurrentSection(index)
    }
  }

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY
      touchStartX.current = e.touches[0].clientX
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (Math.abs(e.touches[0].clientY - touchStartY.current) > 10) {
        e.preventDefault()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY
      const touchEndX = e.changedTouches[0].clientX
      const deltaY = touchStartY.current - touchEndY
      const deltaX = touchStartX.current - touchEndX

      if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
        if (deltaY > 0 && currentSection < 2) {
          scrollToSection(currentSection + 1)
        } else if (deltaY < 0 && currentSection > 0) {
          scrollToSection(currentSection - 1)
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("touchstart", handleTouchStart, { passive: true })
      container.addEventListener("touchmove", handleTouchMove, { passive: false })
      container.addEventListener("touchend", handleTouchEnd, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("touchstart", handleTouchStart)
        container.removeEventListener("touchmove", handleTouchMove)
        container.removeEventListener("touchend", handleTouchEnd)
      }
    }
  }, [currentSection])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault()

        if (!scrollContainerRef.current) return

        scrollContainerRef.current.scrollBy({
          left: e.deltaY,
          behavior: "instant",
        })

        const sectionWidth = scrollContainerRef.current.offsetWidth
        const scrollLeft = scrollContainerRef.current.scrollLeft
        const newSection = Math.round(scrollLeft / sectionWidth)

        if (newSection !== currentSection && newSection >= 0 && newSection <= 2) {
          setCurrentSection(newSection)
        }
      }
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false })
    }

    return () => {
      if (container) {
        container.removeEventListener("wheel", handleWheel)
      }
    }
  }, [currentSection])

  useEffect(() => {
    const handleScroll = () => {
      if (scrollThrottleRef.current) return

      scrollThrottleRef.current = requestAnimationFrame(() => {
        if (!scrollContainerRef.current) {
          scrollThrottleRef.current = undefined
          return
        }

        const sectionWidth = scrollContainerRef.current.offsetWidth
        const scrollLeft = scrollContainerRef.current.scrollLeft
        const newSection = Math.round(scrollLeft / sectionWidth)

        if (newSection !== currentSection && newSection >= 0 && newSection <= 2) {
          setCurrentSection(newSection)
        }

        scrollThrottleRef.current = undefined
      })
    }

    const container = scrollContainerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll, { passive: true })
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll)
      }
      if (scrollThrottleRef.current) {
        cancelAnimationFrame(scrollThrottleRef.current)
      }
    }
  }, [currentSection])

  return (
    <main className="relative h-screen w-full overflow-hidden bg-background">
      <CustomCursor />
      <GrainOverlay />

      <div
        ref={shaderContainerRef}
        className={`fixed inset-0 z-0 transition-opacity duration-700 ${isLoaded ? "opacity-100" : "opacity-0"}`}
        style={{ contain: "strict" }}
      >
        <Shader className="h-full w-full">
          <Swirl
            colorA="#1e40af"
            colorB="#0a0f1e"
            speed={0.8}
            detail={0.8}
            blend={50}
            coarseX={40}
            coarseY={40}
            mediumX={40}
            mediumY={40}
            fineX={40}
            fineY={40}
          />
          <ChromaFlow
            baseColor="#2563eb"
            upColor="#60a5fa"
            downColor="#475569"
            leftColor="#0f172a"
            rightColor="#1e293b"
            intensity={0.9}
            radius={1.8}
            momentum={25}
            maskType="alpha"
            opacity={0.97}
          />
        </Shader>
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <nav
        className={`fixed left-0 right-0 top-0 z-50 flex items-center px-4 py-3 transition-opacity duration-700 sm:px-6 sm:py-4 md:px-8 lg:px-12 xl:px-16 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          onClick={() => scrollToSection(0)}
          className="flex shrink-0 items-center gap-2 transition-transform hover:scale-105"
        >
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all duration-300 hover:scale-110 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10">
  <img src="/AerixLogo.png" alt="Aerix Logo" className="h-full w-full object-contain" />
</div>
          <span className="whitespace-nowrap font-sans text-base font-semibold tracking-tight text-foreground sm:text-lg md:text-xl lg:text-2xl">
            Aerix
          </span>
        </button>
      </nav>

      <div
        ref={scrollContainerRef}
        data-scroll-container
        className={`relative z-10 flex h-screen overflow-x-auto overflow-y-hidden transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <section className="flex min-h-screen w-screen shrink-0 flex-col justify-center px-4 py-16 sm:px-6 sm:py-20 md:px-12 lg:px-16 xl:px-20">
          <div className="max-w-4xl">
            <div className="mb-3 inline-block animate-in fade-in slide-in-from-bottom-4 rounded-full border border-foreground/20 bg-foreground/15 px-2.5 py-1 backdrop-blur-md duration-700 sm:mb-4 sm:px-3 sm:py-1.5 md:mb-5 md:px-4 md:py-2">
              <p className="whitespace-nowrap font-mono text-[9px] text-foreground/90 sm:text-[10px] md:text-xs lg:text-sm">
                B2B Lead Intelligence Platform
              </p>
            </div>
            <h1 className="mb-4 animate-in fade-in slide-in-from-bottom-8 font-sans text-3xl font-light leading-[1.1] tracking-tight text-foreground duration-1000 sm:mb-5 sm:text-4xl md:mb-6 md:text-5xl lg:mb-7 lg:text-6xl xl:mb-8 xl:text-7xl">
              <span className="text-balance">
                Find decision-makers.
                <br />
                Close deals faster.
              </span>
            </h1>
            <p className="mb-6 max-w-2xl animate-in fade-in slide-in-from-bottom-4 text-sm leading-relaxed text-foreground/90 duration-1000 delay-200 sm:mb-7 sm:text-base md:mb-8 md:text-lg lg:mb-9 lg:text-xl">
              <span className="text-pretty">
                Access verified contact data for key decision-makers. Filter by location, company size, and industry.
                Export qualified leads instantly—everything your agency needs for targeted B2B outreach.
              </span>
            </p>
            <div className="flex animate-in fade-in slide-in-from-bottom-4 flex-col gap-3 duration-1000 delay-300 sm:flex-row sm:items-center sm:gap-4">
              <MagneticButton
                size="lg"
                variant="primary"
                onClick={() => scrollToSection(2)}
                className="w-full sm:w-auto"
              >
                Join Waitlist
              </MagneticButton>
              <MagneticButton
                size="lg"
                variant="secondary"
                onClick={() => scrollToSection(1)}
                className="w-full sm:w-auto"
              >
                See Features
              </MagneticButton>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-in fade-in duration-1000 delay-500 sm:bottom-8 md:bottom-10 lg:bottom-12">
            <div className="flex items-center gap-2">
              <p className="font-mono text-[10px] text-foreground/80 sm:text-xs md:text-sm">Scroll to explore</p>
              <div className="flex h-5 w-10 items-center justify-center rounded-full border border-foreground/20 bg-foreground/15 backdrop-blur-md sm:h-6 sm:w-12 md:h-7 md:w-14">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-foreground/80 sm:h-2 sm:w-2" />
              </div>
            </div>
          </div>
        </section>

        <WorkSection />
        <ContactSection />
      </div>

      <style jsx global>{`
        div::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </main>
  )
}
