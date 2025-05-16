<template>
    <div class="pharmacy-component">
      <h2>Pharmacy Reports</h2>
      <div class="report-options">
        <div class="report-card" @click="generateReport('sales')">
          <i class="ri-money-dollar-circle-fill"></i>
          <span>Sales Report</span>
        </div>
        <div class="report-card" @click="generateReport('inventory')">
          <i class="ri-archive-fill"></i>
          <span>Inventory Report</span>
        </div>
        <!-- More report options -->
      </div>
      <div class="report-viewer" v-if="activeReport">
        <!-- Report would display here -->
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PharmacyReports',
    data() {
      return {
        activeReport: null
      }
    },
    methods: {
      generateReport(type) {
        this.activeReport = type
        // Logic to fetch/generate report data
      }
    }
  }
  </script>