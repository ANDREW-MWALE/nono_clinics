<template>
    <div v-if="isOpen" class="dialog-overlay">
      <div class="dialog-box">
        <header class="dialog-header">
          <h3>{{ title }}</h3>
          <button @click="closeDialog" class="close-btn">&times;</button>
        </header>
        <main class="dialog-body">
          <slot></slot>
        </main>
        <footer class="dialog-footer">
          <button @click="closeDialog" class="btn cancel">Cancel</button>
          <button @click="confirmAction" class="btn proceed">Proceed</button>
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
    emits: ["close", "proceed"],
    methods: {
      closeDialog() {
        this.$emit("close");
      },
      confirmAction() {
        this.$emit("proceed");
      },
    },
  };
  </script>
  
  <style scoped>
  /* Basic styling for overlay and dialog box */
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  /* Dialog box styling */
  .dialog-box {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    width: 400px;
    max-width: 90%;
    animation: fadeIn 0.3s ease-in-out;
  }
  
  /* Header section */
  .dialog-header {
    padding: 15px;
    border-bottom: 1px solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #007bff;
    color: white;
    border-radius: 8px 8px 0 0;
  }
  
  .dialog-header h3 {
    margin: 0;
    font-size: 18px;
  }
  
  /* Close button */
  .close-btn {
    background: none;
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
  }
  
  /* Body content */
  .dialog-body {
    padding: 20px;
    font-size: 16px;
  }
  
  /* Footer with action buttons */
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    padding: 10px;
    border-top: 1px solid #ddd;
  }
  
  .dialog-footer .btn {
    padding: 10px 20px;
    border: none;
    cursor: pointer;
    font-size: 16px;
    border-radius: 4px;
    margin-left: 10px;
    transition: background-color 0.3s;
  }
  
  .dialog-footer .cancel {
    background-color: #f8f9fa;
    color: #007bff;
  }
  
  .dialog-footer .cancel:hover {
    background-color: #e2e6ea;
  }
  
  .dialog-footer .confirm {
    background-color: #28a745;
    color: white;
  }
  
  .dialog-footer .confirm:hover {
    background-color: #218838;
  }
  
  /* Animation for the dialog */
  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  </style>
  