<template>
  <DialogDialog 
    :isOpen="true" 
    title="Laboratory Test Order" 
    @close="$emit('close')"
  >
    <template #default>
      <div class="lab-dialog-content">
        <div class="search-section">
          <div class="field-container mb-3">
            <label for="chief-complaint" class="form-label">Patient Name:</label>
            <input id="patients-name" class="form-control" v-model="consultation.patientName" readonly>
          </div>
          <input
            type="text"
            v-model="searchQuery"
            @input="handleSearch"
            placeholder="Search tests..."
            class="form-control mb-2"
          />
          <hr>
          <input
            type="text"
            class="form-control mb-3"
            :value="selectedTest?.testName || ''"
            placeholder="Selected test will appear here"
            readonly
          />
          <button @click="handleSearch" class="btn btn-secondary search-btn">
            <i class="fas fa-search"></i> Search
          </button>
        </div>

        <div v-if="isLoading" class="loading-state">
          <p>Loading tests...</p>
        </div>

        <div v-else-if="error" class="error-state alert alert-danger">
          <p>Error loading tests: {{ error }}</p>
        </div>

        <div v-if="searchQuery">
          <div v-if="filteredTests.length">
            <h4>Available Tests ({{ filteredTests.length }})</h4>
            <ul class="list-unstyled">
              <li 
                v-for="test in filteredTests"
                :key="test.id"
                @click="selectTest(test)"
                :class="{ selected: isSelected(test) }"
                class="test-item p-2 mb-2 border rounded"
              >
                <div class="d-flex justify-content-between">
                  <div>
                    <span class="test-name font-weight-bold">{{ test.testName }}</span>
                    <span class="test-charge ml-2">K{{ test.testCharge }}</span>
                  </div>
                  <div>Department: {{ test.Department }}</div>
                </div>
                <button 
                  @click.stop="addTest(test)"
                  class="btn btn-sm btn-primary mt-2"
                  :disabled="isSelected(test)"
                >
                  Add Test
                </button>
              </li>
            </ul>
          </div>
          <p v-else class="text-muted">No tests found matching "{{ searchQuery }}"</p>
        </div>
      </div>
    </template>

    <template #footer>
      <button @click="$emit('close')" class="btn btn-secondary cancel">
        Close
      </button>
      <button 
        @click="submitTests"
        class="btn btn-primary confirm"
        :disabled="selectedTests.length === 0"
      >
        Order Tests ({{ selectedTests.length }})
      </button>
    </template>
  </DialogDialog>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    consultation: {
      type: Object,
      required: true
    },
    selectedTests: {
      type: Array,
      default: () => []
    }
  },
  emits: ['close', 'update:selectedTests', 'submit'],
  data() {
    return {
      searchQuery: '',
      allTests: [],
      filteredTests: [],
      selectedTest: null,
      isLoading: false,
      error: null
    }
  },
  methods: {
    handleSearch() {
      const query = this.searchQuery.toLowerCase().trim();
      this.filteredTests = this.allTests.filter(test =>
        test.testName && test.testName.toLowerCase().includes(query)
      );
    },
    selectTest(test) {
      this.selectedTest = test || null;
    },
    addTest(test) {
      if (!this.isSelected(test)) {
        this.$emit('update:selectedTests', [...this.selectedTests, test]);
      }
    },
    isSelected(test) {
      return this.selectedTests.some(t => t.id === test.id);
    },
    submitTests() {
      if (this.selectedTests.length > 0) {
        this.$emit('submit', this.selectedTests);
      }
    }
  },
  async created() {
    this.isLoading = true;
    try {
      const response = await axios.get('http://localhost:8085/api/laboratoryTest/get');
      this.allTests = response.data || [];
      this.filteredTests = [...this.allTests];
    } catch (err) {
      console.error('Error fetching tests:', err);
      this.error = err.response?.data?.message || err.message || 'Failed to load tests';
      this.allTests = [];
      this.filteredTests = [];
    } finally {
      this.isLoading = false;
    }
  }
}
</script>

<style scoped>
.test-item {
  cursor: pointer;
  transition: background-color 0.2s;
}
.test-item:hover {
  background-color: #f8f9fa;
}
.test-item.selected {
  background-color: #e9ecef;
}
.search-btn {
  margin-left: 10px;
}
.loading-state {
  text-align: center;
  padding: 20px;
}
</style>