import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CookiesBanner from "@/components/CookiesBanner";

export const metadata: Metadata = {
  title: "b!nje — Stream Movies",
  description:
    "Discover and stream thousands of movies. Your cinematic journey starts here.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://image.tmdb.org" />
        <link rel="dns-prefetch" href="https://image.tmdb.org" />
      </head>
      <body className="min-h-dvh flex flex-col bg-background text-foreground antialiased">
        <Navbar email="" username="Guest" />
        <main className="flex-1">{children}</main>
        <Footer />
        <CookiesBanner />
      </body>
    </html>
  );
}
