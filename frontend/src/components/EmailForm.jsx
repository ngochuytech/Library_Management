"use client"

import { useState } from "react"
import { Form, Button, Card } from "react-bootstrap"
import { useNavigate } from "react-router-dom"

const EmailForm = ({ onSubmit }) => {
  const [email, setEmail] = useState("")
  const navigate = useNavigate()

  const handleLoginClick = (e) => {
    e.preventDefault()
    navigate("/login")
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(email)
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
            Quên mật khẩu
          </p>
          <p style={{ fontSize: "14px", color: "#888" }}>Nhập email để nhận mã xác nhận</p>
        </div>

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4" controlId="formBasicEmail">
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
            Gửi mã xác nhận
          </Button>
        </Form>

        <div className="text-center mt-4" style={{ fontSize: "14px" }}>
          <a href="#" className="text-decoration-none" style={{ color: "#0891b2" }} onClick={handleLoginClick}>
            Quay lại đăng nhập
          </a>
        </div>
      </Card.Body>
    </Card>
  )
}

export default EmailForm

