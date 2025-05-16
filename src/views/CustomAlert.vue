<template>
    <div v-if="isVisible" class="overlay" @click.self="close">
      <div class="alert-dialog">
        <h3 class="alert-title">{{ title }}</h3>
        <p class="alert-message">{{ message }}</p>
        <button class="alert-button" @click="close">OK</button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      title: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true
      },
      isVisible: {
        type: Boolean,
        required: true
      }
    },
    methods: {
      close() {
        this.$emit('close'); // Emit event to parent component
      }
    }
  };
  </script>
  
  <style scoped>
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Ensure it's on top */
  }
  
  .alert-dialog {
    background: white; /* White background for the dialog */
    padding: 20px;
    border-radius: 8px; /* Rounded corners */
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2); /* Subtle shadow */
    width: 300px; /* Fixed width for the dialog */
    text-align: center; /* Center text */
  }
  
  .alert-title {
    font-size: 18px;
    margin-bottom: 10px;
    font-weight: bold; /* Bold title */
  }
  
  .alert-message {
    font-size: 16px; /* Font size for the message */
    margin-bottom: 20px; /* Space below the message */
  }
  
  .alert-button {
    padding: 10px 20px; /* Padding for the button */
    background-color: #007bff; /* Button color */
    color: white; /* Text color */
    border: none; /* No border */
    border-radius: 5px; /* Rounded corners */
    cursor: pointer; /* Pointer cursor on hover */
  }
  
  .alert-button:hover {
    background-color: #0056b3; /* Darker color on hover */
  }
  </style>
  