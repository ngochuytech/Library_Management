"use client"

import { useState } from "react"
import "../styles/SearchTab.css"

const SearchTab = () => {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="search-tab">
      <h2 className="search-title">Tìm kiếm sách</h2>

      <div className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="Nhập tên sách, tác giả hoặc từ khóa..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="search-button">Tìm kiếm</button>
      </div>

      <div className="search-filters">
        <div className="filter-group">
          <label className="filter-label">Thể loại:</label>
          <select className="filter-select">
            <option value="">Tất cả</option>
            <option value="fiction">Tiểu thuyết</option>
            <option value="non-fiction">Phi hư cấu</option>
            <option value="science">Khoa học</option>
            <option value="technology">Công nghệ</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Năm xuất bản:</label>
          <select className="filter-select">
            <option value="">Tất cả</option>
            <option value="2020-2023">2020-2023</option>
            <option value="2010-2019">2010-2019</option>
            <option value="2000-2009">2000-2009</option>
            <option value="before-2000">Trước 2000</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="filter-label">Xếp hạng:</label>
          <select className="filter-select">
            <option value="">Tất cả</option>
            <option value="4-5">4-5 sao</option>
            <option value="3-4">3-4 sao</option>
            <option value="2-3">2-3 sao</option>
            <option value="1-2">1-2 sao</option>
          </select>
        </div>
      </div>

      <div className="search-results">
        <p className="no-results">Nhập từ khóa để tìm kiếm sách...</p>
      </div>
    </div>
  )
}

export default SearchTab

