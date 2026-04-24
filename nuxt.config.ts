// nuxt.config.ts
export default defineNuxtConfig({
  // Mengaktifkan fitur Nuxt 4 (sesuai struktur folder 'app' kamu)
  future: {
    compatibilityVersion: 4,
  },

  // Memberitahu Nuxt bahwa source code ada di dalam folder 'app'
  srcDir: 'app',

  modules: [
    // '@nuxt/icon' DIHAPUS — tidak dipakai & menyebabkan ERR_MODULE_NOT_FOUND di Vercel
    '@nuxt/ui',
    '@vercel/analytics' //
  ],

  css: [
    '~/assets/css/main.css'
  ],

<<<<<<< Updated upstream
  // SPA mode — tidak ada serverless function, deploy sebagai static files
  ssr: false,

  // 'vercel-static' = output statis, TIDAK membuat serverless functions
  // Cocok karena ssr: false. Pakai 'vercel' hanya jika SSR aktif.
=======
  // SSR false jika kamu ingin mode SPA murni (lebih ringan untuk free tier Vercel)
  ssr: false,

  // Konfigurasi untuk Vercel (Auto-detect biasanya sudah cukup)
>>>>>>> Stashed changes
  nitro: {
    preset: 'vercel-static'
  },

  // --- PERBAIKAN DI SINI ---
  // Mapping variabel .env ke dalam aplikasi
  runtimeConfig: {
    public: {
      // Nuxt akan otomatis mengambil nilai dari NUXT_PUBLIC_WEATHER_API_KEY di .env atau Vercel
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