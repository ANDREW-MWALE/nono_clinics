import { defineStore } from 'pinia'

export const usePharmacyStore = defineStore('pharmacy', {
  state: () => ({
    // Your store state here
    menuItems: [
      { name: 'Inventory', icon: 'ri-medicine-bottle-line', component: 'PharmacyStock' },
      { name: 'Point of Sale', icon: 'ri-shopping-cart-line', component: 'PharmacySales' },
      { name: 'Patients', icon: 'ri-user-heart-line', component: 'PharmacyPatients' },
      { name: 'Reports', icon: 'ri-line-chart-line', component: 'PharmacyReports' },
      { name: 'Settings', icon: 'ri-settings-3-line', component: 'PharmacySettings' }
    ],
    activeView: 'PharmacyStock'
  }),
  actions: {
    setActiveView(view) {
      this.activeView = view
    }
  },
  getters: {
    getMenuItems: (state) => state.menuItems,
    getActiveView: (state) => state.activeView
  }
})