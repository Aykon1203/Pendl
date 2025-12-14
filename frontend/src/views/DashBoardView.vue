<template>
  <div 
    :class="{ 'bg-gray-900': store.darkMode, 'bg-gray-100': !store.darkMode }"
    class="min-h-screen  transition-colors duration-200">
      <div>
      <div class="grid items-start grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <ClockWidget />
        <IrailWidget />
        <CrowdingWidget/>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import ClockWidget from '../components/widgets/ClockWidget.vue';
import IrailWidget from '@/components/widgets/IrailWidget.vue';
import CrowdingWidget from '@/components/widgets/CrowdingWidget.vue';
import { useDashboardStore } from '../stores/dashboard';

const store = useDashboardStore()
</script>