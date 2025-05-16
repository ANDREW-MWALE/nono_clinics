<template>
  <div class="pharmacy-component">
    <h2 class="page-title">Stock Management</h2>
    <div class="stock-controls">
      <button class="btn btn-primary" @click="showAddModal = true">
        <i class="ri-add-line"></i> Add Medication
      </button>
      <div class="search-box">
        <i class="ri-search-line search-icon"></i>
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search medications..." 
          class="search-input"
        />
      </div>
    </div>
    
    <div class="table-container">
      <table class="stock-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Medication</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Expiry</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filteredStock" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td><span class="category-tag">{{ item.category }}</span></td>
            <td :class="{ 'low-stock': item.quantity < 10 }">
              <span class="quantity-badge">{{ item.quantity }}</span>
            </td>
            <td :class="{ 'expired': isExpired(item.expiry) }">{{ formatDate(item.expiry) }}</td>
            <td>{{ formatCurrency(item.price) }}</td>
            <td class="actions-cell">
              <button class="btn-icon edit" @click="editItem(item)" title="Edit">
                <i class="ri-edit-line"></i>
              </button>
              <button class="btn-icon danger" @click="confirmDelete(item.id)" title="Delete">
                <i class="ri-delete-bin-line"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <PharmacyStockModal 
      v-if="showAddModal || editingItem"
      :item="editingItem"
      @close="closeModal"
      @save="saveItem"
    />
  </div>
</template>

<script>
import PharmacyStockModal from './PharmacyStockModal.vue'

export default {
  name: 'PharmacyStock',
  components: {
    PharmacyStockModal
  },
  data() {
    return {
      searchQuery: '',
      showAddModal: false,
      editingItem: null,
      stockItems: [
        { id: 1, name: 'Paracetamol', category: 'Analgesic', quantity: 45, expiry: '2024-12-31', price: 5.99 },
        { id: 2, name: 'Amoxicillin', category: 'Antibiotic', quantity: 8, expiry: '2023-11-30', price: 12.50 },
        { id: 3, name: 'Ibuprofen', category: 'NSAID', quantity: 23, expiry: '2025-03-15', price: 7.25 },
        { id: 4, name: 'Lisinopril', category: 'Antihypertensive', quantity: 5, expiry: '2023-09-30', price: 15.75 },
        { id: 5, name: 'Metformin', category: 'Antidiabetic', quantity: 32, expiry: '2024-08-20', price: 9.99 },
      ]
    }
  },
  computed: {
    filteredStock() {
      return this.stockItems.filter(item => 
        item.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(this.searchQuery.toLowerCase())
    )}
  },
  methods: {
    editItem(item) {
      this.editingItem = {...item}
    },
    confirmDelete(id) {
      if (confirm('Are you sure you want to delete this item?')) {
        this.stockItems = this.stockItems.filter(item => item.id !== id)
      }
    },
    closeModal() {
      this.showAddModal = false
      this.editingItem = null
    },
    saveItem(item) {
      if (item.id) {
        const index = this.stockItems.findIndex(i => i.id === item.id)
        this.stockItems.splice(index, 1, item)
      } else {
        item.id = Math.max(...this.stockItems.map(i => i.id)) + 1
        this.stockItems.push(item)
      }
      this.closeModal()
    },
    isExpired(date) {
      return new Date(date) < new Date()
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString()
    },
    formatCurrency(amount) {
      return '$' + amount.toFixed(2)
    }
  }
}
</script>

<style scoped>
.pharmacy-component {
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.page-title {
  color: #2c3e50;
  margin-bottom: 25px;
  font-size: 1.8rem;
  font-weight: 600;
}

.stock-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  gap: 15px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  cursor: pointer;
}

.btn-primary {
  background-color: #4eac6d;
  color: white;
  border: none;
}

.btn-primary:hover {
  background-color: #3d8a57;
}

.search-box {
  position: relative;
  flex-grow: 1;
  max-width: 400px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #7f8c8d;
}

.search-input {
  width: 100%;
  padding: 10px 15px 10px 40px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #4eac6d;
}

.table-container {
  overflow-x: auto;
}

.stock-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.stock-table th {
  background-color: #f8f9fa;
  color: #2c3e50;
  font-weight: 600;
  padding: 12px 15px;
  text-align: left;
  border-bottom: 2px solid #e9ecef;
}

.stock-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}

.stock-table tr:hover {
  background-color: #f8f9fa;
}

.category-tag {
  display: inline-block;
  padding: 4px 8px;
  background-color: #e3f2fd;
  color: #1976d2;
  border-radius: 4px;
  font-size: 0.85rem;
}

.quantity-badge {
  display: inline-block;
  min-width: 24px;
  text-align: center;
  padding: 2px 6px;
  border-radius: 10px;
  background-color: #f5f5f5;
}

.low-stock .quantity-badge {
  background-color: #ffebee;
  color: #d32f2f;
  font-weight: 600;
}

.expired {
  color: #d32f2f;
  font-weight: 500;
}

.actions-cell {
  white-space: nowrap;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  color: #7f8c8d;
}

.btn-icon:hover {
  background-color: #f5f5f5;
}

.btn-icon.edit:hover {
  color: #1976d2;
}

.btn-icon.danger:hover {
  color: #d32f2f;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .stock-controls {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .search-box {
    width: 100%;
    max-width: none;
  }
  
  .stock-table th, 
  .stock-table td {
    padding: 8px 10px;
    font-size: 0.85rem;
  }
}
</style>