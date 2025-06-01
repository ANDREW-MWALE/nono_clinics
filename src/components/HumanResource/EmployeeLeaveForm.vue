<template>
  <div>
    <button @click="openDialog" class="open-dialog-btn">Add New Employee</button>

    <DialogDialog 
      :isOpen="isDialogOpen" 
      @close="closeDialog"
      @confirm="submitForm"
      title="Employee Leave Days"
    >
      <form @submit.prevent="submitForm" class="leave-form">
        <div class="form-group">
          <label for="Ename">Employee Name*</label>
          <input id="Ename" v-model="employeeName" type="text" required>
        </div>
        <div class="form-group">
          <label for="position">Position*</label>
          <input id="position" v-model="position" type="text" required>
        </div>
        <div class="form-group">
          <label for="department">Department*</label>
          <input id="department" v-model="department" type="text" required>
        </div>
        <div class="form-group">
          <label for="number">Leave Days*</label>
          <input id="number" v-model="leaveDaysInput" type="number" required>
        </div>
        <div class="form-group">
          <label for="updateby">UPDATED BY*</label>
          <input id="updateby" v-model="upDatedBy" type="text" required>
        </div>
        <div class="form-group">
          <button type="submit" class="submit-btn">Submit</button>
        </div>
      </form>
    </DialogDialog>

    <table class="table">
      <caption>Leave management</caption>
      <thead>
        <tr>
          <th>#</th>
          <th>EMPLOYEE NAME</th>
          <th>POSITION</th>
          <th>DEPARTMENT</th>
          <th>LEAVE DAYS</th>
          <th>UPDATED BY</th>
          <th>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(leave, index) in leaveDays" :key="leave.id">
          <th scope="row">{{ leave.id }}</th>
          <td>{{ leave.employeeName }}</td>
          <td>{{ leave.position }}</td>
          <td>{{ leave.department }}</td>
          <td>{{ leave.leaveDays }}</td>
          <td>{{ leave.upDatedBy }}</td>
          <td>
            <span class="fa fa-pen" @click="editLeave(index)"></span>
            <span class="fa fa-trash" @click="deleteLeave(index)"></span>
          </td>
        </tr>
      </tbody>
    </table> 
  </div>
</template>

<script>
import DialogDialog from '@/components/DialogDialog.vue'

export default {
  components: { DialogDialog },
  data() {
    return {
      isDialogOpen: false,
      editingLeave: null,
      leaveDays: [
        { id: 1, employeeName: "Andrew", position: "IT Manager", department: 'IT', leaveDays: 23, upDatedBy: 'Andrew' }
      ],

      // Form fields
      employeeName: '',
      position: '',
      department: '',
      leaveDaysInput: '',
      upDatedBy: ''
    };
  },
  methods: {
    openDialog() {
      this.resetForm();
      this.isDialogOpen = true;
    },
    closeDialog() {
      this.isDialogOpen = false;
      this.editingLeave = null;
    },
    resetForm() {
      this.employeeName = '';
      this.position = '';
      this.department = '';
      this.leaveDaysInput = '';
      this.upDatedBy = '';
    },
    submitForm() {
      const newLeave = {
        employeeName: this.employeeName,
        position: this.position,
        department: this.department,
        leaveDays: parseInt(this.leaveDaysInput),
        upDatedBy: this.upDatedBy
      };

      if (this.editingLeave !== null) {
        newLeave.id = this.leaveDays[this.editingLeave].id;
        this.leaveDays.splice(this.editingLeave, 1, newLeave);
        alert("Leave record updated successfully");
      } else {
        newLeave.id = this.leaveDays.length + 1;
        this.leaveDays.push(newLeave);
        alert("New leave record added successfully");
      }

      this.closeDialog();
    },
    editLeave(index) {
      const leave = this.leaveDays[index];
      this.employeeName = leave.employeeName;
      this.position = leave.position;
      this.department = leave.department;
      this.leaveDaysInput = leave.leaveDays;
      this.upDatedBy = leave.upDatedBy;

      this.editingLeave = index;
      this.isDialogOpen = true;
    },
    deleteLeave(index) {
      if (confirm("Are you sure you want to delete this record?")) {
        this.leaveDays.splice(index, 1);
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
.form-group {
  margin-bottom: 15px;
}
input {
  width: 100%;
  padding: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
.submit-btn {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.submit-btn:hover {
  background-color: #0056b3;
}
.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
.table th, .table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}
.table th {
  background-color: #f4f4f4;
}
.table tr:nth-child(even) {
  background-color: #f9f9f9;
}
.table tr:hover {
  background-color: #f1f1f1;
}
.fa {
  cursor: pointer;
  margin: 0 5px;
}
</style>
