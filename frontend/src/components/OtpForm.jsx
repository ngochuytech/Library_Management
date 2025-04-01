import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Import your api instance

const OtpForm = () => {
  const [otp, setOtp] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get stored email from previous step
    const storedEmail = sessionStorage.getItem('resetEmail');
    if (!storedEmail) {
      setError('Email not found. Please restart the password reset process.');
      return;
    }
    setEmail(storedEmail);
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email not found. Please restart the password reset process.');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Use your API instance directly
      const response = await api.post('/users/verify-otp/', { email, otp });
      
      if (response.data.status === 'success') {
        // Store the reset token for the next step
        sessionStorage.setItem('resetToken', response.data.reset_token);
        // Navigate to reset password form
        navigate('/reset-password');
      } else {
        setError(response.data.message || 'Invalid OTP');
      }
    } catch (err) {
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleResendOTP = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="otp-form-container">
      <h2>Verify OTP</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      <p className="instruction">
        We've sent a verification code to your email address. Please enter it below.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="otp">OTP Code</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit code"
            maxLength={6}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Verifying...' : 'Verify OTP'}
        </button>
      </form>
      
      <div className="auth-links">
        <button 
          onClick={handleResendOTP}
          className="text-button"
        >
          Didn't receive code? Resend OTP
        </button>
        <a href="/login">Return to Login</a>
      </div>
    </div>
  );
};

export default OtpForm;