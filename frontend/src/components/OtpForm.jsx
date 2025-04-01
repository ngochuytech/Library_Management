import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Card } from 'react-bootstrap';
import api from '../api';

const OtpForm = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get stored email from previous step
    const storedEmail = sessionStorage.getItem('resetEmail');
    if (!storedEmail) {
      setError('Email not found. Please restart the password reset process.');
      return;
    }
    setEmail(storedEmail);
    
    // Focus the first input when component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);
  
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus to next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };
  
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email not found. Please restart the password reset process.');
      return;
    }
    
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits of the OTP');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const response = await api.post('/users/verify-otp/', { 
        email, 
        otp: otpString 
      });
      
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
  
  const handleGoBack = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <Card
        style={{
          width: "400px",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          border: "none",
        }}
      >
        <Card.Body>
          <div className="text-center mb-4">
            <img src="../logoUnder.png" alt="MYLIB Logo" style={{ width: "80px", height: "auto" }} />
            
            <p className="mb-1" style={{ fontSize: "16px", fontWeight: "500" }}>
              Xác minh
            </p>
            <p style={{ fontSize: "14px", color: "#888" }}>Kiểm tra email của bạn</p>
            {email && (
              <p style={{ fontSize: "14px", color: "#888" }}>
                Mã xác nhận đã được gửi đến: <strong>{email}</strong>
              </p>
            )}
          </div>
          
          {error && (
            <div className="alert alert-danger" role="alert" style={{ fontSize: "14px" }}>
              {error}
            </div>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label style={{ fontWeight: "500", fontSize: "14px" }}>Nhập OTP 6 dấu</Form.Label>
              <div className="d-flex justify-content-between gap-2 mt-2">
                {otp.map((digit, index) => (
                  <Form.Control
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    style={{
                      width: "40px",
                      height: "45px",
                      textAlign: "center",
                      fontSize: "18px",
                      padding: "0",
                      borderColor: "#ddd",
                    }}
                  />
                ))}
              </div>
            </Form.Group>
            
            <Button
              variant="primary"
              type="submit"
              className="w-100"
              style={{
                backgroundColor: "#0891b2",
                border: "none",
                padding: "10px",
                fontWeight: "500",
              }}
              disabled={otp.join("").length !== 6 || isSubmitting}
            >
              {isSubmitting ? 'Đang xác nhận...' : 'Xác nhận'}
            </Button>
          </Form>
          
          <div className="d-flex justify-content-between mt-4" style={{ fontSize: "14px" }}>
            <a 
              href="#" 
              className="text-decoration-none" 
              style={{ color: "#0891b2" }} 
              onClick={(e) => {
                e.preventDefault();
                handleResendOTP();
              }}
            >
              Bạn chưa nhận được? Gửi lại
            </a>
            <a 
              href="#" 
              className="text-decoration-none" 
              style={{ color: "#0891b2" }} 
              onClick={(e) => {
                e.preventDefault();
                handleGoBack();
              }}
            >
              Quay lại
            </a>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default OtpForm;