"use client"
import "../styles/SideBar.css"

const Sidebar = ({ activeView, onNavigate }) => {
  return (
    <div className="sidebar">
      <div className="logo-container">
        <img src="./logoUnder.png" alt="MYLIB Logo" className="logo" />
        
      </div>

      <nav className="sidebar-nav">
        <div className={`nav-item ${activeView === "home" ? "active" : ""}`} onClick={() => onNavigate("home")}>
          <i className="nav-icon">🏠</i>
          <span>Trang chủ</span>
        </div>
        <div className={`nav-item ${activeView === "search" ? "active" : ""}`} onClick={() => onNavigate("search")}>
          <i className="nav-icon">🔍</i>
          <span>Tìm kiếm</span>
        </div>
        <div
          className={`nav-item ${activeView === "bookshelf" ? "active" : ""}`}
          onClick={() => onNavigate("bookshelf")}
        >
          <i className="nav-icon">📊</i>
          <span>Giá sách của tôi</span>
        </div>
        <div
          className={`nav-item ${activeView === "contributions" ? "active" : ""}`}
          onClick={() => onNavigate("contributions")}
        >
          <i className="nav-icon">🎁</i>
          <span>Đóng góp</span>
        </div>
      </nav>

      <div className="sidebar-footer">
        <div className="footer-item">Về chúng tôi</div>
        <div className="footer-item">Hỗ trợ</div>
        <div className="footer-item">Điều khoản & Điều kiện</div>
      </div>
    </div>
  )
}

export default Sidebar

