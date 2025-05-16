<template>
  <div>
    <!-- Button to open the dialog -->
    <button @click="openDialog" class="open-dialog-btn">
      Open Dialog
    </button>

    <!-- Dialog Component -->
    <DialogDialog :isOpen="isDialogOpen" @close="closeDialog" @confirm="handleConfirm">
      <div class="form">
        <div class="search-selector">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search for an item..."
            class="input"
          />

          <ul v-if="filteredItems.length">
            <li 
              v-for="(item, index) in filteredItems" 
              :key="index" 
              @click="selectItem(item)"
              class="list-item"
            >
              {{ item }}
            </li>
          </ul>
          <p v-else>No results found</p>

          <div v-if="selectedItem">
            <h3>Selected Item:</h3>
            <p>{{ selectedItem }}</p>
          </div>

          <!-- Frequency and Quantity Inputs -->
          <div>
            <label for="frequency">Frequency</label>
            <input type="text" v-model="frequency" placeholder="Enter frequency">
          </div>
          <div>
            <label for="quantity">Quantity</label>
            <input type="text" v-model="quantity" placeholder="Enter quantity">
          </div>

          <!-- Color Dropdown -->
          <div>
            <label for="colorDropdown">Choose a blue shade:</label>
            <select id="colorDropdown" v-model="selectedColor">
              <option value="#0000FF">Blue (Primary)</option>
              <option value="#1E90FF">Dodger Blue</option>
              <option value="#6495ED">Cornflower Blue</option>
              <option value="#4682B4">Steel Blue</option>
              <option value="#5F9EA0">Cadet Blue</option>
            </select>
          </div>
        </div>
      </div>
    </DialogDialog>
  </div>
</template>

<script>
import DialogDialog from '@/components/DialogDialog.vue';

export default {
  components: {
    DialogDialog,
  },
  data() {
    return {
      isDialogOpen: false, // Control dialog visibility
      searchQuery: '',
      items: ['Apple', 'Banana', 'Orange', 'Pineapple', 'Grapes', 'Watermelon'],
      selectedItem: null,
      frequency: '', // For frequency field
      quantity: '', // For quantity field
      selectedColor: '#0000FF', // For color dropdown
    };
  },
  computed: {
    filteredItems() {
      return this.items.filter((item) =>
        item.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    },
  },
  methods: {
    openDialog() {
      this.isDialogOpen = true; // Open the dialog when the button is clicked
    },
    closeDialog() {
      this.isDialogOpen = false; // Close the dialog only when requested
    },
    handleConfirm() {
      console.log("Dialog confirmed!");
      console.log("Frequency:", this.frequency);
      console.log("Quantity:", this.quantity);
      console.log("Selected Item:", this.selectedItem);
      console.log("Selected Color:", this.selectedColor);

      // Leave the dialog open unless you explicitly want to close it
    },
    selectItem(item) {
      this.selectedItem = item;
      this.searchQuery = ''; // Clear search after selection
    },
  },
};
</script>

<style scoped>
/* Button styling */
.open-dialog-btn {
  background-color: #007bff;
  color: white;
  font-size: 16px;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.open-dialog-btn:hover {
  background-color: #0056b3;
}

.form {
  padding: 20px;
}

.search-selector {
  margin-bottom: 20px;
}

.input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.list-item {
  padding: 8px;
  background: #f3f3f3;
  cursor: pointer;
  border-bottom: 1px solid #ddd;
}

.list-item:hover {
  background: #dcdcdc;
}

select {
  padding: 8px;
  border-radius: 4px;
  width: 100%;
}

input {
  padding: 8px;
  border-radius: 4px;
  width: 100%;
  margin: 10px 0;
}
</style>
