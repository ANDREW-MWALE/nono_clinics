<template>
  <div v-if="isOpen" class="dialog-overlay" @click.self="closeDialog">
    <div class="dialog-box" role="dialog" aria-labelledby="dialog-title" @keydown.esc="closeDialog">
      <header class="dialog-header">
        <h3 id="dialog-title">{{ title }}</h3>
        <button @click="closeDialog" class="close-btn" aria-label="Close dialog">&times;</button>
      </header>

      <main class="dialog-body">
        <form @submit.prevent="submitForm" class="employee-form">
          <div class="form-group">
            <label for="name">first Name*</label>
            <input id="name" v-model="formData.name" type="text" required>
          </div>
          <div class="form-group">
            <label for="name">Last Name*</label>
            <input id="name" v-model="formData.name" type="text" required>
          </div>
          <div class="form-group">
            <label for="email">Email*</label>
            <input id="email" v-model="formData.email" type="email" required>
          </div>
          <div class="form-group">
            <label for="name">Address*</label>
            <input id="name" v-model="formData.name" type="text" required>
          </div>
          <div class="form-group">
            <label for="contact">Contact*</label>
            <input id="number" v-model="formData.name" type="text" required>
          </div>
          <div class="form-group">
            <label for="department">Department*</label>
            <select id="department" v-model="formData.department" required>
              <option value="">Select Department</option>
              <option value="HR">Human Resources</option>
              <option value="IT">Information Technology</option>
              <option value="Finance">Finance</option>
              <option value="Marketing">Marketing</option>
            </select>
          </div>

          <div class="form-group">
            <label for="position">Position*</label>
            <input id="position" v-model="formData.position" type="text" required>
          </div>
          <div class="form-group">
            <label for="department">Employee type*</label>
            <select id="department" v-model="formData.department" required>
              <option value="">Select Department</option>
              <option value="HR">permanemt</option>
              <option value="IT">contractual</option>
              <option value="Finance">part-time</option>
            </select>
          </div>
          <div class="form-group">
            <label for="startDate">Start Date*</label>
            <input id="startDate" v-model="formData.startDate" type="date" required>
          </div>
          <div class="form-group">
            <label for="startDate">End Date*</label>
            <input id="startDate" v-model="formData.startDate" type="date" required>
          </div>
        </form>
      </main>

      <footer class="dialog-footer">
        <button @click="closeDialog" class="btn cancel">Cancel</button>
        <button @click="submitForm" class="btn confirm">Register</button>
      </footer>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    title: {
      type: String,
      default: "Dialog",
    },
  },
  emits: ["close", "submit"],
  data() {
    return {
      formData: {
        name: "",
        email: "",
        department: "",
        position: "",
        startDate: ""
      },
    };
  },
  methods: {
  
    closeDialog() {
      this.resetForm();
      this.$emit("close");
    },
    submitForm() {
      if (this.validateForm()) {
        this.$emit("submit", this.formData);
      }
    },
    validateForm() {
      const requiredFields = ['name', 'email', 'department', 'position', 'startDate'];
      return requiredFields.every(field => !!this.formData[field]);
    },
    resetForm() {
      this.formData = {
        name: "",
        email: "",
        department: "",
        position: "",
        startDate: ""
      };
    }
  },
  watch: {
    isOpen(newVal) {
      if (!newVal) {
        this.resetForm();
      }
    }
  }
};
</script>

<style scoped>
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog-box {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 400px;
}

.dialog-header,
.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.employee-form .form-group {
  margin-bottom: 1rem;
}

.btn {
  padding: 8px 12px;
  border: none;
  cursor: pointer;
}

.btn.confirm {
  background-color: #00C851;
  color: white;
}

.btn.cancel {
  background-color: #ff4444;
  color: white;
}
</style>
