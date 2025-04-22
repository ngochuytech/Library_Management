import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Image,
  Button,
  Badge,
  Spinner,
  Alert,
  ListGroup,
} from "react-bootstrap";
import {
  faPhone,
  faEnvelope,
  faUserCircle,
  faHistory,
  faToggleOn,
  faToggleOff,
  faTrash,
  faArrowLeft,
  faCalendarAlt,
  faBook,
  faIdCard,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Mock data
const mockUserDetail = {
  id: 1,
  name: "Nguyễn Văn A",
  phone: "0912345678",
  email: "nguyenvana@example.com",
  avatar: "/avatar.jpg",
  bio: "Là một người đọc sách đam mê, yêu thích các thể loại khoa học viễn tưởng và lịch sử. Thường xuyên tham gia các câu lạc bộ đọc sách và đóng góp ý kiến xây dựng cho thư viện.",
  status: "Active",
  joinDate: "15/03/2022",
  lastActive: "2 giờ trước",
  borrowedBooks: 12,
};

const AdminUsersDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    setTimeout(() => {
      if (parseInt(id) === 1) {
        setUser(mockUserDetail);
      } else {
        setError(`Không tìm thấy người dùng với ID: ${id}`);
      }
      setLoading(false);
    }, 500);
  }, [id]);

  const handleViewHistory = () => {
    navigate("/admin", {
      state: {
        activeView: "manageBorrows",
        userId: user.id,
      },
    });
  };

  const handleToggleStatus = () => {
    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    setUser((prevUser) => ({ ...prevUser, status: newStatus }));
  };

  const handleDeleteUser = () => {
    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa người dùng ${user.name}?`
    );
    if (confirmDelete) {
      alert(`Đã xóa người dùng ID: ${user.id}`);
      navigate("/admin/users");
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center min-vh-80">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger" className="shadow-sm">
          <Alert.Heading>Lỗi</Alert.Heading>
          <p>{error}</p>
          <Button variant="outline-primary" onClick={() => navigate(-1)}>
            <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
            Quay lại
          </Button>
        </Alert>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="my-5">
        <Alert variant="warning" className="shadow-sm">
          Không tìm thấy thông tin người dùng.
        </Alert>
        <Button variant="outline-primary" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Quay lại
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Button
        variant="outline-primary"
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
        Quay lại danh sách
      </Button>

      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-primary text-white">
          <Row className="align-items-center">
            <Col>
              <h4 className="mb-0">
                <FontAwesomeIcon icon={faUserCircle} className="me-2" />
                Thông tin chi tiết người dùng
              </h4>
            </Col>
            <Col xs="auto">
              <Badge
                bg={user.status === "Active" ? "light" : "secondary"}
                className="text-dark"
              >
                {user.status === "Active" ? "HOẠT ĐỘNG" : "VÔ HIỆU HÓA"}
              </Badge>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          <Row>
            {/* Left Column - Avatar and Stats */}
            <Col md={4} className="mb-4 mb-md-0">
              <div className="text-center mb-4">
                <Image
                  src={user.avatar || "/default-avatar.jpg"}
                  alt={`${user.name}'s avatar`}
                  roundedCircle
                  fluid
                  className="border border-3 border-primary shadow"
                  style={{
                    width: "180px",
                    height: "180px",
                    objectFit: "cover",
                  }}
                />
                <h3 className="mt-3">{user.name}</h3>
              </div>

              <ListGroup variant="flush" className="shadow-sm">
                <ListGroup.Item>
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="me-2 text-muted"
                  />
                  <strong>Ngày tham gia:</strong> {user.joinDate}
                </ListGroup.Item>
                <ListGroup.Item>
                  <FontAwesomeIcon icon={faBook} className="me-2 text-muted" />
                  <strong>Sách đã mượn:</strong> {user.borrowedBooks}
                </ListGroup.Item>
                <ListGroup.Item>
                  <FontAwesomeIcon
                    icon={faIdCard}
                    className="me-2 text-muted"
                  />
                  <strong>ID người dùng:</strong> {user.id}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            {/* Right Column - User Details */}
            <Col md={8}>
              <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Thông tin liên hệ</h5>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="me-2 text-primary"
                      />
                      <strong>Số điện thoại:</strong>{" "}
                      {user.phone || "Chưa cập nhật"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="me-2 text-primary"
                      />
                      <strong>Email:</strong> {user.email || "Chưa cập nhật"}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        className="me-2 text-primary"
                      />
                      <strong>Hoạt động cuối:</strong> {user.lastActive}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>

              <Card className="shadow-sm">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Giới thiệu</h5>
                </Card.Header>
                <Card.Body>
                  <p className="text-muted" style={{ whiteSpace: "pre-wrap" }}>
                    {user.bio ||
                      "Người dùng chưa cập nhật thông tin giới thiệu."}
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>

        <Card.Footer className="d-flex justify-content-between bg-light">
          <Button
            variant="outline-info"
            onClick={handleViewHistory}
            className="d-flex align-items-center"
          >
            <FontAwesomeIcon icon={faHistory} className="me-2" />
            Lịch sử mượn sách
          </Button>

          <div>
            <Button
              variant={
                user.status === "Active" ? "outline-warning" : "outline-success"
              }
              onClick={handleToggleStatus}
              className="me-2"
            >
              <FontAwesomeIcon
                icon={user.status === "Active" ? faToggleOff : faToggleOn}
                className="me-2"
              />
              {user.status === "Active" ? "Vô hiệu hóa" : "Kích hoạt"}
            </Button>

            <Button variant="outline-danger" onClick={handleDeleteUser}>
              <FontAwesomeIcon icon={faTrash} className="me-2" />
              Xóa người dùng
            </Button>
          </div>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default AdminUsersDetail;
