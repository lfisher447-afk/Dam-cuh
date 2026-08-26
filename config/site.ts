export type SiteConfig = typeof siteConfig

export const siteConfig = {
  name: 'DAM',
  description:
    'DAM is an editorial movie and television discovery library for viewers who want the next title worth their attention.',

  // Author and creator information
  author: {
    name: 'Mohamed Gado',
    email: 'boogado@yahoo.com',
    website: 'https://www.mohamedgado.com/',
    twitter: '@Sadge1996',
  },

  // Theme and visual configuration
  theme: {
    colors: {
      light: '#ffffff',
      dark: '#000000',
      primary: '#e2a23b',
      tile: '#16120b',
    },
  },

  // SEO and metadata configuration
  seo: {
    locale: 'en_US',
    alternateLocales: ['en_GB', 'en_CA'],
    category: 'entertainment',
    generator: 'Next.js',
    applicationName: 'DAM',
    publisher: 'DAM',
    referrer: 'origin-when-cross-origin',
    colorScheme: 'dark light',
  },

  // Open Graph enhanced configuration
  openGraph: {
    locale: 'en_US',
    type: 'website',
    siteName: 'DAM',
    ttl: 604800, // 7 days
  },

  // Twitter card configuration
  twitter: {
    card: 'summary_large_image',
    creator: '@Sadge1996',
    site: '@Sadge1996',
  },

  // Progressive Web App configuration
  pwa: {
    capable: true,
    statusBarStyle: 'black-translucent',
    manifestPath: '/manifest.webmanifest',
  },

  // Icons configuration
  icons: {
    browserConfig: '/browserconfig.xml',
  },

  // Performance optimization
  performance: {
    preconnectDomains: [
      'https://image.tmdb.org',
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
    ],
    dnsPrefetchDomains: [
      '//www.googletagmanager.com',
      '//www.google-analytics.com',
    ],
  },

  // Security configuration
  security: {
    contentSecurityPolicy: "default-src 'self'",
    formatDetection: 'telephone=no',
  },

  // Structured data for JSON-LD
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    searchAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: '/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  },

  mainNav: [
    {
      title: 'Home',
      href: '/',
      scroll: true,
    },
    {
      title: 'Movies',
      href: '/movies',
      scroll: true,
    },
    {
      title: 'TV Shows',
      href: '/tv-shows',
      scroll: true,
    },
    {
      title: 'Reels',
      href: '/reels',
      scroll: true,
    },
    {
      title: 'Mood',
      href: '/mood',
      scroll: true,
    },
    {
      title: 'Match Night',
      href: '/match-night',
      scroll: true,
    },
    {
      title: 'Watchlist',
      href: '/watchlist',
      scroll: true,
    },
    {
      title: 'Disclaimer',
      href: '/disclaimer',
      scroll: false,
    },
  ],
  personalLogo: '/android-chrome-512x512.png',
  links: {
    twitter: 'https://twitter.com/Sadge1996',
    github: 'https://github.com/Vette1123',
    website: 'https://www.mohamedgado.com/',
    buyMeACoffee: 'https://buymeacoffee.com/vetteotp',
    socialDownloader: 'https://www.socialdownloader.space/',
  },
  email: 'boogado@yahoo.com',
  websiteURL: process.env.NEXT_PUBLIC_BASE_URL ?? 'https://dam.vercel.app',
  twitterTag: '@Sadge1996',
  image: '/android-chrome-512x512.png',
  keywords: [
    'DAM',
    'DAM streaming library',
    'Movie Tracker',
    'TV Show Tracker',
    'Reely Live',
    'Software Engineer',
    'Frontend Engineer',
    'Web Developer',
    'React',
    'TypeScript',
    'JavaScript',
    'Node.js',
    'Mohamed Gado',
    'Gado',
    'Gado Mohamed',
    'React Developer',
    'React Engineer',
    'React.js',
    'ReactJS',
    'React Developer',
    'Next.js',
    'NextJS',
    'Next.js Developer',
    'Next.js Engineer',
  ],
}
