import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quran Researcher | AI-Powered Quranic Analysis",
  description: "Explore the Quran through AI-assisted morphological and semantic analysis. Discover word patterns, compare terms, and uncover deep linguistic insights.",
  keywords: ["Quran", "Arabic", "Morphology", "Islamic Studies", "AI Research", "Linguistics"],
  authors: [{ name: "Quran Researcher" }],
  openGraph: {
    title: "Quran Researcher | AI-Powered Quranic Analysis",
    description: "Explore the Quran through AI-assisted morphological and semantic analysis.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Noto+Naskh+Arabic:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 flex">
              {children}
            </main>
          </div>
        </TooltipProvider>
      </body>
    </html>
  );
}
