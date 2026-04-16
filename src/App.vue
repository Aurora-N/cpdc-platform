<script setup lang="ts">
import NavbarComponent from '@/components/Navbar/NavbarComponent.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <NavbarComponent />
    <main class="flex-grow">
      <RouterView />
    </main>
  </div>
</template>
