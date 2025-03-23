"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { heroImages } from "@/lib/data"

// Define hero images


export default function CustomHero() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(1)
  const [progress, setProgress] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Handle image transition
  const transitionToNextImage = () => {
    // Reset progress
    setProgress(0)

    // Update indices
    const newCurrentIndex = (currentIndex + 1) % heroImages.length
    const newNextIndex = (newCurrentIndex + 1) % heroImages.length

    setCurrentIndex(newCurrentIndex)
    setNextIndex(newNextIndex)
  }

  // Initialize and handle progress
  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    // Reset progress
    setProgress(0)

    // Create progress animation
    const duration = 3 // seconds
    const steps = 100
    const increment = 100 / steps
    const stepTime = (duration * 1000) / steps

    // Animate progress bar
    let currentProgress = 0

    intervalRef.current = setInterval(() => {
      currentProgress += increment
      setProgress(Math.min(currentProgress, 100))

      // When progress reaches 100%, transition to next image
      if (currentProgress >= 100) {
        transitionToNextImage()
      }
    }, stepTime)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [currentIndex])

  // Preview click handler
  const handlePreviewClick = () => {
    // Clear any running intervals to prevent conflicts
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    transitionToNextImage()
  }

  return (
    <section ref={heroRef} className="relative w-full h-screen overflow-hidden">
      {/* Current image */}
      <Image
        src={heroImages[currentIndex].url || "/placeholder.svg"}
        alt={heroImages[currentIndex].alt}
        fill
        className="w-full h-full object-cover filter brightness-70"
        priority
      />

      {/* Preview of next image */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 cursor-pointer z-10" onClick={handlePreviewClick}>
        <div className="relative w-24 h-24 md:w-32 md:h-32 overflow-hidden rounded-lg border-2 border-amber-400 shadow-lg">
          {/* Progress bar */}
          <div className="absolute top-0 left-0 w-full h-1 bg-amber-900/30 z-20">
            <div
              ref={progressRef}
              className="h-full bg-amber-400 transition-all duration-300 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Next image */}
          <Image
            src={heroImages[nextIndex].url || "/placeholder.svg"}
            alt={`Preview of ${heroImages[nextIndex].alt}`}
            fill
            className="object-cover hover:scale-110 transition-transform duration-300"
          />

          {/* Overlay with icon */}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-amber-400/80 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-[#322922]"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Hero text */}
      <h1 className="text-7xl md:text-7xl lg:text-9xl absolute bottom-10 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-cinzel-decorative font-light bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent z-10">
        Fast Food Restaurant
      </h1>
    </section>
  )
}

