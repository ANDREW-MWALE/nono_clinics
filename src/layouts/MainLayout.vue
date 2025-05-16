<template>
    <div class="main-layout">
      <!-- <CustomNavigation /> -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </template>
  
  <script>
  import CustomNavigation from '@/components/CustomNavigation.vue'
  
  export default {
    name: 'MainLayout',
    components: { CustomNavigation }
  }
  </script>
  
  <style scoped>
  .main-layout {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .content {
    flex: 1;
    padding: 20px;
    background-color: #f5f7fa;
  }
  </style>