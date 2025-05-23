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
  Modal,
  Table,
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
  faSignInAlt,
  faBook,
  faCheckCircle,
  faTimesCircle,
  faClock,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const BASE_URL = import.meta.env.VITE_API_URL;

const AdminUsersDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [borrows, setBorrows] = useState([]);
  const [showBorrowHistory, setShowBorrowHistory] = useState(false);
  const [borrowsLoading, setBorrowsLoading] = useState(false);

  const handleViewBorrowHistory = async () => {
    try {
      setBorrowsLoading(true);
      const token = sessionStorage.getItem("access_token");
      const response = await fetch(`${BASE_URL}/borrows/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Không thể lấy lịch sử mượn sách của người dùng.");
      }
      const data = await response.json();
      setBorrows(data);
      setShowBorrowHistory(true);
      toast.success("Lấy lịch sử mượn sách thành công!");
    } catch (error) {
      toast.error(error.message || "Đã xảy ra lỗi khi lấy lịch sử mượn sách.");
    } finally {
      setBorrowsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserDetail = async () => {
      try {
        const token = sessionStorage.getItem("access_token");
        const response = await fetch(`${BASE_URL}/users/detail/${id}/`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch user with ID: ${id}`);
        }
        const data = await response.json();
        setUser(data);
      } catch (err) {
        setError(`Không thể tải thông tin người dùng với ID: ${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetail();
  }, [id]);

  const handleToggleStatus = async () => {
    try {
      if (!user || typeof user.id === "undefined") {
        toast.error(
          "Không thể cập nhật trạng thái người dùng: Dữ liệu người dùng không hợp lệ."
        );
        return;
      }

      const newStatus = !user.is_active;
      const token = sessionStorage.getItem("access_token");
      const url = `${BASE_URL}/users/update/${id}/`;

      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_active: newStatus,
        }),
      });

      if (!response.ok) {
        let errorData = { detail: "Failed to parse error response." };
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error(
            "toggleUserStatus - Could not parse error JSON:",
            parseError
          );
        }
        const errorMessage =
          errorData.detail || response.statusText || "Unknown error occurred";
        throw new Error(`${errorMessage}`);
      }

      const updatedUser = await response.json();
      setUser((prevUser) => ({
        ...prevUser,
        is_active: updatedUser.is_active,
      }));

      toast.success(
        `Đã ${newStatus ? "kích hoạt" : "vô hiệu hóa"} tài khoản ${user.name}.`
      );
    } catch (error) {
      console.error("Error in toggleUserStatus function:", error);
      toast.error(
        error.message || "Đã xảy ra lỗi khi cập nhật trạng thái người dùng."
      );
    }
  };

  const handleDeleteUser = async () => {
    const confirmDelete = window.confirm(
      `Bạn có chắc muốn xóa người dùng ${user.name}?`
    );
    if (!confirmDelete) return;

    try {
      const token = sessionStorage.getItem("access_token");

      if (!user || typeof user.id === "undefined") {
        toast.error(
          "Không thể xóa người dùng: Dữ liệu người dùng không hợp lệ."
        );
        return;
      }

      const response = await fetch(`${BASE_URL}/users/delete/${id}/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        let errorData = { detail: "Failed to parse error response." };
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error(
            "handleDeleteUser - Could not parse error JSON:",
            parseError
          );
        }
        const errorMessage =
          errorData.detail ||
          Object.values(errorData).join("; ") ||
          response.statusText ||
          "Unknown error occurred";
        throw new Error(errorMessage);
      }

      toast.success("Xóa người dùng thành công!");
      navigate("/admin/users");
    } catch (error) {
      console.error("Error in handleDeleteUser function:", error);
      toast.error(error.message || "Đã xảy ra lỗi khi xóa người dùng.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có thông tin";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "APPROVED":
        return (
          <FontAwesomeIcon icon={faCheckCircle} className="text-success" />
        );
      case "PENDING":
        return <FontAwesomeIcon icon={faClock} className="text-warning" />;
      case "REJECTED":
        return <FontAwesomeIcon icon={faTimesCircle} className="text-danger" />;
      case "CANCELED":
        return (
          <FontAwesomeIcon icon={faTimesCircle} className="text-secondary" />
        );
      case "RETURNED":
        return <FontAwesomeIcon icon={faCheckCircle} className="text-info" />;
      default:
        return (
          <FontAwesomeIcon icon={faExclamationCircle} className="text-muted" />
        );
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "APPROVED":
        return "Đã duyệt";
      case "PENDING":
        return "Đang chờ";
      case "REJECTED":
        return "Đã từ chối";
      case "CANCELED":
        return "Đã hủy";
      case "RETURNED":
        return "Đã trả";
      default:
        return status;
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
        onClick={() => navigate("/admin/home/manageUsers")}
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
                bg={user.is_active ? "success" : "secondary"}
                className="text-white"
              >
                {user.is_active ? "HOẠT ĐỘNG" : "VÔ HIỆU HÓA"}
              </Badge>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={4} className="mb-4 mb-md-0">
              <div className="text-center mb-4">
                <Image
                  src={user.avatar ? `/image/${user.avatar}` : "/icon.jpg"}
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
                <p className="text-muted">ID: {user.id}</p>
              </div>

              <ListGroup variant="flush" className="shadow-sm">
                <ListGroup.Item>
                  <FontAwesomeIcon
                    icon={faCalendarAlt}
                    className="me-2 text-muted"
                  />
                  <strong>Ngày tạo:</strong> {formatDate(user.created_at)}
                </ListGroup.Item>
                <ListGroup.Item>
                  <FontAwesomeIcon
                    icon={faSignInAlt}
                    className="me-2 text-muted"
                  />
                  <strong>Lần đăng nhập cuối:</strong>{" "}
                  {formatDate(user.last_login) || "Chưa đăng nhập"}
                </ListGroup.Item>
              </ListGroup>
            </Col>

            <Col md={8}>
              <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Thông tin liên hệ</h5>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="me-2 text-primary"
                      />
                      <strong>Email:</strong> {user.email}
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <FontAwesomeIcon
                        icon={faPhone}
                        className="me-2 text-primary"
                      />
                      <strong>Số điện thoại:</strong>{" "}
                      {user.phone_number || "Chưa cập nhật"}
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>

              <Card className="shadow-sm">
                <Card.Header className="bg-light">
                  <h5 className="mb-0">Trạng thái tài khoản</h5>
                </Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <strong>Trạng thái:</strong>{" "}
                      <Badge
                        bg={user.is_active ? "success" : "secondary"}
                        className="ms-2"
                      >
                        {user.is_active ? "Hoạt động" : "Vô hiệu hóa"}
                      </Badge>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-between bg-light">
          <Button variant="outline-primary" onClick={handleViewBorrowHistory}>
            <FontAwesomeIcon icon={faBook} className="me-2" />
            <FontAwesomeIcon icon={faHistory} className="me-2" />
            Xem lịch sử mượn sách
          </Button>

          <div>
            <Button
              variant={user.is_active ? "outline-warning" : "outline-success"}
              onClick={handleToggleStatus}
              className="me-2"
            >
              <FontAwesomeIcon
                icon={user.is_active ? faToggleOff : faToggleOn}
                className="me-2"
              />
              {user.is_active ? "Vô hiệu hóa" : "Kích hoạt"}
            </Button>

            <Button variant="outline-danger" onClick={handleDeleteUser}>
              <FontAwesomeIcon icon={faTrash} className="me-2" />
              Xóa người dùng
            </Button>
          </div>
        </Card.Footer>
      </Card>

      {/* Modal hiển thị lịch sử mượn sách */}
      <Modal
        show={showBorrowHistory}
        onHide={() => setShowBorrowHistory(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>
            <FontAwesomeIcon icon={faHistory} className="me-2" />
            Lịch sử mượn sách của {user.name}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {borrowsLoading ? (
            <div className="text-center py-4">
              <Spinner animation="border" variant="primary" />
              <p className="mt-2">Đang tải lịch sử mượn sách...</p>
            </div>
          ) : borrows.length === 0 ? (
            <Alert variant="info" className="text-center">
              Người dùng chưa có lịch sử mượn sách
            </Alert>
          ) : (
            <div className="table-responsive">
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên sách</th>
                    <th>Tác giả</th>
                    <th>Ngày yêu cầu</th>
                    <th>Ngày mượn</th>
                    <th>Hạn trả</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {borrows.map((borrow, index) => (
                    <tr key={borrow.id}>
                      <td>{index + 1}</td>
                      <td>{borrow.book.title}</td>
                      <td>{borrow.book.author.name}</td>
                      <td>{formatDate(borrow.require_date)}</td>
                      <td>
                        {borrow.borrow_date
                          ? formatDate(borrow.borrow_date)
                          : "N/A"}
                      </td>
                      <td>
                        {borrow.exp_date ? formatDate(borrow.exp_date) : "N/A"}
                      </td>
                      <td>
                        {getStatusIcon(borrow.status)}{" "}
                        {getStatusText(borrow.status)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowBorrowHistory(false)}
          >
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminUsersDetail;
