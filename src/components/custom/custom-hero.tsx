"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"

interface CustomHeroProps {
  images: string[]
}

const CustomHero: React.FC<CustomHeroProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [nextIndex, setNextIndex] = useState(1)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const transitionToNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    setNextIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      transitionToNextImage()
    }, 5000)

    return () => clearInterval(intervalRef.current!)
  }, [currentIndex, nextIndex])

  return (
    <div className="relative w-full h-full overflow-hidden">
      {images.map((image, index) => (
        <div
          key={index}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 object-cover ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image src={image} alt={`hero-${index}`} layout="fill" objectFit="cover" priority />
        </div>
      ))}
    </div>
  )
}

export default CustomHero

