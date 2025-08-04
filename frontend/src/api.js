// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // ✅ local backend
  withCredentials: false, // set true if using cookies
});

export default api;
