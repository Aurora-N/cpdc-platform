<script setup lang="ts">
import NavbarComponent from '@/components/Navbar/NavbarComponent.vue'
import FooterComponent from '@/components/Footer/FooterComponent.vue'
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <NavbarComponent />
    <main class="flex-grow">
      <RouterView />
    </main>
    <FooterComponent />
  </div>
</template>
