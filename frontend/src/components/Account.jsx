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
                    <ListGroup.Item className="d-flex justify-content-between align-items-center">
                      <div>
                        <h6>Mật khẩu</h6>
                        <p className="mb-0">••••••••</p>
                      </div>
                      <Button variant="outline-primary" size="sm">
                        Thay đổi
                      </Button>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <h6>Xác thực 2 yếu tố</h6>
                      <p className="text-muted">Chưa bật</p>
                      <Button variant="outline-primary" size="sm">
                        Bật ngay
                      </Button>
                    </ListGroup.Item>

                    <ListGroup.Item>
                      <h6>Thiết bị đã đăng nhập</h6>
                      <p className="text-muted">iPhone 13 - 14:30 20/10/2023</p>
                      <Button variant="outline-danger" size="sm">
                        Đăng xuất tất cả
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Tab>

                <Tab eventKey="notifications" title="Thông báo">
                  <h5 className="mb-4">Cài đặt thông báo</h5>

                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="email-notification"
                        label="Nhận thông báo qua email"
                        defaultChecked
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="sms-notification"
                        label="Nhận thông báo qua SMS"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="app-notification"
                        label="Thông báo trong ứng dụng"
                        defaultChecked
                      />
                    </Form.Group>

                    <h6 className="mt-4 mb-3">Loại thông báo</h6>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        id="book-notification"
                        label="Sách mới"
                        defaultChecked
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        id="promo-notification"
                        label="Khuyến mãi"
                        defaultChecked
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        id="system-notification"
                        label="Thông báo hệ thống"
                      />
                    </Form.Group>

                    <Button variant="primary" className="mt-3">
                      Lưu cài đặt
                    </Button>
                  </Form>
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
