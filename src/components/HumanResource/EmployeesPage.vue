<template>
  <div class="app-container">
    <!-- Side Navigation -->
    <div class="sidenav">
      <div class="sidenav-header">
        <h3>Human Resource Admin</h3>
      </div>
      <ul class="nav-links">
        <li><a href="dashboard"><i class="bi bi-speedometer2"></i> Dashboard</a></li>
        <li class="active"><a href="#"><i class="bi bi-people-fill"></i> Employees</a></li>
        <li><a href="#"><i class="bi bi-calendar-check"></i> Appointments</a></li>
        <li><a href="#"><i class="bi bi-file-medical"></i> Patient Records</a></li>
        <li><a href="#"><i class="bi bi-cash-stack"></i> Billing</a></li>
        <li><a href="#"><i class="bi bi-gear"></i> Settings</a></li>
      </ul>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <div class="container mt-4">
        <div class="table-wrapper bg-white p-4 shadow rounded">
          <!-- Title & Actions -->
          <div class="table-title bg-primary text-white p-3 rounded-top mb-3">
            <div class="row">
              <div class="col-sm-6">
                <h2>Manage <b>Employees</b></h2>
              </div>
              <div class="col-sm-6 text-end">
                <button class="btn btn-success me-2" @click="showAddModal = true">
                  <i class="bi bi-plus-circle"></i> <span>Add New Employee</span>
                </button>
                <button class="btn btn-danger" @click="showDeleteModal = true" :disabled="!selectedEmployees.length">
                  <i class="bi bi-trash"></i> <span>Delete</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Employee Table -->
          <div class="table-responsive">
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                  <th>
                    <input type="checkbox" class="form-check-input" v-model="selectAll" @change="toggleAll">
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(employee, index) in employees" :key="index">
                  <td>
                    <input type="checkbox" class="form-check-input" v-model="employee.selected">
                  </td>
                  <td>{{ employee.name }}</td>
                  <td>{{ employee.email }}</td>
                  <td>{{ employee.address }}</td>
                  <td>{{ employee.phone }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary me-2" @click="editEmployee(employee)">
                      <i class="bi bi-pencil"></i> Edit
                    </button>
                    <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(employee)">
                      <i class="bi bi-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination and Info -->
          <div class="d-flex justify-content-between align-items-center mt-3">
            <div class="hint-text">Showing <b>{{ employees.length }}</b> out of <b>{{ totalEmployees }}</b> entries</div>
            <nav aria-label="Page navigation">
              <ul class="pagination">
                <li class="page-item" :class="{ disabled: currentPage === 1 }">
                  <a class="page-link" href="#" @click.prevent="prevPage">Previous</a>
                </li>
                <li class="page-item" v-for="n in totalPages" :key="n" :class="{ active: n === currentPage }">
                  <a class="page-link" href="#" @click.prevent="goToPage(n)">{{ n }}</a>
                </li>
                <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                  <a class="page-link" href="#" @click.prevent="nextPage">Next</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>

      <!-- Modals -->
      <AddEmployeeModal 
        v-if="showAddModal" 
        @close="showAddModal = false" 
        @save="addEmployee"
      />
      
      <EditEmployeeModal 
        v-if="showEditModal" 
        :employee="currentEmployee" 
        @close="showEditModal = false" 
        @save="updateEmployee"
      />
      
      <DeleteEmployeeModal 
        v-if="showDeleteModal" 
        @close="showDeleteModal = false" 
        @confirm="deleteEmployees"
        :count="selectedEmployees.length"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import AddEmployeeModal from './AddEmployeeModal.vue'
import EditEmployeeModal from './EditEmployeeModal.vue'
import DeleteEmployeeModal from './DeleteEmployeeModal.vue'

// Sample data
const employees = ref([
  {
    id: 1,
    name: 'Thomas Hardy',
    email: 'thomashardy@mail.com',
    address: '89 Chiaroscuro Rd, Portland, USA',
    phone: '(171) 555-2222',
    selected: false,
  },
  {
    id: 2,
    name: 'Dominique Perrier',
    email: 'dominiqueperrier@mail.com',
    address: 'Obere Str. 57, Berlin, Germany',
    phone: '(313) 555-5735',
    selected: false,
  },
  {
    id: 3,
    name: 'Maria Anders',
    email: 'mariaanders@mail.com',
    address: '25, rue Lauriston, Paris, France',
    phone: '(503) 555-9931',
    selected: false,
  },
  {
    id: 4,
    name: 'Fran Wilson',
    email: 'franwilson@mail.com',
    address: 'C/ Araquil, 67, Madrid, Spain',
    phone: '(204) 619-5731',
    selected: false,
  },
  {
    id: 5,
    name: 'Martin Blank',
    email: 'martinblank@mail.com',
    address: 'Via Monte Bianco 34, Turin, Italy',
    phone: '(480) 631-2097',
    selected: false,
  }
])

// UI State
const selectAll = ref(false)
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const currentEmployee = ref(null)
const currentPage = ref(1)
const itemsPerPage = 10
const totalEmployees = ref(25)

// Computed properties
const selectedEmployees = computed(() => employees.value.filter(emp => emp.selected))
const totalPages = computed(() => Math.ceil(totalEmployees.value / itemsPerPage))

// Methods
function toggleAll() {
  employees.value.forEach(emp => (emp.selected = selectAll.value))
}

function editEmployee(employee) {
  currentEmployee.value = { ...employee }
  showEditModal.value = true
}

function confirmDelete(employee) {
  if (employee) {
    // Single employee deletion
    currentEmployee.value = employee
  }
  showDeleteModal.value = true
}

function addEmployee(newEmployee) {
  employees.value.unshift({
    id: employees.value.length + 1,
    ...newEmployee,
    selected: false
  })
  showAddModal.value = false
}

function updateEmployee(updatedEmployee) {
  const index = employees.value.findIndex(e => e.id === updatedEmployee.id)
  if (index !== -1) {
    employees.value[index] = updatedEmployee
  }
  showEditModal.value = false
}

function deleteEmployees() {
  if (currentEmployee.value) {
    // Single deletion
    employees.value = employees.value.filter(e => e.id !== currentEmployee.value.id)
  } else {
    // Multiple deletion
    employees.value = employees.value.filter(e => !e.selected)
  }
  selectAll.value = false
  showDeleteModal.value = false
  currentEmployee.value = null
}

function goToPage(page) {
  currentPage.value = page
  // Here you would typically fetch data for the page
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    // Here you would typically fetch data for the next page
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    // Here you would typically fetch data for the previous page
  }
}
</script>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
}

/* Side Navigation Styles */
.sidenav {
  width: 250px;
  background: #2c3e50;
  color: white;
  height: 100vh;
  position: fixed;
  overflow-y: auto;
}

.sidenav-header {
  padding: 20px;
  text-align: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.sidenav-header h3 {
  margin: 0;
  font-size: 1.2rem;
}

.nav-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-links li {
  padding: 12px 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.nav-links li.active {
  background: #34495e;
}

.nav-links li a {
  color: #ecf0f1;
  text-decoration: none;
  display: flex;
  align-items: center;
}

.nav-links li a i {
  margin-right: 10px;
  font-size: 1.1rem;
}

.nav-links li:hover {
  background: #34495e;
}

/* Main Content Styles */
.main-content {
  margin-left: 250px;
  width: calc(100% - 250px);
  padding: 20px;
  background: #f5f7fa;
  min-height: 100vh;
}

.table-wrapper {
  border-radius: 1px;
  overflow: hidden;
}

.table-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-responsive {
  overflow-x: auto;
}

.table {
  margin-bottom: 0;
}

.table th {
  font-weight: 600;
  white-space: nowrap;
}

.table td, .table th {
  vertical-align: middle;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-danger {
  background-color: #dc3545;
  border-color: #dc3545;
}

.btn-outline-primary {
  color: #007bff;
  border-color: #007bff;
}

.btn-outline-danger {
  color: #dc3545;
  border-color: #dc3545;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}

.pagination {
  margin-bottom: 0;
}

.page-item.active .page-link {
  background-color: #007bff;
  border-color: #007bff;
}

.page-link {
  color: #007bff;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .sidenav {
    width: 70px;
  }
  
  .sidenav-header h3, .nav-links li span {
    display: none;
  }
  
  .nav-links li a {
    justify-content: center;
  }
  
  .nav-links li a i {
    margin-right: 0;
    font-size: 1.3rem;
  }
  
  .main-content {
    margin-left: 70px;
    width: calc(100% - 70px);
  }
  
  .table-title .btn span {
    display: none;
  }
  
  .table-title .btn i {
    margin-right: 0;
  }
}
</style>