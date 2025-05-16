<template>
  <div class="staff-management">
    <h1>Staff Management</h1>

    <div class="form-container">
      <!-- Form is now placed in its own container -->
      <form class="staff-form" @submit.prevent="addStaff">
        <input v-model="newStaff.staffName" placeholder="Staff Name" class="input-field" />
        <input v-model="newStaff.position" placeholder="Position" class="input-field" />
        <button type="submit" class="submit-button">Add Staff</button>
      </form>
    </div>

    <div class="table-container">
      <table class="staff-table">
        <thead>
          <tr>
            <th>Staff Name</th>
            <th>Position</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="staff in staffList" :key="staff.id">
            <td>{{ staff.staffName }}</td>
            <td>{{ staff.position }}</td>
            <td>
              <button class="delete-button" @click="deleteStaff(staff.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import StaffService from '../services/StaffService';

export default {
  data() {
    return {
      staffList: [],
      newStaff: {
        staffName: '',
        position: '',
        location: '',
        department: '',
      },
    };
  },
  methods: {
    fetchStaff() {
      StaffService.getAllStaff().then((response) => {
        this.staffList = response.data;
      });
    },
    addStaff() {
      StaffService.createStaff(this.newStaff).then(() => {
        this.fetchStaff();
      });
    },
    deleteStaff(id) {
      StaffService.deleteStaff(id).then(() => {
        this.fetchStaff();
      });
    },
  },
  mounted() {
    this.fetchStaff();
  },
};
</script>

<style scoped>
.staff-management {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column; /* Stack form and table vertically */
  gap: 20px; /* Space between form and table */
}

h1 {
  text-align: center;
  color: #333;
  margin-bottom: 20px;
}

.form-container {
  display: flex; /* Align items in the form container */
  justify-content: flex-start; /* Align items to the left */
}

.staff-form {
  display: flex;
  gap: 10px;
  margin-bottom: 20px; /* Add margin to separate the form from the table */
}

.input-field {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.submit-button {
  background-color: #28a745;
  color: white;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
}

.submit-button:hover {
  background-color: #218838;
}

.table-container {
  width: 100%; /* Make the table take full width */
}

.staff-table {
  width: 100%;
  border-collapse: collapse;
}

.staff-table th,
.staff-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
}

.staff-table th {
  background-color: #007bff;
  color: white;
}

.staff-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.delete-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
}

.delete-button:hover {
  background-color: #c82333;
}
</style>
