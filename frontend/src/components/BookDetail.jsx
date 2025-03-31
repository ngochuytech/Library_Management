import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Container,
  Row,
  Col,
  Button,
  Image,
  Badge,
  Dropdown,
} from "react-bootstrap";
import { faBell, faStar } from "@fortawesome/free-solid-svg-icons"; // Import các icon cần thiết
import "../styles/BookDetail.css"; // Tùy chọn: Tạo file CSS để tùy chỉnh thêm

const DetailBook = ({book}) => {
  console.log("Book = ", book);
  
  // Dữ liệu giả lập cho sách (bạn có thể thay bằng dữ liệu từ API)
  // const book = {
  //   title: "Don't Make Me Think",
  //   author: "Steve Krug",
  //   edition: "Second Edition",
  //   year: 2000,
  //   rating: 5.0,
  //   reviews: 25,
  //   readers: 119,
  //   status: "Còn sách",
  //   coverImage: "book.jpg", // Thay bằng URL hình ảnh thực tế
  //   description:
  //     'Steve Krug là một chuyên gia tư vấn về khả năng sử dụng, có hơn 30 năm kinh nghiệm làm việc với các công ty như Apple, Netscape, AOL, Lexus và các khách hàng khác. Ông là tác giả của cuốn sách nổi tiếng "Don\'t Make Me Think", được coi là kinh điển trong lĩnh vực thiết kế trải nghiệm người dùng. Cuốn sách này giúp bạn hiểu cách người dùng thực sự sử dụng website và ứng dụng, đồng thời đưa ra các nguyên tắc thiết kế đơn giản nhưng hiệu quả.',
  // };

  return (
    <Container className="my-5">
      <Row>
        {/* Cột bên trái: Hình bìa và thông tin chính */}
        <Col md={8}>
          <Row>
            {/* Hình bìa sách */}
            <Col md={3}>
              <Image src={book.image.slice(16)} alt={book.title} fluid />
            </Col>

            {/* Thông tin sách */}
            <Col md={9}>
              <h2>{book.title}</h2>
              <p className="text-muted">
                Bởi {book.author}, {book.edition} {book.year}
              </p>

              {/* Đánh giá và số liệu */}
              <div className="d-flex align-items-center mb-2">
                <FontAwesomeIcon icon={faStar} />
                <span className="ms-1">{book.rating} Đánh giá</span>
                <span className="ms-3">{book.reviews} Đánh giá</span>
                <span className="ms-3">{book.readers} Đã đọc</span>
              </div>

              {/* Trạng thái và danh mục */}
              <div className="d-flex align-items-center mb-3">
                <Badge bg="success">{book.status}</Badge>
                <Dropdown className="ms-3">
                  <Dropdown.Toggle
                    variant="outline-secondary"
                    id="dropdown-basic"
                  >
                    Thêm vào
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#/action-1">Đọc sau</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">Yêu thích</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">
                      Danh sách khác
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>

              {/* Nút hành động */}
              <div className="d-flex gap-3">
                <Button variant="primary">Mượn</Button>
                <Button variant="success">Đọc thử</Button>
              </div>
            </Col>
          </Row>
        </Col>

        {/* Cột bên phải: Thông tin tác giả và mô tả */}
        <Col md={4}>
          <h4>Tác giả</h4>
          <h5>{book.author}</h5>
          <p>{book.description}</p>
        </Col>
      </Row>
    </Container>
  );
};

export default DetailBook;
