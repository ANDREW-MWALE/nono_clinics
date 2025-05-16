<template>
  <div class="pharmacy-component">
    <h2 class="text-center">Sales Transactions</h2>
    <table class="table">
  <caption>List of users</caption>
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Medicince Name</th>
      <th scope="col">quantity</th>
      <th scope="col">Price</th>
      <th scope="col">Actions</th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(medicine, index) in medicines" :key="index">
      <th scope="row" >{{ medicine.id }}</th>
      <td>{{ medicine.medicine_name }}</td>
      <td>{{ medicine.quantity }}</td>
      <td>{{ medicine.price }}</td>
      <td class="d-flex gap-2">
  <div @click="editMedicine(index)">
    <i class="fa-solid fa-pen"></i>
  </div>
  <div @click="deleteMedicine(index)">
    <i class="fa-solid fa-trash"></i>
  </div>
</td>
    </tr>
  </tbody>
</table>
    
  </div>
</template>

<script>
export default {
  name: 'PharmacySales',
  data() {
    return {
      medicines: [
        { id: 1, 
          medicine_name: "Anna", 
          quantity: 45, 
          price: 4 },
        { id: 2,
           medicine_name: "Peter", 
           quantity: 60, 
           price: 56 
          },
          { id: 3,
           medicine_name: "Sampa", 
           quantity: 70, 
           price: 60
          } 
      ]
    };
  },
  methods: {
    deleteMedicine(index){
      this.medicines.splice(index);
    },
    editMedicine(index){
      console.log('user edited', index);
      // this.medicines[index] = this.medicine;
    },

    addToCart(medicine) {
      console.log("Add to cart:", medicine);
    }
  }
};
</script>
