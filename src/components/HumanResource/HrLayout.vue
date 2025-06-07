<template>
  <div class="layout-container">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <div class="logo-container">
          <svg class="logo-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" fill="white"/>
            <path d="M12 14C7.58172 14 4 17.5817 4 22H20C20 17.5817 16.4183 14 12 14Z" fill="white"/>
          </svg>
          <h1>HR Panel</h1>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="nav-list">
        <router-link to="/add-employee" class="nav-link" active-class="active-link">
          <svg class="nav-icon" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
          <span>Add Employee</span>
        </router-link>
        <router-link to="/leave-application" class="nav-link" active-class="active-link">
          <svg class="nav-icon" viewBox="0 0 24 24"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V9h14v10zM5 7V5h14v2H5zm5.56 10.46l5.93-5.93-1.06-1.06-4.87 4.87-2.11-2.11-1.06 1.06z"/></svg>
          <span>Leave Application</span>
        </router-link>
        <router-link to="/pay-rol" class="nav-link" active-class="active-link">
          <svg class="nav-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.31-8.86c-1.77-.45-2.34-.94-2.34-1.67 0-.84.79-1.43 2.1-1.43 1.38 0 1.9.66 1.94 1.64h1.71c-.05-1.34-.87-2.57-2.49-2.97V5H10.9v1.69c-1.51.32-2.72 1.3-2.72 2.81 0 1.79 1.49 2.69 3.66 3.21 1.95.46 2.34 1.15 2.34 1.87 0 .53-.39 1.39-2.1 1.39-1.6 0-2.23-.72-2.32-1.64H8.04c.1 1.7 1.36 2.66 2.86 2.97V19h2.34v-1.67c1.52-.29 2.72-1.16 2.73-2.77-.01-2.2-1.9-2.96-3.66-3.42z"/></svg>
          <span>Payroll</span>
        </router-link>
        <router-link to="/appraisal" class="nav-link" active-class="active-link">
          <svg class="nav-icon" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          <span>Appraisal</span>
        </router-link>
        <router-link to="/liquisition" class="nav-link" active-class="active-link">
          <svg class="nav-icon" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
          <span>Liquisition</span>
        </router-link>
        <router-link to="/departments" class="nav-link" active-class="active-link">
          <svg class="nav-icon" viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          <span>Departments</span>
        </router-link>
        <router-link to="/position" class="nav-link" active-class="active-link">
          <svg class="nav-icon" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/></svg>
          <span>Positions</span>
        </router-link>
        <router-link to="/hr-dashboard" class="nav-link" active-class="active-link">
          <svg class="nav-icon" viewBox="0 0 24 24"><path d="M19 5v2h-4V5h4M9 5v6H5V5h4m10 8v6h-4v-6h4M9 17v2H5v-2h4M21 3h-8v6h8V3zM11 3H3v10h8V3zm10 8h-8v10h8V11zm-10 4H3v6h8v-6z"/></svg>
          <span>Dashboard</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="user-profile">
          <div class="avatar">HR</div>
          <div class="user-info">
            <div class="username">Admin User</div>
            <div class="role">HR Manager</div>
          </div>
        </div>
        <div class="copyright">© 2025 HR System v2.0</div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="main-content">
      <div class="content-wrapper">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: 'HrLayout',
};
</script>

<style scoped>
/* Base Styles */
:root {
  --primary: #3b82f6;
  --primary-dark: #2563eb;
  --primary-darker: #1e40af;
  --sidebar-width: 280px;
  --sidebar-bg: linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%);
  --sidebar-text: rgba(255, 255, 255, 0.9);
  --sidebar-text-hover: white;
  --sidebar-icon-size: 20px;
  --transition-speed: 0.3s;
}

.layout-container {
  display: flex;
  min-height: 100vh;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background-color: #f8fafc;
  color: #1e293b;
}

/* Sidebar Styles */
.sidebar {
  width: var(--sidebar-width);
  background: var(--sidebar-bg);
  color: var(--sidebar-text);
  display: flex;
  flex-direction: column;
  transition: width var(--transition-speed);
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.sidebar-header {
  padding: 1.5rem 1.5rem 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 32px;
  height: 32px;
}

.sidebar-header h1 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
}

/* Navigation */
.nav-list {
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  flex-grow: 1;
  overflow-y: auto;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  margin: 0 0.5rem;
  border-radius: 0.375rem;
  color: var(--sidebar-text);
  text-decoration: none;
  font-weight: 500;
  transition: all var(--transition-speed);
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: var(--sidebar-text-hover);
}

.active-link {
  background-color: rgba(255, 255, 255, 0.15);
  color: white;
  font-weight: 600;
}

.nav-icon {
  width: var(--sidebar-icon-size);
  height: var(--sidebar-icon-size);
  fill: currentColor;
  opacity: 0.9;
}

.active-link .nav-icon {
  opacity: 1;
}

/* Sidebar Footer */
.sidebar-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: auto;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.875rem;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.username {
  font-weight: 600;
  font-size: 0.875rem;
}

.role {
  font-size: 0.75rem;
  opacity: 0.8;
}

.copyright {
  font-size: 0.75rem;
  opacity: 0.7;
  text-align: center;
}

/* Main Content */
.main-content {
  flex: 1;
  overflow-y: auto;
  height: 100vh;
  background-color: #f8fafc;
}

.content-wrapper {
  padding: 1.5rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

/* Responsive */
@media (max-width: 768px) {
  .sidebar {
    width: 72px;
    overflow: hidden;
  }
  
  .logo-container h1,
  .nav-link span,
  .user-info,
  .copyright {
    display: none;
  }
  
  .logo-container {
    justify-content: center;
  }
  
  .nav-link {
    justify-content: center;
    padding: 0.75rem;
  }
  
  .sidebar-header,
  .sidebar-footer {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}

/* Animation */
.nav-link {
  transform: translateX(0);
  transition: transform 0.2s ease;
}

.nav-link:hover {
  transform: translateX(4px);
}
</style>