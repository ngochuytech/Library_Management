import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Badge,
  Card,
  ProgressBar,
  Pagination,
  Dropdown,
} from "react-bootstrap";
import { faStar, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SearchTab = ({ searchResult, totalPages, currentPage, onPageChange, handleBookClick, }) => {

  const renderRatingStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FontAwesomeIcon
        key={i}
        icon={faStar}
        style={{
          color: i < Math.floor(rating) ? "#FFD700" : "#E0E0E0",
          marginRight: "2px",
          fontSize: "0.9rem",
        }}
      />
    ));
  };

  return (
    <Container
      fluid
      style={{
        padding: "0 2rem",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Books Table */}
      <Card
        style={{
          border: "none",
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          marginBottom: "2rem",
          overflow: "hidden",
        }}
      >
        <Table
          hover
          responsive
          style={{
            marginBottom: 0,
            borderCollapse: "separate",
            borderSpacing: "0 10px",
            tableLayout: "fixed", // Thêm thuộc tính này để kiểm soát width cột
          }}
        >
          <colgroup>
            <col style={{ width: "30%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "15%" }} />
            <col style={{ width: "20%" }} />
            <col style={{ width: "20%" }} />
          </colgroup>

          <thead
            style={{
              backgroundColor: "#f8f9fa",
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <tr>
              <th
                style={{
                  padding: "1rem",
                  fontWeight: 600,
                  color: "#495057",
                  borderBottom: "2px solid #e9ecef",
                }}
              >
                Tiêu đề
              </th>
              <th
                style={{
                  padding: "1rem",
                  fontWeight: 600,
                  color: "#495057",
                  borderBottom: "2px solid #e9ecef",
                }}
              >
                Đánh giá
              </th>
              <th
                style={{
                  padding: "1rem",
                  fontWeight: 600,
                  color: "#495057",
                  borderBottom: "2px solid #e9ecef",
                }}
              >
                Thể loại
              </th>
              <th
                style={{
                  padding: "1rem",
                  fontWeight: 600,
                  color: "#495057",
                  borderBottom: "2px solid #e9ecef",
                  textAlign: "center",
                }}
              >
                Trạng thái
              </th>
              <th
                style={{
                  padding: "1rem",
                  fontWeight: 600,
                  color: "#495057",
                  borderBottom: "2px solid #e9ecef",
                  textAlign: "center",
                }}
              >
                Hành động
              </th>
            </tr>
          </thead>
          <tbody>
            {searchResult.map((book) => (
              <tr
                key={book.id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  marginBottom: "10px",
                }}
              >
                <td
                  style={{
                    padding: "1rem",
                    verticalAlign: "middle",
                    borderTop: "1px solid #f1f3f5",
                    borderBottom: "1px solid #f1f3f5",
                    overflow: "hidden",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={`image/${book.image}`}
                      alt={book.title}
                      style={{
                        width: "50px", // Giảm kích thước ảnh
                        height: "70px",
                        objectFit: "cover",
                        borderRadius: "6px",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        marginRight: "0.8rem", // Giảm khoảng cách
                      }}
                    />
                    <div
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <h6
                        style={{
                          marginBottom: "0.25rem",
                          fontWeight: 600,
                          color: "#212529",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {book.title}
                      </h6>
                      <div
                        style={{
                          fontSize: "0.8rem", // Giảm kích thước font
                          color: "#868e96",
                          lineHeight: "1.4",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {book.author.name} • {book.publication_date}
                      </div>
                    </div>
                  </div>
                </td>
                <td
                  style={{
                    padding: "1rem",
                    verticalAlign: "middle",
                    borderTop: "1px solid #f1f3f5",
                    borderBottom: "1px solid #f1f3f5",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ marginBottom: "0.25rem" }}>
                      {renderRatingStars(book.rating)}
                      <span
                        style={{
                          marginLeft: "0.5rem",
                          fontSize: "0.8rem",
                          color: "#868e96",
                        }}
                      >
                        {book.rating.toFixed(1)}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "#adb5bd",
                      }}
                    >
                      {/* {book.reviews} đánh giá */}
                    </div>
                  </div>
                </td>
                <td
                  style={{
                    padding: "1rem",
                    verticalAlign: "middle",
                    borderTop: "1px solid #f1f3f5",
                    borderBottom: "1px solid #f1f3f5",
                  }}
                >
                  {book.category.map((category, index) => (
                    <Badge
                      key={index} 
                      style={{
                        backgroundColor: "#f1f3f5",
                        color: "#030303",
                        fontWeight: "normal",
                        padding: "0.3em 0.6em",
                        borderRadius: "50px",
                        fontSize: "0.8rem",
                        marginRight: "5px",
                      }}
                    >
                      {category.name}
                    </Badge>
                  ))}
                </td>
                <td
                  style={{
                    padding: "1rem",
                    verticalAlign: "middle",
                    borderTop: "1px solid #f1f3f5",
                    borderBottom: "1px solid #f1f3f5",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Badge
                      pill
                      style={{
                        backgroundColor:
                          book.avaliable > 0 ? "#2ecc71" : "#e74c3c",
                        padding: "0.3em 0.6em",
                        marginBottom: "0.4rem",
                        fontWeight: 500,
                        fontSize: "0.8rem",
                      }}
                    >
                      {book.avaliable > 0 ? "Còn hàng" : "Đã hết hàng"}
                    </Badge>
                    {book.avaliable > 0 && (
                      <ProgressBar
                        now={(book.avaliable / book.quantity) * 100}
                        style={{
                          height: "5px",
                          width: "70px",
                          borderRadius: "3px",
                          marginBottom: "0.2rem",
                        }}
                      />
                    )}
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "#868e96",
                      }}
                    >
                      {book.avaliable > 0
                        ? `${book.avaliable} có sẵn`
                        : "Đã hết hàng"}
                    </div>
                  </div>
                </td>
                <td
                  style={{
                    padding: "1rem",
                    verticalAlign: "middle",
                    borderTop: "1px solid #f1f3f5",
                    borderBottom: "1px solid #f1f3f5",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "0.4rem",
                    }}
                  >
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleBookClick(book)}
                      style={{
                        borderColor: "#3498db",
                        color: "#3498db",
                        borderRadius: "6px",
                        padding: "0.3rem 0.6rem",
                        fontSize: "0.8rem",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faEye}
                        style={{
                          marginRight: "0.2rem",
                          fontSize: "0.8rem",
                        }}
                      />
                      Xem
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>

      {/* Pagination */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
        <Pagination>
          <Pagination.First onClick={() => onPageChange(1)} />
          <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
          {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item key={index + 1} active={currentPage === index + 1} onClick={() => onPageChange(index + 1)}>
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
          <Pagination.Last onClick={() => onPageChange(totalPages)} />
        </Pagination>
      </div>
    </Container>
  );
};

export default SearchTab;
