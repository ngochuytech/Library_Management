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
  Spinner,
} from "react-bootstrap";
import {
  faStar,
  faHeart as fasHeart, // Assuming fasHeart might be used elsewhere, kept it.
  faBookOpen,
  faShoppingCart, // Kept, though the button using it is commented out.
  faCalendarAlt,
  faClock,
  faCheckCircle,
  faArrowLeft,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import {
  faStar as faStarRegular,
  faHeart as farHeart, // Assuming farHeart might be used elsewhere, kept it.
} from "@fortawesome/free-regular-svg-icons";
import "../styles/BookDetail.css"; // Make sure this path is correct
import { useParams, useNavigate } from "react-router-dom";
import api from "../api";

const BorrowDetail = () => {
  const navigate = useNavigate();
  const { borrowId } = useParams();
  console.log("Borrow ID from URL:", borrowId);

  const [showPreview, setShowPreview] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrowData, setBorrowData] = useState(null);
  const [bookData, setBookData] = useState(null);
  const [userData, setUserData] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL || ""; // Ensure BASE_URL has a fallback

  // Fetch borrow details and related data
  useEffect(() => {
    const fetchBorrowDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = sessionStorage.getItem("access_token");
        const response = await api.get(`${BASE_URL}/borrows/api/${borrowId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        console.log("Borrow Data:", response.data);

        // Fetch the borrow details
        setBorrowData(response.data);

        // Book data and user data are included in the borrow response
        setBookData(response.data.book);
        setUserData(response.data.user);

        console.log("Book Data:", response.data.book);
        console.log("User Data:", response.data.user);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching borrow details:", err);
        setError(
          err.response?.data?.message ||
            "Có lỗi xảy ra khi tải thông tin mượn sách"
        );
        setLoading(false);
      }
    };

    if (borrowId) {
      fetchBorrowDetails();
    }
  }, [borrowId]);

  const renderRatingStars = (rating) => {
    if (typeof rating !== "number" || rating < 0 || rating > 5) return null;

    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5; // This will use faStarRegular for "half"

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={`full-${i}`}
          icon={faStar}
          className="text-warning"
        />
      );
    }

    if (hasHalfStar && stars.length < 5) {
      // Ensure we don't exceed 5 stars
      stars.push(
        <FontAwesomeIcon
          key="half"
          icon={faStarRegular} // Note: This is typically an empty star. For a visual half-star, faStarHalfAlt is common.
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
    try {
      const options = { year: "numeric", month: "long", day: "numeric" };
      return new Date(dateString).toLocaleDateString("vi-VN", options);
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Ngày không hợp lệ";
    }
  };

  // Kiểm tra có trễ hạn không - chỉ tính nếu có dữ liệu
  // Assuming borrowData has exp_date and return_date fields
  const isLate = borrowData?.exp_date
    ? borrowData.return_date
      ? new Date(borrowData.return_date) > new Date(borrowData.exp_date)
      : new Date() > new Date(borrowData.exp_date) &&
        (borrowData.status === "BORROWED" || borrowData.status === "OVERDUE")
    : false;

  // Map server status to display status
  const getStatusTranslation = (status) => {
    const statusMap = {
      PENDING: "Đang chờ duyệt",
      APPROVED: "Đã duyệt",
      BORROWED: "Đang mượn",
      OVERDUE: "Trễ hạn",
      RETURNED: "Đã trả",
      LOST: "Mất sách",
      CANCELED: "Đã hủy",
    };
    return statusMap[status] || status || "Không rõ";
  };

  // Get status variant for bootstrap
  const getStatusVariant = (status) => {
    const variantMap = {
      PENDING: "warning",
      APPROVED: "info",
      BORROWED: "primary",
      OVERDUE: "danger",
      RETURNED: "success",
      LOST: "danger",
      CANCELED: "secondary",
    };
    return variantMap[status] || "dark"; // Default to "dark" if status is unknown
  };

  return (
    <Container className="mt-3 mb-5 book-detail-container">
      <Button
        variant="outline-primary"
        onClick={() => navigate("/admin/home/manageBorrows")} // Ensure this route is correct
        className="mb-4"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
        Quay lại danh sách
      </Button>

      {loading ? (
        <div className="text-center my-5 py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Đang tải thông tin mượn sách...</p>
        </div>
      ) : error ? (
        <Alert variant="danger">
          <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
          {error}
        </Alert>
      ) : !borrowData || !bookData ? ( // Check for bookData as well
        <Alert variant="warning">
          <FontAwesomeIcon icon={faExclamationCircle} className="me-2" />
          Không tìm thấy thông tin mượn sách hoặc chi tiết sách với ID:{" "}
          {borrowId}
        </Alert>
      ) : (
        <>
          {/* Modal Preview */}
          <Modal
            show={showPreview}
            onHide={() => setShowPreview(false)}
            size="lg"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>Preview: {bookData?.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div style={{ whiteSpace: "pre-line" }}>
                {bookData?.preview || "Nội dung xem trước không có sẵn."}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowPreview(false)}>
                Đóng
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
                        src={
                          bookData?.image
                            ? `${BASE_URL}/${bookData.image.replace(
                                /^\/+/,
                                ""
                              )}`
                            : "default-book-placeholder.png" // Provide a real placeholder path
                        }
                        alt={bookData?.title || "Book cover"}
                        fluid
                        className="shadow-sm rounded book-detail-image"
                      />
                      {bookData?.preview && (
                        <div className="d-flex justify-content-start mt-3">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => setShowPreview(true)}
                          >
                            <FontAwesomeIcon
                              icon={faBookOpen}
                              className="me-2"
                            />
                            Preview
                          </Button>
                        </div>
                      )}
                    </Col>

                    {/* Book Details */}
                    <Col md={8}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h1 className="h3 mb-2">
                            {bookData?.title || "Không có tiêu đề"}
                          </h1>
                          <h2 className="h5 text-muted mb-3">
                            by {bookData?.author?.name || "Không rõ tác giả"} (
                            {bookData?.publication_date
                              ? new Date(
                                  bookData.publication_date
                                ).getFullYear()
                              : "N/A"}
                            )
                          </h2>
                        </div>
                      </div>

                      <div className="mb-3">
                        <span className="me-2">
                          {renderRatingStars(bookData?.rating)}
                        </span>
                        {typeof bookData?.rating === "number" && (
                          <span className="text-muted">
                            {bookData.rating.toFixed(1)}
                          </span>
                        )}
                      </div>

                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {bookData?.category && bookData.category.length > 0 ? (
                          bookData.category.map((obj, index) => (
                            <Badge
                              key={index}
                              bg="light"
                              text="dark"
                              className="fw-normal"
                            >
                              {obj.name}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-muted small">
                            Không có danh mục
                          </span>
                        )}
                      </div>

                      {/* Thông tin mượn sách */}
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
                              {/* Assuming req_date is the field for borrow date */}
                              <span>{formatDate(borrowData.borrow_date)}</span>
                            </div>

                            <div className="d-flex align-items-center">
                              <FontAwesomeIcon
                                icon={faClock}
                                className={`me-2 ${
                                  isLate && borrowData.status !== "RETURNED"
                                    ? "text-danger"
                                    : "text-warning"
                                }`}
                              />
                              <span className="me-2">
                                <strong>Hạn trả:</strong>
                              </span>
                              <span
                                className={
                                  isLate && borrowData.status !== "RETURNED"
                                    ? "text-danger"
                                    : ""
                                }
                              >
                                {formatDate(borrowData.exp_date)}
                                {isLate && borrowData.status !== "RETURNED" && (
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
                                {borrowData.return_date ? (
                                  <>
                                    {formatDate(borrowData.return_date)}
                                    {new Date(borrowData.return_date) >
                                      new Date(borrowData.exp_date) && (
                                      <Badge bg="danger" className="ms-2">
                                        Trả trễ
                                      </Badge>
                                    )}
                                  </>
                                ) : (
                                  <span className="text-muted">Chưa trả</span>
                                )}
                              </span>
                            </div>

                            <div className="mt-2">
                              <Badge bg={getStatusVariant(borrowData.status)}>
                                {getStatusTranslation(borrowData.status)}
                              </Badge>
                              {borrowData.late_fee > 0 && (
                                <Badge bg="danger" className="ms-2">
                                  Phí trễ:{" "}
                                  {borrowData.late_fee.toLocaleString()} VND
                                </Badge>
                              )}
                            </div>
                          </div>
                        </Card.Body>
                      </Card>

                      {/* Book availability (assuming 'avaliable' and 'quantity' are correct field names from your API for the book) */}
                      {typeof bookData.avaliable === "number" &&
                      typeof bookData.quantity === "number" &&
                      bookData.quantity > 0 ? (
                        <Alert
                          variant={
                            bookData.avaliable > 0 ? "success" : "warning"
                          }
                          className="d-flex align-items-center"
                        >
                          <div className="me-3">
                            <Badge
                              bg={
                                bookData.avaliable > 0 ? "success" : "warning"
                              }
                              className="me-2"
                            >
                              {bookData.avaliable > 0 ? "Còn sách" : "Hết sách"}
                            </Badge>
                            <span className="text-muted small">
                              ({bookData.avaliable} / {bookData.quantity} trong
                              kho)
                            </span>
                          </div>
                          <ProgressBar
                            now={(bookData.avaliable / bookData.quantity) * 100}
                            variant={
                              bookData.avaliable > 0 ? "success" : "warning"
                            }
                            className="flex-grow-1"
                            style={{ height: "8px" }}
                          />
                        </Alert>
                      ) : (
                        <Alert variant="secondary">
                          Thông tin kho sách không có hoặc không hợp lệ.
                        </Alert>
                      )}

                      {/*
                      <div className="d-flex gap-3 mb-4">
                        <Button variant="primary" size="lg" className="flex-grow-1">
                          <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                          {borrowData?.status === "BORROWED" || borrowData?.status === "OVERDUE"
                            ? "Gia hạn mượn"
                            : "Mượn lại"}
                        </Button>
                      </div>
                      */}
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Book Description Tabs */}
              <Tabs
                defaultActiveKey="description"
                id="book-tabs"
                className="mb-4"
              >
                <Tab eventKey="description" title="Description">
                  <Card>
                    <Card.Body>
                      <p className="lead">
                        {bookData?.description || "Mô tả sách không có sẵn."}
                      </p>
                    </Card.Body>
                  </Card>
                </Tab>
                {/* Add other tabs here if needed, e.g., for reviews, author info */}
              </Tabs>
            </Col>

            {/* Sidebar */}
            <Col lg={4}>
              {/* User Info */}
              {userData ? (
                <Card className="mb-4">
                  <Card.Header as="h5">Thông tin người mượn</Card.Header>
                  <Card.Body>
                    <div className="d-flex align-items-center mb-3">
                      <Image
                        src={
                          userData.avatar
                            ? `${userData.avatar}`
                            : "default-avatar-placeholder.png" // Provide a real placeholder path
                        }
                        roundedCircle
                        width={80}
                        height={80}
                        className="me-3 object-fit-cover"
                      />
                      <div>
                        <h5 className="mb-1">
                          {userData.name || "Không rõ tên"}
                        </h5>
                        <p className="text-muted small mb-0">
                          {userData.email || "Không rõ email"}
                        </p>
                      </div>
                    </div>
                    <div className="mb-3">
                      <p className="mb-1">
                        <strong>Số điện thoại:</strong>{" "}
                        {userData.phone_number || "Chưa cập nhật"}
                      </p>
                      {/* Add other user details if available and relevant */}
                    </div>
                    {/* Action buttons - implement their functionality */}{" "}
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                    >
                      Liên hệ {/* e.g., mailto: link */}
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => navigate(`/admin/users/${userData.id}`)}
                    >
                      Xem thông tin {/* e.g., navigate to user profile page */}
                    </Button>
                  </Card.Body>
                </Card>
              ) : (
                <Card className="mb-4">
                  <Card.Header as="h5">Thông tin người mượn</Card.Header>
                  <Card.Body>
                    <Alert variant="secondary">
                      Không tải được thông tin người mượn.
                    </Alert>
                  </Card.Body>
                </Card>
              )}

              {/* You could add other relevant sidebar cards here, e.g., "Related Books" */}
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default BorrowDetail;
