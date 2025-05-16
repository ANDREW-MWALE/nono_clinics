<template>
  <div>
    <button @click="openDialog" class="open-dialog-btn">Add New Employee</button>

    <DialogDialog 
      :isOpen="isDialogOpen" 
      @close="closeDialog"
      @confirm="saveEmployee"
      title="Employee Leave Days"
    >
      <form @submit.prevent="submitForm" class="employee-form">
        <div class="form-group">
          <label for="fname">Employee Name*</label>
          <input id="fname" v-model="EName" type="text" required>
        </div>

        <div class="form-group">
          <label for="lname">Last Name*</label>
          <input id="lname" v-model="lname" type="text" required>
        </div>

        <div class="form-group">
          <label for="email">Email*</label>
          <input id="email" v-model="email" type="email" required>
        </div>

        <div class="form-group">
          <label for="address">Number of Days*</label>
          <input id="number" v-model="days" type="text" required>
        </div>

        <div class="form-group">
          <label for="contact">Contact*</label>
          <input id="contact" v-model="contact" type="text" required>
        </div>

        <div class="form-group">
          <label for="department">Department*</label>
          <select id="department" v-model="department" required>
            <option value="">Select Department</option>
            <option value="HR">Human Resources</option>
            <option value="IT">Information Technology</option>
            <option value="Finance">Finance</option>
            <option value="Marketing">Marketing</option>
          </select>
        </div>

        <div class="form-group">
          <label for="position">Position*</label>
          <input id="position" v-model="position" type="text" required>
        </div>

        <div class="form-group">
          <label for="etype">Employee Type*</label>
          <select id="etype" v-model="type" required>
            <option value="">Select Employee Type</option>
            <option value="permanent">Permanent</option>
            <option value="contractual">Contractual</option>
            <option value="part-time">Part-time</option>
          </select>
        </div>

        <div class="form-group">
          <label for="startDate">Start Date*</label>
          <input id="startDate" v-model="startDate" type="date" required>
        </div>

        <div class="form-group">
          <label for="endDate">End Date*</label>
          <input id="endDate" v-model="endDate" type="date" required>
        </div>

        <div class="form-group" @click="submitForm">
          <button type="submit" class="submit-btn">Submit</button>
        </div>
      </form>
    </DialogDialog>
  </div><div>
      <table class="table">
  <caption>List of employees</caption>
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">FirstName</th>
      <th scope="col">LastName</th>
      <th scope="col">Email</th>
      <th scope="col">Address</th>
      <th scope="col">Contact</th>
      <th scope="col">Department</th>
      <th scope="col">Position</th>
      <th scope="col">employee type</th>
      <th scope="col">start date</th>
      <th scope="col">end date</th>
      <th scope="col">status</th>
      <th scope="col">actions</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(employee, index) in employees" :key="index">
      <th scope="row">{{ employee.id }}</th>
      <td>{{ employee.fname }}</td>
      <td>{{ employee.lName }}</td>
      <td>{{ employee.email }}</td>
      <td>{{ employee.address }}</td>
      <td>{{ employee.contact }}</td>
      <td>{{ employee.department }}</td>
      <td>{{ employee.position }}</td>
      <td>{{ employee.type }}</td>
      <td>{{ employee.start }}</td>
      <td>{{ employee.end }}</td>
      <td>{{ employee.status}}</td>
      <td>
          <div class="text-center" @click="editTask(index)">
            <span class="fa fa-pen"></span>
          </div>
          <div class="text-center" @click="deleteTask(index)">
            <span class="fa fa-trash"></span>
          </div>
        </td>
    </tr>
    <!-- <tr>
      <th scope="row">2</th>
      <td>Jacob</td>
      <td>Thornton</td>
      <td>@fat</td>
    </tr>
    <tr>
      <th scope="row">3</th>
      <td>Larry</td>
      <td>the Bird</td>
      <td>@twitter</td>
    </tr>-->
  </tbody>
</table> 
</div>
</template>
  
  <script>
import DialogDialog from '@/components/DialogDialog.vue'
import { submitForm } from '@formkit/vue';

export default {
  components: { DialogDialog},
 data() {
  return {
    isDialogOpen: false,
    editingEmployee: null,
    employees: [], // your sample data

    // Form fields
    fname: '',
    lname: '',
    email: '',
    address: '',
    contact: '',
    department: '',
    position: '',
    type: '',
    startDate: '',
    endDate: ''
  };
},
methods: {
  openDialog() {
    this.resetForm();
    this.isDialogOpen = true;
  },
  closeDialog() {
    this.isDialogOpen = false;
    this.resetForm();
    this.editingEmployee = null;
  },
  submitForm() {
    const newEmployee = {
      fname: this.fname,
      lName: this.lname,
      email: this.email,
      address: this.address,
      contact: this.contact,
      department: this.department,
      position: this.position,
      type: this.type,
      start: this.startDate,
      end: this.endDate,
      status: "active"
    };

    if (this.editingEmployee !== null) {
      // Update existing employee
      this.employees[this.editingEmployee] = {
        ...this.employees[this.editingEmployee],
        ...newEmployee
      };
      alert("Employee updated successfully");
    } else {
      // Insert new employee
      newEmployee.id = this.employees.length + 1;
      this.employees.push(newEmployee);
      alert("New employee added successfully");
    }

    this.closeDialog();
  },
  editTask(index) {
    const emp = this.employees[index];
    this.fname = emp.fname;
    this.lname = emp.lName;
    this.email = emp.email;
    this.address = emp.address;
    this.contact = emp.contact;
    this.department = emp.department;
    this.position = emp.position;
    this.type = emp.type;
    this.startDate = emp.start;
    this.endDate = emp.end;

    this.editingEmployee = index;
    this.isDialogOpen = true;
  },
  deleteTask(index) {
    this.employees.splice(index, 1);
  },
  resetForm() {
    this.fname = '';
    this.lname = '';
    this.email = '';
    this.address = '';
    this.contact = '';
    this.department = '';
    this.position = '';
    this.type = '';
    this.startDate = '';
    this.endDate = '';
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
  