<template>
    <div class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <div class="modal-header">
          <h4>{{ item ? 'Edit Medication' : 'Add New Medication' }}</h4>
          <button class="close-btn" @click="close">
            <i class="ri-close-line"></i>
          </button>
        </div>
        
        <form @submit.prevent="save">
          <div class="form-group">
            <label>First Name</label>
            <input v-model="formData.name" required>
          </div>
          <div class="form-group">
            <label>Last Name</label>
            <input v-model="formData.name" required>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Category</label>
              <select v-model="formData.category" required>
                <option value="">Select category</option>
                <option value="Analgesic">Analgesic</option>
                <option value="Antibiotic">Antibiotic</option>
                <option value="Antihistamine">Antihistamine</option>
                <option value="Antacid">Antacid</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div class="form-group">
              <label>Batch Number</label>
              <input v-model="formData.batchNumber" required>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Quantity</label>
              <input type="number" v-model.number="formData.quantity" required>
            </div>
            
            <div class="form-group">
              <label>Unit</label>
              <select v-model="formData.unit" required>
                <option value="Tablets">Tablets</option>
                <option value="Bottles">Bottles</option>
                <option value="Boxes">Boxes</option>
                <option value="Tubes">Tubes</option>
              </select>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Reorder Level</label>
              <input type="number" v-model.number="formData.reorderLevel" required>
            </div>
            
            <div class="form-group">
              <label>Expiry Date</label>
              <input type="date" v-model="formData.expiryDate" required>
            </div>
          </div>
          
          <div class="form-group">
            <label>Price (USD)</label>
            <input type="number" step="0.01" v-model.number="formData.price" required>
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn secondary" @click="close">Cancel</button>
            <button type="submit" class="btn primary">Save</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, watch } from 'vue'
  
  export default {
    props: {
      item: Object
    },
    emits: ['close', 'save'],
    setup(props, { emit }) {
      const formData = ref({
        id: null,
        name: '',
        category: '',
        batchNumber: '',
        quantity: 0,
        unit: 'Tablets',
        reorderLevel: 10,
        expiryDate: '',
        price: 0
      })
  
      watch(() => props.item, (newItem) => {
        if (newItem) {
          formData.value = { ...newItem }
        } else {
          resetForm()
        }
      }, { immediate: true })
  
      function resetForm() {
        formData.value = {
          id: null,
          name: '',
          category: '',
          batchNumber: '',
          quantity: 0,
          unit: 'Tablets',
          reorderLevel: 10,
          expiryDate: '',
          price: 0
        }
      }
  
      function close() {
        emit('close')
      }
  
      function save() {
        emit('save', formData.value)
      }
  
      return {
        formData,
        close,
        save
      }
    }
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0,0,0,0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    border-radius: 8px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  
  .modal-header {
    padding: 20px;
    border-bottom: 1px solid #eee;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .close-btn {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
    color: #777;
  }
  
  form {
    padding: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: 500;
    color: #555;
  }
  
  .form-group input,
  .form-group select {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .form-row {
    display: flex;
    gap: 15px;
  }
  
  .form-row .form-group {
    flex: 1;
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;
    padding-top: 15px;
    border-top: 1px solid #eee;
  }
  
  .btn {
    padding: 10px 20px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    font-weight: 500;
  }
  
  .btn.secondary {
    background: #f0f0f0;
    color: #333;
  }
  
  .btn.primary {
    background: #00829f;
    color: white;
  }
  </style>