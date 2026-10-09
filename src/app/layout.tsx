import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dexhaus | Premium Smart Home Solutions",
  description: "Curated products that reduce effort, save time, and make everyday living effortlessly premium.",
  keywords: ["smart home", "home organization", "kitchen gadgets", "premium home accessories"],
  openGraph: {
    title: "Dexhaus | Premium Smart Home Solutions",
    description: "Curated products that reduce effort, save time, and make everyday living effortlessly premium.",
    url: "https://dexhaus.com",
    siteName: "Dexhaus",
    images: [
      {
        url: "/hero-image.jpeg", // Replace with a real high-res OG image later
        width: 1200,
        height: 630,
        alt: "Dexhaus Smart Home Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dexhaus | Premium Smart Home Solutions",
    description: "Curated products that reduce effort, save time, and make everyday living effortlessly premium.",
    images: ["/hero-image.jpeg"],
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
