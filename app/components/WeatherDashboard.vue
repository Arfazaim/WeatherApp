<script setup>
// ─── API CONFIG ───────────────────────────────────────────────────────────────
const apiKey = '49ec4dd2219678b027f91a13c323b469'
const city = ref('Surakarta')
const searchInput = ref('')
const isLoading = ref(false)

const weather = ref({
  name: 'Surakarta',
  dt: Math.floor(Date.now() / 1000),
  main: { temp: 33, feels_like: 41, humidity: 73, pressure: 1014, temp_max: 36, temp_min: 29 },
  weather: [{ id: 800, main: 'Clear', description: 'Cerah' }],
  wind: { speed: 10, deg: 220 },
  sys: { country: 'ID', sunrise: 1718153400, sunset: 1718196600 },
  visibility: 10000
})

const fetchWeather = async () => {
  if (!apiKey) return
  isLoading.value = true
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&units=metric&appid=${apiKey}&lang=id`
    )
    const data = await res.json()
    if (data.cod === 200) weather.value = data
  } catch (e) {
    console.error('Gagal mengambil data cuaca', e)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => fetchWeather())

const handleSearch = () => {
  if (searchInput.value.trim()) {
    city.value = searchInput.value.trim()
    fetchWeather()
    searchInput.value = ''
  }
}

// ─── BACKGROUND PHOTOS ────────────────────────────────────────────────────────
const BG = {
  thunderstorm: 'photo-1605727216801-e27ce1d0cc28',
  drizzle:      'photo-1428592953211-077101b2021b',
  rain:         'photo-1534088568595-a066f410bcda',
  snow:         'photo-1491002052546-bf38f186af56',
  fog:          'photo-1506905925346-21bda4d32df4',
  clearDay:     'photo-1501854140801-50d01698950b',
  clearNight:   'photo-1475924156734-496f6cac6ec1',
  cloudsDay:    'photo-1534274988757-a28bf1a57c17',
  cloudsNight:  'photo-1508193638397-1c4234db14d8',
}
const px = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1920&q=80`

const isNight = computed(() => {
  const now = weather.value.dt || Date.now() / 1000
  const rise = weather.value.sys?.sunrise || 21600
  const set  = weather.value.sys?.sunset  || 64800
  return now < rise || now > set
})

const bgPhoto = computed(() => {
  const id = weather.value.weather[0]?.id ?? 800
  if (id >= 200 && id < 300) return px(BG.thunderstorm)
  if (id >= 300 && id < 400) return px(BG.drizzle)
  if (id >= 500 && id < 600) return px(BG.rain)
  if (id >= 600 && id < 700) return px(BG.snow)
  if (id >= 700 && id < 800) return px(BG.fog)
  if (id === 800) return px(isNight.value ? BG.clearNight : BG.clearDay)
  return px(isNight.value ? BG.cloudsNight : BG.cloudsDay)
})

const theme = computed(() => {
  const id = weather.value.weather[0]?.id ?? 800
  if (id >= 200 && id < 300) return 'rgba(10,5,35,0.62)'
  if (id >= 300 && id < 600) return 'rgba(5,15,45,0.58)'
  if (id >= 600 && id < 700) return 'rgba(15,30,65,0.48)'
  if (id >= 700 && id < 800) return 'rgba(20,25,40,0.62)'
  if (id === 800) return isNight.value ? 'rgba(5,8,28,0.55)' : 'rgba(8,20,55,0.38)'
  return isNight.value ? 'rgba(8,12,35,0.55)' : 'rgba(10,25,60,0.45)'
})

const wxIcon = computed(() => {
  const id = weather.value.weather[0]?.id ?? 800
  if (id >= 200 && id < 300) return '⛈️'
  if (id >= 300 && id < 400) return '🌦️'
  if (id >= 500 && id < 600) return '🌧️'
  if (id >= 600 && id < 700) return '❄️'
  if (id >= 700 && id < 800) return '🌫️'
  if (id === 800) return isNight.value ? '🌙' : '☀️'
  if (id <= 802) return '⛅'
  return '☁️'
})

const windDir = computed(() => {
  const dirs = ['U','TL','T','TG','S','BD','B','BL']
  return dirs[Math.round((weather.value.wind?.deg ?? 0) / 45) % 8]
})

const fmt = (unix) => unix
  ? new Date(unix * 1000).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false })
  : '--:--'

const hourly = computed(() => {
  const base = weather.value.main.temp
  const icons = ['☀️','⛅','🌤️','☁️']
  return Array.from({ length: 9 }, (_, i) => {
    const h = (new Date().getHours() + i) % 24
    return {
      time: i === 0 ? 'Skrg' : `${String(h).padStart(2,'0')}:00`,
      temp: Math.round(base + Math.sin(i * 0.9) * 2.5),
      icon: i === 0 ? wxIcon.value : icons[Math.floor(Math.random() * 3)]
    }
  })
})

const daily = computed(() => {
  const dayNames = ['Min','Sen','Sel','Rab','Kam','Jum','Sab']
  const icons = ['☀️','⛅','🌧️','⛈️','🌤️','❄️']
  const base = weather.value.main.temp
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i)
    return {
      day:  i === 0 ? 'Hari Ini' : dayNames[d.getDay()],
      icon: i === 0 ? wxIcon.value : icons[Math.floor(Math.random() * icons.length)],
      max:  Math.round(base + Math.random() * 4 + 1),
      min:  Math.round(base - Math.random() * 5 - 2),
      rain: Math.floor(Math.random() * 85)
    }
  })
})

const suggestions = computed(() => {
  const id = weather.value.weather[0]?.id ?? 800
  const wet = id >= 200 && id < 600
  const temp = weather.value.main.temp
  return [
    { icon:'☂️', title:'Payung',         status: wet ? 'Bawa payung!'      : 'Tidak perlu',          ok: !wet },
    { icon:'🏃', title:'Olahraga luar',  status: wet ? 'Tidak ideal'       : 'Bagus sekali',          ok: !wet },
    { icon:'👕', title:'Pakaian',        status: temp>30 ? 'Tipis & ringan': temp>20 ? 'Kasual'  : 'Pakaian hangat', ok: true },
    { icon:'🔆', title:'Indeks UV',      status: id===800 ? 'Tinggi — pakai sunblock' : id>800 ? 'Sedang' : 'Rendah', ok: id!==800 },
  ]
})

const chart = computed(() => {
  const temps = hourly.value.map(h => h.temp)
  const lo = Math.min(...temps) - 1
  const hi = Math.max(...temps) + 1
  const W = 500, H = 80
  const pts = temps.map((t, i) => [
    (i / (temps.length - 1)) * W,
    H - ((t - lo) / (hi - lo)) * H
  ])
  const path = pts.map((p, i, arr) => {
    if (i === 0) return `M${p[0]},${p[1]}`
    const prev = arr[i-1]
    const cpx = (prev[0] + p[0]) / 2
    return `C${cpx},${prev[1]} ${cpx},${p[1]} ${p[0]},${p[1]}`
  }).join(' ')
  return { line: path, area: path + ` L${W},${H} L0,${H} Z`, pts }
})

const sunPos = computed(() => {
  const now  = weather.value.dt || Date.now() / 1000
  const rise = weather.value.sys?.sunrise || 21600
  const set  = weather.value.sys?.sunset  || 64800
  const pct  = Math.max(0, Math.min(1, (now - rise) / (set - rise)))
  const angle = Math.PI * pct
  const x = 100 - 88 * Math.cos(angle)
  const y = 100 - 88 * Math.sin(angle)
  return { x: x.toFixed(1), y: y.toFixed(1), pct }
})
</script>

<template>
  <div class="app">
    <Transition name="bg">
      <div class="bg-photo" :key="bgPhoto" :style="{ backgroundImage: `url('${bgPhoto}')` }" />
    </Transition>
    <div class="bg-overlay" :style="{ background: theme }" />
    <div class="bg-grain" />
    <div v-if="isLoading" class="loading-bar" />

    <div class="wrap">

      <!-- TOP BAR -->
      <header class="glass topbar">
        <div class="loc">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M20 10c0 6-8 13-8 13S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>{{ weather.name }}, {{ weather.sys?.country }}</span>
        </div>
        <p class="topbar-date">{{ new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'}) }}</p>
        <div class="search-box">
          <input v-model="searchInput" @keyup.enter="handleSearch" type="text" placeholder="Cari kota…" />
          <button @click="handleSearch">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </button>
        </div>
      </header>

      <!-- GRID -->
      <div class="grid">

        <!-- HERO -->
        <div class="glass card-hero">
          <span class="wx-icon">{{ wxIcon }}</span>
          <div class="hero-temp">{{ Math.round(weather.main.temp) }}<sup>°C</sup></div>
          <p class="hero-desc">{{ weather.weather[0]?.description }}</p>
          <p class="hero-feels">Terasa seperti <strong>{{ Math.round(weather.main.feels_like) }}°</strong></p>
          <div class="hero-range">
            <span>↑ {{ Math.round(weather.main.temp_max ?? weather.main.temp + 2) }}°</span>
            <span class="sep">·</span>
            <span>↓ {{ Math.round(weather.main.temp_min ?? weather.main.temp - 3) }}°</span>
          </div>
        </div>

        <!-- STATS -->
        <div class="glass card-stats">
          <p class="clabel">Detail Cuaca</p>
          <div class="stats-grid">
            <div class="stat">
              <div class="stat-top"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" stroke-width="2"><path d="M12 2a7 7 0 0 1 7 7c0 5.25-7 13-7 13S5 14.25 5 9a7 7 0 0 1 7-7Z"/><circle cx="12" cy="9" r="2.5"/></svg><span class="slbl">Kelembapan</span></div>
              <span class="sval">{{ weather.main.humidity }}<small>%</small></span>
              <div class="hbar"><div :style="{width: weather.main.humidity+'%'}" /></div>
            </div>
            <div class="stat">
              <div class="stat-top"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#86efac" stroke-width="2"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg><span class="slbl">Angin</span></div>
              <span class="sval">{{ weather.wind?.speed }}<small> m/s</small></span>
              <span class="ssub">Arah {{ windDir }}</span>
            </div>
            <div class="stat">
              <div class="stat-top"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#fcd34d" stroke-width="2"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg><span class="slbl">Jarak Pandang</span></div>
              <span class="sval">{{ ((weather.visibility??10000)/1000).toFixed(1) }}<small> km</small></span>
            </div>
            <div class="stat">
              <div class="stat-top"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#f9a8d4" stroke-width="2"><path d="M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0Z"/></svg><span class="slbl">Tekanan</span></div>
              <span class="sval">{{ weather.main.pressure }}<small> hPa</small></span>
            </div>
          </div>
        </div>

        <!-- SUN -->
        <div class="glass card-sun">
          <p class="clabel">Matahari</p>
          <div class="arc-wrap">
            <svg viewBox="0 0 200 110" class="arc-svg">
              <defs>
                <linearGradient id="ag" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#f97316" stop-opacity=".4"/>
                  <stop offset="50%" stop-color="#facc15" stop-opacity=".9"/>
                  <stop offset="100%" stop-color="#f97316" stop-opacity=".4"/>
                </linearGradient>
                <filter id="glow"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
              </defs>
              <path d="M12,100 A88,88 0 0,1 188,100" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="2.5" stroke-dasharray="5,4"/>
              <path d="M12,100 A88,88 0 0,1 188,100" fill="none" stroke="url(#ag)" stroke-width="2.5" :stroke-dasharray="`${sunPos.pct*278} 300`"/>
              <line x1="8" y1="102" x2="192" y2="102" stroke="rgba(255,255,255,0.15)" stroke-width="1"/>
              <circle :cx="sunPos.x" :cy="sunPos.y" r="8" fill="#facc15" filter="url(#glow)" opacity=".95"/>
              <circle :cx="sunPos.x" :cy="sunPos.y" r="3.5" fill="white"/>
            </svg>
          </div>
          <div class="sun-times">
            <div class="sun-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
              <div><div class="sun-lbl">Terbit</div><div class="sun-val">{{ fmt(weather.sys?.sunrise) }}</div></div>
            </div>
            <div class="sun-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#f87171" stroke-width="2"><path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>
              <div><div class="sun-lbl">Terbenam</div><div class="sun-val">{{ fmt(weather.sys?.sunset) }}</div></div>
            </div>
          </div>
        </div>

        <!-- HOURLY -->
        <div class="glass card-hourly">
          <div class="row-bw"><p class="clabel">Prakiraan Per Jam</p><span class="tag">Hari ini</span></div>
          <div class="hourly-scroll">
            <div v-for="(h,i) in hourly" :key="i" class="hi" :class="{now:i===0}">
              <span class="ht">{{ h.time }}</span>
              <span class="hic">{{ h.icon }}</span>
              <span class="hv">{{ h.temp }}°</span>
            </div>
          </div>
          <div class="mini-chart">
            <svg viewBox="0 0 500 80" preserveAspectRatio="none" class="csvg">
              <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="rgba(255,255,255,0.25)"/><stop offset="100%" stop-color="rgba(255,255,255,0)"/></linearGradient></defs>
              <path :d="chart.area" fill="url(#cg)"/>
              <path :d="chart.line" fill="none" stroke="rgba(255,255,255,0.75)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              <circle v-for="(pt,i) in chart.pts" :key="i" :cx="pt[0]" :cy="pt[1]" r="3.5" fill="white" opacity=".7"/>
            </svg>
          </div>
        </div>

        <!-- DAILY -->
        <div class="glass card-daily">
          <p class="clabel">7 Hari ke Depan</p>
          <div class="daily-list">
            <div v-for="(d,i) in daily" :key="i" class="dr" :class="{today:i===0}">
              <span class="dr-day">{{ d.day }}</span>
              <span class="dr-ic">{{ d.icon }}</span>
              <span class="dr-rain"><svg width="9" height="9" viewBox="0 0 24 24" fill="#7dd3fc"><path d="M12 2C6 9 4 13 4 16a8 8 0 0 0 16 0c0-3-2-7-8-14Z"/></svg>{{ d.rain }}%</span>
              <div class="dr-bw"><div class="dr-b"><div class="dr-f" :style="{width:Math.min(100,(d.max-d.min)*5)+'%'}"/></div></div>
              <span class="dr-lo">{{ d.min }}°</span>
              <span class="dr-hi">{{ d.max }}°</span>
            </div>
          </div>
        </div>

        <!-- SUGGESTIONS -->
        <div class="glass card-sugg">
          <p class="clabel">Saran Hari Ini</p>
          <div class="sugg-list">
            <div v-for="s in suggestions" :key="s.title" class="si">
              <div class="si-ic" :class="{ok:s.ok,warn:!s.ok}">{{ s.icon }}</div>
              <div class="si-body">
                <span class="si-t">{{ s.title }}</span>
                <span class="si-s" :class="{ok:s.ok,warn:!s.ok}">{{ s.status }}</span>
              </div>
              <div class="si-b" :class="{ok:s.ok,warn:!s.ok}">
                <svg v-if="s.ok" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                <svg v-else width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><line x1="12" y1="5" x2="12" y2="12"/><circle cx="12" cy="17" r="1.5" fill="currentColor" stroke="none"/></svg>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

.app{width:100vw;min-height:100vh;font-family:'Sora',system-ui,sans-serif;color:#fff;position:relative;overflow-x:hidden}

/* BG */
.bg-photo{position:fixed;inset:0;background-size:cover;background-position:center;z-index:0}
.bg-enter-active,.bg-leave-active{transition:opacity 1.8s ease}
.bg-enter-from,.bg-leave-to{opacity:0}
.bg-overlay{position:fixed;inset:0;z-index:1;transition:background 2s ease;background-image:radial-gradient(ellipse at center,transparent 40%,rgba(0,0,0,.32) 100%)!important}
.bg-grain{position:fixed;inset:0;z-index:2;pointer-events:none;opacity:.45;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='.05'/%3E%3C/svg%3E")}

/* LOADING */
.loading-bar{position:fixed;top:0;left:0;right:0;height:2px;z-index:9999;background:linear-gradient(90deg,transparent,rgba(255,255,255,.9),transparent);background-size:60% 100%;animation:sh 1.4s infinite}
@keyframes sh{from{background-position:-100% 0}to{background-position:200% 0}}

/* GLASS */
.glass{background:rgba(255,255,255,.07);backdrop-filter:blur(28px) saturate(180%);-webkit-backdrop-filter:blur(28px) saturate(180%);border:1px solid rgba(255,255,255,.16);border-radius:24px;box-shadow:0 4px 24px rgba(0,0,0,.22),inset 0 1.5px 0 rgba(255,255,255,.22),inset 0 -1px 0 rgba(0,0,0,.12);transition:transform .25s ease,box-shadow .25s ease}
.glass:hover{transform:translateY(-2px);box-shadow:0 8px 36px rgba(0,0,0,.3),inset 0 1.5px 0 rgba(255,255,255,.28),inset 0 -1px 0 rgba(0,0,0,.15)}

/* WRAP */
.wrap{position:relative;z-index:10;max-width:1320px;margin:0 auto;padding:20px 24px 32px;display:flex;flex-direction:column;gap:18px;min-height:100vh}

/* TOPBAR */
.topbar{display:flex;align-items:center;gap:18px;padding:13px 22px;border-radius:20px}
.loc{display:flex;align-items:center;gap:7px;font-size:14px;font-weight:600;white-space:nowrap}
.topbar-date{flex:1;text-align:center;font-size:12.5px;opacity:.52;font-weight:400}
.search-box{display:flex;align-items:center;gap:8px;background:rgba(255,255,255,.09);border:1px solid rgba(255,255,255,.13);border-radius:14px;padding:9px 14px;width:250px;transition:.2s}
.search-box:focus-within{background:rgba(255,255,255,.16);border-color:rgba(255,255,255,.3)}
.search-box input{background:transparent;border:none;outline:none;color:#fff;font-family:'Sora',sans-serif;font-size:13px;width:100%}
.search-box input::placeholder{color:rgba(255,255,255,.38)}
.search-box button{background:transparent;border:none;color:rgba(255,255,255,.62);cursor:pointer;display:flex;align-items:center;padding:0;transition:.2s}
.search-box button:hover{color:#fff;transform:scale(1.15)}

/* GRID */
.grid{display:grid;grid-template-columns:260px 1fr 1fr;grid-template-rows:auto auto auto;gap:18px}

/* HERO */
.card-hero{grid-column:1;grid-row:1/3;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:36px 24px;gap:6px;background:rgba(255,255,255,.09)}
.wx-icon{font-size:88px;display:block;filter:drop-shadow(0 0 22px rgba(255,220,60,.35));animation:float 4s ease-in-out infinite;margin-bottom:10px}
@keyframes float{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-10px) scale(1.04)}}
.hero-temp{font-size:82px;font-weight:800;line-height:1;letter-spacing:-5px;text-shadow:0 4px 20px rgba(0,0,0,.25)}
.hero-temp sup{font-size:28px;font-weight:400;letter-spacing:0;vertical-align:super;opacity:.8}
.hero-desc{font-size:17px;font-weight:500;text-transform:capitalize;opacity:.9}
.hero-feels{font-size:13px;opacity:.6}
.hero-feels strong{opacity:.9}
.hero-range{display:flex;align-items:center;gap:10px;font-size:14px;font-weight:600;background:rgba(255,255,255,.09);padding:8px 18px;border-radius:50px;margin-top:10px;border:1px solid rgba(255,255,255,.12)}
.sep{opacity:.35}

/* STATS */
.card-stats{grid-column:2;grid-row:1;padding:22px}
.clabel{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:1.2px;opacity:.43;margin-bottom:16px}
.stats-grid{display:grid;grid-template-columns:1fr 1fr;gap:11px}
.stat{background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.09);border-radius:18px;padding:15px;display:flex;flex-direction:column;gap:3px}
.stat-top{display:flex;align-items:center;gap:7px;margin-bottom:5px}
.slbl{font-size:11px;opacity:.52;font-weight:500}
.sval{font-size:24px;font-weight:700}
.sval small{font-size:13px;font-weight:400;opacity:.7}
.ssub{font-size:11px;opacity:.55}
.hbar{height:4px;background:rgba(255,255,255,.12);border-radius:2px;overflow:hidden;margin-top:7px}
.hbar div{height:100%;background:linear-gradient(90deg,#38bdf8,#818cf8);border-radius:2px;transition:width .7s ease}

/* SUN */
.card-sun{grid-column:3;grid-row:1;padding:22px}
.arc-wrap{margin:4px -4px 0}
.arc-svg{width:100%;height:90px}
.sun-times{display:flex;justify-content:space-between;margin-top:4px}
.sun-item{display:flex;align-items:center;gap:10px}
.sun-lbl{font-size:11px;opacity:.5}
.sun-val{font-size:20px;font-weight:700}

/* HOURLY */
.card-hourly{grid-column:2/4;grid-row:2;padding:22px}
.row-bw{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}
.tag{font-size:11px;font-weight:600;opacity:.5;background:rgba(255,255,255,.1);padding:4px 10px;border-radius:20px}
.hourly-scroll{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;padding-bottom:4px;margin-bottom:18px}
.hourly-scroll::-webkit-scrollbar{display:none}
.hi{flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:7px;padding:12px 14px;border-radius:16px;background:rgba(255,255,255,.055);border:1px solid rgba(255,255,255,.09);transition:.2s;cursor:default;min-width:64px}
.hi:hover{background:rgba(255,255,255,.13)}
.hi.now{background:rgba(255,255,255,.17)!important;border-color:rgba(255,255,255,.28)!important}
.ht{font-size:11px;opacity:.55;font-weight:600}
.hic{font-size:22px}
.hv{font-size:14px;font-weight:700}
.mini-chart{height:56px}
.csvg{width:100%;height:100%}

/* DAILY */
.card-daily{grid-column:1/3;grid-row:3;padding:22px}
.daily-list{display:flex;flex-direction:column;gap:2px}
.dr{display:grid;grid-template-columns:80px 28px 42px 1fr 32px 38px;align-items:center;gap:10px;padding:10px 12px;border-radius:14px;transition:.2s}
.dr:hover{background:rgba(255,255,255,.07)}
.dr.today{background:rgba(255,255,255,.09)}
.dr-day{font-size:13px;font-weight:500}
.dr-ic{font-size:18px;text-align:center}
.dr-rain{font-size:11px;color:#7dd3fc;display:flex;align-items:center;gap:3px}
.dr-bw{display:flex;align-items:center}
.dr-b{width:100%;height:4px;background:rgba(255,255,255,.1);border-radius:2px;overflow:hidden}
.dr-f{height:100%;background:linear-gradient(90deg,#38bdf8,#f97316);border-radius:2px;min-width:14px}
.dr-lo{font-size:13px;opacity:.5;text-align:right}
.dr-hi{font-size:13px;font-weight:700;text-align:right}

/* SUGGESTIONS */
.card-sugg{grid-column:3;grid-row:3;padding:22px}
.sugg-list{display:flex;flex-direction:column;gap:10px}
.si{display:flex;align-items:center;gap:12px;padding:11px 13px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.09);border-radius:16px;transition:.2s}
.si:hover{background:rgba(255,255,255,.1)}
.si-ic{font-size:22px;width:42px;height:42px;flex-shrink:0;display:flex;align-items:center;justify-content:center;border-radius:13px}
.si-ic.ok{background:rgba(52,211,153,.18)}
.si-ic.warn{background:rgba(251,146,60,.18)}
.si-body{flex:1;display:flex;flex-direction:column;gap:2px}
.si-t{font-size:11px;opacity:.55}
.si-s{font-size:12.5px;font-weight:600}
.si-s.ok{color:#6ee7b7}
.si-s.warn{color:#fcd34d}
.si-b{width:24px;height:24px;flex-shrink:0;display:flex;align-items:center;justify-content:center;border-radius:50%}
.si-b.ok{background:rgba(52,211,153,.25);color:#6ee7b7}
.si-b.warn{background:rgba(251,191,36,.25);color:#fcd34d}

/* RESPONSIVE */
@media(max-width:1100px){
  .grid{grid-template-columns:230px 1fr;grid-template-rows:auto auto auto auto}
  .card-hero{grid-column:1;grid-row:1/3}
  .card-stats{grid-column:2;grid-row:1}
  .card-sun{grid-column:2;grid-row:2}
  .card-hourly{grid-column:1/3;grid-row:3}
  .card-daily{grid-column:1;grid-row:4}
  .card-sugg{grid-column:2;grid-row:4}
}
@media(max-width:720px){
  .wrap{padding:14px 14px 24px}
  .topbar{flex-wrap:wrap}
  .topbar-date{order:3;flex:0 0 100%;text-align:left}
  .search-box{order:4;width:100%}
  .grid{grid-template-columns:1fr}
  .card-hero,.card-stats,.card-sun,.card-hourly,.card-daily,.card-sugg{grid-column:1!important;grid-row:auto!important}
  .card-hero{flex-direction:row;text-align:left;justify-content:flex-start;align-items:center;padding:20px 22px;gap:20px}
  .wx-icon{font-size:60px}
  .hero-temp{font-size:58px;letter-spacing:-3px}
}
</style>
