"use client"
import "../styles/SideBar.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHome, faSearch, faBook, faGift } from "@fortawesome/free-solid-svg-icons"

const Sidebar = ({ activeView, onNavigate }) => {
  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src="./logoUnder.png" alt="MYLIB Logo" className="logo" />

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
          className={`nav-item ${activeView === "bookshelf" ? "active" : ""}`}
          onClick={() => onNavigate("bookshelf")}
          style={{ fontStyle: 'normal' }}
        >
          <div className="nav-icon"><FontAwesomeIcon icon={faBook} /></div>
          <span>Giá sách của tôi</span>
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

export default Sidebar

