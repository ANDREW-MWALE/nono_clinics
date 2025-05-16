<template>
  <div class="container">
    <router-link to="/dashboard" class="back-button">
      <i class="ri-arrow-left-line"></i> BACK
    </router-link>
    
    <h1>Patients Management</h1>

    <div class="top-section">
      <button @click="openDialog('new')" class="action-button primary">
        <i class="ri-user-add-line"></i> New Patient
      </button>
      <button @click="openDialog('revisit')" class="action-button secondary">
        <i class="ri-calendar-event-line"></i> Record Revisit
      </button>
    </div>

    <div class="tabs">
      <button 
        @click="activeTab = 'today'" 
        :class="{ 'active': activeTab === 'today' }"
      >
        Today's Patients ({{ todayPatients.length }})
      </button>
      <button 
        @click="activeTab = 'all'" 
        :class="{ 'active': activeTab === 'all' }"
      >
        All Patients ({{ allPatients.length }})
      </button>
    </div>

    <DialogDialog 
      :isOpen="isDialogOpen" 
      :title="dialogTitle"
      :submitText="formMode === 'new' ? 'Register Patient' : 'Record Revisit'"
      :loading="dialogLoading"
      @close="closeDialog"
      @submit="handleFormSubmit"
    >
      <template v-if="formMode === 'revisit'">
        <div class="search-section">
          <input 
            v-model="patientSearchQuery" 
            placeholder="Search patient..." 
            @input="searchPatients" 
            class="search-input"
          />
          <div v-if="patientSearchResults.length > 0" class="search-results">
            <div 
              v-for="patient in patientSearchResults" 
              :key="patient.id" 
              class="search-result-item" 
              @click="selectPatient(patient)"
            >
              {{ patient.firstName }} {{ patient.lastName }} - {{ patient.phoneNumber }}
            </div>
          </div>
          <div v-if="selectedPatient" class="selected-patient">
            Selected: {{ selectedPatient.firstName }} {{ selectedPatient.lastName }}
          </div>
        </div>
      </template>

      <form class="patient-form" @submit.prevent="handleFormSubmit">
        <div class="form-row">
          <div class="form-group">
            <label>First Name <span class="required">*</span></label>
            <input 
              v-model="patientForm.firstName" 
              required 
            />
          </div>
          <div class="form-group">
            <label>Last Name <span class="required">*</span></label>
            <input 
              v-model="patientForm.lastName" 
              required 
            />
          </div>
        </div>

        <div class="form-group">
          <label>Address</label>
          <input v-model="patientForm.address" />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Date of Birth</label>
            <input type="date" v-model="patientForm.dateOfBirth" />
          </div>
          <div class="form-group">
            <label>Phone Number</label>
            <input v-model="patientForm.phoneNumber" />
          </div>
        </div>

        <div class="form-group">
          <label>Email Address</label>
          <input type="email" v-model="patientForm.emailAddress" />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Visit Date</label>
            <input type="date" v-model="patientForm.visitDate" />
          </div>
          <div class="form-group">
            <label>Consultation Type</label>
            <select v-model="patientForm.consultationType">
              <option value="">Select type</option>
              <option 
                v-for="category in paymentCategories" 
                :value="category.name" 
                :key="category.id"
              >
                {{ category.name }}
              </option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Assigned Doctor</label>
          <input v-model="patientForm.assignedDoctor" />
        </div>

        <div class="form-group">
          <label>Amount</label>
          <input type="number" v-model="patientForm.amount" />
        </div>

        <div class="form-group">
          <label>Notes</label>
          <textarea v-model="patientForm.notes"></textarea>
        </div>
      </form>
    </DialogDialog>

    <div class="content-container">
      <div v-if="loading" class="loading-state">
        <i class="ri-loader-4-line spin"></i> Loading patients...
      </div>
      
      <div v-else-if="error" class="error-state">
        <i class="ri-error-warning-line"></i> Error loading patients: {{ error }}
      </div>

      <template v-else>
        <PatientListComponent 
          v-if="filteredPatients.length > 0"
          :patients="filteredPatients" 
          @delete="confirmDeletePatient" 
          @view-history="viewPatientHistory"
        />
        
        <div v-else class="empty-state">
          <i class="ri-user-search-line"></i>
          No patients found for {{ activeTab === 'today' ? 'today' : 'your records' }}
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import PatientListComponent from "./PatientListComponent.vue";
import DialogDialog from "@/components/DialogDialog.vue";
import PatieService from "../services/PatieService";
import axios from "axios";

export default {
  components: {
    PatientListComponent,
    DialogDialog
  },
  
  data() {
    return {
      activeTab: 'today',
      isDialogOpen: false,
      formMode: 'new',
      dialogTitle: "Patient Registration",
      paymentCategories: [],
      allPatients: [],
      todayPatients: [],
      patientSearchQuery: '',
      patientSearchResults: [],
      selectedPatient: null,
      loading: false,
      dialogLoading: false,
      error: null,
      patientForm: {
        id: null,
        firstName: "",
        lastName: "",
        address: "",
        dateOfBirth: "",
        phoneNumber: "",
        emailAddress: "",
        visitDate: new Date().toISOString().split('T')[0],
        consultationType: "",
        assignedDoctor: "",
        amount: "",
        notes: ""
      }
    };
  },

  computed: {
    filteredPatients() {
      return this.activeTab === 'today' ? 
        this.todayPatients : 
        this.allPatients;
    }
  },

  created() {
    this.fetchInitialData();
  },

  methods: {
    async fetchInitialData() {
      try {
        this.loading = true;
        await Promise.all([
          this.fetchAllPatients(),
          this.fetchTodaysPatients(),
          this.fetchPaymentCategories()
        ]);
      } catch (error) {
        this.error = error.message;
        this.showError('Failed to load initial data');
      } finally {
        this.loading = false;
      }
    },

    async fetchAllPatients() {
      try {
        const response = await PatieService.getAllPatients();
        if (response.success) {
          this.allPatients = response.data;
        } else {
          throw new Error(response.error);
        }
      } catch (error) {
        this.error = error.message;
        this.showError('Failed to load patients');
      }
    },

    async fetchTodaysPatients() {
      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await PatieService.getPatientsByDate(today);
        if (response.success) {
          this.todayPatients = response.data;
        } else {
          throw new Error(response.error);
        }
      } catch (error) {
        this.error = error.message;
      }
    },

    async fetchPaymentCategories() {
      try {
        const response = await axios.get('http://localhost:8085/api/paymentCategory/list');
        this.paymentCategories = response.data || [];
      } catch (error) {
        console.error("Error fetching payment categories:", error);
        this.showError('Failed to load payment categories');
      }
    },

    showError(message) {
      alert('Error: ' + message);
    },

    showSuccess(message) {
      alert(message);
    },

    openDialog(mode) {
      this.formMode = mode;
      this.dialogTitle = mode === 'new' ? 'New Patient Registration' : 'Record Patient Revisit';
      this.resetForm();
      this.isDialogOpen = true;
    },

    closeDialog() {
      this.isDialogOpen = false;
      this.selectedPatient = null;
      this.patientSearchQuery = '';
      this.patientSearchResults = [];
    },

    resetForm() {
      this.patientForm = {
        id: null,
        firstName: "",
        lastName: "",
        address: "",
        dateOfBirth: "",
        phoneNumber: "",
        emailAddress: "",
        visitDate: new Date().toISOString().split('T')[0],
        consultationType: "",
        assignedDoctor: "",
        amount: "",
        notes: ""
      };
    },

    validateForm() {
      if (!this.patientForm.firstName || !this.patientForm.lastName) {
        this.showError('First and last name are required');
        return false;
      }
      
      if (this.formMode === 'revisit' && !this.selectedPatient) {
        this.showError('Please select a patient');
        return false;
      }
      
      return true;
    },

    async handleFormSubmit() {
      if (!this.validateForm()) return;
      
      this.formMode === 'new' ? await this.addPatient() : await this.recordRevisit();
    },

    async addPatient() {
      try {
        this.dialogLoading = true;
        
        const payload = {
          firstName: this.patientForm.firstName,
          lastName: this.patientForm.lastName,
          address: this.patientForm.address,
          dateOfBirth: this.patientForm.dateOfBirth,
          phoneNumber: this.patientForm.phoneNumber,
          emailAddress: this.patientForm.emailAddress,
          visits: [{
            visitDate: this.patientForm.visitDate,
            consultationType: this.patientForm.consultationType,
            assignedDoctor: this.patientForm.assignedDoctor,
            amount: parseFloat(this.patientForm.amount) || 0,
            notes: this.patientForm.notes
          }]
        };

        const response = await PatieService.addPatient(payload);
        
        if (response.success) {
          await Promise.all([this.fetchAllPatients(), this.fetchTodaysPatients()]);
          this.closeDialog();
          this.showSuccess("Patient added successfully!");
        } else {
          throw new Error(response.error);
        }
      } catch (error) {
        console.error("Add patient error:", error);
        this.showError(error.message || "Failed to add patient");
      } finally {
        this.dialogLoading = false;
      }
    },

    async recordRevisit() {
      try {
        this.dialogLoading = true;
        
        const visitData = {
          patientId: this.selectedPatient.id,
          ...this.patientForm
        };

        const response = await PatieService.addVisit(visitData);
        
        if (response.success) {
          await Promise.all([this.fetchAllPatients(), this.fetchTodaysPatients()]);
          this.closeDialog();
          this.showSuccess("Revisit recorded successfully!");
        } else {
          throw new Error(response.error);
        }
      } catch (error) {
        console.error("Record revisit error:", error);
        this.showError(error.message || "Failed to record revisit");
      } finally {
        this.dialogLoading = false;
      }
    },

    async searchPatients() {
      if (this.patientSearchQuery.length < 2) {
        this.patientSearchResults = [];
        return;
      }
      
      try {
        const response = await PatieService.searchPatients(this.patientSearchQuery);
        this.patientSearchResults = response.success ? response.data : [];
      } catch (error) {
        this.patientSearchResults = [];
        console.error("Search error:", error);
      }
    },

    selectPatient(patient) {
      this.selectedPatient = patient;
      this.patientForm.firstName = patient.firstName;
      this.patientForm.lastName = patient.lastName;
      this.patientForm.address = patient.address;
      this.patientForm.dateOfBirth = patient.dateOfBirth;
      this.patientForm.phoneNumber = patient.phoneNumber;
      this.patientForm.emailAddress = patient.emailAddress;
      this.patientSearchResults = [];
    },

    async confirmDeletePatient(id) {
      if (confirm('Are you sure you want to delete this patient and all their records?')) {
        try {
          this.loading = true;
          const response = await PatieService.deletePatient(id);
          
          if (response.success) {
            await Promise.all([this.fetchAllPatients(), this.fetchTodaysPatients()]);
            this.showSuccess("Patient deleted successfully");
          } else {
            throw new Error(response.error);
          }
        } catch (error) {
          this.showError(error.message || "Failed to delete patient");
        } finally {
          this.loading = false;
        }
      }
    },

    viewPatientHistory(id) {
      this.$router.push(`/patient-history/${id}`);
    }
  }
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  color: #4eac6d;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.2s;
}

.back-button:hover {
  color: #3d8a57;
}

h1 {
  margin-bottom: 24px;
  color: #333;
  font-size: 28px;
}

.top-section {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.action-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.action-button i {
  font-size: 18px;
}

.primary {
  background-color: #4eac6d;
  color: white;
}

.primary:hover {
  background-color: #3d8a57;
}

.secondary {
  background-color: #6c757d;
  color: white;
}

.secondary:hover {
  background-color: #5a6268;
}

.tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 1px solid #ddd;
  padding-bottom: 4px;
}

.tabs button {
  padding: 8px 16px;
  border-radius: 4px;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 500;
  color: #666;
  transition: all 0.2s;
}

.tabs button:hover {
  color: #333;
  background: #f0f0f0;
}

.tabs .active {
  color: #4eac6d;
  background: #e8f5e9;
  font-weight: 600;
}

.content-container {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.loading-state,
.error-state,
.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 40px;
  text-align: center;
  color: #666;
}

.error-state {
  color: #dc3545;
}

.empty-state {
  color: #999;
}

.spin {
  animation: spin 1s linear infinite;
}

.search-section {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 8px;
}

.search-results {
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.search-result-item {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.search-result-item:hover {
  background-color: #f0f0f0;
}

.selected-patient {
  margin-top: 10px;
  padding: 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
}

.patient-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: flex;
  gap: 16px;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 6px;
  font-weight: 500;
  color: #555;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  color: #333;
}

.form-group textarea {
  min-height: 80px;
  resize: vertical;
}

.required {
  color: #dc3545;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>