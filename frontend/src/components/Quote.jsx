import React, { useEffect, useState } from "react";
import "../styles/Quote.css";

const BASE_URL = import.meta.env.VITE_API_URL

const Quote = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch(`${BASE_URL}/books/api/quote`)
      .then((res) => res.json())
      .then((data) => setBooks(data.results || data))
      .catch((err) => setBooks([]));
  }, []);

  return (
    <div className="quote-container">
      <div className="quote-content">
        <h2 className="quote-title">Trích dẫn hôm nay</h2>
        <p className="quote-text">
          "Sách còn chứa nhiều kho báu hơn tất cả chiến lợi phẩm của cướp biển trên Đảo giấu vàng."
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
        <div className="new-books-title">Sách mới ra</div>
        <div className="book-thumbnails">
          {books.map((book, idx) => (
            <img
              key={book.id || idx}
              src={`/image/${book.image}`}
              alt={book.title}
              className="book-thumbnail"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Quote;