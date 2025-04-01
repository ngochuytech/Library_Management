import React from 'react';
import { Button, Card } from 'react-bootstrap';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SuccessForm = () => {
  const navigate = useNavigate();
  
  const handleLoginClick = () => {
    navigate('/login');
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
            <p style={{ fontSize: "14px", color: "#888" }}>Hoàn tất</p>
          </div>
          
          <div className="text-center my-5">
            <div
              style={{
                width: "80px",
                height: "80px",
                margin: "0 auto",
                backgroundColor: "#4CAF50",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CheckCircle size={40} color="white" />
            </div>
            <p className="mt-4" style={{ fontSize: "16px" }}>
              Mật khẩu của bạn đã được đặt lại thành công
            </p>
            <p style={{ fontSize: "14px", color: "#888" }}>
              Bạn có thể đăng nhập với mật khẩu mới
            </p>
          </div>
          
          <Button
            variant="primary"
            onClick={handleLoginClick}
            className="w-100"
            style={{
              backgroundColor: "#0891b2",
              border: "none",
              padding: "10px",
              fontWeight: "500",
            }}
          >
            Đăng nhập
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SuccessForm;