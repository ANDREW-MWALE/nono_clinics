<template>
  <div>
    <h2>Product List</h2>
    <button @click="openDialog(null)">Add Product</button>
    <table class="product-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Name</th>
          <th>Batch No</th>
          <th>Quantity</th>
          <th>Order Price</th>
          <th>Selling Price</th>
          <th>Supplier</th>
          <th>Category</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(medicine, index) in medicines" :key="medicine.id">
          <td>{{ index + 1 }}</td>
          <td>{{ medicine.medicineName }}</td>
          <td>{{ medicine.batchNo }}</td>
          <td>{{ medicine.quantity }}</td>
          <td>${{ medicine.orderPrice }}</td>
          <td>${{ medicine.sellingPrice }}</td>
          <td>{{ medicine.supplier_id }}</td>
          <td>{{ medicine.category_id }}</td>
          <td>
            <button @click="openDialog(medicine)">View</button>
            <button @click="deleteMedicine(medicine.id)">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Dialog Component -->
    <DialogDialog
      :isOpen="isDialogOpen"
      :title="dialogTitle"
      @close="closeDialog"
      @confirm="confirmDialog"
    >
      <template v-if="selectedProduct">
        <!-- Product Details -->
        <p>{{ selectedProductDetails }}</p>
      </template>
      <template v-else>
        <!-- Add Product Form -->
        <form @submit.prevent="addMedicine">
          <div class="form-group">
            <label for="medicine-name">Medicine Name:</label>
            <input type="text" v-model="medication.medicineName" required />
          </div>
          <div class="form-group">
            <label for="medicine-supplier">Supplier:</label>
            <input type="text" v-model="medication.supplier_id" required />
          </div>
          <div class="form-group">
            <label for="medicine-category">Medicine Category:</label>
            <input type="text" v-model="medication.category_id" required />
          </div>
          <div class="form-group">
            <label for="medicine-batchNo">Batch No:</label>
            <input type="text" v-model="medication.batchNo" required />
          </div>
          <div class="form-group">
            <label for="medicine-quantity">Quantity:</label>
            <input type="number" v-model="medication.quantity" required />
          </div>
          <div class="form-group">
            <label for="medicine-order-price">Order Price:</label>
            <input type="number" v-model="medication.orderPrice" required />
          </div>
          <div class="form-group">
            <label for="medicine-selling-price">Selling Price:</label>
            <input type="number" v-model="medication.sellingPrice" required />
          </div>
          <br />
          <button type="submit">Add Medicine</button>
        </form>
      </template>
    </DialogDialog>
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
      medicines: [],
      isDialogOpen: false,
      dialogTitle: "Product Details",
      selectedProductDetails: "",
      selectedProduct: null,
      medication: {
        medicineName: "",
        supplier_id: "",
        category_id: "",
        batchNo: "",
        quantity: "",
        orderPrice: "",
        sellingPrice: "",
        updatedBy: "",
      },
    };
  },
  mounted() {
    this.fetchMedicine();
  },
  methods: {
    openDialog(product) {
      if (product) {
        this.selectedProduct = product;
        this.selectedProductDetails = `Name: ${product.medicineName}, Price: $${product.sellingPrice}`;
        this.dialogTitle = "Product Details";
      } else {
        this.selectedProduct = null;
        this.dialogTitle = "Add Product";
      }
      this.isDialogOpen = true;
    },
    closeDialog() {
      this.isDialogOpen = false;
    },
    confirmDialog() {
      this.closeDialog();
    },
    async addMedicine() {
      try {
        const response = await axios.post(
          "http://localhost:8085/api/pharmacy/add",
          this.medication
        );
        // Fetch the updated list
        this.fetchMedicine();
        this.resetForm();
        this.closeDialog();
      } catch (error) {
        console.error("Error posting medicine:", error);
      }
    },
    async fetchMedicine() {
      try {
        const response = await axios.get("http://localhost:8085/api/pharmacy/get");
        this.medicines = response.data; // ✅ CORRECTED HERE
      } catch (error) {
        console.error("Error fetching medicines:", error);
      }
    },
    resetForm() {
      this.medication = {
        medicineName: "",
        supplier_id: "",
        category_id: "",
        batchNo: "",
        quantity: "",
        orderPrice: "",
        sellingPrice: "",
        updatedBy: "",
      };
    },
    async deleteMedicine(id) {
      try {
        await axios.delete(`http://localhost:8085/api/pharmacy/delete/${id}`);
        this.fetchMedicine();
      } catch (error) {
        console.error("Error deleting medicine:", error);
      }
    },
  },
};
</script>

<style scoped>
/* General Styling */
div {
  font-family: Arial, sans-serif;
  margin: 20px;
  color: #333;
}

/* Header */
h2 {
  text-align: center;
  color: #007bff;
  margin-bottom: 20px;
}

/* Table Styling */
.product-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
}

.product-table th,
.product-table td {
  border: 1px solid #ddd;
  border-radius: 100px;
  text-align: center;
  padding: 10px;
}

.product-table th {
  background-color: #f8f9fa;
  color: #007bff;
  font-weight: bold;
}

.product-table tr:nth-child(even) {
  background-color: #f2f2f2;
}

.product-table tr:hover {
  background-color: #e9ecef;
}

/* Buttons */
button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #0056b3;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
form {
  padding: 20px;
}

hr {
  margin: 20px 0;
  border: none;
  border-top: 1px solid #ccc;
}

/* Use flexbox for label-input alignment */
.form-group {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

/* Label styling */
.form-group label {
  width: 140px;
  font-weight: 500;
  color: #333;
  margin-right: 10px;
  text-align: right;
}

/* Input styling */
.form-group input[type="text"],
.form-group input[type="number"],
.form-group input[type="email"],
.form-group select,
.form-group textarea {
  flex: 1;
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #007bff;
  outline: none;
}

/* Submit button styling */
form button[type="submit"] {
  margin-top: 20px;
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  display: block;
  margin-left: auto;
}

form button[type="submit"]:hover {
  background-color: #0056b3;
}

</style>
