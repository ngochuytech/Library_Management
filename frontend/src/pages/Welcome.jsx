"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../styles/Welcome.css" // CSS chính
// import "../styles/icons.css" // CSS cho các biểu tượng

function Welcome() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const categoryIcons = {
    literature: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon"
      >
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
      </svg>
    ),
    economics: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon"
      >
        <line x1="12" y1="20" x2="12" y2="10"></line>
        <line x1="18" y1="20" x2="18" y2="4"></line>
        <line x1="6" y1="20" x2="6" y2="16"></line>
        <path d="M2 20h20"></path>
      </svg>
    ),
    science: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon"
      >
        <path d="M10 2v8L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45L14 10V2"></path>
        <line x1="10" y1="12" x2="14" y2="12"></line>
      </svg>
    ),
    history: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon"
      >
        <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
        <path d="M3 3v5h5"></path>
        <path d="M12 7v5l4 2"></path>
      </svg>
    ),
    children: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon"
      >
        <path d="M9 12h.01"></path>
        <path d="M15 12h.01"></path>
        <path d="M10 16c.5.3 1.5.5 2 .5s1.5-.2 2-.5"></path>
        <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"></path>
      </svg>
    ),
    psychology: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="icon"
      >
        <path d="M12 2a7 7 0 0 0-7 7c0 4 3 6 4 8 1 2 0 3 0 3h6s-1-1 0-3c1-2 4-4 4-8a7 7 0 0 0-7-7Z"></path>
        <path d="M8 16v3a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-3"></path>
      </svg>
    ),
  }

  // Mảng danh mục sách với lớp biểu tượng tương ứng
  const bookCategories = [
    { name: "Văn học", icon: categoryIcons.literature },
    { name: "Kinh tế", icon: categoryIcons.economics },
    { name: "Khoa học", icon: categoryIcons.science },
    { name: "Lịch sử", icon: categoryIcons.history },
    { name: "Thiếu nhi", icon: categoryIcons.children },
    { name: "Tâm lý", icon: categoryIcons.psychology },
  ]
  const iconContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    backgroundColor: '#f5f5f5',
    marginBottom: '15px',
    transition: 'all 0.3s ease',
    color: '#3b82f6',
  }

  return (
    <div className="welcome-container">
      {/* Header */}
      <header className={`header ${scrolled ? "header-scrolled" : ""}`}>
        <div className="logo">
          <img src="./logo.png" alt="MyLib Logo" className="logo-img" />
          <span className="logo-text">MyLib</span>
        </div>

        {/* Desktop Navigation */}
        <nav className={`nav-links ${isMenuOpen ? "nav-active" : ""}`}>
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
          <Link to="/Login" className="btn-login">
            Đăng nhập
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <button className="menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          )}
        </button>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="text-content">
            <h1 className="hero-title">Khám phá thế giới qua từng trang sách</h1>
            <div className="quote-container">
              <p className="quote">"Một cuốn sách luôn được tạo nên từ hai người: người viết ra nó và người đọc nó."</p>
              <p className="author">- Kosztolányi Dezső</p>
            </div>
            <div className="button-group">
              <button className="btn-rent">
                Mượn sách ngay
                <svg
                  className="btn-icon"
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </button>
              <button className="btn-explore">Khám phá thư viện</button>
            </div>
          </div>

          <div className="illustration-container">
            <div className="illustration-decoration circle-top"></div>
            <div className="illustration-decoration circle-bottom"></div>
            <img src="./image.png" alt="Reading Illustration" className="illustration" />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="about-section">
        <div className="section-header">
          <h2 className="section-title">Về chúng tôi</h2>
          <div className="section-divider"></div>
        </div>

        <div className="feature-cards">
          <div className="feature-card">
            <div className="feature-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon"
              >
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <h3 className="feature-title">Thư viện phong phú</h3>
            <p className="feature-description">
              Với hơn 10,000 đầu sách đa dạng thể loại, chúng tôi mang đến cho bạn kho tàng tri thức vô tận.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
            </div>
            <h3 className="feature-title">Cộng đồng đọc sách</h3>
            <p className="feature-description">
              Tham gia cộng đồng đọc sách sôi động, chia sẻ cảm nhận và kết nối với những người có cùng đam mê.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon"
              >
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
              </svg>
            </div>
            <h3 className="feature-title">Dễ dàng mượn trả</h3>
            <p className="feature-description">
              Hệ thống mượn trả hiện đại, giúp bạn dễ dàng tiếp cận sách mà không cần thủ tục phức tạp.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="services-section">
        <div className="section-header">
          <h2 className="section-title">Dịch vụ</h2>
          <div className="section-divider"></div>
        </div>

        <div className="service-cards">
          <div className="service-card">
            <div className="service-image">
              <img src="./service1.jpg" alt="Online Reading" />
            </div>
            <div className="service-content">
              <h3 className="service-title">Đọc sách trực tuyến</h3>
              <p className="service-description">
                Truy cập và đọc sách từ bất kỳ đâu với thư viện điện tử của chúng tôi. Hỗ trợ đa nền tảng và đồng bộ
                tiến độ đọc.
              </p>
              <button className="btn-outline">Tìm hiểu thêm</button>
            </div>
          </div>

          <div className="service-card">
            <div className="service-image">
              <img src="./service3.png" alt="Book Delivery" />
            </div>
            <div className="service-content">
              <h3 className="service-title">Giao sách tận nơi</h3>
              <p className="service-description">
                Đặt sách trực tuyến và nhận sách tại nhà với dịch vụ giao hàng nhanh chóng và an toàn của chúng tôi.
              </p>
              <button className="btn-outline">Tìm hiểu thêm</button>
            </div>
          </div>
        </div>
      </section>

      {/* Books Section */}
      <section id="books" className="books-section">
        <div className="section-header">
          <h2 className="section-title">Danh mục sách</h2>
          <div className="section-divider"></div>
          <p className="section-description">
            Khám phá bộ sưu tập sách đa dạng của chúng tôi, từ sách giáo khoa đến tiểu thuyết, từ sách thiếu nhi đến
            sách chuyên ngành.
          </p>
        </div>
        <div className="category-grid">
  {bookCategories.map((category, index) => (
    <div 
      key={index} 
      className="category-item"
      onMouseOver={(e) => {
        const iconContainer = e.currentTarget.querySelector('.icon-container');
        if (iconContainer) {
          iconContainer.style.backgroundColor = '#e0f2fe';
          iconContainer.style.transform = 'translateY(-5px)';
        }
      }}
      onMouseOut={(e) => {
        const iconContainer = e.currentTarget.querySelector('.icon-container');
        if (iconContainer) {
          iconContainer.style.backgroundColor = '#f5f5f5';
          iconContainer.style.transform = 'translateY(0)';
        }
      }}
    >
      <div 
        className="icon-container"
        style={iconContainerStyle}
      >
        {category.icon}
      </div>
      <h3 className="category-name">{category.name}</h3>
    </div>
  ))}
</div>

        <div className="center-button">
          <button className="btn-primary">Xem tất cả danh mục</button>
        </div>
      </section>

      {/* Blog Section */}
      <section id="blog" className="blog-section">
        <div className="section-header">
          <h2 className="section-title">Blog</h2>
          <div className="section-divider"></div>
        </div>

        <div className="blog-cards">
          {[
            {
              title: "10 cuốn sách nên đọc trong năm 2025",
              excerpt: "Khám phá những cuốn sách hay nhất mà bạn không nên bỏ lỡ trong năm nay.",
              date: "15/06/2025",
              image: "./blog1.png",
            },
            {
              title: "Cách tạo thói quen đọc sách mỗi ngày",
              excerpt: "Những bí quyết giúp bạn duy trì thói quen đọc sách đều đặn và hiệu quả.",
              date: "02/05/2025",
              image: "./blog2.jpg",
            },
            {
              title: "Lợi ích của việc đọc sách đối với não bộ",
              excerpt: "Nghiên cứu khoa học về tác động tích cực của việc đọc sách đối với sức khỏe tinh thần.",
              date: "18/04/2025",
              image: "./blog3.jpg",
            },
          ].map((post, index) => (
            <div key={index} className="blog-card">
              <div className="blog-image">
                <img src={post.image || "/placeholder.svg"} alt={post.title} />
              </div>
              <div className="blog-content">
                <div className="blog-date">{post.date}</div>
                <h3 className="blog-title">{post.title}</h3>
                <p className="blog-excerpt">{post.excerpt}</p>
                <a href="#" className="blog-link">
                  Đọc tiếp
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <div className="footer-logo">
              <img src="./logo.png" alt="MyLib Logo" className="footer-logo-img" />
              <span className="footer-logo-text">MyLib</span>
            </div>
            <p className="footer-description">Thư viện hiện đại, kết nối tri thức và đam mê đọc sách của mọi người.</p>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Liên kết</h4>
            <ul className="footer-links">
              <li>
                <a href="#about">Về chúng tôi</a>
              </li>
              <li>
                <a href="#services">Dịch vụ</a>
              </li>
              <li>
                <a href="#books">Danh mục sách</a>
              </li>
              <li>
                <a href="#blog">Blog</a>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Liên hệ</h4>
            <ul className="footer-contact">
              <li>123 Đường Sách, Quận 1, TP.HCM</li>
              <li>info@mylib.com</li>
              <li>(+84) 123 456 789</li>
            </ul>
          </div>

          <div className="footer-section">
            <h4 className="footer-title">Đăng ký nhận tin</h4>
            <p className="footer-newsletter-text">Nhận thông tin về sách mới và sự kiện của chúng tôi.</p>
            <div className="footer-newsletter">
              <input type="email" placeholder="Email của bạn" className="footer-input" />
              <button className="footer-button">Gửi</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>© 2023 MyLib. Tất cả quyền được bảo lưu.</p>
        </div>

        {/* Decorative circles */}
        <div className="footer-circle footer-circle-1"></div>
        <div className="footer-circle footer-circle-2"></div>
      </footer>
    </div>
  )
}

export default Welcome

