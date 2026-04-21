# 🌤️ WeatherApp — Liquid Glass Edition

Aplikasi cuaca real-time dengan tampilan **Liquid Glass** modern dan background foto dinamis berdasarkan kondisi cuaca.

## ✨ Fitur
- 🌅 **Background foto dinamis** — berubah sesuai cuaca (cerah, hujan, mendung, salju, dll)
- 🫧 **Liquid Glass UI** — efek kaca transparan modern dengan backdrop blur
- 🌡️ **Data cuaca real-time** dari OpenWeatherMap API
- ⏰ **Prakiraan per jam** dengan grafik temperatur
- 📅 **Prakiraan 7 hari** dengan probability hujan
- ☀️ **Arc matahari** dengan posisi real-time (sunrise/sunset)
- 📱 **Responsive** — mobile, tablet, desktop

## 🚀 Setup & Deploy

### 1. Install dependencies
```bash
npm install
```

### 2. Setup API Key
Buat file `.env` di root project:
```env
NUXT_PUBLIC_OPENWEATHER_API_KEY=api_key_kamu_disini
```
> Daftar gratis di [openweathermap.org/api](https://openweathermap.org/api)

### 3. Development
```bash
npm run dev
```

### 4. Deploy ke Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Atau push ke GitHub dan connect di vercel.com
```

Di Vercel dashboard, tambahkan **Environment Variable**:
- Key: `NUXT_PUBLIC_OPENWEATHER_API_KEY`
- Value: API key kamu

## 🛠️ Tech Stack
- **Nuxt 4** + Vue 3
- **Tailwind CSS** via `@nuxt/ui`
- **OpenWeatherMap API** (free tier)
- **Unsplash** (background photos, no auth needed)
- **@vercel/analytics** untuk tracking
