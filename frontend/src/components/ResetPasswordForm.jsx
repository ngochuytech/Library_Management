"use client"

import { useState } from "react"
import { Form, Button, Card } from "react-bootstrap"
import { Eye, EyeOff } from "lucide-react"

const ResetPasswordForm = ({ onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")

  const validatePasswords = () => {
    if (password.length < 6) {
      setPasswordError("Mật khẩu phải có ít nhất 6 ký tự")
      return false
    }

    if (password !== confirmPassword) {
      setPasswordError("Mật khẩu không khớp")
      return false
    }

    setPasswordError("")
    return true
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validatePasswords()) {
      onSubmit(password)
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
          <img src="../logoUnder.png" alt="MYLIB Logo" style={{ width: "80px", height: "auto" }} />
          
          <p className="mb-1" style={{ fontSize: "16px", fontWeight: "500" }}>
            Đặt lại mật khẩu
          </p>
          <p style={{ fontSize: "14px", color: "#888" }}>Tạo mật khẩu mới cho tài khoản của bạn</p>
        </div>

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
            Đặt lại mật khẩu
          </Button>
        </Form>
      </Card.Body>
    </Card>
  )
}

export default ResetPasswordForm

