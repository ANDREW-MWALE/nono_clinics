<template>
    <div class="pharmacy-settings">
      <h2>Pharmacy Settings</h2>
      <div class="settings-section">
        <h3>System Configuration</h3>
        <form class="settings-form">
          <div class="form-group">
            <label>Pharmacy Name</label>
            <input type="text" v-model="settings.pharmacyName">
          </div>
          <div class="form-group">
            <label>Address</label>
            <textarea v-model="settings.address"></textarea>
          </div>
          <button type="submit" class="btn-save">Save Settings</button>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'PharmacySettings',
    data() {
      return {
        settings: {
          pharmacyName: '',
          address: ''
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .pharmacy-settings {
    padding: 20px;
    background: white;
    border-radius: 8px;
  }
  
  .settings-section {
    margin-top: 20px;
  }
  
  .settings-form {
    margin-top: 15px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
  }
  
  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .btn-save {
    background: #00829f;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>