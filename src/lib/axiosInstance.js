import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:3000',
});

// You can add interceptors here if needed (e.g. for automatic token injection)
// But for now, we'll keep it simple to match the existing logic.

export default axiosInstance;
