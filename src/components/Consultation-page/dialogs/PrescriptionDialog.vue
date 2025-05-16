<template>
    <DialogDialog
      :isOpen="show"
      title="Add Prescription"
      @close="$emit('close')"
    >
      <template #default>
        <div class="prescription-dialog">
          <div class="patient-info">
            <label>Patient:</label>
            <div class="patient-name">{{ patientName }}</div>
          </div>
  
          <div class="form-section">
            <div class="form-group">
              <label>Medication Name*</label>
              <input
                type="text"
                v-model="prescription.medication"
                placeholder="Enter medication name"
                required
              />
            </div>
  
            <div class="form-row">
              <div class="form-group">
                <label>Dosage*</label>
                <input
                  type="text"
                  v-model="prescription.dosage"
                  placeholder="e.g. 500mg"
                  required
                />
              </div>
  
              <div class="form-group">
                <label>Frequency*</label>
                <select v-model="prescription.frequency" required>
                  <option value="">Select frequency</option>
                  <option value="OD">Once daily (OD)</option>
                  <option value="BD">Twice daily (BD)</option>
                  <option value="TDS">Three times daily (TDS)</option>
                  <option value="QDS">Four times daily (QDS)</option>
                  <option value="PRN">As needed (PRN)</option>
                  <option value="Nocte">At night (Nocte)</option>
                  <option value="Mane">In the morning (Mane)</option>
                </select>
              </div>
            </div>
  
            <div class="form-row">
              <div class="form-group">
                <label>Route*</label>
                <select v-model="prescription.route" required>
                  <option value="">Select route</option>
                  <option value="Oral">Oral</option>
                  <option value="IV">Intravenous (IV)</option>
                  <option value="IM">Intramuscular (IM)</option>
                  <option value="SC">Subcutaneous (SC)</option>
                  <option value="Topical">Topical</option>
                  <option value="Inhalation">Inhalation</option>
                  <option value="Rectal">Rectal</option>
                  <option value="Sublingual">Sublingual</option>
                </select>
              </div>
  
              <div class="form-group">
                <label>Duration (days)*</label>
                <input
                  type="number"
                  v-model="prescription.duration"
                  min="1"
                  placeholder="e.g. 7"
                  required
                />
              </div>
            </div>
  
            <div class="form-group">
              <label>Special Instructions</label>
              <textarea
                v-model="prescription.instructions"
                placeholder="Enter any special instructions for the patient"
                rows="3"
              ></textarea>
            </div>
          </div>
        </div>
      </template>
  
      <template #footer>
        <div class="dialog-footer">
          <button @click="$emit('close')" class="cancel-button">
            Cancel
          </button>
          <button 
            @click="submitPrescription" 
            class="confirm-button"
            :disabled="!isFormValid"
          >
            Add Prescription
          </button>
        </div>
        <button>close</button>
      </template>
    </DialogDialog>
  </template>
  
  <script>
  export default {
    props: {
      show: {
        type: Boolean,
        required: true
      },
      patientName: {
        type: String,
        required: true
      }
    },
    emits: ['close', 'submit'],
    data() {
      return {
        prescription: {
          medication: '',
          dosage: '',
          frequency: '',
          route: '',
          duration: '',
          instructions: ''
        }
      }
    },
    computed: {
      isFormValid() {
        return (
          this.prescription.medication &&
          this.prescription.dosage &&
          this.prescription.frequency &&
          this.prescription.route &&
          this.prescription.duration
        )
      }
    },
    methods: {
      submitPrescription() {
        if (this.isFormValid) {
          this.$emit('submit', {
            ...this.prescription,
            patientName: this.patientName
          })
          this.resetForm()
        }
      },
      resetForm() {
        this.prescription = {
          medication: '',
          dosage: '',
          frequency: '',
          route: '',
          duration: '',
          instructions: ''
        }
      }
    }
  }
  </script>
  
  <style scoped>
  .prescription-dialog {
    padding: 20px;
  }
  
  .patient-info {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }
  
  .patient-info label {
    font-weight: 600;
    color: #555;
  }
  
  .patient-name {
    padding: 8px 12px;
    background: #f5f5f5;
    border-radius: 4px;
    font-weight: 500;
  }
  
  .form-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .form-row {
    display: flex;
    gap: 15px;
  }
  
  .form-row .form-group {
    flex: 1;
  }
  
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }
  
  .form-group label {
    font-weight: 500;
    color: #444;
  }
  
  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
  
  .form-group textarea {
    resize: vertical;
  }
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding: 15px 20px;
    border-top: 1px solid #eee;
  }
  
  .cancel-button {
    padding: 8px 16px;
    background: #f5f5f5;
    color: #555;
    border: 1px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .cancel-button:hover {
    background: #e0e0e0;
  }
  
  .confirm-button {
    padding: 8px 16px;
    background: #4a90e2;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .confirm-button:hover:not(:disabled) {
    background: #3a7bc8;
  }
  
  .confirm-button:disabled {
    background: #cccccc;
    cursor: not-allowed;
  }
  </style>