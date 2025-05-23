import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
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

import "../styles/Home.css";

import Sidebar from "../components/SideBar.jsx";
import Quote from "../components/Quote.jsx";
import SearchTab from "../components/SearchTab.jsx";
import BookDetail from "../components/BookDetail.jsx";
import MyBookshelf from "../components/MyBookshelf.jsx";
import Contributions from "../components/Contributions.jsx";
import Account from "../components/Account.jsx";
import Liked from "../components/Liked.jsx";
import History from "../components/History.jsx";
import RecommendBooks from "../components/RecommendBooks.jsx";
import Background from "../components/Background.jsx";
import api from "../api";

const HomePage = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeView, setActiveView] = useState("home");
  const [selectedBook, setSelectedBook] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResult, setSearchResult] = useState([]);
  const [totalPages, setTotalPages] = useState();

  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [recentlyBooks, setRecentlyBooks] = useState([]);

  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [accountTab, setAccountTab] = useState("profile");
  const [user, setUser] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    checkOverdue();
    fetchNotifications();
    fetchRecommendedBooks();
    fetchRecentlyBooks();
  }, []);

  useEffect(() => {
    fetchUser();
    if (activeView == "search" && searchQuery.trim() == "")
      fetchAllBook(currentPage);
    else fetchSearchResults(currentPage);
  }, [activeView, searchQuery, searchType, currentPage]);

  const fetchNotifications = async () => {
    try {
      const idUser = sessionStorage.getItem("idUser");
      const response = await api.get(`/notifications/api/user/${idUser}`);

      setNotifications(response.data.slice(0, 5));
    } catch (error) {
      console.log(error);

      setNotifications([]);
    }
  };
  // fetch user
  const fetchUser = async () => {
    const idUser = sessionStorage.getItem("idUser");
    if (!idUser) {
      setUser(null);
      return;
    }
    try {
      const response = await api.get(`/users/detail/${idUser}/`);
      setUser(response.data);
      console.log("user", response.data);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      setUser(null);
    }
  };
  const checkOverdue = async () => {
    const access_token = sessionStorage.getItem("access_token");
    if (access_token) {
      await api.post("/borrows/api/check-overdue");
    }
  };

  const fetchRecommendedBooks = async () => {
    try {
      const response = await fetch(`${BASE_URL}/books/api`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      setRecommendedBooks(data.results);
    } catch (error) {
      console.error("Failed to fetch recommended books:", error);
    }
  };

  const fetchRecentlyBooks = async () => {
    setRecentlyBooks([]);
    try {
      const response = await fetch(`${BASE_URL}/books/api?page=2`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("data rêcnt", data.results);
      setRecentlyBooks(data.results);
    } catch (error) {
      console.error("Failed to fetch recently books:", error);
    }
  };

  const fetchSearchResults = async (page) => {
    try {
      const response = await fetch(
        `${BASE_URL}/books/api/search?type=${searchType}&query=${searchQuery}&page=${page}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      setSearchResult(data.results);
      setTotalPages(Math.ceil(data.count / 9));
    } catch (error) {
      console.error("Failed to fetch search books:", error);
    }
  };

  const fetchAllBook = async (page) => {
    try {
      const response = await fetch(`${BASE_URL}/books/api/search?page=${page}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      setSearchResult(data.results);
      setTotalPages(Math.ceil(data.count / 6));
    } catch (error) {
      console.error("Failed to fetch all books:", error);
    }
  };

  const handleBookClick = (book) => {
    console.log("Book clicked:", book);
    setSelectedBook(book);
    setActiveView("bookDetail");
  };

  const handleNavigation = (view, tab = "profile") => {
    setActiveView(view);
    if (view === "account") {
      setAccountTab(tab);
    }
    if (view !== "bookDetail") {
      setSelectedBook(null);
    }
  };

  // Callback để xử lý tìm kiếm theo tác giả
  const handleSearchByAuthor = (authorId, authorName) => {
    setSearchType("author");
    setSearchQuery(authorName);
    setCuarrentPage(1);
    setActiveView("search");
  };

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
              <Card.Img
                variant="top"
                src={`/image/${book.image}`}
                className="rounded-3"
              />
              <Card.Body className="text-center">
                <Card.Title className="fs-6 fw-bold text-truncate">
                  {book.title}
                </Card.Title>
                <Card.Text className="text-muted small">
                  {book.author?.name}
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

  const handleSearch = async (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setActiveView("search");
  };

  const renderContent = () => {
    switch (activeView) {
      case "search":
        return (
          <SearchTab
            searchResult={searchResult}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            handleBookClick={handleBookClick}
          />
        );
      case "bookshelf":
        return <MyBookshelf handleBookClick={handleBookClick} />;
      case "contributions":
        return <Contributions />;
      case "RecommendBooks":
        return <RecommendBooks />;
      case "bookDetail":
        return selectedBook ? (
          <BookDetail
            book={selectedBook}
            onSearchByAuthor={handleSearchByAuthor}
          />
        ) : null;
      case "account":
        return <Account defaultTab={accountTab} />;
      case "liked":
        return <Liked />;
      case "History":
        return <History />;
      case "home":
      default:
        return (
          <>
            <Quote handleCardClick={handleBookClick} />
            <h2 className="greeting mt-4 mb-3">Xin chào</h2>

            <h3 className="section-heading">Đề nghị cho bạn</h3>
            <BookSection
              title="Đề nghị cho bạn"
              books={recommendedBooks}
              onBookClick={handleBookClick}
            />

            <h3 className="section-heading mt-4">Mới ra</h3>
            <BookSection
              title="Mới ra"
              books={recentlyBooks}
              onBookClick={handleBookClick}
            />
          </>
        );
    }
  };

  return (
    <Background>
      <div className="home-container">
        {/* Content Shield - White overlay */}
        <div className="content-shield">
          <div className="content-layout">
            {/* Sidebar */}
            <div className="sidebar-container">
              <Sidebar activeView={activeView} onNavigate={handleNavigation} />
            </div>

            {/* Main Content */}
            <div className="main-container">
              {/* Top Navigation */}
              <div className="top-nav">
                <div className="search-container">
                  <div className="dropdown">
                    <Dropdown className="me-2">
                      <Dropdown.Toggle variant="light" className="rounded-pill">
                        {searchType === "title"
                          ? "Tựa đề"
                          : searchType === "author"
                          ? "Tác giả"
                          : "Thể loại"}
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setSearchType("title")}>
                          Tựa đề
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setSearchType("author")}>
                          Tác giả
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => setSearchType("category")}
                        >
                          Thể loại
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                  <div className="search-box">
                    <Form onSubmit={handleSearch} style={{ width: "100%" }}>
                      <input
                        type="text"
                        placeholder="Tìm kiếm"
                        className="search-input"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ width: "100%" }}
                      />
                      <button className="search-icon" type="submit">
                        <FontAwesomeIcon icon={faSearch} />
                      </button>
                    </Form>
                  </div>
                </div>

                <div className="user-section">
                  <div
                    className="notifications"
                    onClick={() => setShowNotifications(!showNotifications)}
                  >
                    <span className="notification-icon">
                      <FontAwesomeIcon icon={faBell} />
                    </span>
                    {showNotifications && (
                      <div className="notifications-dropdown">
                        <div className="notification-header">
                          <strong>Thông báo</strong>
                          <a
                            href="#"
                            className="view-all"
                            onClick={(e) => {
                              e.preventDefault();
                              setShowNotifications(false);
                              handleNavigation("account", "notifications");
                            }}
                          >
                            Xem tất cả
                          </a>
                        </div>
                        {notifications.length === 0 ? (
                          <div className="notification-item">
                            <small>Không có thông báo nào.</small>
                          </div>
                        ) : (
                          notifications.map((noti) => (
                            <div className="notification-item" key={noti.id}>
                              <small>{noti.message}</small>
                              <br />
                              <small className="text-muted">
                                {new Date(noti.date).toLocaleString("vi-VN")}
                              </small>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>

                  <div
                    className="user-profile"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                  >
                    <img
                      className="avatar"
                      src={
                        user && user.avatar
                          ? `/image/${user.avatar}`
                          : "/image/default-avatar.png"
                      }
                      alt="Avatar"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        objectFit: "cover",
                      }}
                    />
                    <span>
                      {sessionStorage.getItem("username") === null
                        ? "Khách"
                        : sessionStorage.getItem("username")}
                    </span>
                    <span className="dropdown-icon">▼</span>
                    {showUserMenu && (
                      <div className="user-dropdown">
                        <div
                          className="user-dropdown-item"
                          onClick={() => handleNavigation("account")}
                        >
                          Trang cá nhân
                        </div>
                        <div className="divider"></div>
                        <div
                          className="user-dropdown-item logout"
                          onClick={() => {
                            sessionStorage.clear();
                            navigate("/");
                          }}
                        >
                          Đăng xuất
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              {/* Content Area with Transition */}
              <div className="content-area">
                <div className="view-transition">{renderContent()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Background>
  );
};

export default HomePage;
