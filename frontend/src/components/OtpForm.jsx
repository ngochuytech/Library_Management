"use client"

import { useState, useRef, useEffect } from "react"
import { Form, Button, Card } from "react-bootstrap"

const OtpForm = ({ onSubmit, onResend, onGoBack, email }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const inputRefs = useRef([])

  useEffect(() => {
    // Focus the first input when component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleChange = (index, value) => {
    
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus to next input
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus()
    }
  }

  const handleKeyDown = (index, e) => {
    
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus()
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (otp.join("").length === 6) {
      onSubmit(otp.join(""))
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
            Xác minh
          </p>
          <p style={{ fontSize: "14px", color: "#888" }}>Kiểm tra email của bạn</p>
          {email && (
            <p style={{ fontSize: "14px", color: "#888" }}>
              Mã xác nhận đã được gửi đến: <strong>{email}</strong>
            </p>
          )}
        </div>

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
            disabled={otp.join("").length !== 6}
          >
            Xác nhận
          </Button>
        </Form>

        <div className="d-flex justify-content-between mt-4" style={{ fontSize: "14px" }}>
          <a href="#" className="text-decoration-none" style={{ color: "#0891b2" }} onClick={onResend}>
            Bạn chưa nhận được? Gửi lại
          </a>
          <a href="#" className="text-decoration-none" style={{ color: "#0891b2" }} onClick={onGoBack}>
            Quay lại
          </a>
        </div>
      </Card.Body>
    </Card>
  )
}

export default OtpForm

