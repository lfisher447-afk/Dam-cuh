import type { Metadata, Viewport } from "next";
import "./globals.css";
const Analytics = () => null;
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import IntroSplash from "@/components/IntroSplash";
import JsonLd from "@/components/JsonLd";
import { QueryProvider } from "@/providers/query-provider";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#010101",
};

// Catalogue and account routes obtain runtime data from configured services.
// Vercel renders them on demand so deployments stay buildable before secrets are
// added and visitors never receive a stale compiled catalogue.
export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://dam.vercel.app";
const siteDescription =
  "Discover movies and TV series on DAM. Explore trailers, cast information, ratings, recommendations, and live channels in one cinematic watch guide.";

export const metadata: Metadata = {
  title: {
    default: "DAM - Movies, TV Series, Trailers & Live Channels",
    template: "%s | DAM",
  },
  description: siteDescription,
  keywords: ["movies", "TV series", "streaming", "trailers", "cast", "ratings", "live TV"],
  authors: [{ name: "DAM" }],
  creator: "DAM",
  applicationName: "DAM",
  metadataBase: new URL(siteUrl),
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "DAM",
    title: "DAM - Movies, TV Series, Trailers & Live Channels",
    description: siteDescription,
    images: [{ url: "/images/space_odyssey_bg.png", alt: "DAM" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DAM - Movies, TV Series, Trailers & Live Channels",
    description: siteDescription,
    images: ["/images/space_odyssey_bg.png"],
  },
};

const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "DAM",
  url: siteUrl,
  description: siteDescription,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${siteUrl}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
    >
      <head>
        {/* Every poster/backdrop comes from TMDB — warm the connection early */}
        <link rel="preconnect" href="https://image.tmdb.org" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
        <JsonLd data={siteJsonLd} />
      </head>
      <body className="flex min-h-screen flex-col">
        <QueryProvider>
          <IntroSplash />
          <Header />
          <main className="flex-1 pb-20 md:pb-0">{children}</main>
          <Footer />
          <BottomNav />
          <Analytics />
        </QueryProvider>
      </body>
    </html>
  );
}
