<template>
  <div class="pharmacy-system">
    <aside class="pharmacy-sidebar">
      <div class="sidebar-header">
        <div class="logo">
          <i class="ri-health-book-line"></i>
          <span>PharmaCare</span>
        </div>
      </div>
      <nav class="pharmacy-menu">
        <router-link 
          v-for="item in menuItems" 
          :key="item.path"
          :to="item.path"
          class="menu-item"
          active-class="active"
        >
          <i :class="item.icon"></i>
          <span class="menu-title">{{ item.title }}</span>
          <div class="hover-effect"></div>
        </router-link>
      </nav>
      <div class="sidebar-footer">
        <div class="user-profile">
          <i class="ri-user-3-line"></i>
          <span>Admin</span>
        </div>
      </div>
    </aside>

    <main class="pharmacy-content">
      <div class="content-container">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'PharmacyLayout',
  data() {
    return {
      menuItems: [
        { path: 'stock', icon: 'ri-medicine-bottle-line', title: 'Inventory' },
        { path: 'sales', icon: 'ri-shopping-cart-line', title: 'Sales' },
        { path: 'patients', icon: 'ri-user-heart-line', title: 'Patients' },
        { path: 'reports', icon: 'ri-line-chart-line', title: 'Reports' },
        { path: 'prescriptions', icon: 'ri-file-text-line', title: 'Prescriptions' },
        { path: 'suppliers', icon: 'ri-truck-line', title: 'Suppliers' }
      ]
    }
  }
}
</script>

<style scoped>
.pharmacy-system {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
}

.pharmacy-sidebar {
  width: 280px;
  background: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.sidebar-header {
  padding: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.5rem;
  font-weight: 600;
}

.logo i {
  font-size: 1.8rem;
  color: #60a5fa;
}

.pharmacy-menu {
  flex: 1;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.menu-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  transition: all 0.3s ease;
  overflow: hidden;
}

.menu-item i {
  font-size: 1.2rem;
  width: 24px;
  text-align: center;
}

.menu-title {
  font-size: 0.95rem;
  font-weight: 500;
}

.hover-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(96, 165, 250, 0.1) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.menu-item:hover {
  color: white;
}

.menu-item:hover .hover-effect {
  opacity: 1;
}

.menu-item.active {
  background: rgba(96, 165, 250, 0.15);
  color: white;
  font-weight: 500;
}

.menu-item.active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background: #60a5fa;
  border-radius: 0 3px 3px 0;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: background 0.3s ease;
}

.user-profile:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-profile i {
  font-size: 1.2rem;
}

.pharmacy-content {
  flex: 1;
  overflow-y: auto;
  background-color: #f8fafc;
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

/* Responsive design */
@media (max-width: 768px) {
  .pharmacy-sidebar {
    width: 72px;
  }
  
  .logo span, .menu-title, .user-profile span {
    display: none;
  }
  
  .logo {
    justify-content: center;
  }
  
  .menu-item {
    justify-content: center;
    padding: 16px;
  }
  
  .menu-item.active::before {
    width: 100%;
    height: 3px;
    top: auto;
    bottom: 0;
    border-radius: 3px 3px 0 0;
  }
}
</style>