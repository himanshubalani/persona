import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://persona.askclerio.dev"), 
  title: "Clerio Personas",
  description: "Clerio Personas is a collection of AI-powered mentors that can help you learn, build, and grow.",
  openGraph: {
    title: "Clerio Personas",
    description: "Clerio Personas is a collection of AI-powered mentors that can help you learn, build, and grow.",
    url: "https://persona.askclerio.dev",
    siteName: "Clerio Personas",
    images: [
      {
        url: "/og-image.png", 
        width: 1920,
        height: 1080,
        alt: "Clerio Personas Preview",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
      {children}
      <Analytics />
      </body>
    </html>
  );
}
