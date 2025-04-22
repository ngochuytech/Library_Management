import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Modal,
  Form,
  InputGroup,
  Badge,
  Pagination,
  Alert,
  Image,
} from "react-bootstrap";
import {
  faUser,
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faExclamationTriangle,
  faPhone,
  faEnvelope,
  faEye, // <- Thêm icon này
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const navigate = useNavigate();

  // State quản lý danh sách người dùng
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State cho modal thêm/sửa người dùng
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  // State cho form
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    avatar: null,
  });

  // State tìm kiếm và phân trang
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // State xác nhận xóa
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch dữ liệu người dùng (giả lập)
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Giả lập API call
        setTimeout(() => {
          const mockUsers = [
            {
              id: 1,
              name: "Nguyễn Văn A",
              phone: "0912345678",
              email: "nguyenvana@example.com",
              avatar: "/user1.jpg",
              // role: "Admin", // <- Đã xóa
              status: "Active",
            },
            {
              id: 2,
              name: "Trần Thị B",
              phone: "0987654321",
              email: "tranthib@example.com",
              avatar: "/user2.jpg",
              // role: "User", // <- Đã xóa
              status: "Active",
            },
            {
              id: 3,
              name: "Lê Văn C",
              phone: "0978123456",
              email: "levanc@example.com",
              avatar: "/user3.jpg",
              // role: "User", // <- Đã xóa
              status: "Inactive",
            },
            {
              id: 4,
              name: "Phạm Thị D",
              phone: "0965432187",
              email: "phamthid@example.com",
              avatar: "/user4.jpg",
              // role: "Moderator", // <- Đã xóa
              status: "Active",
            },
            {
              id: 5,
              name: "Hoàng Văn E",
              phone: "0932165498",
              email: "hoangvane@example.com",
              avatar: "/user5.jpg",
              // role: "User", // <- Đã xóa
              status: "Inactive",
            },
          ];
          setUsers(mockUsers);
          setLoading(false);
        }, 1000);
      } catch (err) {
        setError("Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Xử lý thay đổi form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Xử lý thay đổi ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        avatar: file,
      });
    }
  };

  // Mở modal sửa người dùng
  const handleEditUser = (user) => {
    setModalTitle("Chỉnh sửa người dùng");
    setCurrentUser(user);
    setFormData({
      name: user.name,
      phone: user.phone,
      email: user.email,
      avatar: user.avatar,
    });
    setShowModal(true);
  };

  // Xem chi tiết người dùng (Nếu cần, bạn có thể sửa trang chi tiết để không hiển thị role)
  const handleViewDetail = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  // Xác nhận xóa người dùng
  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  // Thực hiện xóa người dùng
  const handleDeleteUser = () => {
    if (userToDelete) {
      setUsers(users.filter((user) => user.id !== userToDelete.id));
      setShowDeleteConfirm(false);
      setUserToDelete(null); // Reset userToDelete
    }
  };

  // Lưu người dùng (thêm hoặc sửa)
  const handleSaveUser = () => {
    if (currentUser) {
      // Cập nhật người dùng
      setUsers(
        users.map((user) =>
          user.id === currentUser.id ? { ...user, ...formData } : user
        )
      );
    }
    setShowModal(false);
    setCurrentUser(null); // Reset currentUser
    setFormData({ name: "", phone: "", email: "", avatar: null }); // Reset form
  };

  // Lọc người dùng theo từ khóa tìm kiếm
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Tính toán phân trang
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <p>Loading users...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <Row className="align-items-center">
                <Col md={6}>
                  <h4 className="mb-0">
                    <FontAwesomeIcon
                      icon={faUser}
                      className="text-primary me-2"
                    />
                    Quản lý người dùng
                  </h4>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              {/* Thanh tìm kiếm */}
              <InputGroup className="mb-4">
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm theo tên, số điện thoại hoặc email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
                  }}
                />
              </InputGroup>

              {/* Bảng danh sách người dùng */}
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Ảnh đại diện</th>
                    <th>Tên</th>
                    <th>Số điện thoại</th>
                    <th>Email</th>
                    {/* <th>Vai trò</th> <- Đã xóa */}
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.length > 0 ? (
                    currentUsers.map((user) => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>
                          <Image
                            src={
                              typeof user.avatar === "string" &&
                              user.avatar.startsWith("/")
                                ? user.avatar // Giữ nguyên nếu là path tĩnh
                                : typeof user.avatar === "string" &&
                                  user.avatar.startsWith("blob:")
                                ? user.avatar // Giữ nguyên nếu là blob URL
                                : "/default-avatar.jpg" // Ảnh mặc định
                            }
                            alt={user.name}
                            width={50}
                            height={50}
                            roundedCircle
                            className="shadow-sm object-fit-cover" // Thêm object-fit
                          />
                        </td>
                        <td>{user.name}</td>
                        <td>
                          <FontAwesomeIcon icon={faPhone} className="me-2" />
                          {user.phone}
                        </td>
                        <td>
                          <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                          {user.email}
                        </td>
                        {/* Role TD removed */}
                        {/* <td>
                          <Badge
                            bg={
                              user.role === "Admin"
                                ? "danger"
                                : user.role === "Moderator"
                                ? "warning"
                                : "info"
                            }
                          >
                            {user.role}
                          </Badge>
                        </td> */}
                        <td>
                          <Badge
                            bg={
                              user.status === "Active" ? "success" : "secondary"
                            }
                          >
                            {user.status}
                          </Badge>
                        </td>
                        <td>
                          <Button
                            variant="outline-info"
                            size="sm"
                            className="me-2"
                            onClick={() => handleViewDetail(user.id)}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Button>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEditUser(user)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => confirmDeleteUser(user)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                          {/* Optional: Button to view details */}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      {/* Adjusted colSpan from 8 to 7 */}
                      <td colSpan="7" className="text-center py-4">
                        Không tìm thấy người dùng phù hợp
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {/* Phân trang */}
              {filteredUsers.length > usersPerPage && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.First
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {Array.from({ length: totalPages }, (_, i) => (
                      <Pagination.Item
                        key={i + 1}
                        active={i + 1 === currentPage}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal thêm/sửa người dùng */}
      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setCurrentUser(null);
          setFormData({ name: "", phone: "", email: "", avatar: null });
        }}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="mb-3">
              <Col md={4}>
                {/* Hiển thị ảnh xem trước */}
                <div className="text-center mb-3">
                  {formData.avatar ? (
                    <Image
                      src={
                        typeof formData.avatar === "string"
                          ? formData.avatar // Nếu là URL/path từ user hiện tại
                          : URL.createObjectURL(formData.avatar) // Nếu là File object mới
                      }
                      alt="User avatar preview"
                      fluid
                      roundedCircle
                      style={{
                        width: "200px",
                        height: "200px",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      className="border rounded d-flex align-items-center justify-content-center text-muted bg-light"
                      style={{
                        width: "200px",
                        height: "200px",
                        margin: "0 auto",
                      }}
                    >
                      Chưa có ảnh
                    </div>
                  )}
                </div>

                {/* Trường chọn ảnh */}
                <Form.Group>
                  <Form.Label>Ảnh đại diện</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </Form.Group>
              </Col>

              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Họ và tên</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
                {/* Bạn có thể thêm các trường khác ở đây nếu cần */}
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setCurrentUser(null);
              setFormData({ name: "", phone: "", email: "", avatar: null });
            }}
          >
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveUser}>
            Lưu
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal xác nhận xóa */}
      <Modal
        show={showDeleteConfirm}
        onHide={() => setShowDeleteConfirm(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa người dùng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-warning me-3"
              size="2x"
            />
            <p className="mb-0">
              Bạn có chắc chắn muốn xóa người dùng "{userToDelete?.name}"? Hành
              động này không thể hoàn tác.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowDeleteConfirm(false)}
          >
            Hủy
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminUsers;
