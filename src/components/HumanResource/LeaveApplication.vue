<template>
  <div class="leave-management-container">
    <!-- Header Section -->
    <div class="header-section">
      <h1 class="page-title">Leave Management System</h1>
      <div class="header-actions">
        <button class="btn-primary" @click="openDialog" :disabled="isLoading">
          <i class="fas fa-plus-circle mr-2"></i> 
          {{ isLoading ? 'Processing...' : 'Apply for Leave' }}
        </button>
        <div class="search-box">
          <i class="fas fa-search search-icon"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search leaves..." 
            class="search-input"
          >
        </div>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-value">{{ pendingLeavesCount }}</div>
        <div class="stat-label">Pending Requests</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ approvedLeavesCount }}</div>
        <div class="stat-label">Approved</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ rejectedLeavesCount }}</div>
        <div class="stat-label">Rejected</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">{{ leaveBalance }}</div>
        <div class="stat-label">Days Remaining</div>
      </div>
    </div>

    <!-- Leave Table -->
    <div class="table-container">
      <table class="leave-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Leave Type</th>
            <th>Date Range</th>
            <th>Days</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Balance</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(leave, index) in filteredLeaves" :key="leave.id">
            <td>
              <div class="employee-info">
                <div class="employee-name">{{ leave.employeeName }}</div>
                <div class="employee-id">ID: {{ leave.employeeId }}</div>
              </div>
            </td>
            <td>
              <span class="leave-type">
                {{ leave.leaveType }}
              </span>
            </td>
            <td>
              <div>{{ formatDate(leave.startDate) }}</div>
              <div>to</div>
              <div>{{ formatDate(leave.endDate) }}</div>
            </td>
            <td>{{ leave.leaveDays }}</td>
            <td>
              <div class="reason-text">{{ leave.reason }}</div>
            </td>
            <td>
              <span class="status-badge">
                {{ leave.status }}
              </span>
            </td>
            <td>{{ leave.leaveBalance }}</td>
            <td>
              <button 
                v-if="isHR || leave.status === 'PENDING'"
                class="btn-icon btn-edit"
                @click="editLeave(index)"
                :disabled="isLoading"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button 
                v-if="isHR"
                class="btn-icon btn-delete"
                @click="confirmDelete(index)"
                :disabled="isLoading"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
              <button 
                v-if="isHR && leave.status === 'PENDING'"
                class="btn-icon btn-approve"
                @click="updateStatus(index, 'APPROVED')"
                :disabled="isLoading"
              >
                <i class="fas fa-check"></i>
              </button>
              <button 
                v-if="isHR && leave.status === 'PENDING'"
                class="btn-icon btn-reject"
                @click="updateStatus(index, 'REJECTED')"
                :disabled="isLoading"
              >
                <i class="fas fa-times"></i>
              </button>
            </td>
          </tr>
          <tr v-if="filteredLeaves.length === 0">
            <td colspan="8">No leave records found</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Leave Application Dialog -->
    <div v-if="isDialogOpen" class="dialog-overlay">
      <div class="dialog-content">
        <div class="dialog-header">
          <h3>{{ editingIndex !== null ? 'Edit Leave' : 'Apply for Leave' }}</h3>
          <button class="dialog-close" @click="closeDialog" :disabled="isLoading">
            <i class="fas fa-times"></i>
          </button>
        </div>
        
        <div class="dialog-body">
          <div class="form-grid">
            <!-- Employee Search -->
            <div class="form-group col-span-2">
              <label>Search Employee*</label>
              <input 
                type="text" 
                v-model="employeeSearch" 
                @input="searchEmployees"
                @focus="showEmployeeDropdown = true"
                @blur="handleBlur"
                class="form-input"
                placeholder="Type employee name or ID"
                required
                :disabled="isHR && editingIndex !== null"
              >
              <div v-if="showEmployeeDropdown" class="employee-dropdown">
                <div v-if="isSearching" class="dropdown-message">
                  <span>Searching employees...</span>
                </div>
                <div v-else-if="filteredEmployees.length === 0" class="dropdown-message">
                  <span>No employees found</span>
                </div>
                <div 
                  v-else
                  v-for="(employee, index) in filteredEmployees" 
                  :key="employee.id"
                  @click="selectEmployee(employee)"
                  class="dropdown-item"
                >
                  {{ employee.employeeName }} ({{ employee.position }})
                </div>
              </div>
            </div>
            
            <!-- Employee Info (auto-filled) -->
            <div class="form-group">
              <label>Employee Name</label>
              <input 
                type="text" 
                v-model="employeeName" 
                class="form-input"
                readonly
                required
              >
            </div>
            
            <div class="form-group">
              <label>Employee ID</label>
              <input 
                type="text" 
                v-model="employeeId" 
                class="form-input"
                readonly
                required
              >
            </div>
            
            <!-- Leave Details -->
            <div class="form-group">
              <label>Leave Type</label>
              <select v-model="leaveType" class="form-input" required>
                <option value="ANNUAL">Annual Leave</option>
                <option value="SICK">Sick Leave</option>
                <option value="MATERNITY">Maternity Leave</option>
                <option value="PATERNITY">Paternity Leave</option>
                <option value="EMERGENCY">Emergency Leave</option>
                <option value="UNPAID">Unpaid Leave</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Start Date</label>
              <input 
                type="date" 
                v-model="startDate" 
                class="form-input"
                @change="calculateLeaveDays"
                required
              >
            </div>
            
            <div class="form-group">
              <label>End Date</label>
              <input 
                type="date" 
                v-model="endDate" 
                class="form-input"
                @change="calculateLeaveDays"
                required
              >
            </div>
            
            <div class="form-group">
              <label>Days Requested</label>
              <input 
                type="text" 
                v-model="leaveDays" 
                class="form-input"
                readonly
              >
            </div>
            
            <div class="form-group">
              <label>Current Balance</label>
              <input 
                type="text" 
                v-model="leaveBalance" 
                class="form-input"
                readonly
              >
            </div>
            
            <!-- Status (HR only) -->
            <div class="form-group" v-if="isHR">
              <label>Status</label>
              <select v-model="status" class="form-input">
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            
            <!-- Reason -->
            <div class="form-group col-span-2">
              <label>Reason for Leave</label>
              <textarea 
                v-model="reason" 
                class="form-textarea"
                rows="3"
                placeholder="Please provide details for your leave request"
                required
              ></textarea>
            </div>
          </div>
        </div>
        
        <div class="dialog-footer">
          <button class="btn-secondary" @click="closeDialog" :disabled="isLoading">
            Cancel
          </button>
          <button class="btn-primary" @click="saveLeave" :disabled="isLoading">
            {{ isLoading ? 'Processing...' : (editingIndex !== null ? 'Update' : 'Submit') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

const DEFAULT_LEAVE_DAYS = 28;

export default {
  data() {
    return {
      leaves: [],
      employeeSearch: '',
      employees: [],
      filteredEmployees: [],
      showEmployeeDropdown: false,
      isSearching: false,
      searchDebounce: null,
      employeeName: '',
      employeeId: '',
      leaveType: 'ANNUAL',
      startDate: '',
      endDate: '',
      leaveDays: 0,
      reason: '',
      status: 'PENDING',
      leaveBalance: DEFAULT_LEAVE_DAYS,
      editingIndex: null,
      isDialogOpen: false,
      isHR: true,
      searchQuery: '',
      isLoading: false,
      error: null
    }
  },
  computed: {
    filteredLeaves() {
      if (!this.searchQuery) return this.leaves;
      const query = this.searchQuery.toLowerCase();
      return this.leaves.filter(leave => 
        leave.employeeName.toLowerCase().includes(query) ||
        leave.employeeId.toLowerCase().includes(query) ||
        leave.leaveType.toLowerCase().includes(query) ||
        leave.reason.toLowerCase().includes(query) ||
        leave.status.toLowerCase().includes(query)
      );
    },
    pendingLeavesCount() {
      return this.leaves.filter(l => l.status === 'PENDING').length;
    },
    approvedLeavesCount() {
      return this.leaves.filter(l => l.status === 'APPROVED').length;
    },
    rejectedLeavesCount() {
      return this.leaves.filter(l => l.status === 'REJECTED').length;
    }
  },
  created() {
    this.fetchLeaves();
    this.fetchCurrentUser();
  },
  methods: {
    async searchEmployees() {
      clearTimeout(this.searchDebounce);
      
      if (this.employeeSearch.length < 2) {
        this.filteredEmployees = [];
        this.showEmployeeDropdown = false;
        return;
      }

      this.isSearching = true;
      this.showEmployeeDropdown = true;

      this.searchDebounce = setTimeout(async () => {
        try {
          const response = await axios.get('http://localhost:8085/api/auth/register', {
            params: { query: this.employeeSearch }
          });
          this.filteredEmployees = response.data.slice(0, 5);
        } catch (error) {
          console.error('Employee search error:', error);
          this.filteredEmployees = [];
        } finally {
          this.isSearching = false;
        }
      }, 300);
    },

    selectEmployee(employee) {
      this.employeeId = employee.id;
      this.employeeName = employee.employeeName;
      this.employeeSearch = employee.employeeName;
      this.showEmployeeDropdown = false;
      this.fetchLeaveBalance(employee.id);
    },

    handleBlur() {
      setTimeout(() => {
        this.showEmployeeDropdown = false;
      }, 200);
    },

    async fetchLeaveBalance(employeeId) {
      try {
        const response = await axios.get(`http://localhost:8085/api/leaves/balance/${employeeId}`);
        this.leaveBalance = response.data.balance || DEFAULT_LEAVE_DAYS;
      } catch (error) {
        console.error('Error fetching leave balance:', error);
        this.leaveBalance = DEFAULT_LEAVE_DAYS;
      }
    },

    validateLeaveRequest() {
      if (!this.employeeId || !this.employeeName) {
        throw new Error('Employee information is required');
      }
      if (!this.startDate || !this.endDate) {
        throw new Error('Please select both start and end dates');
      }
      if (new Date(this.startDate) > new Date(this.endDate)) {
        throw new Error('End date must be after start date');
      }
      if (!this.reason.trim()) {
        throw new Error('Please provide a reason for leave');
      }
      if (this.leaveDays <= 0) {
        throw new Error('Invalid leave duration');
      }
      if (this.leaveDays > this.leaveBalance && this.leaveType !== 'UNPAID') {
        throw new Error('Requested days exceed available balance');
      }
    },

    async saveLeave() {
      this.isLoading = true;
      this.error = null;
      
      try {
        this.validateLeaveRequest();
        
        const leaveData = {
          employeeId: this.employeeId,
          employeeName: this.employeeName,
          leaveType: this.leaveType,
          startDate: this.startDate,
          endDate: this.endDate,
          leaveDays: Number(this.leaveDays),
          reason: this.reason,
          status: this.status,
          leaveBalance: this.leaveBalance - (this.leaveType !== 'UNPAID' ? this.leaveDays : 0)
        };

        let response;
        if (this.editingIndex !== null) {
          const leaveId = this.leaves[this.editingIndex].id;
          response = await axios.put(`http://localhost:8085/api/leaves/${leaveId}`, leaveData);
          this.leaves.splice(this.editingIndex, 1, response.data);
        } else {
          response = await axios.post('http://localhost:8085/api/leaves', leaveData);
          this.leaves.push(response.data);
        }

        this.closeDialog();
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        alert(this.error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchCurrentUser() {
      try {
        const response = await axios.get('http://localhost:8085/api/auth/current-user');
        this.employeeId = response.data.employeeId;
        this.employeeName = response.data.name;
        this.isHR = response.data.roles.includes('HR');
        this.fetchLeaveBalance(this.employeeId);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    },

    async fetchLeaves() {
      try {
        let url = 'http://localhost:8085/api/leaves';
        if (!this.isHR) {
          url += `/employee/${this.employeeId}`;
        }
        const response = await axios.get(url);
        this.leaves = response.data;
      } catch (error) {
        console.error('Error fetching leaves:', error);
      }
    },

    openDialog() {
      this.resetForm();
      this.isDialogOpen = true;
    },

    closeDialog() {
      if (!this.isLoading) {
        this.isDialogOpen = false;
      }
    },

    resetForm() {
      this.employeeSearch = '';
      this.employeeName = '';
      this.employeeId = '';
      this.leaveType = 'ANNUAL';
      this.startDate = '';
      this.endDate = '';
      this.leaveDays = 0;
      this.reason = '';
      this.status = 'PENDING';
      this.leaveBalance = DEFAULT_LEAVE_DAYS;
      this.editingIndex = null;
      this.error = null;
      this.filteredEmployees = [];
      this.showEmployeeDropdown = false;
    },

    calculateLeaveDays() {
      if (this.startDate && this.endDate) {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        const diffTime = Math.abs(end - start);
        this.leaveDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      } else {
        this.leaveDays = 0;
      }
    },

    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },

    editLeave(index) {
      const leave = this.leaves[index];
      this.editingIndex = index;
      this.employeeName = leave.employeeName;
      this.employeeId = leave.employeeId;
      this.leaveType = leave.leaveType;
      this.startDate = leave.startDate.split('T')[0];
      this.endDate = leave.endDate.split('T')[0];
      this.leaveDays = leave.leaveDays;
      this.reason = leave.reason;
      this.status = leave.status;
      this.leaveBalance = leave.leaveBalance;
      this.isDialogOpen = true;
    },

    async confirmDelete(index) {
      if (confirm('Are you sure you want to delete this leave record?')) {
        this.isLoading = true;
        try {
          const leaveId = this.leaves[index].id;
          await axios.delete(`http://localhost:8085/api/leaves/${leaveId}`);
          this.leaves.splice(index, 1);
        } catch (error) {
          console.error('Error deleting leave:', error);
          alert('Failed to delete leave record');
        } finally {
          this.isLoading = false;
        }
      }
    },

    async updateStatus(index, newStatus) {
      this.isLoading = true;
      try {
        const leaveId = this.leaves[index].id;
        const response = await axios.put(`http://localhost:8085/api/leaves/${leaveId}/status`, {
          status: newStatus
        });
        this.leaves.splice(index, 1, response.data);
      } catch (error) {
        console.error('Error updating leave status:', error);
        alert('Failed to update leave status');
      } finally {
        this.isLoading = false;
      }
    }
  },
  watch: {
    searchQuery(newVal) {
      if (newVal) {
        this.searchLeaves();
      } else {
        this.fetchLeaves();
      }
    },
    leaveType(newVal) {
      if (this.isDialogOpen && this.employeeId) {
        this.fetchLeaveBalance(this.employeeId);
      }
    }
  }
}
</script>

<style scoped>
/* Main Container */
.leave-management-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

/* Header Section */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3748;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  color: #718096;
}

.search-input {
  padding: 0.5rem 1rem 0.5rem 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  width: 250px;
}

.search-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

/* Stats Cards */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
}

.stat-label {
  font-size: 0.875rem;
  color: #718096;
}

/* Table Styles */
.table-container {
  overflow-x: auto;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.leave-table {
  width: 100%;
  border-collapse: collapse;
}

.leave-table th {
  background-color: #f7fafc;
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  border-bottom: 1px solid #e2e8f0;
}

.leave-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}

.leave-table tr:hover {
  background-color: #f8fafc;
}

/* Special Cell Styles */
.employee-cell {
  min-width: 180px;
}

.employee-info {
  display: flex;
  flex-direction: column;
}

.employee-name {
  font-weight: 500;
}

.employee-id {
  font-size: 0.75rem;
  color: #718096;
}

.reason-cell {
  max-width: 250px;
}

.reason-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.action-cell {
  white-space: nowrap;
}

/* Status Badges */
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-pending {
  background-color: #fef3c7;
  color: #92400e;
}

.status-approved {
  background-color: #d1fae5;
  color: #065f46;
}

status-rejected {
  background-color: #fee2e2;
  color: #991b1b;
}

/* Leave Type Badges */
.leave-type {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.type-annual {
  background-color: #dbeafe;
  color: #1e40af;
}

.type-sick {
  background-color: #fce7f3;
  color: #9d174d;
}

.type-emergency {
  background-color: #fee2e2;
  color: #b91c1c;
}

.type-maternity {
  background-color: #ede9fe;
  color: #5b21b6;
}

.type-paternity {
  background-color: #e0e7ff;
  color: #4338ca;
}

.type-unpaid {
  background-color: #e5e7eb;
  color: #4b5563;
}

/* Buttons */
.btn-primary {
  background-color: #4299e1;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-primary:hover:not(:disabled) {
  background-color: #3182ce;
}

.btn-primary:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #4a5568;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #cbd5e0;
}

.btn-secondary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-icon {
  padding: 0.375rem;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 0.125rem;
  transition: background-color 0.2s;
}

.btn-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-edit {
  color: #3182ce;
  background-color: #ebf8ff;
}

.btn-edit:hover:not(:disabled) {
  background-color: #bee3f8;
}

.btn-delete {
  color: #e53e3e;
  background-color: #fff5f5;
}

.btn-delete:hover:not(:disabled) {
  background-color: #fed7d7;
}

.btn-approve {
  color: #38a169;
  background-color: #f0fff4;
}

.btn-approve:hover:not(:disabled) {
  background-color: #c6f6d5;
}

.btn-reject {
  color: #c53030;
  background-color: #fff5f5;
}

.btn-reject:hover:not(:disabled) {
  background-color: #fed7d7;
}

/* Dialog Styles */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.dialog-content {
  background-color: white;
  border-radius: 0.5rem;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.dialog-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2d3748;
}

.dialog-close {
  color: #718096;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
}

.dialog-close:hover:not(:disabled) {
  color: #4a5568;
}

.dialog-close:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.dialog-body {
  padding: 1.5rem;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  gap: 0.75rem;
}

/* Form Styles */
.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group.col-span-2 {
  grid-column: span 2;
}

.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
}

.form-input {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.form-input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.form-textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  min-height: 80px;
}

.form-textarea:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .header-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .header-actions {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-input {
    width: 100%;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-group.col-span-2 {
    grid-column: span 1;
  }
}

/* Loading State */
@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;
}
</style>