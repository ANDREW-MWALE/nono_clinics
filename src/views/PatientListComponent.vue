<template>
  <div class="patient-list-container">
    <div class="list-header">
      <h2>{{ title }}</h2>
      <div class="search-box">
        <input 
          v-model="searchTerm" 
          placeholder="Search patients..."
          @input="handleSearch"
        />
        <i class="ri-search-line"></i>
      </div>
    </div>

    <div class="table-responsive">
      <table class="patient-table">
        <thead>
          <tr>
            <th @click="sortBy('id')">ID <i :class="sortIcon('id')"></i></th>
            <th @click="sortBy('firstName')">Name <i :class="sortIcon('firstName')"></i></th>
            <th @click="sortBy('phoneNumber')">Phone <i :class="sortIcon('phoneNumber')"></i></th>
            <th @click="sortBy('lastVisitDate')">Last Visit <i :class="sortIcon('lastVisitDate')"></i></th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="patient in sortedPatients" :key="patient.id">
            <td>{{ patient.id }}</td>
            <td>
              <router-link :to="`/patient-details/${patient.id}`" class="patient-name">
                {{ patient.firstName }} {{ patient.lastName }}
              </router-link>
            </td>
            <td>{{ formatPhone(patient.phoneNumber) }}</td>
            <td>{{ formatDate(patient.lastVisitDate) }}</td>
            <td class="action-buttons">
              <button @click="viewHistory(patient.id)" class="btn-view">
                <i class="ri-history-line"></i> History
              </button>
              <button @click="confirmDelete(patient.id)" class="btn-delete">
                <i class="ri-delete-bin-line"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="filteredPatients.length === 0" class="empty-state">
      <i class="ri-user-search-line"></i>
      <p>No patients found</p>
    </div>

    <div class="pagination-controls" v-if="filteredPatients.length > itemsPerPage">
      <button @click="prevPage" :disabled="currentPage === 1">
        <i class="ri-arrow-left-s-line"></i>
      </button>
      <span>Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages">
        <i class="ri-arrow-right-s-line"></i>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    patients: {
      type: Array,
      default: () => [],
      required: true
    },
    title: {
      type: String,
      default: "Patients List"
    }
  },
  data() {
    return {
      searchTerm: "",
      currentPage: 1,
      itemsPerPage: 10,
      sortField: "id",
      sortDirection: "asc"
    };
  },
  computed: {
    filteredPatients() {
      if (!this.patients || !Array.isArray(this.patients)) return [];
      
      const term = this.searchTerm.toLowerCase();
      return this.patients.filter(patient => {
        return (
          (patient.firstName?.toLowerCase().includes(term) || false) ||
          (patient.lastName?.toLowerCase().includes(term) || false) ||
          (patient.phoneNumber?.includes(term) || false) ||
          (patient.id?.toString().includes(term) || false)
        );
      });
    },
    sortedPatients() {
      return [...this.filteredPatients].sort((a, b) => {
        let fieldA = a[this.sortField];
        let fieldB = b[this.sortField];

        // Handle null/undefined values
        if (fieldA == null) return this.sortDirection === "asc" ? 1 : -1;
        if (fieldB == null) return this.sortDirection === "asc" ? -1 : 1;

        // Special handling for dates
        if (this.sortField === "lastVisitDate") {
          fieldA = new Date(fieldA).getTime();
          fieldB = new Date(fieldB).getTime();
        }

        // Case insensitive string comparison
        if (typeof fieldA === "string") {
          fieldA = fieldA.toLowerCase();
          fieldB = fieldB.toLowerCase();
        }

        if (fieldA < fieldB) {
          return this.sortDirection === "asc" ? -1 : 1;
        }
        if (fieldA > fieldB) {
          return this.sortDirection === "asc" ? 1 : -1;
        }
        return 0;
      }).slice(
        (this.currentPage - 1) * this.itemsPerPage,
        this.currentPage * this.itemsPerPage
      );
    },
    totalPages() {
      return Math.ceil(this.filteredPatients.length / this.itemsPerPage);
    }
  },
  methods: {
    formatPhone(phone) {
      if (!phone) return "-";
      // Simple phone formatting - adjust as needed
      return phone.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    },
    formatDate(dateString) {
      if (!dateString) return "Never visited";
      try {
        return new Date(dateString).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        });
      } catch {
        return dateString;
      }
    },
    sortBy(field) {
      if (this.sortField === field) {
        this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc";
      } else {
        this.sortField = field;
        this.sortDirection = "asc";
      }
    },
    sortIcon(field) {
      if (this.sortField !== field) return "ri-arrow-up-down-line";
      return this.sortDirection === "asc" 
        ? "ri-arrow-up-line" 
        : "ri-arrow-down-line";
    },
    viewHistory(patientId) {
      this.$emit("view-history", patientId);
    },
    confirmDelete(patientId) {
      if (confirm("Are you sure you want to delete this patient?")) {
        this.$emit("delete-patient", patientId);
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    handleSearch() {
      this.currentPage = 1; // Reset to first page when searching
      this.$emit("search", this.searchTerm);
    }
  }
};
</script>

<style scoped>
.patient-list-container {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.search-box {
  position: relative;
  width: 300px;
}

.search-box input {
  width: 100%;
  padding: 10px 15px 10px 35px;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  font-size: 14px;
}

.search-box i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
}

.patient-table {
  width: 100%;
  border-collapse: collapse;
}

.patient-table th {
  background-color: #f8f9fa;
  padding: 12px 15px;
  text-align: left;
  font-weight: 600;
  color: #555;
  cursor: pointer;
  user-select: none;
}

.patient-table th:hover {
  background-color: #f1f3f5;
}

.patient-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #f0f0f0;
}

.patient-table tr:hover td {
  background-color: #f9f9f9;
}

.patient-name {
  color: #2c3e50;
  text-decoration: none;
  font-weight: 500;
}

.patient-name:hover {
  color: #4eac6d;
  text-decoration: underline;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn-view, .btn-delete {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 13px;
}

.btn-view {
  background-color: #e3f2fd;
  color: #1976d2;
}

.btn-delete {
  background-color: #ffebee;
  color: #d32f2f;
}

.empty-state {
  text-align: center;
  padding: 40px 0;
  color: #888;
}

.empty-state i {
  font-size: 50px;
  margin-bottom: 15px;
  color: #ddd;
}

.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-top: 20px;
}

.pagination-controls button {
  background: none;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px 10px;
  cursor: pointer;
}

.pagination-controls button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-controls button:hover:not(:disabled) {
  background-color: #f5f5f5;
}
</style>