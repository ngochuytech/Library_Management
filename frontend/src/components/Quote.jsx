import React, { useState, useEffect } from "react"; // 1. Import useState và useEffect
import "../styles/Quote.css";

// 2. Định nghĩa lại BASE_URL
const BASE_URL = import.meta.env.VITE_API_URL;

// 5. Chỉ nhận 'handleCardClick' từ props
const Quote = ({ handleCardClick }) => {
  // 3. Thêm lại useState
  const [books, setBooks] = useState([]);

  // 4. Thêm lại useEffect
  useEffect(() => {
    fetch(`${BASE_URL}/books/api/quote`) // Sử dụng endpoint 'quote'
      .then((res) => res.json())
      .then((data) => setBooks(data.results || data)) // Cập nhật state 'books'
      .catch((err) => {
        console.error("Failed to fetch quote books:", err); // Thêm log lỗi
        setBooks([]);
      });
  }, []); // useEffect chỉ chạy một lần khi component mount

  return (
    <div className="quote-container">
      <div className="quote-content">
        <h2 className="quote-title">Trích dẫn hôm nay</h2>
        <p className="quote-text">
          "Sách còn chứa nhiều kho báu hơn tất cả chiến lợi phẩm của cướp biển
          trên Đảo giấu vàng."
        </p>
        <p className="quote-author">-Walt Disney</p>

        <div className="quote-dots">
          <div className="dot active"></div>
          <div className="dot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div>
      </div>

      <div className="new-books">
        <div className="new-books-title">Sách nổi bật</div>{" "}
        {/* Có thể đổi title cho phù hợp với /quote */}
        <div className="book-thumbnails">
          {/* 6. Vẫn sử dụng 'books' từ state */}
          {books && books.length > 0 ? (
            books.map((book, idx) => (
              <img
                key={book.id || idx}
                src={
                  (book.image && book.image.startsWith("http")
                    ? book.image
                    : `/image/${book.image}`) ||
                  "https://via.placeholder.com/100x150?text=S%C3%A1ch"
                }
                alt={book.title || "Book cover"}
                className="book-thumbnail"
                // Vẫn sử dụng handleCardClick từ props
                onClick={() => {
                  if (handleCardClick) {
                    handleCardClick(book);
                  }
                }}
                style={{ cursor: handleCardClick ? "pointer" : "default" }}
              />
            ))
          ) : (
            <p>Đang tải sách...</p> // Thay đổi thông báo
          )}
        </div>
      </div>
    </div>
  );
};

export default Quote;
