import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faSearch,
  faThumbsUp,
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

const HomePage = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [color, setColor] = useState("text-dark"); // Màu mặc định
  const [showSearchTab, setShowSearchTab] = useState(false); // State to track search tab visibility

  const books = [
    {
      title: "The Design of Everyday Things",
      author: "Don Norman",
      year: "1988",
      image: "/book.jpg",
      likes: 120,
    },
    {
      title: "The Design of Everyday Things",
      author: "Don Norman",
      year: "1988",
      image: "/book.jpg",
      likes: 120,
    },
    {
      title: "The Design of Everyday Things",
      author: "Don Norman",
      year: "1988",
      image: "/book.jpg",
      likes: 120,
    },
    {
      title: "The Design of Everyday Things",
      author: "Don Norman",
      year: "1988",
      image: "/book.jpg",
      likes: 120,
    },
    // Bạn có thể thêm nhiều sách khác vào đây
  ];

  const handleBookClick = (book) => {
    console.log(`Book clicked: ${book.title}`);
    // Bạn có thể thêm logic khác ở đây, ví dụ: điều hướng đến trang chi tiết sách
  };

  const handleSearchClick = () => {
    setShowSearchTab(true);
  };

  return (
    <Container fluid>
      {/* Navbar */}
      <Navbar
        expand="lg"
        className="px-4 fixed-top"
        style={{ backgroundColor: "rgb(255, 255, 255)" }}
      >
        <Row className="w-100 align-items-center">
          {/* Cột 2 cho Logo */}
          <Col md={2} className="d-flex align-items-center">
            <img
              src="/icon.jpg"
              alt="Logo"
              style={{ width: "40px", height: "40px", marginRight: "10px" }}
            />
            <Navbar.Brand href="#">MYLIB</Navbar.Brand>
          </Col>

          {/* Cột 10 cho Nội dung Navbar */}
          <Col
            md={10}
            className="d-flex justify-content-between align-items-center"
          >
            {/* Thanh tìm kiếm */}
            <Form
              className="d-flex me-3"
              style={{ position: "relative", width: "500px" }}
            >
              <FormControl
                type="text"
                placeholder="Tìm kiếm"
                className="mr-sm-2 flex-grow-1"
              />
              <Button style={{ position: "absolute", right: "0", top: "0" }}>
                <FontAwesomeIcon icon={faSearch} />
              </Button>
            </Form>

            {/* Phần thông báo & user */}
            <Nav className="d-flex align-items-center">
              {/* Dropdown Thông báo */}
              <Dropdown
                show={showNotifications}
                onToggle={() => {
                  setShowNotifications(!showNotifications);
                  setColor(!showNotifications ? "text-primary" : "text-dark");
                }}
              >
                <Dropdown.Toggle variant="link" className={`border-0 ${color}`}>
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
                      <strong>📘 'Don’t Make Me Think'</strong> sẽ đến hạn trả
                      vào ngày <strong>10/03/2025</strong>.
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
                      <strong>📕 'The Design of Everyday Things'</strong> đã quá
                      hạn 2 ngày. Vui lòng trả sách để tránh phạt.
                    </small>
                  </Dropdown.Item>
                  <Dropdown.Item
                    className="p-2"
                    style={{ whiteSpace: "normal", wordWrap: "break-word" }}
                  >
                    <small>
                      📅 Ngày hội đọc sách tại MYLIB sẽ diễn ra vào ngày{" "}
                      <strong>15/03/2025</strong>. Đăng ký tham gia ngay!
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
                  variant="link"
                  className="text-dark border-0 d-flex align-items-center p-2"
                  style={{ textDecoration: "none" }}
                >
                  <img
                    src="/avatar.jpg"
                    alt="Avatar"
                    className="rounded-circle me-2"
                    style={{ width: "40px", height: "40px" }}
                  />
                  <div className="font-weight-bold">Vu Tran</div>
                </Dropdown.Toggle>
                <Dropdown.Menu align="end" className="shadow rounded">
                  <Dropdown.Item href="#" className="py-2">
                    Trang cá nhân
                  </Dropdown.Item>
                  <Dropdown.Item href="#" className="py-2">
                    Ưa thích
                  </Dropdown.Item>
                  <Dropdown.Item href="#" className="py-2">
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

      <Row>
        {/* Sidebar */}
        <Col
          md={2}
          className="vh-100 p-3"
          style={{ marginTop: "70px" }} // Adjusted margin-top to push content down
        >
          <Sidebar onSearchClick={handleSearchClick} />
        </Col>

        {/* Main Content */}
        <Col md={10} className="p-4" style={{ marginTop: "70px" }}>
          {showSearchTab ? (
            <SearchTab />
          ) : (
            <>
              {/* Quote */}
              <Card className="text-white" style={{ border: "none" }}>
                <Quote books={books} handleCardClick={handleBookClick} />
              </Card>
              {/* Recommended Books */}
              <h5>Đề nghị cho bạn</h5>
              <Row className="mb-3 d-flex justify-content-center">
                {books.map((book, index) => (
                  <Col
                    md={3}
                    key={index}
                    className="d-flex justify-content-center"
                  >
                    <Card
                      className="shadow-sm border-0 rounded-4 overflow-hidden p-2 card-hover"
                      style={{ width: "200px" }}
                      onClick={() => handleBookClick(book)}
                    >
                      <Card.Img
                        variant="top"
                        src={book.image}
                        className="rounded-3"
                      />
                      <Card.Body className="text-center">
                        <Card.Title className="fs-6 fw-bold text-truncate">
                          {book.title}
                        </Card.Title>
                        <Card.Text className="text-muted small">
                          {book.author}, {book.year}
                        </Card.Text>
                        <Card.Text className="d-flex justify-content-center align-items-center gap-1 text-primary small">
                          <FontAwesomeIcon icon={faThumbsUp} className="fs-6" />
                          <span>{book.likes}</span>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              {/* New Books */}
              <h5>Mới đọc</h5>
              <Row className="mb-3 d-flex justify-content-center">
                {books.map((book, index) => (
                  <Col
                    md={3}
                    key={index}
                    className="d-flex justify-content-center"
                  >
                    <Card
                      className="shadow-sm border-0 rounded-4 overflow-hidden p-2 card-hover"
                      style={{ width: "200px" }}
                      onClick={() => handleBookClick(book)}
                    >
                      <Card.Img
                        variant="top"
                        src={book.image}
                        className="rounded-3"
                      />
                      <Card.Body className="text-center">
                        <Card.Title className="fs-6 fw-bold text-truncate">
                          {book.title}
                        </Card.Title>
                        <Card.Text className="text-muted small">
                          {book.author}, {book.year}
                        </Card.Text>
                        <Card.Text className="d-flex justify-content-center align-items-center gap-1 text-primary small">
                          <FontAwesomeIcon icon={faThumbsUp} className="fs-6" />
                          <span>{book.likes}</span>
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default HomePage;
