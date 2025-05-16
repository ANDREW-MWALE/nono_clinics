<template>
  <DialogDialog
    :isOpen="show"
    title="Service Order"
    @close="$emit('close')"
  >
    <template #default>
      <div class="services-dialog">
        <div class="dialog-header">
          <div class="patient-info">
            <label>Patient Name:</label>
            <div class="patient-name">{{ patientName }}</div>
          </div>
        </div>

        <div class="search-container">
          <div class="search-box">
            <input
              type="text"
              v-model="searchQuery"
              @input="handleSearch"
              placeholder="Search services..."
              class="search-input"
            />
            <button class="search-button" @click="handleSearch">
              <i class="fas fa-search"></i>
            </button>
          </div>
          
          <div class="selected-preview">
            <input
              type="text"
              :value="selectedService?.serviceName || ''"
              placeholder="Selected service will appear here"
              readonly
              class="selected-input"
            />
          </div>
        </div>

        <div v-if="isLoading" class="loading-state">
          <div class="spinner"></div>
          <p>Loading services...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <i class="fas fa-exclamation-circle"></i>
          <p>Error loading services: {{ error }}</p>
        </div>

        <div v-else class="services-container">
          <h4 v-if="searchQuery && filteredServices.length">Matching Services ({{ filteredServices.length }})</h4>
          <h4 v-else-if="searchQuery">No services found matching "{{ searchQuery }}"</h4>
          
          <div v-if="filteredServices.length" class="services-list">
            <div 
              v-for="service in filteredServices" 
              :key="service.id"
              class="service-card"
              :class="{ selected: isSelected(service) }"
            >
              <div class="service-main" @click="selectService(service)">
                <div class="service-name">{{ service.serviceName }}</div>
                <div class="service-details">
                  <span class="service-price">K{{ service.amount }}</span>
                  <span v-if="service.Department" class="service-department">
                    <i class="fas fa-building"></i> {{ service.Department }}
                  </span>
                  <span v-if="service.duration" class="service-duration">
                    <i class="fas fa-clock"></i> {{ service.duration }} mins
                  </span>
                </div>
              </div>
              <button 
                class="add-button"
                @click.stop="addService(service)"
                :disabled="isSelected(service)"
              >
                <i class="fas fa-plus"></i> Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="dialog-footer">
        <button @click="$emit('close')" class="cancel-button">
          <i class="fas fa-times"></i> Close
        </button>
        <button 
          @click="submitSelectedServices" 
          class="confirm-button"
          :disabled="selectedServices.length === 0"
        >
          <i class="fas fa-check"></i> Order ({{ selectedServices.length }})
        </button>
      </div>
    </template>
  </DialogDialog>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    show: {
      type: Boolean,
      required: true
    },
    patientName: {
      type: String,
      required: true
    },
    selectedServices: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close', 'submit', 'update:selectedServices'],
  data() {
    return {
      searchQuery: '',
      allServices: [],
      filteredServices: [],
      selectedService: null,
      isLoading: false,
      error: null
    };
  },
  async created() {
    await this.fetchServices();
  },
  methods: {
    async fetchServices() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get('http://localhost:8085/api/services/get');
        this.allServices = response.data || [];
        this.filteredServices = []; // Start with empty array until search
      } catch (err) {
        console.error('Error fetching services:', err);
        this.error = err.response?.data?.message || err.message || 'Failed to load services';
      } finally {
        this.isLoading = false;
      }
    },
    handleSearch() {
      const query = this.searchQuery.trim();
      if (!query) {
        this.filteredServices = [];
        return;
      }
      
      const queryLower = query.toLowerCase();
      this.filteredServices = this.allServices.filter(service => {
        return (
          (service.serviceName?.toLowerCase().includes(queryLower)) ||
          (service.Department?.toLowerCase().includes(queryLower)) ||
          (service.description?.toLowerCase().includes(queryLower))
      )});
    },
    selectService(service) {
      this.selectedService = service;
    },
    addService(service) {
      if (!this.isSelected(service)) {
        this.$emit('update:selectedServices', [...this.selectedServices, service]);
      }
    },
    isSelected(service) {
      return this.selectedServices.some(s => s.id === service.id);
    },
    submitSelectedServices() {
      if (this.selectedServices.length > 0) {
        this.$emit('submit', this.selectedServices);
      }
    }
  }
};
</script>

<style scoped>
.services-dialog {
  padding: 20px;
  max-height: 70vh;
  display: flex;
  flex-direction: column;
}

.dialog-header {
  margin-bottom: 20px;
}

.patient-info {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.patient-info label {
  font-weight: 600;
  color: #555;
}

.patient-name {
  padding: 8px 12px;
  background: #f5f5f5;
  border-radius: 4px;
  font-weight: 500;
}

.search-container {
  margin-bottom: 20px;
}

.search-box {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
}

.search-input {
  flex: 1;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-button {
  padding: 0 15px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;
}

.search-button:hover {
  background: #3a7bc8;
}

.selected-input {
  width: 100%;
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #f9f9f9;
  font-size: 14px;
}

.services-container {
  flex: 1;
  overflow-y: auto;
}

.services-container h4 {
  margin-bottom: 15px;
  color: #444;
}

.services-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.service-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 15px;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  background: white;
  transition: all 0.2s;
}

.service-card:hover {
  border-color: #c0c0c0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.service-card.selected {
  background-color: #f0f7ff;
  border-color: #b8d8ff;
}

.service-main {
  flex: 1;
  cursor: pointer;
}

.service-name {
  font-weight: 600;
  margin-bottom: 5px;
  color: #333;
}

.service-details {
  display: flex;
  gap: 15px;
  font-size: 13px;
  color: #666;
}

.service-price {
  color: #2a7f2a;
  font-weight: 500;
}

.add-button {
  padding: 6px 12px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.add-button:hover:not(:disabled) {
  background: #3a7bc8;
}

.add-button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 15px 20px;
  border-top: 1px solid #eee;
}

.cancel-button {
  padding: 8px 16px;
  background: #f5f5f5;
  color: #555;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button:hover {
  background: #e0e0e0;
}

.confirm-button {
  padding: 8px 16px;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.confirm-button:hover:not(:disabled) {
  background: #3a7bc8;
}

.confirm-button:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  color: #666;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #4a90e2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  color: #d9534f;
}

.error-state i {
  font-size: 40px;
  margin-bottom: 15px;
}
</style>