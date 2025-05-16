<template>
  <nav class="pharmacy-menu">
    <ul>
      <SidebarMenuItem 
        v-for="item in menuItems" 
        :key="item.component"
        :icon="item.icon"
        :title="item.name"
        :isActive="activeView === item.component"
        :collapsed="collapsed"
        @click="navigate(item.component)"
      />
    </ul>
  </nav>
</template>

<script>
import { computed } from 'vue'
import { usePharmacyStore } from '@/stores/pharmacy'
import SidebarMenuItem from './SidebarMenuItem.vue'

export default {
  props: {
    collapsed: Boolean
  },
  emits: ['navigate'],
  components: {
    SidebarMenuItem
  },
  setup(props, { emit }) {
    const pharmacyStore = usePharmacyStore()
    
    const menuItems = computed(() => pharmacyStore.getMenuItems)
    const activeView = computed(() => pharmacyStore.getActiveView)

    function navigate(view) {
      pharmacyStore.setActiveView(view)
      emit('navigate', view)
    }

    return {
      menuItems,
      activeView,
      navigate
    }
  }
}
</script>

<style scoped>
.pharmacy-menu {
  background: linear-gradient(135deg, #1a3a8a 0%, #2563eb 100%);
  height: 100%;
  border-radius: 0 12px 12px 0;
  box-shadow: 4px 0 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.pharmacy-menu ul {
  list-style: none;
  padding: 10px 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

/* Animation for menu items */
.pharmacy-menu ul li {
  transition: transform 0.2s ease;
}

.pharmacy-menu ul li:hover {
  transform: translateX(4px);
}

/* Responsive design */
@media (max-width: 768px) {
  .pharmacy-menu {
    border-radius: 0;
    width: 100%;
    height: auto;
  }
  
  .pharmacy-menu ul {
    flex-direction: row;
    overflow-x: auto;
    padding: 8px 10px;
    gap: 8px;
  }
  
  .pharmacy-menu ul li {
    min-width: max-content;
  }
}
</style>