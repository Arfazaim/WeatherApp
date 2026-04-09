<script setup>
// --- KONFIGURASI API ---
const apiKey = '49ec4dd2219678b027f91a13c323b469'; // MASUKKAN API KEY KAMU DISINI
const city = ref('Jakarta');
const searchInput = ref('');

// --- STATE DATA ---
const weather = ref({
  name: 'Jakarta',
  main: { temp: 33, feels_like: 41, humidity: 73, pressure: 1014 },
  weather: [{ main: 'Sunny', description: 'Sebagian cerah' }],
  wind: { speed: 10 },
  sys: { country: 'ID' },
  visibility: 6000
});

// --- FETCH DATA (Real-time) ---
const fetchWeather = async () => {
  if (!apiKey) return; 
  
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&units=metric&appid=${apiKey}&lang=id`
    );
    const data = await response.json();
    if (data.cod === 200) {
      weather.value = data;
    } 
  } catch (e) {
    console.error('Gagal mengambil data cuaca');
  }
};

onMounted(() => {
  fetchWeather();
});

const handleSearch = () => {
  if (searchInput.value.trim()) {
    city.value = searchInput.value;
    fetchWeather();
    searchInput.value = '';
  }
};

// --- DATA DUMMY GENERATORS (Sesuai Referensi) ---

// 1. Daily Forecast (Horizontal)
const getNext10Days = () => {
  const result = [];
  const today = new Date();
  const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
  
  for (let i = 0; i < 8; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);
    result.push({
      day: i === 0 ? 'Hari Ini' : dayNames[nextDate.getDay()],
      date: nextDate.getDate(),
      icon: ['☀️','⛅','🌧️','⛈️'][Math.floor(Math.random()*4)],
      max: Math.floor(Math.random() * (34 - 30) + 30),
      min: Math.floor(Math.random() * (28 - 25) + 25)
    });
  }
  return result;
};
const dailyForecast = ref(getNext10Days());

// 2. Hourly Forecast (Chart Data)
const getHourlyData = () => {
  const hours = [];
  const startHour = new Date().getHours();
  for(let i=0; i<8; i++) {
    let h = (startHour + (i*3)) % 24;
    hours.push({
      time: h < 10 ? `0${h}:00` : `${h}:00`,
      temp: Math.floor(Math.random() * (33 - 27) + 27),
      icon: ['🌙','☀️','⛅','☁️'][Math.floor(Math.random()*4)]
    });
  }
  return hours;
};
const hourlyForecast = ref(getHourlyData());

// 3. Suggestions Data
const suggestions = [
  { title: 'Payung', status: 'Tidak perlu', icon: '☂️', bg: 'bg-blue-500/20' },
  { title: 'Luar Ruang', status: 'Baik', icon: '🏃', bg: 'bg-green-500/20' },
  { title: 'Pakaian', status: 'Kaos tipis', icon: '👕', bg: 'bg-purple-500/20' },
  { title: 'Indeks UV', status: 'Sedang', icon: '☀️', bg: 'bg-orange-500/20' }
];
</script>

<template>
  <div class="app-container">
    <div class="glass">

      <aside class="sidebar">
        <div class="logo">☁️</div>
        <nav>
          <span class="active">🏠</span>
          <span>📍</span>
          <span>📅</span>
          <span>⚙️</span>
        </nav>
        <div class="user-avatar">👤</div>
      </aside>

      <main class="main">
        
        <header class="topbar">
          <div class="location-info">
            <h2 class="city-name">{{ weather.name }}, {{ weather.sys.country }}</h2>
            <p class="date-info">{{ new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }) }}</p>
          </div>
          <div class="search-box">
            <input
              v-model="searchInput"
              @keyup.enter="handleSearch"
              type="text"
              placeholder="Cari kota..."
            />
            <span class="search-icon">🔍</span>
          </div>
        </header>

        <section class="grid-layout">

          <div class="card current-weather">
            <div class="weather-main">
              <div class="weather-icon-large">
                {{ weather.main.temp > 30 ? '☀️' : (weather.main.temp > 25 ? '⛅' : '🌧️') }}
              </div>
              <div class="temp-info">
                <div class="main-temp">{{ Math.round(weather.main.temp) }}°C</div>
                <div class="desc">{{ weather.weather[0].description }}</div>
                <div class="feels-like">Terasa seperti {{ Math.round(weather.main.feels_like) }}°</div>
              </div>
            </div>
            
            <div class="weather-details">
              <div class="detail-item">
                <span class="label">Angin</span>
                <span class="value">{{ weather.wind.speed }} km/j</span>
              </div>
              <div class="detail-item">
                <span class="label">Lembap</span>
                <span class="value">{{ weather.main.humidity }}%</span>
              </div>
              <div class="detail-item">
                <span class="label">Jarak Pandang</span>
                <span class="value">{{ weather.visibility / 1000 }} km</span>
              </div>
              <div class="detail-item">
                <span class="label">Tekanan</span>
                <span class="value">{{ weather.main.pressure }} mb</span>
              </div>
            </div>
          </div>

          <div class="card map-card">
            <div class="map-overlay">
              <span>Buka Peta 🗺️</span>
            </div>
            <iframe
              width="100%"
              height="100%"
              frameborder="0"
              style="border:0; filter: contrast(1.2) opacity(0.7);"
              :src="`https://maps.google.com/maps?q=$?q=${city}&t=p&z=10&ie=UTF8&iwloc=&output=embed`"
              allowfullscreen
            ></iframe>
          </div>

          <div class="card sun-card">
            <h4>Matahari / Bulan</h4>
            <div class="sun-graphic">
              <div class="arc">
                <div class="sun-position">☀️</div>
              </div>
              <div class="sun-times">
                <span>Terbit<br>05:55</span>
                <span>Terbenam<br>17:43</span>
              </div>
            </div>
          </div>

          <div class="daily-wrapper">
            <h4>Prakiraan 8 Hari</h4>
            <div class="daily-scroll">
              <div v-for="(day, idx) in dailyForecast" :key="idx" class="daily-item" :class="{ 'active': idx === 0 }">
                <span class="d-day">{{ day.day }}</span>
                <span class="d-date">{{ day.date }}</span>
                <span class="d-icon">{{ day.icon }}</span>
                <div class="d-temps">
                  <span class="max">{{ day.max }}°</span>
                  <span class="min">{{ day.min }}°</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card chart-card">
            <div class="chart-header">
              <h4>Grafik Temperatur</h4>
              <span>Ringkasan Hari Ini</span>
            </div>
            
            <div class="chart-container">
              <svg viewBox="0 0 500 150" preserveAspectRatio="none" class="chart-svg">
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="rgba(255, 165, 0, 0.5)" />
                    <stop offset="100%" stop-color="rgba(255, 165, 0, 0)" />
                  </linearGradient>
                </defs>
                <path d="M0,100 C50,80 100,120 150,90 C200,60 250,40 300,70 C350,100 400,60 450,80 C480,90 500,100 500,150 L0,150 Z" fill="url(#chartGrad)" />
                <path d="M0,100 C50,80 100,120 150,90 C200,60 250,40 300,70 C350,100 400,60 450,80 C480,90 500,100" fill="none" stroke="#FFA500" stroke-width="3" />
              </svg>
              
              <div class="chart-labels">
                <div v-for="(h, idx) in hourlyForecast" :key="idx" class="chart-point" :style="{ left: (idx * 12.5) + '%' }">
                  <span class="cp-temp">{{ h.temp }}°</span>
                  <span class="cp-icon">{{ h.icon }}</span>
                  <span class="cp-time">{{ h.time }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="card suggestions-card">
            <h4>Saran hari ini</h4>
            <div class="suggestions-grid">
              <div v-for="item in suggestions" :key="item.title" class="sug-item">
                <div class="sug-icon">{{ item.icon }}</div>
                <div class="sug-info">
                  <span class="sug-title">{{ item.title }}</span>
                  <span class="sug-status">{{ item.status }}</span>
                </div>
              </div>
            </div>
            <div class="more-link">Lihat selengkapnya ></div>
          </div>

        </section>
      </main>
    </div>
  </div>
</template>

<style scoped>
/* --- RESET & LAYOUT --- */
.app-container {
  width: 100vw;
  height: 100vh;
  /* Warna Background Deep Blue sesuai referensi */
  background: #1e3a8a; 
  background: linear-gradient(135deg, #1e3a8a, #172554);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: white;
  display: flex;
  overflow: hidden;
}

.glass {
  width: 100%;
  height: 100%;
  display: flex;
}

/* --- SIDEBAR --- */
.sidebar {
  width: 70px;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0;
  gap: 40px;
  z-index: 10;
}
.logo { font-size: 24px; margin-bottom: 20px; }
.sidebar nav { display: flex; flex-direction: column; gap: 30px; }
.sidebar nav span { font-size: 20px; opacity: 0.5; cursor: pointer; transition: 0.3s; }
.sidebar nav span:hover, .sidebar nav span.active { opacity: 1; transform: scale(1.1); }
.user-avatar { margin-top: auto; font-size: 24px; opacity: 0.8; cursor: pointer; }

/* --- MAIN CONTENT --- */
.main {
  flex: 1;
  padding: 20px 40px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* --- TOPBAR --- */
.topbar { display: flex; justify-content: space-between; align-items: flex-end; }
.city-name { font-size: 18px; font-weight: 600; margin: 0; }
.date-info { font-size: 13px; opacity: 0.7; margin: 0; }

.search-box {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 8px 15px;
  display: flex;
  align-items: center;
  width: 300px;
}
.search-box input {
  background: transparent; border: none; outline: none; color: white; width: 100%;
}
.search-box input::placeholder { color: rgba(255,255,255,0.5); }

/* --- GRID LAYOUT --- */
.grid-layout {
  display: grid;
  /* Kolom: Current(1.5), Map(1), Sun(1) */
  grid-template-columns: 1.5fr 1fr 1fr;
  /* Baris: Top, Middle (Daily), Bottom (Chart/Sugg) */
  grid-template-rows: auto auto 1fr; 
  gap: 20px;
  padding-bottom: 20px;
}

/* Common Card Style */
.card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 20px;
  backdrop-filter: blur(10px);
}

/* 1. CURRENT WEATHER */
.current-weather {
  grid-column: 1 / 2;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.3), rgba(37, 99, 235, 0.1));
}
.weather-main { display: flex; align-items: center; gap: 20px; margin-bottom: 20px; }
.weather-icon-large { font-size: 64px; filter: drop-shadow(0 0 10px rgba(255,255,0,0.3)); }
.main-temp { font-size: 56px; font-weight: bold; line-height: 1; }
.desc { font-size: 18px; font-weight: 500; text-transform: capitalize; }
.feels-like { font-size: 14px; opacity: 0.7; }

.weather-details { display: flex; justify-content: space-between; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px; }
.detail-item { display: flex; flex-direction: column; gap: 4px; }
.detail-item .label { font-size: 12px; opacity: 0.6; }
.detail-item .value { font-size: 14px; font-weight: 600; }

/* 2. MAP CARD */
.map-card {
  grid-column: 2 / 3;
  padding: 0 !important;
  overflow: hidden;
  position: relative;
}
.map-overlay {
  position: absolute; bottom: 10px; right: 10px;
  background: rgba(0,0,0,0.6); padding: 5px 10px;
  border-radius: 10px; font-size: 12px; z-index: 5; pointer-events: none;
}

/* 3. SUN CARD */
.sun-card {
  grid-column: 3 / 4;
  display: flex; flex-direction: column;
}
.sun-card h4 { font-size: 14px; margin: 0 0 10px 0; opacity: 0.7; }
.sun-graphic {
  flex: 1; position: relative; display: flex; flex-direction: column; justify-content: center;
}
.arc {
  width: 100%; height: 80px;
  border-top: 2px dashed rgba(255,255,255,0.3);
  border-radius: 50% 50% 0 0;
  position: relative;
}
.sun-position {
  position: absolute; top: -12px; left: 30%; /* Simulasi posisi */
  font-size: 20px;
  filter: drop-shadow(0 0 5px yellow);
}
.sun-times { display: flex; justify-content: space-between; font-size: 11px; margin-top: 10px; opacity: 0.8; }

/* 4. DAILY FORECAST (Middle Row) */
.daily-wrapper {
  grid-column: 1 / -1; /* Full Width */
}
.daily-wrapper h4 { font-size: 14px; margin-bottom: 10px; opacity: 0.7; text-transform: uppercase; }
.daily-scroll {
  display: flex; gap: 15px; overflow-x: auto; padding-bottom: 5px; scrollbar-width: none;
}
.daily-item {
  background: rgba(255,255,255,0.05);
  min-width: 100px;
  padding: 15px;
  border-radius: 15px;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  cursor: pointer; transition: 0.2s;
}
.daily-item:hover, .daily-item.active { background: rgba(255,255,255,0.15); transform: translateY(-3px); }
.d-day { font-size: 14px; font-weight: 600; }
.d-date { font-size: 12px; opacity: 0.6; }
.d-icon { font-size: 24px; }
.d-temps { font-size: 13px; display: flex; gap: 8px; }
.d-temps .max { font-weight: bold; }
.d-temps .min { opacity: 0.6; }

/* 5. CHART CARD (Bottom Left) */
.chart-card {
  grid-column: 1 / 3;
  display: flex; flex-direction: column;
}
.chart-header { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 14px; }
.chart-container { position: relative; height: 150px; flex: 1; }
.chart-svg { width: 100%; height: 100%; }
.chart-labels { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }
.chart-point {
  position: absolute; bottom: 0;
  display: flex; flex-direction: column; align-items: center;
  transform: translateX(-50%);
}
.cp-temp { font-size: 12px; font-weight: bold; margin-bottom: 80px; /* Offset dari bawah */ }
.cp-icon { position: absolute; bottom: 50px; font-size: 16px; }
.cp-time { position: absolute; bottom: -5px; font-size: 11px; opacity: 0.6; }

/* 6. SUGGESTIONS (Bottom Right) */
.suggestions-card {
  grid-column: 3 / 4;
  display: flex; flex-direction: column; gap: 15px;
}
.suggestions-card h4 { font-size: 14px; margin: 0; opacity: 0.7; }
.suggestions-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; flex: 1; }
.sug-item {
  background: rgba(255,255,255,0.03);
  border-radius: 15px;
  padding: 10px;
  display: flex; flex-direction: column; gap: 5px;
}
.sug-icon { font-size: 20px; }
.sug-title { font-size: 11px; opacity: 0.6; }
.sug-status { font-size: 13px; font-weight: 600; }
.more-link { font-size: 12px; text-align: right; opacity: 0.6; cursor: pointer; margin-top: auto; }

</style>