<template>
    <div class="investigation-container">
      <h2>Investigation & Services</h2>
      <div class="button-bar">
        <button @click="$emit('open-lab')" class="action-button">
          Order Labs
        </button>
        <button @click="$emit('open-services')" class="action-button">
          Order Services
        </button>
        <button @click="$emit('open-radiology')" class="action-button">
          Order Radiology
        </button>
        <button @click="$emit('open-prescription')" class="action-button">
          Order Prescription
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    emits: ['open-lab', 'open-services', 'open-radiology', 'open-prescription']
  }
  </script>
  
  <style scoped>
  .investigation-container {
    padding: 1rem;
  }
  
  h2 {
    margin-bottom: 16px;
    font-size: 1.5rem;
    color: #222;
  }
  
  .button-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .action-button {
    background-color: #007bff;
    color: white;
    border: none;
    padding: 10px 18px;
    border-radius: 5px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .action-button:hover {
    background-color: #0056b3;
  }
  </style>
  
  <style>
  .topcoat-button-bar {
  display: flex;
  gap: 12px;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.topcoat-button-bar__item {
  position: relative;
  display: flex;
  align-items: center;
}

.topcoat-button-bar__item input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.topcoat-button-bar__button {
  background-color: #e0e0e0;
  border: 1px solid #ccc;
  color: #333;
  padding: 10px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s ease;
}

.topcoat-button-bar__button:hover {
  background-color: #d4d4d4;
}

.topcoat-button-bar__item input[type="checkbox"]:checked + .topcoat-button-bar__button {
  background-color: #2196f3;
  color: white;
  border-color: #1976d2;
}

h2 {
  margin-bottom: 12px;
  font-size: 1.5rem;
  color: #333;
}

</style>