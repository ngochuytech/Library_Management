"use client"
import { Button, Card } from "react-bootstrap"
import { CheckCircle } from "lucide-react"

const SuccessForm = ({ onLoginClick, message }) => {
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
          <p style={{ fontSize: "14px", color: "#888" }}>Cảm ơn</p>
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
            {message || "Bạn đã xác minh thành công"}
          </p>
        </div>

        <Button
          variant="primary"
          onClick={onLoginClick}
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
      </Card.Body>
    </Card>
  )
}

export default SuccessForm

