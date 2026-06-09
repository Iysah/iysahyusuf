import type { Metadata } from "next";
import { Roboto, Geist_Mono, Anton } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Iysah Yusuf – CTO at Yawa | Engineering & Product Leader",
  description:
    "Iysah Yusuf is the CTO of Yawa, building products that scale and leading the teams that ship them. Engineering, product, and technical strategy.",
  keywords: [
    "Iysah Yusuf",
    "CTO Yawa",
    "engineering leader",
    "technical strategy",
    "product engineering",
    "software architecture",
    "startup CTO",
  ],
  alternates: {
    canonical: "https://iysahyusuf.com/",
  },
  openGraph: {
    title: "Iysah Yusuf – CTO at Yawa | Engineering & Product Leader",
    description:
      "Building products that scale and leading the teams that ship them. CTO at Yawa — engineering, product, and technical strategy.",
    url: "https://iysahyusuf.com/",
    siteName: "Iysah Yusuf – CTO at Yawa",
    type: "website",
    images: [
      {
        url: "https://iysahyusuf.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Iysah Yusuf – CTO at Yawa, engineering and product leader",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Iysah Yusuf – CTO at Yawa | Engineering & Product Leader",
    description:
      "Building products that scale and leading the teams that ship them. CTO at Yawa.",
    images: ["https://iysahyusuf.com/og-image.jpg"],
    creator: "@yusufiysah",
  },
  robots: {
    index: true,
    follow: true,
  },
  viewport: "width=device-width, initial-scale=1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${geistMono.variable} ${anton.variable} antialiased`}
      >
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
