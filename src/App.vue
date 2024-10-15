<!-- App.vue -->
<template>
  <div id="app">
    <nav class="navbar">
      <router-link to="/dashboard" class="nav-link">Dashboard</router-link>
      <span class="separator">|</span>
      <router-link to="/staff" class="nav-link">Staff</router-link>
      <span class="separator">|</span>
      <router-link to="/patients" class="nav-link">Patients</router-link>
      <span class="separator">|</span>
      <router-link to="/locations" class="nav-link">Locations</router-link>
      <span class="separator">|</span>
      <router-link to="/pharmacy" class="nav-link">Pharmacy</router-link>
      
    </nav>
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style scoped>
/* Basic styles for the entire app */
#app {
  font-family: Arial, sans-serif;
  text-align: center;
  background-color: #f4f4f4; /* Light background color */
  min-height: 100vh; /* Ensure full height */
}

/* Styles for the navigation bar */
.navbar {
  background-color: #1E3A8A; /* Dark blue background */
  padding: 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1); /* Subtle shadow for depth */
  text-align: left; /* Align the nav elements to the left */
}

/* Styles for navigation links */
.nav-link {
  color: white; /* White text color */
  text-decoration: none; /* Remove underline */
  font-size: 18px; /* Font size */
  margin: 0 15px; /* Horizontal margin between links */
  transition: color 0.3s; /* Smooth color transition */
}

.nav-link:hover {
  color: #FFD700; /* Gold color on hover */
}

/* Styles for the separator */
.separator {
  color: white; /* White separator color */
  margin: 0 10px; /* Spacing around the separator */
}
</style>
