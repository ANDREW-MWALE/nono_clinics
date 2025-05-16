<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link 
        v-for="link in navLinks" 
        :key="link.path"
        :to="link.path" 
        class="nav-link"
        active-class="active"
      >
        <i :class="link.icon"></i> 
        <span class="link-text">{{ link.text }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'CustomNavigation',
  data() {
    return {
      navLinks: [
        { path: '/dashboard', icon: 'fas fa-tachometer-alt', text: 'Dashboard' },
        { path: '/staff', icon: 'fas fa-users', text: 'Staff' },
        { path: '/locations', icon: 'fas fa-map-marker-alt', text: 'Locations' },
        { path: '/prescription', icon: 'fas fa-prescription', text: 'Prescription' },
        { path: '/medicine-form', icon: 'fas fa-pills', text: 'Medicine' },
        { path: '/service-form', icon: 'fas fa-concierge-bell', text: 'Services' }
      ]
    }
  }
}
</script>

<style scoped>
.navbar {
  background-color: #1E3A8A;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 15px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  padding: 15px 20px;
  position: relative;
  border-bottom: 3px solid transparent;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.05);
  border-bottom-color: #3B82F6;
}

.nav-link i {
  font-size: 16px;
  margin-right: 10px;
}

.link-text {
  position: relative;
  top: 1px;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .nav-container {
    overflow-x: auto;
    padding: 0;
    -webkit-overflow-scrolling: touch;
  }
  
  .nav-link {
    padding: 15px;
    white-space: nowrap;
  }
  
  .nav-link i {
    margin-right: 8px;
  }
}

/* Scrollbar styling for mobile */
.nav-container::-webkit-scrollbar {
  height: 4px;
}

.nav-container::-webkit-scrollbar-thumb {
  background-color: rgba(255,255,255,0.2);
  border-radius: 2px;
}
</style>