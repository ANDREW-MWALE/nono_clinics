import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  // Auth Routes (no layout)
  { 
    path: '/', 
    redirect: () => localStorage.getItem('authToken') ? '/dashboard' : '/login'
  },
  { 
    path: '/login', 
    component: () => import('@/components/LoginComponent.vue'),
    meta: { 
      noLayout: true, 
      requiresAuth: false,
      title: 'Login'
    } 
  },
  { 
    path: '/register', 
    component: () => import('@/components/RegisterComponent.vue'),
    meta: { 
      noLayout: true, 
      requiresAuth: false,
      title: 'Register'
    } 
  },
  {
    path: '/unauthorized',
    component: () => import('@/views/Unauthorized.vue'),
    meta: {
      noLayout: true,
      title: 'Unauthorized',
      requiresAuth: false
    }
  },

  // Main Layout Wrapper (all routes here require auth)
  {
    path: '',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      // Dashboard
      { 
        path: '/dashboard', 
        component: () => import('@/views/DashboadComponent.vue'),
        meta: { title: 'Dashboard' } 
      },

      // Laboratory
      {
        path: '/Laboratory',
        name: 'Laboratory',
        component: () => import('@/components/Laboratory/LaboratoryPage.vue'),
      },

      // Radiology
      {
        path:'/Radiology',
        name: 'Radiology',
        component: () => import('@/components/Radiology/Radiology.vue'),
      },

      // Employee Management
      {
        path: '/hr',
        component: () => import('@/components/HumanResource/HrLayout.vue'),
        children: [
          {
            path: '/hr-dashboard',
            component: () => import('@/components/HumanResource/HrDashboard.vue'),
            meta: { title: 'HR Dashboard' }
          },
          {
            path: '/add-employee',
            component: () => import('@/components/HumanResource/AddEmployeeModal.vue'),
            meta: { title: 'Add Employee' }
          },
          {
            path: '/leave-days',
            component: () => import('@/components/HumanResource/EmployeeLeaveForm.vue'),
            meta: { title: 'Leave Days' }
          },
          {
            path: '/leave-application',
            component: () => import('@/components/HumanResource/LeaveApplication.vue'),
            meta: { title: 'Leave Application' }
          },
          {
            path: '/pay-rol',
            component: () => import('@/components/HumanResource/EmpPayRollPage.vue'),
            meta: { title: 'Payroll' }
          },
          {
            path: '/appraisal',
            component: () => import('@/components/HumanResource/Appraisal.vue'),
            meta: { title: 'Appraisal' }
          },
          {
            path: '/payroll-report',
            component: () => import('@/components/HumanResource/PayrollReport.vue'),
            meta: { title: 'PayrollReport' }
          },
          {
            path: '/liquisition',
            component: () => import('@/components/HumanResource/Liquisition.vue'),
            meta: { title: 'Liquisition' }
          },
           { 
        path: '/departments', 
        component: () => import('@/components/HumanResource/EmployeeDepartment.vue'),
        meta: { title: 'Departments' } 
      },
          {
            path: '/staff',
            component: () => import('@/views/StaffComponent.vue'),
            meta: { title: 'Staff' }
          }
        ]
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
        { 
        path: '/unauthorised', 
        component: () => import('@/components/Unauthorized.vue'),
        meta: { title: 'unauthorised' } 
      },

      // Administration
      { 
        path: '/locations', 
        component: () => import('@/views/LocationsComponent.vue'),
        meta: { title: 'Locations' } 
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
      { 
        path: '/access', 
        component: () => import('@/components/HumanResource/DepartmentPermissions.vue'),
        meta: { title: 'Dept Permission' } 
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
          }
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
    meta: { 
      noLayout: true, 
      title: 'Page Not Found',
      requiresAuth: false
    } 
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { top: 0 }
  }
})

// Public routes that don't require auth
const publicRoutes = ['/login', '/register', '/unauthorized']

router.beforeEach((to, from, next) => {
  // Set document title and layout
  document.title = to.meta?.title ? `${to.meta.title} | nono_clinics` : 'nono_clinics'
  document.body.classList.toggle('no-layout', !!to.meta?.noLayout)

  // Skip auth check for public routes
  if (publicRoutes.includes(to.path)) {
    return next()
  }

  // Check authentication
  const isAuthenticated = !!localStorage.getItem('authToken')
  if (!isAuthenticated) {
    return next({ path: '/login', query: { redirect: to.fullPath } })
  }

  // Redirect if authenticated user tries to access auth pages
  if (['/login', '/register'].includes(to.path)) {
    return next('/dashboard')
  }

  // Check permissions
  const isAdmin = localStorage.getItem('isAdmin') === 'true'
  const userPermissions = JSON.parse(localStorage.getItem('userPermissions') || [])
  
  const hasAccess = isAdmin || 
                   userPermissions.includes('*') ||
                   userPermissions.includes(to.path) ||
                   checkNestedAccess(to.path, userPermissions)

  console.log(`Navigation to ${to.path}`, {
    isAdmin,
    permissions: userPermissions,
    hasAccess
  })

  hasAccess ? next() : next('/unauthorized')
})

function checkNestedAccess(path, permissions) {
  return permissions.some(perm => 
    perm.endsWith('/*') && path.startsWith(perm.slice(0, -2))
  )
}

export default router