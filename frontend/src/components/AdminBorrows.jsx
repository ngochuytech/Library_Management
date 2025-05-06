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
  Tabs,
  Tab,
} from "react-bootstrap";
import {
  faBook,
  faCalendarAlt,
  faCheckCircle,
  faTimesCircle,
  faHistory,
  faSearch,
  faEye,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const LibraryHistoryAndRequests = () => {
  const navigate = useNavigate();

  // Borrowing history data
  const borrowingHistory = [
    {
      id: 1,
      id_User: 201,
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
      status: "returned",
    },
    {
      id: 2,
      id_User: 202,
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
      id_User: 203,
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
      id_User: 204,
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

  // Book borrowing requests data
  const borrowingRequests = [
    {
      id: 1,
      book: {
        id: 105,
        title: "Clean Code",
        coverImage: "/book.jpg",
      },
      user: {
        id: 201,
        name: "Nguyễn Văn A",
        avatar: "/user.jpg",
      },
      borrowDate: "10/11/2023",
      dueDate: "25/11/2023",
      status: "pending",
    },
    {
      id: 2,
      book: {
        id: 106,
        title: "Thinking, Fast and Slow",
        coverImage: "/book.jpg",
      },
      user: {
        id: 202,
        name: "Trần Thị B",
        avatar: "/user.jpg",
      },
      borrowDate: "12/11/2023",
      dueDate: "27/11/2023",
      status: "pending",
    },
  ];

  // Render status for history
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

  // Handle view detail for history
  const handleViewDetail = (borrowId) => {
    navigate(`/borrowDetail/${borrowId}`);
  };

  // Handle view request detail
  const handleViewRequestDetail = (requestId) => {
    navigate(`/requestDetail/${requestId}`);
  };

  // Handle approve request
  const handleApproveRequest = (requestId) => {
    console.log(`Approved request ID: ${requestId}`);
    // Add logic to update request status to approved
  };

  // Handle reject request
  const handleRejectRequest = (requestId) => {
    console.log(`Rejected request ID: ${requestId}`);
    // Add logic to update request status to rejected
  };

  return (
    <Container className="my-5">
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <Tabs
                defaultActiveKey="history"
                id="library-tabs"
                className="mb-3"
              >
                <Tab
                  eventKey="history"
                  title={
                    <span>
                      <FontAwesomeIcon icon={faHistory} className="me-2" />
                      Lịch sử
                    </span>
                  }
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">
                      <FontAwesomeIcon
                        icon={faHistory}
                        className="text-primary me-2"
                      />
                      Lịch sử mượn sách
                    </h4>
                    <div className="d-flex">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="me-2"
                      >
                        <FontAwesomeIcon icon={faSearch} className="me-1" />
                        Tìm kiếm
                      </Button>
                      <Button variant="outline-secondary" size="sm">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="me-1"
                        />
                        Lọc theo ngày
                      </Button>
                    </div>
                  </div>
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
                                    <h6 className="mb-1">
                                      {record.book.title}
                                    </h6>
                                    <p className="text-muted small mb-0">
                                      {record.book.author}
                                    </p>
                                    <Badge
                                      bg="light"
                                      text="dark"
                                      className="mt-1"
                                    >
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
                                  onClick={() => handleViewDetail(record.id)}
                                >
                                  <FontAwesomeIcon
                                    icon={faEye}
                                    className="me-1"
                                  />
                                  Xem chi tiết
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
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
                </Tab>
                <Tab
                  eventKey="requests"
                  title={
                    <span>
                      <FontAwesomeIcon icon={faBook} className="me-2" />
                      Yêu cầu
                    </span>
                  }
                >
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="mb-0">
                      <FontAwesomeIcon
                        icon={faBook}
                        className="text-primary me-2"
                      />
                      Yêu cầu mượn sách
                    </h4>
                    <div className="d-flex">
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        className="me-2"
                      >
                        <FontAwesomeIcon icon={faSearch} className="me-1" />
                        Tìm kiếm
                      </Button>
                      <Button variant="outline-secondary" size="sm">
                        <FontAwesomeIcon
                          icon={faCalendarAlt}
                          className="me-1"
                        />
                        Lọc theo ngày
                      </Button>
                    </div>
                  </div>
                  {borrowingRequests.length === 0 ? (
                    <div className="text-center py-5">
                      <FontAwesomeIcon
                        icon={faBook}
                        className="text-muted mb-3"
                        style={{ fontSize: "3rem" }}
                      />
                      <h5>Không có yêu cầu mượn sách</h5>
                      <p className="text-muted">
                        Hiện tại không có yêu cầu mượn sách nào
                      </p>
                    </div>
                  ) : (
                    <>
                      <Table hover responsive className="mb-0">
                        <thead>
                          <tr>
                            <th>Sách</th>
                            <th>Người yêu cầu</th>
                            <th>Ngày mượn</th>
                            <th>Hạn trả</th>
                            <th>Thao tác</th>
                          </tr>
                        </thead>
                        <tbody>
                          {borrowingRequests.map((request) => (
                            <tr key={request.id}>
                              <td>
                                <div className="d-flex align-items-center">
                                  <Image
                                    src={request.book.coverImage}
                                    alt={request.book.title}
                                    width={50}
                                    className="me-3 rounded shadow-sm"
                                  />
                                  <div>
                                    <h6 className="mb-1">
                                      {request.book.title}
                                    </h6>
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="d-flex align-items-center">
                                  <Image
                                    src={request.user.avatar}
                                    alt={request.user.name}
                                    width={40}
                                    className="me-3 rounded-circle shadow-sm"
                                  />
                                  <div>
                                    <h6 className="mb-1">
                                      {request.user.name}
                                    </h6>
                                  </div>
                                </div>
                              </td>
                              <td>{request.borrowDate}</td>
                              <td>{request.dueDate}</td>
                              <td>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="me-2"
                                  onClick={() => handleViewDetail(request.id)}
                                >
                                  <FontAwesomeIcon
                                    icon={faEye}
                                    className="me-1"
                                  />
                                  Xem
                                </Button>
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  className="me-2"
                                  onClick={() =>
                                    handleApproveRequest(request.id)
                                  }
                                >
                                  <FontAwesomeIcon
                                    icon={faCheck}
                                    className="me-1"
                                  />
                                  Duyệt
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() =>
                                    handleRejectRequest(request.id)
                                  }
                                >
                                  <FontAwesomeIcon
                                    icon={faTimes}
                                    className="me-1"
                                  />
                                  Từ chối
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
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
                </Tab>
              </Tabs>
            </Card.Header>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LibraryHistoryAndRequests;
