import axios from 'axios';

const API_URL = "http://192.168.68.254/api/location";

class LocationService{
    getAllLocations(){
        return axios.get(API_URL)
    }
    createLocation(location){
        return axios.post(API_URL, location);
    }
    updateLocation(id, location){
        return axios.put(`${API_URL}/${id}`,location )
    }
    deleteLocation(id){
        return axios.delete(`${API_URL}/${id}`)
    }
}
export default new LocationService();