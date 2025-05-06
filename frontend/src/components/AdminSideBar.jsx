import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faSearch,
  faBookOpen,
  faHandHoldingHeart,
  faHeart,
  faHistory,
  faChartLine,
} from "@fortawesome/free-solid-svg-icons";
import { Nav } from "react-bootstrap";

const AdminSidebar = ({ activeView, onNavigate }) => {
  // Style cho menu item đang active
  const getNavItemClass = (viewName) => {
    return `d-flex align-items-center py-3 px-3 rounded-pill mb-2 ${
      activeView === viewName ? "bg-primary text-white" : "text-dark"
    }`;
  };

  return (
    <Nav className="flex-column p-3">
      <Nav.Link
        className={getNavItemClass("home")}
        onClick={() => onNavigate("home")}
      >
        <FontAwesomeIcon icon={faHome} className="me-3" />
        <span className="fw-medium">Trang chủ</span>
      </Nav.Link>

      <Nav.Link
        className={getNavItemClass("search")}
        onClick={() => onNavigate("search")}
      >
        <FontAwesomeIcon icon={faSearch} className="me-3" />
        <span className="fw-medium">Tìm kiếm</span>
      </Nav.Link>

      <Nav.Link
        className={getNavItemClass("manageBooks")}
        onClick={() => onNavigate("manageBooks")}
      >
        <FontAwesomeIcon icon={faBookOpen} className="me-3" />
        <span className="fw-medium">Quản lý sách</span>
      </Nav.Link>

      <Nav.Link
        className={getNavItemClass("manageUsers")}
        onClick={() => onNavigate("manageUsers")}
      >
        <FontAwesomeIcon icon={faHandHoldingHeart} className="me-3" />
        <span className="fw-medium">Quản lý người dùng</span>
      </Nav.Link>
      <Nav.Link
        className={getNavItemClass("manageBorrows")}
        onClick={() => onNavigate("manageBorrows")}
      >
        <FontAwesomeIcon icon={faHandHoldingHeart} className="me-3" />
        <span className="fw-medium">Quản lý mượn trả sách</span>
      </Nav.Link>

      <Nav.Link
        className={getNavItemClass("manageRecommended")}
        onClick={() => onNavigate("manageRecommended")}
      >
        <FontAwesomeIcon icon={faHandHoldingHeart} className="me-3" />
        <span className="fw-medium">Quản lý đề xuất sách</span>
      </Nav.Link>

      <div className="mt-4 mb-3 text-muted px-3 fw-medium">
        <small>CÁ NHÂN</small>
      </div>

      <Nav.Link className="d-flex align-items-center py-3 px-3 rounded-pill mb-2 text-dark">
        <FontAwesomeIcon icon={faHeart} className="me-3" />
        <span className="fw-medium">Ưa thích</span>
      </Nav.Link>

      <Nav.Link className="d-flex align-items-center py-3 px-3 rounded-pill mb-2 text-dark">
        <FontAwesomeIcon icon={faHistory} className="me-3" />
        <span className="fw-medium">Lịch sử mượn</span>
      </Nav.Link>

      <Nav.Link className="d-flex align-items-center py-3 px-3 rounded-pill mb-2 text-dark">
        <FontAwesomeIcon icon={faChartLine} className="me-3" />
        <span className="fw-medium">Thống kê</span>
      </Nav.Link>
    </Nav>
  );
};

export default AdminSidebar;
