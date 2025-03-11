import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import "../styles/Quote.css";

const Quote = ({ books, handleCardClick }) => (
  <Card
    className="quote-card mb-4 p-3 text-white"
    style={{ border: "none", height: "150px" }}
  >
    <Card.Body className="d-flex justify-content-between">
      {/* Left side for Quote */}
      <Col md={6} className="p-0 bg-primary custom-col">
        <h5>Trích dẫn hôm nay</h5>
        <Card.Text>
          "Sách còn chứa nhiều kho báu hơn tất cả chiến lợi phẩm của cướp biển
          trên Đảo giấu vàng." - Walt Disney
        </Card.Text>
      </Col>

      {/* Right side for New Books (Only Image) */}
      <Col md={4} className="p-0 ">
        <h5>Sách mới ra</h5>
        <Row className="d-flex justify-content-start overflow-auto">
          {books.map((book, index) => (
            <Col
              xs={6}
              sm={4}
              md={3}
              key={index}
              className="d-flex justify-content-center mb-2"
            >
              <Card
                className="shadow-sm border-0 rounded-4 overflow-hidden p-2"
                style={{ width: "120px" }}
                onClick={() => handleCardClick(book)}
              >
                {/* Only display the book image */}
                <Card.Img
                  variant="top"
                  src={book.image}
                  className="rounded-3"
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Col>
    </Card.Body>
  </Card>
);

export default Quote;
