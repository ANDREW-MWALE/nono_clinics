<template>
  <div class="lab-page">
    <h2 class="section-title">🧪 Add Patient Lab Test Result</h2>

    <div class="form-card">
      <input v-model="newResult.patient" placeholder="Patient Name" />
      <select v-model="newResult.test">
        <option disabled value="">Select Test</option>
        <option v-for="test in testOptions" :key="test">{{ test }}</option>
      </select>
      <input v-model="newResult.result" placeholder="Result" />
      <input type="date" v-model="newResult.date" />
      <button class="primary-btn" @click="addResult">
        {{ editingIndex !== null ? 'Update' : 'Add' }} Result
      </button>
    </div>

    <div class="toolbar">
      <input v-model="searchQuery" placeholder="🔍 Search by patient or test name..." />
      <div class="export-buttons">
        <button class="outline-btn" @click="exportExcel">Export to Excel</button>
        <button class="outline-btn" @click="exportPDF">Export to PDF</button>
      </div>
    </div>

    <h3 class="section-title">📄 Lab Test Results</h3>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Test</th>
            <th>Result</th>
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(result, index) in filteredResults" :key="index">
            <td>{{ result.patient }}</td>
            <td>{{ result.test }}</td>
            <td>{{ result.result }}</td>
            <td>{{ result.date }}</td>
            <td>
              <button class="table-btn edit" @click="editResult(index)">✏️</button>
              
              <button class="table-btn delete" @click="deleteResult(index)">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default {
  name: 'LaboratoryPage',
  data() {
    return {
      newResult: {
        patient: '',
        test: '',
        result: '',
        date: ''
      },
      testOptions: ['Blood Test', 'Urine Test', 'X-Ray', 'MRI'],
      labResults: [],
      searchQuery: '',
      editingIndex: null
    };
  },
  computed: {
    filteredResults() {
      const query = this.searchQuery.toLowerCase();
      return this.labResults.filter(
        res =>
          res.patient.toLowerCase().includes(query) ||
          res.test.toLowerCase().includes(query)
      );
    }
  },

  methods: {
  addResult() {
    if (
      !this.newResult.patient ||
      !this.newResult.test ||
      !this.newResult.result ||
      !this.newResult.date
    ) {
      alert('Please fill out all fields');
      return;
    }

    if (this.editingIndex !== null) {
      this.labResults.splice(this.editingIndex, 1, { ...this.newResult });
      this.editingIndex = null;
    } else {
      this.labResults.push({ ...this.newResult });
    }

    this.newResult = { patient: '', test: '', result: '', date: '' };
  },

  editResult(index) {
    this.newResult = { ...this.labResults[index] };
    this.editingIndex = index;
  },

  deleteResult(index) {
    if (confirm('Delete this result?')) {
      this.labResults.splice(index, 1);
    }
  },

  exportExcel() {
    const data = this.filteredResults.map(r => ({
      Patient: r.patient,
      Test: r.test,
      Result: r.result,
      Date: r.date
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Lab Results');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(blob, 'LabTestResults.xlsx');
  },

  exportPDF() {
    const doc = new jsPDF();

    autoTable(doc, {
      head: [['Patient', 'Test', 'Result', 'Date']],
      body: this.filteredResults.map(r => [r.patient, r.test, r.result, r.date])
    });

    doc.save('LabTestResults.pdf');
  }
}


}
</script>

<style scoped>
.lab-page {
  max-width: 1000px;
  margin: 40px auto;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
  color: #333;
}

.section-title {
  font-size: 24px;
  margin-bottom: 20px;
}

.form-card {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  padding: 20px;
  background: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  margin-bottom: 30px;
}

.form-card input,
.form-card select {
  padding: 10px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ccc;
  flex: 1 1 180px;
}

input:focus,
select:focus {
  outline: none;
  border-color: #1e88e5;
  box-shadow: 0 0 0 2px rgba(30, 136, 229, 0.2);
}

.primary-btn {
  padding: 10px 20px;
  background-color: #1e88e5;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background 0.3s;
}

.primary-btn:hover {
  background-color: #1565c0;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  gap: 12px;
  flex-wrap: wrap;
}

.toolbar input {
  flex: 1;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.export-buttons {
  display: flex;
  gap: 10px;
}

.outline-btn {
  padding: 8px 14px;
  border: 1px solid #1e88e5;
  background-color: white;
  color: #1e88e5;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.outline-btn:hover {
  background-color: #e3f2fd;
}

.table-wrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
}

thead {
  background-color: #e3f2fd;
}

th, td {
  text-align: left;
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.table-btn {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.table-btn.edit {
  background-color: #ffecb3;
}

.table-btn.delete {
  background-color: #ffcdd2;
}
</style>
