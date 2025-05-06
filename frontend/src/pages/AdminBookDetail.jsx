import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Container,
  Row,
  Col,
  Button,
  Image,
  Badge,
  Card,
  Modal,
  ProgressBar,
  Alert,
  Tabs,
  Tab,
  Form,
  FormControl,
  FloatingLabel,
} from "react-bootstrap";
import {
  faStar,
  faHeart as fasHeart,
  faBookOpen,
  faEdit,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  faStar as faStarRegular,
  faHeart as farHeart,
} from "@fortawesome/free-regular-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/BookDetail.css";

const AdminBookDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedBook, setEditedBook] = useState({});
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`${BASE_URL}/books/api/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch book");
        }
        const data = await response.json();
        setBook(data);
        setEditedBook(data);
      } catch (err) {
        setError("Failed to load book. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}/categories/api/`);
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    const fetchAuthors = async () => {
      try {
        const response = await fetch(`${BASE_URL}/authors/api/`);
        const data = await response.json();
        setAuthors(data);
      } catch (err) {
        console.error("Failed to fetch authors", err);
      }
    };

    fetchBook();
    fetchCategories();
    fetchAuthors();
  }, [id]);

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesomeIcon key={i} icon={faStar} className="text-warning" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <FontAwesomeIcon
          key="half"
          icon={faStarRegular}
          className="text-warning"
        />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={`empty-${i}`}
          icon={faStarRegular}
          className="text-secondary"
        />
      );
    }

    return stars;
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleDelete = () => {
    if (window.confirm(`Bạn có chắc muốn xóa sách "${book.title}"?`)) {
      alert(`Đã xóa sách ID: ${book.id}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedBook((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => ({
        id: option.value,
        name: option.label,
      })
    );
    setEditedBook((prev) => ({
      ...prev,
      category: selectedOptions,
    }));
  };

  const handleAuthorChange = (e) => {
    const selectedAuthor = authors.find(
      (author) => author.id === e.target.value
    );
    setEditedBook((prev) => ({
      ...prev,
      author: selectedAuthor,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/books/api/${id}/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editedBook),
      });

      if (!response.ok) {
        throw new Error("Failed to update book");
      }

      const updatedBook = await response.json();
      setBook(updatedBook);
      setShowEditModal(false);
      alert("Cập nhật sách thành công!");
    } catch (err) {
      alert("Có lỗi xảy ra khi cập nhật sách: " + err.message);
    }
  };

  if (loading) return <div>Đang tải thông tin sách...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!book) return <Alert variant="warning">Không tìm thấy sách.</Alert>;

  return (
    <Container className="mt-3 mb-5 book-detail-container">
      {/* Preview Modal */}
      <Modal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Preview: {book.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ whiteSpace: "pre-line" }}>{book.preview}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Book Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa sách: {book.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <FloatingLabel
                  controlId="title"
                  label="Tiêu đề"
                  className="mb-3"
                >
                  <FormControl
                    type="text"
                    name="title"
                    value={editedBook.title || ""}
                    onChange={handleInputChange}
                    required
                  />
                </FloatingLabel>
              </Col>
              <Col md={6}>
                <FloatingLabel
                  controlId="author"
                  label="Tác giả"
                  className="mb-3"
                >
                  <Form.Select
                    name="author"
                    value={editedBook.author?.id || ""}
                    onChange={handleAuthorChange}
                    required
                  >
                    <option value="">Chọn tác giả</option>
                    {authors.map((author) => (
                      <option key={author.id} value={author.id}>
                        {author.name}
                      </option>
                    ))}
                  </Form.Select>
                </FloatingLabel>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <FloatingLabel
                  controlId="image"
                  label="URL hình ảnh"
                  className="mb-3"
                >
                  <FormControl
                    type="text"
                    name="image"
                    value={editedBook.image || ""}
                    onChange={handleInputChange}
                    required
                  />
                </FloatingLabel>
              </Col>
              <Col md={6}>
                <FloatingLabel
                  controlId="publication_date"
                  label="Năm xuất bản"
                  className="mb-3"
                >
                  <FormControl
                    type="number"
                    name="publication_date"
                    value={editedBook.publication_date || ""}
                    onChange={handleInputChange}
                    required
                  />
                </FloatingLabel>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <FloatingLabel
                  controlId="rating"
                  label="Đánh giá (0-5)"
                  className="mb-3"
                >
                  <FormControl
                    type="number"
                    name="rating"
                    min="0"
                    max="5"
                    step="0.1"
                    value={editedBook.rating || ""}
                    onChange={handleInputChange}
                    required
                  />
                </FloatingLabel>
              </Col>
              <Col md={6}>
                <FloatingLabel
                  controlId="quantity"
                  label="Số lượng"
                  className="mb-3"
                >
                  <FormControl
                    type="number"
                    name="quantity"
                    min="0"
                    value={editedBook.quantity || ""}
                    onChange={handleInputChange}
                    required
                  />
                </FloatingLabel>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <FloatingLabel
                  controlId="description"
                  label="Mô tả"
                  className="mb-3"
                >
                  <FormControl
                    as="textarea"
                    name="description"
                    style={{ height: "100px" }}
                    value={editedBook.description || ""}
                    onChange={handleInputChange}
                    required
                  />
                </FloatingLabel>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <FloatingLabel
                  controlId="preview"
                  label="Nội dung xem trước"
                  className="mb-3"
                >
                  <FormControl
                    as="textarea"
                    name="preview"
                    style={{ height: "150px" }}
                    value={editedBook.preview || ""}
                    onChange={handleInputChange}
                  />
                </FloatingLabel>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col>
                <Form.Label>Thể loại</Form.Label>
                <Form.Select
                  multiple
                  name="category"
                  value={editedBook.category?.map((c) => c.id) || []}
                  onChange={handleCategoryChange}
                  required
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  Giữ phím Ctrl để chọn nhiều thể loại
                </Form.Text>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Hủy bỏ
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Main Content */}
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={4} className="mb-4 mb-md-0">
                  <Image
                    src={book.image}
                    alt={book.title}
                    fluid
                    className="shadow-sm rounded"
                  />
                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setShowPreview(true)}
                    >
                      <FontAwesomeIcon icon={faBookOpen} className="me-2" />
                      Preview
                    </Button>
                  </div>
                </Col>

                <Col md={8}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h1 className="h3 mb-2">{book.title}</h1>
                      <h2 className="h5 text-muted mb-3">
                        by {book.author?.name} ({book.publication_date})
                      </h2>
                    </div>
                    <Button
                      variant="link"
                      onClick={() => setIsFavorite(!isFavorite)}
                      className="p-0 text-decoration-none"
                    >
                      <FontAwesomeIcon
                        icon={isFavorite ? fasHeart : farHeart}
                        className={
                          isFavorite ? "text-danger" : "text-secondary"
                        }
                        style={{ fontSize: "1.2rem" }}
                      />
                    </Button>
                  </div>

                  <div className="mb-3">
                    <span className="me-2">
                      {renderRatingStars(book.rating)}
                    </span>
                    <span className="text-muted">{book.rating}</span>
                  </div>

                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {book.category?.map((obj, index) => (
                      <Badge
                        key={index}
                        bg="light"
                        text="dark"
                        className="fw-normal"
                      >
                        {obj.name}
                      </Badge>
                    ))}
                  </div>

                  <Alert
                    variant="success"
                    className="d-flex align-items-center"
                  >
                    <div className="me-3">
                      <Badge bg="success" className="me-2">
                        Còn sách
                      </Badge>
                      <span className="text-muted small">
                        ({book.available} trong kho)
                      </span>
                    </div>
                    <ProgressBar
                      now={(book.available / book.quantity) * 100}
                      variant="success"
                      className="flex-grow-1"
                      style={{ height: "8px" }}
                    />
                  </Alert>

                  <div className="d-flex gap-3 mb-4">
                    <Button variant="primary" size="sm" onClick={handleEdit}>
                      <FontAwesomeIcon icon={faEdit} className="me-2" />
                      Chỉnh sửa
                    </Button>
                    <Button variant="danger" size="sm" onClick={handleDelete}>
                      <FontAwesomeIcon icon={faTrash} className="me-2" />
                      Xóa
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Tabs defaultActiveKey="description" id="book-tabs" className="mb-4">
            <Tab eventKey="description" title="Description">
              <Card>
                <Card.Body>
                  <p className="lead">{book.description}</p>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>

        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header as="h5">Thông tin tác giả</Card.Header>
            <Card.Body>
              <div className="d-flex mb-3">
                <Image
                  src={book.author?.avatar || "icon.png"}
                  roundedCircle
                  width={80}
                  height={80}
                  className="me-3"
                />
                <div>
                  <h5 className="mb-1">{book.author?.name}</h5>
                  <p className="text-muted small">{book.author?.jobs}</p>
                </div>
              </div>
              <p>{book.author?.biography}</p>
              <Button variant="outline-primary" size="sm">
                Xem tất cả sách của tác giả
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminBookDetail;
