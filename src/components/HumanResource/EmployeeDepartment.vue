<template>
  <div class="department-management-container">
    <!-- Header Section -->
    <div class="header-section">
      <h1 class="page-title">Department Management</h1>
      <div class="header-actions">
      <!--Dialog triggar button-->
        <button @click="openDialog" class="btn-primary">
          <i class="fas fa-plus mr-2"></i> Add Department
        </button>

        <!-- Search input -->
        <div class="search-box">
          <i class="fas fa-search search-icon"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search departments..." 
            class="search-input"
          >
        </div>
      </div>
    </div>

    <!-- Department Table -->
    <div class="table-container">
      <table class="department-table">
        <thead>
          <tr>
            <th class="text-left">ID</th>
            <th class="text-left">Department Name</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(department, index) in filteredDepartments" :key="department.id">
            <td>{{ department.id }}</td>
            <td>{{ department.departmentName }}</td>
            <td class="action-cell">
              <button 
                class="btn-icon btn-edit"
                @click="editDepartment(index)"
                title="Edit"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button 
                class="btn-icon btn-delete"
                @click="deleteDepartment(index)"
                title="Delete"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
          <tr v-if="filteredDepartments.length === 0">
            <td colspan="3" class="text-center py-4 text-gray-500">
              No departments found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Department Dialog -->
    <DialogDialog 
      :isOpen="isDialogOpen" 
      @close="closeDialog"
      @confirm="submitForm"
      :title="editingDepartment !== null ? 'Edit Department' : 'Add New Department'"
    >
      <form @submit.prevent="submitForm" class="department-form">
        <div class="form-group">
          <label>Department Name*</label>
          <input 
            type="text" 
            v-model="departmentName" 
            class="form-input"
            required
            placeholder="Enter department name"
          >
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
      editingDepartment: null,
      searchQuery: '',
      departmentName: '',
      departments: []
    };
  },
  computed: {
    filteredDepartments() {
      if (!this.searchQuery) return this.departments;
      const query = this.searchQuery.toLowerCase();
      return this.departments.filter(dept => 
        dept.departmentName.toLowerCase().includes(query)
      );
    }
  },
  methods: {
    openDialog() {
      this.clearForm();
      this.isDialogOpen = true;
      this.editingDepartment = null;
    },
    closeDialog() {
      this.isDialogOpen = false;
    },
    clearForm() {
      this.departmentName = '';
    },
    async submitForm() {
      const departmentData = {
        departmentName: this.departmentName
      };

      try {
        if (this.editingDepartment !== null) {
          // Update existing department
          const id = this.departments[this.editingDepartment].id;
          const response = await axios.put(`http://localhost:8085/api/department/${id}`, departmentData);
          this.departments.splice(this.editingDepartment, 1, response.data);
        } else {
          // Add new department
          const response = await axios.post('http://localhost:8085/api/department/post', departmentData);
          this.departments.push(response.data);
        }
        this.closeDialog();
        this.clearForm()
      } catch (error) {
        alert('Error submitting form: ' + error.message);
      }
    },
    editDepartment(index) {
      const department = this.departments[index];
      this.departmentName = department.departmentName;
      this.editingDepartment = index;
      this.isDialogOpen = true;
    },
    async deleteDepartment(index) {
      if (confirm('Are you sure you want to delete this department?')) {
        const department = this.departments[index];
        try {
          await axios.delete(`http://localhost:8085/api/department/${department.id}`);
          this.departments.splice(index, 1);
        } catch (error) {
          alert('Failed to delete department: ' + error.message);
        }
      }
    }
  },
  async mounted() {
    try {
      const response = await axios.get('http://localhost:8085/api/department/department');
      this.departments = response.data;
    } catch (error) {
      alert('Failed to fetch departments: ' + error.message);
    }
  }
};
</script>

<style scoped>
.department-management-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem;
}

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

.table-container {
  overflow-x: auto;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.department-table {
  width: 100%;
  border-collapse: collapse;
}

.department-table th {
  background-color: #f7fafc;
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  border-bottom: 1px solid #e2e8f0;
}

.department-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}

.department-table tr:hover {
  background-color: #f8fafc;
}

.action-cell {
  white-space: nowrap;
}

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

.department-form {
  padding: 1rem;
}

.form-group {
  margin-bottom: 1rem;
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
}
</style>