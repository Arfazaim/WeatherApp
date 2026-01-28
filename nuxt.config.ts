// nuxt.config.ts
export default defineNuxtConfig({
  // Mode Nuxt 4
  future: {
    compatibilityVersion: 4,
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/icon' // Opsional, jika kamu ingin icon dari modul nuxt
  ],

  // Path CSS yang benar (mengarah ke app/assets/css/tailwind.css)
  css: [
    '~/assets/css/tailwind.css'
  ],

  // Agar support SSR dan Client side dengan baik
  ssr: true,

  compatibilityDate: '2026-01-28'
})