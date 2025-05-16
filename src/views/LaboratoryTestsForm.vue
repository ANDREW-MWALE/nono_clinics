<template>
  <form class="form" @submit.prevent="addLaboratoryTest">
    <div class="form-group">
      <label for="test-name">Test Name</label><br />
      <input type="text" v-model="laboratoryTest.testName" placeholder="Test name" required />
    </div>

    <div class="form-group">
      <label for="department">Department</label>
      <input type="text" v-model="laboratoryTest.department" placeholder="Enter department" required />
    </div>

    <div class="form-group">
      <label for="amount">Amount</label>
      <input type="number" v-model="laboratoryTest.testCharge" placeholder="Enter amount" required />
    </div>

    <button class="submit">Submit</button>
  </form>
</template>

<script>
import axios from 'axios';

export default {
  data() {
      return {
          laboratoryTest: {
              testName: "",
              department: "",
              testCharge: 0
          }
      };
  },
  methods: {
      async addLaboratoryTest() {
        try {
        const response = await axios.post(
            'http://localhost:8085/api/laboratoryTest/add',
            {
                testName: this.laboratoryTest.testName,
                department: this.laboratoryTest.department,
                testCharge: parseFloat(this.laboratoryTest.testCharge)
            }
        );
        console.log("Success:", response.data);
        alert('Test submitted successfully!');
        this.resetForm;
    } catch (error) {
        console.error("Full error:", error);
        console.error("Error response:", error.response);
        alert(`Error: ${error.response?.data?.message || error.message}`);
    }
      }
  }
};
</script>
<style scoped>
.form {
  max-width: 500px;
  margin: 30px auto;
  padding: 20px;
  background-color: #f2f2f2;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
  text-align: left;
}

label {
  font-weight: bold;
  display: block;
  margin-bottom: 5px;
}

input[type="text"],
input[type="number"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-sizing: border-box;
  font-size: 14px;
}

.submit {
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: white;
  font-size: 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  transition: background-color 0.3s ease;
}

.submit:hover {
  background-color: #45a049;
}
</style>
