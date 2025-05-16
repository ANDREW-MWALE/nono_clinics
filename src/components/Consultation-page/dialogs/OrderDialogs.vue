<template>
    <div>
      <lab-order-dialog
        v-if="showLabDialog"
        :consultation="consultation"
        :selected-tests="selectedTests"
        @close="$emit('close-lab')"
        @submit="$emit('submit-tests', $event)"
      />
      
      <services-order-dialog
        v-if="showServicesDialog"
        :consultation="consultation"
        :selected-services="selectedServices"
        @close="$emit('close-services')"
        @submit="$emit('submit-services', $event)"
      />
      
      <prescription-dialog
        v-if="isDialogOpen"
        @close="$emit('close')"
        @confirm="$emit('confirm')"
      />
    </div>
  </template>
  
  <script>
  import LabOrderDialog from './LabOrderDialog.vue'
  import ServicesOrderDialog from './ServiceOrderDialog.vue'
  import PrescriptionDialog from './PrescriptionDialog.vue'
  
  export default {
    components: {
      LabOrderDialog,
      ServicesOrderDialog,
      PrescriptionDialog
    },
    props: {
      showLabDialog: Boolean,
      showServicesDialog: Boolean,
      isDialogOpen: Boolean,
      consultation: Object,
      selectedTests: Array,
      selectedServices: Array
    },
    emits: [
      'close-lab', 
      'close-services', 
      'close', 
      'submit-tests', 
      'submit-services', 
      'confirm'
    ]
  }
  </script>