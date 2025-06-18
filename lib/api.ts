import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_ROOT_URL || "http://localhost:5104",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json"
  }
});

export default api;
