<template>
    <nav class="navbar">
      <router-link to="/medicine-form">Pharmacy</router-link>
      <separate>|</separate>
      <router-link to="/investigation">Investigation</router-link>
      <separate>|</separate>
      <router-link to="/service">Service</router-link>
      <separate>|</separate>
      <router-link to="/surgery">Surgery</router-link>
    </nav>
  </template>
  
  <style scoped>
  .navbar {
    width: 90%;
    display: flex;
    gap: 15px;
    background: #007bff;
    padding: 10px;
    margin: auto;
  }
  
  .navbar a {
    color: white;
    text-decoration: none;
    font-size: 16px;
    padding: 8px 12px;
    /* background: #0056b3; */
    /* border-radius: 5px; */
  }
  
  /* .navbar a:hover {
    background: #003d80;
  } */
  </style>
  