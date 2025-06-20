<template>
  <div class="positions-management-container">
    <!-- Header Section -->
    <div class="header-section">
      <h1 class="page-title">Employee Positions Management</h1>
      <div class="header-actions">
        <button @click="openDialog" class="btn-primary">
          <i class="fas fa-plus mr-2"></i> Add Position
        </button>
        <div class="search-box">
          <i class="fas fa-search search-icon"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search positions..." 
            class="search-input"
          >
        </div>
      </div>
    </div>

    <!-- Positions Table -->
    <div class="table-container">
      <table class="positions-table">
        <thead>
          <tr>
            <th class="text-left">ID</th>
            <th class="text-left">Position Name</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(position, index) in filteredPositions" :key="position.id">
            <td>{{ position.id }}</td>
            <td>{{ position.position }}</td>
            <td class="action-cell">
              <button 
                class="btn-icon btn-edit"
                @click="editPosition(index)"
                title="Edit"
              >
                <i class="fas fa-edit"></i>
              </button>
              <button 
                class="btn-icon btn-delete"
                @click="deletePosition(index)"
                title="Delete"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
          <tr v-if="filteredPositions.length === 0">
            <td colspan="3" class="text-center py-4 text-gray-500">
              No positions found
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Position Dialog -->
    <DialogDialog 
      :isOpen="isDialogOpen" 
      @close="closeDialog"
      @confirm="submitForm"
      :title="editingPosition !== null ? 'Edit Position' : 'Add New Position'"
    >
      <form @submit.prevent="submitForm" class="position-form">
        <div class="form-group">
          <label>Position Name*</label>
          <input 
            type="text" 
            v-model="positionName" 
            class="form-input"
            required
            placeholder="Enter position name"
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
      editingPosition: null,
      searchQuery: '',
      positionName: '',
      positions: []
    };
  },
  computed: {
    filteredPositions() {
      if (!this.searchQuery) return this.positions;
      const query = this.searchQuery.toLowerCase();
      return this.positions.filter(pos => 
        pos.position.toLowerCase().includes(query)
      );
    }
  },
  methods: {
    openDialog() {
      this.clearForm();
      this.isDialogOpen = true;
      this.editingPosition = null;
    },
    closeDialog() {
      this.isDialogOpen = false;
    },
    clearForm() {
      this.positionName = '';
    },
    async submitForm() {
      const positionData = {
        position: this.positionName
      };

      try {
        if (this.editingPosition !== null) {
          // Update existing position
          const id = this.positions[this.editingPosition].id;
          const response = await axios.put(`http://localhost:8085/api/positions/${id}`, positionData);
          this.positions.splice(this.editingPosition, 1, response.data);
        } else {
          // Add new position
          const response = await axios.post('http://localhost:8085/api/positions/post', positionData);
          this.positions.push(response.data);
        }
        this.closeDialog();
        this.clearForm();
      } catch (error) {
        alert('Error submitting form: ' + error.message);
      }
    },
    editPosition(index) {
      const position = this.positions[index];
      this.positionName = position.position;
      this.editingPosition = index;
      this.isDialogOpen = true;
    },
    async deletePosition(index) {
      if (confirm('Are you sure you want to delete this position?')) {
        const position = this.positions[index];
        try {
          await axios.delete(`http://localhost:8085/api/positions/${position.id}`);
          this.positions.splice(index, 1);
        } catch (error) {
          alert('Failed to delete position: ' + error.message);
        }
      }
    }
  },
  async mounted() {
    try {
      const response = await axios.get('http://localhost:8085/api/positions/get');
      this.positions = response.data;
    } catch (error) {
      alert('Failed to fetch positions: ' + error.message);
    }
  }
};
</script>

<style scoped>
/* Your existing styles will work fine, just rename department to position where needed */
.positions-management-container {
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

.positions-table {
  width: 100%;
  border-collapse: collapse;
}

.positions-table th {
  background-color: #f7fafc;
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  border-bottom: 1px solid #e2e8f0;
}

.positions-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}

.positions-table tr:hover {
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

.position-form {
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