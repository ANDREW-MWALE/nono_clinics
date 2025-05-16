<template>
    <div class="form-container">
        <form @submit.prevent="addMedicines">
            <div class="form-group">
                <label for="Medicine-Name">Medicine Name</label><br>      
                <input type="text" v-model="medicine_name" placeholder="enter medication">
            </div>
            <div class="form-group">
                <label for="SerialNumber">SerialNumber</label>
                <input type="number" v-model="serial_number" placeholder="enter serial number">
            </div>
            <div class="form-group">
                <label for="Medicine-Name">Quantity in stock</label>
                <input type="text" v-model="quantity" placeholder="enter the quantity">
            </div>
            <div class="form-group">
                <label for="Medicine-Name">Supplier</label>
                <input type="text" v-model="supplier" placeholder="enter supplier details">
            </div>
            <div class="form-group">
                <label for="expiry-date">Expiry Date</label>
                <input type="Date" v-model="expiry_date" placeholder="enter supplier details">
            </div>
          <button type="submit" class="submit">Submit</button>
        </form>
        <!-- Display the list of medicines -->
    <div>
      <h2>Medicine List</h2>
      <ul>
        <li v-for="(medicine, index) in medicines" :key="index">
          <strong>{{ medicine.name }}</strong>
          <p>Serial Number: {{ medicine.serialNumber }}</p>
          <p>Quantity: {{ medicine.quantity }}</p>
          <p>Supplier: {{ medicine.supplier }}</p>
          <p>Expiry Date: {{ medicine.expiryDate }}</p>
        </li>
      </ul>
    </div>
    </div>
    
</template>
<script>
export default {
data(){
    return{
        medicines: [],
        medicine_name: "",
        serial_number: "",
        quantity: "",
        supplier: "",
        expiry_date: ""
        
    };
   
},
methods: {
    addMedicines(){
        this.medicines.push({
            name: this.medicine_name,
            serial_number: this.serial_number,
            quantity: this.quantity,
            supplier: this.supplier,
            expiry_date: this.expiry_date

        })
         // Clear input fields after adding the medicine
      this.medicine_name = "";
      this.serial_number = "";
      this.quantity = "";
      this.supplier = "";
      this.expiry_date = "";
    }
}
}
</script>
<style>
.form-container{
    width: 400px;
    margin: 20px auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    background-color: #f9f9f9;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}
.form-container form {
  display: flex;
  flex-direction: column; /* Stack form elements vertically */
}
.form-container label {
  margin-bottom: 5px; /* Add space below labels */
  font-weight: bold;  /* Make the labels bold */
}
.form-container input {
  margin-bottom: 15px; /* Add space below inputs */
  padding: 10px;       /* Add padding inside inputs */
  border: 1px solid #ccc; /* Add a border */
  border-radius: 5px;  /* Round the corners */
}
.form-container button {
  padding: 10px 15px;      /* Add padding to the button */
  background-color: #007BFF; /* Blue background */
  color: #fff;            /* White text */
  border: none;           /* Remove border */
  border-radius: 5px;     /* Round the corners */
  cursor: pointer;        /* Add a pointer on hover */
}
.form-container button:hover {
  background-color: #0056b3; /* Darker blue on hover */
}
</style>