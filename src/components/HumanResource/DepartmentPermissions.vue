<template>
  <div>
    <h2>Department Access Control</h2>
    
    <!-- Loading State -->
    <div v-if="loading.departments" class="status-message">Loading departments...</div>
    <div v-else-if="!departments.length" class="status-message">No departments found</div>
    
    <!-- Department Selection -->
    <div v-else class="department-selector">
      <select 
        v-model="selectedDepartment" 
        @change="loadPermissions"
        class="form-select"
      >
        <option value="" disabled>Select a department</option>
        <option 
          v-for="dept in departments" 
          :value="dept.id" 
          :key="dept.id"
        >
          {{ dept.departmentName }}
        </option>
      </select>
    </div>

    <!-- Permissions Section -->
    <template v-if="selectedDepartment">
      <div v-if="loading.permissions" class="status-message">Loading permissions...</div>
      <div v-else class="permissions-section">
        <h3>Route Permissions</h3>
        <div v-if="!allRoutes.length" class="status-message">No routes available</div>
        <div v-else class="permissions-grid">
          <div 
            v-for="route in allRoutes" 
            :key="route.path" 
            class="permission-item"
          >
            <input
              type="checkbox"
              :id="'route-' + route.path"
              v-model="selectedRoutes"
              :value="route.path"
              class="form-check-input"
            >
            <label :for="'route-' + route.path" class="form-check-label">
              {{ route.meta?.title || route.name || route.path }}
            </label>
          </div>
        </div>

        <button
          @click="savePermissions"
          :disabled="!hasChanges || loading.save"
          class="btn btn-primary mt-3"
        >
          <span v-if="loading.save">
            <span class="spinner-border spinner-border-sm" role="status"></span>
            Saving...
          </span>
          <span v-else>Save Permissions</span>
        </button>
      </div>
    </template>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

export default {
  setup() {
    const router = useRouter()

    // Reactive data
    const departments = ref([])
    const selectedDepartment = ref(null)
    const allRoutes = ref([])
    const selectedRoutes = ref([])
    const originalRoutes = ref([])
    const loading = ref({
      departments: false,
      permissions: false,
      save: false
    })

    // Computed properties
    const hasChanges = computed(() => {
      if (selectedRoutes.value.length !== originalRoutes.value.length) return true
      return !selectedRoutes.value.every(route => 
        originalRoutes.value.includes(route))
    })

    // Notification helper
    const notify = (type, title, message) => {
      if (typeof window !== 'undefined' && window.$notify) {
        window.$notify({ title, message, type })
      } else {
        console[type === 'error' ? 'error' : 'log'](`${title}: ${message}`)
      }
    }

    // Methods
    const loadDepartments = async () => {
      loading.value.departments = true
      try {
        const response = await axios.get('http://localhost:8085/api/department/department')
        departments.value = response.data
      } catch (error) {
        console.error('Department load error:', error)
        notify('error', 'Error', 'Failed to load departments')
      } finally {
        loading.value.departments = false
      }
    }

    const loadPermissions = async () => {
      if (!selectedDepartment.value) return
      
      loading.value.permissions = true
      try {
        const response = await axios.get(
          `http://localhost:8085/api/department/${selectedDepartment.value}/permissions`
        )
        selectedRoutes.value = [...response.data]
        originalRoutes.value = [...response.data]
      } catch (error) {
        console.error('Permissions load error:', error)
        notify('error', 'Error', 'Failed to load permissions')
      } finally {
        loading.value.permissions = false
      }
    }

    const savePermissions = async () => {
      loading.value.save = true
      try {
        await axios.put(
          `http://localhost:8085/api/department/${selectedDepartment.value}/permissions`,
          selectedRoutes.value
        )
        originalRoutes.value = [...selectedRoutes.value]
        notify('success', 'Success', 'Permissions updated successfully')
      } catch (error) {
        console.error('Save permissions error:', error)
        notify('error', 'Error', 'Failed to save permissions')
      } finally {
        loading.value.save = false
      }
    }

    // Lifecycle
    onMounted(async () => {
      await loadDepartments()
      // Prepare routes directly without separate function
      const routes = router.getRoutes()
      allRoutes.value = routes
        .filter(route => route.path && !route.meta?.hidden)
        .flatMap(route => route.children?.length ? route.children : [route])
        .filter(route => route.path && !route.path.startsWith('/:'))
    })

    return {
      departments,
      selectedDepartment,
      allRoutes,
      selectedRoutes,
      loading,
      hasChanges,
      loadPermissions,
      savePermissions
      // No need to return prepareRoutes
    }
  }
}
</script>

<style scoped>
.status-message {
  padding: 1rem;
  color: #666;
  font-style: italic;
}

.department-selector {
  margin: 1rem 0;
  max-width: 300px;
  visibility: visible;
}

.permissions-section {
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.permissions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  margin: 1rem 0;
}

.permission-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.form-check-input {
  margin-right: 0.5rem;
}
</style>