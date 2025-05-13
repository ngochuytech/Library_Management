import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import api from '../api'

const Account = () => {
  const navigate = useNavigate()
  const BASE_URL = import.meta.env.VITE_API_URL

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [key, setKey] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({});

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); 
  const [fieldErrors, setFieldErrors] = useState({});

  useEffect(() => {
    const access_token = sessionStorage.getItem("access_token");
    if(access_token){
      setIsAuthenticated(true);
      fetchUser();
    }
    else
      setIsAuthenticated(false);
  }, [])

  const [formData, setFormData] = useState({ ...userData });

  const fetchUser = async () => {
    try {
      const id = sessionStorage.getItem("idUser");
      const response = await api.get(`/users/api?id=${id}`);

      setUserData({
        name: response.data.name,
        phone: response.data.phone_number,
        email: response.data.email,
        avatar: response.data.avatar,
        created_at: response.data.created_at,
        bio: "Đọc sách là niềm đam mê của tôi !"        
      })

      setFormData({
        name: response.data.name,
        phone: response.data.phone_number,
        email: response.data.email,
        avatar: response.data.avatar,
        created_at: response.data.created_at,
        bio: response.data.bio || "Đọc sách là niềm đam mê của tôi !",
      });
    } catch (error) {
      console.error("Failed to fetch user detail:", error.response.data.error);
      toast.error("Không thể tải thông tin người dùng. Vui lòng thử lại.");
    }
   
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const cleanedValue = value.replace(/[^0-9]/g, '');
      setFormData({ ...formData, [name]: cleanedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setFieldErrors({ ...fieldErrors, [name]: "" })
  };

  const handleSave = async () => {
    try {
      const idUser = sessionStorage.getItem("idUser");
      const response = await api.put(`/users/api/${idUser}`,{
        name: formData.name,
        phone_number: formData.phone
      }, {withCredentials: true});
      
      const updatedData = await response.json();
      setUserData({
        ...userData,
        name: updatedData.name,
        phone: updatedData.phone_number
      });
      setIsEditing(false);
      setError("");
      setFieldErrors({});
      toast.success("Cập nhật thông tin thành công!");
      sessionStorage.setItem("username", updatedData.name)
    } catch (error) {
      console.error("Failed to update user:", error.response.data.error);
      if(error.response.data.error.phone_number)
        toast.error("Cập nhật thông tin thất bại. Số điện thoại này đã tồn tại" )
      else
        toast.error("Cập nhật thông tin thất bại. " + error.response.data.error)
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

    if (!passwordData.currentPassword || passwordData.currentPassword.trim()=='') {
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
    if(!validatePasswordForm())
      return;

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
        })

        if(!response.ok){
          const errorData = await response.json();
          setError(errorData.error || "Vui lòng thử lại.")
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
              <Image
                src={userData.avatar}
                roundedCircle
                width={150}
                height={150}
                className="mb-3 border"
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
                    3
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

                      <Form.Group className="mb-3">
                        <Form.Label>Tiểu sử</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="bio"
                          value={formData.bio || ""}
                          onChange={handleInputChange}
                        />
                      </Form.Group>

                      <div className="d-flex gap-2">
                        <Button variant="primary" onClick={handleSave}>
                          <FontAwesomeIcon icon={faCheck} className="me-2" />
                          Lưu thay đổi
                        </Button>
                        <Button
                          variant="outline-secondary"
                          onClick={() => {setIsEditing(false);
                            setFieldErrors({});
                            setError("");}}
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
                            </div>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => {
                                setFormData({ ...userData });
                                setIsEditing(true);
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

                        <ListGroup.Item>
                          <h6>Tiểu sử</h6>
                          <p>{userData.bio}</p>
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
                      <ListGroup.Item>
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <p className="mb-1">
                              <strong>📘 'Don't Make Me Think'</strong> sẽ đến
                              hạn trả vào ngày <strong>10/03/2025</strong>.
                            </p>
                            <small className="text-muted">2 giờ trước</small>
                          </div>
                          <Button
                            variant="link"
                            size="sm"
                            className="text-danger p-0"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </Button>
                        </div>
                      </ListGroup.Item>

                      <ListGroup.Item>
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <p className="mb-1">
                              <strong>
                                📕 'The Design of Everyday Things'
                              </strong>{" "}
                              đã quá hạn 2 ngày. Vui lòng trả sách để tránh
                              phạt.
                            </p>
                            <small className="text-muted">1 ngày trước</small>
                          </div>
                          <Button
                            variant="link"
                            size="sm"
                            className="text-danger p-0"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </Button>
                        </div>
                      </ListGroup.Item>

                      <ListGroup.Item>
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <p className="mb-1">
                              <strong>📙 'Clean Code'</strong> đã được trả thành
                              công.
                            </p>
                            <small className="text-muted">5 ngày trước</small>
                          </div>
                          <Button
                            variant="link"
                            size="sm"
                            className="text-danger p-0"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </Button>
                        </div>
                      </ListGroup.Item>

                      <ListGroup.Item>
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <p className="mb-1">
                              <strong>📘 'JavaScript: The Good Parts'</strong>{" "}
                              sẽ đến hạn trả vào ngày{" "}
                              <strong>18/03/2025</strong>.
                            </p>
                            <small className="text-muted">1 tuần trước</small>
                          </div>
                          <Button
                            variant="link"
                            size="sm"
                            className="text-danger p-0"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </Button>
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <p className="mb-1">
                              <strong>📘 'JavaScript: The Good Parts'</strong>{" "}
                              sẽ đến hạn trả vào ngày{" "}
                              <strong>18/03/2025</strong>.
                            </p>
                            <small className="text-muted">1 tuần trước</small>
                          </div>
                          <Button
                            variant="link"
                            size="sm"
                            className="text-danger p-0"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </Button>
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item>
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <p className="mb-1">
                              <strong>📘 'JavaScript: The Good Parts'</strong>{" "}
                              sẽ đến hạn trả vào ngày{" "}
                              <strong>18/03/2025</strong>.
                            </p>
                            <small className="text-muted">1 tuần trước</small>
                          </div>
                          <Button
                            variant="link"
                            size="sm"
                            className="text-danger p-0"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </Button>
                        </div>
                      </ListGroup.Item>
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