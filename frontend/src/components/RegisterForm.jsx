"use client"

import { useState } from "react"
import { Form, Button, Card } from "react-bootstrap"
import { Eye, EyeOff } from "lucide-react"
import { useNavigate } from "react-router-dom"

const RegisterForm = ({ route, method }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const BASE_URL = import.meta.env.VITE_API_URL
  const navigate = useNavigate()

  const handleLoginClick = (e) => {
    e.preventDefault()
    navigate("/login")
  }

  const handleGuestClick = (e) => {
    e.preventDefault()
    navigate("/guest")
  }

  const validatePasswords = () => {
    if (password !== confirmPassword) {
      setPasswordError("Mật khẩu không khớp")
      return false
    }
    setPasswordError("")
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validatePasswords()) {
      return
    }

    // This is a simple mock registration
    // In a real app, you would call an API
    // Gửi yêu cầu đăng ký tới backend
    try {
      const response = await fetch(`${BASE_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password}),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data);
        navigate("/login");
      } else {
        const errorData = await response.json();
        console.log("Error during registration:", errorData);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
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
            Đăng kí
          </p>
          <p style={{ fontSize: "14px", color: "#888" }}>Cho nhân viên và học sinh</p>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label style={{ fontWeight: "500", fontSize: "14px" }}>Tên đăng nhập</Form.Label>
            <Form.Control
              type="text"
              placeholder="College Reg. No."
              style={{
                padding: "10px 12px",
                fontSize: "14px",
                borderColor: "#ddd",
              }}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

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

          <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
            <Form.Label style={{ fontWeight: "500", fontSize: "14px" }}>Xác nhận mật khẩu</Form.Label>
            <div className="position-relative">
              <Form.Control
                type={showConfirmPassword ? "text" : "password"}
                placeholder="********"
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
            {passwordError && (
              <div className="text-danger mt-1" style={{ fontSize: "12px" }}>
                {passwordError}
              </div>
            )}
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
          >
            Đăng kí
          </Button>
        </Form>

        <div className="d-flex justify-content-between mt-4" style={{ fontSize: "14px" }}>
          <a href="#" className="text-decoration-none" style={{ color: "#0891b2" }} onClick={handleLoginClick}>
            Đã có tài khoản? Đăng nhập
          </a>
          <a href="#" className="text-decoration-none" style={{ color: "#0891b2" }} onClick={handleGuestClick}>
            Bạn là khách
          </a>
        </div>
      </Card.Body>
    </Card>
  )
}

export default RegisterForm

