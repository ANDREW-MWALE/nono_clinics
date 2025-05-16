<template>
    <div class="modal">
      <h3>Edit employee Employee</h3>
      <p>Are you sure you want to edit this employee?</p>
      <button @click="$emit('confirm')">Yes</button>
      <button @click="$emit('cancel')">Cancel</button>
    </div>
  </template>
  
  <script setup>
  // props, emits, or composables can go here if needed
  </script>
  
  <style scoped>
  .modal {
    padding: 1rem;
    background-color: #fff;
    border-radius: 8px;
  }
  </style>
  