<template> 
  <div class="dashboard-container">
    <custom-navigation/>
    
    <div class="dashboard-layout">
      <!-- Sidebar Navigation -->
      <aside class="sidebar">
        <nav>
          <ul class="nav-menu">
            <li v-for="item in navItems" :key="item.path">
              <router-link 
                :to="item.path" 
                class="nav-link"
                :class="{ 'active': $route.path === item.path }"
              >
                <span class="nav-icon" v-if="item.icon">
                  <i :class="item.icon"></i>
                </span>
                <span class="nav-text">{{ item.text }}</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </aside>

      <!-- Main Content Area -->
      <main class="main-content">
        <!-- Dashboard Cards -->
        <div class="dashboard-cards">
          <router-link 
            v-for="card in dashboardCards" 
            :key="card.path"
            :to="card.path"
            class="dashboard-card"
          >
            <div class="card-icon">
              <img 
                :src="require(`@/assets/${card.image}`)" 
                :alt="card.text"
                width="80"
                height="80"
              >
            </div>
            <h3 class="card-title">{{ card.text }}</h3>
            <p class="card-value">{{ card.value }}</p>
          </router-link>
        </div>

        <!-- Graph Section -->
        <div class="graphs-section">
          <div class="graph-container">
            <h2 class="section-title">Patient Statistics</h2>
            <div class="chart-wrapper">
              <canvas ref="patientChart"></canvas>
            </div>
          </div>

          <div class="graph-container">
            <h2 class="section-title">Monthly Consultations</h2>
            <div class="chart-wrapper">
              <canvas ref="consultationChart"></canvas>
            </div>
          </div>

          <div class="graph-container full-width">
            <h2 class="section-title">Department Distribution</h2>
            <div class="chart-wrapper">
              <canvas ref="departmentChart"></canvas>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js/auto';

export default {
  name: "DashboardComponent",
  data() {
    return {
      navItems: [
        { path: '/dashboard', text: 'Dashboard', icon: 'ri-dashboard-line' },
        { path: '/services', text: 'Services', icon: 'ri-service-line' },
        { path: '/reports', text: 'Reports', icon: 'ri-line-chart-line' },
        { path: '/settings', text: 'Settings', icon: 'ri-settings-line' },
        { path: '/logout', text: 'Logout', icon: 'ri-logout-box-r-line' }
      ],
      dashboardCards: [
        { path: '/patients', text: 'REGISTER', image: 'opd.png', value: '1,245' },
        { path: '/vitals', text: 'VITALS', image: 'lifeline-in-a-heart-outline.png', value: '982' },
        { path: '/consultation', text: 'CONSULTATION', image: 'medical-consultation.png', value: '756' },
        { path: '/pharmacy', text: 'PHARMACY', image: 'pharmacy.png', value: '632' },
        { path: '/Laboratory', text: 'LABORATORY', image: 'microscope.png', value: '428' },
        { path: '/hr-dashboard', text: 'HUMAN RESOURCE', image: 'dashboard.png', value: '58' }
      ],
      charts: {
        patientChart: null,
        consultationChart: null,
        departmentChart: null
      }
    };
  },
  mounted() {
    this.renderCharts();
  },
  beforeUnmount() {
    // Destroy charts when component is unmounted to prevent memory leaks
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.destroy();
    });
  },
  methods: {
    renderCharts() {
      // Patient Statistics Chart (Line Chart)
      const patientCtx = this.$refs.patientChart.getContext('2d');
      this.charts.patientChart = new Chart(patientCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'New Patients',
            data: [120, 190, 170, 220, 180, 250],
            borderColor: '#42b983',
            backgroundColor: 'rgba(66, 185, 131, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true
          }, {
            label: 'Returning Patients',
            data: [80, 110, 95, 140, 120, 160],
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            borderWidth: 2,
            tension: 0.3,
            fill: true
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

      // Monthly Consultations Chart (Bar Chart)
      const consultationCtx = this.$refs.consultationChart.getContext('2d');
      this.charts.consultationChart = new Chart(consultationCtx, {
        type: 'bar',
        data: {
          labels: ['General', 'Pediatrics', 'Cardiology', 'Dermatology', 'Neurology'],
          datasets: [{
            label: 'Consultations',
            data: [320, 180, 150, 90, 60],
            backgroundColor: [
              'rgba(75, 192, 192, 0.6)',
              'rgba(54, 162, 235, 0.6)',
              'rgba(153, 102, 255, 0.6)',
              'rgba(255, 159, 64, 0.6)',
              'rgba(255, 99, 132, 0.6)'
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255, 99, 132, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });

      // Department Distribution Chart (Doughnut Chart)
      const departmentCtx = this.$refs.departmentChart.getContext('2d');
      this.charts.departmentChart = new Chart(departmentCtx, {
        type: 'doughnut',
        data: {
          labels: ['OPD', 'Pharmacy', 'Laboratory', 'Radiology', 'Inpatient'],
          datasets: [{
            data: [35, 25, 15, 10, 15],
            backgroundColor: [
              '#42b983',
              '#3498db',
              '#9b59b6',
              '#e74c3c',
              '#f39c12'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'right',
            }
          },
          cutout: '70%'
        }
      });
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f4f4f9;
}

.dashboard-layout {
  display: flex;
  flex: 1;
}

/* Sidebar Styles */
.sidebar {
  width: 240px;
  background-color: #2c3e50;
  color: white;
  padding: 20px 0;
  height: calc(100vh - 60px); /* Adjust based on your navigation height */
  position: sticky;
  top: 60px; /* Height of your custom-navigation */
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-link {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #ecf0f1;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background-color: #34495e;
}

.nav-link.active {
  background-color: #42b983;
  color: white;
}

.nav-icon {
  margin-right: 12px;
  font-size: 1.2rem;
}

.nav-text {
  font-size: 0.95rem;
}

/* Main Content Styles */
.main-content {
  flex: 1;
  padding: 30px;
}

.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 25px;
  padding: 20px;
}

.dashboard-card {
  background: white;
  border-radius: 12px;
  padding: 30px 20px;
  text-align: center;
  text-decoration: none;
  color: #2c3e50;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 180px;
}

.dashboard-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.card-icon {
  margin-bottom: 15px;
}

.card-title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.card-value {
  margin: 8px 0 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #42b983;
}

/* Graphs Section */
.graphs-section {
  margin-top: 30px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
}

.graph-container {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
}

.full-width {
  grid-column: span 2;
}

.section-title {
  margin-top: 0;
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.2rem;
}

.chart-wrapper {
  position: relative;
  height: 300px;
  width: 100%;
}

/* Responsive Design */
@media (max-width: 992px) {
  .sidebar {
    width: 200px;
  }
  
  .graphs-section {
    grid-template-columns: 1fr;
  }
  
  .full-width {
    grid-column: span 1;
  }
}

@media (max-width: 768px) {
  .dashboard-layout {
    flex-direction: column;
  }
  
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
    top: 0;
  }
  
  .nav-menu {
    display: flex;
    overflow-x: auto;
    padding: 10px 0;
  }
  
  .nav-link {
    flex-direction: column;
    padding: 10px 15px;
    font-size: 0.8rem;
  }
  
  .nav-icon {
    margin-right: 0;
    margin-bottom: 5px;
    font-size: 1rem;
  }
  
  .dashboard-cards {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 15px;
  }
  
  .main-content {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .dashboard-cards {
    grid-template-columns: 1fr 1fr;
  }
  
  .chart-wrapper {
    height: 250px;
  }
}
</style>