import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Add Sanctum token (For Laravel Only) to every API request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ GET
export const getData = async (endpoint) => {
  const res = await api.get(endpoint);
  return res.data;
};

// ✅ POST
export const postData = async (endpoint, data) => {
  const res = await api.post(endpoint, data);
  return res.data;
};

// ✅ PUT
export const updateData = async (endpoint, data) => {
  const res = await api.put(endpoint, data);
  return res.data;
};

// ✅ DELETE
export const deleteData = async (endpoint) => {
  const res = await api.delete(endpoint);
  return res.data;
};
