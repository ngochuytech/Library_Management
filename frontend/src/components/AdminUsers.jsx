import React, { useState, useEffect } from "react";
import { ACCESS_TOKEN } from "../constants";
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
  faEye,
  faDownload, // Thêm icon download
  faToggleOn, // Thêm icon kích hoạt
  faToggleOff, // Thêm icon vô hiệu hóa
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

  const BASE_URL = import.meta.env.VITE_API_URL;

  // Fetch dữ liệu người dùng từ API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Lấy token từ sessionStorage
        const token = sessionStorage.getItem(ACCESS_TOKEN);
        
        // Thêm token vào header của request
        const response = await fetch(`${BASE_URL}/users/list/`, {
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }
        const data = await response.json();
        console.log("Dữ liệu người dùng NGUYÊN BẢN từ API (phần tử đầu tiên):", data[0]); // Log phần tử đầu tiên để xem chi tiết
        console.log("Kiểu dữ liệu của is_superuser (phần tử đầu tiên):", typeof data[0]?.is_superuser);
        // Lọc chỉ lấy người dùng thường (is_superuser = 0)
        const regularUsers = data.filter(user => !user.is_superuser);
        setUsers(regularUsers);
        setLoading(false);
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
    console.log("handleEditUser called with user:", user);
    setModalTitle("Chỉnh sửa người dùng");
    setCurrentUser(user);
    setFormData({
      name: user.name || "",
      phone: user.phone_number || "",
      email: user.email || "",
      avatar: user.avatar,
    });
    setShowModal(true);
    console.log("showModal state after setShowModal(true):", showModal);
  };

  // Xem chi tiết người dùng
  const handleViewDetail = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  // Xác nhận xóa người dùng
  const confirmDeleteUser = (user) => {
    console.log("confirmDeleteUser called with user:", user); // THÊM LOG NÀY
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  // Thực hiện xóa người dùng
 // Trong AdminUsers.jsx
const handleDeleteUser = async () => {
  if (userToDelete) { // userToDelete được set khi click nút xác nhận xóa
    try {
      const token = sessionStorage.getItem(ACCESS_TOKEN);

      console.log("handleDeleteUser - User to delete:", userToDelete);
      if (!userToDelete || typeof userToDelete.id === 'undefined') {
        console.error("handleDeleteUser - Invalid userToDelete object or userToDelete.id is undefined.");
        setError("Không thể xóa người dùng: Dữ liệu người dùng không hợp lệ.");
        setShowDeleteConfirm(false); // Đóng modal xác nhận
        setUserToDelete(null);      // Reset userToDelete
        return;
      }
      console.log("handleDeleteUser - User ID to delete:", userToDelete.id);
      console.log("handleDeleteUser - BASE_URL:", BASE_URL);

      const url = `${BASE_URL}/users/delete/${userToDelete.id}/`; // Đảm bảo có dấu / ở cuối
      console.log("URL đang được gọi cho handleDeleteUser:", url);

      const response = await fetch(url, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json', // Có thể không cần thiết cho DELETE nếu không có body, nhưng để cũng không sao
        },
        // DELETE request thường không có body, nhưng nếu có, backend phải xử lý
      });

      if (!response.ok) {
        let errorData = { detail: "Failed to parse error response." };
        // Response 204 (No Content) sẽ không có body, nên không cần .json()
        if (response.status !== 204) {
            try {
                errorData = await response.json();
            } catch (parseError) {
                console.error("handleDeleteUser - Could not parse error JSON:", parseError);
            }
        } else {
            // Nếu là 204, không có lỗi, chỉ cần xử lý thành công
            setUsers(users.filter((user) => user.id !== userToDelete.id));
            setShowDeleteConfirm(false);
            setUserToDelete(null);
            setError(null); // Xóa lỗi nếu thành công
            return; // Kết thúc sớm vì đã xử lý xong
        }
        
        console.error('Error details from handleDeleteUser:', errorData);
        const errorMessage = errorData.detail || Object.values(errorData).join('; ') || response.statusText || "Unknown error occurred";
        throw new Error(`Failed to delete user. Status: ${response.status}. Message: ${errorMessage}`);
      }

      // Nếu response.ok và không phải 204 (ví dụ backend trả về 200 OK với message)
      // thì bạn có thể xử lý ở đây, nhưng thường DELETE thành công sẽ là 204.
      setUsers(users.filter((user) => user.id !== userToDelete.id));
      setShowDeleteConfirm(false);
      setUserToDelete(null);
      setError(null); // Xóa lỗi nếu thành công

    } catch (error) {
      console.error('Error in handleDeleteUser function:', error);
      setError(error.message);
      // Giữ modal xác nhận mở để người dùng biết có lỗi và thử lại nếu muốn,
      // hoặc bạn có thể đóng nó:
      // setShowDeleteConfirm(false);
      // setUserToDelete(null);
    }
  }
};

  // Kích hoạt/vô hiệu hóa tài khoản người dùng
// Trong AdminUsers.js
// Trong AdminUsers.js - hàm toggleUserStatus
const toggleUserStatus = async (user) => {
  try {
    // Thêm console.log để kiểm tra user và user.id ngay từ đầu
    console.log("toggleUserStatus - User object:", user);
    if (!user || typeof user.id === 'undefined') {
      console.error("toggleUserStatus - Invalid user object or user.id is undefined.");
      setError("Không thể cập nhật trạng thái người dùng: Dữ liệu người dùng không hợp lệ.");
      return; // Thoát sớm nếu user hoặc user.id không hợp lệ
    }
    console.log("toggleUserStatus - User ID:", user.id);
    console.log("toggleUserStatus - BASE_URL:", BASE_URL);


    const newStatus = !user.is_active;
    const token = sessionStorage.getItem(ACCESS_TOKEN);

    // SỬA LẠI DÒNG NÀY:
    const url = `${BASE_URL}/users/update/${user.id}/`; 
    
    console.log("URL đang được gọi cho toggleUserStatus:", url); // Log URL sau khi đã sửa

    const response = await fetch(url, {
      method: 'PUT', // Hoặc 'PATCH'
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        is_active: newStatus 
      }),
    });

    if (!response.ok) {
      let errorData = { detail: "Failed to parse error response." };
      try {
        errorData = await response.json();
      } catch (parseError) {
        console.error("toggleUserStatus - Could not parse error JSON:", parseError);
      }
      console.error('Error details from toggleUserStatus:', errorData);
      // Sử dụng errorData.detail nếu có, nếu không thì response.statusText
      const errorMessage = errorData.detail || response.statusText || "Unknown error occurred";
      throw new Error(`Failed to update user status. Status: ${response.status}. Message: ${errorMessage}`);
    }

    // Cập nhật trạng thái người dùng trong state của React
    setUsers(users.map(u =>
      u.id === user.id ? { ...u, is_active: newStatus } : u
    ));
    setError(null); // Xóa lỗi trước đó nếu thành công

  } catch (error) {
    console.error('Error in toggleUserStatus function:', error);
    setError(error.message); // Hiển thị lỗi cho người dùng
  }
};

  // Lưu người dùng (thêm hoặc sửa)
  const handleSaveUser = async () => {
    console.log("handleSaveUser - Current User:", currentUser);
    if (!currentUser || typeof currentUser.id === 'undefined') {
      console.error("handleSaveUser - Invalid currentUser or currentUser.id is undefined.");
      setError("Không thể lưu người dùng: Dữ liệu người dùng không hợp lệ.");
      return;
    }
    console.log("handleSaveUser - Current User ID:", currentUser.id);
    console.log("handleSaveUser - BASE_URL:", BASE_URL);
    if (currentUser) { // currentUser chứa thông tin user đang được sửa
      try {
        const token = sessionStorage.getItem(ACCESS_TOKEN);
  
        // KIỂM TRA VÀ ĐẢM BẢO CÁC DÒNG NÀY ĐÚNG
        console.log("handleSaveUser - Current User:", currentUser);
        if (!currentUser || typeof currentUser.id === 'undefined') {
          console.error("handleSaveUser - Invalid currentUser or currentUser.id is undefined.");
          setError("Không thể lưu người dùng: Dữ liệu người dùng không hợp lệ.");
          return;
        }
        console.log("handleSaveUser - Current User ID:", currentUser.id);
        console.log("handleSaveUser - BASE_URL:", BASE_URL);
  
        const url = `${BASE_URL}/users/update/${currentUser.id}/`; 
        console.log("URL ĐÚNG ĐANG ĐƯỢC GỌI cho handleSaveUser:", url);
        console.log("Dữ liệu gửi đi (formData):", formData);
        console.log("Loại requestBody:", (formData.avatar instanceof File) ? "FormData" : "JSON");
  
        // Xử lý upload avatar nếu có
        let requestBody;
        let headers = {
          'Authorization': token ? `Bearer ${token}` : '',
        };
  
        if (formData.avatar instanceof File) {
          // Nếu có file avatar mới, sử dụng FormData
          requestBody = new FormData();
          requestBody.append('name', formData.name);
          requestBody.append('phone_number', formData.phone);
          // requestBody.append('email', formData.email); // Cẩn thận khi cho sửa email
          requestBody.append('avatar', formData.avatar, formData.avatar.name);
          // Không set 'Content-Type' ở đây, trình duyệt sẽ tự làm với FormData
        } else {
          // Nếu không có file avatar mới, sử dụng JSON
          requestBody = JSON.stringify({
            name: formData.name,
            phone_number: formData.phone,
            // email: formData.email, // Cẩn thận khi cho sửa email
            // avatar: null, // hoặc không gửi trường avatar nếu không muốn xóa/thay đổi
          });
          headers['Content-Type'] = 'application/json';
        }
  
        const response = await fetch(url, {
          method: 'PUT', // Hoặc 'PATCH' nếu bạn muốn và backend hỗ trợ tốt hơn cho việc chỉ sửa một vài trường
          headers: headers,
          body: requestBody,
        });
  
        if (!response.ok) {
          let errorData = { detail: "Failed to parse error response." };
          try {
            errorData = await response.json();
          } catch (parseError) {
            console.error("handleSaveUser - Could not parse error JSON:", parseError);
          }
          console.error('Error details from handleSaveUser:', errorData);
          const errorMessage = errorData.detail || Object.values(errorData).join('; ') || response.statusText || "Unknown error occurred";
          throw new Error(`Failed to update user. Status: ${response.status}. Message: ${errorMessage}`);
        }
  
        const updatedUser = await response.json();
        console.log("User sau khi cập nhật từ API:", updatedUser);
  
        // Cập nhật người dùng trong state
        setUsers(users.map(user =>
          user.id === currentUser.id ? { ...user, ...updatedUser } : user
        ));
        setShowModal(false);
        setCurrentUser(null);
        setFormData({ name: "", phone: "", email: "", avatar: null }); // Reset form
        setError(null); // Xóa lỗi nếu thành công
      } catch (error) {
        console.error('Error in handleSaveUser function:', error);
        setError(error.message);
      }
    }
  };


  // Hàm helper để thêm token vào header
  const fetchWithAuth = async (url, options = {}) => {
    const token = sessionStorage.getItem(ACCESS_TOKEN);
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
      ...options.headers
    };
    
    return fetch(url, {
      ...options,
      headers
    });
  };
  // Xuất dữ liệu người dùng ra CSV
  const exportToCSV = () => {
    // Chuẩn bị dữ liệu
    const csvData = users.map(user => ({
      ID: user.id,
      Name: user.name,
      Email: user.email,
      Phone: user.phone_number,
      Status: user.is_active ? 'Active' : 'Inactive',
      CreatedAt: user.created_at
    }));

    // Tạo header
    const headers = Object.keys(csvData[0]).join(',');
    
    // Tạo nội dung CSV
    const csvContent = [
      headers,
      ...csvData.map(row => Object.values(row).join(','))
    ].join('\n');

    // Tạo blob và tải xuống
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'danh-sach-nguoi-dung.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Lọc người dùng theo từ khóa tìm kiếm
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone_number.includes(searchTerm) ||
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
                <Col md={6} className="text-end">
                  {/* Thêm nút xuất CSV */}
                  <Button variant="success" className="me-2" onClick={exportToCSV}>
                    <FontAwesomeIcon icon={faDownload} className="me-2" />
                    Tải xuống CSV
                  </Button>
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
                          {user.phone_number}
                        </td>
                        <td>
                          <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                          {user.email}
                        </td>
                        <td>
                          <Badge
                            bg={
                              user.is_active ? "success" : "secondary"
                            }
                          >
                            {user.is_active ? "Đang hoạt động" : "Vô hiệu hóa"}
                          </Badge>
                        </td>
                        <td>
                          
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEditUser(user)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button
                            variant="outline-warning"
                            size="sm"
                            className="me-2"
                            onClick={() => toggleUserStatus(user)}
                          >
                            <FontAwesomeIcon icon={user.is_active ? faToggleOff : faToggleOn} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => confirmDeleteUser(user)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
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
  <Modal show={showModal} onHide={() => {
      setShowModal(false);
      setCurrentUser(null); // Reset currentUser khi đóng modal
      setFormData({ name: "", phone: "", email: "", avatar: null }); // Reset form
  }} centered>
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
                      readOnly // Email thường không cho sửa
                  />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formUserAvatar">
                  <Form.Label>Ảnh đại diện</Form.Label>
                  <Form.Control
                      type="file"
                      name="avatar"
                      onChange={handleImageChange}
                  />
                  {/* Hiển thị avatar hiện tại nếu có */}
                  {currentUser && currentUser.avatar && typeof currentUser.avatar === 'string' && !(formData.avatar instanceof File) && (
                      <Image src={currentUser.avatar.startsWith("/") ? currentUser.avatar : (currentUser.avatar.startsWith("blob:") ? currentUser.avatar : "/default-avatar.jpg")} alt="Avatar" width={100} className="mt-2" rounded />
                  )}
                  {/* Hiển thị preview ảnh mới nếu người dùng chọn */}
                  {formData.avatar instanceof File && (
                      <Image src={URL.createObjectURL(formData.avatar)} alt="Preview" width={100} className="mt-2" rounded />
                  )}
              </Form.Group>
          </Form>
      </Modal.Body>
      <Modal.Footer>
          <Button variant="secondary" onClick={() => {
              setShowModal(false);
              setCurrentUser(null);
              setFormData({ name: "", phone: "", email: "", avatar: null });
          }}>
              Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveUser}>
              {currentUser ? "Lưu thay đổi" : "Thêm mới"}
          </Button>
      </Modal.Footer>
  </Modal>

    {/* Modal xác nhận xóa */}
  <Modal
    show={showDeleteConfirm} // Prop `show` phải được gắn với state `showDeleteConfirm`
    onHide={() => {
      setShowDeleteConfirm(false); // Đóng modal
      setUserToDelete(null);      // Reset userToDelete khi đóng modal bằng cách khác (ví dụ click ra ngoài)
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
          setUserToDelete(null); // Cũng reset ở đây
        }}
      >
        Hủy
      </Button>
      <Button variant="danger" onClick={handleDeleteUser}> {/* Nút này gọi handleDeleteUser */}
        Xóa
      </Button>
    </Modal.Footer>
  </Modal>
      </Container>
  );
};

export default AdminUsers;