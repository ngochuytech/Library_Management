import React from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function AutoLayoutSizingExample() {
  return (
    <Container>
      <h1 className="text-center my-4">Auto Layout Sizing Example</h1>
      <Row>
        <Col className="bg-light border">1 of 3</Col>
        <Col xs={6} className="bg-light border">
          2 of 3 (wider)
        </Col>
        <Col className="bg-light border">3 of 3</Col>
      </Row>
      <Row>
        <Col className="bg-light border">1 of 3</Col>
        <Col xs={5} className="bg-light border">
          2 of 3 (wider)
        </Col>
        <Col className="bg-light border">3 of 3</Col>
      </Row>
    </Container>
  );
}

export default AutoLayoutSizingExample;
