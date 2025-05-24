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
    },
    {
      id: 2,
      image: "/book1.jpg",
      title: "Sách 2",
      author: "Tác giả B",
    },
  ]);

  const [authors, setAuthors] = useState([
    { id: 1, name: "Tác giả A" },
    { id: 2, name: "Tác giả B" },
    { id: 3, name: "Tác giả C" },
  ]);

  const [newBook, setNewBook] = useState({
    image: "",
    title: "",
    author: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.user.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddBook = () => {
    if (newBook.image && newBook.title && newBook.author) {
      const book = {
        id: books.length + 1,
        image: newBook.image,
        title: newBook.title,
        author: newBook.author,
      };
      setBooks([...books, book]);
      setNewBook({ image: "", title: "", author: "" });
    }
  };

  const handleDeleteBook = (id) => {
    setBooks(books.filter((book) => book.id !== id));
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4">
        <FontAwesomeIcon icon={faBook} className="me-2" />
        Sách Đề Xuất
      </h2>
      <Button
        variant="success"
        className="mb-3"
        onClick={() => setShowAddForm(!showAddForm)}
      >
        <FontAwesomeIcon icon={faPlus} className="me-1" />
        {showAddForm ? "Ẩn" : "Thêm sách mới"}
      </Button>

      {/* Form thêm sách mới */}
      {showAddForm && (
        <Card className="mb-4 shadow-sm">
          <Card.Body>
            <h5 className="mb-3">Thêm sách đề xuất mới</h5>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Group className="mb-3">
                    <Form.Label>Ảnh sách</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const imageUrl = URL.createObjectURL(file);
                          setNewBook({ ...newBook, image: imageUrl });
                        }
                      }}
                    />
                  </Form.Group>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên sách</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập tên sách"
                    value={newBook.title}
                    onChange={(e) =>
                      setNewBook({ ...newBook, title: e.target.value })
                    }
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Tác giả</Form.Label>
                  <Form.Select
                    value={newBook.author}
                    onChange={(e) =>
                      setNewBook({ ...newBook, author: e.target.value })
                    }
                  >
                    <option value="">Chọn tác giả</option>
                    {authors.map((author) => (
                      <option key={author.id} value={author.name}>
                        {author.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={1} className="d-flex align-items-end">
                <Button variant="primary" onClick={handleAddBook}>
                  <FontAwesomeIcon icon={faPlus} />
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

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
        {books.map((book) => (
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
