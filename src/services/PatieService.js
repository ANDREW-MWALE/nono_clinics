import axios from "axios"

const API_URL =  "http://localhost:8085/api/patientDetails";
class PatientService{
getAllPatients(){
    return axios.get(API_URL)
}
addPatients(patients){
    return axios.post(API_URL, patients)
}
updatePatients(id, patients){
    return axios.put(`${API_URL}/${id}`, patients)
}
deletePatients(id){
    return axios.delete(`${id}`)
}  
   
}
export default new PatientService;