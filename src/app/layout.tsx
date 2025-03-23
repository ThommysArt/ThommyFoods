import type { Metadata } from "next";
import { Charm, Cinzel_Decorative, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import CustomCursor from "@/components/custom/custom-cursor";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const charmSerif = Charm({
  variable: "--font-charm-serif",
  subsets: ["latin"],
  weight: ["400", "700"],
})

const cinzelDecorative = Cinzel_Decorative({
  variable: "--font-cinzel-decorative",
  subsets: ["latin"],
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: "Thommy Foods",
  description: "You do not know what 'eating good' means... yet!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${charmSerif.variable} ${cinzelDecorative.variable} antialiased selection:bg-amber-200/50 selection:text-amber-800 bg-amber-100`}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <CustomCursor />
          </ThemeProvider>
      </body>
    </html>
  );
}
