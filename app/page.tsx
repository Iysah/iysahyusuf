import Image from "next/image";
import Script from "next/script";

export const metadata = {
  title: "Iysah Yusuf - Senior Mobile Developer",
  description:
    "Shipping mobile apps built with React Native and Swift. Explore cross-platform projects and contact for iOS/Android development.",
  alternates: {
    canonical: "https://iysahyusuf.com/",
  },
  openGraph: {
    url: "https://iysahyusuf.com/",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function Home() {
  return (
    <main id="main-content" className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] px-6">
      <Script
        id="person-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Iysah Yusuf",
            url: "https://iysahyusuf.com/",
            jobTitle: "Mobile App Developer",
            worksFor: {
              "@type": "Organization",
              name: "MoMo PSB",
            },
            sameAs: [
              "https://linkedin.com/in/yusuf-iysah",
              "https://github.com/iysahyusuf",
              "https://x.com/yusufiysah",
            ],
          }),
        }}
      />
      {/* Logo / Name */}
      <div className="text-center">
        <h1 className="text-5xl italic font-serif tracking-widest text-[var(--foreground)]">
          I<span className="mx-2">—</span>Y
          <sup className="text-xs align-super ml-1">©</sup>
        </h1>

        {/* Description */}
        <p className="mt-6 text-[var(--foreground)] text-lg max-w-lg font-medium">
          Iysah Yusuf is a senior mobile developer driven by mobile innovation &amp; problem-solving.
          Currently building at MoMo PSB. Previously RepairFind CA.
        </p>

        <hr className="my-6 border-[var(--foreground)] opacity-20" />

        {/* Subtext */}
        <p className="text-[var(--foreground)] opacity-70 text-base max-w-xl">
          My 2025 portfolio is under construction—while that&apos;s happening, you
          can find me on{" "}
          <a
            href="https://linkedin.com/in/iysahyusuf"
            target="_blank"
            className="underline hover:opacity-80"
          >
            LinkedIn
          </a>
          , or say{" "}
          <a
            href="mailto:iysahyusuf@gmail.com"
            className="underline hover:opacity-80"
          >
            hello@iysahyusuf.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
