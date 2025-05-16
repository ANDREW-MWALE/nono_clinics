<template>
    <form @submit.prevent="$emit('submit')">
      <div class="field-container mb-3">
        <label for="chief-complaint" class="form-label">Patient Name:</label>
        <input id="patients-name" class="form-control" v-model="consultation.patientName" readonly>
      </div>
      <hr>
      <div class="field-container mb-3">
        <label for="chief-complaint" class="form-label">Chief Complaint:</label>
        <textarea id="chief-complaint" class="form-control" v-model="consultation.chiefComplaints" 
                  placeholder="Add multiple lines" required></textarea>
      </div>
      <hr>
      <div class="field-container mb-3">
        <label for="history-illness" class="form-label">History of Illness:</label>
        <textarea id="history-illness" class="form-control" v-model="consultation.historyOfIllness" 
                  placeholder="Add multiple lines"></textarea>
      </div>
      <hr>
      <div class="field-container mb-3">
        <label for="family-history" class="form-label">Family History:</label>
        <input type="text" id="family-history" v-model="consultation.familyHistory" 
               class="form-control" placeholder="Enter details" />
      </div>
      <hr>
      <div class="field-container mb-3">
        <label for="social-history" class="form-label">Social History:</label>
        <input type="text" id="social-history" v-model="consultation.socialHistory" 
               class="form-control" placeholder="Enter details" />
      </div>
      <hr>       
      
      <div class="field-container mb-3">
        <label for="management-plan" class="form-label">Management Plan:</label>
        <input type="text" id="management-plan" v-model="consultation.managementPlan" 
               class="form-control" placeholder="Enter plan details" />
      </div>
      <hr>     
      
      <button type="submit" class="btn btn-primary mt-4" :disabled="isLoading">
        {{ isLoading ? 'Submitting...' : 'Submit Consultation' }}
      </button>
      <p v-if="errorMessage" class="text-danger mt-2">{{ errorMessage }}</p>
      <p v-if="successMessage" class="text-success mt-2">{{ successMessage }}</p>
    </form>
  </template>
  
  <script>
  export default {
    props: {
      consultation: Object,
      isLoading: Boolean,
      errorMessage: String,
      successMessage: String
    },
    emits: ['submit']
  }
  </script>