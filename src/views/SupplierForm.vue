<template>
  <div class="form-container">
    <h1>Add Supplier</h1>

    <form @submit.prevent="addSupplier">
      <div class="form-group">
        <label>Supplier Name</label>
        <input type="text" v-model="supplier_name" required />
      </div>

      <div class="form-group">
        <label>Email</label>
        <input type="email" v-model="email" required />
      </div>

      <div class="form-group">
        <label>Phone</label>
        <input type="tel" v-model="phone" required />
      </div>

      <div class="form-group">
        <label>Address</label>
        <textarea v-model="address" required></textarea>
      </div>

      <button type="submit">Add Supplier</button>
    </form>

    <div v-if="suppliers.length">
      <h2>Suppliers List:</h2>
      <table class="supplier-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(supplier, index) in suppliers" :key="index">
            <td>{{ supplier.name }}</td>
            <td>{{ supplier.email }}</td>
            <td>{{ supplier.phone }}</td>
            <td>{{ supplier.address }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Suppliers',
  data() {
    return {
      supplier_name: '',
      email: '',
      phone: '',
      address: '',
      suppliers: []
    };
  },
  methods: {
    addSupplier() {
      this.suppliers.push({
        name: this.supplier_name,
        email: this.email,
        phone: this.phone,
        address: this.address
      });

      // Clear form
      this.supplier_name = '';
      this.email = '';
      this.phone = '';
      this.address = '';
    }
  }
};
</script>

<style scoped>
.form-container {
  max-width: 600px;
  margin: 20px auto;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input,
textarea {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  padding: 10px 20px;
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
}

.supplier-table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
}

.supplier-table th,
.supplier-table td {
  border: 1px solid #ccc;
  padding: 8px;
  text-align: left;
}
</style>
