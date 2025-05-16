// src/services/PatieService.js
import axios from "axios";

const API_BASE = "http://localhost:8085/api";
const PATIENTS_URL = `${API_BASE}/patients`;
const VISITS_URL = `${API_BASE}/visits`;

const getAuthConfig = () => ({
  timeout: 5000,
  headers: {
    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
    'Content-Type': 'application/json'
  }
});

class PatieService {
  async getAllPatients() {
    try {
      const response = await axios.get(PATIENTS_URL, getAuthConfig());
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async addPatient(patient) {
    try {
      const response = await axios.post(PATIENTS_URL, patient, getAuthConfig());
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async updatePatient(id, patient) {
    try {
      const response = await axios.put(`${PATIENTS_URL}/${id}`, patient, getAuthConfig());
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async deletePatient(id) {
    try {
      const response = await axios.delete(`${PATIENTS_URL}/${id}`, getAuthConfig());
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  // ✅ FIXED: Updated to use the correct '/today' endpoint
  async getPatientsByDate(date) {
    try {
      const formattedDate = new Date(date).toISOString().split('T')[0];
      const response = await axios.get(
        `${PATIENTS_URL}/today?date=${formattedDate}`,
        getAuthConfig()
      );
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async searchPatients(query) {
    try {
      const response = await axios.get(
        `${PATIENTS_URL}/search?query=${encodeURIComponent(query)}`,
        getAuthConfig()
      );
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async getPatientVisits(patientId) {
    try {
      const response = await axios.get(
        `${PATIENTS_URL}/${patientId}/visits`,
        getAuthConfig()
      );
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async addVisit(visitData) {
    try {
      const response = await axios.post(VISITS_URL, visitData, getAuthConfig());
      return { success: true, data: response.data };
    } catch (error) {
      return this.handleError(error);
    }
  }

  handleError(error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: error.response?.data?.message || error.message,
      status: error.response?.status
    };
  }
}

export default new PatieService();
