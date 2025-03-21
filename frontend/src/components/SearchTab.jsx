import React from "react";
import { Container, Row, Col, Table, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // Thay useHistory bằng useNavigate
import "../styles/BookTable.css"; // Đảm bảo đã tạo tệp CSS

const BookTable = () => {
  const navigate = useNavigate(); // Khởi tạo useNavigate hook để chuyển hướng
  const books = [
    {
      id: 1, // Thêm ID cho mỗi cuốn sách
      title: "Don't Make Me Think",
      author: "Steve Krug",
      year: "2000",
      rating: "4.5/5",
      category: "Computer Science",
      status: "Available",
      location: "CS A-15",
      image: "/book.jpg", // Đảm bảo hình ảnh đã có trong thư mục public
    },
    {
      id: 2,
      title: "The Design of Everyday Things",
      author: "Don Norman",
      year: "1988",
      rating: "4.5/5",
      category: "Computer Science",
      status: "Out of stock",
      location: "",
      image: "/book.jpg",
    },
    {
      id: 3,
      title: "Rich Dad Poor Dad",
      author: "Robert T. Kiyosaki",
      year: "1997",
      rating: "4.5/5",
      category: "Financial MGMT",
      status: "Available",
      location: "CS A-15",
      image: "/book.jpg",
    },
  ];

  const handleViewDetails = (id) => {
    // Chuyển hướng đến trang BookDetail với id sách
    navigate(`/book/${id}`);
  };

  return (
    <Container fluid>
      <Row className="my-4">
        <Col>
          <Table striped bordered hover responsive className="book-table">
            <thead>
              <tr className="text-center">
                <th>Tiêu đề</th>
                <th>Đánh giá</th>
                <th>Thể loại</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book, index) => (
                <tr key={book.id}>
                  <td className="d-flex align-items-center justify-content-start">
                    <img
                      src={book.image}
                      alt={book.title}
                      style={{
                        width: "50px",
                        height: "75px",
                        marginRight: "15px",
                        objectFit: "cover",
                      }}
                    />
                    <div>
                      <div>{book.title}</div>
                      <div style={{ fontSize: "12px", color: "#888" }}>
                        {book.author}, {book.year}
                      </div>
                    </div>
                  </td>
                  <td>{book.rating}</td>
                  <td>{book.category}</td>
                  <td className="text-center">
                    <Badge
                      bg={book.status === "Available" ? "success" : "danger"}
                      pill
                      className="status-badge"
                    >
                      {book.status}
                    </Badge>
                  </td>
                  <td className="text-center">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="action-btn"
                      onClick={() => handleViewDetails(book.id)} // Gọi hàm khi bấm "Xem trước"
                    >
                      {"Xem trước"}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};

export default BookTable;
