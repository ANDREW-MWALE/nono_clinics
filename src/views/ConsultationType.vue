<template>
    <div>
      <!-- Consultation Type Dialog -->
      <DialogDialog :isOpen="isDialogOpen" @close="closeDialog" @confirm="addConsultationType" title="Add Consultation Type">
        <template #default>
          <!-- Consultation Type Form inside Dialog -->
          <form @submit.prevent="addConsultationType">
            <div class="form-group">
              <label for="consultation-type">Consultation Type</label><br>
              <input type="text" v-model="consultation_type" placeholder="Enter consultation type" required>
            </div>
            <div class="form-group">
              <label for="payment-category">Payement category</label><br>
              <select v-model="payment_category" placeholder="Select charge" required>
                <option value="" disabled>Select charge</option>
                <option value="Low">NHIMA</option>
                <option value="Medium">CASH</option>
                <option value="High">INSURANCE</option>
                <option value="">REGISTERED MEMBER</option>
              </select>
            </div>
            <div class="form-group">
              <label for="consultation-type-amount">Consultation Type Amount</label><br>
              <input type="number" v-model="Consultation_type_mount" placeholder="Enter amount" required>
            </div>
          </form>
        </template>
      </DialogDialog>
  
      <!-- Button to open the dialog -->
      <button @click="openDialog" class="open-dialog-btn">Add New Consultation Type</button>
  
      <!-- Consultation Type List in Table -->
      <div>
      <h2>Consultation Type List</h2>
      <table class="consultation-table">
        <thead>
          <tr>
            <th>Consultation Type</th>
            <th>Payment Category</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(consultation, index) in consultationTypes" :key="index">
            <td>{{ consultation.consultation_type }}</td>
            <td>{{ consultation.payment_category }}</td>
            <td>{{ consultation.amount }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    </div>
  </template>
  
  <script>
  import DialogDialog from '@/components/DialogDialog.vue'; // Importing DialogDialog component
import axios from 'axios';
  
  export default {
    components: {
      DialogDialog, // Registering the DialogDialog component
    },
    data() {
      return {
        isDialogOpen: false, // Controls whether the dialog is open
        consultationTypes: [], // Stores the list of consultation types
        consultation_type: "", // Model for consultation type input
        payment_category: "",
        consultation_type_amount: "", // Model for charge selection
        // Model for amount input
      };
    },
    methods: {  
      openDialog() {
        this.isDialogOpen = true; // Open dialog when button is clicked
      },
      closeDialog() {
        this.isDialogOpen = false; // Close dialog
      },
      created() {
    this.fetchConsultationTypes(); // Fetch data when component is created
  },
  async fetchConsultationTypes() {
  try {
    const response = await axios.get('http://localhost:8085/api/consultationtype/fetch');
    console.log('API Response:', response.data); // Debug log
    
    // Map the data to match your frontend structure if needed
    this.consultationTypes = response.data.map(item => ({
      consultation_type: item.consultationType, // Adjust property names
      payment_category: item.paymentCategory,   // to match your Java model
      amount: item.amount
    }));
  } catch (error) {
    console.error('Error fetching consultation types:', error);
  }
},

async addConsultationType() {
  try {
    const response = await axios.post('http://localhost:8085/api/consultationtype/add', {
      consultationType: this.consultation_type, // Match Java model properties
      paymentCategory: this.payment_category,
      amount: this.consultation_type_amount
    });
    
    // Refresh the list
    await this.fetchConsultationTypes();
    
    // Clear form
    this.consultation_type = "";
    this.payment_category = "";
    this.consultation_type_amount = "";
    this.closeDialog();
  } catch (error) {
    console.error('Cannot submit the consultation types:', error);
  }
}
}}
  
  </script>
  
  <style scoped>
  .open-dialog-btn {
    background-color: #007bff;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 20px;
  }
  
  .open-dialog-btn:hover {
    background-color: #0056b3;
  }
  
  h2 {
    text-align: center;
    margin-top: 20px;
  }
  
  .consultation-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
  }
  
  .consultation-table th, .consultation-table td {
    padding: 12px;
    text-align: left;
    border: 1px solid #ddd;
  }
  
  .consultation-table th {
    background-color: #f4f4f4;
  }
  
  .consultation-table tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  
  .consultation-table tr:hover {
    background-color: #f1f1f1;
  }
  Form input{
    width: auto;
    border: 1px black;
  }
  /* Form Styling */
form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 8px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

input[type="text"],
input[type="number"],
select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 15px;
  width: 100%;
  box-sizing: border-box;
}

input[type="text"]:focus,
input[type="number"]:focus,
select:focus {
  border-color: #007bff;
  outline: none;
  box-shadow: 0 0 3px #007bff50;
}
</style>
