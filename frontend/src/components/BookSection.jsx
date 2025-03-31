import React from "react";
import "../styles/BookSection.css";

const BookCard = ({ book, onClick }) => {
  // Generate star rating
  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(book.rating);
    const hasHalfStar = book.rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`full-${i}`} className="star full-star">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half" className="star half-star">★</span>);
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<span key={`empty-${i}`} className="star empty-star">☆</span>);
    }
    
    return stars;
  };

  return (
    <div className="book-card" onClick={() => onClick(book)}>
      <img
        src={book.image || "/placeholder.svg?height=200&width=140"}
        alt={book.title}
        className="book-cover"
      />
      <div className="book-details">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">
          {book.author}, {book.year}
        </p>
        <div className="book-rating">
          {renderStars()}
          <span className="rating-value">{book.rating.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

const BookSection = ({ title, books, onBookClick }) => {
  return (
    <div className="book-section">
      <div className="section-header">
        <h3 className="section-title">{title}</h3>
        <button className="view-all-button">Xem tất cả</button>
      </div>
      
      <div className="books-container">
        {books.map((book, index) => (
          <BookCard 
            key={index}
            book={book}
            onClick={onBookClick}
          />
        ))}
      </div>
    </div>
  );
};

export default BookSection;
