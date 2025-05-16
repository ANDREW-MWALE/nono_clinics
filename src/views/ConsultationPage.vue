<template>
  <div class="dashboard d-flex">
    <clickable-patient-list @patient-selected="updateSelectedPatient" />
    
    <main class="main-content flex-fill p-4">
      <consultation-header :patient-name="selectedPatientName" />
      <hr>
      
      <services-actions 
        @open-lab="openLabDialog"
        @open-services="openServicesDialog"
        @open-prescription="openDialog"
      />
      <hr>
      
      <order-dialogs
        :show-lab-dialog="showLabDialog"
        :show-services-dialog="showServicesDialog"
        :show-prescription-dialog="showPrescriptionDialog"
        :is-dialog-open="isDialogOpen"
        :consultation="consultation"
        :selected-tests="selectedTests"
        :selected-services="selectedServices"
        @close-lab="closeLabDialog"
        @close-services="closeServicesDialog"
        @close-prescrition="closePrescriptionDialog"
        @close="closeDialog"
        @submit-tests="submitSelectedTests"
        @submit-services="submitSelectedServices"
        @confirm="handleConfirm"
      />
      
      <orders-summary 
        :all-orders="allOrders"
        :selected-orders="selectedOrders"
        @submit-selected="submitSelectedOrders"
        @edit-order="editOrder"
        @delete-order="deleteOrder"
      />
      <hr>
      
      <consultation-form
        :consultation="consultation"
        :is-loading="isLoading"
        :error-message="errorMessage"
        :success-message="successMessage"
        @submit="submitConsultation"
      />
    </main>
  </div>
</template>

<script>
import { ElNotification } from 'element-plus'
import axios from 'axios'
import ClickablePatientList from './ClickablePatientList.vue'
import ConsultationHeader from '../components/Consultation-page/ConsultationHeader.vue'
import ServicesActions from '../components/Consultation-page/ServicesActions.vue'
import OrderDialogs from '@/components/Consultation-page/dialogs/OrderDialogs.vue'
import OrdersSummary from '../components/Consultation-page/OrdersSummary.vue'
import ConsultationForm from '../components/Consultation-page/ConsultationForm.vue'
import LabOrderDialog from '@/components/Consultation-page/dialogs/LabOrderDialog.vue'
import PrescriptionDialog from '@/components/Consultation-page/dialogs/PrescriptionDialog.vue'

export default {
  components: {
    ClickablePatientList,
    ConsultationHeader,
    ServicesActions,
    OrderDialogs,
    LabOrderDialog,
    PrescriptionDialog,
    OrdersSummary,
    ConsultationForm
  },
  data() {
    return {
      isDialogOpen: false,
      showServicesDialog: false,
      showLabDialog: false,
      showPrescriptionDialog: false,
      selectedPatientName: '',
      selectedService: null,
      selectedOrders: [],
      selectedServices: [],
      selectedTest: null,
      selectedTests: [],
      allServices: [],
      filteredServices: [],
      allTests: [],
      filteredTests: [],
      allOrders: [],
      searchQuery: '',
      items: ['Paracetamol', 'Amoxicillin', 'Ibuprofen', 'Aspirin', 'Cetirizine'],
      selectedItem: null,
      apiData: [],
      isLoading: false,
      errorMessage: '',
      successMessage: '',
      error: '',
      consultation: {
        patientId: '',
        patientName: '',
        chiefComplaints: '',
        historyOfIllness: '',
        familyHistory: '',
        socialHistory: '',
        managementPlan: '',
      },
      prescription: {
        frequency: '',
        quantity: '',
        selectedColor: '#0000FF',
      },
    }
  },
  methods: {
    openDialog() {
      this.isDialogOpen = true
    },
    closeDialog() {
      this.isDialogOpen = false
    },
    openPrescriptionDialog(){
    this.showPrescriptionDialog = true
    this.items
    },
    closePrescriptionDialog(){
    this.showPrescriptionDialog = false
    this.fetchItems()
    },
    openLabDialog() {
      this.showLabDialog = true
      this.fetchLaboratoryTests()
    },
    closeLabDialog() {
      this.showLabDialog = false
      this.searchQuery = ''
      this.selectedTests = []
    },
    openServicesDialog() {
      this.showServicesDialog = true
      this.fetchServices()
    },
    closeServicesDialog() {
      this.showServicesDialog = false
      this.searchQuery = ''
      this.selectedServices = []
    },
    async submitSelectedOrders() {
      if (!this.selectedOrders.length) return
      
      this.isLoading = true
      
      try {
        const groupedOrders = this.allOrders
          .filter(order => this.selectedOrders.includes(order.id))
          .reduce((groups, order) => {
            const type = order.type.toLowerCase()
            groups[type] = groups[type] || []
            groups[type].push(order)
            return groups
          }, {})

        await Promise.all([
          groupedOrders.service ? this.submitServices(groupedOrders.service) : Promise.resolve(),
          groupedOrders.lab ? this.submitLabs(groupedOrders.lab) : Promise.resolve(),
          groupedOrders.radiology ? this.submitRadiology(groupedOrders.radiology) : Promise.resolve(),
          groupedOrders.prescription ? this.submitPrescriptions(groupedOrders.prescription) : Promise.resolve()
        ])

        ElNotification({
          title: 'Success',
          message: 'All orders submitted successfully!',
          type: 'success',
        })
        
        this.selectedOrders = []
        
      } catch (error) {
        ElNotification({
          title: 'Error',
          message: 'Failed to submit orders: ' + (error.response?.data?.message || error.message),
          type: 'error',
        })
      } finally {
        this.isLoading = false
      }
    },
    async submitLabs(labs) {
      if (!labs.length) return
      
      try {
        const orderData = {
          patientId: this.consultation.patientId,
          patientName: this.consultation.patientName,
          tests: labs.map(test => ({
            testId: test.id,
            testName: test.testName,
            testCharge: test.testCharge,
            department: test.Department
          })),
          orderDate: new Date().toISOString(),
        }

        const response = await axios.post(
          'http://localhost:8085/api/laboratoryTest/addorder', 
          orderData
        )
        
        return response.data
      } catch (error) {
        throw error
      }
    },
    async submitConsultation() {
      if (!this.consultation.patientId) {
        this.errorMessage = 'Please select a patient first'
        return
      }

      this.isLoading = true
      this.errorMessage = ''
      this.successMessage = ''

      try {
        const payload = {
          patientModel: {
            patientId: this.consultation.patientId,
          },
          chiefComplaints: this.consultation.chiefComplaints,
          historyOfIllness: this.consultation.historyOfIllness,
          familyHistory: this.consultation.familyHistory,
          socialHistory: this.consultation.socialHistory,
          managementPlan: this.consultation.managementPlan,
        }

        await axios.post(
          'http://localhost:8085/api/consultation/add',
          payload,
          { headers: { 'Content-Type': 'application/json' } }
        )

        this.successMessage = 'Consultation submitted successfully!'
        this.resetConsultationForm()
      } catch (error) {
        this.errorMessage = error.response?.data?.message || error.message || 'Error submitting consultation'
      } finally {
        this.isLoading = false
      }
    },
    resetConsultationForm() {
      this.consultation.chiefComplaints = ''
      this.consultation.historyOfIllness = ''
      this.consultation.familyHistory = ''
      this.consultation.socialHistory = ''
      this.consultation.managementPlan = ''
    },
    async fetchLaboratoryTests() {
      this.isLoading = true
      this.error = ''
      try {
        const response = await axios.get('http://localhost:8085/api/laboratoryTest/get')
        this.allTests = response.data
        this.filteredTests = [...this.allTests]
      } catch (err) {
        this.error = err.message || 'Failed to load tests'
      } finally {
        this.isLoading = false
      }
    },
    async fetchServices() {
      this.isLoading = true
      this.error = null
      try {
        const response = await axios.get('http://localhost:8085/api/services/get')
        this.allServices = response.data
        this.filteredServices = [...this.allServices]
      } catch (err) {
        this.error = err.response?.data?.message || err.message || 'Failed to load services'
      } finally {
        this.isLoading = false
      }
    },
    handleSearch() {
      const query = this.searchQuery.toLowerCase().trim()
      this.filteredTests = this.allTests.filter(test =>
        (test.testName && test.testName.toLowerCase().includes(query)))
      this.filteredServices = this.allServices.filter(service =>
        (service.serviceName && service.serviceName.toLowerCase().includes(query)))
    },
    selectTest(test) {
      const index = this.selectedTests.findIndex(t => t.id === test.id)
      if (index === -1) {
        this.selectedTests.push(test)
      } else {
        this.selectedTests.splice(index, 1)
      }
    },
    async submitSelectedTests() {
      if (!this.selectedTests.length) return
      
      this.isLoading = true
      this.errorMessage = ''
      
      try {
        await this.submitLabs(this.selectedTests)
        
        this.selectedTests.forEach(test => {
          this.allOrders.push({
            id: test.id,
            type: 'lab',
            name: test.testName,
            details: test.Department,
            charge: test.testCharge
          })
        })
        
        ElNotification({
          title: 'Success',
          message: 'Lab tests ordered successfully!',
          type: 'success'
        })
        
        this.selectedTests = []
        this.closeLabDialog()
        
      } catch (error) {
        this.errorMessage = error.response?.data?.message || 'Failed to submit lab tests'
        ElNotification({
          title: 'Error',
          message: this.errorMessage,
          type: 'error'
        })
      } finally {
        this.isLoading = false
      }
    },
    updateSelectedPatient(patient) {
      this.consultation.patientId = patient.id
      this.consultation.patientName = `${patient.firstName} ${patient.lastName}`
      this.selectedPatientName = this.consultation.patientName
    },
    handleConfirm() {
      console.log('Prescription confirmed')
      this.closeDialog()
    },
    editOrder(order) {
      // Implementation would go here
    },
    deleteOrder(order) {
      // Implementation would go here
    }
  },
  mounted() {
    this.filteredTests = []
  }
}
</script>

<style>
/* Global styles would remain here */
.form-control {
  display: block;
  visibility: visible;
  opacity: 1;
  width: 100%;
}

/* Other styles... */
</style>