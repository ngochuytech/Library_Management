import React, { useState } from "react";
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

const Account = () => {
  const [key, setKey] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: "Nguyễn Văn A",
    phone: "+01 377702837",
    email: "nguyenvana@example.com",
    bio: "Tôi là một người đam mê đọc sách và học hỏi kiến thức mới.",
    avatar: "/avatar.jpg",
  });

  const [formData, setFormData] = useState({ ...userData });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    setUserData(formData);
    setIsEditing(false);
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

    if (!passwordData.currentPassword) {
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

  const handlePasswordSubmit = () => {
    if (validatePasswordForm()) {
      console.log("Đang thay đổi mật khẩu:", passwordData);

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setIsChangingPassword(false);
    }
  };

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
              <p className="text-muted">Thành viên từ 01/01/2023</p>
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
                          value={formData.name}
                          onChange={handleInputChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FontAwesomeIcon icon={faPhone} className="me-2" />
                          Số điện thoại
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                          Email
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
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
                          value={formData.bio}
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
                          onClick={() => setIsEditing(false)}
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
                              onClick={() => setIsChangingPassword(false)}
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
