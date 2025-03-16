import React from "react";
import "../styles/Welcome.css"; // Custom styles

function Welcome() {
  return (
    <div className="welcome-container">
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src="./logo.png" alt="MyLib Logo" className="logo-img" />
        </div>
        <nav className="nav-links">
          <a href="#about" className="nav-link">Về chúng tôi</a>
          <a href="#services" className="nav-link">Dịch vụ</a>
          <a href="#books" className="nav-link">Danh mục sách</a>
          <a href="#blog" className="nav-link">Blog</a>
          <a href="/Login" className="btn-login">
            Đăng nhập
            </a>
        </nav>
      </header>

      {/* Main Content */}
      <div className="illustration-container">
          <img src="./image.png" alt="Reading Illustration" className="illustration" />
        </div>
      <div className="main-content">
        <div className="text-content">
          <p className="quote">
            "Một cuốn sách luôn được tạo nên từ hai người: người viết ra nó và người đọc nó."
          </p>
          <p className="author">- Kosztolányi Dezső</p>
          <button className="btn-rent">Mượn sách ngay</button>
        </div>

       
      </div>

      {/* Footer Circle */}
      <div className="footer-circle"></div>
    </div>
  );
}

export default Welcome;
