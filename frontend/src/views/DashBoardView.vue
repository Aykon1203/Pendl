<template>
  <div 
    :class="{ 'bg-gray-900': store.darkMode, 'bg-gray-100': !store.darkMode }"
    class="min-h-screen pt-6 transition-colors duration-200">
    <div class="max-w-7xl px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ClockWidget />
        </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ClockWidget from '@/components/widgets/ClockWidget.vue';
import { useDashboardStore } from '@/stores/dashboard';

const store = useDashboardStore()
</script>