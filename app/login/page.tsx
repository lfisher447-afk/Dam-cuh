"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Film, Play, Sparkles, CheckCircle2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-card/60 backdrop-blur-xl border border-border/40 rounded-2xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center mx-auto mb-6 shadow-inner">
          <Film className="w-8 h-8" />
        </div>
        
        <h1 className="text-2xl font-bold tracking-tight mb-2">No Account Needed</h1>
        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
          Enjoy 100% free cinematic streaming with multi-source playback, instant watchlists, personalized recommendations, and watch parties. Zero logins, zero hassle.
        </p>

        <div className="space-y-2.5 mb-8 text-left text-xs text-muted-foreground bg-secondary/30 rounded-xl p-4 border border-border/30">
          <div className="flex items-center gap-2 text-foreground font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Instant access to 50,000+ Movies & Shows</span>
          </div>
          <div className="flex items-center gap-2 text-foreground font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>30+ High-Speed Streaming Sources</span>
          </div>
          <div className="flex items-center gap-2 text-foreground font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>Local Watchlist & Resume Playback Sync</span>
          </div>
        </div>

        <Link
          href="/"
          className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition shadow-lg shadow-primary/20"
        >
          <Play className="w-4 h-4 fill-current" />
          Start Watching Now
        </Link>
      </div>
    </div>
  );
}
