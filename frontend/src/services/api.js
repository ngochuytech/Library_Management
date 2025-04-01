// frontend/src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8000/users';

const api = {
  // Request password reset (send OTP)
  requestPasswordReset: async (email) => {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      // Lưu email cho các bước tiếp theo
      console.log("Response from forgot password:", response.data);
      localStorage.setItem('resetEmail', email);
      
      // Trong môi trường dev, lưu OTP nếu có
      if (response.data.otp) {
        localStorage.setItem('devOtp', response.data.otp);
      }
      
      return response.data;
    } catch (error) {
      console.error('Password reset error:', error.response?.data);
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Verify OTP
  verifyOTP: async (otp) => {
    try {
      const email = localStorage.getItem('resetEmail');
      const devOtp = localStorage.getItem('devOtp');
      
      console.log("Verifying with:", { email, otp, devOtp });
      
      if (!email) {
        throw { error: 'Email not found. Please restart the password reset process.' };
      }
      
      // Make sure we're sending the user-entered OTP as the primary OTP
      const response = await axios.post(`${API_URL}/verify-otp`, { 
        email, 
        otp,  // This is the user-entered OTP (257984)
        devOtp // This is just for reference (990134)
      });
      
      // If verification is successful, store that information
      if (response.data && response.data.message) {
        localStorage.setItem('otpVerified', 'true');
      }
      
      return response.data;
    } catch (error) {
      console.error('OTP verification error:', error.response?.data);
      throw error.response?.data || { error: 'Network error' };
    }
  },

  // Reset password
  resetPassword: async (password) => {
    try {
      const email = localStorage.getItem('resetEmail');
      const token = localStorage.getItem('resetToken');
      
      console.log("Reset password data:", { email, hasToken: !!token });
      
      if (!email) {
        throw { error: 'Email not found. Please restart the password reset process.' };
      }
      
      const data = { email, password };
      
      // Thêm token nếu có
      if (token) {
        data.token = token;
      }
      
      const response = await axios.post(`${API_URL}/reset-password`, data);
      
      // Xóa dữ liệu đã lưu sau khi đặt lại mật khẩu thành công
      localStorage.removeItem('resetEmail');
      localStorage.removeItem('devOtp');
      localStorage.removeItem('otpVerified');
      localStorage.removeItem('resetToken');
      
      return response.data;
    } catch (error) {
      console.error('Password reset error:', error.response?.data);
      throw error.response?.data || { error: 'Network error' };
    }
  }
};

export default api;