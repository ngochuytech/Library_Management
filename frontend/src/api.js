import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

const BASE_URL = import.meta.env.VITE_API_URL

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      error.response?.data?.code !== 'invalid_refresh_token'
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(`${BASE_URL}/users/refresh-token`, {}, {
          withCredentials: true,
        });

        sessionStorage.setItem('access_token', data.access_token);

        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        if (refreshError.response?.data?.code === 'invalid_refresh_token') {
          sessionStorage.removeItem('access_token');
          toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          window.location.href = `${BASE_URL}/users/login`;
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Password reset functions
export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post('/users/forgot-password/', { email });
    return response.data;
  } catch (error) {
    console.error('Error requesting password reset:', error);
    throw error;
  }
};

export const verifyResetOTP = async (email, otp) => {
  try {
    const response = await api.post('/users/verify-otp/', { email, otp });
    return response.data;
  } catch (error) {
    console.error('Error verifying OTP:', error);
    throw error;
  }
};

export const resetUserPassword = async (email, resetToken, newPassword) => {
  try {
    const response = await api.post('/users/reset-password/', { 
      email, 
      reset_token: resetToken, 
      new_password: newPassword 
    });
    return response.data;
  } catch (error) {
    console.error('Error resetting password:', error);
    throw error;
  }
};

export default api;