"use client"

import { useState } from "react"
import Image from "next/image"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import ReactLenis from "lenis/react"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useGSAP } from "@gsap/react"
import { DishCard } from "@/components/custom/dish-card"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import Footer from "@/components/footer"
import { Rows, dishes } from "@/lib/data"
import LoadingScreen from "@/components/custom/loading-screen"
import CustomHero from "@/components/custom/custom-hero"

gsap.registerPlugin(ScrollTrigger)

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  // Handle loading completion
  const handleLoadingComplete = () => {
    setIsLoading(false)

    // Re-initialize ScrollTrigger after loading
    ScrollTrigger.refresh()
  }

  // Auto-scroll carousel
  React.useEffect(() => {
    if (!api || isLoading) return

    const interval = setInterval(() => {
      if (api.selectedScrollSnap() + 1 >= api.scrollSnapList().length) {
        setCurrent(0)
        api.scrollTo(0)
      } else {
        api.scrollNext()
        setCurrent((prev) => prev + 1)
      }
    }, 3000) // Increased interval for better user experience

    return () => clearInterval(interval)
  }, [api, isLoading])

  const isMobile = useIsMobile()

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  useGSAP(() => {
    // Only initialize animations when not loading
    if (isLoading) return

    // Clear any existing animations to prevent conflicts
    ScrollTrigger.getAll().forEach((t) => t.kill())

    // Responsive values for different screen sizes
    const getResponsiveValues = () => {
      const width = window.innerWidth

      // Mobile values
      if (width < 768) {
        return {
          leftXValues: [-200, -220, -150],
          rightXValues: [200, 220, 150],
          leftRotationValues: [-15, -10, -15],
          rightRotationValues: [15, 10, 15],
          yValues: [50, -25, -100],
        }
      }
      // Tablet values
      else if (width < 1024) {
        return {
          leftXValues: [-400, -450, -250],
          rightXValues: [400, 450, 250],
          leftRotationValues: [-20, -15, -25],
          rightRotationValues: [20, 15, 25],
          yValues: [75, -35, -150],
        }
      }
      // Desktop values (original)
      else {
        return {
          leftXValues: [-800, -900, -400],
          rightXValues: [800, 900, 400],
          leftRotationValues: [-30, -20, -35],
          rightRotationValues: [30, 20, 35],
          yValues: [100, -50, -200],
        }
      }
    }

    const { leftXValues, rightXValues, leftRotationValues, rightRotationValues, yValues } = getResponsiveValues()

    // Heading animation
    gsap.fromTo(
      ".items-section h2",
      {
        clipPath: "polygon(0 0, 0 0, 0 100%, 0% 100%)",
      },
      {
        clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
        scrollTrigger: {
          trigger: ".items-section",
          start: "top center",
          end: "center center",
          scrub: true,
        },
      },
    )

    // Row animations
    gsap.utils.toArray(".items-row").forEach((row: any, idx) => {
      const leftItem = row.querySelector(".item-left")
      const rightItem = row.querySelector(".item-right")

      gsap.to(leftItem, {
        x: leftXValues[idx],
        scrollTrigger: {
          trigger: ".items-section",
          start: "top center",
          end: "150% bottom",
          scrub: true,
          onUpdate: (self) => {
            const progress = self.progress
            leftItem.style.transform = `translateX(${progress * leftXValues[idx]}px) translateY(${yValues[idx]}px) rotate(${progress * leftRotationValues[idx]}deg)`
            rightItem.style.transform = `translateX(${progress * rightXValues[idx]}px) translateY(${yValues[idx]}px) rotate(${progress * rightRotationValues[idx]}deg)`
          },
        },
      })
    })

    // Update animations on resize
    const handleResize = () => {
      ScrollTrigger.refresh()
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [isLoading]) // Re-run when loading state changes

  return (
    <>
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}

      <ReactLenis root>
        <div className={`w-screen min-h-screen h-full bg-amber-100 p-2 ${isLoading ? "hidden" : ""}`}>
          <nav className="bg-transparent fixed top-0 left-0 right-0 z-50 font-cinzel-decorative font-light">
            <div className="flex px-4 md:px-6 py-4 gap-4 items-center justify-between h-[4rem] sm:h-[5rem] md:h-[6rem] w-full">
              <div className="flex gap-2 md:gap-4 items-center">
                <Avatar className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-16 lg:h-16">
                  <AvatarImage
                    src={"https://l3t21trefy.ufs.sh/f/UjDQWowP9GCE3o4KFQtB7gpX15tuoNv9nWYDBPl4fTrjskZJ"}
                    alt="avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                  <AvatarFallback className="text-amber-400">R</AvatarFallback>
                </Avatar>
                {!isMobile && <span className="text-base sm:text-lg md:text-xl text-amber-400">Thommy Foods</span>}
              </div>
              <div className="flex gap-2 md:gap-4">
                <Button
                  size={isMobile ? "sm" : "lg"}
                  className="rounded-full bg-[#322922] text-white border text-xs sm:text-sm md:text-base"
                  onClick={() => scrollToSection("menu")}
                >
                  Menu
                </Button>
                <Button
                  size={isMobile ? "sm" : "lg"}
                  className="rounded-full bg-amber-200 border text-xs sm:text-sm md:text-base"
                  onClick={() => scrollToSection("footer")}
                >
                  Contact
                </Button>
              </div>
            </div>
          </nav>

          {/*Hero*/}
          <CustomHero />

          {/*Items*/}
          <section className="items-section relative w-full mt-8">
            <div className="absolute inset-0 w-full">
              <div className="sticky top-0 w-full h-screen flex items-center justify-center z-10 pointer-events-none">
                <h2 className="text-[3rem] sm:text-[4rem] md:text-[6rem] lg:text-[8rem] xl:text-[10rem] w-[80vw] sm:w-[60vw] md:w-[50vw] lg:w-[40vw] font-cinzel-decorative font-bold text-center text-[#322922]/90">
                  Eating Good
                </h2>
              </div>
            </div>
            <div className="w-full h-fit overflow-x-hidden">
              <div className="flex flex-col gap-4 sm:gap-6 md:gap-8 mx-auto justify-evenly w-[90vw] sm:w-[85vw] md:w-[80vw] min-h-[200vh] relative z-20">
                {Rows.map((row, i) => (
                  <div className="items-row flex flex-row gap-4 sm:gap-6 md:gap-8" key={i}>
                    <div className="item-left w-full h-full relative">
                      <AspectRatio ratio={1}>
                        <Image
                          src={row[0].imageUrl || "/placeholder.svg"}
                          alt={row[0].name}
                          fill
                          className={`object-cover rounded-xl w-full h-full`}
                        />
                      </AspectRatio>
                    </div>
                    <div className="item-right w-full h-full relative">
                      <AspectRatio ratio={1}>
                        <Image
                          src={row[1].imageUrl || "/placeholder.svg"}
                          alt={row[1].name}
                          fill
                          className={`object-cover rounded-xl w-full h-full`}
                        />
                      </AspectRatio>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Menu */}
          <section
            id="menu"
            className="menu-section min-h-screen w-full mt-10 space-y-8 lg:space-y-16 bg-[#322922] py-[5rem] sm:py-[7rem] md:py-[10rem] overflow-x-hidden"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl font-cinzel-decorative font-light underline text-center text-amber-100">
              Menu
            </h1>
            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden px-4 md:px-8">
              <Carousel
                setApi={setApi}
                className="w-full relative"
                opts={{
                  align: "start",
                  loop: true,
                  skipSnaps: false,
                  containScroll: "trimSnaps",
                }}
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {dishes.map((dish, i) => (
                    <CarouselItem key={i} className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3">
                      <DishCard
                        title={dish.title}
                        description={dish.description}
                        imageUrl={dish.imageUrl}
                        price={dish.price}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <div className="flex justify-center mt-8">
                  <CarouselPrevious className="relative static mx-2" />
                  <CarouselNext className="relative static mx-2" />
                </div>
              </Carousel>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#322922]"></div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#322922]"></div>
            </div>
          </section>

          <footer id="footer" className="bg-[#322922] py-[5rem] sm:py-[7rem] md:py-[10rem] overflow-x-hidden">
            <Footer />
          </footer>
        </div>
      </ReactLenis>
    </>
  )
}

