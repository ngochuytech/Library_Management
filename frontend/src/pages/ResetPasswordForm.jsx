import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const ResetPasswordForm = () => {
  const [email, setEmail] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  useEffect(() => {
    // Get stored email and token from previous steps
    const storedEmail = sessionStorage.getItem('resetEmail');
    const storedToken = sessionStorage.getItem('resetToken');
    
    if (!storedEmail || !storedToken) {
      setError('Session expired. Please restart the password reset process.');
      return;
    }
    
    setEmail(storedEmail);
    setResetToken(storedToken);
  }, []);
  
  const validatePasswords = () => {
    if (password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự");
      return false;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp");
      return false;
    }

    setError("");
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !resetToken) {
      setError('Session expired. Please restart the password reset process.');
      return;
    }
    
    if (!validatePasswords()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await api.post('/users/reset-password/', { 
        email, 
        reset_token: resetToken, 
        new_password: password 
      });
      
      if (response.data.status === 'success') {
        sessionStorage.removeItem('resetEmail');
        sessionStorage.removeItem('resetToken');
        
        navigate('/reset-success');
      } else {
        setError(response.data.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
              Đặt lại mật khẩu
            </p>
            <p style={{ fontSize: "14px", color: "#888" }}>Tạo mật khẩu mới cho tài khoản của bạn</p>
          </div>

          {error && (
            <Alert variant="danger" className="mb-3">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label style={{ fontWeight: "500", fontSize: "14px" }}>Mật khẩu mới</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showPassword ? "text" : "password"}
                  placeholder="Nhập mật khẩu mới"
                  style={{
                    padding: "10px 12px",
                    fontSize: "14px",
                    borderColor: "#ddd",
                    paddingRight: "40px",
                  }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <div
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} color="#888" /> : <Eye size={18} color="#888" />}
                </div>
              </div>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
              <Form.Label style={{ fontWeight: "500", fontSize: "14px" }}>Xác nhận mật khẩu mới</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Nhập lại mật khẩu mới"
                  style={{
                    padding: "10px 12px",
                    fontSize: "14px",
                    borderColor: "#ddd",
                    paddingRight: "40px",
                  }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <div
                  style={{
                    position: "absolute",
                    right: "10px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff size={18} color="#888" /> : <Eye size={18} color="#888" />}
                </div>
              </div>
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 mt-3"
              style={{
                backgroundColor: "#0891b2",
                border: "none",
                padding: "10px",
                fontWeight: "500",
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xử lý..." : "Đặt lại mật khẩu"}
            </Button>
          </Form>
          
          <div className="text-center mt-4" style={{ fontSize: "14px" }}>
            <a 
              href="#" 
              className="text-decoration-none" 
              style={{ color: "#0891b2" }} 
              onClick={(e) => {
                e.preventDefault();
                navigate('/forgot-password');
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

export default ResetPasswordForm;