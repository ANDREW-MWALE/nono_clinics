<template>
  <div class="radiography-page">
    <h2 class="section-title">🩻 Add Radiography Record 🩻</h2>

    <div class="form-card">
      <input v-model="newRecord.patient" placeholder="Patient Name" />
      <input v-model="newRecord.result" placeholder="Scan Result" />
      <input type="date" v-model="newRecord.date" />
      <button class="outline-btn" @click="showScanDialog = true">
        Select Scan Type
      </button>
      <span class="selected-types">{{ newRecord.type }}</span>
      <input type="file" @change="handleFileUpload" />
      <button class="primary-btn" @click="addRecord">
        {{ editingIndex !== null ? 'Update' : 'Add' }} Record
      </button>
    </div>

    <!-- Scan Type Dialog -->
    <div v-if="showScanDialog" class="dialog-overlay">
      <div class="dialog">
        <h3>Select Scan Type</h3>
        <div v-for="option in scanTypes" :key="option" class="checkbox-option">
          <label>
            <input
              type="checkbox"
              :value="option"
              v-model="selectedScanTypes"
            />
            {{ option }}
          </label>
        </div>
        <div class="dialog-actions">
          <button @click="applyScanTypes">OK</button>
          <button @click="showScanDialog = false">Cancel</button>
        </div>
      </div>
    </div>

    <div class="toolbar">
      <input v-model="searchQuery" placeholder="🔍 Search by patient or scan type..." />
      <div class="export-buttons">
        <button class="outline-btn" @click="exportExcel">Export to Excel</button>
        <button class="outline-btn" @click="exportPDF">Export to PDF</button>
      </div>
    </div>

    <h3 class="section-title">📋 Radiography Records</h3>
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Patient</th>
            <th>Type</th>
            <th>Result</th>
            <th>Date</th>
            <th>Scan</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(record, index) in filteredRecords" :key="index">
            <td>{{ record.patient }}</td>
            <td>{{ record.type }}</td>
            <td>{{ record.result }}</td>
            <td>{{ record.date }}</td>
            <td>
              <img
                v-if="record.scan"
                :src="record.scan"
                @click="openPreview(record.scan)"
                class="thumbnail"
              />
            </td>
            <td>
              <button class="table-btn edit" @click="editRecord(index)">✏️</button>
              <button class="table-btn delete" @click="deleteRecord(index)">🗑️</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Image Preview Modal -->
    <div v-if="previewImage" class="image-modal" @click="previewImage = null">
      <img :src="previewImage" class="preview-image" />
    </div>
  </div>
</template>

<script>
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default {
  name: 'RadiographyPage',
  data() {
    return {
      newRecord: {
        patient: '',
        type: '',
        result: '',
        date: '',
        scan: null
      },
      records: [],
      editingIndex: null,
      searchQuery: '',
      previewImage: null,
      showScanDialog: false,
      scanTypes: ['X-Ray', 'MRI', 'CT Scan', 'Ultrasound','DEXA Scan','Mammography'],
      selectedScanTypes: []
    };
  },
  computed: {
    filteredRecords() {
      const q = this.searchQuery.toLowerCase();
      return this.records.filter(
        rec =>
          rec.patient.toLowerCase().includes(q) ||
          rec.type.toLowerCase().includes(q)
      );
    }
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = e => {
        this.newRecord.scan = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    addRecord() {
      if (
        !this.newRecord.patient ||
        !this.newRecord.type ||
        !this.newRecord.result ||
        !this.newRecord.date
      ) {
        alert('Please fill out all fields');
        return;
      }

      if (this.editingIndex !== null) {
        this.records.splice(this.editingIndex, 1, { ...this.newRecord });
        this.editingIndex = null;
      } else {
        this.records.push({ ...this.newRecord });
      }

      this.newRecord = {
        patient: '',
        type: '',
        result: '',
        date: '',
        scan: null
      };
      this.selectedScanTypes = [];
    },
    editRecord(index) {
      this.newRecord = { ...this.records[index] };
      this.editingIndex = index;
      this.selectedScanTypes = this.newRecord.type.split(', ');
    },
    deleteRecord(index) {
      if (confirm('Delete this record?')) {
        this.records.splice(index, 1);
      }
    },
    exportExcel() {
      if (this.filteredRecords.length === 0) return;
      const worksheet = XLSX.utils.json_to_sheet(this.filteredRecords.map(({ scan, ...r }) => r));
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Radiography');
      const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
      saveAs(blob, 'RadiographyRecords.xlsx');
    },
    exportPDF() {
      if (this.filteredRecords.length === 0) return;
      const doc = new jsPDF();
      const tableColumn = ['Patient', 'Type', 'Result', 'Date'];
      const tableRows = this.filteredRecords.map(({ scan, ...r }) => [
        r.patient,
        r.type,
        r.result,
        r.date
      ]);
      autoTable(doc, { head: [tableColumn], body: tableRows });
      doc.save('RadiographyRecords.pdf');
    },
    openPreview(src) {
      this.previewImage = src;
    },
    applyScanTypes() {
      this.newRecord.type = this.selectedScanTypes.join(', ');
      this.showScanDialog = false;
    }
  }
};
</script>

<style scoped>
.radiography-page {
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

.form-card input {
  padding: 10px;
  font-size: 14px;
  border-radius: 6px;
  border: 1px solid #ccc;
  flex: 1 1 180px;
}

input:focus {
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
  gap: 20px;
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

.thumbnail {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  cursor: pointer;
}

.image-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
}

.preview-image {
  max-width: 80%;
  max-height: 80%;
  border-radius: 10px;
  box-shadow: 0 0 20px #000;
}

/* Scan Type Dialog Styles */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.dialog {
  background: white;
  padding: 20px;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 20px rgba(0,0,0,0.2);
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;
}

.checkbox-option {
  margin: 10px 0;
}

.selected-types {
  font-weight: bold;
  padding: 10px;
}
</style>
