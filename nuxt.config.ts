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

  // SPA mode murni, deploy sebagai file statis
  ssr: false,

  nitro: {
    preset: 'vercel-static',
    // Memaksa Iconify ikut di-build biar nggak 500 error
    externals: {
      inline: ['@iconify/utils']
    }
  },

  runtimeConfig: {
    public: {
      weatherApiKey: '' 
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