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

  React.useEffect(() => {
    if (!api) {
      return
    }

    setTimeout(() => {
      if (api.selectedScrollSnap() + 1 === api.scrollSnapList().length) {
        setCurrent(0)
        api.scrollTo(0)
      } else {
        api.scrollNext()
        setCurrent(current + 1)
      }
    }, 1000)
  }, [api, current])

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

    const leftXValues = [-800, -900, -400]
    const rightXValues = [800, 900, 400]
    const leftRotationValues = [-30, -20, -35]
    const rightRotationValues = [30, 20, 35]
    const yValues = [100, -50, -200]

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
  }, [isLoading]) // Re-run when loading state changes

  return (
    <>
      {isLoading && <LoadingScreen onLoadingComplete={handleLoadingComplete} />}

      <ReactLenis root>
        <div className={`w-screen min-h-screen h-full bg-amber-100 p-2 ${isLoading ? "hidden" : ""}`}>
          <nav className="bg-transparent fixed top-0 left-0 right-0 z-50 font-cinzel-decorative font-light">
            <div className="flex px-4 md:px-6 py-4 gap-4 items-center justify-between h-[6rem] w-full">
              <div className="flex gap-4 items-center">
                <Avatar className="w-10 h-10 md:w-12 md:h-12 lg:w-16 lg:h-16">
                  <AvatarImage
                    src={"https://l3t21trefy.ufs.sh/f/UjDQWowP9GCE3o4KFQtB7gpX15tuoNv9nWYDBPl4fTrjskZJ"}
                    alt="avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                  <AvatarFallback className="text-amber-400">R</AvatarFallback>
                </Avatar>
                {!isMobile && <span className="text-xl text-amber-400">Thommy Foods</span>}
              </div>
              <div className="flex gap-4">
                <Button
                  size="lg"
                  className="rounded-full bg-[#322922] text-white border"
                  onClick={() => scrollToSection("menu")}
                >
                  Menu
                </Button>
                <Button size="lg" className="rounded-full" onClick={() => scrollToSection("footer")}>
                  Contact
                </Button>
              </div>
            </div>
          </nav>

          {/*Hero*/}
          <section className="relative w-full h-screen">
            <Image
              src={"https://l3t21trefy.ufs.sh/f/UjDQWowP9GCEy7H3H42QRgH5wNhcPZ4EYJbIrA037SUlTi6n"}
              alt="hero"
              fill
              className="w-full h-full object-cover rounded filter brightness-70"
            />
            <h1 className="text-7xl md:text-7xl lg:text-9xl absolute bottom-10 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center font-cinzel-decorative font-light bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">
              Fast Food Restaurant
            </h1>
          </section>

          {/*Items*/}
          <section className="items-section relative w-full mt-8">
            <div className="absolute inset-0 w-full">
              <div className="sticky top-0 w-full h-screen flex items-center justify-center z-10 pointer-events-none">
                <h2 className="text-[6rem] md:text-[8rem] lg:text-[10rem] w-[40vw] font-cinzel-decorative text-center font-bold text-[#322922]/90">
                  Eating Good
                </h2>
              </div>
            </div>
            <div className="flex flex-col gap-8 mx-auto justify-evenly w-[80vw] min-h-[200vh] relative z-20">
              {Rows.map((row, i) => (
                <div className="items-row flex flex-row gap-8" key={i}>
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
          </section>

          {/* Menu */}
          <section
            id="menu"
            className="menu-section min-h-screen w-full mt-10 space-y-8 lg:space-y-16 bg-[#322922] py-[10rem]"
          >
            <h1 className="text-6xl md:text-7xl lg:text-9xl font-cinzel-decorative font-light underline text-center text-amber-100">
              Menu
            </h1>
            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
              <Carousel setApi={setApi} className="w-full relative">
                <CarouselContent>
                  {dishes.map((dish, i) => (
                    <CarouselItem key={i} className="basis-1 md:basis-1/2 xl:basis-1/3">
                      <DishCard
                        title={dish.title}
                        description={dish.description}
                        imageUrl={dish.imageUrl}
                        price={dish.price}
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute -bottom-10 right-10" />
                <CarouselNext className="absolute -bottom-10 right-6" />
              </Carousel>
              <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-[#322922]"></div>
              <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-[#322922]"></div>
            </div>
          </section>

          <footer id="footer" className="bg-[#322922] py-[10rem]">
            <Footer />
          </footer>
        </div>
      </ReactLenis>
    </>
  )
}

