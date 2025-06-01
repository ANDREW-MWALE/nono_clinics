<template>
  <div class="requisition-system">
    <!-- Main Controls -->
    <div class="controls">
      <button @click="openRequisitionDialog" class="btn btn-primary">
        <i class="fas fa-plus-circle"></i> New Requisition
      </button>
      <div class="search-box">
        <input type="text" v-model="requisitionSearchQuery" placeholder="Search requisitions..." />
        <i class="fas fa-search"></i>
      </div>
    </div>

    <!-- Requisition Records Table -->
    <div class="requisition-records">
      <div class="table-header">
        <h2><i class="fas fa-file-invoice"></i> Requisition Records</h2>
        <div class="table-actions">
          <button @click="exportRequisitionsToCSV" class="btn btn-export">
            <i class="fas fa-file-csv"></i> Export CSV
          </button>
        </div>
      </div>
      
      <div class="table-responsive">
        <table class="requisition-table">
          <thead>
            <tr>
              <th>Req #</th>
              <th>Requested By</th>
              <th>Department</th>
              <th>Date</th>
              <th>Items</th>
              <th>Amount</th>
              <th>Accountant</th>
              <th>Director</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="req in filteredRequisitions" :key="req.id">
              <td>{{ req.id }}</td>
              <td>{{ req.requestedBy }}</td>
              <td>{{ req.department }}</td>
              <td>{{ formatDate(req.date) }}</td>
              <td>
                <div v-for="(item, index) in req.items" :key="index">
                  {{ item.description }} (Qty: {{ item.quantity }})
                </div>
              </td>
              <td>ZMW {{ formatNumber(req.totalAmount) }}</td>
              <td>
                <span :class="{
                  'status-pending': req.accountantStatus === 'pending',
                  'status-approved': req.accountantStatus === 'approved',
                  'status-rejected': req.accountantStatus === 'rejected'
                }">
                  {{ req.accountantStatus }}
                </span>
              </td>
              <td>
                <span :class="{
                  'status-pending': req.directorStatus === 'pending',
                  'status-approved': req.directorStatus === 'approved',
                  'status-rejected': req.directorStatus === 'rejected'
                }">
                  {{ req.directorStatus }}
                </span>
              </td>
              <td class="actions-cell">
                <button 
                  @click="viewRequisition(req)" 
                  class="btn-action btn-view" 
                  title="View"
                >
                  <i class="fas fa-eye"></i>
                </button>
                <button 
                  v-if="userRole === 'accountant' && req.accountantStatus === 'pending'" 
                  @click="approveRequisition(req.id, 'accountant')" 
                  class="btn-action btn-approve" 
                  title="Approve"
                >
                  <i class="fas fa-check"></i>
                </button>
                <button 
                  v-if="userRole === 'accountant' && req.accountantStatus === 'pending'" 
                  @click="rejectRequisition(req.id, 'accountant')" 
                  class="btn-action btn-reject" 
                  title="Reject"
                >
                  <i class="fas fa-times"></i>
                </button>
                <button 
                  v-if="userRole === 'director' && req.accountantStatus === 'approved' && req.directorStatus === 'pending'" 
                  @click="approveRequisition(req.id, 'director')" 
                  class="btn-action btn-approve" 
                  title="Approve"
                >
                  <i class="fas fa-check"></i>
                </button>
                <button 
                  v-if="userRole === 'director' && req.accountantStatus === 'approved' && req.directorStatus === 'pending'" 
                  @click="rejectRequisition(req.id, 'director')" 
                  class="btn-action btn-reject" 
                  title="Reject"
                >
                  <i class="fas fa-times"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Requisition Dialog -->
    <dialog-dialog
      :isOpen="isDialogOpen"
      @close="closeDialog"
      @confirm="submitRequisitionForm"
      :title="editingId ? 'Requisition Details' : 'New Requisition'"
      :showConfirm="!editingId"
    >
      <div class="requisition-form">
        <div class="form-row">
          <div class="form-group">
            <label for="req-requestedBy">Requested By*</label>
            <input 
              id="req-requestedBy" 
              v-model="requisition.requestedBy" 
              type="text" 
              required 
              :disabled="!!editingId"
            />
          </div>
          <div class="form-group">
            <label for="req-department">Department*</label>
            <input 
              id="req-department" 
              v-model="requisition.department" 
              type="text" 
              required 
              :disabled="!!editingId"
            />
          </div>
        </div>
        
        <div class="form-row">
          <div class="form-group">
            <label for="req-date">Date*</label>
            <input 
              id="req-date" 
              v-model="requisition.date" 
              type="date" 
              required 
              :disabled="!!editingId"
            />
          </div>
          <div class="form-group">
            <label for="req-purpose">Purpose*</label>
            <input 
              id="req-purpose" 
              v-model="requisition.purpose" 
              type="text" 
              required 
              :disabled="!!editingId"
            />
          </div>
        </div>
        
        <div class="items-section">
          <h3>Items Requested</h3>
          <div class="item-list">
            <div v-for="(item, index) in requisition.items" :key="index" class="item-row">
              <div class="form-row">
                <div class="form-group">
                  <label :for="`item-desc-${index}`">Description*</label>
                  <input 
                    :id="`item-desc-${index}`" 
                    v-model="item.description" 
                    type="text" 
                    required 
                    :disabled="!!editingId"
                  />
                </div>
                <div class="form-group">
                  <label :for="`item-qty-${index}`">Quantity*</label>
                  <input 
                    :id="`item-qty-${index}`" 
                    v-model.number="item.quantity" 
                    type="number" 
                    min="1" 
                    required 
                    :disabled="!!editingId"
                  />
                </div>
                <div class="form-group">
                  <label :for="`item-price-${index}`">Unit Price (ZMW)*</label>
                  <input 
                    :id="`item-price-${index}`" 
                    v-model.number="item.unitPrice" 
                    type="number" 
                    min="0" 
                    step="0.01" 
                    required 
                    :disabled="!!editingId"
                  />
                </div>
                <div class="form-group">
                  <label>Total</label>
                  <div class="item-total">ZMW {{ formatNumber(item.quantity * item.unitPrice) }}</div>
                </div>
                <button 
                  v-if="!editingId" 
                  @click="removeItem(index)" 
                  class="btn-action btn-delete" 
                  title="Remove Item"
                >
                  <i class="fas fa-trash-alt"></i>
                </button>
              </div>
            </div>
          </div>
          <button 
            v-if="!editingId" 
            @click="addItem" 
            class="btn btn-secondary"
            type="button"
          >
            <i class="fas fa-plus"></i> Add Item
          </button>
        </div>
        
        <div class="total-section">
          <label>TOTAL AMOUNT</label>
          <div class="total-amount">ZMW {{ formatNumber(requisitionTotal) }}</div>
        </div>
        
        <!-- Approval Status Display (when viewing) -->
        <div v-if="editingId" class="approval-status">
          <div class="status-row">
            <span class="status-label">Accountant:</span>
            <span :class="`status-${requisition.accountantStatus}`">
              {{ requisition.accountantStatus }}
              <span v-if="requisition.accountantComment"> - {{ requisition.accountantComment }}</span>
            </span>
          </div>
          <div class="status-row">
            <span class="status-label">Director:</span>
            <span :class="`status-${requisition.directorStatus}`">
              {{ requisition.directorStatus }}
              <span v-if="requisition.directorComment"> - {{ requisition.directorComment }}</span>
            </span>
          </div>
        </div>
      </div>
    </dialog-dialog>
  </div>
</template>

<script>
import DialogDialog from '@/components/DialogDialog.vue';

export default {
  components: { DialogDialog },
  data() {
    return {
      isDialogOpen: false,
      editingId: null,
      requisitionSearchQuery: '',
      requisitions: [],
      requisition: {
        id: null,
        requestedBy: '',
        department: '',
        date: new Date().toISOString().split('T')[0],
        purpose: '',
        items: [
          { description: '', quantity: 1, unitPrice: 0 }
        ],
        accountantStatus: 'pending',
        directorStatus: 'pending',
        accountantComment: '',
        directorComment: ''
      },
      userRole: 'accountant' // 'employee', 'accountant', or 'director'
    }
  },
  computed: {
    requisitionTotal() {
      return this.requisition.items.reduce((total, item) => {
        return total + (item.quantity * item.unitPrice);
      }, 0);
    },
    
    filteredRequisitions() {
      if (!this.requisitionSearchQuery) return this.requisitions;
      const query = this.requisitionSearchQuery.toLowerCase();
      return this.requisitions.filter(req => 
        req.requestedBy.toLowerCase().includes(query) ||
        req.department.toLowerCase().includes(query) ||
        req.purpose.toLowerCase().includes(query) ||
        req.items.some(item => item.description.toLowerCase().includes(query)) ||
        req.date.toLowerCase().includes(query)
      );
    }
  },
  methods: {
    formatNumber(value) {
      return Number(value).toFixed(2);
    },
    
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    },
    
    openRequisitionDialog() {
      this.resetRequisitionForm();
      this.isDialogOpen = true;
    },
    
    closeDialog() {
      this.isDialogOpen = false;
      this.editingId = null;
    },
    
    resetRequisitionForm() {
      this.requisition = {
        id: null,
        requestedBy: '',
        department: '',
        date: new Date().toISOString().split('T')[0],
        purpose: '',
        items: [
          { description: '', quantity: 1, unitPrice: 0 }
        ],
        accountantStatus: 'pending',
        directorStatus: 'pending',
        accountantComment: '',
        directorComment: ''
      };
    },
    
    addItem() {
      this.requisition.items.push({
        description: '',
        quantity: 1,
        unitPrice: 0
      });
    },
    
    removeItem(index) {
      if (this.requisition.items.length > 1) {
        this.requisition.items.splice(index, 1);
      }
    },
    
    submitRequisitionForm() {
      const reqData = {
        id: this.editingId ?? Date.now(),
        requestedBy: this.requisition.requestedBy,
        department: this.requisition.department,
        date: this.requisition.date,
        purpose: this.requisition.purpose,
        items: this.requisition.items.map(item => ({
          description: item.description,
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })),
        totalAmount: this.requisitionTotal,
        accountantStatus: this.requisition.accountantStatus,
        directorStatus: this.requisition.directorStatus,
        accountantComment: this.requisition.accountantComment,
        directorComment: this.requisition.directorComment
      };

      if (this.editingId) {
        const index = this.requisitions.findIndex(r => r.id === this.editingId);
        if (index !== -1) this.requisitions.splice(index, 1, reqData);
      } else {
        this.requisitions.push(reqData);
      }

      this.closeDialog();
    },
    
    viewRequisition(req) {
      this.requisition = JSON.parse(JSON.stringify(req));
      this.editingId = req.id;
      this.isDialogOpen = true;
    },
    
    approveRequisition(id, role) {
      const req = this.requisitions.find(r => r.id === id);
      if (req) {
        if (role === 'accountant') {
          req.accountantStatus = 'approved';
          req.accountantComment = 'Approved by accountant';
        } else if (role === 'director') {
          req.directorStatus = 'approved';
          req.directorComment = 'Approved by director';
        }
      }
    },
    
    rejectRequisition(id, role) {
      const comment = prompt('Enter rejection reason:');
      if (comment !== null) {
        const req = this.requisitions.find(r => r.id === id);
        if (req) {
          if (role === 'accountant') {
            req.accountantStatus = 'rejected';
            req.accountantComment = comment;
          } else if (role === 'director') {
            req.directorStatus = 'rejected';
            req.directorComment = comment;
          }
        }
      }
    },
    
    exportRequisitionsToCSV() {
      const rows = [
        ['Req #', 'Requested By', 'Department', 'Date', 'Purpose', 'Items', 'Total Amount', 'Accountant Status', 'Director Status']
      ];
      
      this.requisitions.forEach(req => {
        const itemsText = req.items.map(item => 
          `${item.description} (Qty: ${item.quantity}, Price: ${item.unitPrice})`
        ).join('; ');
        
        rows.push([
          req.id,
          req.requestedBy,
          req.department,
          req.date,
          req.purpose,
          itemsText,
          req.totalAmount,
          req.accountantStatus,
          req.directorStatus
        ]);
      });

      const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'requisitions.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}
</script>

<style scoped>
/* Main Container */
.requisition-system {
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
.requisition-records {
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

.requisition-table {
  width: 100%;
  border-collapse: collapse;
}

.requisition-table th {
  background-color: #f7fafc;
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  border-bottom: 1px solid #e2e8f0;
}

.requisition-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: top;
}

.requisition-table tr:hover {
  background-color: #f8fafc;
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

.btn-approve {
  color: #065f46;
  background-color: #d1fae5;
}

.btn-approve:hover {
  background-color: #a7f3d0;
}

.btn-reject {
  color: #b91c1c;
  background-color: #fee2e2;
}

.btn-reject:hover {
  background-color: #fecaca;
}

.btn-delete {
  color: #b91c1c;
  background-color: #fee2e2;
}

.btn-delete:hover {
  background-color: #fecaca;
}

/* Form Styles */
.requisition-form {
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

.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #4a5568;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.items-section {
  margin: 1.5rem 0;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}

.items-section h3 {
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 1rem;
}

.item-row {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px dashed #e2e8f0;
}

.item-row:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}

.item-total {
  padding: 0.5rem;
  background-color: #f8fafc;
  border-radius: 0.25rem;
  font-weight: 500;
}

.total-section {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 0.375rem;
  text-align: center;
}

.total-section label {
  font-size: 0.875rem;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.total-amount {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
}

.approval-status {
  margin-top: 1.5rem;
  padding: 1rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
}

.status-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.status-row:last-child {
  margin-bottom: 0;
}

.status-label {
  font-weight: 500;
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
  
  .requisition-table {
    display: block;
    overflow-x: auto;
  }
  
  .actions-cell {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  
  .item-row .form-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .item-row .btn-action {
    margin-top: 0.5rem;
  }
}
</style>