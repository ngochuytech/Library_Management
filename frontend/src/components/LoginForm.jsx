import React from "react";
import { Form, Button, Container, Card } from "react-bootstrap";

const LoginForm = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "25rem", padding: "20px", borderRadius: "10px" }}>
        <Card.Body>
          <div className="text-center mb-4">
            <img src="/logo.png" alt="Logo" style={{ width: "80px" }} />
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
