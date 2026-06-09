import Script from "next/script";
import { ArrowUpRight } from "lucide-react";
import LocalClock from "@/components/landing/LocalClock";

export const metadata = {
  title: "Iysah Yusuf – CTO at Yawa | Engineering & Product Leader",
  description:
    "Iysah Yusuf is the CTO of Yawa, building products that scale and leading the teams that ship them. Engineering, product, and technical strategy.",
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

const SERVICES = ["Engineering", "Product", "Strategy"];

const SOCIALS = [
  { label: "LinkedIn", href: "https://linkedin.com/in/yusuf-iysah" },
  { label: "GitHub", href: "https://github.com/iysahyusuf" },
  { label: "Twitter", href: "https://x.com/yusufiysah" },
];

export default function Home() {
  return (
    <main
      id="main-content"
      className="relative flex min-h-[100svh] flex-col overflow-hidden bg-black text-white selection:bg-accent selection:text-white"
    >
      <Script
        id="person-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Iysah Yusuf",
            url: "https://iysahyusuf.com/",
            jobTitle: "Chief Technology Officer",
            worksFor: {
              "@type": "Organization",
              name: "Yawa",
              url: "https://yawa.digital",
            },
            sameAs: [
              "https://linkedin.com/in/yusuf-iysah",
              "https://github.com/iysahyusuf",
              "https://x.com/yusufiysah",
            ],
          }),
        }}
      />

      {/* Accent glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[60vh] w-[60vh] -translate-x-1/2 -translate-y-1/3 rounded-full bg-accent/25 blur-[140px]"
      />

      {/* ───────────────────────── Header ───────────────────────── */}
      <header className="relative z-20 flex items-center justify-between gap-4 px-6 py-6 md:px-10">
        <a
          href="/"
          className="font-display text-2xl tracking-tight text-accent md:text-3xl"
        >
          IYSAH<span className="text-white">.</span>
        </a>

        <div className="hidden items-center gap-7 text-[11px] font-medium uppercase tracking-[0.12em] text-white/60 lg:flex">
          <LocalClock />
          <span className="text-white/40">Lagos, NG</span>
          <span className="text-white">Based in Lagos, Nigeria</span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="mailto:hello@iysahyusuf.com"
            className="rounded-full bg-white px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-black transition hover:bg-white/85"
          >
            Let&apos;s talk
          </a>
          <a
            href="#contact"
            aria-label="Jump to contact"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-white/50 hover:bg-white/5"
          >
            <ArrowUpRight className="h-4 w-4 rotate-90" />
          </a>
        </div>
      </header>

      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative z-10 flex flex-1 flex-col px-6 pb-10 md:px-10">
        {/* Centered portrait — /public/iysah.png */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
        >
          <div className="relative h-[48vh] w-[min(78vw,520px)] overflow-hidden rounded-[2rem] bg-white/[0.03] ring-1 ring-white/5 md:h-[58vh]">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: "url(/iysah.png)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/65" />
          </div>
        </div>

        {/* Overlay content */}
        <div className="relative flex flex-1 flex-col pt-10">
          <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
            {/* Tagline */}
            <div className="max-w-xs">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
                CTO @ Yawa · Engineering Leader
              </p>
              <p className="text-lg font-medium leading-snug md:text-xl">
                Building products that scale
                <span className="text-white/45">
                  {" "}
                  &amp; leading the teams that ship them.
                </span>
              </p>
            </div>

            {/* Services */}
            <ul className="text-xl font-semibold leading-tight tracking-tight sm:shrink-0 sm:text-right sm:text-2xl md:text-4xl">
              {SERVICES.map((service, i) => (
                <li key={service} className={i === 0 ? "text-white" : "text-white/40"}>
                  {service}
                </li>
              ))}
            </ul>
          </div>

          {/* Giant name */}
          <h1 className="mt-auto pt-16 font-display uppercase leading-[0.82] tracking-tight">
            <span className="block text-[clamp(3.25rem,15vw,13rem)]">Iysah</span>
            <span className="block text-[clamp(3.25rem,15vw,13rem)]">
              Yusuf<span className="text-accent">.</span>
            </span>
          </h1>
        </div>
      </section>

      {/* ───────────────────────── Footer ───────────────────────── */}
      <footer
        id="contact"
        className="relative z-10 border-t border-white/10 bg-black px-6 pb-8 pt-16 md:px-10"
      >
        <div className="flex flex-col gap-12 lg:flex-row lg:justify-between">
          <div className="flex gap-16 text-sm uppercase tracking-wide">
            <nav className="flex flex-col gap-3" aria-label="Site">
              <a href="/" className="w-fit text-white transition hover:text-accent">
                Home
              </a>
              <a
                href="/resources"
                className="w-fit text-white transition hover:text-accent"
              >
                Resources
              </a>
              <a
                href="https://yawa.digital"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-fit items-center gap-1 text-white transition hover:text-accent"
              >
                Yawa <ArrowUpRight className="h-3.5 w-3.5" />
              </a>
            </nav>
            <nav className="flex flex-col gap-3" aria-label="Social">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit text-white transition hover:text-accent"
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </div>

          <div>
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
              Reach out anytime
            </p>
            <a
              href="mailto:hello@iysahyusuf.com"
              className="break-all text-2xl font-medium transition hover:text-accent sm:text-4xl md:text-5xl"
            >
              hello@iysahyusuf.com
            </a>
          </div>
        </div>

        <div className="mt-16 flex items-end justify-between gap-6">
          <span className="font-display text-[clamp(2.5rem,13vw,9rem)] uppercase leading-none tracking-tight text-accent">
            Iysah<span className="text-white/15">.</span>
          </span>
          <ul className="hidden text-right text-lg font-semibold leading-tight text-white/30 sm:block md:text-2xl">
            {SERVICES.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-6 text-[11px] uppercase tracking-[0.12em] text-white/40 sm:flex-row sm:justify-between">
          <span>© 2026 Iysah Yusuf. All rights reserved.</span>
          <a
            href="https://yawa.digital"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-white"
          >
            CTO @ Yawa
          </a>
        </div>
      </footer>
    </main>
  );
}
