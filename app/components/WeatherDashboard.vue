<script setup>
// --- KONFIGURASI API ---
const apiKey = '49ec4dd2219678b027f91a13c323b469'; // Ganti dengan API Key OpenWeatherMap kamu
const city = ref('Jakarta');
const searchInput = ref('');

// --- STATE DATA ---
// Default data (Mockup) agar tampilan tidak rusak saat loading/error
const weather = ref({
  name: 'Jakarta',
  main: { temp: 25 },
  weather: [{ main: 'Sunny', description: 'Cerah' }],
  sys: { country: 'ID' }
});

// --- FETCH DATA (Real-time) ---
// Kita bungkus dalam try-catch agar aman
const fetchWeather = async () => {
  if (!apiKey || apiKey === 'MASUKKAN_API_KEY_DISINI') return; // Pakai data dummy jika tidak ada key
  
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&units=metric&appid=${apiKey}`
    );
    const data = await response.json();
    if (data.cod === 200) {
      weather.value = data;
    } else {
      console.warn('Kota tidak ditemukan');
    }
  } catch (e) {
    console.error('Gagal mengambil data cuaca');
  }
};

// Panggil saat pertama kali load
onMounted(() => {
  fetchWeather();
});

// Handle Search
const handleSearch = () => {
  if (searchInput.value.trim()) {
    city.value = searchInput.value;
    fetchWeather();
    searchInput.value = '';
  }
};

// Data Dummy untuk List (Karena API gratis terbatas Current Weather)
const getNext7Days = () => {
  const result = [];
  const today = new Date();
  
  // Array nama hari dalam Bahasa Indonesia
  const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  // Array nama bulan
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

  for (let i = 0; i < 7; i++) {
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + i);

    const dayName = dayNames[nextDate.getDay()];
    const dateNum = nextDate.getDate();
    const monthName = monthNames[nextDate.getMonth()];

    // Generate suhu acak (karena API gratis terbatas data harian)
    // Nanti bisa diganti real data jika punya API Key berbayar
    const randomTemp = Math.floor(Math.random() * (32 - 24 + 1)) + 24; 

    result.push({
      name: dayName,           // Contoh: Senin
      fullDate: `${dateNum} ${monthName}`, // Contoh: 29 Jan
      temp: `${randomTemp}°`
    });
  }
  return result;
};

// Panggil fungsinya
const days = ref(getNext7Days());
</script>

<template>
  <div class="app-container">
    <div class="glass">

      <aside class="sidebar">
        <div class="logo">☁️</div>
        <nav>
          <span>🏠</span>
          <span>📍</span>
          <span>📊</span>
          <span>⚙️</span>
        </nav>
      </aside>

      <main class="main">

        <header class="topbar">
          <input
            v-model="searchInput"
            @keyup.enter="handleSearch"
            type="text"
            placeholder="Search city..."
          />
          <div class="user">👤</div>
        </header>

        <section class="grid">

          <div class="card current">
            <h4>Current Stat</h4>
            <h2>{{ weather.name }}, {{ weather.sys.country }}</h2>

            <div class="temp">{{ Math.round(weather.main.temp) }}°</div>

            <p class="capitalize">{{ weather.weather[0].description }}</p>

            <div class="mini">
              <span>Min {{ Math.round(weather.main.temp - 2) }}°</span>
              <span>Max {{ Math.round(weather.main.temp + 2) }}°</span>
            </div>
          </div>

          <div class="card map">
            <iframe
              width="100%"
              height="100%"
              frameborder="0"
              style="border:0; filter: contrast(1.1) saturate(1.2);"
              :src="`https://maps.google.com/maps?q=${city}&t=&z=13&ie=UTF8&iwloc=&output=embed`"
              allowfullscreen
            ></iframe>
          </div>

          <div class="card popular">
            <h4>Popular Cities</h4>
            <ul>
              <li>Canada — Snow</li>
              <li>China — Rain</li>
              <li>Norway — Cloudy</li>
              <li>Singapore — Sunny</li>
            </ul>
          </div>

          <div class="card week">
            <h4>7 Hari Kedepan</h4>
            <div class="days">
              <div v-for="day in days" :key="day.name" class="day">
                <div class="day-info">
                  <span class="day-name">{{ day.name }}</span>
                  <span class="day-date">{{ day.fullDate }}</span>
                </div>
                <span class="day-temp">{{ day.temp }}</span>
              </div>
            </div>
          </div>

          <div class="card chart">
            <h4>Forecast</h4>
            <svg viewBox="0 0 400 120" preserveAspectRatio="none">
              <path
                d="M0 70 C50 40,100 90,150 70 C200 50,250 30,300 50 C350 70,380 40,400 50 V120 H0 Z"
                fill="url(#grad)"
              />
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stop-color="#7dd3fc" />
                  <stop offset="100%" stop-color="#0284c7" />
                </linearGradient>
              </defs>
            </svg>
            <div class="hours">
  <span v-for="h in hours" :key="h">{{ h }}</span>
</div>
          </div>

        </section>
      </main>

    </div>
  </div>
</template>

<style scoped>
/* BACKGROUND UTAMA */
.app-container {
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, #2563eb, #0ea5e9);
  display: flex;
  overflow: hidden; /* Hilangkan scrollbar browser */
  font-family: 'Inter', sans-serif;
}

/* GLASS PANEL (SEKARANG FULL SCREEN) */
.glass {
  width: 100%;
  height: 100%;
  /* Hapus border radius agar full mentok layar */
  border-radius: 0; 
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border: none; /* Hapus border pinggir */
  display: flex;
  box-shadow: none; /* Hapus shadow karena sudah full screen */
}

/* SIDEBAR */
.sidebar {
  width: 90px; /* Sedikit diperlebar agar ikon lega */
  background: rgba(255, 255, 255, 0.05);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 30px 0;
  gap: 50px;
  color: white;
  z-index: 10;
}

.logo { font-size: 28px; margin-bottom: 10px; }
.sidebar nav { display: flex; flex-direction: column; gap: 35px; font-size: 24px; cursor: pointer; }
.sidebar nav span:hover { transform: scale(1.1); transition: transform 0.2s; opacity: 1; }
.sidebar nav span { opacity: 0.7; }

/* MAIN CONTENT AREA */
.main {
  flex: 1;
  padding: 30px 40px; /* Padding isi konten */
  display: flex;
  flex-direction: column;
  gap: 30px;
  color: white;
  overflow-y: auto; /* Scroll hanya di bagian konten jika layar terlalu kecil */
  height: 100vh;
}

/* TOPBAR */
.topbar { 
  display: flex; 
  justify-content: space-between; 
  align-items: center;
  min-height: 50px; 
}

.topbar input {
  width: 400px; /* Lebih lebar */
  padding: 14px 24px;
  border-radius: 30px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  outline: none;
  background: rgba(0, 0, 0, 0.1); /* Sedikit lebih gelap agar kontras */
  color: white;
  font-size: 15px;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.topbar input:focus { 
  background: rgba(0, 0, 0, 0.2); 
  width: 420px;
  border-color: rgba(255,255,255,0.3);
}
.topbar input::placeholder { color: rgba(255, 255, 255, 0.6); }

.user {
  width: 45px; height: 45px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer;
  border: 1px solid rgba(255,255,255,0.2);
}

/* GRID LAYOUT (RESPONSIF) */
.grid {
  flex: 1;
  display: grid;
  /* Grid 3 Kolom */
  grid-template-columns: 350px 1fr 300px; 
  /* Grid 2 Baris: Atas fix, Bawah sisa space */
  grid-template-rows: minmax(300px, 1.5fr) 1fr; 
  gap: 25px;
  height: 100%; /* Paksa grid memenuhi sisa tinggi */
}

/* CARD STYLING */
.card {
  background: rgba(255, 255, 255, 0.07);
  border-radius: 24px;
  padding: 30px;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex; 
  flex-direction: column; 
  justify-content: space-between;
  backdrop-filter: blur(5px);
  transition: transform 0.2s;
}

.card:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255,255,255,0.2);
}

/* CURRENT WEATHER CARD */
.current .temp { font-size: 80px; font-weight: 700; margin: 10px 0; letter-spacing: -2px; line-height: 1; }
.current h2 { font-size: 32px; font-weight: 600; margin-bottom: 5px; }
.current h4 { font-size: 14px; text-transform: uppercase; letter-spacing: 1px; opacity: 0.6; }
.mini { display: flex; gap: 20px; font-size: 16px; opacity: 0.8; margin-top: 10px; }

/* MAP CARD (Update bagian ini) */
.map {
  /* Hapus padding agar map full memenuhi kotak */
  padding: 0 !important;
  overflow: hidden; /* Agar sudut rounded tetap terlihat */
  position: relative;
  background: rgba(0,0,0,0.2);
}

.map iframe {
  width: 100%;
  height: 100%;
  border-radius: 24px; /* Samakan dengan radius card */
  display: block;
}

/* POPULAR CITIES */
.popular ul { list-style: none; padding: 0; margin-top: 20px; display: flex; flex-direction: column; gap: 15px; }
.popular li { 
  display: flex; justify-content: space-between;
  padding-bottom: 15px; 
  border-bottom: 1px solid rgba(255, 255, 255, 0.1); 
  font-size: 15px; 
}
.popular li:last-child { border: none; }

/* WEEKDAYS UPDATE */
.days { 
  display: flex; 
  flex-direction: column; 
  gap: 12px; 
  margin-top: 20px; 
  overflow-y: auto;
  /* Sembunyikan scrollbar agar rapi */
  scrollbar-width: none; 
}

.day {
  display: flex; 
  justify-content: space-between;
  align-items: center; /* Rata tengah vertikal */
  background: rgba(255, 255, 255, 0.05);
  padding: 12px 15px;
  border-radius: 12px;
  transition: background 0.2s;
}

.day:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Container untuk Nama Hari & Tanggal */
.day-info {
  display: flex;
  flex-direction: column; /* Susun ke bawah */
  gap: 2px;
}

.day-name {
  font-size: 15px;
  font-weight: 500;
  color: white;
}

.day-date {
  font-size: 12px;
  opacity: 0.6; /* Sedikit transparan agar tidak balapan sama nama hari */
}

.day-temp {
  font-size: 16px;
  font-weight: bold;
}

/* CHART */
.chart { grid-column: span 2; position: relative; }
.hours { display: flex; justify-content: space-between; font-size: 13px; opacity: 0.7; margin-top: auto; padding-top: 10px; }

/* SVG Chart agar responsive */
.chart svg { 
  width: 100%; 
  height: 100%; 
  max-height: 200px;
  filter: drop-shadow(0px 10px 10px rgba(37, 99, 235, 0.3));
}
</style>