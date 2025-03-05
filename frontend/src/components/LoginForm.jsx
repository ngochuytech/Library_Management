import React, { Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Button, Form, Card, Container, Row, Col } from "react-bootstrap";

const SocialLoginButton = () => (
  <Fragment>
    <Button
      variant="primary"
      className="ezy__signin6_zgWqViUV-btn w-100 d-flex align-items-center mb-3"
    >
      <span className="text-white fs-4 lh-1">
        <FontAwesomeIcon icon={faFacebook} />
      </span>
      <span className="w-100 text-center text-white">
        Continue with Facebook
      </span>
    </Button>
    <Button
      variant="danger"
      className="ezy__signin6_zgWqViUV-btn w-100 d-flex align-items-center"
    >
      <span className="text-white fs-4 lh-1">
        <FontAwesomeIcon icon={faGoogle} />
      </span>
      <span className="w-100 text-center text-white">Continue with Google</span>
    </Button>
  </Fragment>
);

const SignInForm = () => {
  const [validated, setValidated] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };

  return (
    <Form
      className="pe-md-4"
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
    >
      <Form.Group className="mb-4 mt-2">
        <Form.Label>Email Address</Form.Label>
        <Form.Control type="email" placeholder="Enter Email Address" required />
        <Form.Control.Feedback type="invalid">
          Please provide a valid email.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-2 mt-2">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Enter Password" required />
        <Form.Control.Feedback type="invalid">
          Please provide a password.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          id="signin6-remember-me"
          label="Remember me"
        />
      </Form.Group>

      <Button
        variant="primary"
        type="submit"
        className="ezy__signin6_zgWqViUV-btn-submit w-100"
      >
        Log In
      </Button>
      <Button variant="link" type="button" className="w-100">
        Forget your password?
      </Button>
    </Form>
  );
};

const SignInFormCard = () => (
  <Card className="ezy__signin6_zgWqViUV-form-card">
    <Card.Body className="p-  0">
      <h2 className="ezy__signin6_zgWqViUV-heading mb-3">
        Welcome to Easy Frontend
      </h2>
      <p className="mb-4 mb-md-5">
        <span className="mb-0 opacity-50 lh-1">Don't have an account?</span>
        <Button variant="link" className="py-0 text-dark text-decoration-none">
          Create account
        </Button>
      </p>

      <SignInForm />

      <div className="position-relative ezy__signin6_zgWqViUV-or-separator">
        <hr className="my-4 my-md-5" />
        <span className="px-2">Or</span>
      </div>

      <SocialLoginButton />
    </Card.Body>
  </Card>
);

const SignIn6_zgWqViUV = () => {
  return (
    <section className="ezy__signin6_zgWqViUV d-flex">
      <Container>
        <Row className="justify-content-between h-100">
          <Col lg={6}>
            <div
              className="ezy__signin6_zgWqViUV-bg-holder d-none d-lg-block h-100"
              style={{
                backgroundImage:
                  "url(https://cdn.easyfrontend.com/pictures/sign-in-up/sign1.jpg)",
              }}
            />
          </Col>
          <Col lg={5} className="py-5">
            <Row className="align-items-center h-100">
              <Col xs={12}>
                <SignInFormCard />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default SignIn6_zgWqViUV;
