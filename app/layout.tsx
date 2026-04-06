import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import "./globals.css"

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
})

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: "Documentation Tool",
  description: "Projekt- und Business-Dokumentationen strukturiert erfassen, validieren und als PDF exportieren.",
  openGraph: {
    title: "Documentation Tool",
    description: "Docusaurus-inspirierte UX für strukturierte Projektdokumentation mit PDF-Export.",
    type: "website",
    url: "/",
    images: [{ url: "/opengraph-image" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Documentation Tool",
    description: "Form-to-document Workflow mit Preview und PDF-Export.",
    images: ["/twitter-image"],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="de" className={`${inter.variable} ${jetBrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
