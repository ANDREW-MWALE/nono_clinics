<template>
  <div id="app">
    <CustomNavigation v-if="showNavigation" />
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script>
import CustomNavigation from '@/components/CustomNavigation.vue'

export default {
  name: 'App',
  components: { CustomNavigation },
  computed: {
    showNavigation() {
      const hiddenRoutes = ['/login', '/register', '/']
      return !hiddenRoutes.includes(this.$route.path)
    }
  }
}
</script>

<style>
/* Global styles */
#app {
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* Ensures main content takes remaining space */
router-view {
  flex: 1;
}
</style>