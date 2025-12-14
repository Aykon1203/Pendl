<template>
  <div class="widget rounded-lg shadow bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-4">
    <div class="flex items-center justify-between mb-3">
      <h2 class="text-lg font-semibold">Snelrapport: Drukte</h2>
      <div class="text-sm text-gray-300">Alleen lokaal</div>
    </div>

    <div class="grid grid-cols-1 gap-3">
      <div>
        <label class="text-sm text-gray-300">Station</label>
        <input v-model="station" placeholder="bv. Gent-Sint-Pieters" class="w-full mt-1 px-3 py-2 rounded bg-gray-700 text-white" />
      </div>

      <div>
        <label class="text-sm text-gray-300">Richting (optioneel)</label>
        <input v-model="direction" placeholder="bv. Antwerpen-Centraal" class="w-full mt-1 px-3 py-2 rounded bg-gray-700 text-white" />
      </div>

      <div class="flex items-center gap-2">
        <button @click="report('low')" class="flex-1 px-3 py-2 rounded bg-green-600 hover:bg-green-700">Laag</button>
        <button @click="report('medium')" class="flex-1 px-3 py-2 rounded bg-yellow-600 hover:bg-yellow-700">Gemiddeld</button>
        <button @click="report('high')" class="flex-1 px-3 py-2 rounded bg-red-600 hover:bg-red-700">Hoog</button>
      </div>

      <div class="pt-2 border-t border-gray-700">
        <div class="flex items-center justify-between">

          <div class="ml-auto">
            <button @click="clearReports" class="px-3 py-1 rounded border border-gray-600 text-sm">Wissen</button>
          </div>
        </div>

        <ul class="mt-3 divide-y divide-gray-700 max-h-40 overflow-auto">
          <li v-for="(r, i) in recentReports" :key="r.ts + '-' + i" class="py-2 flex items-center justify-between">
            <div>
              <div class="text-sm">{{ r.station }} {{ r.direction ? '→ ' + r.direction : '' }}</div>
              <div class="text-xs text-gray-400">{{ formatTime(r.ts) }}</div>
            </div>
              <div :class="['px-3 py-1 rounded-full text-sm font-semibold', levelClass(r.level)]">
                {{ displayLevel(r.level) }}</div>
          </li>
          <li v-if="recentReports.length===0" class="py-2 text-sm text-gray-400">Nog geen meldingen — wees de eerste.</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

type Level = 'low' | 'medium' | 'high'
type Report = { station: string; direction?: string; level: Level; ts: number }

const station = ref('')
const direction = ref('')

const STORAGE_KEY = 'crowdingReports_v1'
const reports = ref<Report[]>([])

function loadReports() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    reports.value = raw ? JSON.parse(raw) : []
  } catch (e) {
    reports.value = []
  }
}

function saveReports() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(reports.value)) } catch (e) {}
}

function report(level: Level) {
  if (!station.value.trim()) {
    // minimal validation
    alert('Voer een stationnaam in')
    return
  }
  const r: Report = { station: station.value.trim(), direction: direction.value.trim() || undefined, level, ts: Date.now() }
  reports.value.unshift(r)
  // keep recent 200
  if (reports.value.length > 200) reports.value.splice(200)
  saveReports()
}

function clearReports() {
  if (!confirm('Alle lokale druktemeldingen verwijderen?')) return
  reports.value = []
  saveReports()
}

const recentReports = computed(() => reports.value.slice(0, 50))
const recentCount = computed(() => reports.value.length)

const averageScore = computed(() => {
  if (reports.value.length === 0) return 0
  const map = { low: 1, medium: 2, high: 3 }
  const sum = reports.value.reduce((s, r) => s + (map[r.level] || 0), 0)
  return sum / reports.value.length
})

const averageText = computed(() => {
  if (reports.value.length === 0) return '—'
  const avg = averageScore.value
  if (avg < 1.5) return 'Laag'
  if (avg < 2.5) return 'Gemiddeld'
  return 'Hoog'
})

const lastUpdatedText = computed(() => {
  if (reports.value.length === 0) return 'nooit'
  const ts = reports.value[0].ts
  const d = new Date(ts)
  return d.toLocaleString()
})

function levelClass(l: Level) {
  if (l === 'low') return 'bg-green-600 text-white'
  if (l === 'medium') return 'bg-yellow-600 text-black'
  return 'bg-red-600 text-white'
}

function displayLevel(l: Level) {
  if (l === 'low') return 'Laag'
  if (l === 'medium') return 'Gemiddeld'
  return 'Hoog'
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleString()
}

onMounted(() => loadReports())
</script>

<style scoped>
.widget { min-width: 220px }
</style>
