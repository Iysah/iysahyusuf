import Image from "next/image";
import Script from "next/script";

export const metadata = {
  title: "React Native Developer | iOS/Android Apps – Iysah Yusuf",
  description:
    "Showcasing mobile apps built with React Native and Swift. Explore cross-platform projects and contact for iOS/Android development.",
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
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
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
              "https://linkedin.com/in/iysahyusuf",
              "https://github.com/iysahyusuf",
              "https://twitter.com/iysahyusuf",
            ],
          }),
        }}
      />
      {/* Logo / Name */}
      <div className="text-center">
        <h1 className="text-5xl italic font-serif tracking-widest text-gray-900">
          I<span className="mx-2">—</span>Y
          <sup className="text-xs align-super ml-1">©</sup>
        </h1>

        {/* Description */}
        <p className="mt-6 text-gray-900 text-lg max-w-lg font-medium">
          Iysah Yusuf is a senior mobile developer driven by mobile innovation &amp; problem-solving.
          Currently building at MoMo PSB. Previously RepairFind CA.
        </p>

        <hr className="my-6 border-gray-200" />

        {/* Subtext */}
        <p className="text-gray-400 text-base max-w-xl">
          My 2025 portfolio is under construction—while that&apos;s happening, you
          can find me on{" "}
          <a
            href="https://linkedin.com/in/iysahyusuf"
            target="_blank"
            className="underline hover:text-gray-600"
          >
            LinkedIn
          </a>
          , or say{" "}
          <a
            href="mailto:iysahyusuf@gmail.com"
            className="underline hover:text-gray-600"
          >
            hello@iysahyusuf.com
          </a>
          .
        </p>
      </div>
    </main>
  );
}
