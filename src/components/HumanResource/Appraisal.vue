<template>
  <div class="appraisal-system">
    <!-- Main Controls -->
    <div class="controls">
      <button @click="openAppraisalDialog" class="btn btn-primary">
        <i class="fas fa-plus-circle"></i> New Appraisal
      </button>
      <div class="search-box">
        <input type="text" v-model="appraisalSearchQuery" placeholder="Search appraisals..." />
        <i class="fas fa-search"></i>
      </div>
    </div>

    <!-- Appraisal Records Table -->
    <div class="appraisal-records">
      <div class="table-header">
        <h2><i class="fas fa-clipboard-check"></i> Employee Appraisals</h2>
        <div class="table-actions">
          <button @click="exportAppraisalsToPDF" class="btn btn-export">
            <i class="fas fa-file-pdf"></i> Export PDF
          </button>
        </div>
      </div>
      
      <div class="table-responsive">
        <table class="appraisal-table">
          <thead>
            <tr>
              <th>Ref #</th>
              <th>Employee</th>
              <th>Position</th>
              <th>Period</th>
              <th>Overall Rating</th>
              <th>Manager</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="appraisal in filteredAppraisals" :key="appraisal.id">
              <td>{{ appraisal.id }}</td>
              <td>{{ appraisal.employeeName }}</td>
              <td>{{ appraisal.position }}</td>
              <td>{{ appraisal.appraisalPeriod }}</td>
              <td>
                <div class="rating-display">
                  <span class="rating-number">{{ appraisal.overallRating }}</span>
                  <div class="rating-stars">
                    <i 
                      v-for="star in 5" 
                      :key="star" 
                      :class="star <= appraisal.overallRating ? 'fas fa-star' : 'far fa-star'"
                    ></i>
                  </div>
                </div>
              </td>
              <td>{{ appraisal.managerName }}</td>
              <td>
                <span :class="`status-${appraisal.status}`">
                  {{ appraisal.status }}
                </span>
              </td>
              <td class="actions-cell">
                <button 
                  @click="viewAppraisal(appraisal)" 
                  class="btn-action btn-view" 
                  title="View"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button 
                  v-if="userRole === 'manager' && appraisal.status === 'pending'" 
                  @click="submitAppraisal(appraisal.id)" 
                  class="btn-action btn-submit" 
                  title="Submit"
                >
                  <i class="fas fa-paper-plane"></i>
                </button>
                <button 
                  v-if="userRole === 'hr' && appraisal.status === 'submitted'" 
                  @click="approveAppraisal(appraisal.id)" 
                  class="btn-action btn-approve" 
                  title="Approve"
                >
                  <i class="fas fa-check"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Appraisal Dialog -->
    <dialog-dialog
      :isOpen="isDialogOpen"
      @close="closeDialog"
      @confirm="submitAppraisalForm"
      :title="editingId ? 'Appraisal Details' : 'New Appraisal'"
      :showConfirm="!editingId"
    >
      <div class="appraisal-form">
        <div class="form-row">
          <div class="form-group">
            <label for="app-employee">Employee*</label>
            <select 
              id="app-employee" 
              v-model="appraisal.employeeId" 
              required
              :disabled="!!editingId"
            >
              <option value="">Select Employee</option>
              <option 
                v-for="employee in employees" 
                :key="employee.id" 
                :value="employee.id"
              >
                {{ employee.name }} ({{ employee.position }})
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="app-period">Appraisal Period*</label>
            <input 
              id="app-period" 
              v-model="appraisal.appraisalPeriod" 
              type="text" 
              required
              placeholder="e.g. Q1 2023"
            />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="app-manager">Manager*</label>
            <input 
              id="app-manager" 
              v-model="appraisal.managerName" 
              type="text" 
              required
            />
          </div>
          <div class="form-group">
            <label for="app-date">Appraisal Date*</label>
            <input 
              id="app-date" 
              v-model="appraisal.appraisalDate" 
              type="date" 
              required
            />
          </div>
        </div>
        
        <!-- Performance Metrics -->
        <div class="section">
          <h3><i class="fas fa-chart-line"></i> Performance Metrics</h3>
          <div class="metrics-grid">
            <div 
              v-for="(metric, index) in appraisal.metrics" 
              :key="index" 
              class="metric-item"
            >
              <label>{{ metric.name }}</label>
              <div class="metric-rating">
                <select v-model="metric.rating" class="rating-select">
                  <option value="1">1 - Needs Improvement</option>
                  <option value="2">2 - Developing</option>
                  <option value="3">3 - Meets Expectations</option>
                  <option value="4">4 - Exceeds Expectations</option>
                  <option value="5">5 - Outstanding</option>
                </select>
                <div class="stars-preview">
                  <i 
                    v-for="star in 5" 
                    :key="star" 
                    :class="star <= metric.rating ? 'fas fa-star' : 'far fa-star'"
                  ></i>
                </div>
              </div>
              <textarea 
                v-model="metric.comments" 
                placeholder="Comments..."
                rows="2"
              ></textarea>
            </div>
          </div>
        </div>
        
        <!-- Goals Assessment -->
        <div class="section">
          <h3><i class="fas fa-bullseye"></i> Goals Assessment</h3>
          <div class="goals-list">
            <div 
              v-for="(goal, index) in appraisal.goals" 
              :key="index" 
              class="goal-item"
            >
              <div class="goal-header">
                <input 
                  v-model="goal.description" 
                  type="text" 
                  placeholder="Goal description"
                  class="goal-input"
                />
                <select v-model="goal.status" class="status-select">
                  <option value="not-met">Not Met</option>
                  <option value="partially-met">Partially Met</option>
                  <option value="fully-met">Fully Met</option>
                  <option value="exceeded">Exceeded</option>
                </select>
              </div>
              <textarea 
                v-model="goal.comments" 
                placeholder="Assessment comments..."
                rows="2"
              ></textarea>
              <button 
                v-if="!editingId" 
                @click="removeGoal(index)" 
                class="btn-action btn-delete" 
                title="Remove Goal"
              >
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
            <button 
              v-if="!editingId" 
              @click="addGoal" 
              class="btn btn-secondary"
              type="button"
            >
              <i class="fas fa-plus"></i> Add Goal
            </button>
          </div>
        </div>
        
        <!-- Overall Assessment -->
        <div class="section">
          <h3><i class="fas fa-clipboard-list"></i> Overall Assessment</h3>
          <div class="form-row">
            <div class="form-group">
              <label>Strengths</label>
              <textarea 
                v-model="appraisal.strengths" 
                placeholder="Employee strengths..."
                rows="3"
              ></textarea>
            </div>
            <div class="form-group">
              <label>Areas for Improvement</label>
              <textarea 
                v-model="appraisal.areasForImprovement" 
                placeholder="Areas needing improvement..."
                rows="3"
              ></textarea>
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label>Development Plan</label>
              <textarea 
                v-model="appraisal.developmentPlan" 
                placeholder="Employee development plan..."
                rows="3"
              ></textarea>
            </div>
            <div class="form-group">
              <label>Overall Rating*</label>
              <div class="overall-rating">
                <select v-model="appraisal.overallRating" class="rating-select" required>
                  <option value="1">1 - Unsatisfactory</option>
                  <option value="2">2 - Needs Improvement</option>
                  <option value="3">3 - Satisfactory</option>
                  <option value="4">4 - Good</option>
                  <option value="5">5 - Excellent</option>
                </select>
                <div class="stars-preview">
                  <i 
                    v-for="star in 5" 
                    :key="star" 
                    :class="star <= appraisal.overallRating ? 'fas fa-star' : 'far fa-star'"
                  ></i>
                </div>
              </div>
            </div>
          </div>
          
          <div class="form-group full-width">
            <label>Manager's Comments</label>
            <textarea 
              v-model="appraisal.managerComments" 
              placeholder="Overall comments..."
              rows="4"
            ></textarea>
          </div>
        </div>
        
        <!-- Approval Section -->
        <div v-if="editingId" class="approval-section">
          <div class="form-row">
            <div class="form-group">
              <label>Employee Acknowledgment</label>
              <div class="signature-line">
                <span v-if="appraisal.employeeSigned">Signed: {{ formatDate(appraisal.employeeSignedDate) }}</span>
                <span v-else>Pending signature</span>
              </div>
            </div>
            <div class="form-group">
              <label>HR Approval</label>
              <div class="signature-line">
                <span v-if="appraisal.hrApproved">Approved: {{ formatDate(appraisal.hrApprovedDate) }}</span>
                <span v-else>Pending approval</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </dialog-dialog>
  </div>
</template>

<script>
import DialogDialog from '@/components/DialogDialog.vue';
import html2pdf from 'html2pdf.js';

export default {
  components: { DialogDialog },
  data() {
    return {
      isDialogOpen: false,
      editingId: null,
      appraisalSearchQuery: '',
      appraisals: [],
      employees: [
        { id: 1, name: 'John Doe', position: 'Software Developer' },
        { id: 2, name: 'Jane Smith', position: 'Marketing Manager' },
        { id: 3, name: 'Mike Johnson', position: 'HR Specialist' }
      ],
      appraisal: {
        id: null,
        employeeId: '',
        employeeName: '',
        position: '',
        appraisalPeriod: '',
        appraisalDate: new Date().toISOString().split('T')[0],
        managerName: '',
        metrics: [
          { name: 'Quality of Work', rating: 3, comments: '' },
          { name: 'Productivity', rating: 3, comments: '' },
          { name: 'Technical Skills', rating: 3, comments: '' },
          { name: 'Communication', rating: 3, comments: '' },
          { name: 'Teamwork', rating: 3, comments: '' },
          { name: 'Initiative', rating: 3, comments: '' }
        ],
        goals: [
          { description: '', status: 'fully-met', comments: '' }
        ],
        strengths: '',
        areasForImprovement: '',
        developmentPlan: '',
        overallRating: 3,
        managerComments: '',
        status: 'draft',
        employeeSigned: false,
        employeeSignedDate: null,
        hrApproved: false,
        hrApprovedDate: null
      },
      userRole: 'manager' // 'employee', 'manager', or 'hr'
    }
  },
  computed: {
    filteredAppraisals() {

      if (!this.appraisalSearchQuery) return this.appraisals;
      const query = this.appraisalSearchQuery.toLowerCase();
      return this.appraisals.filter(appraisal => 
        appraisal.employeeName.toLowerCase().includes(query) ||
        appraisal.position.toLowerCase().includes(query) ||
        appraisal.appraisalPeriod.toLowerCase().includes(query) ||
        appraisal.managerName.toLowerCase().includes(query)
      );
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return '';
      return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    },
    
    openAppraisalDialog() {
      this.resetAppraisalForm();
      this.isDialogOpen = true;
    },
    
    closeDialog() {
      this.isDialogOpen = false;
      this.editingId = null;
    },
    
    resetAppraisalForm() {
      this.appraisal = {
        id: null,
        employeeId: '',
        employeeName: '',
        position: '',
        appraisalPeriod: '',
        appraisalDate: new Date().toISOString().split('T')[0],
        managerName: '',
        metrics: [
          { name: 'Quality of Work', rating: 3, comments: '' },
          { name: 'Productivity', rating: 3, comments: '' },
          { name: 'Technical Skills', rating: 3, comments: '' },
          { name: 'Communication', rating: 3, comments: '' },
          { name: 'Teamwork', rating: 3, comments: '' },
          { name: 'Initiative', rating: 3, comments: '' }
        ],
        goals: [
          { description: '', status: 'fully-met', comments: '' }
        ],
        strengths: '',
        areasForImprovement: '',
        developmentPlan: '',
        overallRating: 3,
        managerComments: '',
        status: 'draft',
        employeeSigned: false,
        employeeSignedDate: null,
        hrApproved: false,
        hrApprovedDate: null
      };
    },
    
    addGoal() {
      this.appraisal.goals.push({
        description: '',
        status: 'fully-met',
        comments: ''
      });
    },
    
    removeGoal(index) {
      if (this.appraisal.goals.length > 1) {
        this.appraisal.goals.splice(index, 1);
      }
    },
    
    submitAppraisalForm() {
      const employee = this.employees.find(e => e.id == this.appraisal.employeeId);
      
      const appraisalData = {
        id: this.editingId ?? Date.now(),
        employeeId: this.appraisal.employeeId,
        employeeName: employee ? employee.name : '',
        position: employee ? employee.position : '',
        appraisalPeriod: this.appraisal.appraisalPeriod,
        appraisalDate: this.appraisal.appraisalDate,
        managerName: this.appraisal.managerName,
        metrics: JSON.parse(JSON.stringify(this.appraisal.metrics)),
        goals: JSON.parse(JSON.stringify(this.appraisal.goals)),
        strengths: this.appraisal.strengths,
        areasForImprovement: this.appraisal.areasForImprovement,
        developmentPlan: this.appraisal.developmentPlan,
        overallRating: this.appraisal.overallRating,
        managerComments: this.appraisal.managerComments,
        status: 'draft',
        employeeSigned: false,
        employeeSignedDate: null,
        hrApproved: false,
        hrApprovedDate: null
      };

      if (this.editingId) {
        const index = this.appraisals.findIndex(a => a.id === this.editingId);
        if (index !== -1) this.appraisals.splice(index, 1, appraisalData);
      } else {
        this.appraisals.push(appraisalData);
      }

      this.closeDialog();
    },
    
    viewAppraisal(appraisal) {
      this.appraisal = JSON.parse(JSON.stringify(appraisal));
      this.editingId = appraisal.id;
      this.isDialogOpen = true;
    },
    
    submitAppraisal(id) {
      const appraisal = this.appraisals.find(a => a.id === id);
      if (appraisal) {
        appraisal.status = 'submitted';
      }
    },
    
    approveAppraisal(id) {
      const appraisal = this.appraisals.find(a => a.id === id);
      if (appraisal) {
        appraisal.status = 'approved';
        appraisal.hrApproved = true;
        appraisal.hrApprovedDate = new Date().toISOString();
      }
    },
    
    exportAppraisalsToPDF() {
      if (this.appraisals.length === 0) {
        alert('No appraisals to export');
        return;
      }
      
      const element = document.createElement('div');
      element.innerHTML = `
        <h1 style="text-align: center; margin-bottom: 20px;">Employee Appraisal Report</h1>
        <p style="text-align: right;">Generated: ${new Date().toLocaleDateString()}</p>
        <table border="1" cellpadding="5" cellspacing="0" width="100%" style="margin-top: 20px;">
          <thead>
            <tr>
              <th>Ref #</th>
              <th>Employee</th>
              <th>Position</th>
              <th>Period</th>
              <th>Rating</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${this.appraisals.map(appraisal => `
              <tr>
                <td>${appraisal.id}</td>
                <td>${appraisal.employeeName}</td>
                <td>${appraisal.position}</td>
                <td>${appraisal.appraisalPeriod}</td>
                <td>${appraisal.overallRating}/5</td>
                <td>${appraisal.status}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
      
      const opt = {
        margin: 10,
        filename: 'employee_appraisals.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      
      html2pdf().set(opt).from(element).save();
    }
  }
}
</script>

<style scoped>
/* Main Container */
.appraisal-system {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
}

/* Header Section */
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.search-box {
  position: relative;
  display: flex;
  align-items: center;
}

.search-box i {
  position: absolute;
  left: 0.75rem;
  color: #718096;
}

.search-box input {
  padding: 0.5rem 1rem 0.5rem 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  width: 250px;
}

.search-box input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

/* Table Styles */
.appraisal-records {
  overflow-x: auto;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: white;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #f7fafc;
  border-bottom: 1px solid #e2e8f0;
}

.table-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.appraisal-table {
  width: 100%;
  border-collapse: collapse;
}

.appraisal-table th {
  background-color: #f7fafc;
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  border-bottom: 1px solid #e2e8f0;
}

.appraisal-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: middle;
}

.appraisal-table tr:hover {
  background-color: #f8fafc;
}

/* Rating Display */
.rating-display {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-number {
  font-weight: 500;
  width: 1.5rem;
  text-align: center;
}

.rating-stars {
  color: #f59e0b;
}

/* Status Badges */
.status-pending {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: #fef3c7;
  color: #92400e;
}

.status-draft {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: #f3f4f6;
  color: #4b5563;
}

.status-submitted {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: #dbeafe;
  color: #1e40af;
}

.status-approved {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: #d1fae5;
  color: #065f46;
}

.status-rejected {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: #fee2e2;
  color: #b91c1c;
}

/* Buttons */
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: background-color 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary {
  background-color: #4299e1;
  color: white;
}

.btn-primary:hover {
  background-color: #3182ce;
}

.btn-secondary {
  background-color: #e2e8f0;
  color: #2d3748;
}

.btn-secondary:hover {
  background-color: #cbd5e0;
}

.btn-export {
  background-color: #38a169;
  color: white;
}

.btn-export:hover {
  background-color: #2f855a;
}

.btn-action {
  padding: 0.375rem;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin: 0 0.125rem;
}

.btn-view {
  color: #5a67d8;
  background-color: #ebf4ff;
}

.btn-view:hover {
  background-color: #c3dafe;
}

.btn-submit {
  color: #d97706;
  background-color: #fef3c7;
}

.btn-submit:hover {
  background-color: #fde68a;
}

.btn-approve {
  color: #065f46;
  background-color: #d1fae5;
}

.btn-approve:hover {
  background-color: #a7f3d0;
}

.btn-delete {
  color: #b91c1c;
  background-color: #fee2e2;
  position: absolute;
  right: 0.5rem;
  top: 0.5rem;
}

.btn-delete:hover {
  background-color: #fecaca;
}

/* Form Styles */
.appraisal-form {
  padding: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 0.5rem;
}

.form-group.full-width {
  grid-column: span 2;
}

.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.form-group textarea {
  min-height: 5rem;
  resize: vertical;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

/* Sections */
.section {
  margin: 1.5rem 0;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}

.section h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* Metrics Grid */
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.metric-item {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
}

.metric-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0.5rem 0;
}

.rating-select {
  flex: 1;
}

.stars-preview {
  color: #f59e0b;
}

/* Goals List */
.goals-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.goal-item {
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  position: relative;
}

.goal-header {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.goal-input {
  flex: 1;
}

.status-select {
  width: 10rem;
}

/* Overall Rating */
.overall-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

/* Approval Section */
.approval-section {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e2e8f0;
}

.signature-line {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.25rem;
  min-height: 2.5rem;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .search-box input {
    width: 100%;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
  }
  
  .appraisal-table {
    display: block;
    overflow-x: auto;
  }
  
  .actions-cell {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  
  .form-group.full-width {
    grid-column: span 1;
  }
}
</style>