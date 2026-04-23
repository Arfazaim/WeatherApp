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

  // TAMBAHKAN INI: Memaksa Nuxt & Nitro memproses iconify
  build: {
    transpile: ['@iconify/utils']
  },

  // Perbaikan untuk Nitro agar menyertakan module ini di serverless function
  nitro: {
    preset: 'vercel',
    moduleSideEffects: ['@iconify/utils']
  },

  css: [
    '~/assets/css/main.css'
  ],

  ssr: false,

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