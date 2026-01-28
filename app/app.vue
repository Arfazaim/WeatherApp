<script setup>
const config = useRuntimeConfig();
const city = ref('Jakarta');
const searchInput = ref('');

// Fetch Data Cuaca Real-time
// Menggunakan watch agar data berubah otomatis saat variable city berubah
const { data: weather, status, refresh } = await useFetch(() => 
  `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&units=metric&appid=${config.public.weatherApiKey}&lang=id`,
  { watch: [city] }
);

const handleSearch = () => {
  if (searchInput.value.trim()) {
    city.value = searchInput.value;
    searchInput.value = '';
  }
};
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[#1e3a8a] via-[#172554] to-[#0f172a] text-white font-sans flex items-center justify-center p-4 lg:p-6">
    
    <div class="w-full max-w-[1400px] h-[90vh] bg-white/5 backdrop-blur-xl rounded-[40px] border border-white/10 shadow-2xl flex overflow-hidden ring-1 ring-white/10 relative">
      
      <div class="absolute top-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none"></div>

      <aside class="w-24 flex-shrink-0 flex flex-col items-center py-8 gap-8 border-r border-white/5 bg-white/5 z-10">
        <div class="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/50 mb-4">
          <Icon name="lucide:cloud" size="28" class="text-white" />
        </div>

        <nav class="flex flex-col gap-6 w-full px-4">
          <button class="p-3 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex justify-center transition-all hover:scale-105">
            <Icon name="lucide:layout-grid" size="24" />
          </button>
          <button class="p-3 rounded-xl hover:bg-white/5 text-white/50 hover:text-white transition flex justify-center">
            <Icon name="lucide:map" size="24" />
          </button>
          <button class="p-3 rounded-xl hover:bg-white/5 text-white/50 hover:text-white transition flex justify-center">
            <Icon name="lucide:calendar-days" size="24" />
          </button>
          <button class="p-3 rounded-xl hover:bg-white/5 text-white/50 hover:text-white transition flex justify-center">
            <Icon name="lucide:settings-2" size="24" />
          </button>
        </nav>

        <div class="mt-auto pb-4">
           <button class="p-3 rounded-xl hover:bg-red-500/20 text-white/50 hover:text-red-400 transition">
            <Icon name="lucide:log-out" size="24" />
          </button>
        </div>
      </aside>

      <main class="flex-1 flex flex-col min-w-0 z-10">
        
        <header class="flex items-center justify-between px-8 py-6 border-b border-white/5">
          <div class="relative w-full max-w-md">
            <input 
              v-model="searchInput"
              @keyup.enter="handleSearch"
              type="text" 
              placeholder="Search for cities..." 
              class="w-full bg-[#0f172a]/30 border border-white/10 rounded-full py-3 pl-12 pr-6 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:bg-[#0f172a]/50 transition placeholder:text-white/30"
            />
            <Icon name="lucide:search" class="absolute left-4 top-3.5 text-white/40" size="18" />
          </div>

          <div class="flex items-center gap-4 ml-4">
            <button class="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 hover:bg-white/10 transition">
              <Icon name="lucide:bell" class="text-white/60" size="20" />
            </button>
            <div class="flex items-center gap-3 pl-4 border-l border-white/10">
              <div class="text-right hidden sm:block">
                <p class="text-sm font-semibold">Mahasiswa IT</p>
                <p class="text-xs text-white/40">Premium User</p>
              </div>
              <div class="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-400 to-cyan-300 border-2 border-white/20"></div>
            </div>
          </div>
        </header>

        <div class="flex-1 p-6 lg:p-8 overflow-y-auto">
          
          <div v-if="status === 'pending'" class="h-full flex flex-col items-center justify-center">
             <Icon name="svg-spinners:pulse-ring" size="50" class="text-blue-400" />
             <p class="mt-4 text-white/50 animate-pulse">Menghubungkan ke satelit cuaca...</p>
          </div>

          <div v-else-if="status === 'error'" class="h-full flex flex-col items-center justify-center text-center">
             <Icon name="lucide:cloud-off" size="60" class="text-white/20 mb-4" />
             <h2 class="text-2xl font-bold text-red-400">Kota tidak ditemukan</h2>
             <p class="text-white/40 mb-6">Coba masukkan nama kota lain seperti "London" atau "Bandung".</p>
             <button @click="city='Jakarta'" class="px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition">Reset</button>
          </div>

          <div v-else class="grid grid-cols-1 md:grid-cols-12 gap-6 h-full content-start">
            
            <div class="col-span-12 md:col-span-4 bg-gradient-to-br from-blue-600/30 to-blue-900/30 border border-white/10 rounded-[32px] p-6 relative overflow-hidden group hover:border-white/20 transition">
              <div class="absolute -right-10 -top-10 w-32 h-32 bg-blue-500/40 rounded-full blur-[60px]"></div>
              
              <div class="relative z-10 flex flex-col h-full justify-between">
                <div class="flex justify-between items-start">
                  <div>
                    <h2 class="text-lg font-medium text-blue-100">Cuaca Saat Ini</h2>
                    <p class="text-sm text-blue-200/60 mt-1">Hari ini di {{ weather.name }}</p>
                  </div>
                  <div class="px-3 py-1 bg-white/10 rounded-full text-xs font-medium backdrop-blur-md border border-white/10">Live</div>
                </div>

                <div class="flex items-center gap-4 my-6">
                  <div class="bg-blue-500/20 p-2 rounded-2xl border border-white/5">
                    <img :src="`https://openweathermap.org/img/wn/${weather.weather[0].icon}@4x.png`" class="w-20 h-20 drop-shadow-lg" />
                  </div>
                  <div>
                    <div class="text-6xl font-bold tracking-tighter">{{ Math.round(weather.main.temp) }}°</div>
                    <div class="text-blue-200 capitalize font-medium">{{ weather.weather[0].description }}</div>
                  </div>
                </div>

                <div class="grid grid-cols-3 gap-2 text-center">
                  <div class="bg-[#0f172a]/40 rounded-2xl p-3 border border-white/5">
                    <Icon name="lucide:wind" class="text-white/60 mb-2" size="18" />
                    <p class="text-sm font-bold">{{ weather.wind.speed }}</p>
                    <p class="text-[10px] text-white/40 uppercase">Wind</p>
                  </div>
                  <div class="bg-[#0f172a]/40 rounded-2xl p-3 border border-white/5">
                     <Icon name="lucide:droplets" class="text-cyan-400/80 mb-2" size="18" />
                    <p class="text-sm font-bold">{{ weather.main.humidity }}%</p>
                     <p class="text-[10px] text-white/40 uppercase">Humid</p>
                  </div>
                  <div class="bg-[#0f172a]/40 rounded-2xl p-3 border border-white/5">
                     <Icon name="lucide:eye" class="text-emerald-400/80 mb-2" size="18" />
                    <p class="text-sm font-bold">{{ weather.visibility/1000 }}km</p>
                     <p class="text-[10px] text-white/40 uppercase">Vis</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-span-12 md:col-span-5 bg-[#0f172a]/30 border border-white/10 rounded-[32px] relative overflow-hidden flex items-center justify-center group cursor-pointer hover:border-white/20 transition">
              <img src="https://api.maptiler.com/maps/basic-v2/static/107.6, -6.9, 10/800x600.png?key=get_your_own" 
                   class="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition duration-700 ease-out" 
                   alt="Map Visual" />
              
              <div class="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
              
              <div class="absolute bottom-6 left-6 z-10">
                <h3 class="font-bold text-xl drop-shadow-md">Area {{ weather.name }}</h3>
                <p class="text-sm text-white/80 flex items-center gap-1 mt-1">
                  <Icon name="lucide:map-pin" size="14" /> {{ weather.coord.lat }}, {{ weather.coord.lon }}
                </p>
              </div>
              
              <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-80">
                 <h2 class="text-2xl font-bold tracking-tight drop-shadow-lg">Google Maps<span class="text-blue-400 text-xs align-top">API</span></h2>
              </div>
            </div>

            <div class="col-span-12 md:col-span-3 bg-[#0f172a]/30 border border-white/10 rounded-[32px] p-6 flex flex-col">
              <div class="flex justify-between items-center mb-6">
                <h3 class="font-semibold text-white/90">Popular Cities</h3>
                <button><Icon name="lucide:more-horizontal" class="text-white/40 hover:text-white transition" /></button>
              </div>
              
              <div class="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar">
                <div v-for="c in ['New York', 'Tokyo', 'Singapore', 'Sydney']" :key="c" 
                     class="flex items-center justify-between p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 transition cursor-pointer group">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition">
                      <Icon name="lucide:map-pin" size="14" />
                    </div>
                    <div>
                      <p class="text-sm font-medium">{{ c }}</p>
                      <p class="text-[10px] text-white/40">Cerah</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-span-12 md:col-span-4 bg-[#0f172a]/30 border border-white/10 rounded-[32px] p-6">
               <div class="flex justify-between items-center mb-6">
                 <h3 class="font-semibold text-white/90">Prakiraan Mingguan</h3>
                 <span class="text-xs text-blue-300 bg-blue-500/10 px-2 py-1 rounded-lg border border-blue-500/20">5 Hari</span>
               </div>
               
               <div class="space-y-4">
                 <div v-for="(day, index) in ['Senin', 'Selasa', 'Rabu', 'Kamis']" :key="index" class="flex items-center justify-between group">
                   <div class="flex items-center gap-3 w-24">
                     <div class="bg-white/5 p-2 rounded-lg group-hover:bg-white/10 transition">
                        <Icon name="lucide:cloud-sun" size="16" class="text-blue-300" />
                     </div>
                     <span class="text-sm text-white/70">{{ day }}</span>
                   </div>
                   
                   <div class="flex items-center gap-3 flex-1 px-4">
                     <span class="text-xs text-white/40">24°</span>
                     <div class="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                       <div class="h-full bg-gradient-to-r from-blue-600 to-cyan-400 rounded-full" :style="{ width: (60 + index * 10) + '%' }"></div>
                     </div>
                     <span class="text-xs font-bold text-white">30°</span>
                   </div>
                 </div>
               </div>
            </div>

            <div class="col-span-12 md:col-span-8 bg-[#0f172a]/30 border border-white/10 rounded-[32px] p-6 flex flex-col relative overflow-hidden">
              <div class="flex justify-between items-center z-10 mb-6">
                <h3 class="font-semibold text-white/90">Statistik Suhu (24 Jam)</h3>
                <div class="flex gap-2 bg-black/20 p-1 rounded-full border border-white/5">
                   <button class="px-4 py-1.5 bg-blue-600 rounded-full text-xs font-medium shadow-lg">Temperatur</button>
                   <button class="px-4 py-1.5 hover:bg-white/5 rounded-full text-xs text-white/50 transition">Curah Hujan</button>
                </div>
              </div>

              <div class="flex-1 flex items-end justify-between gap-3 px-2 z-10">
                 <div v-for="n in 14" :key="n" class="flex flex-col items-center gap-3 flex-1 group cursor-pointer">
                    <div class="opacity-0 group-hover:opacity-100 transition-opacity absolute -mt-8 bg-blue-600 text-[10px] px-2 py-1 rounded mb-2">
                      {{ Math.floor(Math.random() * 10 + 20) }}°C
                    </div>
                    <div 
                      class="w-full bg-gradient-to-t from-blue-500/10 via-blue-400/40 to-cyan-300/80 rounded-t-full transition-all duration-500 hover:brightness-125"
                      :style="{ height: [30, 45, 60, 50, 70, 85, 90, 65, 50, 40, 55, 75, 60, 40][n-1] + '%' }"
                    ></div>
                    <span class="text-[10px] text-white/30 font-medium">{{ n * 2 }}:00</span>
                 </div>
              </div>

              <div class="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-blue-600/10 to-transparent pointer-events-none rounded-b-[32px]"></div>
            </div>

          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<style>
/* Import Font dari Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&display=swap');
</style>