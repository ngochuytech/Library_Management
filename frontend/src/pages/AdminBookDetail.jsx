import React, { useState } from "react";
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
import "../styles/BookDetail.css";

const AdminBookDetail = () => {
  // Dữ liệu tĩnh cho sách
  const book = {
    id: 1,
    title: "Don't Make Me Think",
    author: {
      id: 1,
      name: "Steve Krug",
      avatar: "author.jpg",
      jobs: "Usability Consultant",
      biography: "Tác giả nổi tiếng về thiết kế trải nghiệm người dùng",
    },
    publication_date: "2000",
    rating: 4.5,
    category: [
      { id: 1, name: "Design" },
      { id: 2, name: "UX" },
      { id: 3, name: "Web Development" },
    ],
    quantity: 10,
    avaliable: 8,
    image: "/book.jpg",
    description:
      "Một cuốn sách kinh điển về thiết kế web và trải nghiệm người dùng.",
    preview: `Chương 1: Đừng khiến tôi phải suy nghĩ\n\nKiểm tra khả năng sử dụng thực chất là kiểm tra thực tế...`,
  };

  const [isFavorite, setIsFavorite] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

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
    // Xử lý chỉnh sửa sách
    console.log("Edit book:", book.id);
    alert(`Chức năng chỉnh sửa sách ID: ${book.id}`);
  };

  const handleDelete = () => {
    // Xử lý xóa sách
    if (window.confirm(`Bạn có chắc muốn xóa sách "${book.title}"?`)) {
      console.log("Delete book:", book.id);
      alert(`Đã xóa sách ID: ${book.id}`);
    }
  };

  return (
    <Container className="mt-3 mb-5 book-detail-container">
      {/* Modal Preview */}
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

      <Row>
        {/* Main Book Info */}
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              <Row>
                {/* Book Cover */}
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

                {/* Book Details */}
                <Col md={8}>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h1 className="h3 mb-2">{book.title}</h1>
                      <h2 className="h5 text-muted mb-3">
                        by {book.author.name} ({book.publication_date})
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
                    {book.category.map((obj, index) => (
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
                        ({book.avaliable} trong kho)
                      </span>
                    </div>
                    <ProgressBar
                      now={(book.avaliable / book.quantity) * 100}
                      variant="success"
                      className="flex-grow-1"
                      style={{ height: "8px" }}
                    />
                  </Alert>

                  <div className="d-flex gap-3 mb-4">
                    <Button
                      variant="primary"
                      size="sm"
                      className="me-2"
                      onClick={handleEdit}
                    >
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

          {/* Book Description Tabs */}
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

        {/* Sidebar - Author Info Only */}
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header as="h5">Thông tin tác giả</Card.Header>
            <Card.Body>
              <div className="d-flex mb-3">
                <Image
                  src={book.author.avatar || "icon.png"}
                  roundedCircle
                  width={80}
                  height={80}
                  className="me-3"
                />
                <div>
                  <h5 className="mb-1">{book.author.name}</h5>
                  <p className="text-muted small">{book.author.jobs}</p>
                </div>
              </div>
              <p>{book.author.biography}</p>
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
