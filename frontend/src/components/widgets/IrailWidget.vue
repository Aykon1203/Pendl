<!-- frontend/src/components/widgets/IrailWidget.vue -->
<template>
  <div class="widget rounded-lg shadow bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white overflow-hidden">
    <div class="text-center mt-5 text-10 text-gray-400 ">{{ fromStation }} → {{ toStation }}</div>
    <div class="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
      <div>
      </div>
      <div class="flex items-center gap-2">
        <button @click="fetchConnections(true)" class="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-sm rounded">Refresh</button>
        <button @click="togglePolling" class="px-3 py-1 border border-gray-700 text-sm rounded">{{ polling ? 'Stop' : 'Auto' }}</button>
        <button @click="swapDirection" class="px-3 py-1 border border-gray-700 text-sm rounded">Wissel</button>
      </div>
    </div>

    <div v-if="loading" class="p-4 text-sm text-gray-300">Laden…</div>
    <div v-else-if="error" class="p-4 text-sm text-red-400">Fout: {{ error }}</div>

    <ul v-else class="divide-y divide-gray-700">
      <li v-for="(d, i) in connections.slice(0,5)" :key="i" class="flex items-center px-4 py-4">
        <!-- Left: large time (fixed width) -->
        <div class="w-28 text-left flex-shrink-0">
          <div class="text-4xl font-extrabold leading-none">{{ formatTime(d.time) }}</div>
          <div class="text-xs text-gray-400 mt-1">{{ formatDateShort(d.time) }}</div>
        </div>

        <!-- Middle: direction + vehicle (flexible) -->
        <div class="flex-1 px-4">
          <div class="text-lg font-semibold">{{ d.direction }}</div>
          <div class="text-sm text-gray-400 mt-1">Spoor: <span class="font-medium text-white">{{ d.platform ?? '-' }}</span></div>
          <div v-if="d.arrivalTime" class="text-sm text-gray-400 mt-1">Aankomst: <span class="font-medium text-white">{{ formatTime(d.arrivalTime) }}</span></div>
        </div>

        <!-- Right: stacked avatar above delay (fixed width) -->
        <div class="w-20 flex flex-col items-center justify-center gap-2 flex-shrink-0">
          <div v-if="d.crowding"
               :title="displayCrowding(d.crowding)"
               :aria-label="displayCrowding(d.crowding)"
               :class="['inline-flex items-center justify-center w-8 h-8 aspect-square rounded-full', crowdingClass(d.crowding)]">
            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
            </svg>
          </div>

          <div class="text-center">
            <span v-if="hasDelay(d)" class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-red-600 text-white">
              +{{ Math.max(0, Math.round((d.delay ?? 0) / 60)) }}m
            </span>
            <span v-else class="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-600 text-white">Op tijd</span>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue'
import { IrailService } from '@/services/irail.service'

const fromA = 'Sint-Niklaas'
const toA = 'Gent-Sint-Pieters'


const directionForward = ref(true)
const fromStation = ref(fromA)
const toStation = ref(toA)

const connections = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const polling = ref(false)

async function fetchConnections(force = false) {
  loading.value = true
  error.value = null
  try {
    const res = await IrailService.getConnections(fromStation.value, toStation.value)
    // res.connection may be array or single; normalize
    const raw = res?.connection ? (Array.isArray(res.connection) ? res.connection : [res.connection]) : []
    // Map to our display model using departure time and departure/platform/delay
    connections.value = raw.map((conn: any) => {
      const departure = conn?.departure ?? conn?.departure[0] ?? {}
      const arrival = conn?.arrival ?? conn?.arrival?.time ? conn?.arrival : conn?.arrival ?? conn?.to ?? {}
      return {
        time: Number(departure?.time ?? departure?.date ?? Date.now()),
        vehicle: departure?.vehicle ?? conn?.vehicle ?? '',
        direction: conn?.arrival?.station || toStation.value,
        delay: Number(departure?.delay ?? 0),
        platform: departure?.platform ?? departure?.station ?? '-',
        // optional crowding field if API provides it
        crowding: departure?.crowding ?? departure?.occupancy ?? conn?.crowding ?? undefined,
        // arrival time at destination (try multiple keys)
        arrivalTime: Number(arrival?.time ?? arrival?.date ?? arrival?.arrival_time ?? arrival?.datetime ?? 0) || undefined,
      }
    })
  } catch (err: any) {
    error.value = err?.message ?? 'Fout bij ophalen'
  } finally {
    loading.value = false
  }
}

function swapDirection() {
  directionForward.value = !directionForward.value
  if (directionForward.value) {
    fromStation.value = fromA
    toStation.value = toA
  } else {
    fromStation.value = toA
    toStation.value = fromA
  }
  fetchConnections(true)
}

function togglePolling() {
  if (polling.value) {
    stopPolling()
  } else {
    startPolling()
  }
}

let pollHandle: number | null = null
function startPolling(intervalMs = 60_000) {
  stopPolling()
  pollHandle = window.setInterval(() => fetchConnections(true), intervalMs)
  polling.value = true
}
function stopPolling() {
  if (pollHandle !== null) {
    clearInterval(pollHandle)
    pollHandle = null
  }
  polling.value = false
}

onMounted(() => {
  fetchConnections()
})

onBeforeUnmount(() => {
  stopPolling()
})

function formatTime(t: number) {
  const ts = t > 1_000_000_000_000 ? Math.floor(t/1000) : t
  return new Date(ts * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDateShort(t: number) {
  const ts = t > 1_000_000_000_000 ? Math.floor(t/1000) : t
  const d = new Date(ts * 1000)
  return d.toLocaleDateString([], { day: '2-digit', month: 'short' })
}

function hasDelay(d: any) {
  const delay = Number(d?.delay ?? 0)
  return delay > 60
}

function normalizeCrowding(raw: any): string | undefined {
  if (raw == null) return undefined
  if (typeof raw === 'string') return raw
  if (typeof raw === 'number') return String(raw)
  if (typeof raw === 'object') {
    // try common keys
    const tryKeys = ['level', 'occupancy', 'occupancy_level', 'value', 'text', 'description', 'crowding', 'crowd', 'status']
    for (const k of tryKeys) {
      const v = (raw as any)[k]
      if (v != null && (typeof v === 'string' || typeof v === 'number')) return String(v)
      if (v != null && typeof v === 'object') {
        // nested object, try to extract level/name
        if (v.level) return String(v.level)
        if (v.name) return String(v.name)
      }
    }
    // fallback: try to find any string property
    for (const k of Object.keys(raw)) {
      const v = (raw as any)[k]
      if (typeof v === 'string' || typeof v === 'number') return String(v)
    }
    try { return JSON.stringify(raw) } catch (e) { return String(raw) }
  }
  return String(raw)
}

function displayCrowding(c: any) {
  const s = normalizeCrowding(c)
  if (!s) return ''
  const lowMatches = ['low', 'laag', 'weinig', '1']
  const medMatches = ['med', 'gem', 'medium', '2']
  const highMatches = ['high', 'druk', 'veel', '3']
  const sl = s.toLowerCase()
  if (lowMatches.some(m => sl.includes(m))) return 'Weinig'
  if (medMatches.some(m => sl.includes(m))) return 'Gemiddeld'
  if (highMatches.some(m => sl.includes(m))) return 'Druk'
  // fallback: capitalize first letter
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function crowdingClass(c: any) {
  const s = normalizeCrowding(c)
  if (!s) return 'bg-gray-600 text-white'
  const sl = s.toLowerCase()
  if (['low','laag','weinig','1'].some(m => sl.includes(m))) return 'bg-green-600 text-white'
  if (['med','gem','medium','2'].some(m => sl.includes(m))) return 'bg-yellow-500 text-black'
  if (['high','druk','veel','3'].some(m => sl.includes(m))) return 'bg-red-600 text-white'
  return 'bg-gray-600 text-white'
}
</script>

<style scoped>
.widget { min-width: 220px; }
</style>