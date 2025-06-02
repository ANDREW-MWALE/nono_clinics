<template>
  <div class="p-4">
    <h2 class="text-xl font-bold mb-4">Lab Test Results</h2>

    <!-- Lab Form -->
    <form @submit.prevent="handleSubmit" class="mb-6 space-y-2">
      <input v-model="form.patient" placeholder="Patient Name" class="border p-2 w-full" required />
      <input v-model="form.test" placeholder="Test Type" class="border p-2 w-full" required />
      <input v-model="form.result" placeholder="Result" class="border p-2 w-full" required />
      <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
        {{ isEdit ? 'Update' : 'Add' }} Result
      </button>
    </form>

    <!-- Results Table -->
    <table class="w-full border">
      <thead>
        <tr class="bg-gray-200">
          <th class="p-2">Patient</th>
          <th class="p-2">Test</th>
          <th class="p-2">Result</th>
          <th class="p-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="result in labResults" :key="result._id">
          <td class="p-2">{{ result.patient }}</td>
          <td class="p-2">{{ result.test }}</td>
          <td class="p-2">{{ result.result }}</td>
          <td class="p-2 space-x-2">
            <button @click="editResult(result)" class="text-blue-500">Edit</button>
            <button @click="deleteResult(result._id)" class="text-red-500">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'LabPage',
  data() {
    return {
      labResults: [],
      form: { patient: '', test: '', result: '', _id: null },
      isEdit: false,
    }
  },
  created() {
    this.fetchResults()
  },
  methods: {
    async fetchResults() {
      const res = await axios.get('http://localhost:3000/api/lab-results')
      this.labResults = res.data
    },
    async handleSubmit() {
      if (this.isEdit) {
        await axios.put(`http://localhost:3000/api/lab-results/${this.form._id}`, this.form)
      } else {
        await axios.post('http://localhost:3000/api/lab-results', this.form)
      }
      this.resetForm()
      this.fetchResults()
    },
    editResult(result) {
      this.form = { ...result }
      this.isEdit = true
    },
    async deleteResult(id) {
      await axios.delete(`http://localhost:3000/api/lab-results/${id}`)
      this.fetchResults()
    },
    resetForm() {
      this.form = { patient: '', test: '', result: '', _id: null }
      this.isEdit = false
    },
  },
}
</script>

<style scoped>
/* Add styling if needed */
</style>
