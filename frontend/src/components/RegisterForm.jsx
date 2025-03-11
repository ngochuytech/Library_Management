import React from "react";
import { Form, Button, Container, Card } from "react-bootstrap";

const RegisterForm = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card
        style={{
          width: "25rem",
          height: "40rem",
          padding: "15px",
          borderRadius: "10px",
        }}
      >
        <Card.Body>
          <div className="text-center mb-4">
            <img src="/icon.jpg" alt="Logo" style={{ width: "80px" }} />
            <h3 className="mt-2">MYLIB</h3>
          </div>
          <Form>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Tên đăng nhập</Form.Label>
              <Form.Control type="text" placeholder="College Reg. No." />
            </Form.Group>

            <Form.Group controlId="formBasicEmail" className="mt-3">
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

            <Form.Group controlId="formBasicConfirmPassword" className="mt-3">
              <Form.Label>Xác nhận mật khẩu</Form.Label>
              <Form.Control type="password" placeholder="********" />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3">
              Đăng kí
            </Button>
          </Form>

          <div className="text-center mt-3">
            <p>
              Đã có tài khoản?{" "}
              <a href="#" className="text-decoration-none">
                Đăng nhập
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

export default RegisterForm;
