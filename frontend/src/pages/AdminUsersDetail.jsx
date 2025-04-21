// Dữ liệu giả lập cho người dùng có id = 1
// Removed duplicate declaration of mockUserDetail
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
} from "react-bootstrap";
import {
  faPhone,
  faEnvelope,
  faUserCircle,
  faHistory,
  faToggleOn,
  faToggleOff,
  faTrash,
  faArrowLeft, // Icon nút quay lại
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// Dữ liệu giả lập (có thể thay thế bằng API call sau này)
const mockUserDetail = {
  id: 1,
  name: "Nguyễn Văn A",
  phone: "0912345678",
  email: "nguyenvana@example.com",
  avatar: "/avatar.jpg", // Đảm bảo ảnh này có trong thư mục public hoặc thay bằng URL
  bio: "Là một người đọc sách đam mê, yêu thích các thể loại khoa học viễn tưởng và lịch sử. Thường xuyên tham gia các câu lạc bộ đọc sách và đóng góp ý kiến xây dựng cho thư viện.",
  status: "Active",
};

const AdminUsersDetail = () => {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate(); // Để điều hướng, ví dụ: nút quay lại

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Giả lập việc fetch dữ liệu người dùng dựa trên id
  useEffect(() => {
    setLoading(true);
    setError(null);
    // Giả lập API call
    setTimeout(() => {
      // Trong ứng dụng thực tế, bạn sẽ gọi API ở đây:
      // fetch(`/api/users/${id}`)
      //   .then(res => res.json())
      //   .then(data => setUser(data))
      //   .catch(err => setError("Không thể tải dữ liệu người dùng"))
      //   .finally(() => setLoading(false));

      // Sử dụng dữ liệu tĩnh cho id = 1
      if (parseInt(id) === 1) {
        setUser(mockUserDetail);
      } else {
        setError(`Không tìm thấy người dùng với ID: ${id}`);
      }
      setLoading(false);
    }, 500); // Giả lập độ trễ mạng
  }, [id]); // Dependency array: chạy lại effect khi id thay đổi

  // --- Placeholder Functions for Buttons ---
  const handleViewHistory = () => {
    alert(
      `Chức năng xem lịch sử mượn sách cho user ID: ${user?.id} (chưa cài đặt)`
    );
    // navigate(`/admin/users/${user?.id}/borrowing-history`); // Ví dụ điều hướng
  };

  const handleToggleStatus = () => {
    // Trong thực tế, bạn sẽ gọi API để cập nhật trạng thái
    // và cập nhật lại state 'user'
    const newStatus = user.status === "Active" ? "Inactive" : "Active";
    alert(
      `Chức năng đổi trạng thái thành ${newStatus} cho user ID: ${user?.id} (chưa cài đặt API)`
    );
    // Giả lập cập nhật UI (cần API để lưu trữ)
    setUser((prevUser) => ({ ...prevUser, status: newStatus }));
  };

  const handleDeleteUser = () => {
    // Thường sẽ hiển thị modal xác nhận trước khi xóa
    alert(`Chức năng xóa user ID: ${user?.id} (chưa cài đặt)`);
    // Gọi API xóa rồi điều hướng về trang danh sách:
    // navigate('/admin/users');
  };
  // --- End Placeholder Functions ---

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Quay lại
        </Button>
      </Container>
    );
  }

  if (!user) {
    // Trường hợp không loading, không error nhưng không có user (ít xảy ra với logic hiện tại)
    return (
      <Container className="my-5">
        <Alert variant="warning">Không tìm thấy thông tin người dùng.</Alert>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Quay lại
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Button variant="light" className="mb-3" onClick={() => navigate(-1)}>
        <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
        Quay lại danh sách
      </Button>
      <Card className="shadow-sm">
        <Card.Header className="bg-light">
          <Row className="align-items-center">
            <Col>
              <h3 className="mb-0">
                <FontAwesomeIcon
                  icon={faUserCircle}
                  className="me-2 text-primary"
                />
                Thông tin chi tiết: {user.name}
              </h3>
            </Col>
            <Col xs="auto">
              <Badge bg={user.status === "Active" ? "success" : "secondary"}>
                {user.status === "Active" ? "Active" : "Inactive"}
              </Badge>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Row>
            {/* Cột Ảnh đại diện */}
            <Col md={4} className="text-center mb-3 mb-md-0">
              <Image
                src={user.avatar || "/default-avatar.jpg"} // Sử dụng ảnh mặc định nếu không có avatar
                alt={`Ảnh đại diện của ${user.name}`}
                roundedCircle
                fluid
                style={{ width: "200px", height: "200px", objectFit: "cover" }}
                className="shadow-sm border"
              />
            </Col>

            {/* Cột Thông tin chi tiết */}
            <Col md={8}>
              <h4>{user.name}</h4>
              <hr />
              <p>
                <FontAwesomeIcon icon={faPhone} className="me-2 text-muted" />
                <strong>Số điện thoại:</strong> {user.phone || "Chưa cập nhật"}
              </p>
              <p>
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="me-2 text-muted"
                />
                <strong>Email:</strong> {user.email || "Chưa cập nhật"}
              </p>

              <h5 className="mt-4">Tiểu sử</h5>
              <p style={{ whiteSpace: "pre-wrap" }}>
                {user.bio || "Chưa có thông tin tiểu sử."}
              </p>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer className="text-end bg-light">
          <Button
            variant="info"
            className="me-2"
            onClick={handleViewHistory}
            title="Xem lịch sử mượn trả sách của người dùng này"
          >
            <FontAwesomeIcon icon={faHistory} className="me-2" />
            Lịch sử mượn sách
          </Button>
          <Button
            variant={user.status === "Active" ? "warning" : "success"}
            className="me-2"
            onClick={handleToggleStatus}
            title={
              user.status === "Active"
                ? "Vô hiệu hóa tài khoản này"
                : "Kích hoạt lại tài khoản này"
            }
          >
            <FontAwesomeIcon
              icon={user.status === "Active" ? faToggleOff : faToggleOn}
              className="me-2"
            />
            {user.status === "Active" ? "Vô hiệu hóa" : "Kích hoạt"}
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteUser}
            title="Xóa vĩnh viễn người dùng này"
          >
            <FontAwesomeIcon icon={faTrash} className="me-2" />
            Xóa người dùng
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default AdminUsersDetail;
