<template>
    <div>
      <h2>Product List</h2>
      <ul>
        <li v-for="product in products" :key="product.id">
          {{ product.name }} - ${{ product.price }}
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import MockDataService from "@/services/MockDataService";
  
  export default {
    data() {
      return {
        products: [],
      };
    },
    mounted() {
      const dataService = new MockDataService();
      this.products = dataService.getAllData(); // Load mock data when component is mounted
    },
  };
  </script>
  