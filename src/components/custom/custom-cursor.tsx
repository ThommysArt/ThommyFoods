"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { UtensilsCrossed } from "lucide-react"

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorDotRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!cursorRef.current || !cursorDotRef.current) return

    // Hide default cursor
    document.body.style.cursor = "none"

    // Initial position off-screen
    gsap.set(cursorRef.current, { xPercent: -50, yPercent: -50, opacity: 0 })
    gsap.set(cursorDotRef.current, { xPercent: -50, yPercent: -50, opacity: 0 })

    // Variables for smooth animation
    const xTo = gsap.quickTo(cursorRef.current, "x", { duration: 0.6, ease: "power3.out" })
    const yTo = gsap.quickTo(cursorRef.current, "y", { duration: 0.6, ease: "power3.out" })

    // Faster movement for the dot
    const xDotTo = gsap.quickTo(cursorDotRef.current, "x", { duration: 0.3, ease: "power2.out" })
    const yDotTo = gsap.quickTo(cursorDotRef.current, "y", { duration: 0.3, ease: "power2.out" })

    // Fade in cursor after a short delay
    gsap.to([cursorRef.current, cursorDotRef.current], {
      opacity: 1,
      duration: 0.6,
      delay: 0.3,
    })

    // Mouse move handler
    const onMouseMove = (e: MouseEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
      xDotTo(e.clientX)
      yDotTo(e.clientY)
    }

    // Hover effects for interactive elements
    const onMouseEnterHandler = () => {
      if (!cursorRef.current) return
      gsap.to(cursorRef.current, {
        scale: 1.5,
        opacity: 0.8,
        duration: 0.3,
      })
    }

    const onMouseLeaveHandler = () => {
      if (!cursorRef.current) return
      gsap.to(cursorRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
      })
    }

    // Add event listeners
    window.addEventListener("mousemove", onMouseMove)

    // Add hover effects to all interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, [role="button"]')
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", onMouseEnterHandler)
      el.addEventListener("mouseleave", onMouseLeaveHandler)
    })

    // Handle cursor visibility when leaving/entering the window
    const onMouseLeaveWindow = () => {
      gsap.to([cursorRef.current, cursorDotRef.current], { opacity: 0, duration: 0.3 })
    }

    const onMouseEnterWindow = () => {
      gsap.to([cursorRef.current, cursorDotRef.current], { opacity: 1, duration: 0.3 })
    }

    document.documentElement.addEventListener("mouseleave", onMouseLeaveWindow)
    document.documentElement.addEventListener("mouseenter", onMouseEnterWindow)

    return () => {
      // Clean up
      document.body.style.cursor = ""
      window.removeEventListener("mousemove", onMouseMove)

      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnterHandler)
        el.removeEventListener("mouseleave", onMouseLeaveHandler)
      })

      document.documentElement.removeEventListener("mouseleave", onMouseLeaveWindow)
      document.documentElement.removeEventListener("mouseenter", onMouseEnterWindow)
    }
  }, [])

  return (
    <>
      {/* Main cursor with fork and knife icon */}
      <div ref={cursorRef} className="fixed top-0 left-0 z-50 pointer-events-none">
        <div className="relative w-10 h-10">
          <UtensilsCrossed className="text-white" />
        </div>
      </div>

      {/* Small dot that follows cursor more closely */}
      <div ref={cursorDotRef} className="fixed top-0 left-0 z-50 w-1 h-1 rounded-full bg-primary pointer-events-none fill-white text-white" />
    </>
  )
}

