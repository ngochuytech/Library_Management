import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Container,
  Row,
  Col,
  Card,
  Tab,
  Tabs,
  Form,
  Button,
  Image,
  ListGroup,
  Badge,
} from "react-bootstrap";
import {
  faUser,
  faLock,
  faBell,
  faEnvelope,
  faPhone,
  faPen,
  faCheck,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import api from "../api";

const Account = ({ defaultTab = "profile" }) => {
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_API_URL;
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [key, setKey] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({});

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  // State cho avatar
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const access_token = sessionStorage.getItem("access_token");
    if (access_token) {
      setIsAuthenticated(true);
      fetchUser();
    } else setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [isAuthenticated, key]);

  useEffect(() => {
    setKey(defaultTab);
  }, [defaultTab]);

  const [formData, setFormData] = useState({ ...userData });

  const fetchNotifications = async () => {
    try {
      const idUser = sessionStorage.getItem("idUser");
      const response = await api.get(`/notifications/api/user/${idUser}`);

      setNotifications(response.data);
    } catch (error) {
      setNotifications([]);
    }
  };

  const fetchUser = async () => {
    try {
      const id = sessionStorage.getItem("idUser");
      const response = await api.get(`/users/api/infor?id=${id}`);

      setUserData({
        name: response.data.name,
        phone: response.data.phone_number,
        email: response.data.email,
        avatar: response.data.avatar,
        created_at: response.data.created_at,
      });

      setFormData({
        name: response.data.name,
        phone: response.data.phone_number,
        email: response.data.email,
        avatar: response.data.avatar,
        created_at: response.data.created_at,
      });
      console.log("ads", response.data);
    } catch (error) {
      console.error("Failed to fetch user detail:", error.message);
      toast.error("Không thể tải thông tin người dùng. Vui lòng thử lại.");
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const cleanedValue = value.replace(/[^0-9]/g, "");
      setFormData({ ...formData, [name]: cleanedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setFieldErrors({ ...fieldErrors, [name]: "" });
  };

  // --- HÀM XỬ LÝ CHỌN FILE AVATAR ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Vui lòng chỉ chọn file ảnh.");
        setSelectedFile(null);
        setPreviewUrl(null);
        e.target.value = null;
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Kích thước ảnh không được vượt quá 2MB.");
        setSelectedFile(null);
        setPreviewUrl(null);
        e.target.value = null;
        return;
      }
      setSelectedFile(file); // Lưu file đã chọn
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };
  const handleSave = async () => {
    try {
      const idUser = sessionStorage.getItem("idUser");

      const updateFormData = new FormData();

      updateFormData.append("name", formData.name);
      if (selectedFile) {
        updateFormData.append("avatar", selectedFile);
      }
      const response = await api.put(
        `/users/api/update/${idUser}`,
        updateFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedData = response.data;

      setUserData({
        ...userData,
        name: updatedData.name,
        phone: updatedData.phone_number,
        avatar: updatedData.avatar || userData.avatar,
      });

      setFormData({
        ...formData,
        name: updatedData.name,
        phone: updatedData.phone_number,
        avatar: updatedData.avatar || userData.avatar,
      });

      setIsEditing(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setError("");
      setFieldErrors({});
      toast.success("Cập nhật thông tin thành công!");
      sessionStorage.setItem("username", updatedData.name);
    } catch (error) {
      console.error("Failed to update user:", error.response?.data?.error);
      const errData = error.response?.data?.error;
      if (errData?.phone_number) {
        toast.error("Cập nhật thất bại. Số điện thoại này đã tồn tại");
      } else if (errData?.avatar) {
        toast.error("Cập nhật thất bại. Lỗi tải lên ảnh: " + errData.avatar);
      } else {
        toast.error("Cập nhật thất bại. " + (errData || error.message));
      }
    }
  };

  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  const validatePasswordForm = () => {
    let valid = true;
    const newErrors = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };

    if (
      !passwordData.currentPassword ||
      passwordData.currentPassword.trim() == ""
    ) {
      newErrors.currentPassword = "Vui lòng nhập mật khẩu hiện tại";
      valid = false;
    }

    if (!passwordData.newPassword) {
      newErrors.newPassword = "Vui lòng nhập mật khẩu mới";
      valid = false;
    } else if (passwordData.newPassword.length < 6) {
      newErrors.newPassword = "Mật khẩu phải có ít nhất 6 ký tự";
      valid = false;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu mới không khớp";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handlePasswordSubmit = async () => {
    if (!validatePasswordForm()) return;

    try {
      const response = await fetch(`${BASE_URL}/users/api/change-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("access_token")}`,
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
          confirmPassword: passwordData.confirmPassword,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error || "Vui lòng thử lại.");
        throw errorData.error;
      }

      const data = await response.json();
      toast.success(data.message || "Đổi mật khẩu thành công!", {
        autoClose: 7000,
      });
      setError("");
      setErrors({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
    } catch (error) {
      console.error("Failed to change password: ", error);
      toast.error(`Đổi mật khẩu thất bại. ${error}.`, {
        autoClose: 7000,
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <Container className="my-5 d-flex justify-content-center">
        <Card style={{ width: "400px", padding: "20px" }}>
          <Card.Body className="text-center">
            <Button
              variant="primary"
              onClick={() => navigate("/login")}
              className="w-100"
            >
              Đăng nhập
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row>
        <Col md={4}>
          <Card className="shadow-sm mb-4">
            <Card.Body className="text-center">
              {" "}
              <Image
                src={previewUrl || "/image" + userData.avatar || "/icon.jpg"}
                roundedCircle
                width={150}
                height={150}
                className="mb-3 border"
                style={{ objectFit: "cover" }}
              />
              <h4>{userData.name}</h4>
              <p className="text-muted">Thành viên từ {userData.created_at}</p>
            </Card.Body>
          </Card>

          <Card className="shadow-sm">
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item
                  action
                  active={key === "profile"}
                  onClick={() => setKey("profile")}
                >
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  Thông tin cá nhân
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  active={key === "security"}
                  onClick={() => setKey("security")}
                >
                  <FontAwesomeIcon icon={faLock} className="me-2" />
                  Đăng nhập & Bảo mật
                </ListGroup.Item>
                <ListGroup.Item
                  action
                  active={key === "notifications"}
                  onClick={() => setKey("notifications")}
                >
                  <FontAwesomeIcon icon={faBell} className="me-2" />
                  Thông báo
                  <Badge bg="primary" pill className="ms-2">
                    {notifications.length}
                  </Badge>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <Tabs
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
                id="account-tabs"
              >
                <Tab eventKey="profile" title="Thông tin cá nhân">
                  {isEditing ? (
                    <Form>
                      {/* THÊM PHẦN INPUT AVATAR KHI CHỈNH SỬA */}
                      <Form.Group className="mb-3 text-center">
                        <Form.Label>Ảnh đại diện</Form.Label>
                        {/* Hiển thị ảnh preview hoặc ảnh hiện tại */}
                        <div className="mb-2">
                          <Image
                            src={
                              previewUrl ||
                              "/image" + formData.avatar ||
                              "/icon.jpg"
                            }
                            roundedCircle
                            width={120}
                            height={120}
                            className="border"
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                        {/* Input file */}
                        <Form.Control
                          type="file"
                          name="avatar"
                          accept="image/*"
                          onChange={handleFileChange}
                          size="sm"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Họ và tên</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name || ""}
                          onChange={handleInputChange}
                          isInvalid={!!fieldErrors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                          {fieldErrors.name}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FontAwesomeIcon icon={faPhone} className="me-2" />
                          Số điện thoại
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone || ""}
                          onChange={handleInputChange}
                          isInvalid={!!fieldErrors.phone}
                          disabled
                        />
                        <Form.Control.Feedback type="invalid">
                          {fieldErrors.phone}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                          Email
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email || ""}
                          onChange={handleInputChange}
                          disabled 
                        />
                      </Form.Group>

                      <div className="d-flex gap-2">
                        <Button variant="primary" onClick={handleSave}>
                          <FontAwesomeIcon icon={faCheck} className="me-2" />
                          Lưu thay đổi
                        </Button>{" "}
                        <Button
                          variant="outline-secondary"
                          onClick={() => {
                            setIsEditing(false);
                            setFieldErrors({});
                            setError("");
                            setSelectedFile(null);
                            setPreviewUrl(null);
                            setFormData({ ...userData });
                          }}
                        >
                          Hủy
                        </Button>
                      </div>
                    </Form>
                  ) : (
                    <>
                      <ListGroup variant="flush">
                        <ListGroup.Item>
                          <div className="d-flex justify-content-between">
                            <div>
                              <h6>Họ và tên</h6>
                              <p>{userData.name}</p>
                            </div>{" "}
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => {
                                setFormData({ ...userData });
                                setIsEditing(true);
                                setSelectedFile(null);
                                setPreviewUrl(null);
                              }}
                            >
                              <FontAwesomeIcon icon={faPen} className="me-1" />
                              Chỉnh sửa
                            </Button>
                          </div>
                        </ListGroup.Item>

                        <ListGroup.Item>
                          <h6>
                            <FontAwesomeIcon icon={faPhone} className="me-2" />
                            Số điện thoại
                          </h6>
                          <p>{userData.phone}</p>
                        </ListGroup.Item>

                        <ListGroup.Item>
                          <h6>
                            <FontAwesomeIcon
                              icon={faEnvelope}
                              className="me-2"
                            />
                            Email
                          </h6>
                          <p>{userData.email}</p>
                        </ListGroup.Item>

                      </ListGroup>
                    </>
                  )}
                </Tab>

                <Tab eventKey="security" title="Đăng nhập & Bảo mật">
                  <h5 className="mb-4">Bảo mật tài khoản</h5>

                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      {isChangingPassword ? (
                        <Form>
                          <Form.Group className="mb-3">
                            <Form.Label>Mật khẩu hiện tại</Form.Label>
                            <Form.Control
                              type="password"
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              placeholder="Nhập mật khẩu hiện tại"
                              isInvalid={!!errors.currentPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.currentPassword}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Mật khẩu mới</Form.Label>
                            <Form.Control
                              type="password"
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              placeholder="Nhập mật khẩu mới"
                              isInvalid={!!errors.newPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.newPassword}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <Form.Group className="mb-3">
                            <Form.Label>Nhập lại mật khẩu mới</Form.Label>
                            <Form.Control
                              type="password"
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              placeholder="Nhập lại mật khẩu mới"
                              isInvalid={!!errors.confirmPassword}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.confirmPassword}
                            </Form.Control.Feedback>
                          </Form.Group>

                          <div className="d-flex gap-2">
                            <Button
                              variant="primary"
                              onClick={handlePasswordSubmit}
                            >
                              <FontAwesomeIcon
                                icon={faCheck}
                                className="me-2"
                              />
                              Lưu mật khẩu mới
                            </Button>
                            <Button
                              variant="outline-secondary"
                              onClick={() => {
                                setIsChangingPassword(false);
                                setErrors({
                                  currentPassword: "",
                                  newPassword: "",
                                  confirmPassword: "",
                                });
                                setPasswordData({
                                  currentPassword: "",
                                  newPassword: "",
                                  confirmPassword: "",
                                });
                                setError("");
                              }}
                            >
                              Hủy
                            </Button>
                          </div>
                        </Form>
                      ) : (
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6>Mật khẩu</h6>
                            <p className="mb-0">••••••••</p>
                          </div>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => setIsChangingPassword(true)}
                          >
                            Thay đổi
                          </Button>
                        </div>
                      )}
                    </ListGroup.Item>
                  </ListGroup>
                </Tab>

                <Tab eventKey="notifications" title="Thông báo">
                  <h5 className="mb-4">Thông báo của bạn</h5>
                  <div
                    style={{
                      maxHeight: "400px",
                      overflowY: "auto",
                      border: "1px solid #dee2e6",
                      borderRadius: "0.25rem",
                    }}
                  >
                    <ListGroup variant="flush">
                      {notifications.length === 0 && (
                        <ListGroup.Item>Không có thông báo nào.</ListGroup.Item>
                      )}
                      {notifications.map((noti) => (
                        <ListGroup.Item key={noti.id}>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <p className="mb-1">{noti.message}</p>
                              <small className="text-muted">
                                {new Date(noti.date).toLocaleString("vi-VN")}
                              </small>
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Account;
