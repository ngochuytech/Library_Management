import React from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Badge,
  Image,
  Pagination,
  Button,
} from "react-bootstrap";
import {
  faBook,
  faCalendarAlt,
  faCheckCircle,
  faTimesCircle,
  faHistory,
  faSearch,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const History = () => {
  const navigate = useNavigate();

  // Dữ liệu lịch sử mượn sách (mẫu)
  const borrowingHistory = [
    {
      id: 1,
      book: {
        id: 101,
        title: "Don't Make Me Think",
        author: "Steve Krug",
        coverImage: "/book.jpg",
        category: "Công nghệ thông tin",
      },
      borrowDate: "15/10/2023",
      dueDate: "30/10/2023",
      returnDate: "28/10/2023",
      status: "returned", // returned, overdue, borrowing
    },
    {
      id: 2,
      book: {
        id: 102,
        title: "The Design of Everyday Things",
        author: "Don Norman",
        coverImage: "/book.jpg",
        category: "Thiết kế",
      },
      borrowDate: "01/11/2023",
      dueDate: "16/11/2023",
      returnDate: null,
      status: "borrowing",
    },
    {
      id: 3,
      book: {
        id: 103,
        title: "Rich Dad Poor Dad",
        author: "Robert T. Kiyosaki",
        coverImage: "/book.jpg",
        category: "Kinh tế",
      },
      borrowDate: "20/10/2023",
      dueDate: "05/11/2023",
      returnDate: "10/11/2023",
      status: "overdue",
    },
    {
      id: 4,
      book: {
        id: 104,
        title: "Atomic Habits",
        author: "James Clear",
        coverImage: "/book.jpg",
        category: "Phát triển bản thân",
      },
      borrowDate: "05/11/2023",
      dueDate: "20/11/2023",
      returnDate: "18/11/2023",
      status: "returned",
    },
  ];

  // Hàm hiển thị trạng thái
  const renderStatus = (status) => {
    switch (status) {
      case "returned":
        return (
          <Badge bg="success" className="d-flex align-items-center">
            <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
            Đã trả
          </Badge>
        );
      case "borrowing":
        return (
          <Badge bg="primary" className="d-flex align-items-center">
            <FontAwesomeIcon icon={faBook} className="me-1" />
            Đang mượn
          </Badge>
        );
      case "overdue":
        return (
          <Badge bg="danger" className="d-flex align-items-center">
            <FontAwesomeIcon icon={faTimesCircle} className="me-1" />
            Trả trễ
          </Badge>
        );
      default:
        return <Badge bg="secondary">Unknown</Badge>;
    }
  };

  // Hàm xem chi tiết sách
  const handleViewDetail = (bookId) => {
    navigate(`/books/${bookId}`);
  };

  return (
    <Container className="my-5">
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h4 className="mb-0">
                <FontAwesomeIcon
                  icon={faHistory}
                  className="text-primary me-2"
                />
                Lịch sử mượn sách
              </h4>
              <div className="d-flex">
                <Button variant="outline-secondary" size="sm" className="me-2">
                  <FontAwesomeIcon icon={faSearch} className="me-1" />
                  Tìm kiếm
                </Button>
                <Button variant="outline-secondary" size="sm">
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                  Lọc theo ngày
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {borrowingHistory.length === 0 ? (
                <div className="text-center py-5">
                  <FontAwesomeIcon
                    icon={faHistory}
                    className="text-muted mb-3"
                    style={{ fontSize: "3rem" }}
                  />
                  <h5>Không có lịch sử mượn sách</h5>
                  <p className="text-muted">
                    Bạn chưa mượn sách nào từ thư viện
                  </p>
                  <Button variant="primary" className="mt-3">
                    Mượn sách ngay
                  </Button>
                </div>
              ) : (
                <>
                  <Table hover responsive className="mb-0">
                    <thead>
                      <tr>
                        <th>Sách</th>
                        <th>Ngày mượn</th>
                        <th>Hạn trả</th>
                        <th>Ngày trả</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {borrowingHistory.map((record) => (
                        <tr key={record.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <Image
                                src={record.book.coverImage}
                                alt={record.book.title}
                                width={50}
                                className="me-3 rounded shadow-sm"
                              />
                              <div>
                                <h6 className="mb-1">{record.book.title}</h6>
                                <p className="text-muted small mb-0">
                                  {record.book.author}
                                </p>
                                <Badge bg="light" text="dark" className="mt-1">
                                  {record.book.category}
                                </Badge>
                              </div>
                            </div>
                          </td>
                          <td>{record.borrowDate}</td>
                          <td>{record.dueDate}</td>
                          <td>{record.returnDate || "-"}</td>
                          <td>{renderStatus(record.status)}</td>
                          <td>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleViewDetail(record.book.id)}
                            >
                              <FontAwesomeIcon icon={faEye} className="me-1" />
                              Xem chi tiết
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  {/* Phân trang */}
                  <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                      <Pagination.First />
                      <Pagination.Prev />
                      <Pagination.Item active>{1}</Pagination.Item>
                      <Pagination.Item>{2}</Pagination.Item>
                      <Pagination.Item>{3}</Pagination.Item>
                      <Pagination.Next />
                      <Pagination.Last />
                    </Pagination>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default History;
