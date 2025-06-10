<template>
  <div class="employee-management-container">
    <!-- Header Section -->
    <div class="header-section">
      <h1 class="page-title">Employee Management</h1>
      <div class="header-actions">
        <button @click="openDialog" class="btn-primary">
          <i class="fas fa-user-plus mr-2"></i> Add Employee
        </button>
        <div class="search-box">
          <i class="fas fa-search search-icon"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search employees..." 
            class="search-input"
          >
        </div>
      </div>
    </div>

    <!-- Employee Table -->
    <div class="table-container">
      <table class="employee-table">
        <thead>
          <tr>
            <th class="text-left">#</th>
            <th class="text-left">Employee</th>
            <th class="text-left">Contact</th>
            <th class="text-left">Department</th>
            <th class="text-left">Position</th>
            <th class="text-center">Type</th>
            <th class="text-center">Dates</th>
            <th class="text-center">Status</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(employee, index) in filteredEmployees" :key="index">
            <td>{{ employee.id }}</td>
            <td class="employee-cell">
              <div class="employee-info">
                <div class="employee-name">{{ employee.employeeName }}</div>
                <div class="employee-email">{{ employee.email }}</div>
              </div>
            </td>
            <td>
              <div class="contact-info">
                <div>{{ employee.contact }}</div>
                <div class="text-xs text-gray-500">{{ employee.address }}</div>
              </div>
            </td>
            <td>
              <span class="dept-badge" :class="`dept-${(employee.department || '').toLowerCase().replace(' ', '-')}`">
                {{ employee.department }}
              </span>
            </td>
            <td>{{ employee.position }}</td>
            <td class="text-center">
              <span class="emp-type" :class="`type-${(employee.type || '').toLowerCase()}`">
                {{ formatEmployeeType(employee.type) }}
              </span>
            </td>
            <td class="text-center">
              <div>{{ formatDate(employee.startDate) }}</div>
              <div class="text-xs text-gray-500">to</div>
              <div>{{ employee.endDate ? formatDate(employee.endDate) : 'Present' }}</div>
            </td>
            <td class="text-center">
              <span class="status-badge" :class="`status-${(employee.status || 'active').toLowerCase()}`">
                {{ employee.status || 'Active' }}
              </span>
            </td>
            <td class="action-cell">
              <button class="btn-icon btn-edit" @click="editTask(index)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn-icon btn-delete" @click="deleteTask(index)">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
          <tr v-if="filteredEmployees.length === 0">
            <td colspan="9" class="text-center py-4 text-gray-500">
              No employees found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Employee Dialog -->
    <DialogDialog 
      :isOpen="isDialogOpen" 
      @close="closeDialog"
      @confirm="submitForm"
      :title="editingEmployee !== null ? 'Edit Employee' : 'Add New Employee'"
    >
      <form @submit.prevent="submitForm" class="employee-form">
        <div class="form-grid">
          <div class="form-group">
            <label>First Name*</label>
            <input 
              type="text" 
              v-model="employeeName" 
              class="form-input"
              required
              placeholder="John"
            >
          </div>
          
          <div class="form-group">
            <label>Email*</label>
            <input 
              type="email" 
              v-model="email" 
              class="form-input"
              required
              placeholder="john.doe@company.com"
            >
          </div>
          
          <div class="form-group">
            <label>Contact Number*</label>
            <input 
              type="tel" 
              v-model="contact" 
              class="form-input"
              required
              placeholder="+260 123 456 789"
            >
          </div>
          
          <div class="form-group col-span-2">
            <label>Address*</label>
            <input 
              type="text" 
              v-model="address" 
              class="form-input"
              required
              placeholder="123 Main St, Lusaka"
            >
          </div>
          
          <div class="form-group">
  <label>Department*</label>
  <select v-model="department" class="form-input" required @focus="loadDepartmentsIfEmpty">
    <option disabled value="">Select Department</option>
    <option v-if="isLoadingDepartments" disabled>Loading departments...</option>
    <option 
      v-for="dept in departmentList" 
      :key="dept.id" 
      :value="dept.departmentName" 
    >
      {{ dept.departmentName }}  <!-- Changed this line -->
    </option>
  </select>
</div>
          <div class="form-group">
            <label>Position*</label>
            <input 
              type="text" 
              v-model="position" 
              class="form-input"
              required
              placeholder="Software Developer"
            >
          </div>
          
          <div class="form-group">
            <label>Employee Type*</label>
            <select v-model="type" class="form-input" required>
              <option disabled value="">Select Type</option>
              <option 
                v-for="empType in employeeTypes" 
                :key="empType.id" 
                :value="empType.employeeType"
              >
                {{ empType.employeeType }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label>Start Date*</label>
            <input 
              type="date" 
              v-model="startDate" 
              class="form-input"
              required
            >
          </div>
          
          <div class="form-group">
            <label>End Date</label>
            <input 
              type="date" 
              v-model="endDate" 
              class="form-input"
              :disabled="type === 'permanent'"
            >
          </div>
          
          <div class="form-group">
            <label>Password*</label>
            <input 
              type="password" 
              v-model="password" 
              class="form-input"
              required
              placeholder="Enter your password"
            >
          </div>
          
          <div class="form-group">
            <label>Confirm Password*</label>
            <input 
              type="password" 
              v-model="confirmPassword" 
              class="form-input"
              required
              placeholder="Confirm your password"
            >
          </div>
          
          <div class="form-group"> 
            <label>Role*</label>
            <select v-model="role" class="form-input" required>
              <option disabled value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="employee">Employee</option>
            </select>
          </div>
        </div>
      </form>
    </DialogDialog>
  </div>
</template>

<script>
import DialogDialog from '@/components/DialogDialog.vue';
import axios from 'axios';

export default {
  components: { DialogDialog },
  data() {
    return {
      isDialogOpen: false,
      editingEmployee: null,
      searchQuery: '',
      isLoadingDepartments: false,
      
      // Form fields
      employeeName: '',
      email: '',
      address: '',
      contact: '',
      department: '',
      position: '',
      type: '',
      startDate: '',
      endDate: '',
      password: '',
      confirmPassword: '',
      role: '',
      
      // Data lists
      departmentList: [],
      employeeTypes: [
        { id: 1, employeeType: "permanent" },
        { id: 2, employeeType: "contractual" },
        { id: 3, employeeType: "part-time" }
      ],
      
      // Employees data
      employees: []
    };
  },
  computed: {
    filteredEmployees() {
      if (!this.searchQuery) return this.employees;
      const query = this.searchQuery.toLowerCase();
      return this.employees.filter(employee => 
        (employee.employeeName?.toLowerCase().includes(query) ||
        employee.email?.toLowerCase().includes(query) ||
        employee.contact?.toLowerCase().includes(query) ||
        employee.department?.toLowerCase().includes(query) ||
        employee.position?.toLowerCase().includes(query)))
    }
  },
  methods: {
    async loadDepartmentsIfEmpty() {
      if (this.departmentList.length === 0) {
        await this.departmentOptions();
      }
    },
    
    async departmentOptions() {
  this.isLoadingDepartments = true;
  try {
    const response = await axios.get(`http://localhost:8085/api/department/department`);
    
    // Directly use the array response
    this.departmentList = response.data;
    
    if (this.departmentList.length === 0) {
      console.warn("No departments found, using fallback");
      this.useFallbackDepartments();
    }
  } catch (error) {
    console.error("Department fetch error:", error);
    this.useFallbackDepartments();
  } finally {
    this.isLoadingDepartments = false;
  }
},

useFallbackDepartments() {
  this.departmentList = [
    { id: 1, departmentName: "IT Department" },
    { id: 2, departmentName: "Human Resource" },
    { id: 3, departmentName: "Finance" }
  ];
},
    openDialog() {
      console.log('Open dialog clicked');
      this.clearForm();
      this.isDialogOpen = true;
      this.editingEmployee = null;
    },
    
    closeDialog() {
      this.isDialogOpen = false;
    },
    
    clearForm() {
      this.employeeName = '';
      this.email = '';
      this.address = '';
      this.contact = '';
      this.department = '';
      this.position = '';
      this.type = '';
      this.startDate = '';
      this.endDate = '';
      this.password = '';
      this.confirmPassword = '';
      this.role = '';
    },
    
    formatDate(date) {
      if (!date) return '';
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    
    formatEmployeeType(type) {
      if (!type) return '';
      return type.charAt(0).toUpperCase() + type.slice(1);
    },
    
    async submitForm() {
      if (this.password !== this.confirmPassword) {
        alert('Passwords do not match.');
        return;
      }
      
      const newEmployee = {
        employeeName: this.employeeName,
        email: this.email,
        address: this.address,
        contact: this.contact,
        department: this.department,
        position: this.position,
        type: this.type,
        startDate: this.startDate,
        endDate: this.endDate || null,
        password: this.password,
        role: this.role
      };

      try {
        if (this.editingEmployee !== null) {
          const id = this.employees[this.editingEmployee].id;
          const response = await axios.put(`http://localhost:8085/api/auth/${id}`, newEmployee);
          this.employees.splice(this.editingEmployee, 1, response.data);
        } else {
          const response = await axios.post('http://localhost:8085/api/auth/register', newEmployee);
          this.employees.push(response.data);
        }
        this.closeDialog();
        this.clearForm();
      } catch (error) {
        alert('Error submitting form: ' + error.message);
      }
    },
    
    editTask(index) {
      const employee = this.employees[index];
      this.employeeName = employee.employeeName;
      this.email = employee.email;
      this.address = employee.address;
      this.contact = employee.contact;
      this.department = employee.department;
      this.position = employee.position;
      this.type = employee.type;
      this.startDate = employee.startDate;
      this.endDate = employee.endDate;
      this.role = employee.role || '';
      this.password = '';
      this.confirmPassword = '';

      this.editingEmployee = index;
      this.isDialogOpen = true;
    },
    
    deleteTask(index) {
      if (confirm('Are you sure you want to delete this employee?')) {
        const employee = this.employees[index];
        axios.delete(`http://localhost:8085/api/auth/${employee.id}`)
          .then(() => {
            this.employees.splice(index, 1);
          })
          .catch(error => alert('Failed to delete employee: ' + error.message));
      }
    }
  },
  async mounted() {
    try {
      // Load employees
      const empResponse = await axios.get('http://localhost:8085/api/auth/register');
      this.employees = empResponse.data;
      console.log("Employees loaded:", this.employees);
      
      // Preload departments
      await this.departmentOptions();
    } catch (error) {
      console.error('Failed to initialize data:', error);
    }
  }
}
</script>
<style scoped>
/* Main Container */
.employee-management-container {
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

/* Table Styles */
.table-container {
  overflow-x: auto;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.employee-table {
  width: 100%;
  border-collapse: collapse;
}

.employee-table th {
  background-color: #f7fafc;
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  border-bottom: 1px solid #e2e8f0;
}

.employee-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}

.employee-table tr:hover {
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

.employee-email {
  font-size: 0.75rem;
  color: #718096;
}

.contact-info {
  display: flex;
  flex-direction: column;
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

.status-active {
  background-color: #d1fae5;
  color: #065f46;
}

.status-inactive {
  background-color: #fef3c7;
  color: #92400e;
}

/* Department Badges */
.dept-badge {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.dept-hr {
  background-color: #fce7f3;
  color: #9d174d;
}

.dept-it {
  background-color: #dbeafe;
  color: #1e40af;
}

.dept-finance {
  background-color: #dcfce7;
  color: #166534;
}

.dept-marketing {
  background-color: #fef3c7;
  color: #92400e;
}

/* Employee Type Badges */
.emp-type {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.type-permanent {
  background-color: #d1fae5;
  color: #065f46;
}

.type-contractual {
  background-color: #dbeafe;
  color: #1e40af;
}

.type-part-time {
  background-color: #fef3c7;
  color: #92400e;
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

.btn-primary:hover {
  background-color: #3182ce;
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
}

.btn-edit {
  color: #3182ce;
  background-color: #ebf8ff;
}

.btn-edit:hover {
  background-color: #bee3f8;
}

.btn-delete {
  color: #e53e3e;
  background-color: #fff5f5;
}

.btn-delete:hover {
  background-color: #fed7d7;
}

/* Form Styles */
.employee-form {
  padding: 1rem;
}

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
  
  .form-grid {
    grid-template-columns: 1fr;
  }
  
  .form-group.col-span-2 {
    grid-column: span 1;
  }
  
  .employee-table {
    display: block;
    overflow-x: auto;
  }
  select.form-input {
  appearance: menuList;
  height: auto;
  padding: 0.5rem;
  background-color: white;
}
/* Style for dropdown options */
select.form-input option {
  padding: 0.5rem;
}
}
</style>