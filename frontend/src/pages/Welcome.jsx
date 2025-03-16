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
<<<<<<< HEAD
          <a href="#about" className="nav-link">
            Về chúng tôi
          </a>
          <a href="#services" className="nav-link">
            Dịch vụ
          </a>
          <a href="#books" className="nav-link">
            Danh mục sách
          </a>
          <a href="#blog" className="nav-link">
            Blog
          </a>
          <a href="/Login" className="btn-login">
            Đăng nhập
          </a>
=======
          <a href="#about" className="nav-link">Về chúng tôi</a>
          <a href="#services" className="nav-link">Dịch vụ</a>
          <a href="#books" className="nav-link">Danh mục sách</a>
          <a href="#blog" className="nav-link">Blog</a>
          <a href="/Login" className="btn-login">
            Đăng nhập
            </a>
>>>>>>> a6c2f05783ad49986e36e71f46ce5a88972ae7b8
        </nav>
      </header>

      {/* Main Content */}
      <div className="illustration-container">
<<<<<<< HEAD
        <img
          src="./image.png"
          alt="Reading Illustration"
          className="illustration"
        />
      </div>
      <div className="main-content">
        <div className="text-content">
          <p className="quote">
            "Một cuốn sách luôn được tạo nên từ hai người: người viết ra nó và
            người đọc nó."
=======
          <img src="./image.png" alt="Reading Illustration" className="illustration" />
        </div>
      <div className="main-content">
        <div className="text-content">
          <p className="quote">
            "Một cuốn sách luôn được tạo nên từ hai người: người viết ra nó và người đọc nó."
>>>>>>> a6c2f05783ad49986e36e71f46ce5a88972ae7b8
          </p>
          <p className="author">- Kosztolányi Dezső</p>
          <button className="btn-rent">Mượn sách ngay</button>
        </div>
<<<<<<< HEAD
=======

       
>>>>>>> a6c2f05783ad49986e36e71f46ce5a88972ae7b8
      </div>

      {/* Footer Circle */}
      <div className="footer-circle"></div>
    </div>
  );
}

<<<<<<< HEAD
export default Welcome;
=======
export default Welcome;
>>>>>>> a6c2f05783ad49986e36e71f46ce5a88972ae7b8
