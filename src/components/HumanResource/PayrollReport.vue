<template>
  <div class="payroll-system">
    <div class="payroll-report">
      <div class="table-header">
        <h2>Generate Payroll Report</h2>
      </div>

      <!-- Report Generation Form -->
      <form @submit.prevent="generateReport" class="payroll-form">
        <div class="form-row">
          <div class="form-group date-group">
            <label for="startDate">Start Date</label>
            <input type="date" v-model="startDate" required />
          </div>
          
          <div class="form-group date-group">
            <label for="endDate">End Date</label>
            <input type="date" v-model="endDate" required />
          </div>
        </div>

        <div class="form-group">
          <label for="department">Department</label>
          <select v-model="department">
            <option value="">All Departments</option>
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
            <option value="Sales">Sales</option>
            <option value="Finance">Finance</option>
          </select>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            Generate Report
          </button>
        </div>
      </form>

      <!-- Loading Indicator -->
      <div v-if="loading" class="loading-message">
        <div class="loading-content">
          <span class="loading-spinner"></span>
          Loading report data...
        </div>
      </div>

      <!-- Report Table -->
      <div v-if="reportData.length" class="payroll-records">
        <div class="table-header">
          <h2>Report Results</h2>
          <button @click="exportPDF" class="btn btn-export">
            Export as PDF
          </button>
        </div>
        
        <table class="payroll-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Hours Worked</th>
              <th>Pay</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in reportData" :key="index">
              <td>{{ row.name }}</td>
              <td>{{ row.department }}</td>
              <td>{{ row.hours }}</td>
              <td class="net-cell">{{ row.pay | currency }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { jsPDF } from 'jspdf';

export default {
  data() {
    return {
      startDate: '',
      endDate: '',
      department: '',
      loading: false,
      reportData: [],
    };
  },
  methods: {
    async generateReport() {
      this.loading = true;
      try {
        // Simulate fetching data from an API
        this.reportData = await this.fetchPayrollData();
      } catch (error) {
        console.error('Error generating report:', error);
      } finally {
        this.loading = false;
      }
    },
    async fetchPayrollData() {
      // Simulated data fetching logic
      const data = [
        { name: 'John Doe', department: 'Engineering', hours: 160, pay: 5000 },
        { name: 'Jane Smith', department: 'Sales', hours: 150, pay: 4500 },
        { name: 'Alice Johnson', department: 'HR', hours: 140, pay: 4200 },
        { name: 'Bob Brown', department: 'Finance', hours: 130, pay: 3900 },
      ];

      // Filter data based on selected department
      if (this.department) {
        return data.filter((item) => item.department === this.department);
      }
      return data;
    },
    exportPDF() {
      const doc = new jsPDF();
      doc.text('Payroll Report', 20, 20);
      doc.autoTable({
        startY: 30,
        head: [['Employee', 'Department', 'Hours Worked', 'Pay']],
        body: this.reportData.map((row) => [
          row.name,
          row.department,
          row.hours,
          row.pay,
        ]),
      });
      doc.save('payroll_report.pdf');
    },
  },
  filters: {
    currency(value) {
      return '$' + value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
  }
};
</script>

<style scoped>
.payroll-system {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1.5rem;
}

.payroll-report {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
}

.table-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  margin: 0;
}

.payroll-form {
  padding: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.loading-message {
  padding: 2rem 1.5rem;
  text-align: center;
}

.loading-content {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 500;
  color: #4299e1;
}

.loading-spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(66, 153, 225, 0.2);
  border-top-color: #4299e1;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.payroll-records {
  margin-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.payroll-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.payroll-table th {
  background-color: #f7fafc;
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  border-bottom: 1px solid #e2e8f0;
}

.payroll-table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}

.payroll-table tr:last-child td {
  border-bottom: none;
}

.payroll-table tr:hover {
  background-color: #f8fafc;
}

.net-cell {
  font-weight: 500;
  color: #2f855a;
}

.btn {
  padding: 0.625rem 1.25rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background-color: #4299e1;
  color: white;
}

.btn-primary:hover {
  background-color: #3182ce;
}

.btn-export {
  background-color: #38a169;
  color: white;
}

.btn-export:hover {
  background-color: #2f855a;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .payroll-system {
    padding: 0 1rem;
  }
  
  .form-row {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .payroll-table th,
  .payroll-table td {
    padding: 0.75rem 1rem;
  }
}

@media (max-width: 480px) {
  .table-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
  }
  
  .payroll-form {
    padding: 1rem;
  }
  
  .form-actions {
    justify-content: center;
  }
}
</style>