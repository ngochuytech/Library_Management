import React, { useState, useEffect } from "react";
import "../styles/Quote.css";

const BASE_URL = import.meta.env.VITE_API_URL;

const Quote = ({ handleCardClick }) => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/books/api/quote`)
      .then((res) => res.json())
      .then((data) => setBooks(data.results || data))
      .catch((err) => {
        console.error("Failed to fetch quote books:", err);
        setBooks([]);
      });
  }, []);

  return (
    <div className="quote-container">
      <div className="quote-content">
        <h2 className="quote-title"></h2>
        <p className="quote-text" style={{ fontSize: "1.5rem" }}>
          "Sách còn chứa nhiều kho báu hơn tất cả chiến lợi phẩm của cướp biển
          trên Đảo giấu vàng."
        </p>
        <p className="quote-author" style={{ fontSize: "1.5rem" }}>
          -Walt Disney
        </p>
      </div>

      <div className="new-books">
        <div className="new-books-title">Sách nổi bật</div>{" "}
        <div className="book-thumbnails">
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
                onClick={() => {
                  if (handleCardClick) {
                    handleCardClick(book);
                  }
                }}
                style={{ cursor: handleCardClick ? "pointer" : "default" }}
              />
            ))
          ) : (
            <p>Đang tải sách...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quote;
