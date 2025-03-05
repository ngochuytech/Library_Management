import React, { Fragment, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Button, Form, Card, Container, Row, Col } from "react-bootstrap";

const SocialSignUpButton = () => (
  <Fragment>
    <Button
      variant="primary"
      className="ezy__signup6_btn w-100 d-flex align-items-center mb-3"
    >
      <span className="text-white fs-4 lh-1">
        <FontAwesomeIcon icon={faFacebook} />
      </span>
      <span className="w-100 text-center text-white">
        Sign Up with Facebook
      </span>
    </Button>
    <Button
      variant="danger"
      className="ezy__signup6_btn w-100 d-flex align-items-center"
    >
      <span className="text-white fs-4 lh-1">
        <FontAwesomeIcon icon={faGoogle} />
      </span>
      <span className="w-100 text-center text-white">Sign Up with Google</span>
    </Button>
  </Fragment>
);

const SignUpForm = () => {
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
        <Form.Label>Full Name</Form.Label>
        <Form.Control type="text" placeholder="Enter Full Name" required />
        <Form.Control.Feedback type="invalid">
          Please provide your full name.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>Email Address</Form.Label>
        <Form.Control type="email" placeholder="Enter Email Address" required />
        <Form.Control.Feedback type="invalid">
          Please provide a valid email.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Enter Password" required />
        <Form.Control.Feedback type="invalid">
          Please provide a password.
        </Form.Control.Feedback>
      </Form.Group>
      <Form.Group className="mb-4">
        <Form.Label>Confirm Password</Form.Label>
        <Form.Control type="password" placeholder="Confirm Password" required />
        <Form.Control.Feedback type="invalid">
          Please confirm your password.
        </Form.Control.Feedback>
      </Form.Group>

      <Button
        variant="primary"
        type="submit"
        className="ezy__signup6_btn-submit w-100"
      >
        Sign Up
      </Button>
      <Button variant="link" type="button" className="w-100">
        Already have an account? Log In
      </Button>
    </Form>
  );
};

const SignUpFormCard = () => (
  <Card className="ezy__signup6_form-card">
    <Card.Body className="p-0">
      <h2 className="ezy__signup6_heading mb-3">Join Easy Frontend</h2>
      <p className="mb-4 mb-md-5">
        <span className="mb-0 opacity-50 lh-1">Already have an account?</span>
        <Button variant="link" className="py-0 text-dark text-decoration-none">
          Log In
        </Button>
      </p>

      <SignUpForm />

      <div className="position-relative ezy__signup6_or-separator">
        <hr className="my-4 my-md-5" />
        <span className="px-2">Or</span>
      </div>

      <SocialSignUpButton />
    </Card.Body>
  </Card>
);

const SignUp6 = () => {
  return (
    <section className="ezy__signup6 d-flex">
      <Container>
        <Row className="justify-content-between h-100">
          <Col lg={6}>
            <div
              className="ezy__signup6-bg-holder d-none d-lg-block h-100"
              style={{
                backgroundImage:
                  "url(https://cdn.easyfrontend.com/pictures/sign-in-up/sign1.jpg)",
              }}
            />
          </Col>
          <Col lg={5} className="py-5">
            <Row className="align-items-center h-100">
              <Col xs={12}>
                <SignUpFormCard />
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default SignUp6;
