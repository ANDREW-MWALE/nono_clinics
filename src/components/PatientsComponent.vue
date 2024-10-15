<template>
  <div>
    <h1>Patients Management</h1>
    
    <div v-for="patient in patientsList" :key="patient.id" class="patient-item">
      <p>{{ patient.firstName }} {{ patient.lastName }}</p>
      <button @click="deletePatient(patient.id)">Delete</button>
    </div>

    <form @submit.prevent="addPatient">
      <input v-model="newPatient.firstName" placeholder="First Name" required />
      <input v-model="newPatient.lastName" placeholder="Last Name" required />
      <button type="submit">Add Patient</button>
    </form>
  </div>
</template>

<script>
import PatientService from '../services/PatieService'; // Ensure this matches your file name exactly

export default {
  data() {
    return {
      patientsList: [],
      newPatient: {
        firstName: "",
        lastName: "",
        address: "",
        historyOfSickness: "",
        currentIllness: "",
        examinationOutCome: "",
        createdBy: "",
        updatedBy: "",
        updatedDate: "",
        lastUpdatedDate: "",
      },
    };
  },
  mounted() {
    this.fetchPatients(); // Fetch patients when the component mounts
  },
  methods: {
    fetchPatients() {
      PatientService.getAllPatients()
        .then((response) => {
          this.patientsList = response.data; // Update patientsList correctly
        })
        .catch((error) => {
          console.error("Error fetching patients:", error);
        });
    },

    addPatient() {
      PatientService.addPatient(this.newPatient)
        .then(() => {
          this.fetchPatients(); // Refresh the list after adding
          this.newPatient = { // Clear the input fields
            firstName: "",
            lastName: "",
            address: "",
            historyOfSickness: "",
            currentIllness: "",
            examinationOutCome: "",
            createdBy: "",
            updatedBy: "",
            updatedDate: "",
            lastUpdatedDate: "",
          };
        })
        .catch((error) => {
          console.error("Error adding patient:", error);
        });
    },

    deletePatient(patientId) {
      PatientService.deletePatient(patientId)
        .then(() => {
          this.fetchPatients(); // Refresh the list after deletion
        })
        .catch((error) => {
          console.error("Error deleting patient:", error);
        });
    },
  },
};
</script>

<style scoped>
.patient-item {
  margin: 10px 0; /* Spacing between patients */
}

input {
  margin-right: 10px; /* Space between input fields */
  padding: 5px; /* Padding for better appearance */
}

button {
  margin-top: 10px; /* Margin for buttons */
}
</style>
