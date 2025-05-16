<template>
    <div class="order-summary-card">
      <h4 class="mb-3">Patient Orders Summary</h4>
  
      <table class="table table-bordered">
        <thead class="table-light">
          <tr>
            <th style="width: 40px;">Select</th>
            <th>Type</th>
            <th>Name</th>
            <th>Details</th>
            <th>Charge</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="allOrders.length" v-for="order in allOrders" :key="order.id">
            <td>
              <input type="checkbox" v-model="selectedOrders" :value="order.id" class="form-check-input">
            </td>
            <td>{{ order.type }}</td>
            <td>{{ order.name }}</td>
            <td>{{ order.details }}</td>
            <td>K{{ order.charge }}</td>
            <td>
              <button class="btn btn-sm btn-outline-primary me-1" @click="$emit('edit-order', order)">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger" @click="$emit('delete-order', order)">
                <i class="fas fa-trash-alt"></i>
              </button>
            </td>
          </tr>
          <tr v-if="!allOrders.length">
            <td colspan="6" class="text-center text-muted">No orders selected yet</td>
          </tr>
        </tbody>
      </table>
  
      <div class="mt-3 text-end" v-if="allOrders.length">
        <button 
          class="btn btn-primary" 
          @click="$emit('submit-selected', selectedOrders)"
          :disabled="!selectedOrders.length"
        >
          Submit Selected Orders
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      allOrders: {
        type: Array,
        default: () => []
      }
    },
    data() {
      return {
        selectedOrders: []
      }
    },
    emits: ['submit-selected', 'edit-order', 'delete-order']
  }
  </script>