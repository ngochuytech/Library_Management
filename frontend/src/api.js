import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // Lấy baseURL từ biến môi trường
  headers: {
    Authorization: `Bearer ${ACCESS_TOKEN}`, // Nếu API cần token
    "Content-Type": "application/json",
  },
});

export default api;
