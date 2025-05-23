import React from "react";
import {
  Container,
  Table,
  Button,
  Badge,
  Card,
  ProgressBar,
  Pagination,
} from "react-bootstrap";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles/SearchTab.css";

const SearchTab = ({ searchResult, totalPages, currentPage, onPageChange, handleBookClick }) => {
  const getCategoryGradient = (categoryName) => {
    const gradientMap = {
          "Tiểu thuyết": "linear-gradient(135deg, #18C4FF 0%, #0A3D5F 100%)",

          "Khoa học": "linear-gradient(135deg, #18C4FF 0%, #0A3D5F 100%)",
      
          "Lịch sử": "linear-gradient(135deg, #18C4FF 0%, #0A3D5F 100%)",
      
          "Tâm lý": "linear-gradient(135deg, #18C4FF 0%, #0A3D5F 100%)",
      
          "Kinh tế": "linear-gradient(135deg, #18C4FF 0%, #0A3D5F 100%)",
      
          "Văn học": "linear-gradient(135deg, #18C4FF 0%, #0A3D5F 100%)",
      
          "Kỹ năng": "linear-gradient(135deg, #18C4FF 0%, #0A3D5F 100%)",
      
          "Triết học": "linear-gradient(135deg, #18C4FF 0%, #0A3D5F 100%)",
      
          "Nghệ thuật": "linear-gradient(135deg, #18C4FF 0%, #0A3D5F 100%)",
      
          "Tôn giáo": "linear-gradient(135deg, #18C4FF 0%, #0A3D5F 100%)",
      
          "Thiếu nhi": "linear-gradient(135deg, #18C4FF 0%, #0A3D5F 100%)",
      
          "Công nghệ thông tin": "linear-gradient(135deg, #18C4FF 0%, #0A3D5F 100%)",
    };
    return gradientMap[categoryName] || "linear-gradient(135deg, #6c757d 0%, #495057 100%)";
  };

  const getProgressBarVariant = (available, total) => {
    const ratio = available / total;
    if (ratio === 0) return "danger";
    if (ratio <= 0.25) return "danger";
    if (ratio <= 0.5) return "warning";
    if (ratio <= 0.75) return "info";
    return "success";
  };

  return (
    <Container fluid className="search-tab-container">
      <Card className="search-tab-card">
        <Table hover responsive className="search-tab-table">
          <colgroup>
            <col style={{ width: "40%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>
          <thead className="search-tab-thead">
            <tr>
              <th className="search-tab-th">Tiêu đề</th>
              <th className="search-tab-th">Thể loại</th>
              <th className="search-tab-th search-tab-th-center">Trạng thái</th>
              <th className="search-tab-th search-tab-th-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {searchResult.map((book) => (
              <tr key={book.id} className="search-tab-tbody-tr">
                <td className="search-tab-td-title">
                  <div className="search-tab-book-info-container">
                    <img
                      src={`image/${book.image}`}
                      alt={book.title}
                      className="search-tab-book-image"
                    />
                    <div className="search-tab-book-text-details">
                      <h5 className="search-tab-book-title">{book.title}</h5>
                      <div className="search-tab-book-meta">
                        {book.author.name} • {book.publication_date}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="search-tab-td-category">
                  <div className="search-tab-category-badges-container">
                    {book.category.map((category, index) => (
                      <Badge
                        key={index}
                        className="search-tab-category-badge"
                        style={{
                          background: getCategoryGradient(category.name),
                        }}
                      >
                        {category.name}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="search-tab-td-status">
                  <div className="search-tab-status-container">
                    <Badge
                      pill
                      className="search-tab-status-badge"
                      style={{
                        background:
                          book.avaliable > 0
                            ? "linear-gradient(to right, #00b09b, #96c93d)"
                            : "linear-gradient(to right, #9ca3af, #4b5563)",
                      }}
                    >
                      {book.avaliable > 0 ? "Còn sách" : "Hết sách"}
                    </Badge>
                    {book.avaliable > 0 && (
                      <ProgressBar
                        now={(book.avaliable / book.quantity) * 100}
                        className="search-tab-progress-bar"
                        variant={getProgressBarVariant(book.avaliable, book.quantity)}
                      />
                    )}
                    <div className="search-tab-availability-text">
                      {book.avaliable > 0
                        ? `${book.avaliable}/${book.quantity} có sẵn`
                        : "Tạm hết sách"}
                    </div>
                  </div>
                </td>
                <td className="search-tab-td-action">
                  <button className="search-tab-action-button" onClick={() => handleBookClick(book)}>
                    <FontAwesomeIcon icon={faEye} />
                    Xem chi tiết
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {totalPages > 0 && (
        <div className="search-tab-pagination-container">
          <Pagination className="search-tab-pagination">
            <Pagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1} />
            <Pagination.Prev
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            />
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              const maxPagesToShow = 5;
              const halfPagesToShow = Math.floor(maxPagesToShow / 2);
              
              let showPage = false;
              if (totalPages <= maxPagesToShow) {
                showPage = true;
              } else {
                if (currentPage <= halfPagesToShow) {
                  showPage = pageNumber <= maxPagesToShow - 2 || pageNumber === totalPages || pageNumber === totalPages -1 ;
                } else if (currentPage >= totalPages - halfPagesToShow) {
                  showPage = pageNumber >= totalPages - (maxPagesToShow - 3) || pageNumber === 1 || pageNumber === 2;
                } else {
                  showPage = Math.abs(currentPage - pageNumber) <= halfPagesToShow -2 || pageNumber === 1 || pageNumber === totalPages;
                }
              }

              if(showPage){
                return (
                  <Pagination.Item
                    key={pageNumber}
                    active={currentPage === pageNumber}
                    onClick={() => onPageChange(pageNumber)}
                  >
                    {pageNumber}
                  </Pagination.Item>
                );
              } else if (
                (currentPage <= halfPagesToShow && pageNumber === maxPagesToShow -1 ) ||
                (currentPage >= totalPages - halfPagesToShow && pageNumber === totalPages - (maxPagesToShow -2) ) ||
                (Math.abs(currentPage - pageNumber) === halfPagesToShow -1 && pageNumber !==1 && pageNumber !== totalPages)
              ) {
                if (!this[`ellipsis_${pageNumber < currentPage ? 'before' : 'after'}`]) {
                  this[`ellipsis_${pageNumber < currentPage ? 'before' : 'after'}`] = true;
                  return <Pagination.Ellipsis key={`ellipsis-${pageNumber < currentPage ? 'before' : 'after'}`} disabled />;
                }
              }
              return null;
            }).filter(item => item !== null) 
            .map((item, idx, arr) => {
                if (item && item.type === Pagination.Ellipsis) {
                    const position = item.key.split('-')[1];
                    if (position === 'before') this.ellipsis_before = false;
                    if (position === 'after') this.ellipsis_after = false;
                }
                return item;
            })}


            <Pagination.Next
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
            <Pagination.Last
              onClick={() => onPageChange(totalPages)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
        </div>
      )}
    </Container>
  );
};

export default SearchTab;

