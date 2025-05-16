<template>
  <div>
    <!-- Payment Category Dialog -->
    <DialogDialog :isOpen="isDialogOpen"
     @close="closeDialog" 
     @confirm="savePaymentCategory" 
     title="Manage Payment Category">
      <template #default>
        <form @submit.prevent="savePaymentCategory">
          <div class="form-group">
            <label for="category-name">Category Name</label><br>
            <input type="text" v-model="category_name" placeholder="Enter category name" required>
          </div>
          <button type="submit" class="submit">{{ isEditMode ? "Update" : "Add" }} Payment Category</button>
        </form>
      </template>
    </DialogDialog>

    <!-- Button to open the dialog for adding new category -->
    <button @click="openDialog(null)" class="open-dialog-btn">Add New Payment Category</button>

    <!-- Payment Category List -->
    <div>
      <h2>Payment Category List</h2>
      <div v-if="paymentCategories.length === 0">
        No payment categories available.
      </div>
      <div v-else>
        <table class="payment-category-table">
          <thead>
            <tr>
              <th>Category Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(category, index) in paymentCategories" :key="index">
              <td>{{ category.categoryName }}</td>
              <td>
                <button @click="openDialog(category)">Edit</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import DialogDialog from "@/components/DialogDialog.vue";

export default {
  components: {
    DialogDialog,
  },
  data() {
    return {
      isDialogOpen: false,
      isEditMode: false, // Track whether it's edit mode
      paymentCategories: [],
      category_id: null, // Store ID for editing
      category_name: "", // Category name model
    };
  },  
  mounted() {
    this.fetchPaymentCategories();
  },
  methods: {
    async fetchPaymentCategories() {
      try {
        const response = await axios.get("http://localhost:8085/api/paymentCategory/list");
        this.paymentCategories = response.data;
      } catch (error) {
        console.error("Error fetching payment categories:", error);
      }
    },
    openDialog(category) {
      if (category) {
        this.isEditMode = true;
        this.category_id = category.PID;
        this.category_name = category.categoryName;
      } else {
        this.isEditMode = false;
        this.category_id = null;
        this.category_name = "";
      }
      this.isDialogOpen = true;
    },
    closeDialog() {
      this.isDialogOpen = false;
    },
    async savePaymentCategory() {
  try {
    if (this.isEditMode) {
      if (!this.category_id) {
        console.error("Error: category_id is undefined!");
        return;
      }
      const response = await axios.put(`http://localhost:8085/api/paymentCategory/${this.category_id}`, {
        categoryName: this.category_name,
      });
      console.log("API Response:", response.data); // Log API response
    } else {
      const response = await axios.post("http://localhost:8085/api/paymentCategory/add", {
        categoryName: this.category_name,
      });
      console.log("API Response:", response.data);
    }

    this.closeDialog();
    this.fetchPaymentCategories(); // Refresh the list
  } catch (error) {
    console.error("Error saving payment category:", error.response?.data || error);
  }
}

}
}
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

.payment-category-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  margin: 20px;
  position: centre;
}

.payment-category-table th,
.payment-category-table td {
  padding: 12px;
  text-align: left;
  border: 1px solid #ddd;
}

.payment-category-table th {
  background-color: #f4f4f4;
}

.payment-category-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.payment-category-table tr:hover {
  background-color: #f1f1f1;
}

.submit {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit:hover {
  background-color: #0056b3;
}

.form-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
</style>
