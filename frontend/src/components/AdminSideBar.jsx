"use client"
import "../styles/SideBar.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHome,
  faSearch,
  faBook,
  faUsers,
  faBookOpen,
  faStar,
  faUserCircle
} from "@fortawesome/free-solid-svg-icons"

const AdminSidebar = ({ activeView, onNavigate }) => {
  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src="./logo" alt="MYLIB Logo" className="logo" />
      </div>

      <nav className="sidebar-nav">
        <div className={`nav-item ${activeView === "home" ? "active" : ""}`} onClick={() => onNavigate("home")} style={{ fontStyle: 'normal' }}>
          <div className="nav-icon"><FontAwesomeIcon icon={faHome} /></div>
          <span>Trang chủ</span>
        </div>
        <div className={`nav-item ${activeView === "search" ? "active" : ""}`} onClick={() => onNavigate("search")} style={{ fontStyle: 'normal' }}>
          <div className="nav-icon"><FontAwesomeIcon icon={faSearch} /></div>
          <span>Tìm kiếm</span>
        </div>
        <div
          className={`nav-item ${activeView === "manageBooks" ? "active" : ""}`}
          onClick={() => onNavigate("manageBooks")}
          style={{ fontStyle: 'normal' }}
        >
          <div className="nav-icon"><FontAwesomeIcon icon={faBook} /></div>
          <span>Quản lý sách</span>
        </div>
        <div
          className={`nav-item ${activeView === "manageUsers" ? "active" : ""}`}
          onClick={() => onNavigate("manageUsers")}
          style={{ fontStyle: 'normal' }}
        >
          <div className="nav-icon"><FontAwesomeIcon icon={faUsers} /></div>
          <span>Quản lý người dùng</span>
        </div>
        <div
          className={`nav-item ${activeView === "manageBorrows" ? "active" : ""}`}
          onClick={() => onNavigate("manageBorrows")}
          style={{ fontStyle: 'normal' }}
        >
          <div className="nav-icon"><FontAwesomeIcon icon={faBookOpen} /></div>
          <span>Quản lý mượn trả</span>
        </div>
        <div
          className={`nav-item ${activeView === "manageRecommended" ? "active" : ""}`}
          onClick={() => onNavigate("manageRecommended")}
          style={{ fontStyle: 'normal' }}
        >
          <div className="nav-icon"><FontAwesomeIcon icon={faStar} /></div>
          <span>Quản lý đề xuất</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="footer-item" style={{ fontStyle: 'normal' }}>Về chúng tôi</div>
        <div className="footer-item" style={{ fontStyle: 'normal' }}>Hỗ trợ</div>
        <div className="footer-item" style={{ fontStyle: 'normal' }}>Điều khoản & Điều kiện</div>
      </div>
    </div>
  )
}

export default AdminSidebar
