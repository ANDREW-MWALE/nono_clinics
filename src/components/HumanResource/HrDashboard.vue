<template>
  <div>
    <!-- Dashboard Cards -->
    <div class="row g-4 mb-4">
      <div class="col-md-6 col-lg-4 col-xl-2" v-for="card in dashboardCards" :key="card.path">
        <router-link 
          :to="card.path"
          class="card text-decoration-none text-dark h-100 hover-shadow"
        >
          <div class="card-body text-center">
            <i :class="card.icon" class="fs-2 mb-3" :style="{ color: card.color }"></i>
            <h5 class="card-title">{{ card.text }}</h5>
            <p class="card-text fs-4 fw-bold">{{ card.value }}</p>
          </div>
        </router-link>
      </div>
    </div>

    <!-- Graph Section -->
    <div class="row g-4">
      <div class="col-lg-6">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Employee Distribution</h5>
            <div class="chart-wrapper" style="height: 300px;">
              <canvas ref="employeeChart"></canvas>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-lg-6">
        <div class="card h-100">
          <div class="card-body">
            <h5 class="card-title">Leave Requests</h5>
            <div class="chart-wrapper" style="height: 300px;">
              <canvas ref="leaveChart"></canvas>
            </div>
          </div>
        </div>
      </div>
      
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">Department Headcount</h5>
            <div class="chart-wrapper" style="height: 350px;">
              <canvas ref="departmentChart"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import Chart from 'chart.js/auto';

export default {
  name: "HRDashboard",
  data() {
    return {
      navItems: [
        { path: '/hr-dashboard', text: 'Dashboard', icon: 'bi bi-speedometer2' },
        { path: '/employee', text: 'Employee', icon: 'bi bi-people-fill' },
        { path: '/attendance', text: 'Attendance', icon: 'bi bi-calendar-check' },
        { path: '/leave', text: 'Leave', icon: 'bi bi-calendar-event' },
        { path: '/payroll', text: 'Payroll', icon: 'bi bi-cash-stack' },
        { path: '/recruitment', text: 'Recruitment', icon: 'bi bi-person-plus-fill' },
        { path: '/training', text: 'Training', icon: 'bi bi-book-half' },
        { path: '/reports', text: 'Reports', icon: 'bi bi-file-earmark-bar-graph' },
        { path: '/settings', text: 'Settings', icon: 'bi bi-gear-fill' }
      ],
      dashboardCards: [
        { 
          path: '/add-employee', 
          text: 'EMPLOYEES', 
          icon: 'bi bi-people-fill', 
          value: '245',
          color: '#42b983'
        },
        { 
          path: '/leave-days', 
          text: 'ON LEAVE', 
          icon: 'bi bi-calendar2-minus', 
          value: '32',
          color: '#3498db'
        },
        { 
          path: '/new-hires', 
          text: 'NEW HIRES', 
          icon: 'bi bi-person-plus', 
          value: '18',
          color: '#9b59b6'
        },
        { 
          path: '/open-positions', 
          text: 'OPEN POSITIONS', 
          icon: 'bi bi-briefcase', 
          value: '12',
          color: '#e74c3c'
        },
        { 
          path: '/pending-requests', 
          text: 'PENDING REQUESTS', 
          icon: 'bi bi-inbox', 
          value: '26',
          color: '#f39c12'
        },
        { 
          path: '/upcoming-events', 
          text: 'UPCOMING EVENTS', 
          icon: 'bi bi-calendar2-event', 
          value: '8',
          color: '#1abc9c'
        }
      ],
      charts: {
        employeeChart: null,
        leaveChart: null,
        departmentChart: null
      }
    };
  },
  mounted() {
    this.renderCharts();
  },
  beforeUnmount() {
    Object.values(this.charts).forEach(chart => {
      if (chart) chart.destroy();
    });
  },
  methods: {
    renderCharts() {
      // Employee Distribution Chart
      const employeeCtx = this.$refs.employeeChart.getContext('2d');
      this.charts.employeeChart = new Chart(employeeCtx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [
            {
              label: 'Full-time',
              data: [120, 125, 130, 135, 140, 145],
              borderColor: '#42b983',
              backgroundColor: 'rgba(66, 185, 131, 0.1)',
              borderWidth: 2,
              tension: 0.3,
              fill: true
            },
            {
              label: 'Part-time',
              data: [30, 32, 35, 38, 40, 42],
              borderColor: '#3498db',
              backgroundColor: 'rgba(52, 152, 219, 0.1)',
              borderWidth: 2,
              tension: 0.3,
              fill: true
            },
            {
              label: 'Contractors',
              data: [15, 18, 20, 22, 25, 28],
              borderColor: '#9b59b6',
              backgroundColor: 'rgba(155, 89, 182, 0.1)',
              borderWidth: 2,
              tension: 0.3,
              fill: true
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'top' }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });

      // Leave Requests Chart
      const leaveCtx = this.$refs.leaveChart.getContext('2d');
      this.charts.leaveChart = new Chart(leaveCtx, {
        type: 'bar',
        data: {
          labels: ['Approved', 'Pending', 'Rejected', 'Cancelled'],
          datasets: [{
            label: 'Leave Requests',
            data: [45, 26, 8, 5],
            backgroundColor: [
              'rgba(75, 192, 192, 0.6)',
              'rgba(255, 206, 86, 0.6)',
              'rgba(255, 99, 132, 0.6)',
              'rgba(153, 102, 255, 0.6)'
            ],
            borderColor: [
              'rgba(75, 192, 192, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(255, 99, 132, 1)',
              'rgba(153, 102, 255, 1)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false }
          },
          scales: {
            y: { beginAtZero: true }
          }
        }
      });

      // Department Headcount Chart
      const departmentCtx = this.$refs.departmentChart.getContext('2d');
      this.charts.departmentChart = new Chart(departmentCtx, {
        type: 'doughnut',
        data: {
          labels: ['HR', 'Finance', 'IT', 'Operations', 'Marketing', 'Sales'],
          datasets: [{
            data: [25, 32, 48, 56, 22, 38],
            backgroundColor: [
              '#42b983',
              '#3498db',
              '#9b59b6',
              '#e74c3c',
              '#f39c12',
              '#1abc9c'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'right' }
          },
          cutout: '70%'
        }
      });
    }
  }
};
</script>

<style scoped>
.sidebar {
  position: sticky;
  top: 0;
  height: 100vh;
  z-index: 1000;
}

.hover-shadow:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.nav-link {
  border-radius: 5px;
  margin-bottom: 5px;
  transition: all 0.3s ease;
}

.nav-link:hover:not(.active) {
  background-color: rgba(255, 255, 255, 0.1);
}

.card {
  transition: all 0.3s ease;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .sidebar {
    width: 220px;
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }
  
  .d-flex {
    flex-direction: column;
  }
}

@media (max-width: 576px) {
  .dashboard-cards .col-md-6 {
    flex: 0 0 50%;
    max-width: 50%;
  }
}
</style>