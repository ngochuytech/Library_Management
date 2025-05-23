import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useParams, useNavigate } from "react-router-dom";
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
import AdminStatistics from "../components/AdminStatistics";
import BookDetail from "../components/BookDetail.jsx";
import MyBookshelf from "../components/MyBookshelf.jsx";
import Contributions from "../components/Contributions.jsx";
import Account from "../components/Account.jsx";
import Liked from "../components/Liked.jsx";
import History from "../components/History.jsx";
import AdminBooks from "../components/AdminBooks.jsx";
import AdminUsers from "../components/AdminUsers.jsx";
import AdminBorrows from "../components/AdminBorrows.jsx";
import LibraryAdminSearch from "../components/LibraryAdminSearch";
import Background from "../components/Background.jsx";

const HomePage = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // Lấy tham số view từ URL
  const { view } = useParams();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState(view || "manageBooks"); // Sử dụng view từ URL hoặc mặc định "manageBooks"

  // Hook useEffect để cập nhật activeView khi view trong URL thay đổi
  useEffect(() => {
    if (view) {
      setActiveView(view);
    }
  }, [view]);

  const BASE_URL = import.meta.env.VITE_API_URL;
  // Đổi tên hàm và cập nhật logic để phù hợp với cách tiếp cận mới
  const handleNavigation = (view) => {
    setActiveView(view);
    // Cập nhật URL để phản ánh view hiện tại
    navigate(`/admin/home/${view}`);

    if (view !== "bookDetail") {
      setSelectedBook(null);
    }
  };
  // BookSection component removed
  // Render nội dung dựa trên activeView
  const renderContent = () => {
    switch (activeView) {
      case "manageBooks":
        return <AdminBooks />; // Component quản lý sách
      case "manageUsers":
        return <AdminUsers />; // Component quản lý người dùng
      case "manageBorrows":
        return <AdminBorrows />; // Component quản lý mượn trả sách
      case "adminSearch":
        return <LibraryAdminSearch />;
      case "bookshelf":
        return <MyBookshelf books={[]} />;
      case "contributions":
        return <Contributions />;
      case "bookDetail":
        return selectedBook ? <BookDetail book={selectedBook} /> : null;
      case "account":
        return <Account />; // Hiển thị component Account
      case "liked":
        return <Liked />; // Hiển thị component Liked
      case "History":
        return <History />; // Hiển thị component History
      case "statistics":
        return <AdminStatistics />; // Đây là component thống kê của bạn
      default:
        return <AdminBooks />; // Mặc định hiển thị trang quản lý sách
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
            <div className="top-nav">
              <div className="dropdown"></div>{" "}
              <div className="user-section">
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
                  <img
                    className="avatar"
                    src="/icon.jpg"
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
                      <div className="divider"></div>
                      <div
                        className="user-dropdown-item logout"
                        onClick={() => {
                          sessionStorage.clear();
                          window.location.href = "/";
                        }}
                      >
                        Đăng xuất
                      </div>
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
