import React from "react";
import { Card, Col, Row } from "react-bootstrap";
import styles from "../styles/Quote.module.css"; // Import CSS Module

const containerStyle = {
  height: "100%",
  display: "flex",
  flexWrap: "nowrap",
  overflow: "hidden",
  padding: "0",
  backgroundColor: "none",
  borderRadius: "8px", // Thêm góc bo tròn
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Thêm bóng đổ nhẹ
  border: "2px solid rgba(255, 255, 255, 0.1)", // Thêm viền
};
const Quote = ({ books, handleCardClick }) => (
  <Card
    className={`${styles.quoteCard} text-white`} // Áp dụng CSS Module
    style={{ border: "none", height: "180px", backgroundColor: "none" }} // Thêm một số CSS inline
  >
    <Card.Body className={`${styles.dFlex} ${styles.justifyContentBetween}`}>
      {/* Left side for Quote */}
      <Col
        md={6}
        className={`${styles.p0} ${styles.bgPrimary} ${styles.customCol}`}
      >
        <h5>Trích dẫn hôm nay</h5>
        <Card.Text>
          "Sách còn chứa nhiều kho báu hơn tất cả chiến lợi phẩm của cướp biển
          trên Đảo giấu vàng." - Walt Disney
        </Card.Text>
      </Col>

      {/* Right side for New Books (Only Image) */}
      <Col md={6} className={styles.p0}>
        <Row
          className={`${styles.dFlex} ${styles.alignItemsCenter}`}
          style={{ height: "148px", overflow: "hidden", padding: "0" }}
        >
          {/* Cột cho tiêu đề */}
          <Col
            md={3}
            className={`${styles.dFlex} ${styles.justifyContentStart} ${styles.colTitle}`}
            style={{ height: "148px", padding: "0", width: "100px" }}
          >
            <h5 className={styles.verticalTitle}>Sách mới ra</h5>
          </Col>

          {/* Cột cho các sách mới */}
          <Col
            md={9}
            className={styles.p0}
            style={{ height: "148px", padding: "0" }}
          >
            <Row
              className={`${styles.dFlex} ${styles.justifyContentStart}`}
              style={containerStyle}
            >
              {books.map((book, index) => (
                <Col
                  xs={6}
                  sm={4}
                  md={3}
                  key={index}
                  className={`${styles.dFlex} ${styles.justifyContentCenter} mb-2`}
                  style={{
                    height: "100%", // Đảm bảo các phần tử có chiều cao đầy đủ
                    padding: "0", // Loại bỏ padding không cần thiết
                    backgroundColor: "none", // Loại bỏ màu nền
                  }}
                >
                  <Card
                    className={styles.bookCard}
                    onClick={() => handleCardClick(book)}
                    style={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center", // Center horizontally
                      alignItems: "center", // Center vertically
                      overflow: "hidden", // Ẩn bất kỳ phần nào bị tràn ra ngoài
                      border: "none", // Loại bỏ viền
                      width: "90%",
                      backgroundColor: "#eef2f7",
                    }}
                  >
                    <Card.Img
                      variant="top"
                      src={book.image.slice(16)}
                      className={`${styles.cardImg} rounded-3`}
                      style={{
                        objectFit: "cover",
                        height: "100px", // Đảm bảo chiều cao của ảnh vừa vặn
                        width: "100%", // Đảm bảo ảnh không bị kéo dài quá
                      }}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
      </Col>
    </Card.Body>
  </Card>
);

export default Quote;
