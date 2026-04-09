export default defineNuxtConfig({
  // Mode Nuxt 4
  future: {
    compatibilityVersion: 4,
  },

  modules: [
    // Opsional, jika kamu ingin icon dari modul nuxt
    '@nuxt/icon',
    '@nuxt/ui'
  ],

  // Path CSS yang benar (mengarah ke app/assets/css/tailwind.css)
  css: [
    '~/assets/css/tailwind.css'
  ],

  // Agar support SSR dan Client side dengan baik
  ssr: true,

  compatibilityDate: '2026-01-28'
})