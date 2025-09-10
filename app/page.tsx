import Image from "next/image";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-6">
      {/* Logo / Name */}
      <div className="text-center">
        <h1 className="text-5xl italic font-serif tracking-widest">
          I<span className="mx-2">—</span>Y
          <sup className="text-xs align-super ml-1">©</sup>
        </h1>

        {/* Description */}
        <p className="mt-6 text-gray-900 text-lg max-w-lg">
          Iysah Yusuf is a mobile engineer driven by visual craft &amp; storytelling.
          Currently designing at Discord. Previously Google.
        </p>

        <hr className="my-6 border-gray-200" />

        {/* Subtext */}
        <p className="text-gray-400 text-base max-w-xl">
          My 2025 portfolio is under construction—while that’s happening, you
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
            href="mailto:hello@iysahyusuf.com"
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
