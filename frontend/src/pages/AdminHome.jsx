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

import "../styles/Home.css"; // Chỉ sử dụng Home.css
import AdminSidebar from "../components/AdminSideBar.jsx";
import Quote from "../components/Quote.jsx";
import SearchTab from "../components/SearchTab.jsx";
import BookDetail from "../components/BookDetail.jsx";
import MyBookshelf from "../components/MyBookshelf.jsx";
import Contributions from "../components/Contributions.jsx";
import Account from "../components/Account.jsx";
import Liked from "../components/Liked.jsx";
import History from "../components/History.jsx";
import AdminBooks from "../components/AdminBooks.jsx";
import AdminUsers from "../components/AdminUsers.jsx";
import AdminBorrows from "../components/AdminBorrows.jsx";
import AdminRecommendedBooks from "../components/AdminRecommendedBooks.jsx";
import LibraryAdminSearch from "../components/LibraryAdminSearch";
import Background from "../components/Background.jsx";

const HomePage = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [activeView, setActiveView] = useState("home"); // Thêm state này để quản lý view
  const [selectedBook, setSelectedBook] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchResult, setSearchResult] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  const [recommendedBooks, setRecommendedBooks] = useState([]); // State cho sách đề xuất từ API
  const [loadingRecommended, setLoadingRecommended] = useState(true); // State quản lý trạng thái loading
  const [errorRecommended, setErrorRecommended] = useState(null); // State quản lý lỗi

  const [recentlyBooks, setRecentlyBooks] = useState([]);

  const BASE_URL = import.meta.env.VITE_API_URL;

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
      } catch (error) {
        console.error("Failed to fetch recommended books:", error);
        setErrorRecommended(
          "Không thể tải sách đề xuất. Vui lòng thử lại sau."
        );
      } finally {
        setLoadingRecommended(false);
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

        setRecentlyBooks(data.results);
      } catch (error) {
        console.error("Failed to fetch recently books:", error);
      }
    };

    fetchRecommendedBooks();
    fetchRecentlyBooks();
  }, []);

  useEffect(() => {
    if (activeView === "search" && searchQuery.trim() === "")
      fetchAllBook(currentPage);
    else if (activeView === "search") fetchSearchResults(currentPage);
  }, [activeView, searchQuery, searchType, currentPage]);

  const fetchSearchResults = async (page) => {
    try {
      const response = await fetch(
        `${BASE_URL}/books/api?type=${searchType}&query=${searchQuery}&page=${page}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();

      setSearchResult(data.results);
      setTotalPages(Math.ceil(data.count / 6));
    } catch (error) {
      console.error("Failed to fetch search books:", error);
    }
  };

  const fetchAllBook = async (page) => {
    try {
      const response = await fetch(`${BASE_URL}/books/api?page=${page}`);

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

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    setActiveView("search");
  };

  // Render BookSection giống file 2 dùng Bootstrap components
  const BookSection = ({ title, books, onBookClick }) => (
    <div className="mb-4">
      <Row className="mt-3 d-flex flex-nowrap overflow-auto pb-2">
        {books.map((book, index) => (
          <Col key={index} className="px-2" style={{ minWidth: "200px" }}>
            {" "}
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

  // Render nội dung dựa trên activeView giống file 2
  const renderContent = () => {
    switch (activeView) {
      case "manageBooks":
        return <AdminBooks />; // Thay thế bằng component quản lý sách
      case "manageUsers":
        return <AdminUsers />; // Thay thế bằng component quản lý người dùng
      case "manageBorrows":
        return <AdminBorrows />; // Thay thế bằng component quản lý mượn trả sách
      case "manageRecommended":
        return <AdminRecommendedBooks />; // Thay thế bằng component quản lý sách đề xuất
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
      case "adminSearch":
        return <LibraryAdminSearch />;
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
              books={recentlyBooks}
              onBookClick={handleBookClick}
            />
          </>
        );
    }
  };

  return (
    <Background>
      <div className="content-shield">
        <div className="content-layout">
          {/* Sidebar */}
          <div className="sidebar-container">
            <AdminSidebar
              activeView={activeView}
              onNavigate={handleNavigation}
            />
          </div>

          {/* Main Container */}
          <div className="main-container">
            {/* Top Navigation */}
            <div className="top-nav">
              <div className="dropdown">
                <button className="dropdown-button">
                  Tựa đề <span className="dropdown-icon">▼</span>
                </button>
              </div>
              <div className="search-box">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Tìm kiếm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button className="search-icon" onClick={handleSearch}>
                  <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>

              <div className="user-section">
                <div className="lang-selector">
                  <FontAwesomeIcon icon={faGlobe} />
                  <span>Lang</span>
                </div>

                <div
                  className="notifications"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <FontAwesomeIcon
                    icon={faBell}
                    className="notification-icon"
                  />
                  {showNotifications && (
                    <div className="notifications-dropdown">
                      <div className="notification-header">
                        <span>Thông báo</span>
                        <a href="#" className="view-all">
                          Xem tất cả
                        </a>
                      </div>
                      <div className="notification-item">Thông báo 1</div>
                      <div className="notification-item">Thông báo 2</div>
                    </div>
                  )}
                </div>

                <div
                  className="user-profile"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="avatar">VT</div>
                  <span>
                    {sessionStorage.getItem("username") === null
                      ? "Nguyễn Văn A"
                      : sessionStorage.getItem("username")}
                  </span>
                  {showUserMenu && (
                    <div className="user-dropdown">
                      <div
                        className="user-dropdown-item"
                        onClick={() => handleNavigation("account")}
                      >
                        Trang cá nhân
                      </div>
                      <div
                        className="user-dropdown-item"
                        onClick={() => handleNavigation("liked")}
                      >
                        Ưa thích
                      </div>
                      <div
                        className="user-dropdown-item"
                        onClick={() => handleNavigation("History")}
                      >
                        Lịch sử mượn
                      </div>
                      <div className="divider"></div>
                      <div className="user-dropdown-item logout">Đăng xuất</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content Area */}
            <div className="content-area">{renderContent()}</div>
          </div>
        </div>
      </div>
    </Background>
  );
};

export default HomePage;
