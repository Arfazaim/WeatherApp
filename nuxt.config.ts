export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  srcDir: 'app',

  modules: [
    '@nuxt/icon',
    '@nuxt/ui',
    '@vercel/analytics'
  ],

  css: [
    '~/assets/css/main.css'
  ],

  // SSR false untuk performa optimal di Vercel (SPA mode)
  ssr: false,

  // Konfigurasi untuk Vercel deployment
  nitro: {
    preset: 'vercel'
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
