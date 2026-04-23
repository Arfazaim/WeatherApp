export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  srcDir: 'app',

  modules: [
    // '@nuxt/icon' DIHAPUS — tidak dipakai & menyebabkan ERR_MODULE_NOT_FOUND di Vercel
    '@nuxt/ui',
    '@vercel/analytics'
  ],

  css: [
    '~/assets/css/main.css'
  ],

  // SPA mode — tidak ada serverless function, deploy sebagai static files
  ssr: false,

  // 'vercel-static' = output statis, TIDAK membuat serverless functions
  // Cocok karena ssr: false. Pakai 'vercel' hanya jika SSR aktif.
  nitro: {
    preset: 'vercel-static'
  },

  // Runtime config untuk API key (lebih aman)
  runtimeConfig: {
    public: {
      openWeatherApiKey: process.env.NUXT_PUBLIC_OPENWEATHER_API_KEY || ''
    }
  },

  app: {
    head: {
      title: 'WeatherApp — Cuaca Real-time',
      meta: [
        { name: 'description', content: 'Aplikasi cuaca real-time dengan tampilan modern liquid glass' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0a0f1e' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
      ]
    }
  },

  compatibilityDate: '2026-01-28'
})
