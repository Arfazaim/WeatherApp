// nuxt.config.ts
export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4,
  },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/icon'],
  runtimeConfig: {
    public: {
      weatherApiKey: process.env.NUXT_PUBLIC_WEATHER_API_KEY
    }
  },
  postcss: {
    plugins: {
      '@tailwindcss/postcss': {},
    },
  },
  compatibilityDate: '2026-01-23'
})