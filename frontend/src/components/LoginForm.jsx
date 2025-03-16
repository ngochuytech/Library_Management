<<<<<<< HEAD
import React from "react";
import { Form, Button, Container, Card } from "react-bootstrap";

const LoginForm = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "25rem", padding: "20px", borderRadius: "10px" }}>
        <Card.Body>
          <div className="text-center mb-4">
            <img src="/icon.jpg" alt="Logo" style={{ width: "80px" }} />
            <h3 className="mt-2">MYLIB</h3>
            <p>Chào mừng trở lại!</p>
          </div>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="username@collegename.ac.in"
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mt-3">
              <Form.Label>Mật khẩu</Form.Label>
              <Form.Control type="password" placeholder="********" />
            </Form.Group>

            <Form.Group className="d-flex justify-content-between align-items-center mt-3">
              <Form.Check type="checkbox" label="Nhớ tôi" />
              <a href="#" className="text-decoration-none">
                Quên mật khẩu?
              </a>
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3">
              Login
            </Button>
          </Form>

          <div className="text-center mt-3">
            <p>
              Người mới?{" "}
              <a href="#" className="text-decoration-none">
                Đăng ký ngay
              </a>
            </p>
            <p>
              <a href="#" className="text-decoration-none">
                Bạn là khách
              </a>
            </p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default LoginForm;
=======
"use client"

import { useState } from "react"
import { Form, Button, Card } from "react-bootstrap"
import { Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const navigate = useNavigate()

  const handleRegisterClick = (e) => {
    e.preventDefault()
    navigate("/register")
  }

  const handleGuestClick = (e) => {
    e.preventDefault()
    navigate("/guest")
  }

  const handleForgotPasswordClick = (e) => {
    e.preventDefault()
    navigate("/forgot-password")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // This is a simple mock authentication
    // In a real app, you would call an API
    console.log("Login attempt with:", { email, password, rememberMe })

    // Mock successful login
    localStorage.setItem("isAuthenticated", "true")
    if (rememberMe) {
      localStorage.setItem("userEmail", email)
    }

    // Navigate to home after login
    navigate("/home")
  }

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
          <img src="../logoUnder.png" alt="MYLIB Logo" style={{ width: "100px", height: "auto" }} />
         
          <p className="mb-1" style={{ fontSize: "16px", fontWeight: "500" }}>
            Chào mừng trở lại!
          </p>
          <p style={{ fontSize: "14px", color: "#888" }}>Đăng nhập để tiếp tục</p>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label style={{ fontWeight: "500", fontSize: "14px" }}>Email</Form.Label>
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
            <Form.Label style={{ fontWeight: "500", fontSize: "14px" }}>Mật khẩu</Form.Label>
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
                {showPassword ? <EyeOff size={18} color="#888" /> : <Eye size={18} color="#888" />}
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

        <div className="d-flex justify-content-between mt-4" style={{ fontSize: "14px" }}>
          <a href="#" className="text-decoration-none" style={{ color: "#0891b2" }} onClick={handleRegisterClick}>
            Người mới? Đăng kí ngay
          </a>
          <a href="#" className="text-decoration-none" style={{ color: "#0891b2" }} onClick={handleGuestClick}>
            Bạn là khách
          </a>
        </div>
      </Card.Body>
    </Card>
  )
}

export default LoginForm

>>>>>>> a6c2f05783ad49986e36e71f46ce5a88972ae7b8
