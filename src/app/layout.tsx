import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://dexhaus.com'),
  title: "DEXHAUS | Smart Solutions for a Better Home",
  description: "Curated products that reduce effort, save time, and make everyday living easier. SMART SOLUTIONS. BETTER LIVING.",
  keywords: ["smart home solutions", "home organization", "practical home solutions", "space-saving storage", "Dexhaus"],
  openGraph: {
    title: "DEXHAUS | Smart Solutions for a Better Home",
    description: "Curated products that reduce effort, save time, and make everyday living easier.",
    url: "https://dexhaus.com",
    siteName: "DEXHAUS",
    images: [
      {
        url: "/hero-lifestyle.jpg",
        width: 1200,
        height: 630,
        alt: "DEXHAUS Smart Solutions for a Better Home",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DEXHAUS | Smart Solutions for a Better Home",
    description: "Curated products that reduce effort, save time, and make everyday living easier.",
    images: ["/hero-lifestyle.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <CustomCursor />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
