<template>
    <div class="our-services">
      <div class="card">
        <img src="https://via.placeholder.com/400x200" alt="Service Image" width="100%" height="200px">
        <p>Explore our healthcare services:</p>
        <div class="service-links">
          <a href="/payment-category" class="service-link">Add Payment Category</a>
          <a href="/service-form" class="service-link">Add Service</a>
          <a href="/hospital-department" class="service-link">Hospital Department</a>
          <a href="/consultation-type" class="service-link">Consultation Type</a>
          <a href="/billing-invoice" class="service-link">Billing Invoice</a>
          <a href="/employee" class="service-link">Employee</a>
          <a href="/orders-items" class="service-link">orders navigation</a>
          <a href="laboratory-form" class="service-link">laboratory form</a>
          <a href="radiology-form" class="service-link">Radiology form</a>
          <a href="service8.html" class="service-link">Specialist Consultations</a>
          <a href="service9.html" class="service-link">Lab Tests</a>
          <a href="service9.html" class="service-link">Lab Tests</a>
          <a href="service10.html" class="service-link">Mental Health Support</a>
          
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "OurServices"
  };
  </script>
  
  <style scoped>
.our-services {
  padding: 40px 20px;
  background: linear-gradient(to right, #f3f4f6, #e5e7eb);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card {
  background-color: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  max-width: 700px;
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
}

.card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.card p {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  margin: 20px 0 10px;
}

.service-links {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 15px;
  padding: 0 20px;
}

.service-link {
  display: block;
  background-color: #007bff;
  color: white;
  padding: 12px 16px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.service-link:hover {
  background-color: #0056b3;
  transform: translateY(-3px);
}
</style>
