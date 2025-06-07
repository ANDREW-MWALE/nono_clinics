<template>
  <div class="page-container">
    <div class="list-container">
      <div class="header-section">
        <h2>Today's Patients</h2>
        <div class="search-container">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search all patients..."
            class="search-input"
            @input="handleSearch"
          />
          <button class="clear-btn" @click="clearSearch" v-if="searchQuery">
            Clear
          </button>
        </div>
      </div>
      
      <div v-if="loading" class="loading-indicator">Loading...</div>
      
      <ul class="patient-list" v-else>
        <li
          v-for="patient in displayedPatients"
          :key="patient.id"
          class="patient-item"
          @click="selectPatient(patient)"
        >
          <span class="patient-name">
            {{ patient.firstName }} {{ patient.lastName }}
          </span>
          <span class="patient-meta" v-if="isToday(patient.registrationDate)">
            Today
          </span>
          <span class="patient-meta" v-else>
            {{ formatDate(patient.registrationDate) }}
          </span>
          <hr class="divider" />
        </li>
        
        <li v-if="displayedPatients.length === 0" class="no-results">
          No patients found
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment"; // You'll need to install moment.js

export default {
  name: "ClickablePatientList",
  data() {
    return {
      patients: [],
      todayPatients: [],
      allPatients: [],
      searchQuery: "",
      loading: false,
      isSearching: false
    };
  },
  computed: {
    displayedPatients() {
      return this.isSearching ? this.allPatients : this.todayPatients;
    }
  },
  mounted() {
    this.fetchTodayPatients();
  },
  methods: {
    async fetchTodayPatients() {
      this.loading = true;
      try {
        const today = moment().format('YYYY-MM-DD');
        const response = await axios.get(
          `http://localhost:8085/patients/today?date=${today}`
        );
        this.todayPatients = response.data;
        this.loading = false;
      } catch (error) {
        console.error("Error fetching today's patients:", error);
        this.loading = false;
      }
    },
    async fetchAllPatients() {
      this.loading = true;
      try {
        const response = await axios.get("http://localhost:8085/api/patients/names");
        this.allPatients = response.data;
        this.loading = false;
      } catch (error) {
        console.error("Error fetching all patients:", error);
        this.loading = false;
      }
    },
    handleSearch() {
      if (this.searchQuery.trim() && !this.isSearching) {
        this.isSearching = true;
        this.fetchAllPatients();
      } else if (!this.searchQuery.trim()) {
        this.isSearching = false;
      }
    },
    clearSearch() {
      this.searchQuery = "";
      this.isSearching = false;
    },
    selectPatient(patient) {
      this.$emit('patient-selected', {
        id: patient.patientId,
        firstName: patient.firstName,
        lastName: patient.lastName
      });
    },
    isToday(date) {
      return moment(date).isSame(moment(), 'day');
    },
    formatDate(date) {
      return moment(date).format('MMM D, YYYY');
    }
  }
};
</script>

<style scoped>
.page-container {
  display: flex;
  align-items: flex-start;
  padding: 0px;
  background-color: #f9f9f9;
}

.list-container {
  flex: 0 0 300px;
  margin-right: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 15px;
}

.header-section {
  margin-bottom: 15px;
}

h2 {
  font-size: 1.4rem;
  color: #333;
  margin-bottom: 15px;
  text-align: center;
}

.search-container {
  display: flex;
  margin-bottom: 15px;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 0.9rem;
}

.clear-btn {
  margin-left: 8px;
  padding: 8px 12px;
  background-color: #f0f0f0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.clear-btn:hover {
  background-color: #e0e0e0;
}

.patient-list {
  list-style: none;
  padding: 0;
  margin: 0;
  max-height: 500px;
  overflow-y: auto;
}

.patient-item {
  padding: 12px 10px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s ease;
  position: relative;
}

.patient-item:hover {
  background-color: #e9f7fc;
}

.patient-name {
  color: #333;
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 3px;
}

.patient-meta {
  font-size: 0.8rem;
  color: #666;
}

.divider {
  margin: 8px 0 0;
  border: none;
  border-top: 1px solid #eee;
}

.no-results {
  padding: 15px;
  text-align: center;
  color: #666;
  font-style: italic;
}

.loading-indicator {
  padding: 15px;
  text-align: center;
  color: #666;
}

/* Scrollbar styling */
.patient-list::-webkit-scrollbar {
  width: 6px;
}

.patient-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.patient-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.patient-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>