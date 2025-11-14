"use client"

import { useEffect, useState, useCallback } from "react"
import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

interface Slide {
  id: string
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
  backgroundGradient: string
  badge?: string
  image?: string // NEW: Optional product image
  imageAlt?: string
}

// Default slides (fallback if no Medusa data)
const DEFAULT_SLIDES: Slide[] = [
  {
    id: "black-friday",
    title: "Black Friday Exclusive",
    subtitle: "Discover the latest styles from top brands",
    ctaText: "Shop Now",
    ctaLink: "/store",
    // Use local image for aesthetics similar to categories tiles
    image: "/images/hero/black-friday.jpg",
    badge: "Limited Time",
    imageAlt: "Black Friday luxury fashion collection",
    backgroundGradient: "from-neutral-900 to-neutral-800",
  },
  {
    id: "vip-membership",
    title: "Join VIP Today",
    subtitle: "Unlock 12% off all purchases + free shipping",
    ctaText: "Become VIP",
    ctaLink: "/account",
    image: "/images/hero/vip.jpg",
    badge: "Exclusive Benefits",
    imageAlt: "VIP membership benefits",
    backgroundGradient: "from-neutral-900 to-neutral-800",
  },
  {
    id: "new-arrivals",
    title: "New Arrivals",
    subtitle: "Discover the latest styles from top brands",
    ctaText: "Explore Collection",
    ctaLink: "/store",
    image: "/images/hero/new-arrivals.jpg",
    imageAlt: "New arrival shoes collection",
    backgroundGradient: "from-neutral-900 to-neutral-800",
  },
]

export default function HeroCarousel({ slides }: { slides?: Slide[] }) {
  // Use dynamic slides from Medusa if provided, otherwise fallback defaults
  const SLIDES = slides && slides.length > 0 ? slides : DEFAULT_SLIDES

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlay, setIsAutoPlay] = useState(true)
  const [isPaused, setIsPaused] = useState(false)

  // Navigation functions
  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
    setIsAutoPlay(false) // Stop auto-play on manual interaction
  }, [])

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % SLIDES.length)
  }, [SLIDES.length])

  const goToPrev = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length)
  }, [SLIDES.length])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        goToPrev()
        setIsAutoPlay(false)
      } else if (e.key === "ArrowRight") {
        goToNext()
        setIsAutoPlay(false)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [goToNext, goToPrev])

  // Auto-play logic
  useEffect(() => {
    if (!isAutoPlay || isPaused) return

    const interval = setInterval(goToNext, 6000) // 6 seconds per slide
    return () => clearInterval(interval)
  }, [isAutoPlay, isPaused, goToNext])

  return (
    <div
      className="relative w-full aspect-[16/9] min-h-[60vh] md:min-h-[65vh] overflow-hidden z-0"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label="Hero carousel"
      aria-live="polite"
    >
      {/* Slides Container */}
      <div className="relative h-full">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? "opacity-100 z-10"
                : "opacity-0 z-0"
            }`}
            aria-hidden={index !== currentSlide}
          >
            {/* Background - Image or Gradient */}
            {slide.image ? (
              <>
                {/* Product Image Background */}
                <Image
                  src={slide.image}
                  alt={slide.imageAlt || slide.title}
                  fill
                  priority={index === 0} // Priority for first slide
                  sizes="100vw"
                  className="object-cover object-[50%_60%] lg:object-[50%_66%]"
                  quality={90}
                />
                {/* Dark Overlay for Text Legibility (slightly softened) */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/15 pointer-events-none" />
              </>
            ) : (
              <>
                {/* Gradient Fallback */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${slide.backgroundGradient}`}
                />
                {/* Decorative Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 right-0 w-96 h-96 border-4 border-white rounded-full blur-3xl"></div>
                  <div className="absolute bottom-0 left-0 w-80 h-80 border-4 border-white rounded-full blur-3xl"></div>
                </div>
              </>
            )}

            {/* Content */}
            <div className="relative h-full flex items-center">
              <div className="nordstrom-container">
                {slide.id === "black-friday" ? (
                  <div className="max-w-4xl animate-fade-in-up">
                    <div className="space-y-4 md:space-y-6">
                      <div className="hero-headline text-3xl md:text-4xl lg:text-5xl tracking-[0.08em]">BLACK FRIDAY WARM UP</div>
                      <div className="hero-offer text-6xl md:text-7xl lg:text-8xl">12% OFF</div>
                      <div className="hero-sub text-xl md:text-2xl tracking-[0.08em]">FOR VIP MEMBERS</div>
                    </div>
                    <div className="mt-10 md:mt-12 flex flex-wrap items-center gap-4 md:gap-6">
                      <LocalizedClientLink
                        href="/categories/shoes"
                        className="btn-hero-soft uppercase text-[13px] md:text-[15px] font-medium tracking-wider"
                      >
                        Shop Shoes
                      </LocalizedClientLink>
                      <LocalizedClientLink
                        href="/categories/jewelry"
                        className="btn-hero-soft uppercase text-[13px] md:text-[15px] font-medium tracking-wider"
                      >
                        Shop Jewelry
                      </LocalizedClientLink>
                    </div>
                    <p className="mt-3 md:mt-4 text-[11px] md:text-xs text-white/80">*Excludes sale & selected lines.</p>
                  </div>
                ) : (
                  <div className="max-w-3xl space-y-6 md:space-y-8 animate-fade-in-up">
                    {/* Badge */}
                    {slide.badge && (
                      <div className="inline-block bg-white/20 backdrop-blur-sm border border-white/40 px-6 py-2 rounded-full">
                        <span className="text-white text-sm font-semibold uppercase tracking-widest">
                          {slide.badge}
                        </span>
                      </div>
                    )}
                    <h1 className="hero-title text-white drop-shadow-2xl">{slide.title}</h1>
                    <p className="hero-subtitle text-white/95 max-w-2xl drop-shadow-lg">{slide.subtitle}</p>
                    <div className="pt-4">
                      <LocalizedClientLink
                        href={slide.ctaLink}
                        className="inline-block bg-white text-grey-900 hover:bg-grey-100 px-10 py-4 rounded-lg font-semibold text-lg uppercase tracking-wider transition-all shadow-2xl hover:shadow-3xl hover:scale-105"
                      >
                        {slide.ctaText}
                      </LocalizedClientLink>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Left Arrow */}
      <button
        onClick={goToPrev}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-3 md:p-4 transition-all group"
        aria-label="Previous slide"
      >
        <svg 
          className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right Arrow */}
      <button
        onClick={goToNext}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full p-3 md:p-4 transition-all group"
        aria-label="Next slide"
      >
        <svg 
          className="w-5 h-5 md:w-6 md:h-6 text-white group-hover:scale-110 transition-transform" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-0 right-0 z-20">
        <div className="flex justify-center items-center gap-3">
          {SLIDES.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent ${
                index === currentSlide
                  ? "w-12 h-3 bg-white"
                  : "w-3 h-3 bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentSlide ? "true" : "false"}
            />
          ))}
        </div>
      </div>

      {/* Pause Indicator */}
      {isPaused && (
        <div className="absolute top-8 right-8 z-20 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
          <span className="text-white text-xs font-semibold uppercase tracking-wider">
            Paused
          </span>
        </div>
      )}

      {/* Slide Counter (Accessibility) */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {currentSlide + 1} of {SLIDES.length}: {SLIDES[currentSlide].title}
      </div>
    </div>
  )
}
