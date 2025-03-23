"use client"

import { useRef } from "react"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useGSAP } from "@gsap/react"

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const copyrightRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    // Register ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger)

    // Main footer animation
    gsap.fromTo(
      footerRef.current,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top bottom-=100",
          toggleActions: "play none none none",
        },
      },
    )

    // Contact items staggered animation
    gsap.fromTo(
      contactRef.current?.children || [],
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        delay: 0.3,
        scrollTrigger: {
          trigger: contactRef.current,
          start: "top bottom-=50",
          toggleActions: "play none none none",
        },
      },
    )

    // Copyright animation
    gsap.fromTo(
      copyrightRef.current,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.8,
        delay: 0.8,
        scrollTrigger: {
          trigger: copyrightRef.current,
          start: "top bottom",
          toggleActions: "play none none none",
        },
      },
    )

    // Hover animations for contact items
    const contactItems = contactRef.current?.querySelectorAll(".contact-item") || []
    contactItems.forEach((item) => {
      item.addEventListener("mouseenter", () => {
        gsap.to(item, {
          scale: 1.05,
          duration: 0.3,
          ease: "power1.out",
        })
      })

      item.addEventListener("mouseleave", () => {
        gsap.to(item, {
          scale: 1,
          duration: 0.3,
          ease: "power1.out",
        })
      })
    })

    return () => {
      // Clean up event listeners
      contactItems.forEach((item) => {
        item.removeEventListener("mouseenter", () => {})
        item.removeEventListener("mouseleave", () => {})
      })
    }
  }, [])

  return (
    <footer ref={footerRef} className="border-t w-full py-12 px-4 md:px-8 font-serif">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-2xl font-cinzel-decorative font-medium mb-4">Thommy Foods</h3>
            <p className="text-muted-foreground max-w-md">
              Exquisite dining experiences with the finest ingredients and exceptional service.
            </p>
          </div>

          <div ref={contactRef} className="space-y-4">
            <h4 className="text-lg font-medium mb-4">Contact Us</h4>

            <div className="contact-item flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <a
                href="mailto:thomsonnguems@gmail.com"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                thomsonnguems@gmail.com
              </a>
            </div>

            <div className="contact-item flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary" />
              <a href="tel:+1234567890" className="text-muted-foreground hover:text-primary transition-colors">
                +237 658-924-833
              </a>
            </div>

            <div className="contact-item flex items-center gap-3">
              <MapPin className="h-5 w-5 text-primary" />
              <address className="text-muted-foreground not-italic">Yaounde, Cameroon</address>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <div ref={copyrightRef} className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Restaurant. All rights reserved.
          </p>

          <Link
            href="https://k-thomson.vercel.app"
            className="text-sm flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
          >
            Designed by Thommysart
            <ExternalLink className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </footer>
  )
}

