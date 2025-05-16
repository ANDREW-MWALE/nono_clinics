<template>
  <div class="location-management">
    <h1>Location Management</h1>

    <!-- Flex container to separate form and table -->
    <div class="content-container">
      <!-- Form for adding a new location -->
      <div class="form-container">
        <h2>Add a New Location</h2>
        <form @submit.prevent="addLocation">
          <div class="input-group">
            <label for="locationName">Location Name:</label>
            <input v-model="newLocation.locationName" id="locationName" placeholder="Location Name" class="input-field" />
          </div>
          <button type="submit" class="submit-button">Add Location</button>
        </form>
      </div>

      <!-- Locations Table -->
      <div class="table-container">
        <table class="location-table">
          <thead>
            <tr>
              <th>Location Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="location in locationList" :key="location.id">
              <td>{{ location.locationName }}</td>
              <td>
                <button class="delete-button" @click="deleteLocation(location.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import LocationService from '../services/LocationService';

export default {
  data() {
    return {
      locationList: [],
      newLocation: {
        locationName: '',
      },
    };
  },
  methods: {
    fetchLocation() {
      LocationService.getAllLocations().then((response) => {
        this.locationList = response.data;
      }).catch((error) => {
        console.error("Error fetching locations:", error);
      });
    },
    addLocation() {
      LocationService.createLocation(this.newLocation).then(() => {
        this.fetchLocation();
        this.newLocation.locationName = '';  // Clear the input after adding
      }).catch((error) => {
        console.error("Error adding location:", error);
      });
    },
    deleteLocation(id) {
      LocationService.deleteLocation(id).then(() => {
        this.fetchLocation();
      }).catch((error) => {
        console.error("Error deleting location:", error);
      });
    },
  },
  mounted() {
    this.fetchLocation();
  },
};
</script>

<style scoped>
/* Container for the whole management section */
.location-management {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Flexbox container to separate the form and table */
.content-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
}

/* Styling for the form container with fixed width and height */
.form-container {
  width: 300px; /* Fixed width */
  height: 200px; /* Fixed height */
  background-color: #f7f7f7;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  flex-shrink: 0; /* Prevent the form from shrinking */
  overflow: hidden; /* Prevent content from expanding the container */
}

.form-container h2 {
  margin-bottom: 15px;
}

.input-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
}

.input-group label {
  margin-bottom: 5px;
  font-weight: bold;
}

.input-field {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

.submit-button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.submit-button:hover {
  background-color: #0056b3;
}

/* Styling for the table container */
.table-container {
  flex-grow: 1; /* Allow the table container to grow */
}

.location-table {
  width: 100%;
  border-collapse: collapse;
}

.location-table th,
.location-table td {
  padding: 10px;
  border: 1px solid #ddd;
}

.location-table th {
  background-color: #f2f2f2;
}

.delete-button {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 4px;
}

.delete-button:hover {
  background-color: #c82333;
}
</style>
