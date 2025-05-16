<template>
    <div class="form-header mb-4">
      <h1 class="fs-4">Consultation Details</h1>
      <h4 v-if="patientName">For: {{ patientName }}</h4>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      patientName: {
        type: String,
        default: ''
      }
    }
  }
  </script>