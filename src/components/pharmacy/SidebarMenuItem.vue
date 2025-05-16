<template>
  <li 
    :class="['menu-item', { active: isActive, collapsed: collapsed }]" 
    @click="handleClick"
  >
    <div class="menu-item-content">
      <i :class="['menu-icon', icon]"></i>
      <span v-if="!collapsed" class="menu-title">{{ title }}</span>
    </div>
    <div v-if="isActive && !collapsed" class="active-indicator"></div>
  </li>
</template>

<script>
export default {
  name: 'SidebarMenuItem',
  props: {
    icon: String,
    title: String,
    isActive: Boolean,
    collapsed: Boolean
  },
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
}
</script>

<style scoped>
.menu-item {
  position: relative;
  padding: 14px 24px;
  margin: 4px 12px;
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: rgba(255, 255, 255, 0.85);
  overflow: hidden;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
}

.menu-item.active {
  background: linear-gradient(90deg, rgba(0, 130, 159, 0.15) 0%, transparent 100%);
  color: white;
}

.menu-item.active .menu-icon {
  color: #00b4d8;
}

.menu-item-content {
  display: flex;
  align-items: center;
  gap: 16px;
  z-index: 1;
}

.menu-icon {
  font-size: 1.25rem;
  min-width: 24px;
  text-align: center;
  transition: transform 0.2s ease;
}

.menu-title {
  font-size: 0.95rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.active-indicator {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 3px;
  background: #00b4d8;
  border-radius: 0 3px 3px 0;
  box-shadow: 0 0 8px rgba(0, 180, 216, 0.4);
}

/* Collapsed state styles */
.menu-item.collapsed {
  padding: 16px;
  justify-content: center;
}

.menu-item.collapsed .menu-title {
  display: none;
}

.menu-item.collapsed .menu-icon {
  font-size: 1.4rem;
}

.menu-item.collapsed:hover .menu-icon {
  transform: scale(1.1);
}

/* Animation for active state */
@keyframes subtlePulse {
  0% { opacity: 0.8; }
  50% { opacity: 1; }
  100% { opacity: 0.8; }
}

.menu-item.active .active-indicator {
  animation: subtlePulse 2s infinite ease-in-out;
}
</style>