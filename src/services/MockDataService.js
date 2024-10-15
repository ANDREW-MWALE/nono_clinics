export default class MockDataService {
    constructor() {
      // Mock JSON data stored as an array of objects
      this.mockData = [
        {
          id: 1,
          name: "panado",
          price: 100,
          quantity: 10,
        },
        {
          id: 2,
          name: "Product B",
          price: 200,
          quantity: 5,
        },
        {
          id: 3,
          name: "Product C",
          price: 300,
          quantity: 8,
        },
      ];
    }
  
    // Method to fetch all data
    getAllData() {
      return this.mockData;
    }
  
    // Method to get a single item by id
    getDataById(id) {
      return this.mockData.find((item) => item.id === id);
    }
  
    // Method to add new data
    addData(newData) {
      const newId = this.mockData.length + 1;
      newData.id = newId;
      this.mockData.push(newData);
    }
  
    // Method to update existing data by id
    updateData(id, updatedData) {
      const index = this.mockData.findIndex((item) => item.id === id);
      if (index !== -1) {
        this.mockData[index] = { ...this.mockData[index], ...updatedData };
      }
    }
  
    // Method to delete data by id
    deleteData(id) {
      this.mockData = this.mockData.filter((item) => item.id !== id);
    }
  }
  