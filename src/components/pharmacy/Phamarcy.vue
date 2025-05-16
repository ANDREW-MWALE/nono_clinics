<template>
  <div class="pharmacy-system">
    <!-- Sidebar Navigation -->
    <aside class="pharmacy-sidebar" :class="{ collapsed: isCollapsed }">
      <div class="sidebar-header">
        <img src="@/assets/images/logo.png" alt="Pharmacy Logo" class="logo">
        <h1 v-if="!isCollapsed">PharmaSys</h1>
      </div>
      <PharmacyMenu :collapsed="isCollapsed" />
      <div class="sidebar-footer" v-if="!isCollapsed">
        <div class="system-status">
          <span class="status-indicator active"></span>
          <span>System Online</span>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="pharmacy-content">
      <header class="content-header">
        <div class="header-left">
          <button class="toggle-btn" @click="toggleSidebar" aria-label="Toggle sidebar">
            <i class="ri-menu-line"></i>
          </button>
          <h2 class="page-title">
            {{ currentViewTitle }}
            <span class="breadcrumb" v-if="route.meta.breadcrumb">/ {{ route.meta.breadcrumb }}</span>
          </h2>
        </div>
        <div class="user-controls">
          <div class="notifications">
            <button class="icon-btn" aria-label="Notifications">
              <i class="ri-notification-3-line"></i>
              <span class="badge">3</span>
            </button>
          </div>
          <div class="user-profile">
            <div class="avatar">
              <i class="ri-user-3-fill"></i>
            </div>
            <div class="user-info">
              <span class="user-greeting">Hello, {{ userName }}</span>
              <span class="user-role">Administrator</span>
            </div>
          </div>
        </div>
      </header>

      <div class="content-view">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import PharmacyMenu from './PharmacyMenu.vue'

const router = useRouter()
const route = useRoute()
const isCollapsed = ref(false)
const userName = 'Admin'

const viewTitles = {
  'PharmacyStock': 'Inventory',
  'PharmacySales': 'Point of Sale',
  'PharmacyPatients': 'Patients',
  'PharmacyReports': 'Reports',
  'PharmacySettings': 'Settings'
}

const currentViewTitle = computed(() => {
  return viewTitles[route.name] || 'Dashboard'
})

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}
</script>

<style scoped>
.pharmacy-system {
  display: flex;
  min-height: 100vh;
  background-color: #f8fafc;
  font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

/* Sidebar Styles */
.pharmacy-sidebar {
  width: 280px;
  background: linear-gradient(180deg, #0c1e35 0%, #143056 100%);
  color: white;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.pharmacy-sidebar.collapsed {
  width: 80px;
}

.sidebar-header {
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  min-height: 80px;
}

.sidebar-header h1 {
  font-size: 1.5rem;
  white-space: nowrap;
  font-weight: 600;
  background: linear-gradient(90deg, #ffffff 0%, #a1c4fd 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.sidebar-footer {
  margin-top: auto;
  padding: 15px 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

.system-status {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.status-indicator.active {
  background-color: #4ade80;
  box-shadow: 0 0 0 2px rgba(74, 222, 128, 0.3);
}

/* Main Content Styles */
.pharmacy-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Prevent flex overflow */
}

.content-header {
  background: white;
  padding: 0 25px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  min-height: 80px;
  position: sticky;
  top: 0;
  z-index: 5;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.toggle-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #4b5563;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.toggle-btn:hover {
  background-color: #f3f4f6;
  color: #1e40af;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.breadcrumb {
  font-size: 1rem;
  font-weight: 400;
  color: #64748b;
}

/* User Controls */
.user-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}

.notifications {
  position: relative;
}

.icon-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  background-color: #f3f4f6;
  color: #1e40af;
}

.badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background-color: #ef4444;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.65rem;
  font-weight: 600;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e0f2fe;
  color: #0369a1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-greeting {
  font-size: 0.9rem;
  font-weight: 500;
  color: #1e293b;
}

.user-role {
  font-size: 0.75rem;
  color: #64748b;
}

/* Content View */
.content-view {
  flex: 1;
  padding: 25px;
  overflow-y: auto;
  background-color: #f8fafc;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

/* Responsive Design */
@media (max-width: 768px) {
  .pharmacy-sidebar:not(.collapsed) {
    position: fixed;
    height: 100vh;
    z-index: 20;
  }
  
  .content-header {
    padding: 0 15px;
  }
  
  .user-info {
    display: none;
  }
  
  .content-view {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .breadcrumb {
    display: none;
  }
  
  .notifications {
    display: none;
  }
}
</style>