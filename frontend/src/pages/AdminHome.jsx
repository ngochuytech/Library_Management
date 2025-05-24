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

import "../styles/Home.css";
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
import AdminAuthors from "../components/AdminAuthors.jsx";
import LibraryAdminSearch from "../components/LibraryAdminSearch";
import Background from "../components/Background.jsx";
import api from "../api";

const HomePage = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const [notifications, setNotifications] = useState([]);

  const { view } = useParams();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState(view || "manageBooks"); 

  useEffect(() => {
    fetchNotifications();

    const isAdmin = sessionStorage.getItem("isAdmin") === "true";
      if (isAdmin) {
        fetchPendingBorrows();
      }
  }, []);

  useEffect(() => {
    if (view) {
      setActiveView(view);
    }
  }, [view]);

  const BASE_URL = import.meta.env.VITE_API_URL;
  const handleNavigation = (view) => {
    setActiveView(view);
    navigate(`/admin/home/${view}`);

    if (view !== "bookDetail") {
      setSelectedBook(null);
    }
  };

  const fetchNotifications = async () => {
    try {
      const idUser = sessionStorage.getItem("idUser");
      const response = await api.get(`/notifications/api/user/${idUser}`);
      setNotifications(response.data.slice(0, 5));
    } catch (error) {
      setNotifications([]);
    }
  };

  const fetchPendingBorrows = async () => {
    try {
      const token = sessionStorage.getItem("access_token");
      if (!token) return;
      const response = await api.get("/borrows/api/pending-borrows", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data && response.data.length > 0) {
        setNotifications((prev) => {
          const hasPending = prev.some((n) => n.id === "pending-borrow");
          if (hasPending) return prev;
          return [
            {
              id: "pending-borrow",
              message: `Có ${response.data.length} yêu cầu mượn sách đang chờ duyệt.`,
              date: new Date().toISOString(),
            },
            ...prev,
          ];
        });
      }
    } catch (error) {
      console.error("Error fetching pending borrows:", error);
    }
  };


  const renderContent = () => {
    switch (activeView) {
      case "manageAuthors":
        return <AdminAuthors />; 
      case "manageBooks":
        return <AdminBooks />;
      case "manageUsers":
        return <AdminUsers />;
      case "manageBorrows":
        return <AdminBorrows />;
      case "adminSearch":
        return <LibraryAdminSearch />;
      case "bookshelf":
        return <MyBookshelf books={[]} />;
      case "contributions":
        return <Contributions />;
      case "bookDetail":
        return selectedBook ? <BookDetail book={selectedBook} /> : null;
      case "account":
        return <Account />;
      case "liked":
        return <Liked />;
      case "History":
        return <History />;
      case "statistics":
        return <AdminStatistics />;
      default:
        return <AdminBooks />;
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
