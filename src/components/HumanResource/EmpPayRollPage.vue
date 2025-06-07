<template>
  <div class="payroll-system">
    <!-- Main Controls -->
    <div class="controls">
      <button @click="openDialog" class="btn btn-primary">
        <i class="fas fa-plus-circle"></i> Add Payroll Entry
      </button>
      <div class="search-box">
        <input type="text" v-model="searchQuery" placeholder="Search employees..." />
        <i class="fas fa-search"></i>
      </div>
    </div>

<!-- Add/Edit Dialog -->
<div v-if="isDialogOpen" class="dialog-overlay">
  <div class="dialog-content">
    <div class="dialog-header">
      <h3>{{ editingId ? 'Edit Payroll Entry' : 'Add Payroll Entry' }}</h3>
      <button @click="closeDialog" class="dialog-close">&times;</button>
    </div>
    <form @submit.prevent="submitForm" class="payroll-form">
      <div class="form-row">
  <div class="form-group">
    <label for="name">Employee Name*</label>
    <input 
      id="name" 
      v-model="employeeSearch" 
      type="text" 
      @input="searchEmployees" 
      @focus="showEmployeeDropdown = true"
      @blur="handleBlur"
      @keydown.down="handleKeyDown"
      @keydown.up="handleKeyDown"
      @keydown.enter="handleKeyDown"
      @keydown.esc="showEmployeeDropdown = false"
      required 
    />
    <div v-if="showEmployeeDropdown" class="employee-dropdown">
      <div v-if="isSearching" class="dropdown-message">
        <span class="loading-text">Searching employees...</span>
      </div>
      <div v-else-if="filteredEmployees.length === 0" class="dropdown-message">
        <span class="no-results">No employees found</span>
        <button 
          @click="openNewEmployeeDialog" 
          class="btn-create-employee"
        >
          Create New Employee
        </button>
      </div>
      <div 
        v-else
        v-for="(employee, index) in filteredEmployees" 
        :key="employee.id"
        @mousedown.prevent="selectEmployee(employee)" 
        :class="['dropdown-item', { highlighted: currentHighlight === index }]"
      >
        {{ employee.employeeName }} 
      </div>
    </div>
  </div>
  <div class="form-group">
    <label for="position">Position*</label>
    <input id="position" v-model="formData.position" type="text" required readonly />
  </div>
</div>

<div class="form-row">
  <div class="form-group">
    <label for="department">Department</label>
    <input id="department" v-model="formData.department" type="text" readonly />
  </div>
  <div class="form-group">
    <label for="month">Month*</label>
    <input id="month" v-model="formData.month" type="month" required />
  </div>
</div>
      
      <!-- Rest of your form fields -->
      <div class="form-row">
        <div class="form-group">
          <label for="basic">Basic Salary (ZMW)*</label>
          <input id="basic" v-model.number="formData.basicSalary" type="number" min="0" step="0.01" required />
        </div>
        <div class="form-group">
          <label for="allowance">Allowance (ZMW)</label>
          <input id="allowance" v-model.number="formData.allowance" type="number" min="0" step="0.01" />
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label for="bonus">Bonus (ZMW)</label>
          <input id="bonus" v-model.number="formData.bonus" type="number" min="0" step="0.01" />
        </div>
        <div class="form-group">
          <label for="loan">Loan (ZMW)</label>
          <input id="loan" v-model.number="formData.loan" type="number" min="0" step="0.01" />
        </div>
      </div>
      
      <div class="net-salary-display">
        <label>NET SALARY</label>
        <div class="net-amount">ZMW {{ formatCurrency(estimatedNetSalary) }}</div>
      </div>
      
      <div class="form-actions">
        <button type="button" @click="closeDialog" class="btn btn-secondary">Cancel</button>
        <button type="submit" class="btn btn-primary">{{ editingId ? 'Update' : 'Submit' }}</button>
      </div>
    </form>
  </div>
</div>
</div>      
    <!-- Payroll Records Table -->
    <div class="payroll-records">
      <div class="table-header">
        <h2><i class="fas fa-file-invoice-dollar"></i> Payroll Records</h2>
        <div class="table-actions">
          <button @click="exportToCSV" class="btn btn-export">
            <i class="fas fa-file-csv"></i> Export CSV
          </button>
        </div>
      </div>
     
      <div class="table-responsive">
        <div v-if="isLoading" class="loading-message">Loading payroll data...</div>
        <div v-else-if="error" class="error-message">{{ error }}</div>
        <table v-else class="payroll-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Employee</th>
              <th>Position</th>
              <th>Month</th>
              <th>Basic</th>
              <th>Deductions</th>
              <th>Allowance</th>
              <th>Net Pay</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in filteredPayroll" :key="entry.id">
              <td>{{ entry.id }}</td>
              <td>{{ entry.name }}</td>
              <td>{{ entry.position }}</td>
              <td>{{ formatMonth(entry.month) }}</td>
              <td>ZMW {{ formatCurrency(entry.basicSalary) }}</td>
              <td>
                <div>NHIMA: ZMW {{ formatCurrency(entry.nhima) }}</div>
                <div>NAPSA: ZMW {{ formatCurrency(entry.napsa) }}</div>
                <div>ZRA: ZMW {{ formatCurrency(entry.zra) }}</div>
                <div v-if="entry.loan">Loan: ZMW {{ formatCurrency(entry.loan) }}</div>
              </td>
              <td>ZMW {{ formatCurrency(entry.allowance) }}</td>
              <td class="net-cell">ZMW {{ formatCurrency(entry.net) }}</td>
              <td class="actions-cell">
                <button @click="editPayroll(entry)" class="btn-action btn-edit" title="Edit">
                  <i class="fas fa-edit"></i>
                </button>
                <button @click="confirmDelete(entry.id)" class="btn-action btn-delete" title="Delete">
                  <i class="fas fa-trash-alt"></i>
                </button>
                <button @click="printPayslip(entry)" class="btn-action btn-print" title="Print Payslip">
                  <i class="fas fa-print"></i>
                </button>
                <button @click="downloadPayslip(entry)" class="btn-action btn-download" title="Download PDF">
                  <i class="fas fa-file-pdf"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- A4 Payslip Template (Hidden) -->
    <div v-if="currentPayslip" id="payslip-a4" class="payslip-a4-template" style="display: none;">
      <div class="payslip-header">
        <div class="company-info">
          <div class="company-logo">
            div class
            <h1>{{ company.name }}</h1>
            <div class="company-address">
              {{ company.address }}<br>
              {{ company.city }}, {{ company.country }}<br>
              Tel: {{ company.phone }} | Email: {{ company.email }}<br>
              TPIN: {{ company.taxId }}
            </div>
          </div>
        </div>
        <div class="payslip-title">
          <h2>PAYSLIP</h2>
          <div class="payslip-period">{{ formatMonth(currentPayslip.month) }}</div>
          <div class="payslip-number">Payslip #{{ currentPayslip.id }}</div>
        </div>
      </div>

      <div class="employee-details">
        <div class="detail-column">
          <div class="detail-row">
            <div class="detail-label">Employee Name:</div>
            <div class="detail-value">{{ currentPayslip.name }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Position:</div>
            <div class="detail-value">{{ currentPayslip.position }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Department:</div>
            <div class="detail-value">{{ currentPayslip.department || 'N/A' }}</div>
          </div>
        </div>
        <div class="detail-column">
          <div class="detail-row">
            <div class="detail-label">Pay Date:</div>
            <div class="detail-value">{{ currentDate }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Pay Period:</div>
            <div class="detail-value">{{ formatMonth(currentPayslip.month) }}</div>
          </div>
          <div class="detail-row">
            <div class="detail-label">Employee ID:</div>
            <div class="detail-value">{{ currentPayslip.id }}</div>
          </div>
        </div>
      </div>

      <div class="earnings-deductions">
        <div class="earnings-section">
          <h3><i class="fas fa-money-bill-wave"></i> Earnings</h3>
          <table class="amounts-table">
            <tr>
              <td>Basic Salary</td>
              <td class="amount">ZMW {{ formatCurrency(currentPayslip.basicSalary) }}</td>
            </tr>
            <tr v-if="currentPayslip.allowance > 0">
              <td>Allowance</td>
              <td class="amount">ZMW {{ formatCurrency(currentPayslip.allowance) }}</td>
            </tr>
            <tr v-if="currentPayslip.bonus > 0">
              <td>Bonus</td>
              <td class="amount">ZMW {{ formatCurrency(currentPayslip.bonus) }}</td>
            </tr>
            <tr class="total-row">
              <td>Total Earnings</td>
              <td class="amount">ZMW {{ formatCurrency(currentPayslip.basicSalary + currentPayslip.allowance + currentPayslip.bonus) }}</td>
            </tr>
          </table>
        </div>

        <div class="deductions-section">
          <h3><i class="fas fa-minus-circle"></i> Deductions</h3>
          <table class="amounts-table">
            <tr v-if="currentPayslip.nhima > 0">
              <td>NHIMA</td>
              <td class="amount">ZMW {{ formatCurrency(currentPayslip.nhima) }}</td>
            </tr>
            <tr v-if="currentPayslip.napsa > 0">
              <td>NAPSA</td>
              <td class="amount">ZMW {{ formatCurrency(currentPayslip.napsa) }}</td>
            </tr>
            <tr v-if="currentPayslip.zra > 0">
              <td>ZRA</td>
              <td class="amount">ZMW {{ formatCurrency(currentPayslip.zra) }}</td>
            </tr>
            <tr v-if="currentPayslip.loan > 0">
              <td>Loan</td>
              <td class="amount">ZMW {{ formatCurrency(currentPayslip.loan) }}</td>
            </tr>
            <tr class="total-row">
              <td>Total Deductions</td>
              <td class="amount">ZMW {{ formatCurrency(currentPayslip.nhima + currentPayslip.napsa + currentPayslip.zra + currentPayslip.loan) }}</td>
            </tr>
          </table>
        </div>
      </div>

      <div class="net-pay-section">
        <div class="net-pay-amount">
          <span class="net-pay-label">Net Pay:</span>
          <span class="net-pay-value">ZMW {{ formatCurrency(currentPayslip.net) }}</span>
        </div>
        <div class="amount-in-words">Amount in words: {{ numberToWords(currentPayslip.net) }} Kwacha Only</div>
      </div>

      <div class="signature-section">
        <div class="signature-box">
          <div class="signature-label">Employee Signature</div>
          <div class="signature-line"></div>
          <div class="signature-date">Date: ________________</div>
        </div>
        <div class="signature-box">
          <div class="signature-label">Authorized Signature</div>
          <div class="signature-line"></div>
          <div class="signature-name">{{ company.name }}</div>
          <div class="signature-date">Date: {{ currentDate }}</div>
        </div>
      </div>

      <div class="footer-note">
        <div>This is a computer generated payslip and does not require a signature.</div>
        <div class="confidential">CONFIDENTIAL</div>
      </div>
    </div>
</template>

<script>
import html2pdf from 'html2pdf.js';
import axios from 'axios';

export default {
  data() {
    return {
      isDialogOpen: false,
      justSelected: false, // Add this flag to handle blur events
      formData: {
        id: null,
        name: '',
        position: '',
        department: '',
        month: '',
        basicSalary: 0,
        allowance: 0,
        bonus: 0,
        loan: 0,
        nhima: 0,
        napsa: 0,
        zra: 0,
        net: 0
      },
       employeeSearch: '',
       employees: [],
       filteredEmployees: [],
       showEmployeeDropdown: false,
       isSearching: false,
       searchDebounce: null,
       currentHighlight: -1,
      payroll: [],
      editingId: null,
      currentPayslip: null,
      searchQuery: '',
      isLoading: false,
      error: null,
      company: {
        name: 'XYZ COMPANY LIMITED',
        address: '123 Business Park, Lusaka',
        city: 'Lusaka',
        country: 'Zambia',
        phone: '+260 211 123456',
        email: 'accounts@xyzcompany.co.zm',
        taxId: 'TPIN-123456789'
      },
      currentDate: new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      })
    }
  },
  computed: {
    estimatedNetSalary() {
      const gross = this.formData.basicSalary + this.formData.allowance + this.formData.bonus;
      const estimatedNhima = gross * 0.01;
      const estimatedNapsa = gross * 0.05;
      const estimatedZra = this.estimatePayee(gross);
      
      return gross - (estimatedNhima + estimatedNapsa + estimatedZra + this.formData.loan);
    },
    filteredPayroll() {
      if (!this.searchQuery) return this.payroll;
      const query = this.searchQuery.toLowerCase();
      return this.payroll.filter(entry => 
        entry.name.toLowerCase().includes(query) ||
        entry.position.toLowerCase().includes(query) ||
        (entry.department && entry.department.toLowerCase().includes(query)) ||
        (entry.month && entry.month.toLowerCase().includes(query)));
    }
  },
  methods: {
 estimatePayee(grossPay) {
    // 2025 Zambian PAYE Tax Bands (Official)
    if (grossPay <= 5100) return 0;          // First K5,100 tax-free
    
    if (grossPay <= 7100) {                  // Next K5,100.01-K7,100
      return (grossPay - 5100) * 0.20;
    }
    
    if (grossPay <= 9200) {                  // Next K7,100.01-K9,200
      return (2000 * 0.20) + (grossPay - 7100) * 0.30;
    }
    
    // K9,200.01 and above
    return (2000 * 0.20) + (2100 * 0.30) + (grossPay - 9200) * 0.37;
  },
    async fetchPayrollData() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await axios.get('http://localhost:8085/api/payroll/fetch');
        this.payroll = response.data;
      } catch (error) {
        console.error("Error fetching payroll data:", error);
        this.error = "Failed to load payroll data. Please try again.";
      } finally {
        this.isLoading = false;
      }
    },
    openDialog() {
      this.resetForm();
      this.isDialogOpen = true;
    },
    closeDialog() {
      this.isDialogOpen = false;
      this.editingId = null;
    },
    resetForm() {
      this.formData = {
        id: null,
        name: '',
        position: '',
        department: '',
        month: '',
        basicSalary: 0,
        allowance: 0,
        bonus: 0,
        loan: 0,
        nhima: 0,
        napsa: 0,
        zra: 0,
        net: 0
      };
    },
   async submitForm() {
  // Validate required fields
  if (!this.formData.name || !this.formData.position || !this.formData.month || !this.formData.basicSalary) {
    this.error = "Please fill in all required fields";
    return;
  }

  // Format the date to include day (YYYY-MM-DD) for LocalDate parsing
  const formattedMonth = `${this.formData.month}-01`;
  
  // Calculate gross pay (sum of all earnings)
  const grossPay = Number(this.formData.basicSalary) + 
                   (Number(this.formData.allowance) || 0) + 
                   (Number(this.formData.bonus) || 0);

  // Prepare payload matching backend model
  const payData = {
    id: this.editingId || null,
    name: this.formData.name.trim(),
    position: this.formData.position.trim(),
    department: this.formData.department?.trim() || null,
    month: formattedMonth,
    basicSalary: Number(this.formData.basicSalary),
    allowance: Number(this.formData.allowance) || 0,
    bonus: Number(this.formData.bonus) || 0,
    loan: Number(this.formData.loan) || 0,
    grossPay: grossPay
  };

  try {
    const baseUrl = 'http://localhost:8085/api/payroll';
    let response;

    if (this.editingId) {
      // Update existing entry
      response = await axios.put(`${baseUrl}/${this.editingId}`, payData);
      const index = this.payroll.findIndex(p => p.id === this.editingId);
      if (index !== -1) {
        this.payroll.splice(index, 1, response.data);
      }
    } else {
      // Create new entry
      response = await axios.post(`${baseUrl}/add`, payData);
      this.payroll.push(response.data);
    }

    // Success handling
    this.closeDialog();
    await this.fetchPayrollData(); // Refresh data
    
    // Show success message
    if (this.$toast) {
      this.$toast.success(`Payroll entry ${this.editingId ? 'updated' : 'added'} successfully!`);
    } else {
      alert(`Payroll entry ${this.editingId ? 'updated' : 'added'} successfully!`);
    }

  } catch (error) {
    console.error('Payroll submission error:', error);
    
    // Enhanced error parsing
    let errorMessage = 'Failed to process payroll entry. Please try again.';
    
    if (error.response) {
      // Backend returned error response
      if (error.response.status === 400) {
        errorMessage = error.response.data?.message || 
                      'Invalid data format. Please check your entries.';
      } else if (error.response.status === 500) {
        errorMessage = 'Server error occurred. Please contact support.';
      }
    } else if (error.request) {
      // No response received
      errorMessage = 'Network error. Please check your internet connection.';
    }

    // Display error
    this.error = errorMessage;
    if (this.$toast) {
      this.$toast.error(errorMessage);
    } else {
      alert(errorMessage);
    }
  }
},
async fetchEmployees() {
  try {
    const response = await axios.get('http://localhost:8085/api/auth/register');
    this.employees = response.data.map(emp => ({
      id: emp.id,
      employeeName: emp.employeeName || emp.name, // Handle different field names
      position: emp.position,
      department: emp.department,
      basicSalary: emp.basicSalary || 0
    }));
  } catch (error) {
    console.error('Error fetching employees:', error);
  }
},

    async searchEmployees() {
  clearTimeout(this.searchDebounce);
  this.isSearching = true;

  this.searchDebounce = setTimeout(() => {
    if (this.employeeSearch.length < 2) {
      this.filteredEmployees = [];
      this.isSearching = false;
      this.showEmployeeDropdown = false; // hide dropdown if search is too short
      return;
    }

    const searchTerm = this.employeeSearch.toLowerCase();
    this.filteredEmployees = this.employees.filter(employee =>
      (employee.employeeName && employee.employeeName.toLowerCase().includes(searchTerm)) ||
      (employee.id && employee.id.toLowerCase().includes(searchTerm)) ||
      (employee.position && employee.position.toLowerCase().includes(searchTerm))
    ).slice(0, 5);

    this.showEmployeeDropdown = true; // ✅ SHOW THE DROPDOWN HERE
    this.isSearching = false;
  }, 300);
},

     selectEmployee(employee) {
    // Set the form data with employee details
    this.formData = {
      ...this.formData, // Keep existing form data
      name: employee.employeeName,
      position: employee.position,
      department: employee.department,
      // Include basic salary if available
      basicSalary: employee.basicSalary || this.formData.basicSalary
    };
    
    // Set the search input to show the selected name
    this.employeeSearch = employee.employeeName;
    
    // Close the dropdown
    this.showEmployeeDropdown = false;
    this.currentHighlight = -1;
  },


    handleKeyDown(event) {
      if (!this.showEmployeeDropdown) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          this.currentHighlight = Math.min(this.currentHighlight + 1, this.filteredEmployees.length - 1);
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.currentHighlight = Math.max(this.currentHighlight - 1, -1);
          break;
        case 'Enter':
          event.preventDefault();
          if (this.currentHighlight >= 0) {
            this.selectEmployee(this.filteredEmployees[this.currentHighlight]);
          }
          break;
        case 'Escape':
          this.showEmployeeDropdown = false;
          break;
      }
    },

  handleBlur() {
    // Only close dropdown if no selection was made
    setTimeout(() => {
      if (!this.justSelected) {
        this.showEmployeeDropdown = false;
      }
      this.justSelected = false;
    }, 200);
  },
    openNewEmployeeDialog() {
      console.log('Open new employee dialog');
      this.showEmployeeDropdown = false;
      // Implement opening your employee creation dialog here
    },

    editPayroll(entry) {
      this.editingId = entry.id;
      this.formData = {
        id: entry.id,
        name: entry.name,
        position: entry.position,
        department: entry.department,
        month: entry.month,
        basicSalary: entry.basicSalary,
        allowance: entry.allowance,
        bonus: entry.bonus,
        loan: entry.loan,
        nhima: entry.nhima,
        napsa: entry.napsa,
        zra: entry.zra,
        net: entry.net
      };
      this.isDialogOpen = true;
    },
    async confirmDelete(id) {
      if (confirm('Are you sure you want to delete this payroll entry?')) {
        try {
          await axios.delete(`http://localhost:8085/api/payroll/${id}`);
          this.payroll = this.payroll.filter(p => p.id !== id);
        } catch (error) {
          console.error('Error deleting payroll entry:', error);
          this.error = "Failed to delete payroll entry. Please try again.";
        }
      }
    },
    formatCurrency(value) {
      return Number(value).toFixed(2);
    },
    formatMonth(month) {
      if (!month) return '';
      const [year, m] = month.split('-');
      return `${new Date(month).toLocaleString('default', { month: 'short' })} ${year}`;
    },
    numberToWords(num) {
      const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
      const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
      const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
      
      num = parseFloat(num).toFixed(2);
      const [whole, decimal] = num.split('.');
      
      if (whole == 0) return 'Zero';
      
      function convertLessThanOneThousand(num) {
        if (num == 0) return '';
        let result = '';
        
        if (num >= 100) {
          result += ones[Math.floor(num/100)] + ' Hundred ';
          num %= 100;
        }
        
        if (num >= 20) {
          result += tens[Math.floor(num/10)] + ' ';
          num %= 10;
        } else if (num >= 10) {
          result += teens[num-10] + ' ';
          num = 0;
        }
        
        if (num > 0) {
          result += ones[num] + ' ';
        }
        
        return result.trim();
      }
      
      let words = convertLessThanOneThousand(whole);
      if (decimal > 0) {
        words += ` and ${decimal}/100`;
      }
      
      return words + ' Kwacha Only';
    },
    printPayslip(entry) {
      this.currentPayslip = entry;
      this.$nextTick(() => {
        const element = document.getElementById('payslip-a4').cloneNode(true);
        element.style.display = 'block';
        
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <html>
            <head>
              <title>Payslip for ${entry.name}</title>
              <style>
                body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
                .payslip-a4-template {
                  width: 210mm;
                  min-height: 297mm;
                  padding: 15mm;
                  box-sizing: border-box;
                  background: white;
                  color: #333;
                }
                .payslip-header {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 20px;
                  padding-bottom: 15px;
                  border-bottom: 2px solid #333;
                }
                .company-info { flex: 1; }
                .company-logo h1 { margin: 0 0 5px 0; font-size: 24px; }
                .payslip-title h2 { margin: 0 0 5px 0; font-size: 28px; }
                .employee-details {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 30px;
                  padding: 15px;
                  background-color: #f8f9fa;
                }
                .detail-column { width: 48%; }
                .detail-row { display: flex; margin-bottom: 8px; }
                .detail-label { font-weight: bold; width: 140px; }
                .earnings-deductions { display: flex; justify-content: space-between; margin-bottom: 30px; }
                .earnings-section, .deductions-section { width: 48%; }
                .amounts-table { width: 100%; border-collapse: collapse; }
                .amounts-table td { padding: 8px 0; border-bottom: 1px solid #eee; }
                .amount { text-align: right; }
                .total-row td { font-weight: bold; border-top: 1px solid #333; }
                .net-pay-section { text-align: center; margin: 30px 0; padding: 20px; background-color: #f8f9fa; }
                .net-pay-value { font-size: 28px; font-weight: bold; }
                .signature-section { display: flex; justify-content: space-between; margin-top: 50px; }
                .signature-box { width: 200px; text-align: center; }
                .signature-line { border-top: 1px solid #333; margin-bottom: 5px; }
                @page { size: A4; margin: 0; }
              </style>
            </head>
            <body>
              ${element.outerHTML}
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(function() {
                    window.close();
                  }, 1000);
                };
              <\/script>
            </body>
          </html>
        `);
        printWindow.document.close();
      });
    },
    downloadPayslip(entry) {
      this.currentPayslip = entry;
      this.$nextTick(() => {
        const element = document.getElementById('payslip-a4');
        const opt = {
          margin: 10,
          filename: `Payslip_${entry.name}_${entry.month}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        
        html2pdf().set(opt).from(element).save();
      });
    },
    exportToCSV() {
      const rows = [
        ['ID', 'Name', 'Position', 'Department', 'Month', 'Basic Salary', 'Allowance', 'Bonus', 'Loan', 'NHIMA', 'NAPSA', 'ZRA', 'Net Salary']
      ];
      this.payroll.forEach(entry => {
        rows.push([
          entry.id,
          entry.name,
          entry.position,
          entry.department,
          entry.month,
          entry.basicSalary,
          entry.allowance,
          entry.bonus,
          entry.loan,
          entry.nhima,
          entry.napsa,
          entry.zra,
          entry.net
        ]);
      });

      const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'payroll.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  },

  mounted() {
    this.fetchPayrollData();
    this.fetchEmployees();

  }}
</script>


<style scoped>
/* Main Container */
.payroll-system {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* Dialog Styles */
.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dialog-content {
  background: white;
  border-radius: 8px;
  width: 800px;
  max-width: 90%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e2e8f0;
}

.dialog-header h3 {
  margin: 0;
  font-size: 1.25rem;
  color: #2d3748;
}

.dialog-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #718096;
  padding: 0.25rem;
}

.dialog-close:hover {
  color: #2d3748;
}

/* Header Section */
.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
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
  font-size: 0.875rem;
  transition: all 0.2s;
}

.search-box input:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

/* Table Styles */
.payroll-records {
  overflow-x: auto;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  background-color: white;
  margin-top: 1.5rem;
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
  margin: 0;
}

.loading-message, .error-message {
  padding: 1rem;
  text-align: center;
  font-weight: 500;
}

.loading-message {
  color: #4299e1;
}

.error-message {
  color: #e53e3e;
}

.payroll-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.payroll-table th {
  background-color: #f7fafc;
  padding: 0.75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #4a5568;
  border-bottom: 1px solid #e2e8f0;
}

.payroll-table td {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #e2e8f0;
  vertical-align: top;
}

.payroll-table tr:hover {
  background-color: #f8fafc;
}

.net-cell {
  font-weight: 500;
  color: #2f855a;
}

/* Buttons */
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  border: none;
  font-size: 0.875rem;
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
  color: white;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-edit {
  background-color: #ebf8ff;
  color: #3182ce;
}

.btn-edit:hover {
  background-color: #bee3f8;
}

.btn-delete {
  background-color: #fff5f5;
  color: #e53e3e;
}

.btn-delete:hover {
  background-color: #fed7d7;
}

.btn-print {
  background-color: #ebf4ff;
  color: #5a67d8;
}

.btn-print:hover {
  background-color: #c3dafe;
}

.btn-download {
  background-color: #faf5ff;
  color: #805ad5;
}

.btn-download:hover {
  background-color: #e9d8fd;
}

/* Form Styles */
.payroll-form {
  padding: 1rem 1.5rem;
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
  transition: all 0.2s;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #4299e1;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
}

.net-salary-display {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #f8fafc;
  border-radius: 0.375rem;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.net-salary-display label {
  font-size: 0.875rem;
  color: #718096;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 0.5rem;
}

.net-amount {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

/* Payslip Template (Hidden) */
.payslip-a4-template {
  display: none;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box input {
    width: 100%;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .payroll-table {
    display: block;
    overflow-x: auto;
  }
  
  .actions-cell {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  
  .dialog-content {
    width: 95%;
    max-height: 85vh;
  }
}

@media (max-width: 480px) {
  .payroll-table th, 
  .payroll-table td {
    padding: 0.5rem;
    font-size: 0.75rem;
  }
  
  .btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }
  /* Employee Search Dropdown Styles */
.employee-dropdown {
  position: absolute;
  z-index: 1000;
  width: calc(100% - 2px);
  max-height: 200px;
  overflow-y: auto;
  background: white;
  border: 1px solid #ddd;
  border-top: none;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  border-bottom: 1px solid #eee;
}

.dropdown-item:hover, .dropdown-item.highlighted {
  background-color: #f5f5f5;
}

.dropdown-item:last-child {
  border-bottom: none;
}

.dropdown-message {
  padding: 8px 12px;
  color: #666;
  font-style: italic;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.loading-text {
  display: flex;
  align-items: center;
  gap: 8px;
}

.loading-text:before {
  content: "";
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #ddd;
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.no-results {
  color: #e74c3c;
}

.btn-create-employee {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-create-employee:hover {
  background-color: #2980b9;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Position and Department fields styling to indicate they're auto-filled */
input[readonly] {
  background-color: #f9f9f9;
  border-color: #e0e0e0;
  color: #555;
}
}
</style>