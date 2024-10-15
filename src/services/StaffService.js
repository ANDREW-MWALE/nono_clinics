// src/services/StaffService.js
import axios from 'axios';

const API_URL = 'http://localhost:8085/api/staff';

class StaffService {
  getAllStaff() {
    return axios.get(API_URL);
  }

  createStaff(staff) {
    return axios.post(API_URL, staff);
  }

  updateStaff(id, staff) {
    return axios.put(`${API_URL}/${id}`, staff);
  }

  deleteStaff(id) {
    return axios.delete(`${API_URL}/${id}`);
  }
}

export default new StaffService();
