"use client"

import { useState } from "react"
import Background from "../components/Background"
import Sidebar from "../components/SideBar"
import Quote from "../components/Quote"
import BookSection from "../components/BookSection"
import SearchTab from "../components/SearchTab"
import MyBookshelf from "../components/MyBookshelf"
import Contributions from "../components/Contributions"
import "../styles/Home.css"

const Home = () => {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [activeView, setActiveView] = useState("home") // Track active view: home, search, bookshelf, contributions

  const recommendedBooks = [
    {
      title: "Don't Make Me think",
      author: "Steve Krug",
      year: "2005",
      image: "/book.jpg",
      rating: 4.5,
    },
    {
      title: "The Design of Everyday Things",
      author: "Don Norman",
      year: "1988",
      image: "/book.jpg",
      rating: 4.5,
    },
    {
      title: "Sprint : How to solve big problems",
      author: "Jake Knapp",
      year: "2000",
      image: "/book.jpg",
      rating: 4.5,
    },
    {
      title: "Lean UX : Design Great Products",
      author: "Jeff Gothelf",
      year: "2016",
      image: "/book.jpg",
      rating: 4.5,
    },
    {
      title: "The Road to React",
      author: "Steve Krug",
      year: "2020",
      image: "/book.jpg",
      rating: 4.5,
    },
    {
      title: "Rich Dad Poor Dad",
      author: "Robert T Kiyosaki",
      year: "1997",
      image: "/book.jpg",
      rating: 5.0,
    },
    {
      title: "Harry Potter and The Chamber of Secrets",
      author: "J.K. Rowling",
      year: "2002",
      image: "/book.jpg",
      rating: 4.9,
    },
  ]

  const recentlyViewedBooks = [
    {
      title: "Don't Make Me think",
      author: "Steve Krug",
      year: "2000",
      image: "/book.jpg",
      rating: 4.5,
    },
    {
      title: "The Design of Everyday Things",
      author: "Don Norman",
      year: "1988",
      image: "/book.jpg",
      rating: 4.5,
    },
    {
      title: "Sprint : How to solve big problems",
      author: "Jake Knapp",
      year: "2000",
      image: "/book.jpg",
      rating: 4.5,
    },
    {
      title: "Lean UX : Design Great Products",
      author: "Jeff Gothelf",
      year: "2016",
      image: "/book.jpg",
      rating: 4.5,
    },
    {
      title: "The Road to React",
      author: "Steve Krug",
      year: "2020",
      image: "/book.jpg",
      rating: 4.5,
    },
    {
      title: "Rich Dad Poor Dad",
      author: "Robert T Kiyosaki",
      year: "1997",
      image: "/book.jpg",
      rating: 5.0,
    },
    {
      title: "Harry Potter and The Chamber of Secrets",
      author: "J.K. Rowling",
      year: "2002",
      image: "/book.jpg",
      rating: 4.9,
    },
  ]

  const handleBookClick = (book) => {
    console.log(`Book clicked: ${book.title}`)
    // Add logic for book click, e.g., navigate to book details page
  }

  // Handle sidebar navigation
  const handleNavigation = (view) => {
    setActiveView(view)
  }

  // Render content based on active view
  const renderContent = () => {
    switch (activeView) {
      case "search":
        return <SearchTab />
      case "bookshelf":
        return <MyBookshelf books={recommendedBooks} />
      case "contributions":
        return <Contributions />
      case "home":
      default:
        return (
          <>
            <Quote />
            <h2 className="greeting">Xin chào</h2>
            
            <h3 className="section-heading">Đề nghị cho bạn</h3>
            <BookSection title="Đề nghị cho bạn" books={recommendedBooks} onBookClick={handleBookClick} />
            
            <h3 className="section-heading">Mới đọc</h3>
            <BookSection title="Mới đọc" books={recentlyViewedBooks} onBookClick={handleBookClick} />
          </>
        )
    }
  }

  return (
    <Background>
      <div className="home-container">
        {/* Content Shield - White overlay */}
        <div className="content-shield">
          <div className="content-layout">
            {/* Sidebar */}
            <div className="sidebar-container">
              <Sidebar activeView={activeView} onNavigate={handleNavigation} />
            </div>

            {/* Main Content */}
            <div className="main-container">
              {/* Top Navigation */}
              <div className="top-nav">
                <div className="search-container">
                  <div className="dropdown">
                    <button className="dropdown-button">
                      Tất cả <span className="dropdown-icon">▼</span>
                    </button>
                  </div>
                  <div className="search-box">
                    <input type="text" placeholder="Tìm kiếm" className="search-input" />
                    <button className="search-icon">🔍</button>
                  </div>
                </div>

                <div className="user-section">
                  <div className="lang-selector">
                    <span>Lang</span>
                    <span className="dropdown-icon">▼</span>
                  </div>

                  <div className="notifications" onClick={() => setShowNotifications(!showNotifications)}>
                    <span className="notification-icon">🔔</span>
                    {showNotifications && (
                      <div className="notifications-dropdown">
                        <div className="notification-header">
                          <strong>Thông báo</strong>
                          <a href="#" className="view-all">
                            Xem tất cả
                          </a>
                        </div>
                        <div className="notification-item">
                          <small>
                            <strong>📘 'Don't Make Me Think'</strong> sẽ đến hạn trả vào ngày{" "}
                            <strong>10/03/2025</strong>.
                          </small>
                        </div>
                        <div className="notification-item">
                          <small>
                            <strong>📕 'The Design of Everyday Things'</strong> đã quá hạn 2 ngày. Vui lòng trả sách để
                            tránh phạt.
                          </small>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="user-profile" onClick={() => setShowUserMenu(!showUserMenu)}>
                    <div className="avatar">VT</div>
                    <span>Vu tran</span>
                    <span className="dropdown-icon">▼</span>

                    {showUserMenu && (
                      <div className="user-dropdown">
                        <div className="user-dropdown-item">Trang cá nhân</div>
                        <div className="user-dropdown-item">Ưa thích</div>
                        <div className="user-dropdown-item">Lịch sử mượn</div>
                        <div className="divider"></div>
                        <div className="user-dropdown-item logout">Đăng xuất</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content Area with Transition */}
              <div className="content-area">
                <div className="view-transition">{renderContent()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Background>
  )
}

export default Home