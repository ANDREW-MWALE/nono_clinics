// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import StaffComponent from '../components/StaffComponent.vue';
import PatientsComponent from '../components/PatientsComponent.vue'; // Assuming you have this
import LocationsComponent from '../components/LocationsComponent.vue'; // Assuming you have this
import DashboadComponent from '@/components/DashboadComponent.vue';
import PharmacyComponent from '@/components/PharmacyComponent.vue';

const routes = [
  { path: '/staff', component: StaffComponent },
  { path: '/patients', component: PatientsComponent },
  { path: '/locations', component: LocationsComponent },
  { path: '/dashboard', component: DashboadComponent},
  { path: '/pharmacy', component: PharmacyComponent}
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
