import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../constants";
import { toast } from "react-toastify";
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
  Alert, // Bạn có thể loại bỏ Alert nếu không còn sử dụng sau khi chuyển sang toast
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
  faEye,
  faDownload,
  faToggleOn,
  faToggleOff,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null); // Loại bỏ state error

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [currentUser, setCurrentUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    avatar: null,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = sessionStorage.getItem(ACCESS_TOKEN);
        const response = await fetch(`${BASE_URL}/users/list/`, {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        const regularUsers = data.filter((user) => !user.is_superuser);
        setUsers(regularUsers);
        setLoading(false);
      } catch (err) {
        toast.error(err.message || "Failed to fetch users");
        setLoading(false);
      }
    };

    fetchUsers();
  }, [BASE_URL]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        avatar: file,
      });
    }
  };

  const handleEditUser = (user) => {
    setModalTitle("Chỉnh sửa người dùng");
    setCurrentUser(user);
    setFormData({
      name: user.name || "",
      phone: user.phone_number || "",
      email: user.email || "",
      avatar: user.avatar,
    });
    setShowModal(true);
  };

  const handleViewDetail = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  const handleDeleteUser = async () => {
    if (userToDelete) {
      try {
        const token = sessionStorage.getItem(ACCESS_TOKEN);

        if (!userToDelete || typeof userToDelete.id === "undefined") {
          toast.error(
            "Không thể xóa người dùng: Dữ liệu người dùng không hợp lệ."
          );
          setShowDeleteConfirm(false);
          setUserToDelete(null);
          return;
        }

        const url = `${BASE_URL}/users/delete/${userToDelete.id}/`;
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          let errorData = { detail: "Failed to parse error response." };
          if (response.status !== 204) {
            try {
              errorData = await response.json();
            } catch (parseError) {
              console.error(
                "handleDeleteUser - Could not parse error JSON:",
                parseError
              );
            }
          } else {
            setUsers(users.filter((user) => user.id !== userToDelete.id));
            setShowDeleteConfirm(false);
            setUserToDelete(null);
            toast.success("Xóa người dùng thành công!");
            return;
          }
          const errorMessage =
            errorData.detail ||
            Object.values(errorData).join("; ") ||
            response.statusText ||
            "Unknown error occurred";
          throw new Error(errorMessage);
        }

        setUsers(users.filter((user) => user.id !== userToDelete.id));
        setShowDeleteConfirm(false);
        setUserToDelete(null);
        toast.success("Xóa người dùng thành công!");
      } catch (error) {
        console.error("Error in handleDeleteUser function:", error);
        toast.error(error.message || "Đã xảy ra lỗi khi xóa người dùng.");
      }
    }
  };

  const toggleUserStatus = async (user) => {
    try {
      if (!user || typeof user.id === "undefined") {
        toast.error(
          "Không thể cập nhật trạng thái người dùng: Dữ liệu người dùng không hợp lệ."
        );
        return;
      }

      const newStatus = !user.is_active;
      const token = sessionStorage.getItem(ACCESS_TOKEN);
      const url = `${BASE_URL}/users/update/${user.id}/`;

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
      setUsers(
        users.map((u) =>
          u.id === user.id ? { ...u, is_active: updatedUser.is_active } : u
        )
      );
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

  const handleSaveUser = async () => {
    if (!currentUser || typeof currentUser.id === "undefined") {
      toast.error("Không thể lưu người dùng: Dữ liệu người dùng không hợp lệ.");
      return;
    }

    if (currentUser) {
      try {
        const token = sessionStorage.getItem(ACCESS_TOKEN);
        const url = `${BASE_URL}/users/update/${currentUser.id}/`;
        let requestBody;
        let headers = {
          Authorization: token ? `Bearer ${token}` : "",
        };

        if (formData.avatar instanceof File) {
          requestBody = new FormData();
          requestBody.append("name", formData.name);
          requestBody.append("phone_number", formData.phone);
          requestBody.append("avatar", formData.avatar, formData.avatar.name);
        } else {
          requestBody = JSON.stringify({
            name: formData.name,
            phone_number: formData.phone,
          });
          headers["Content-Type"] = "application/json";
        }

        const response = await fetch(url, {
          method: "PUT",
          headers: headers,
          body: requestBody,
        });

        if (!response.ok) {
          let errorData = { detail: "Failed to parse error response." };
          try {
            errorData = await response.json();
          } catch (parseError) {
            console.error(
              "handleSaveUser - Could not parse error JSON:",
              parseError
            );
          }
          const errorMessage =
            errorData.detail ||
            Object.values(errorData).join("; ") ||
            response.statusText ||
            "Unknown error occurred";
          throw new Error(`${errorMessage}`);
        }

        const updatedUserFromAPI = await response.json();
        setUsers(
          users.map((user) =>
            user.id === currentUser.id
              ? { ...user, ...updatedUserFromAPI }
              : user
          )
        );
        setShowModal(false);
        setCurrentUser(null);
        setFormData({ name: "", phone: "", email: "", avatar: null });
        toast.success("Cập nhật thông tin người dùng thành công!");
      } catch (error) {
        console.error("Error in handleSaveUser function:", error);
        toast.error(error.message || "Đã xảy ra lỗi khi cập nhật người dùng.");
      }
    }
  };

  const exportToCSV = () => {
    if (users.length === 0) {
      toast.info("Không có dữ liệu người dùng để xuất.");
      return;
    }
    const csvData = users.map((user) => ({
      ID: user.id,
      Name: user.name,
      Email: user.email,
      Phone: user.phone_number,
      Status: user.is_active ? "Active" : "Inactive",
      CreatedAt: user.created_at
        ? new Date(user.created_at).toLocaleDateString("vi-VN")
        : "N/A",
    }));

    const headers = Object.keys(csvData[0]).join(",");
    const csvContent = [
      headers,
      ...csvData.map((row) =>
        Object.values(row)
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      ), // Handle commas and quotes in values
    ].join("\n");

    const blob = new Blob([`\uFEFF${csvContent}`], {
      type: "text/csv;charset=utf-8;",
    }); // Add BOM for Excel compatibility
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "danh-sach-nguoi-dung.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Đã xuất dữ liệu người dùng ra CSV!");
  };

  const filteredUsers = users.filter(
    (user) =>
      (user.name &&
        user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.phone_number && user.phone_number.includes(searchTerm)) ||
      (user.email &&
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  //   Loại bỏ phần hiển thị lỗi bằng Alert
  //   if (error) {
  //     return (
  //       <Container className="my-5">
  //         <Alert variant="danger">{error}</Alert>
  //       </Container>
  //     );
  //   }

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
                <Col md={6} className="text-end">
                  <Button
                    variant="success"
                    className="me-2"
                    onClick={exportToCSV}
                  >
                    <FontAwesomeIcon icon={faDownload} className="me-2" />
                    Tải xuống CSV
                  </Button>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
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
                    setCurrentPage(1);
                  }}
                />
              </InputGroup>

              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Ảnh đại diện</th>
                    <th>Tên</th>
                    <th>Số điện thoại</th>
                    <th>Email</th>
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
                                ? user.avatar
                                : typeof user.avatar === "string" &&
                                  user.avatar.startsWith("blob:")
                                ? user.avatar
                                : user.avatar // Nếu backend trả về full URL thì dùng trực tiếp
                                ? user.avatar
                                : "/default-avatar.jpg"
                            }
                            alt={user.name}
                            width={50}
                            height={50}
                            roundedCircle
                            className="shadow-sm object-fit-cover"
                          />
                        </td>
                        <td>{user.name}</td>
                        <td>
                          <FontAwesomeIcon icon={faPhone} className="me-2" />
                          {user.phone_number}
                        </td>
                        <td>
                          <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                          {user.email}
                        </td>
                        <td>
                          <Badge bg={user.is_active ? "success" : "secondary"}>
                            {user.is_active ? "Đang hoạt động" : "Vô hiệu hóa"}
                          </Badge>
                        </td>
                        <td>
                          {" "}
                          <Button
                            variant="outline-info"
                            size="sm"
                            className="me-2 mb-1 mb-md-0"
                            onClick={() => handleViewDetail(user.id)}
                            title="Xem chi tiết"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Button>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2 mb-1 mb-md-0"
                            onClick={() => handleEditUser(user)}
                            title="Chỉnh sửa"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button
                            variant={
                              user.is_active
                                ? "outline-secondary"
                                : "outline-warning"
                            }
                            size="sm"
                            className="me-2 mb-1 mb-md-0"
                            onClick={() => toggleUserStatus(user)}
                            title={user.is_active ? "Vô hiệu hóa" : "Kích hoạt"}
                          >
                            <FontAwesomeIcon
                              icon={user.is_active ? faToggleOff : faToggleOn}
                            />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        Không tìm thấy người dùng phù hợp
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

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

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setCurrentUser(null);
          setFormData({ name: "", phone: "", email: "", avatar: null });
        }}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formUserName">
              <Form.Label>Tên người dùng</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên người dùng"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formUserPhone">
              <Form.Label>Số điện thoại</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập số điện thoại"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formUserEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Nhập email"
                name="email"
                value={formData.email}
                readOnly
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formUserAvatar">
              <Form.Label>Ảnh đại diện</Form.Label>
              <Form.Control
                type="file"
                name="avatar"
                accept="image/*"
                onChange={handleImageChange}
              />
              {currentUser &&
                currentUser.avatar &&
                typeof currentUser.avatar === "string" &&
                !(formData.avatar instanceof File) && (
                  <Image
                    src={
                      currentUser.avatar.startsWith("/")
                        ? currentUser.avatar
                        : currentUser.avatar.startsWith("blob:")
                        ? currentUser.avatar
                        : currentUser.avatar
                        ? currentUser.avatar
                        : "/default-avatar.jpg"
                    }
                    alt="Avatar hiện tại"
                    width={100}
                    className="mt-2"
                    rounded
                  />
                )}
              {formData.avatar instanceof File && (
                <Image
                  src={URL.createObjectURL(formData.avatar)}
                  alt="Preview ảnh mới"
                  width={100}
                  className="mt-2"
                  rounded
                />
              )}
            </Form.Group>
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
            {currentUser ? "Lưu thay đổi" : "Thêm mới"}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showDeleteConfirm}
        onHide={() => {
          setShowDeleteConfirm(false);
          setUserToDelete(null);
        }}
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
            onClick={() => {
              setShowDeleteConfirm(false);
              setUserToDelete(null);
            }}
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
