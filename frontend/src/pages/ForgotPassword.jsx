import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api'; // Import your api instance

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');
    
    try {
      // Use your API instance directly
      const response = await api.post('/users/forgot-password/', { email });
      
      if (response.data.status === 'success') {
        setMessage(response.data.message);
        // Store email for next steps
        sessionStorage.setItem('resetEmail', email);
        // Navigate to OTP verification
        navigate('/otp-verification');
      } else {
        setError(response.data.message || 'An error occurred');
      }
    } catch (err) {
      setError('Failed to send reset email. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Forgot Password</h2>
      
      {error && <div className="error-message">{error}</div>}
      {message && <div className="success-message">{message}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        
        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Reset OTP'}
        </button>
      </form>
      
      <div className="auth-links">
        <a href="/login">Return to Login</a>
      </div>
    </div>
  );
};

export default ForgotPassword;