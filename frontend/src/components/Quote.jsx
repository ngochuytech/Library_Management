import "../styles/Quote.css"

const Quote = () => {
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
          <img src="/book.jpg" alt="Holy Bible" className="book-thumbnail" />
          <img src="/book.jpg" alt="Harry Potter" className="book-thumbnail" />
          <img src="/book.jpg" alt="Lean UX" className="book-thumbnail" />
          <img src="/book.jpg" alt="Don't Make Me Think" className="book-thumbnail" />
        </div>
      </div>
    </div>
  )
}

export default Quote

