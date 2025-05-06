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
} from "react-bootstrap";
import {
  faStar,
  faHeart as fasHeart,
  faBookOpen,
  faShoppingCart,
  faCalendarAlt,
  faClock,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  faStar as faStarRegular,
  faHeart as farHeart,
} from "@fortawesome/free-regular-svg-icons";
import "../styles/BookDetail.css";
import { useParams } from "react-router-dom";

const BorrowDetail = () => {
  const { borrowId } = useParams();
  console.log("Borrow ID from URL:", borrowId);

  const [isFavorite, setIsFavorite] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL;

  // Dữ liệu giả
  const book = {
    id: 1,
    title: "Don't Make Me Think",
    author: { id: 1, name: "Steve Krug" },
    publication_date: 2000,
    rating: 5.0,
    avaliable: 5,
    quantity: 10,
    language: "English",
    category: [{ name: "Design" }, { name: "UX" }, { name: "Web Development" }],
    image: "/book.jpg",
    description:
      "Steve Krug is a usability consultant with over 30 years of experience working with companies like Apple, Netscape, AOL, Lexus, and others. He is the author of the famous book 'Don't Make Me Think', which is considered a classic in the field of user experience design. This book helps you understand how users really use websites and applications, while providing simple but effective design principles.",
    preview: `Chapter 1: Don't Make Me Think

  A usability test is essentially a reality check. When you watch users try to use something you've designed (whether it's a website, a mobile app, or a toaster), you quickly realize that what you thought was perfectly clear often isn't clear at all.`,
  };

  const user = {
    id: 1,
    name: "John Doe",
    avatar: "/avatar.jpg",
    phoneNumber: "1234567890",
    email: "john.doe@example.com",
  };

  // Thêm thông tin về mượn sách
  const borrowInfo = {
    borrowDate: "2023-10-15", // Ngày mượn
    dueDate: "2023-11-15", // Hạn trả
    returnDate: "2023-11-10", // Ngày trả (null nếu chưa trả)
    status: "Đã trả", // Trạng thái: "Đang mượn" hoặc "Đã trả"
    lateFee: 0, // Phí trễ hạn (nếu có)
  };

  useEffect(() => {
    setLoadingUser(false); // Kết thúc loading vì đã có data giả
  }, []);

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

  // Hàm định dạng ngày
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  // Kiểm tra có trễ hạn không
  const isLate = borrowInfo.returnDate
    ? new Date(borrowInfo.returnDate) > new Date(borrowInfo.dueDate)
    : new Date() > new Date(borrowInfo.dueDate);

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
                        by {book.author?.name} ({book.publication_date})
                      </h2>
                    </div>
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

                  {/* Thêm thông tin mượn sách */}
                  <Card className="mb-3">
                    <Card.Body>
                      <h5 className="mb-3">Thông tin mượn sách</h5>
                      <div className="d-flex flex-column gap-2">
                        <div className="d-flex align-items-center">
                          <FontAwesomeIcon
                            icon={faCalendarAlt}
                            className="me-2 text-primary"
                          />
                          <span className="me-2">
                            <strong>Ngày mượn:</strong>
                          </span>
                          <span>{formatDate(borrowInfo.borrowDate)}</span>
                        </div>

                        <div className="d-flex align-items-center">
                          <FontAwesomeIcon
                            icon={faClock}
                            className={`me-2 ${
                              isLate ? "text-danger" : "text-warning"
                            }`}
                          />
                          <span className="me-2">
                            <strong>Hạn trả:</strong>
                          </span>
                          <span className={isLate ? "text-danger" : ""}>
                            {formatDate(borrowInfo.dueDate)}
                            {isLate && !borrowInfo.returnDate && (
                              <Badge bg="danger" className="ms-2">
                                Trễ hạn
                              </Badge>
                            )}
                          </span>
                        </div>

                        <div className="d-flex align-items-center">
                          <FontAwesomeIcon
                            icon={faCheckCircle}
                            className="me-2 text-success"
                          />
                          <span className="me-2">
                            <strong>Ngày trả:</strong>
                          </span>
                          <span>
                            {borrowInfo.returnDate ? (
                              <>
                                {formatDate(borrowInfo.returnDate)}
                                {new Date(borrowInfo.returnDate) >
                                  new Date(borrowInfo.dueDate) && (
                                  <Badge bg="danger" className="ms-2">
                                    Trễ hạn
                                  </Badge>
                                )}
                              </>
                            ) : (
                              <span className="text-muted">Chưa trả</span>
                            )}
                          </span>
                        </div>

                        <div className="mt-2">
                          <Badge
                            bg={
                              borrowInfo.status === "Đã trả"
                                ? "success"
                                : "primary"
                            }
                          >
                            {borrowInfo.status}
                          </Badge>
                          {borrowInfo.lateFee > 0 && (
                            <Badge bg="danger" className="ms-2">
                              Phí trễ: {borrowInfo.lateFee.toLocaleString()} VND
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card.Body>
                  </Card>

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

                  {/* <div className="d-flex gap-3 mb-4">
                    <Button variant="primary" size="lg" className="flex-grow-1">
                      <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                      {borrowInfo.status === "Đang mượn"
                        ? "Gia hạn mượn"
                        : "Mượn lại"}
                    </Button>
                  </div> */}
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

        {/* Sidebar */}
        <Col lg={4}>
          {/* User Info */}
          <Card className="mb-4">
            <Card.Header as="h5">Thông tin người mượn</Card.Header>
            <Card.Body>
              <div className="d-flex mb-3">
                <Image
                  src={user.avatar}
                  roundedCircle
                  width={80}
                  height={80}
                  className="me-3"
                />
                {loadingUser ? (
                  <p>Đang tải...</p>
                ) : errorUser ? (
                  <p>{errorUser}</p>
                ) : (
                  <div>
                    <h5 className="mb-1">{user.name}</h5>
                    <p className="text-muted small">{user.email}</p>
                  </div>
                )}
              </div>
              <div className="mb-3">
                <p>
                  <strong>Số điện thoại:</strong> {user.phoneNumber}
                </p>
              </div>
              <Button variant="outline-primary" size="sm">
                Liên hệ
              </Button>
              <Button variant="outline-primary" size="sm">
                Xem thông tin
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BorrowDetail;
