<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div class="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl border border-gray-300">
            <div class="border-b pb-4 mb-4">
                <h1 class="text-3xl font-bold text-blue-600">Simple Invoice</h1>
                <p class="text-gray-600">Date: {{ invoice.date }}</p>
                <p class="text-gray-600">Invoice #: {{ invoice.invoiceNumber }}</p>
            </div>

            <!-- Billing Information -->
            <div class="mb-6">
                <h2 class="text-lg font-semibold text-gray-800">Bill To:</h2>
                <p class="text-gray-900 font-medium">{{ invoice.customer.name }}</p>
                <p class="text-gray-600">{{ invoice.customer.address }}</p>
                <p class="text-gray-600">{{ invoice.customer.phone }}</p>
                <p class="text-gray-600">{{ invoice.customer.email }}</p>
            </div>

            <!-- Services & Products -->
            <div class="mb-6">
                <h2 class="text-lg font-semibold text-gray-800">Services & Products</h2>
                <table class="w-full border-collapse border border-gray-300 mt-2">
                    <thead>
                        <tr class="bg-blue-100">
                            <th class="border border-gray-300 p-3 text-left">Item Name</th>
                            <th class="border border-gray-300 p-3 text-center">Category</th>
                            <th class="border border-gray-300 p-3 text-center">Price</th>
                            <th class="border border-gray-300 p-3 text-center">Quantity</th>
                            <th class="border border-gray-300 p-3 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item, index) in invoice.items" :key="index" class="hover:bg-gray-100">
                            <td class="border border-gray-300 p-3">{{ item.name }}</td>
                            <td class="border border-gray-300 p-3 text-center">{{ item.category }}</td>
                            <td class="border border-gray-300 p-3 text-center">${{ item.price.toFixed(2) }}</td>
                            <td class="border border-gray-300 p-3 text-center">{{ item.quantity }}</td>
                            <td class="border border-gray-300 p-3 text-right">${{ (item.price * item.quantity).toFixed(2) }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Total Amount -->
            <div class="flex justify-end items-center border-t pt-4">
                <h2 class="text-lg font-semibold text-gray-900">Total:</h2>
                <span class="ml-4 text-xl font-bold text-green-600">${{ calculateTotal().toFixed(2) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive } from "vue";

// Sample invoice data with multiple billable items
const invoice = reactive({
    date: new Date().toLocaleDateString(),
    invoiceNumber: "INV-" + Math.floor(Math.random() * 10000),
    customer: {
        name: "John Doe",
        address: "123 Main St, City, Country",
        phone: "+1234567890",
        email: "johndoe@example.com"
    },
    items: [
        { name: "Blood Test", category: "Lab", price: 50, quantity: 1 },
        { name: "General Consultation", category: "Consultation", price: 30, quantity: 1 },
        { name: "X-Ray", category: "Radiology", price: 80, quantity: 1 },
        { name: "Painkillers", category: "Medicine", price: 10, quantity: 3 }
    ]
});

// Function to calculate total invoice amount
const calculateTotal = () => {
    return invoice.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
};
</script>
<style scoped>
  /* Overall container styling */
.min-h-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f7fafc; /* Light gray background */
  padding: 24px;
}

/* Invoice card */
.bg-white {
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 32px;
  width: 100%;
  max-width: 700px;
  border: 1px solid #d1d5db;
}

/* Header styling */
.text-blue-600 {
  color: #2563eb; /* Bright blue color */
}

.border-b {
  border-bottom: 2px solid #d1d5db;
}

/* Table styling */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 12px;
}

th,
td {
  border: 1px solid #d1d5db;
  padding: 12px;
  text-align: left;
}

th {
  background-color: #eff6ff; /* Light blue */
  font-weight: bold;
}

td {
  background-color: #ffffff;
}

tr:hover {
  background-color: #f3f4f6; /* Light gray on hover */
}

/* Total section */
.flex {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 12px;
  border-top: 2px solid #d1d5db;
}

.text-green-600 {
  color: #059669; /* Green for total */
  font-size: 1.5rem;
  font-weight: bold;
}

/* Contact section */
.mt-6 {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid #d1d5db;
  font-size: 0.875rem;
  color: #4b5563;
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .bg-white {
    padding: 20px;
  }
  
  .text-xl {
    font-size: 1.25rem;
  }
  
  th, td {
    padding: 8px;
  }
}
  /* Custom styling for mobile responsiveness */
  @media (max-width: 640px) {
    .text-xl {
      font-size: 1.25rem;
    }
    .p-3 {
      padding: 0.75rem;
    }
  }
  </style>
  