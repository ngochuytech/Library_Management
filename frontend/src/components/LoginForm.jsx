"use client";



import { useEffect, useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";




const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const BASE_URL = import.meta.env.VITE_API_URL;



  const navigate = useNavigate();

  const handleRegisterClick = (e) => {
    e.preventDefault();
    navigate("/register");
  };



  const handleGuestClick = (e) => {
    e.preventDefault();
    navigate("/guest");
  };



  const handleForgotPasswordClick = (e) => {
    e.preventDefault();
    navigate("/forgot-password");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();



    try {
      const response = await axios.post(
        `${BASE_URL}/users/login`,
        { email, password },
        { withCredentials: true }
      );


      sessionStorage.setItem("access_token", response.data.access_token);
      sessionStorage.setItem("username", response.data.user.name);
      sessionStorage.setItem("idUser", response.data.user.id);
      sessionStorage.setItem("avatar", response.data.user.avatar);

      // Lưu thông tin admin
      const isAdmin = response.data.is_admin;
      sessionStorage.setItem("isAdmin", isAdmin);




      if (rememberMe) {
        sessionStorage.setItem("userEmail", email);
      }
      toast.success("Đăng nhập thành công!");

      // Chuyển hướng dựa vào vai trò
      if (isAdmin) {
        navigate("/admin/home");
      } else {
        navigate("/home");
      }
    } catch (error) {
      toast.error("Đăng nhập thât bại. " + error.response.data.error);
    }
  };



  return (
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
          <img
            src="../logoUnder.png"
            alt="MYLIB Logo"
            style={{ width: "100px", height: "auto" }}
          />

          <p className="mb-1" style={{ fontSize: "16px", fontWeight: "500" }}>
            Chào mừng trở lại!
          </p>
          <p style={{ fontSize: "14px", color: "#888" }}>
            Đăng nhập để tiếp tục
          </p>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label style={{ fontWeight: "500", fontSize: "14px" }}>
              Email
            </Form.Label>
            <Form.Control
              type="email"
              placeholder="username@collegename.ac.in"
              style={{
                padding: "10px 12px",
                fontSize: "14px",
                borderColor: "#ddd",
              }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label style={{ fontWeight: "500", fontSize: "14px" }}>
              Mật khẩu
            </Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showPassword ? "text" : "password"}
                placeholder="********"
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
                {showPassword ? (
                  <EyeOff size={18} color="#888" />
                ) : (
                  <Eye size={18} color="#888" />
                )}
              </div>
            </div>
          </Form.Group>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <Form.Check
              type="checkbox"
              label="Nhớ tôi"
              id="remember-me"
              style={{ fontSize: "14px" }}
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <a
              href="#"
              className="text-decoration-none"
              style={{ fontSize: "14px", color: "#0891b2" }}
              onClick={handleForgotPasswordClick}
            >
              Quên mật khẩu?
            </a>
          </div>

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
          >
            Login
          </Button>
        </Form>

        <div
          className="d-flex justify-content-between mt-4"
          style={{ fontSize: "14px" }}
        >
          <a
            href="#"
            className="text-decoration-none"
            style={{ color: "#0891b2" }}
            onClick={handleRegisterClick}
          >
            Người mới? Đăng kí ngay
          </a>
          <a
            href="#"
            className="text-decoration-none"
            style={{ color: "#0891b2" }}
            onClick={handleGuestClick}
          >
            Bạn là khách
          </a>
        </div>
      </Card.Body>
    </Card>
  );
};

export default LoginForm;
