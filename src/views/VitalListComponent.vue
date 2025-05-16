<template>
  <div class="vitals-container">
    <!-- Patient List -->
    <div class="patient-list-container">
      <h2>Patients</h2>
      <ul class="patient-list">
        <li
          v-for="patient in patientsList"
          :key="patient.id"
          class="patient-item"
          @click="selectPatient(patient)"
        >
          <span class="patient-name">{{ patient.firstName }} {{ patient.lastName }}</span>
        </li>
      </ul>
    </div>

    <!-- Vitals Section -->
    <div class="vitals-section" v-if="selectedPatient">
      <h3>Vitals for: {{ selectedPatient.firstName }} {{ selectedPatient.lastName }}</h3>

      <button @click="openDialog" class="enter-vitals-button">
        Enter Vital Signs
      </button>

      <table v-if="vitals.length" class="vitals-table">
        <thead>
          <tr>
            <th>Temperature</th>
            <th>Pulse</th>
            <th>Blood Pressure</th>
            <th>Oxygen</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(vital, index) in vitals" :key="vital.v_id || index" :class="{ 'new-entry': vital.isNew }">
            <td>{{ vital.bodyTemperature }}°C</td>
            <td>{{ vital.pulseRate }} bpm</td>
            <td>{{ vital.bloodPressure }} mmHg</td>
            <td>{{ vital.oxygenSaturation }} %</td>
          </tr>
        </tbody>
      </table>

      <p v-else>No vitals recorded yet for this patient.</p>
    </div>

    <!-- Dialog Form -->
    <DialogDialog :isOpen="isDialogOpen" title="Enter Vital Signs" @close="closeDialog" @confirm="submitVitals">
      <form @submit.prevent="submitVitals" class="vitals-form">
        <div class="vital-item">
          <label for="bodyTemperature">Body Temperature</label>
          <input type="number" id="bodyTemperature" v-model="newVital.bodyTemperature" required />
          <span class="unit">°C</span>
        </div>

        <div class="vital-item">
          <label for="pulseRate">Pulse Rate</label>
          <input type="number" id="pulseRate" v-model="newVital.pulseRate" required />
          <span class="unit">bpm</span>
        </div>

        <div class="vital-item">
          <label for="bloodPressure">Blood Pressure</label>
          <input type="text" id="bloodPressure" v-model="newVital.bloodPressure" required />
          <span class="unit">mmHg</span>
        </div>

        <div class="vital-item">
          <label for="oxygenSaturation">Oxygen Saturation</label>
          <input type="number" id="oxygenSaturation" v-model="newVital.oxygenSaturation" required />
          <span class="unit">%</span>
        </div>

        <button type="submit" class="submit-button" :disabled="isSubmitting">
          {{ isSubmitting ? 'Submitting...' : 'Submit Vital Signs' }}
        </button>
      </form>
    </DialogDialog>
  </div>
</template>

<script>
import DialogDialog from "@/components/DialogDialog.vue";
import axios from "axios";

export default {
  name: "VitalsManager",
  components: { DialogDialog },
  data() {
    return {
      apiBaseUrl: "http://localhost:8085/api",
      patientsList: [],
      selectedPatient: null,
      vitals: [],
      isDialogOpen: false,
      isSubmitting: false,
      newVital: {
        patientModel: {
            patientId: this.vital.patientId,
          },
        bodyTemperature: "",
        pulseRate: "",
        bloodPressure: "",
        oxygenSaturation: ""
      }
    };
  },
  methods: {
    async fetchPatients() {
      try {
        const response = await fetch(`${this.apiBaseUrl}/patients`);
        this.patientsList = await response.json();
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    },
    async fetchVitals(patientId) {
      this.vitals = [];
      try {
        const responst = await axios.get("http://localhost:8085/api/vitals/")
        const response = await fetch(`${this.apiBaseUrl}/vitals/${patientId}`);
        this.vitals = await response.json();
      } catch (error) {
        console.error("Error fetching vitals:", error);
      }
    },
    async submitVitals() {
      if (!this.selectedPatient) {
        alert("Please select a patient first.");
        return;
      }

      this.isSubmitting = true;
      try {
        this.newVital.patientId = this.selectedPatient.id;
        const response = await fetch(`${this.apiBaseUrl}/vitals`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(this.newVital),
        });

        if (response.ok) {
          const savedVital = await response.json();
          savedVital.isNew = true;
          this.vitals.unshift(savedVital);
          setTimeout(() => (savedVital.isNew = false), 3000);
          this.closeDialog();
          this.newVital = {
            patientModel: {
            patientId: this.vital.patientId,
          },
            bodyTemperature: "",
            pulseRate: "",
            bloodPressure: "",
            oxygenSaturation: ""
          };
        } else {
          console.error("Failed to submit vital signs.");
        }
      } catch (error) {
        console.error("Error submitting vitals:", error);
      } finally {
        this.isSubmitting = false;
      }
    },
    selectPatient(patient) {
      this.selectedPatient = patient;
      this.vitals = [];
      this.fetchVitals(patient.id);
      this.isDialogOpen = false;
    },
    openDialog() {
      if (!this.selectedPatient) {
        alert("Please select a patient first.");
        return;
      }
      this.isDialogOpen = true;
    },
    closeDialog() {
      this.isDialogOpen = false;
    }
  },
  mounted() {
    this.fetchPatients();
  }
};
</script>
<style scoped>
/* Add your custom styles here */
/* Container */
.vitals-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: #f4f6f9;
  border-radius: 8px;
}

/* Patient List */
.patient-list-container {
  flex: 1;
  max-width: 300px;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.patient-list {
  list-style-type: none;
  padding: 0;
  margin-top: 1rem;
}

.patient-item {
  padding: 0.75rem;
  cursor: pointer;
  transition: background 0.3s;
  border-bottom: 1px solid #ddd;
}

.patient-item:hover {
  background: #e3f2fd;
}

.patient-name {
  font-weight: 600;
}

/* Vitals Section */
.vitals-section {
  flex: 2;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.vitals-table {
  width: 100%;
  margin-top: 1rem;
  border-collapse: collapse;
}

.vitals-table th, .vitals-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #ddd;
}

.vitals-table th {
  background: #e3f2fd;
  font-weight: 600;
}

.vitals-table .new-entry {
  background: #c8e6c9;
  animation: fadeIn 1s;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* Enter Vitals Button */
.enter-vitals-button {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.enter-vitals-button:hover {
  background: #0056b3;
}

/* Form Styling */
.vitals-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.vital-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.vital-item label {
  flex: 1;
  font-weight: 500;
}

.vital-item input {
  flex: 2;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.unit {
  font-size: 0.9rem;
  color: #555;
}

/* Submit Button */
.submit-button {
  padding: 0.75rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-button:disabled {
  background: #a1a1a1;
  cursor: not-allowed;
}

.submit-button:hover:not(:disabled) {
  background: #218838;
}
</style>
