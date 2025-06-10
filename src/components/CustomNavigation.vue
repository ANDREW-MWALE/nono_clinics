<template>
  <nav class="navbar">
    <div class="nav-container">
      <div class="nav-links">
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
      
      <div class="profile-section">
        <div class="profile-info">
          <i class="fas fa-user-circle profile-icon"></i>
          <span class="employee-name">{{ employeeName }}</span>
        </div>
        <button class="logout-btn" @click="handleLogout">
          <i class="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </button>
      </div>
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
        // Add more links as needed
        // { path: '/staff', icon: 'fas fa-users', text: 'Staff' },
      ],
      employeeName: 'Guest' // Default value
    }
  },
  mounted() {
    this.updateEmployeeName();
  },
  methods: {
    updateEmployeeName() {
      const userData = localStorage.getItem("user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          // Check multiple possible name fields
          this.employeeName = user.employeeName || user.fullName || user.username || user.email || "Unknown";
        } catch (e) {
          console.error("Failed to parse user data:", e);
          this.employeeName = "Unknown";
        }
      }
    },
    handleLogout() {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      this.$router.push('/login');
    }
  }
}
</script>



<style scoped>
.navbar {
  background-color: #1E3A8A;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  display: flex;
  justify-content: space-between;
}

.nav-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-links {
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

.profile-section {
  display: flex;
  align-items: center;
  color: white;
}

.profile-info {
  display: flex;
  align-items: center;
  margin-right: 20px;
  cursor: pointer;
}

.profile-icon {
  font-size: 24px;
  margin-right: 8px;
}

.employee-name {
  font-size: 15px;
}

.logout-btn {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  padding: 8px 15px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.logout-btn i {
  margin-right: 8px;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    padding: 0;
  }
  
  .nav-links {
    width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  
  .nav-link {
    padding: 15px;
    white-space: nowrap;
  }
  
  .nav-link i {
    margin-right: 8px;
  }
  
  .profile-section {
    width: 100%;
    justify-content: flex-end;
    padding: 10px 15px;
    background-color: rgba(0, 0, 0, 0.1);
  }
  
  .employee-name {
    display: none;
  }
}

/* Scrollbar styling for mobile */
.nav-links::-webkit-scrollbar {
  height: 4px;
}

.nav-links::-webkit-scrollbar-thumb {
  background-color: rgba(255,255,255,0.2);
  border-radius: 2px;
}
</style>