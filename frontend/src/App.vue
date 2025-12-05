<template>
  <div class="min-h-screen bg-gray-100 p-8">
    
    <header class="mb-8 border-b border-gray-300 pb-4">
      <h1 class="text-3xl font-bold text-gray-800">
        Mijn Widget Dashboard 📊
      </h1>
    </header>

    <main class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <RouterView /> 
      </main>
    
  </div>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
// ... eventuele andere imports
</script>