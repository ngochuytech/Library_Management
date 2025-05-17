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
  // Form, FormControl, FloatingLabel are removed as they were for the edit modal
} from "react-bootstrap";
import {
  faStar,
  faHeart as fasHeart,
  faBookOpen,
  // faEdit, faTrash are removed
} from "@fortawesome/free-solid-svg-icons";
import {
  faStar as faStarRegular,
  faHeart as farHeart,
} from "@fortawesome/free-regular-svg-icons";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/BookDetail.css";
// import { ACCESS_TOKEN } from "../constants"; // Removed as it was used in handleSubmit

const AdminBookDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const BASE_URL = import.meta.env.VITE_API_URL;

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false); // Favorite toggle remains
  const [showPreview, setShowPreview] = useState(false); // Preview modal remains
  // Removed state related to editing: showEditModal, editedBook, categories, authors
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
        setBook(data);
        // setEditedBook(data); // Removed: no longer editing
      } catch (err) {
        setError("Failed to load book. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // fetchCategories and fetchAuthors are removed as they were for the edit modal
    fetchBook();
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

  // Removed handleEdit, handleDelete, handleInputChange, handleCategoryChange, handleAuthorChange, handleSubmit

  if (loading) return <div>Đang tải thông tin sách...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!book) return <Alert variant="warning">Không tìm thấy sách.</Alert>;

  return (
    <Container className="mt-3 mb-5 book-detail-container">
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

      {/* Edit Book Modal and its Form have been removed */}

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
                    variant="success" // This should dynamically change based on availability
                    className="d-flex align-items-center"
                  >
                    <div className="me-3">
                      <Badge bg="success" className="me-2">
                        {/* Consider making this dynamic e.g. book.available > 0 ? "Còn sách" : "Hết sách" */}
                        Còn sách
                      </Badge>
                      <span className="text-muted small">
                        ({book.available} trong kho)
                      </span>
                    </div>
                    <ProgressBar
                      now={
                        book.quantity > 0
                          ? (book.available / book.quantity) * 100
                          : 0
                      }
                      variant="success"
                      className="flex-grow-1"
                      style={{ height: "8px" }}
                    />
                  </Alert>

                  {/* Edit and Delete buttons container removed */}
                  {/* <div className="d-flex gap-3 mb-4"> */}
                  {/* Buttons were here */}
                  {/* </div> */}
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
