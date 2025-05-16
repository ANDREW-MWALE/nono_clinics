<template>
  <div class="form-container">
    <form @submit.prevent="addDepartment">
      <div class="form-group">
        <label for="department-name">Department Name</label><br>
        <input
          type="text"
          id="department-name"
          name="department_name"
          v-model="department_name"
          placeholder="Enter department name"
          required
        >
      </div>

      <div class="form-group">
        <label for="charge">Charge</label>
        <select
          v-model="charge"
          id="charge"
          name="charge"
          class="form-control"
          required
        >
          <option value="" disabled selected>Choose Consultation</option>
          <option
            v-for="charge in paymentCategories"
            :value="charge.PID"
            :key="charge.PID"
          >
            {{ charge.categoryName }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="amount">Amount</label>
        <input
          type="number"
          id="amount"
          name="amount"
          v-model="amount"
          placeholder="Enter amount"
          required
        >
      </div>

      <button type="submit" class="submit">Add Department</button>
    </form>
  </div>

  <div>
    <h2>Department List</h2>
    <ul>
      <li
        v-for="(department, index) in departments"
        :key="index"
      >
        <strong>{{ department.department_name }}</strong>
        <p>Charge: {{ department.category }}</p>
        <p>Amount: {{ department.amount }}</p>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      paymentCategories: [],
      departments: [],
      department_name: "",
      charge: "",
      amount: "",
    };
  },
  mounted() {
    this.fetchPaymentCategories();
  },
  methods: {
    addDepartment() {
      if (!this.department_name || !this.charge || !this.amount) {
        alert("All fields are required!");
        return;
      }

      const selectedCharge = this.paymentCategories.find(
        (item) => item.PID === this.charge
      );

      this.departments.push({
        department_name: this.department_name,
        category: selectedCharge?.categoryName || "Unknown",
        amount: this.amount,
      });

      this.department_name = "";
      this.charge = "";
      this.amount = "";
    },

    async fetchPaymentCategories() {
      try {
        const response = await fetch('http://localhost:8085/api/paymentCategory/list');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        this.paymentCategories = data;
      } catch (error) {
        console.error('Error fetching payment categories:', error);
      }
    }
  }
};
</script>

<style scoped>
.form-container {
  max-width: 400px;
  margin: 20px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
}

.form-group {
  margin-bottom: 15px;
}

input,
select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
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

h2 {
  text-align: center;
  margin-top: 20px;
}

ul {
  list-style-type: none;
  padding: 0;
  max-width: 400px;
  margin: 0 auto;
}

ul li {
  background: #f1f1f1;
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
}
</style>
