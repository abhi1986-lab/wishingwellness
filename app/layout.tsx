import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { loadSiteContentWithFallback } from "./site-content-store";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wishing Wellness | Physiotherapy & Rehabilitation in Noida",
  description:
    "Integrated physiotherapy, chiropractic care and rehabilitation for pain, movement and recovery at Wishing Wellness Noida.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "Wishing Wellness",
    description:
      "Integrated pain-management, physiotherapy and rehabilitation care in Noida.",
    type: "website",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wishing Wellness",
    description:
      "Integrated pain-management, physiotherapy and rehabilitation care in Noida.",
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await loadSiteContentWithFallback();

  return (
    <html data-theme={content.theme} lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
