import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faSearch,
  faStar,
  faChevronDown,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import {
  Container,
  Row,
  Col,
  Card,
  Navbar,
  Nav,
  Form,
  FormControl,
  Button,
  Dropdown,
} from "react-bootstrap";

import "../styles/Home.css"; // Đường dẫn đến Home.css

import Sidebar from "../components/SideBar.jsx"; // Đường dẫn đến Sidebar.jsx
import Quote from "../components/Quote.jsx"; // Đường dẫn đến Quote.jsx
import SearchTab from "../components/SearchTab.jsx"; // Đường dẫn đến SearchTab.jsx
import BookDetail from "../components/BookDetail.jsx"; // Đường dẫn đến BookDetail.jsx
import MyBookshelf from "../components/MyBookshelf.jsx"; // Import thêm component này
import Contributions from "../components/Contributions.jsx"; // Import thêm component này
import Account from "../components/Account.jsx"; // Đường dẫn đến Account.jsx
import Liked from "../components/Liked.jsx"; // Đường dẫn đến Liked.jsx
import History from "../components/History.jsx"; // Đường dẫn đến History.jsx

const HomePage = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeView, setActiveView] = useState("home"); // Thêm state này để quản lý view
  const [selectedBook, setSelectedBook] = useState(null);

  const [recommendedBooks, setRecommendedBooks] = useState([]); // State cho sách đề xuất từ API
  const [loadingRecommended, setLoadingRecommended] = useState(true); // State quản lý trạng thái loading
  const [errorRecommended, setErrorRecommended] = useState(null); // State quản lý lỗi
  const BASE_URL = import.meta.env.VITE_API_URL

  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      setLoadingRecommended(true); // Bắt đầu loading
      setErrorRecommended(null); // Reset lỗi
      try {

        const response = await fetch(`${BASE_URL}/books/api`); 
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        setRecommendedBooks(data.results);  
        console.log("recom ", data.results);
              
      } catch (error) {
        console.error("Failed to fetch recommended books:", error);
        setErrorRecommended("Không thể tải sách đề xuất. Vui lòng thử lại sau.");
      } finally {
        setLoadingRecommended(false); 
      }
    };

    fetchRecommendedBooks(); // Gọi hàm fetch khi component mount
  }, []); // Mảng rỗng đảm bảo useEffect chỉ chạy 1 lần sau khi mount

  // Thêm mảng sách đã đọc gần đây
  const recentlyViewedBooks = [
    {
      title: "The Road to React",
      author: "Steve Krug",
      year: "2020",
      image: "/book.jpg",
      rating: 4.5,
    },
    {
      title: "Lean UX : Design Great Products",
      author: "Jeff Gothelf",
      year: "2016",
      image: "/book.jpg",
      rating: 4.5,
    },
    {
      title: "Harry Potter and The Chamber of Secrets",
      author: "J.K. Rowling",
      year: "2002",
      image: "/book.jpg",
      rating: 4.9,
    },
    {
      title: "Sprint : How to solve big problems",
      author: "Jake Knapp",
      year: "2000",
      image: "/book.jpg",
      rating: 4.5,
    },
  ];

  const handleBookClick = (book) => {
    setSelectedBook(book);
    setActiveView("bookDetail");
  };

  // Đổi tên hàm và cập nhật logic để phù hợp với cách tiếp cận mới
  const handleNavigation = (view) => {
    setActiveView(view);
    if (view !== "bookDetail") {
      setSelectedBook(null);
    }
  };

  // Render BookSection giống file 2 dùng Bootstrap components
  const BookSection = ({ title, books, onBookClick }) => (
    <div className="mb-4">
      <Row className="mt-3 d-flex flex-nowrap overflow-auto pb-2">
        {books.map((book, index) => (
          <Col key={index} className="px-2" style={{ minWidth: "200px" }}>
            <Card
              className="shadow-sm border-0 rounded-4 overflow-hidden p-2 card-hover"
              style={{ width: "100%" }}
              onClick={() => onBookClick(book)}
            >
              <Card.Img variant="top" src={book.image.slice(16)} className="rounded-3" />
              <Card.Body className="text-center">
                <Card.Title className="fs-6 fw-bold text-truncate">
                  {book.title}
                </Card.Title>
                <Card.Text className="text-muted small">
                  {book.author.name}
                </Card.Text>
                <Card.Text className="d-flex justify-content-center align-items-center gap-1 text-warning small">
                  <FontAwesomeIcon icon={faStar} className="fs-6" />
                  <span>{book.rating}</span>
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );

  // Render nội dung dựa trên activeView giống file 2
  const renderContent = () => {
    switch (activeView) {
      case "search":
        return <SearchTab handleBookClick={handleBookClick} />;
      case "bookshelf":
        return <MyBookshelf books={recommendedBooks} />;
      case "contributions":
        return <Contributions />;
      case "bookDetail":
        return selectedBook ? <BookDetail book={selectedBook} /> : null;
      case "account":
        return <Account />; // Hiển thị component Account
      case "liked":
        return <Liked />; // Hiển thị component Liked
      case "History":
        return <History />; // Hiển thị component Liked
      case "home":
      default:
        return (
          <>
            <Quote books={recommendedBooks} handleCardClick={handleBookClick} />
            <h2 className="greeting mt-4 mb-3">Xin chào</h2>

            <h3 className="section-heading">Đề nghị cho bạn</h3>
            <BookSection
              title="Đề nghị cho bạn"
              books={recommendedBooks}
              onBookClick={handleBookClick}
            />

            <h3 className="section-heading mt-4">Mới đọc</h3>
            <BookSection
              title="Mới đọc"
              books={recentlyViewedBooks}
              onBookClick={handleBookClick}
            />
          </>
        );
    }
  };

  return (
    <Container
      fluid
      className="p-0 min-vh-100"
      style={{ backgroundColor: "#f8f9fa" }}
    >
      {/* Custom background overlay như file 2 */}
      <div className="position-relative min-vh-100">
        {/* Content Shield - White overlay */}
        <div
          className="position-relative p-3 min-vh-100"
          style={{ backgroundColor: "rgba(255, 255, 255, 0.95)" }}
        >
          {/* Top Nav */}
          <Navbar
            expand="lg"
            className="px-4 mb-3 rounded-4 shadow-sm"
            style={{ backgroundColor: "white" }}
          >
            <Row className="w-100 align-items-center">
              {/* Logo */}
              <Col md={2} className="d-flex align-items-center">
                <img
                  src="/icon.jpg"
                  alt="Logo"
                  style={{ width: "40px", height: "40px", marginRight: "10px" }}
                />
                <Navbar.Brand
                  onClick={() => handleNavigation("home")}
                  className="fw-bold cursor-pointer"
                >
                  MYLIB
                </Navbar.Brand>
              </Col>

              {/* Search and User controls */}
              <Col
                md={10}
                className="d-flex justify-content-between align-items-center"
              >
                {/* Search with dropdown like file 2 */}
                <div className="d-flex search-area">
                  <Dropdown className="me-2">
                    <Dropdown.Toggle variant="light" className="rounded-pill">
                      Tất cả <FontAwesomeIcon icon={faChevronDown} size="xs" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item>Tất cả</Dropdown.Item>
                      <Dropdown.Item>Tựa đề</Dropdown.Item>
                      <Dropdown.Item>Tác giả</Dropdown.Item>
                      <Dropdown.Item>Thể loại</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  <Form
                    className="d-flex position-relative"
                    style={{ width: "400px" }}
                  >
                    <FormControl
                      type="text"
                      placeholder="Tìm kiếm"
                      className="rounded-pill"
                    />
                    <Button
                      className="position-absolute end-0 rounded-pill"
                      style={{
                        backgroundColor: "transparent",
                        border: "none",
                        color: "#333",
                      }}
                    >
                      <FontAwesomeIcon icon={faSearch} />
                    </Button>
                  </Form>
                </div>

                {/* User controls: Language, Notifications, Profile */}
                <Nav className="d-flex align-items-center">
                  {/* Language selector like file 2 */}
                  <Dropdown className="me-3">
                    <Dropdown.Toggle
                      variant="light"
                      className="border-0 rounded-pill"
                    >
                      <FontAwesomeIcon icon={faGlobe} className="me-1" />
                      <span>Lang</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                      <Dropdown.Item>Tiếng Việt</Dropdown.Item>
                      <Dropdown.Item>English</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  {/* Dropdown Thông báo */}
                  <Dropdown
                    show={showNotifications}
                    onToggle={() => setShowNotifications(!showNotifications)}
                    className="me-3"
                  >
                    <Dropdown.Toggle
                      variant="light"
                      className="border-0 rounded-circle"
                    >
                      <FontAwesomeIcon icon={faBell} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end" style={{ width: "300px" }}>
                      <Dropdown.Header className="d-flex justify-content-between align-items-center">
                        <strong>Thông báo</strong>
                        <a href="#" className="text-decoration-none">
                          Xem tất cả
                        </a>
                      </Dropdown.Header>
                      <Dropdown.Item
                        className="p-2"
                        style={{
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        <small>
                          <strong>📘 'Don't Make Me Think'</strong> sẽ đến hạn
                          trả vào ngày <strong>10/03/2025</strong>.
                        </small>
                      </Dropdown.Item>
                      <Dropdown.Item
                        className="p-2"
                        style={{
                          whiteSpace: "normal",
                          wordWrap: "break-word",
                          borderBottom: "1px solid #f0f0f0",
                        }}
                      >
                        <small>
                          <strong>📕 'The Design of Everyday Things'</strong> đã
                          quá hạn 2 ngày. Vui lòng trả sách để tránh phạt.
                        </small>
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>

                  {/* Dropdown User */}
                  <Dropdown
                    show={showUserMenu}
                    onToggle={() => setShowUserMenu(!showUserMenu)}
                  >
                    <Dropdown.Toggle
                      variant="light"
                      className="border-0 d-flex align-items-center rounded-pill"
                      style={{ textDecoration: "none" }}
                    >
                      <div
                        className="bg-primary text-white rounded-circle me-2 d-flex align-items-center justify-content-center"
                        style={{ width: "35px", height: "35px" }}
                      >
                        VT
                      </div>
                      <div className="font-weight-bold">Vu Tran</div>
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end" className="shadow rounded">
                      <Dropdown.Item
                        href="#"
                        className="py-2"
                        onClick={() => handleNavigation("account")}
                      >
                        Trang cá nhân
                      </Dropdown.Item>
                      <Dropdown.Item
                        href="#"
                        className="py-2"
                        onClick={() => handleNavigation("liked")}
                      >
                        Ưa thích
                      </Dropdown.Item>
                      <Dropdown.Item
                        href="#"
                        className="py-2"
                        onClick={() => handleNavigation("History")}
                      >
                        Lịch sử mượn
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item href="#" className="py-2 text-danger">
                        Đăng xuất
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Nav>
              </Col>
            </Row>
          </Navbar>

          <Row className="mx-0">
            {/* Sidebar */}
            <Col md={2} className="p-3">
              <Card className="border-0 shadow-sm rounded-4">
                <Card.Body className="p-0">
                  <Sidebar
                    activeView={activeView}
                    onNavigate={handleNavigation}
                  />
                </Card.Body>
              </Card>
            </Col>

            {/* Main Content Area */}
            <Col md={10} className="p-3">
              <Card className="border-0 shadow-sm rounded-4">
                <Card.Body className="p-4">
                  {/* Content with view transition */}
                  <div className="view-transition">{renderContent()}</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </Container>
  );
};

export default HomePage;
