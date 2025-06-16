<template>
  <div class="unauthorized-container">
    <div class="unauthorized-card">
      <div class="icon-container">
        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#dc3545" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
        </svg>
      </div>
      <h1 class="title">Access Denied</h1>
      <p class="message">You don't have permission to access this page.</p>
      <p class="details">Please contact your administrator if you believe this is an error.</p>
      <router-link to="/dashboard" class="return-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
        Return to Dashboard
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UnauthorizedPage'
}
</script>

<style scoped>
.unauthorized-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 20px;
}

.unauthorized-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 40px;
  text-align: center;
  max-width: 500px;
  width: 100%;
}

.icon-container {
  margin-bottom: 20px;
}

.title {
  color: #dc3545;
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 15px;
}

.message {
  color: #343a40;
  font-size: 18px;
  margin-bottom: 10px;
}

.details {
  color: #6c757d;
  font-size: 14px;
  margin-bottom: 25px;
}

.return-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: #42b983;
  color: white;
  padding: 10px 20px;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.return-button:hover {
  background-color: #369f6b;
}

.return-button svg {
  margin-right: 8px;
}

@media (max-width: 576px) {
  .unauthorized-card {
    padding: 30px 20px;
  }
  
  .title {
    font-size: 24px;
  }
  
  .message {
    font-size: 16px;
  }
}
</style>