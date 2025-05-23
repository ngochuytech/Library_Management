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
  Toast,
  ToastContainer,
} from "react-bootstrap";
import {
  faUser,
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faExclamationTriangle,
  faEye,
  faCheckCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
const BASE_URL = import.meta.env.VITE_API_URL;

const AdminAuthors = () => {
  const PAGE_SIZE = 6;

  const navigate = useNavigate();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [currentAuthor, setCurrentAuthor] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    jobs: "",
    avatar: null,
    biography: "",
  });

  // Upload avatar state
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadedAvatar, setUploadedAvatar] = useState(null);

  // Delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [authorToDelete, setAuthorToDelete] = useState(null);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAuthors, setFilteredAuthors] = useState([]);

  // Toast notification states
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success"); // 'success' or 'error'

  // Load authors data
  useEffect(() => {
    fetchAuthors();
  }, []);

  // Update filtered authors when authors or search term changes
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredAuthors(authors);
    } else {
      const filtered = authors.filter((author) =>
        author.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAuthors(filtered);
    }

    // Update pagination
    setTotalPages(Math.ceil(filteredAuthors.length / PAGE_SIZE));
  }, [authors, searchTerm]);

  // Fetch authors from API
  const fetchAuthors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`${BASE_URL}/authors/api/`);
      setAuthors(response.data);
      setFilteredAuthors(response.data);
      setTotalPages(Math.ceil(response.data.length / PAGE_SIZE));
      setLoading(false);
      console.log("Authors fetched successfully:", response.data);
    } catch (err) {
      setError("Không thể tải dữ liệu tác giả. Vui lòng thử lại sau.");
      setLoading(false);
      console.error("Error fetching authors:", err);
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle avatar upload
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedAvatar(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Open modal to add new author
  const handleAddAuthor = () => {
    setModalTitle("Thêm tác giả mới");
    setCurrentAuthor(null);
    setFormData({
      name: "",
      jobs: "",
      avatar: null,
      biography: "",
    });
    setAvatarPreview(null);
    setUploadedAvatar(null);
    setShowModal(true);
  };

  // Open modal to edit an existing author
  const handleEditAuthor = (author) => {
    setModalTitle("Chỉnh sửa thông tin tác giả");
    setCurrentAuthor(author);
    setFormData({
      name: author.name,
      jobs: author.jobs,
      biography: author.biography,
    });
    setAvatarPreview(author.avatar ? `${BASE_URL}${author.avatar}` : null);
    setUploadedAvatar(null);
    setShowModal(true);
  };

  // Open delete confirmation modal
  const handleDeleteClick = (author) => {
    setAuthorToDelete(author);
    setShowDeleteModal(true);
  };
  // Save author (create new or update existing)
  const handleSaveAuthor = async () => {
    const token = sessionStorage.getItem(ACCESS_TOKEN);
    // Validate form
    if (!formData.name.trim()) {
      setToastMessage("Vui lòng nhập tên tác giả");
      setToastType("error");
      setShowToast(true);
      return;
    }

    try {
      const authorData = new FormData();
      authorData.append("name", formData.name.trim());
      authorData.append("jobs", formData.jobs.trim());
      authorData.append("biography", formData.biography.trim());

      if (uploadedAvatar) {
        authorData.append("avatar", uploadedAvatar);
      }

      let response;
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: token ? `Bearer ${token}` : undefined,
      };

      if (currentAuthor) {
        // Update existing author
        response = await api.put(
          `${BASE_URL}/authors/api/update/${currentAuthor.id}`,
          authorData,
          { headers }
        );

        // Update the author in the state
        setAuthors(
          authors.map((author) =>
            author.id === currentAuthor.id ? response.data : author
          )
        );
      } else {
        // Create new author
        response = await api.post(
          `${BASE_URL}/authors/api/create/`,
          authorData,
          {
            headers,
          }
        );

        // Add the new author to the state
        setAuthors([...authors, response.data]);
      }
      setShowModal(false);
      // Show success message
      setToastMessage(
        currentAuthor
          ? "Cập nhật tác giả thành công!"
          : "Thêm tác giả mới thành công!"
      );
      setToastType("success");
      setShowToast(true);
    } catch (error) {
      console.error("Error saving author:", error);
      // Show error message
      setToastMessage("Có lỗi xảy ra. Vui lòng thử lại.");
      setToastType("error");
      setShowToast(true);
    }
  };

  // Delete an author
  const handleConfirmDelete = async () => {
    const token = sessionStorage.getItem(ACCESS_TOKEN);
    if (!authorToDelete) return;

    try {
      await api.delete(`${BASE_URL}/authors/api/${authorToDelete.id}`, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      // Remove the deleted author from the state
      setAuthors(authors.filter((author) => author.id !== authorToDelete.id));
      setShowDeleteModal(false);
      setAuthorToDelete(null);
      // Show success message
      setToastMessage("Xóa tác giả thành công!");
      setToastType("success");
      setShowToast(true);
    } catch (error) {
      console.error("Error deleting author:", error);
      // Show error message
      setToastMessage("Không thể xóa tác giả. Vui lòng thử lại.");
      setToastType("error");
      setShowToast(true);
      setShowDeleteModal(false);
    }
  };

  // Pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Get current page of authors
  const getCurrentPageAuthors = () => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    const endIndex = startIndex + PAGE_SIZE;
    return filteredAuthors.slice(startIndex, endIndex);
  };

  // Render pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    let items = [];
    for (let number = 1; number <= totalPages; number++) {
      items.push(
        <Pagination.Item
          key={number}
          active={number === currentPage}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </Pagination.Item>
      );
    }

    return (
      <Pagination className="mt-3 justify-content-center">
        <Pagination.Prev
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {items}
        <Pagination.Next
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    );
  };
  return (
    <Container fluid>
      {/* Toast notification */}
      <ToastContainer
        position="top-end"
        className="p-3"
        style={{ zIndex: 1070 }}
      >
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg={toastType === "success" ? "success" : "danger"}
          text="white"
        >
          <Toast.Header closeButton={true}>
            <FontAwesomeIcon
              icon={toastType === "success" ? faCheckCircle : faTimes}
              className="me-2"
            />
            <strong className="me-auto">
              {toastType === "success" ? "Thành công" : "Lỗi"}
            </strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h2 className="m-0">
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  Quản lý tác giả
                </h2>
                <Button variant="primary" onClick={handleAddAuthor}>
                  <FontAwesomeIcon icon={faPlus} className="me-2" />
                  Thêm tác giả mới
                </Button>
              </div>

              {/* Search box */}
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <Form.Control
                  placeholder="Tìm kiếm theo tên tác giả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>

              {/* Error message */}
              {error && <Alert variant="danger">{error}</Alert>}

              {/* Authors table */}
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  <Table responsive striped hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Ảnh đại diện</th>
                        <th>Tên tác giả</th>
                        <th>Nghề nghiệp</th>
                        <th>Tiểu sử</th>
                        <th>Hành động</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getCurrentPageAuthors().length > 0 ? (
                        getCurrentPageAuthors().map((author) => (
                          <tr key={author.id}>
                            <td>{author.id}</td>
                            <td>
                              <Image
                                src={`${BASE_URL}${author.avatar}`}
                                alt={author.name}
                                width={50}
                                height={50}
                                roundedCircle
                              />
                            </td>
                            <td>{author.name}</td>
                            <td>{author.jobs}</td>
                            <td>
                              {author.biography.length > 50
                                ? `${author.biography.substring(0, 50)}...`
                                : author.biography}
                            </td>{" "}
                            <td>
                              <Button
                                variant="info"
                                size="sm"
                                onClick={() => handleEditAuthor(author)}
                              >
                                <FontAwesomeIcon icon={faEdit} /> Sửa
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="6" className="text-center py-3">
                            {searchTerm
                              ? "Không tìm thấy tác giả phù hợp"
                              : "Chưa có tác giả nào"}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>

                  {/* Pagination */}
                  {renderPagination()}
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      {/* Add/Edit Author Modal */}{" "}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon
              icon={currentAuthor ? faEdit : faPlus}
              className="me-2"
            />
            {modalTitle}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {" "}
          <Form noValidate>
            <Form.Group className="mb-3">
              <Form.Label>
                Tên tác giả <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Nhập tên tác giả"
                required
                isInvalid={formData.name.trim() === ""}
              />
              <Form.Control.Feedback type="invalid">
                Vui lòng nhập tên tác giả
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nghề nghiệp</Form.Label>
              <Form.Control
                type="text"
                name="jobs"
                value={formData.jobs}
                onChange={handleInputChange}
                placeholder="Nhập nghề nghiệp (VD: Nhà văn, Nhà thơ)"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ảnh đại diện</Form.Label>
              <div className="d-flex align-items-center">
                {avatarPreview && (
                  <div className="me-3">
                    <Image
                      src={avatarPreview}
                      alt="Avatar Preview"
                      width={100}
                      height={100}
                      roundedCircle
                    />
                  </div>
                )}
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tiểu sử</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                name="biography"
                value={formData.biography}
                onChange={handleInputChange}
                placeholder="Nhập tiểu sử tác giả"
              />
            </Form.Group>
          </Form>
        </Modal.Body>{" "}
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            <FontAwesomeIcon icon={faTimes} className="me-2" />
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveAuthor}>
            <FontAwesomeIcon
              icon={currentAuthor ? faEdit : faPlus}
              className="me-2"
            />
            {currentAuthor ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Modal.Footer>
      </Modal>
      {/* Delete Confirmation Modal */}{" "}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <FontAwesomeIcon icon={faExclamationTriangle} className="me-2" />
            Xác nhận xóa
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {authorToDelete && (
            <>
              <p>
                Bạn có chắc chắn muốn xóa tác giả{" "}
                <strong>{authorToDelete.name}</strong>?
              </p>
              <Alert variant="warning">
                <FontAwesomeIcon
                  icon={faExclamationTriangle}
                  className="me-2"
                />
                Lưu ý: Hành động này không thể hoàn tác và có thể ảnh hưởng đến
                dữ liệu sách liên quan.
              </Alert>
            </>
          )}
        </Modal.Body>{" "}
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            <FontAwesomeIcon icon={faTrash} className="me-2" />
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminAuthors;
