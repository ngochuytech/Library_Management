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
  Modal, // Modal is still used for Preview
  ProgressBar,
  Alert,
  Tabs,
  Tab,
  Form, // Thêm lại Form cho modal chỉnh sửa
} from "react-bootstrap";
import {
  faStar,
  faHeart as fasHeart,
  faBookOpen,
  faEdit, // Thêm lại icon chỉnh sửa
  faTrash, // Thêm lại icon xóa
  faExclamationTriangle, // Thêm icon cảnh báo xóa
  faArrowLeft, // Thêm icon quay lại
} from "@fortawesome/free-solid-svg-icons";
import {
  faStar as faStarRegular,
  faHeart as farHeart,
} from "@fortawesome/free-regular-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/BookDetail.css";
import { ACCESS_TOKEN } from "../constants"; // Thêm lại ACCESS_TOKEN
import api from "../api"; // Thêm api để gọi API

const AdminBookDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false); // Favorite toggle remains
  const [showPreview, setShowPreview] = useState(false); // Preview modal remains

  // Thêm state cho modal chỉnh sửa và xóa
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: [],
    quantity: "",
    description: "",
    preview: "",
    image: null,
    publication_date: new Date().toISOString().split("T")[0],
  });

  const [authorBooks, setAuthorBooks] = useState([]);

  // Fetch books by author when the author is selected (remains)
  const fetchBooksByAuthor = async () => {
    if (!book || !book.author || !book.author.id) {
      console.error("Thông tin tác giả không đầy đủ để tải sách.");
      setAuthorBooks([]); // Clear or handle as appropriate
      return;
    }
    try {
      const response = await fetch(
        `${BASE_URL}/books/api/author/${book.author.id}`
      );
      const data = await response.json();
      setAuthorBooks(data);
    } catch (err) {
      console.error("Lỗi khi tải sách của tác giả", err);
      setAuthorBooks([]); // Clear or handle error appropriately
    }
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await fetch(`${BASE_URL}/books/api/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch book");
        }
        const data = await response.json();
        console.log("Book data:", data);
        setBook(data);

        // Khởi tạo formData với dữ liệu của sách hiện tại
        setFormData({
          title: data.title,
          author: data.author?.id || "",
          category: data.category?.map((cat) => cat.id.toString()) || [],
          quantity: data.quantity,
          description: data.description || "",
          preview: data.preview || "",
          image: data.image,
          publication_date:
            data.publication_date || new Date().toISOString().split("T")[0],
        });
      } catch (err) {
        setError("Failed to load book. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Tải danh sách tác giả và thể loại
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        const authorsResponse = await api.get(`${BASE_URL}/authors/api/`);
        setAuthors(authorsResponse.data);

        const categoriesResponse = await api.get(`${BASE_URL}/categories/api/`);
        setCategories(categoriesResponse.data);
      } catch (err) {
        console.error("Error fetching authors or categories:", err);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchBook();
    fetchOptions();
  }, [id, BASE_URL]); // Added BASE_URL to dependencies as it's used in useEffect

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

  const handleViewAuthorBooks = () => {
    fetchBooksByAuthor();
    window.scrollTo(0, 0);
  };

  // Xử lý thay đổi đầu vào form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setFormData({
      ...formData,
      category: selectedOptions,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });
    }
  };

  // Mở modal chỉnh sửa
  const handleEdit = () => {
    setShowEditModal(true);
  };

  // Xác nhận xóa sách
  const confirmDelete = () => {
    setShowDeleteConfirm(true);
  };

  // Xử lý xóa sách
  const handleDelete = async () => {
    try {
      const token = sessionStorage.getItem(ACCESS_TOKEN);
      const requestHeaders = {
        ...(token && { Authorization: `Bearer ${token}` }),
      };
      await api.delete(`${BASE_URL}/books/api/delete/${id}`, {
        headers: requestHeaders,
      });

      setShowDeleteConfirm(false);
      // Chuyển hướng về trang quản lý sách sau khi xóa thành công
      navigate("/admin/home");
    } catch (error) {
      console.error("Error deleting book:", error);
      alert("Đã xảy ra lỗi khi xóa sách");
      setShowDeleteConfirm(false);
    }
  };
  // Lưu thay đổi khi chỉnh sửa
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    // setLoading(true); // Cân nhắc thêm cờ loading cho nút Save
    try {
      const token = sessionStorage.getItem(ACCESS_TOKEN);
      const bookFormData = new FormData();

      bookFormData.append("title", formData.title);
      bookFormData.append("author", formData.author);

      if (formData.category && Array.isArray(formData.category)) {
        formData.category.forEach((catId) => {
          bookFormData.append("category", catId);
        });
      }

      bookFormData.append("quantity", formData.quantity);
      bookFormData.append("description", formData.description);
      bookFormData.append("preview", formData.preview || ""); // Thêm preview

      const publicationDate = formData.publication_date
        ? new Date(formData.publication_date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      bookFormData.append("publication_date", publicationDate);

      if (formData.image instanceof File) {
        bookFormData.append("image", formData.image);
      }

      const requestHeaders = {
        "Content-Type": "multipart/form-data",
        ...(token && { Authorization: `Bearer ${token}` }),
      }; // Đang chỉnh sửa sách hiện tại, không cần tham chiếu đến currentBook
      // vì đã có tham số id từ useParams()
      const response = await api.put(
        `${BASE_URL}/books/api/edit/${id}`,
        bookFormData,
        { headers: requestHeaders }
      ); // Cập nhật state sách với dữ liệu mới nhận được
      setBook(response.data);
      setShowEditModal(false);

      // Tải lại trang để hiển thị thay đổi mới nhất
      window.location.reload();

      // Hiển thị thông báo thành công
      alert("Cập nhật sách thành công!");
    } catch (error) {
      console.error("Error saving book:", error);
      let errorMessage = "Đã xảy ra lỗi khi lưu sách. ";
      if (error.response && error.response.data) {
        const errors = error.response.data;
        if (typeof errors === "object" && errors !== null) {
          for (const key in errors) {
            if (Array.isArray(errors[key])) {
              errorMessage += `${key}: ${errors[key].join(", ")}. `;
            } else if (typeof errors[key] === "string") {
              errorMessage += `${key}: ${errors[key]}. `;
            }
          }
          if (errors.detail) errorMessage += `${errors.detail}. `;
          if (errors.message) errorMessage += `${errors.message}. `;
        } else if (typeof errors === "string") {
          errorMessage += errors;
        }
      } else {
        errorMessage += error.message;
      }
      alert(errorMessage.trim());
    } finally {
      // setLoading(false);
    }
  };

  if (loading) return <div>Đang tải thông tin sách...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!book) return <Alert variant="warning">Không tìm thấy sách.</Alert>;
  return (
    <Container className="mt-3 mb-5 book-detail-container">
      <Button
        variant="outline-primary"
        onClick={() => navigate("/admin/home/manageBorrows")}
        className="mb-4"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
        Quay lại danh sách
      </Button>

      {/* Preview Modal (remains) */}
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

      {/* Modal chỉnh sửa sách */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Chỉnh sửa sách</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingOptions ? (
            <div className="text-center py-4">
              <p>Đang tải dữ liệu tùy chọn...</p>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Row className="mb-3">
                <Col md={4}>
                  <div className="text-center mb-3">
                    {formData.image ? (
                      <Image
                        src={
                          typeof formData.image === "string"
                            ? `/image/${formData.image}` // URL cho ảnh cũ
                            : URL.createObjectURL(formData.image) // URL tạm thời cho ảnh mới
                        }
                        alt="Xem trước ảnh bìa"
                        fluid
                        className="rounded shadow-sm"
                        style={{ maxHeight: "200px", objectFit: "contain" }}
                      />
                    ) : (
                      <div
                        className="border rounded p-5 text-muted bg-light d-flex align-items-center justify-content-center"
                        style={{ height: "200px" }}
                      >
                        Chưa có ảnh
                      </div>
                    )}
                  </div>
                  <Form.Group>
                    <Form.Label>Ảnh bìa sách</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <Form.Text className="text-muted">
                      Nên chọn ảnh có tỷ lệ phù hợp (ví dụ: 3:4).
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
                        <Form.Select
                          name="author"
                          value={formData.author}
                          onChange={handleInputChange}
                          required
                          disabled={loadingOptions}
                        >
                          <option value="">Chọn tác giả</option>
                          {authors.map((author) => (
                            <option key={author.id} value={author.id}>
                              {author.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Thể loại</Form.Label>
                        <Form.Select
                          name="category"
                          multiple
                          onChange={handleCategoryChange}
                          required
                          disabled={loadingOptions}
                          value={formData.category} // formData.category là mảng các string IDs
                          style={{ height: "100px" }}
                        >
                          {categories.map((category) => (
                            <option
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Text className="text-muted">
                          Giữ Ctrl (Cmd trên Mac) để chọn nhiều.
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Số lượng</Form.Label>
                        <Form.Control
                          type="number"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          min="0"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Ngày xuất bản</Form.Label>
                        <Form.Control
                          type="date"
                          name="publication_date"
                          value={formData.publication_date}
                          onChange={handleInputChange}
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
                  <Form.Group className="mb-3">
                    <Form.Label>Preview (Nội dung xem trước)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="preview"
                      value={formData.preview}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loadingOptions}
          >
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
              Bạn có chắc chắn muốn xóa sách "{book?.title}"? Hành động này
              không thể hoàn tác.
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
          <Button variant="danger" onClick={handleDelete}>
            Xóa
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
                    src={"/image/" + book.image}
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
                    variant="success" // This should dynamically change based on availability
                    className="d-flex align-items-center"
                  >
                    <div className="me-3">
                      <Badge bg="success" className="me-2">
                        {/* Consider making this dynamic e.g. book.available > 0 ? "Còn sách" : "Hết sách" */}
                        Còn sách
                      </Badge>
                      <span className="text-muted small">
                        ({book.avaliable} trong kho)
                      </span>
                    </div>
                    <ProgressBar
                      now={
                        book.quantity > 0
                          ? (book.avaliable / book.quantity) * 100
                          : 0
                      }
                      variant="success"
                      className="flex-grow-1"
                      style={{ height: "8px" }}
                    />
                  </Alert>

                  {/* Thêm các nút chỉnh sửa và xóa */}
                  <div className="d-flex gap-3 mb-4">
                    <Button
                      variant="outline-primary"
                      onClick={handleEdit}
                      className="d-flex align-items-center"
                    >
                      <FontAwesomeIcon icon={faEdit} className="me-2" />
                      Chỉnh sửa
                    </Button>
                    <Button
                      variant="outline-danger"
                      onClick={confirmDelete}
                      className="d-flex align-items-center"
                    >
                      <FontAwesomeIcon icon={faTrash} className="me-2" />
                      Xóa sách
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
                  src={book.author?.avatar || "icon.png"} // Default icon if no avatar
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
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleViewAuthorBooks}
              >
                Xem tất cả sách của tác giả
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {authorBooks.length > 0 && (
        <Card className="mt-4">
          <Card.Header>
            <h5>Sách khác của {book.author?.name}</h5>
          </Card.Header>
          <Card.Body>
            <Row>
              {authorBooks.map((b) => (
                <Col key={b.id} md={6} lg={4} className="mb-3">
                  <Card className="h-100 shadow-sm">
                    <Card.Img variant="top" src={b.image} />
                    <Card.Body>
                      <Card.Title>{b.title}</Card.Title>
                      <Card.Text>Đánh giá: {b.rating} / 5</Card.Text>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => navigate(`/admin/books/${b.id}`)}
                      >
                        Xem chi tiết
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
};

export default AdminBookDetail;
