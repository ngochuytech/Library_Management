import React from "react";
import { useParams } from "react-router-dom";
import { Container, Row, Col, Button, Badge, Card } from "react-bootstrap";
import "../styles/BookDetail.css";

const BookDetail = () => {
  const { id } = useParams();

  const books = [
    {
      id: 1,
      title: "Don't Make Me Think",
      author: "Steve Krug",
      year: "2000",
      rating: "5.0/5",
      reviewsCount: "25",
      readCount: "119",
      status: "Available",
      location: "CS A-15",
      image: "/book.jpg",
      description:
        "Kể về cách Don't Make Me Think được xuất bản lần đầu tiên vào năm 2000...",
      publisher: "New Riders Press",
      language: "English",
      pages: 216,
    },
    {
      id: 2,
      title: "The Design of Everyday Things",
      author: "Don Norman",
      year: "1988",
      rating: "4.5/5",
      reviewsCount: "30",
      readCount: "150",
      status: "Out of stock",
      location: "",
      image: "/book.jpg",
      description:
        "Cuốn sách này giải thích về cách thiết kế đồ vật hàng ngày dễ dàng sử dụng...",
      publisher: "Basic Books",
      language: "English",
      pages: 300,
    },
  ];

  const book = books.find((b) => b.id === parseInt(id));

  if (!book) {
    return <div>Book not found!</div>;
  }

  return (
    <Container fluid className="book-detail-container">
      <Row className="my-4">
        <Col md={4}>
          <Card>
            <Card.Img variant="top" src={book.image} className="card-img" />
            <Card.Body>
              <Card.Title>{book.title}</Card.Title>
              <Card.Text>
                {book.author}, {book.year}
              </Card.Text>
              <Badge
                pill
                bg={book.status === "Available" ? "success" : "danger"}
              >
                {book.status}
              </Badge>
            </Card.Body>
          </Card>
        </Col>
        <Col md={8}>
          <h2>{book.title}</h2>
          <p>{book.description}</p>

          <div className="d-flex justify-content-between mb-3">
            <div>
              <h5>Trạng thái</h5>
              <p>{book.status}</p>
            </div>
            <div>
              <h5>Số trang</h5>
              <p>{book.pages} trang</p>
            </div>
          </div>

          <div className="d-flex justify-content-between mb-3">
            <div>
              <h5>Đánh giá</h5>
              <p>{book.rating}</p>
              <p>{book.reviewsCount} Đánh giá</p>
            </div>
            <div>
              <h5>Đã đọc</h5>
              <p>{book.readCount} Đã đọc</p>
            </div>
          </div>

          <div className="d-flex justify-content-between mb-3">
            <div>
              <h5>Nhà xuất bản</h5>
              <p>{book.publisher}</p>
            </div>
            <div>
              <h5>Ngôn ngữ</h5>
              <p>{book.language}</p>
            </div>
          </div>

          <Button variant="primary" className="mr-2">
            Mượn
          </Button>
          <Button variant="success">Đọc thử</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default BookDetail;
