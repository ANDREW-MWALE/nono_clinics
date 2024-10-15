<template>
    <div class="dashboard">
      <!-- Sidebar with router-links -->
      <div class="side_nav">
        <ul>
          <li><router-link to="/dashboard" class="nav-link">Dashboard</router-link></li>
          <li><router-link to="/dashboard" class="nav-link">Home</router-link></li>
          <li><router-link to="/services" class="nav-link">Services</router-link></li>
          <li><router-link to="/reports" class="nav-link">Reports</router-link></li>
          <li><router-link to="/settings" class="nav-link">Settings</router-link></li>
          <li><router-link to="/logout" class="nav-link">Logout</router-link></li>
        </ul>
      </div>
  
      <!-- Card view with router-links -->
      <div class="cardview">
        <router-link to="/pharmacy" class="card">
          <h1><i class="fas fa-hospital-alt"></i> Pharmacy</h1>
        </router-link>
  
        <router-link to="/patients" class="card">
          <h1><i class="fas fa-user-md"></i> OPD</h1>
        </router-link>
  
        <router-link to="/medical" class="card">
          <h1><i class="fas fa-user-nurse"></i> Medical</h1>
        </router-link>
  
        <router-link to="/review" class="card">
          <h1><i class="fas fa-star"></i> Review</h1>
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  // Placeholder for any future logic
  export default {
    name: "DashboardComponent",
  };
  </script>
  
  <style scoped>
  /* General Dashboard Layout */
  .dashboard {
    display: flex; /* Sidebar and cards aligned side by side */
    height: 100vh;
    font-family: 'Arial', sans-serif;
    background-color: #f4f4f9; /* Softer background */
  }
  
  /* Sidebar Styling */
  .side_nav {
    width: 15%; /* Sidebar width */
    background-color: #2c3e50; /* Dark blue */
    color: white;
    height: 100vh;
    padding-top: 20px;
  }
  
  .side_nav ul {
    list-style-type: none;
    padding: 0;
  }
  
  .side_nav ul li {
    padding: 15px 20px;
    cursor: pointer;
    border-bottom: 1px solid #34495e;
    transition: background-color 0.3s ease;
  }
  
  /* Styling router-link to behave like a non-link */
  .nav-link {
    text-decoration: none;
    color: inherit; /* Inherit color, no link style */
    display: block;
  }
  
  .side_nav ul li:hover {
    background-color: #34495e;
  }
  
  .side_nav ul li:first-child {
    font-size: 1.5rem;
    font-weight: bold;
    margin-bottom: 20px;
  }
  
  /* Card View Styling */
  .cardview {
    flex: 1; /* Takes up remaining space after sidebar */
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: flex-start;
    padding: 100px;
    gap: 5px; /* Reduced gap between cards */
  }
  
  /* Card Styling */
  .card {
    background-color: white;
    width: 40%; /* Adjusted width */
    padding: 20px;
    margin: 0;
    border-radius: 10px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
    text-align: center;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    cursor: pointer; /* Pointer cursor for clickable cards */
    text-decoration: none;
    color: inherit;
  }
  
  .card:hover {
    transform: translateY(-10px); /* Hover lift effect */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .side_nav {
      width: 30%; /* Sidebar becomes larger on smaller screens */
    }
  
    .cardview {
      flex-direction: column; /* Stack cards vertically */
      align-items: center;
    }
  
    .card {
      width: 80%; /* Cards take full width on small screens */
    }
  }
  </style>
  