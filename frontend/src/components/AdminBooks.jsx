import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Modal,
  Form,
  InputGroup,
  Badge,
  Pagination,
  Alert,
  Image,
} from "react-bootstrap";
import {
  faBook,
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faExclamationTriangle,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

const AdminBooks = () => {
  const navigate = useNavigate();

  // State quản lý danh sách sách
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho modal thêm/sửa sách
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [currentBook, setCurrentBook] = useState(null);

  // State cho form
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "",
    quantity: "",
    available: "",
    description: "",
    image: null,
  });

  // State tìm kiếm và phân trang
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // State xác nhận xóa
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // Fetch dữ liệu sách từ API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch(`${BASE_URL}/books/api`);
        if (!response.ok) {
          throw new Error("Failed to fetch books");
        }
        const data = await response.json();
        setBooks(data.results);
        setTotalPages(data.total_pages);
      } catch (err) {
        setError("Failed to load books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [currentPage]);

  // Xử lý thay đổi form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Xử lý thay đổi ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });
    }
  };

  // Mở modal thêm sách
  const handleAddBook = () => {
    setModalTitle("Thêm sách mới");
    setCurrentBook(null);
    setFormData({
      title: "",
      author: "",
      category: "",
      quantity: "",
      available: "",
      description: "",
      image: null,
    });
    setShowModal(true);
  };

  // Mở modal sửa sách
  const handleEditBook = (book) => {
    setModalTitle("Chỉnh sửa sách");
    setCurrentBook(book);
    setFormData({
      title: book.title,
      author: book.author,
      category: book.category,
      quantity: book.quantity,
      available: book.available,
      description: book.description,
      image: book.image,
    });
    setShowModal(true);
  };

  // Xem chi tiết sách
  const handleViewDetail = (bookId) => {
    navigate(`/admin/books/${bookId}`);
  };

  // Xác nhận xóa sách
  const confirmDeleteBook = (book) => {
    setBookToDelete(book);
    setShowDeleteConfirm(true);
  };

  // Thực hiện xóa sách
  const handleDeleteBook = () => {
    if (bookToDelete) {
      setBooks(books.filter((book) => book.id !== bookToDelete.id));
      setShowDeleteConfirm(false);
    }
  };

  // Lưu sách (thêm hoặc sửa)
  const handleSaveBook = () => {
    if (currentBook) {
      // Cập nhật sách
      setBooks(
        books.map((book) =>
          book.id === currentBook.id ? { ...book, ...formData } : book
        )
      );
    } else {
      // Thêm sách mới
      const newBook = {
        id: books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1,
        ...formData,
      };
      setBooks([...books, newBook]);
    }
    setShowModal(false);
  };

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <p>Loading books...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <Row className="align-items-center">
                <Col md={6}>
                  <h4 className="mb-0">
                    <FontAwesomeIcon
                      icon={faBook}
                      className="text-primary me-2"
                    />
                    Quản lý sách
                  </h4>
                </Col>
                <Col md={6} className="text-end">
                  <Button variant="primary" onClick={handleAddBook}>
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Thêm sách
                  </Button>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              {/* Thanh tìm kiếm */}
              <InputGroup className="mb-4">
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm sách theo tên hoặc tác giả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              {/* Bảng danh sách sách */}
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Ảnh bìa</th>
                    <th>Tên sách</th>
                    <th>Tác giả</th>
                    <th>Thể loại</th>
                    <th>Số lượng</th>
                    <th>Có sẵn</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {books.length > 0 ? (
                    books.map((book) => (
                      <tr key={book.id}>
                        <td>{book.id}</td>
                        <td>
                          <Image
                            src={book.image || "/placeholder-book.jpg"}
                            alt={book.title}
                            width={50}
                            className="rounded shadow-sm"
                          />
                        </td>
                        <td>{book.title}</td>
                        <td>{book.author.name}</td>
                        <td>
                          <Badge bg="info">
                            {book.category.map((cat) => cat.name).join(", ")}
                          </Badge>
                        </td>
                        <td>{book.quantity}</td>
                        <td>{book.available}</td>
                        <td>
                          <Button
                            variant="outline-info"
                            size="sm"
                            className="me-2"
                            onClick={() => handleViewDetail(book.id)}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Button>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEditBook(book)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => confirmDeleteBook(book)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        Không tìm thấy sách phù hợp
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {/* Phân trang */}
              {books.length > 0 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.First
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                    />
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Pagination.Item
                        key={i + 1}
                        active={i + 1 === currentPage}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal thêm/sửa sách */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={4}>
                {/* Hiển thị ảnh xem trước */}
                <div className="text-center mb-3">
                  {formData.image ? (
                    <Image
                      src={
                        typeof formData.image === "string"
                          ? formData.image
                          : URL.createObjectURL(formData.image)
                      }
                      alt="Book cover preview"
                      fluid
                      className="rounded shadow-sm"
                      style={{ maxHeight: "200px" }}
                    />
                  ) : (
                    <div className="border rounded p-5 text-muted bg-light">
                      Chưa có ảnh
                    </div>
                  )}
                </div>

                {/* Trường chọn ảnh */}
                <Form.Group>
                  <Form.Label>Ảnh bìa sách</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  <Form.Text className="text-muted">
                    Chọn ảnh có tỷ lệ 3:4 để hiển thị tốt nhất
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={8}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tên sách</Form.Label>
                      <Form.Control
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tác giả</Form.Label>
                      <Form.Control
                        type="text"
                        name="author"
                        value={formData.author}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Thể loại</Form.Label>
                      <Form.Control
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Số lượng</Form.Label>
                      <Form.Control
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleInputChange}
                        min="1"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group className="mb-3">
                      <Form.Label>Có sẵn</Form.Label>
                      <Form.Control
                        type="number"
                        name="available"
                        value={formData.available}
                        onChange={handleInputChange}
                        min="0"
                        max={formData.quantity}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3">
                  <Form.Label>Mô tả</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveBook}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal xác nhận xóa */}
      <Modal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa sách</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-warning me-3"
              size="2x"
            />
            <p className="mb-0">
              Bạn có chắc chắn muốn xóa sách "{bookToDelete?.title}"? Hành động
              này không thể hoàn tác.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirm(false)}
          >
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteBook}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminBooks;
