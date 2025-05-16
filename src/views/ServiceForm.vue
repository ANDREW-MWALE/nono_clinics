<template>
  <div>
    <DialogDialog :isOpen="isDialogOpen" @close="closeDialog" @confirm="addService" title="Add Service">
      <template #default>
        <form @submit.prevent="addService">
          <div class="form-group">
            <label>Service Name *</label>
            <input type="text" v-model="formData.serviceName" required>
          </div>
          <div class="form-group">
            <label>Department *</label>
            <input type="text" v-model="formData.department" required>
          </div>
          <div class="form-group">
            <label>Payment Category *</label>
            <select v-model="formData.paymentCategory" required>
              <option value="" disabled>Select a category</option>
              <option v-for="category in paymentCategories" 
                      :key="category.PID" 
                      :value="category.categoryName">
                {{ category.categoryName }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Amount *</label>
            <input type="number" v-model="formData.amount" min="0" step="0.01" required>
          </div>
        </form>
      </template>
    </DialogDialog>

    <button @click="openDialog" class="open-dialog-btn">Add New Service</button>

    <div>
      <h2>Service List</h2>
      <table class="service-table">
        <thead>
          <tr>
            <th>Service Name</th>
            <th>Department</th>
            <th>Payment Category</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="service in services" :key="service.id">
            <td>{{ service.serviceName }}</td>
            <td>{{ service.department }}</td>
            <td>{{ service.paymentCategory }}</td>
            <td>${{ service.amount.toFixed(2) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import DialogDialog from '@/components/DialogDialog.vue';

export default {
  components: { DialogDialog },
  data() {
    return {
      isDialogOpen: false,
      services: [],
      paymentCategories: [],
      formData: {
        serviceName: '',
        department: '',
        paymentCategory: '',
        amount: 0
      }
    };
  },
  created() {
    this.fetchServices();
    this.fetchPaymentCategories();
  },
  methods: {
    openDialog() {
      this.isDialogOpen = true;
    },
    closeDialog() {
      this.isDialogOpen = false;
      this.resetForm();
    },
    resetForm() {
      this.formData = {
        serviceName: '',
        department: '',
        paymentCategory: '',
        amount: 0
      };
    },
    async fetchServices() {
      try {
        const response = await axios.get('http://localhost:8085/api/services');
        this.services = response.data;
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    },
    async fetchPaymentCategories() {
      try {
        const response = await axios.get('http://localhost:8085/api/paymentCategory/list');
        this.paymentCategories = response.data;
      } catch (error) {
        console.error('Error fetching payment categories:', error);
      }
    },
    async addService() {
      try {
        // Validate required fields
        if (!this.formData.paymentCategory) {
          throw new Error('Payment category is required');
        }

        const payload = {
          serviceName: this.formData.serviceName.trim(),
          department: this.formData.department.trim(),
          paymentCategory: this.formData.paymentCategory,
          amount: parseFloat(this.formData.amount)
        };

        const response = await axios.post('http://localhost:8085/api/services', payload);
        this.services.push(response.data);
        this.closeDialog();
      } catch (error) {
        console.error('Error adding service:', error);
        alert(error.response?.data?.message || error.message || 'Failed to add service');
      }
    }
  }
}
</script>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group select {
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 0.5rem center;
  background-size: 1em;
}

.open-dialog-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 20px;
}

.service-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.service-table th, .service-table td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
}

.service-table th {
  background-color: #f4f4f4;
}

.service-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.service-table tr:hover {
  background-color: #f1f1f1;
}
</style>