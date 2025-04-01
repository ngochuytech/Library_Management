"use client"

import { useState } from "react"
import "../styles/MyBookshelf.css"

const MyBookshelf = ({ books }) => {
  const [activeTab, setActiveTab] = useState("all")

  // Filter books based on active tab (in a real app, you'd have more data to filter by)
  const filteredBooks = books

  return (
    <div className="my-bookshelf">
      <h2 className="bookshelf-title">Giá sách của tôi</h2>

      <div className="bookshelf-tabs">
        <button className={`tab-button ${activeTab === "all" ? "active" : ""}`} onClick={() => setActiveTab("all")}>
          Tất cả
        </button>
        <button
          className={`tab-button ${activeTab === "reading" ? "active" : ""}`}
          onClick={() => setActiveTab("reading")}
        >
          Đang đọc
        </button>
        <button
          className={`tab-button ${activeTab === "completed" ? "active" : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          Đã đọc xong
        </button>
        <button
          className={`tab-button ${activeTab === "wishlist" ? "active" : ""}`}
          onClick={() => setActiveTab("wishlist")}
        >
          Muốn đọc
        </button>
      </div>

      <div className="bookshelf-stats">
        <div className="stat-card">
          <div className="stat-value">12</div>
          <div className="stat-label">Tổng số sách</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">3</div>
          <div className="stat-label">Đang đọc</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">7</div>
          <div className="stat-label">Đã đọc xong</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">2</div>
          <div className="stat-label">Muốn đọc</div>
        </div>
      </div>

      <div className="bookshelf-grid">
        {filteredBooks.map((book, index) => (
          <div key={index} className="bookshelf-item">
            <img src={book.image.slice(16) || "/placeholder.svg"} alt={book.title} className="bookshelf-cover" />
            <div className="bookshelf-details">
              <h3 className="bookshelf-book-title">{book.title}</h3>
              <p className="bookshelf-author">{book.author.name}</p>
              <div className="bookshelf-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${Math.floor(Math.random() * 100)}%` }}></div>
                </div>
                <span className="progress-text">Đã đọc 65%</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyBookshelf

