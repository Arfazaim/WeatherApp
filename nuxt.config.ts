// nuxt.config.ts
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },

  srcDir: 'app',

  modules: [
    '@nuxt/ui',
    '@vercel/analytics'
  ],

  css: [
    '~/assets/css/main.css'
  ],

  // SPA mode — deploy sebagai file statis di Vercel
  ssr: false,

  nitro: {
    // vercel-static = generate file HTML/JS statis, TIDAK ada serverless function
    preset: 'vercel-static',
  },

  runtimeConfig: {
    public: {
      // Set di Vercel Dashboard: Environment Variables
      // Nama variabel: NUXT_PUBLIC_WEATHER_API_KEY
      weatherApiKey: '',
      defaultCity: 'Surakarta',
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
