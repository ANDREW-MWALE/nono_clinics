<template>
    <!-- Dialog overlay to cover the screen and focus on the dialog -->
    <div v-if="visible" class="dialog-overlay">
      <!-- The main dialog box -->
      <div class="dialog-box">
        <!-- Dialog title, customizable via props -->
        <h3 class="dialog-title">{{ title }}</h3>
        
        <!-- Dialog message, customizable via props -->
        <p class="dialog-message">{{ message }}</p>
        
        <!-- Buttons for user actions: Cancel and Confirm -->
        <div class="dialog-buttons">
          <!-- Emit the cancel event when the Cancel button is clicked -->
          <button class="dialog-btn cancel" @click="cancel">Cancel</button>
          
          <!-- Emit the confirm event when the Confirm button is clicked -->
          <button class="dialog-btn confirm" @click="confirm">Confirm</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    // Props to make the dialog customizable and reactive
    props: {
      // Determines if the dialog is visible
      visible: {
        type: Boolean,
        required: true,
      },
      // Title of the dialog
      title: {
        type: String,
        default: "Confirmation", // Default title if not provided
      },
      // Message in the dialog
      message: {
        type: String,
        default: "Are you sure you want to proceed?", // Default message if not provided
      },
    },
    // Events emitted by the dialog component
    emits: ["cancel", "confirm"],
    methods: {
      // Method to handle the Cancel button click
      cancel() {
        this.$emit("cancel");
      },
      // Method to handle the Confirm button click
      confirm() {
        this.$emit("confirm");
      },
    },
  };
  </script>
  
  <style scoped>
  /* Fullscreen overlay to dim the background */
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }
  
  /* Main container for the dialog */
  .dialog-box {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    width: 300px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    text-align: center;
  }
  
  /* Styles for the dialog title */
  .dialog-title {
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: bold;
  }
  
  /* Styles for the dialog message */
  .dialog-message {
    margin-bottom: 20px;
    font-size: 14px;
    color: #555;
  }
  
  /* Container for the Cancel and Confirm buttons */
  .dialog-buttons {
    display: flex;
    justify-content: space-between;
  }
  
  /* Base styles for both buttons */
  .dialog-btn {
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    font-size: 14px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  /* Specific styles for the Cancel button */
  .dialog-btn.cancel {
    background-color: #f5f5f5;
    color: #333;
  }
  
  /* Hover effect for the Cancel button */
  .dialog-btn.cancel:hover {
    background-color: #e0e0e0;
  }
  
  /* Specific styles for the Confirm button */
  .dialog-btn.confirm {
    background-color: #007bff;
    color: white;
  }
  
  /* Hover effect for the Confirm button */
  .dialog-btn.confirm:hover {
    background-color: #0056b3;
  }
  </style>
  