import type { Metadata } from "next";
import { Roboto, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "React Native Portfolio | Innovative Mobile Apps – Iysah Yusuf",
  description:
    "Senior Mobile Developer building high-performance iOS/Android apps using React Native, Swift, and cross-platform tooling. Previously at RepairFind CA, currently at Aman HMO.",
  keywords: [
    "mobile app developer",
    "React Native expert",
    "iOS Android portfolio",
    "Swift iOS apps",
    "cross-platform mobile",
    "TypeScript",
    "Mobile Developer",
  ],
  alternates: {
    canonical: "https://iysahyusuf.com/",
  },
  openGraph: {
    title: "React Native Portfolio | Innovative Mobile Apps – Iysah Yusuf",
    description:
      "Senior Mobile Developer specializing in React Native and Swift. Explore cross-platform iOS/Android apps and case studies.",
    url: "https://iysahyusuf.com/",
    siteName: "Iysah Yusuf – Mobile Developer",
    type: "website",
    images: [
      {
        url: "https://iysahyusuf.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Mobile Developer Portfolio – React Native and Swift Projects",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "React Native Portfolio | Innovative Mobile Apps – Iysah Yusuf",
    description:
      "Building iOS/Android apps using React Native and Swift. Check out cross-platform projects and contact for collaborations.",
    images: ["https://iysahyusuf.com/og-image.jpg"],
    creator: "@iysahyusuf",
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
        className={`${roboto.variable} ${geistMono.variable} antialiased`}
      >
        <a href="#main-content" className="skip-to-content">Skip to content</a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
