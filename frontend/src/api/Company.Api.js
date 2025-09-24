import axios from "axios";

const API_URL = "http://localhost:3000/company-api"; // backend URL


// Create a new company
export const createCompany = (data) => axios.post(`${API_URL}/create`, data);

// Fetched All Companies
export const fetchCompanies = (params) => axios.get(`${API_URL}/get`, { params });

// Update an existing company by ID
export const updateCompany = (id, data) => axios.put(`${API_URL}/update/${id}`, data);

// delete company by id
export const deleteCompany = (id) => axios.delete(`${API_URL}/delete/${id}`);
