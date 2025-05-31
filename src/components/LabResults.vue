<template>
  <div class="lab-results">
    <h2>Lab Test Results</h2>

    <div class="form">
      <input v-model="form.patient" placeholder="Patient Name" />
      <input v-model="form.test" placeholder="Test Name" />
      <input v-model="form.result" placeholder="Result" />
      <button @click="submitForm">{{ editIndex === null ? 'Add' : 'Update' }}</button>
      <button v-if="editIndex !== null" @click="cancelEdit">Cancel</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>Patient</th>
          <th>Test</th>
          <th>Result</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(entry, index) in results" :key="index">
          <td>{{ entry.patient }}</td>
          <td>{{ entry.test }}</td>
          <td>{{ entry.result }}</td>
          <td>
            <span class="edit-btn" @click="editEntry(index)">Edit</span> |
            <span class="delete-btn" @click="deleteEntry(index)">Delete</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>




<style scoped>
.lab-results {
  padding: 20px;
  font-family: Arial, sans-serif;
}
input {
  margin: 5px;
  padding: 5px;
}
button {
  margin: 5px;
  padding: 6px 12px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
th, td {
  border: 1px solid #ccc;
  padding: 10px;
}
.edit-btn {
  color: blue;
  cursor: pointer;
}
.delete-btn {
  color: red;
  cursor: pointer;
}
</style>
