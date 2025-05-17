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
  faBook,
  faPlus,
  faEdit,
  faTrash,
  faSearch,
  faExclamationTriangle,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
const BASE_URL = import.meta.env.VITE_API_URL;

const AdminBooks = () => {
  const navigate = useNavigate();
  // State quản lý danh sách sách
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State danh sách tác giả và thể loại
  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  // State cho modal thêm/sửa sách
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [currentBook, setCurrentBook] = useState(null); // State cho form
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: [],
    quantity: "",
    description: "",
    image: null,
  });

  // State tìm kiếm và phân trang
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // State xác nhận xóa
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await api.get(
          `${BASE_URL}/books/api?page=${currentPage}`
        );
        console.log("response = ", response);

        setBooks(response.data.results);
        setTotalPages(response.data.total_pages); // <-- Dòng này đúng
      } catch (err) {
        setError("Failed to load books. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks(); // <-- phải đặt bên ngoài hàm fetchBooks, nhưng trong useEffect
  }, [currentPage]);

  // Lấy danh sách tác giả và thể loại khi component được mount
  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        // Fetch authors
        const authorsResponse = await api.get(`${BASE_URL}/authors/api/`);
        setAuthors(authorsResponse.data);

        // Fetch categories
        const categoriesResponse = await api.get(`${BASE_URL}/categories/api/`);
        setCategories(categoriesResponse.data);
      } catch (err) {
        console.error("Error fetching authors or categories:", err);
        setError("Failed to load options. Please try again later.");
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);
  // Xử lý thay đổi form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Xử lý thay đổi khi chọn nhiều thể loại
  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setFormData({
      ...formData,
      category: selectedOptions,
    });
  };

  // Xử lý thay đổi ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });
    }
  }; // Mở modal thêm sách
  const handleAddBook = () => {
    setModalTitle("Thêm sách mới");
    setCurrentBook(null);
    setFormData({
      title: "",
      author: "",
      category: [],
      quantity: "",
      description: "",
      image: null,
      publication_date: new Date().toISOString().split("T")[0], // Thêm ngày xuất bản mặc định là hôm nay
    });
    setShowModal(true);
  }; // Mở modal sửa sách
  const handleEditBook = (book) => {
    setModalTitle("Chỉnh sửa sách");
    setCurrentBook(book);
    setFormData({
      title: book.title,
      author: book.author.id,
      category: book.category.map((cat) => cat.id),
      quantity: book.quantity,
      available: book.available,
      description: book.description,
      image: book.image,
      publication_date:
        book.publication_date || new Date().toISOString().split("T")[0],
    });
    setShowModal(true);
  };

  // Xem chi tiết sách
  const handleViewDetail = (bookId) => {
    navigate(`/admin/books/${bookId}`);
  };

  // Xác nhận xóa sách
  const confirmDeleteBook = (book) => {
    setBookToDelete(book);
    setShowDeleteConfirm(true);
  }; // Thực hiện xóa sách
  const handleDeleteBook = async () => {
    if (bookToDelete) {
      try {
        await api.delete(`${BASE_URL}/books/api/delete/${bookToDelete.id}`);

        // Cập nhật state để xóa sách khỏi UI
        setBooks(books.filter((book) => book.id !== bookToDelete.id));
        setShowDeleteConfirm(false);
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Đã xảy ra lỗi khi xóa sách");
      }
    }

    // Reload danh sách sách
    const response = await api.get(`${BASE_URL}/books/api?page=${currentPage}`);
    setBooks(response.data.results);

    setShowModal(false);
  };
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  const handleSaveBook = async () => {
    try {
      const token = sessionStorage.getItem(ACCESS_TOKEN);
      const csrfToken = getCookie("csrftoken");

      console.log("csrfToken = ", csrfToken);
      console.log("token = ", token);
      // 1. Tạo đối tượng FormData để gửi dữ liệu (bao gồm cả file)
      const bookFormData = new FormData();

      // 2. Append các trường dữ liệu vào FormData
      bookFormData.append("title", formData.title);
      bookFormData.append("author", formData.author); // Gửi ID của tác giả

      // Xử lý category (là một mảng các ID)
      if (formData.category && Array.isArray(formData.category)) {
        formData.category.forEach((catId) => {
          bookFormData.append("category", catId); // API sẽ nhận nhiều giá trị cho key 'category'
        });
      }

      bookFormData.append("quantity", formData.quantity);
      bookFormData.append("description", formData.description);

      // Đảm bảo ngày xuất bản luôn được gửi và ở định dạng YYYY-MM-DD
      const publicationDate = formData.publication_date
        ? new Date(formData.publication_date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      bookFormData.append("publication_date", publicationDate);

      // 3. Xử lý file ảnh: Chỉ append nếu có file mới được chọn
      //    (formData.image sẽ là File object nếu mới, hoặc string (URL) nếu là ảnh cũ)
      if (formData.image && typeof formData.image !== "string") {
        bookFormData.append("image", formData.image);
      }
      // Trường hợp edit: Nếu formData.image là string (URL ảnh cũ) và không thay đổi,
      // thì không cần append lại. API backend nên được thiết kế để giữ lại ảnh cũ nếu trường 'image' không được gửi.
      // Nếu API yêu cầu gửi null hoặc giá trị đặc biệt để xóa ảnh, bạn cần xử lý thêm ở đây.
      console.log("bookFormData = ", bookFormData.get("image"));

      let response;
      const requestHeaders = {
        // "Content-Type": "multipart/form-data",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...(csrfToken && { "X-CSRFToken": csrfToken }), // Thêm CSRF token vào header
      };
      // 4. Phân biệt giữa tạo mới (POST) và cập nhật (PUT)
      if (currentBook && currentBook.id) {
        // Cập nhật sách đã tồn tại
        response = await api.put(
          `${BASE_URL}/books/api/edit/${currentBook.id}/`,
          bookFormData,
          {
            headers: requestHeaders,
          }
        );
      } else {
        // Thêm sách mới
        response = await api.post(
          `${BASE_URL}/books/api/create/`,
          bookFormData,
          {
            headers: requestHeaders,
          }
        );
      }

      // 5. Sau khi lưu thành công, làm mới danh sách sách trên trang hiện tại
      const refreshResponse = await api.get(
        `${BASE_URL}/books/api?page=${currentPage}${
          searchTerm ? `&search=${searchTerm}` : ""
        }`
      );
      setBooks(refreshResponse.data.results);
      setTotalPages(refreshResponse.data.total_pages);

      // 6. Đóng modal và reset trạng thái
      setShowModal(false);
      setCurrentBook(null); // Reset currentBook sau khi lưu

      // Thông báo thành công (tùy chọn)
      alert(
        currentBook && currentBook.id
          ? "Cập nhật sách thành công!"
          : "Thêm sách mới thành công!"
      );
    } catch (error) {
      console.error("Error saving book:", error);

      // 7. Xử lý và hiển thị lỗi chi tiết từ server nếu có
      let errorMessage = "Đã xảy ra lỗi khi lưu sách. ";
      if (error.response && error.response.data) {
        const errors = error.response.data;
        // Lỗi có thể là một object với các key là tên trường và value là mảng các thông báo lỗi
        // Hoặc một chuỗi lỗi đơn giản trong 'detail' hoặc 'message'
        if (typeof errors === "object" && errors !== null) {
          for (const key in errors) {
            if (Array.isArray(errors[key])) {
              errorMessage += `${key}: ${errors[key].join(", ")}. `;
            } else if (typeof errors[key] === "string") {
              errorMessage += `${key}: ${errors[key]}. `;
            }
          }
          // Trường hợp lỗi chung không theo field
          if (errors.detail) errorMessage += `${errors.detail}. `;
          if (errors.message) errorMessage += `${errors.message}. `;
        } else if (typeof errors === "string") {
          errorMessage += errors;
        }
      } else {
        errorMessage += error.message; // Lỗi mạng hoặc lỗi không có response từ server
      }
      alert(errorMessage.trim());
    }
  };
  if (loading) {
    return (
      <Container className="my-5 text-center">
        <p>Loading books...</p>
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
                      icon={faBook}
                      className="text-primary me-2"
                    />
                    Quản lý sách
                  </h4>
                </Col>
                <Col md={6} className="text-end">
                  <Button variant="primary" onClick={handleAddBook}>
                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                    Thêm sách
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
                  placeholder="Tìm kiếm sách theo tên hoặc tác giả..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>{" "}
              {/* Bảng danh sách sách */}
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Ảnh bìa</th>
                    <th>Tên sách</th>
                    <th>Tác giả</th>
                    <th>Thể loại</th>
                    <th>Số lượng</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {books.length > 0 ? (
                    books.map((book) => (
                      <tr key={book.id}>
                        <td>{book.id}</td>
                        <td>
                          <Image
                            src={book.image || "/placeholder-book.jpg"}
                            alt={book.title}
                            width={50}
                            className="rounded shadow-sm"
                          />
                        </td>
                        <td>{book.title}</td>
                        <td>{book.author.name}</td>
                        <td>
                          {" "}
                          <Badge bg="info">
                            {book.category.map((cat) => cat.name).join(", ")}
                          </Badge>
                        </td>
                        <td>{book.quantity}</td>
                        <td>
                          <Button
                            variant="outline-info"
                            size="sm"
                            className="me-2"
                            onClick={() => handleViewDetail(book.id)}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Button>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-2"
                            onClick={() => handleEditBook(book)}
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => confirmDeleteBook(book)}
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        Không tìm thấy sách phù hợp
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
              {/* Phân trang */}
              {books.length > 0 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination>
                    <Pagination.First
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
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
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
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
      </Row>{" "}
      {/* Modal thêm/sửa sách */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingOptions ? (
            <div className="text-center py-4">
              <p>Đang tải dữ liệu...</p>
            </div>
          ) : (
            <Form>
              <Row className="mb-3">
                <Col md={4}>
                  {/* Hiển thị ảnh xem trước */}
                  <div className="text-center mb-3">
                    {formData.image ? (
                      <Image
                        src={
                          typeof formData.image === "string"
                            ? formData.image
                            : URL.createObjectURL(formData.image)
                        }
                        alt="Book cover preview"
                        fluid
                        className="rounded shadow-sm"
                        style={{ maxHeight: "200px" }}
                      />
                    ) : (
                      <div className="border rounded p-5 text-muted bg-light">
                        Chưa có ảnh
                      </div>
                    )}
                  </div>

                  {/* Trường chọn ảnh */}
                  <Form.Group>
                    <Form.Label>Ảnh bìa sách</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <Form.Text className="text-muted">
                      Chọn ảnh có tỷ lệ 3:4 để hiển thị tốt nhất
                    </Form.Text>
                  </Form.Group>
                </Col>

                <Col md={8}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Tên sách</Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          required
                        />
                      </Form.Group>
                    </Col>{" "}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Tác giả</Form.Label>
                        <Form.Select
                          name="author"
                          value={formData.author}
                          onChange={handleInputChange}
                          required
                          disabled={loadingOptions}
                        >
                          <option value="">Chọn tác giả</option>
                          {authors.map((author) => (
                            <option key={author.id} value={author.id}>
                              {author.name}
                            </option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    {" "}
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Thể loại</Form.Label>
                        <Form.Select
                          name="category"
                          multiple
                          onChange={handleCategoryChange}
                          required
                          disabled={loadingOptions}
                          value={formData.category}
                          style={{ height: "100px" }}
                        >
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Text className="text-muted">
                          Giữ Ctrl để chọn nhiều thể loại
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Số lượng</Form.Label>
                        <Form.Control
                          type="number"
                          name="quantity"
                          value={formData.quantity}
                          onChange={handleInputChange}
                          min="1"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Label>Mô tả</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleSaveBook}>
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
          <Modal.Title>Xác nhận xóa sách</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center">
            <FontAwesomeIcon
              icon={faExclamationTriangle}
              className="text-warning me-3"
              size="2x"
            />
            <p className="mb-0">
              Bạn có chắc chắn muốn xóa sách "{bookToDelete?.title}"? Hành động
              này không thể hoàn tác.
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
          <Button variant="danger" onClick={handleDeleteBook}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminBooks;
