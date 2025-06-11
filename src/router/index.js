import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // Auth Routes (no layout)
  { 
    path: '/', 
    redirect: '/login' 
  },
  { 
    path: '/register', 
    component: () => import('@/components/RegisterComponent.vue'),
    meta: { noLayout: true } 
  },

  { 
    path: '/login', 
    component: () => import('@/components/LoginComponent.vue'),
    meta: { noLayout: true } 
  },

  // Main Layout Wrapper
  {
    path: '',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      // Dashboard
      { 
        path: '/dashboard', 
        component: () => import('@/views/DashboadComponent.vue'),
        meta: { title: 'Dashboard' } 
      },

      //Laboratory
{
  path: '/laboratory',
  name: 'Laboratory',
  component: () => import('@/views/LaboratoryPage.vue'),
},

      // Employee Management
      { 
        path: '/employee', 
        component: () => import('@/components/HumanResource/EmployeesPage.vue'),
        meta: { title: 'Employees' } 
      },
      {
        path: '/add-employee',
      component: () => import( '@/components/HumanResource/AddEmployeeModal.vue'),
      meta: {title: 'Add Employee Model'}
      },
      {
        path: '/hr-dashboard',
      component: () => import( '@/components/HumanResource/HrDashboard'),
      meta: {title: 'hr Dashboard'}
      },
      { 
        path: '/staff', 
        component: () => import('@/views/StaffComponent.vue'),
        meta: { title: 'Staff' } 
      },

      // Patient Management
      { 
        path: '/patients', 
        component: () => import('@/views/PatientsComponent.vue'),
        meta: { title: 'Patients' } 
      },
      { 
        path: '/patientlist', 
        component: () => import('@/views/PatientListComponent.vue'),
        meta: { title: 'Patient List' } 
      },
      { 
        path: '/vitals', 
        component: () => import('@/views/VitalListComponent.vue'),
        meta: { title: 'Vitals' } 
      },

      // Services
      { 
        path: '/services', 
        component: () => import('@/views/ServiceComponent.vue'),
        meta: { title: 'Services' } 
      },
      { 
        path: '/service-form', 
        component: () => import('@/views/ServiceForm.vue'),
        meta: { title: 'Service Form' } 
      },

      // Clinical
      { 
        path: '/consultation', 
        component: () => import('@/views/ConsultationPage.vue'),
        meta: { title: 'Consultation' } 
      },
      { 
        path: '/prescription', 
        component: () => import('@/views/PrescriptionComponent.vue'),
        meta: { title: 'Prescriptions' } 
      },
      { 
        path: '/form-view-dialog', 
        component: () => import('@/views/FormViewDialog.vue'),
        meta: { title: 'Form View' } 
      },

      // Diagnostics
      { 
        path: '/laboratory-form', 
        component: () => import('@/views/LaboratoryTestsForm.vue'),
        meta: { title: 'Laboratory' } 
      },
      { 
        path: '/radiology-form', 
        component: () => import('@/views/RadiologyTestForm.vue'),
        meta: { title: 'Radiology' } 
      },

      // Administration
      { 
        path: '/locations', 
        component: () => import('@/views/LocationsComponent.vue'),
        meta: { title: 'Locations' } 
      },
      { 
        path: '/hospital-department', 
        component: () => import('@/views/HospitalDepartments.vue'),
        meta: { title: 'Departments' } 
      },
      { 
        path: '/payment-category', 
        component: () => import('@/views/PaymentCategory.vue'),
        meta: { title: 'Payment Categories' } 
      },
      { 
        path: '/consultation-type', 
        component: () => import('@/views/ConsultationType.vue'),
        meta: { title: 'Consultation Types' } 
      },

      // Billing
      { 
        path: '/billing-invoice', 
        component: () => import('@/views/BillingInvoice.vue'),
        meta: { title: 'Billing' } 
      },
      { 
        path: '/orders-items', 
        component: () => import('@/views/OrdersItems.vue'),
        meta: { title: 'Orders' } 
      },

      // Pharmacy Module
      {
        path: '/pharmacy',
        component: () => import('@/components/pharmacy/PharmacyLayout.vue'),
        meta: { title: 'Pharmacy' },
        children: [
          {
            path: '/',
            redirect: 'stock'
          },
          {
            path: '/stock',
            component: () => import('@/components/pharmacy/PharmacyStock.vue'),
            meta: { title: 'Pharmacy Stock' },
            children: [
              {
                path: '/modal',
                component: () => import('@/components/pharmacy/PharmacyStockModal.vue'),
                meta: { isModal: true }
              }
            ]
          },
          {
            path: '/sales-model',
            component: () => import('@/components/pharmacy/SalesModel.vue'),
            meta: { title: 'Sales Model' }
          },
          {
            path: '/sales',
            component: () => import('@/components/pharmacy/PharmacySales.vue'),
            meta: { title: 'Pharmacy Sales' }
          },
          {
            path: '/patients',
            component: () => import('@/components/pharmacy/PharmacyPatients.vue'),
            meta: { title: 'Pharmacy Patients' }
          },
          {
            path: '/reports',
            component: () => import('@/components/pharmacy/PharmacyReports.vue'),
            meta: { title: 'Pharmacy Reports' }
          },
          
        ]
      },

      // Miscellaneous
      { 
        path: '/dialogdialog', 
        component: () => import('@/components/DialogDialog.vue'),
        meta: { title: 'Dialog' } 
      },
      { 
        path: '/medicine-form', 
        component: () => import('@/views/MedicinesForm.vue'),
        meta: { title: 'Medicine Form' } 
      },
      { 
        path: '/order-medication', 
        component: () => import('@/components/OrderMedication.vue'),
        meta: { title: 'Order Medication' } 
      }
    ]
  },

  // 404 Catch-all
  { 
    path: '/:pathMatch(.*)*', 
    component: () => import('@/views/NotFound.vue'),
    meta: { noLayout: true, title: 'Page Not Found' } 
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

router.beforeEach((to, from, next) => {
  // Set document class based on layout requirement
  document.body.classList.toggle('no-layout', to.meta.noLayout || false)
  
  // Set document title
  document.title = to.meta.title 
    ? `${to.meta.title} | nono_clinics` 
    : 'nono_clinics'
  
  // Add authentication check here if needed
  next()
})

export default router