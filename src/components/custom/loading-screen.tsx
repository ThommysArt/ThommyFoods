"use client"

import { useEffect, useState, useRef } from "react"
import gsap from "gsap"
import { Rows, dishes } from "@/lib/data"

interface LoadingScreenProps {
  onLoadingComplete: () => void
}

export default function LoadingScreen({ onLoadingComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const loadingBarRef = useRef<HTMLDivElement>(null)
  const loadingScreenRef = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Collect all image URLs that need to be preloaded
    const imagesToLoad = [
      "/assets/hero1.jpg",
      "/assets/item3.jpg", // Avatar image
      ...Rows.flatMap((row) => row.map((item) => item.imageUrl)),
      ...dishes.map((dish) => dish.imageUrl),
    ]

    // Remove duplicates
    const uniqueImages = [...new Set(imagesToLoad)]
    let loadedCount = 0

    // Create a timeline for the loading animation
    const loadingTl = gsap.timeline()

    // Function to update progress
    const updateProgress = () => {
      loadedCount++
      const newProgress = Math.round((loadedCount / uniqueImages.length) * 100)
      setProgress(newProgress)

      // Animate the loading bar
      gsap.to(loadingBarRef.current, {
        width: `${newProgress}%`,
        duration: 0.3,
        ease: "power1.out",
      })

      // When all images are loaded
      if (loadedCount === uniqueImages.length) {
        setIsComplete(true)

        // Create exit animation
        loadingTl
          .to(logoRef.current, {
            scale: 1.2,
            duration: 0.5,
            ease: "power2.out",
          })
          .to(loadingScreenRef.current, {
            y: "-100%",
            duration: 0.8,
            ease: "power3.inOut",
            delay: 0.3,
            onComplete: onLoadingComplete,
          })
      }
    }

    // Preload all images
    uniqueImages.forEach((src) => {
      const img = new Image()
      img.src = src
      img.onload = updateProgress
      img.onerror = updateProgress // Count errors as loaded to avoid getting stuck
    })

    // Initial animation
    gsap.fromTo(logoRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" })

    // If there are no images to load, complete immediately
    if (uniqueImages.length === 0) {
      setProgress(100)
      setIsComplete(true)
      setTimeout(onLoadingComplete, 1500)
    }
  }, [onLoadingComplete])

  return (
    <div
      ref={loadingScreenRef}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#322922] text-amber-100"
    >
      <div ref={logoRef} className="mb-12 text-center">
        <h1 className="text-5xl md:text-6xl font-cinzel-decorative font-light text-amber-400 mb-2">Thommy Foods</h1>
        <p className="text-amber-100/80 text-lg">Delicious food coming your way</p>
      </div>

      <div className="w-[80%] max-w-md">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-medium">Loading assets</span>
          <span className="text-sm font-medium">{progress}%</span>
        </div>

        <div className="h-2 w-full bg-amber-900/30 rounded-full overflow-hidden">
          <div
            ref={loadingBarRef}
            className="h-full bg-amber-400 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="mt-4 text-center text-sm text-amber-100/60">
          {isComplete ? "Ready to serve!" : "Preparing your experience..."}
        </div>
      </div>
    </div>
  )
}

