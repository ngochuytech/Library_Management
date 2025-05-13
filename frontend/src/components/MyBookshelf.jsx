import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Tab, Nav, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faBookOpen,
  faExclamationCircle,
  faStar as faSolidStar,
  faBook,
  faClock,
  faEye,
  faUndo,
  faHandPointer,
} from "@fortawesome/free-solid-svg-icons";

const PersonalLibrary = ({ userId }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [favorites, setFavorites] = useState([]);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBorrows = async () => {
      try {
        const id = userId || sessionStorage.getItem("idUser"); // Lấy userId từ props hoặc sessionStorage
        if (!id) {
          console.error("User ID not found");
          return;
        }

        console.log("Fetching borrows for user ID:", id);
        const BASE_URL = import.meta.env.VITE_API_URL;
        const response = await axios.get(`${BASE_URL}/borrows/api/user/${id}`, {
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem("token")}`,
          },
        });
        console.log("API Response:", response.data);
        const data = Array.isArray(response.data) ? response.data : []; // Đảm bảo dữ liệu là mảng
        setBooks(data);
      } catch (error) {
        console.error("Error fetching borrows:", error);
        setBooks([]); // Đặt giá trị mặc định là mảng rỗng nếu có lỗi
      }
    };

    fetchBorrows();
  }, [userId]);

  const handleActionClick = (book, action) => {
    console.log(
      `Thao tác "${action}" cho sách: ${book.title} (ID: ${book.id})`
    );
    // TODO: Gọi API hoặc cập nhật state nếu cần
  };

  const filteredBooks = Array.isArray(books) ? books.filter((book) => {
    if (activeTab === "all") return true;
    if (activeTab === "favorites") return book.favorite;
    if (activeTab === "borrowed") return book.status !== "preview";
    return true;
  }) : [];

  const getStatusBadge = (status) => {
    switch (status) {
      case "borrowed":
        return <Badge bg="primary">Đang mượn</Badge>;
      case "waiting":
        return (
          <Badge bg="warning" text="dark">
            Chờ lấy sách
          </Badge>
        );
      case "preview":
        return <Badge bg="info">Đọc thử</Badge>;
      case "overdue":
        return <Badge bg="danger">Quá hạn</Badge>;
      default:
        return <Badge bg="secondary">Không xác định</Badge>;
    }
  };

  const getActionButton = (book) => {
    const { status } = book;
    const actions = {
      borrowed: { label: "Trả sách", variant: "outline-primary", icon: faUndo },
      waiting: {
        label: "Chờ lấy sách",
        variant: "outline-warning",
        icon: faClock,
      },
      preview: { label: "Đọc thử", variant: "outline-info", icon: faEye },
      overdue: {
        label: "Trả ngay",
        variant: "outline-danger",
        icon: faHandPointer,
      },
      default: {
        label: "Chi tiết",
        variant: "outline-secondary",
        icon: faBook,
      },
    };

    const { label, variant, icon } = actions[status] || actions.default;

    return (
      <button
        className={`btn btn-sm ${variant} w-100`}
        style={{
          borderRadius: "8px",
          fontWeight: "500",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          padding: "6px 12px",
        }}
        onClick={() => handleActionClick(book, label)}
      >
        <FontAwesomeIcon icon={icon} className="me-2" />
        {label}
      </button>
    );
  };

  const isOverdue = (dueDate) => new Date(dueDate) < new Date();

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((bookId) => bookId !== id) : [...prev, id]
    );
  };

  return (
    <Container className="py-4">
      <h2 className="mb-4">Thư viện cá nhân</h2>

      <Tab.Container activeKey={activeTab} onSelect={(k) => setActiveTab(k)}>
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="all">Tất cả sách</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="favorites">
              <FontAwesomeIcon icon={faHeart} className="me-1" /> Yêu thích
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="borrowed">
              <FontAwesomeIcon icon={faBookOpen} className="me-1" /> Sách mượn
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Tab.Container>

      <Row xs={1} md={2} lg={3} xl={4} className="g-4">
        {filteredBooks.map((book) => (
          <Col key={book.id}>
            <Card className="h-100 shadow-sm position-relative">
              {isOverdue(book.dueDate) && (
                <div className="position-absolute top-0 end-0 m-2">
                  <FontAwesomeIcon
                    icon={faExclamationCircle}
                    className="text-danger fs-4"
                  />
                </div>
              )}

              <div className="ratio ratio-4x3">
                <Card.Img
                  variant="top"
                  src={book.image}
                  alt={book.title}
                  style={{ objectFit: "cover" }}
                />
              </div>

              <Card.Body>
                <div className="position-absolute top-0 start-0 m-2">
                  <button
                    className="btn btn-sm p-0 border-0"
                    onClick={() => toggleFavorite(book.id)}
                  >
                    <FontAwesomeIcon
                      icon={faHeart}
                      className={`fs-4 ${
                        book.favorite ? "text-danger" : "text-secondary"
                      }`}
                    />
                  </button>
                </div>

                <Card.Title className="mb-1">{book.title}</Card.Title>
                <Card.Text className="text-muted small mb-2">
                  {book.author} • {book.year}
                </Card.Text>

                <div className="mb-2">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={faSolidStar}
                      className={`fs-6 ${
                        i < Math.floor(book.rating)
                          ? "text-warning"
                          : "text-muted"
                      }`}
                    />
                  ))}
                  <span className="ms-1 small text-muted">
                    {book.rating.toFixed(1)}/5
                  </span>
                </div>

                <div className="d-flex justify-content-between small mb-2">
                  <span>
                    Mượn: {new Date(book.borrowedDate).toLocaleDateString()}
                  </span>
                  <span>
                    Hạn: {new Date(book.dueDate).toLocaleDateString()}
                  </span>
                </div>

                {getActionButton(book)}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default PersonalLibrary;
