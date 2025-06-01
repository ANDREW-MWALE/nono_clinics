<template>
  <div class="layout-container">
    <!-- Sidebar (left side, vertical nav) -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <h1>HR Panel</h1>
      </div>

      <!-- Vertical Nav List -->
      <nav class="nav-list">
        <router-link to="/employee" class="nav-link" active-class="active-link">
          👥 Employees
        </router-link>
        <router-link to="/add-employee" class="nav-link" active-class="active-link">
          ➕ Add Employee
        </router-link>
        <router-link to="/leave-days" class="nav-link" active-class="active-link">
          🗓️ Leave Days
        </router-link>
        <router-link to="/leave-application" class="nav-link" active-class="active-link">
          ✍️ Leave Application
        </router-link>
        <router-link to="/pay-rol" class="nav-link" active-class="active-link">
          💵 Payroll
        </router-link>
        <router-link to="/appraisal" class="nav-link" active-class="active-link">
          📈 Appraisal
        </router-link>
        <router-link to="/liquisition" class="nav-link" active-class="active-link">
          📋 Liquisition
        </router-link>
        <router-link to="/staff" class="nav-link" active-class="active-link">
          🧑‍💼 Staff
        </router-link>
        <router-link to="/hr-dashboard" class="nav-link" active-class="active-link">
          📊 Dashboard
        </router-link>
      </nav>

      <div class="sidebar-footer">
        © 2025 HR System
      </div>
    </aside>

    <!-- Main Content Area -->
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'HrLayout',
};
</script>

<style scoped>
/* Reset and base */
.layout-container {
  display: flex;
  height: 100vh;
  width: 100vw;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  background-color: #f7fafc; /* light gray background for main */
  overflow: hidden;
}

/* Sidebar styling */
.sidebar {
  width: 288px; /* 72 * 4 (tailwind w-72 is 18rem = 288px) */
  background: linear-gradient(to bottom, #1e40af, #1e3a8a); /* blue gradient */
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.2);
}

.sidebar-header {
  padding: 1.5rem 1.5rem 1rem 1.5rem;
  border-bottom: 2px solid #2563eb; /* blue-600 */
}

.sidebar-header h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
}

/* Navigation List */
.nav-list {
  display: flex;
  flex-direction: column;
  padding: 1rem 1.5rem;
  gap: 0.5rem;
  flex-grow: 1;
  overflow-y: auto;
}

/* Remove default router-link styles */
.nav-link {
  text-decoration: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem; /* 6px */
  font-weight: 500;
  transition: background-color 0.2s ease;
  user-select: none;
  display: block;
}

.nav-link:hover {
  background-color: #2563eb; /* blue-600 on hover */
}

.active-link {
  background-color: #2563eb; /* same as hover */
  font-weight: 700;
}

/* Sidebar footer */
.sidebar-footer {
  text-align: center;
  font-size: 0.875rem;
  padding: 1rem;
  border-top: 2px solid #2563eb;
  user-select: none;
}

/* Main Content */
.main-content {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  background-color: #f7fafc;
}
</style>
