import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
} from "react-bootstrap";
import { faBook, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const RecommendedBooks = () => {
  const [books, setBooks] = useState([
    {
      id: 1,
      image: "/book.jpg",
      title: "Sách 1",
      author: "Tác giả A",
      user: "Người dùng 1",
    },
    {
      id: 2,
      image: "/book.jpg",
      title: "Sách 2",
      author: "Tác giả B",
      user: "Người dùng 2",
    },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const [authors, setAuthors] = useState([
    { id: 1, name: "Tác giả A" },
    { id: 2, name: "Tác giả B" },
    { id: 3, name: "Tác giả C" },
  ]);

  // Xóa sách
  const handleDeleteBook = (id) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4">
        <FontAwesomeIcon icon={faBook} className="me-2" />
        Sách Đề Xuất
      </h2>
      <Form className="mb-4">
        <Form.Control
          type="text"
          placeholder="Tìm kiếm theo tên sách, tác giả hoặc người dùng"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Form>

      {/* Danh sách sách đề xuất */}
      <Row>
        {filteredBooks.map((book) => (
          <Col key={book.id} md={3} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Image
                src={book.image}
                alt={book.title}
                fluid
                className="card-img-top"
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{book.title}</Card.Title>
                <Card.Text className="text-muted">{book.author}</Card.Text>
                <Card.Text
                  className="text-secondary"
                  style={{ fontSize: "0.9rem" }}
                >
                  Đề xuất bởi: <strong>{book.user}</strong>
                </Card.Text>
              </Card.Body>
              <Card.Footer className="bg-white">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeleteBook(book.id)}
                >
                  <FontAwesomeIcon icon={faTrash} className="me-1" />
                  Xóa
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default RecommendedBooks;
