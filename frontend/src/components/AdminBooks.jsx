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
  Pagination, // Đã import
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
  const PAGE_SIZE = 6;

  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [authors, setAuthors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [currentBook, setCurrentBook] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: [],
    quantity: "",
    description: "",
    image: null,
    preview: "", // Đảm bảo trường này có trong formData
    publication_date: new Date().toISOString().split("T")[0], // Đã có
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  const fetchBooks = async (page, search = "") => {
    setLoading(true);
    setError(null); // Reset lỗi trước mỗi lần fetch
    try {
      let url = `${BASE_URL}/books/api?page=${page}`;

      if (search) {
        // Backend kỳ vọng 'query' cho nội dung tìm kiếm và 'type' cho loại tìm kiếm.
        // Ở đây, chúng ta mặc định tìm kiếm theo 'title'.
        // Nếu placeholder "Tìm kiếm sách theo tên hoặc tác giả..." ngụ ý tìm kiếm đa trường,
        // backend cần được cập nhật để hỗ trợ điều đó với một tham số 'query' duy nhất,
        // hoặc frontend cần có cách chọn 'type'.
        url += `&query=${encodeURIComponent(search)}&type=title`;
      }

      const response = await api.get(url);
      console.log("API response for books:", response.data);

      if (response.data && response.data.results) {
        setBooks(response.data.results);
        const totalItems = response.data.count || 0;
        const calculatedTotalPages = Math.ceil(totalItems / PAGE_SIZE);
        setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);

        // Xử lý trường hợp trang hiện tại vượt quá tổng số trang (ví dụ sau khi xóa/tìm kiếm)
        if (page > calculatedTotalPages && calculatedTotalPages > 0) {
          setCurrentPage(calculatedTotalPages); // Chuyển về trang cuối cùng hợp lệ
        } else if (
          page > 1 &&
          calculatedTotalPages === 0 &&
          response.data.results.length === 0
        ) {
          // Nếu đang yêu cầu trang > 1 nhưng không có kết quả nào (tổng item = 0)
          setCurrentPage(1); // Reset về trang 1
          // setTotalPages(1); // đã được xử lý ở trên
        } else if (page > calculatedTotalPages && calculatedTotalPages > 0) {
          setCurrentPage(calculatedTotalPages);
        }
        // Nếu calculatedTotalPages là 0 (không có item nào), totalPages sẽ được set là 1.
        // currentPage nên là 1 trong trường hợp này.
        // Logic hiện tại của bạn đã xử lý việc reset về trang 1 khi không có kết quả khá tốt.
      } else {
        // Xử lý trường hợp response không đúng định dạng mong đợi
        setBooks([]);
        setTotalPages(1);
        setError("Dữ liệu sách trả về không hợp lệ.");
      }
    } catch (err) {
      console.error("Error fetching books:", err);
      setError("Không thể tải danh sách sách. Vui lòng thử lại sau.");
      setBooks([]); // Reset books về mảng rỗng khi có lỗi
      setTotalPages(1); // Reset phân trang khi có lỗi
      setCurrentPage(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks(currentPage, searchTerm);
  }, [currentPage, searchTerm]); // Phụ thuộc chính xác

  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      try {
        const authorsResponse = await api.get(`${BASE_URL}/authors/api/`);
        setAuthors(authorsResponse.data);

        const categoriesResponse = await api.get(`${BASE_URL}/categories/api/`);
        setCategories(categoriesResponse.data);
      } catch (err) {
        console.error("Error fetching authors or categories:", err);
        // Cân nhắc việc không set lỗi chung ở đây nếu fetchBooks đã xử lý lỗi tải sách
        // setError("Failed to load options. Please try again later.");
      } finally {
        setLoadingOptions(false);
      }
    };
    fetchOptions();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCategoryChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setFormData({
      ...formData,
      category: selectedOptions,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });
    }
  };

  const handleAddBook = () => {
    setModalTitle("Thêm sách mới");
    setCurrentBook(null);
    setFormData({
      title: "",
      author: "",
      category: [],
      quantity: "",
      description: "",
      preview: "", // Reset preview
      image: null,
      publication_date: new Date().toISOString().split("T")[0],
    });
    setShowModal(true);
  };

  const handleEditBook = (book) => {
    setModalTitle("Chỉnh sửa sách");
    setCurrentBook(book);
    setFormData({
      title: book.title,
      author: book.author.id,
      category: book.category.map((cat) => cat.id.toString()), // Đảm bảo là mảng string IDs
      quantity: book.quantity,
      // available: book.available, // available không có trong form, bỏ qua nếu không cần
      description: book.description,
      preview: book.preview || "", // Lấy preview, nếu không có thì là chuỗi rỗng
      image: book.image, // Đây sẽ là URL nếu sách đã có ảnh
      publication_date:
        book.publication_date || new Date().toISOString().split("T")[0],
    });
    setShowModal(true);
  };

  const handleViewDetail = (bookId) => {
    navigate(`/admin/books/${bookId}`);
  };

  const confirmDeleteBook = (book) => {
    setBookToDelete(book);
    setShowDeleteConfirm(true);
  };

  const handleDeleteBook = async () => {
    if (bookToDelete) {
      try {
        const token = sessionStorage.getItem(ACCESS_TOKEN);
        const requestHeaders = {
          ...(token && { Authorization: `Bearer ${token}` }),
        };
        await api.delete(`${BASE_URL}/books/api/delete/${bookToDelete.id}`, {
          headers: requestHeaders,
        });

        setShowDeleteConfirm(false);
        setBookToDelete(null);

        // Sau khi xóa thành công:
        // Nếu sách bị xóa là cuốn cuối cùng trên trang hiện tại (và không phải trang 1),
        // thì lùi về trang trước đó.
        // Ngược lại, tải lại dữ liệu cho trang hiện tại.
        if (books.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1); // Sẽ trigger useEffect để fetchBooks
        } else {
          // Nếu là trang 1 hoặc còn sách trên trang hiện tại, fetch lại trang hiện tại
          // Hoặc nếu searchTerm thay đổi, fetchBooks cũng sẽ được gọi với currentPage=1
          fetchBooks(currentPage, searchTerm);
        }
        // Không cần reload toàn bộ danh sách nữa vì fetchBooks(currentPage) sẽ làm điều đó.
        // setShowModal(false); // Dòng này không cần thiết vì đây là modal xác nhận xóa
      } catch (error) {
        console.error("Error deleting book:", error);
        alert("Đã xảy ra lỗi khi xóa sách");
        setShowDeleteConfirm(false); // Đảm bảo modal đóng khi có lỗi
      }
    }
  };

  const handleSaveBook = async () => {
    // setLoading(true); // Cân nhắc thêm cờ loading cho nút Save
    try {
      const token = sessionStorage.getItem(ACCESS_TOKEN);
      const bookFormData = new FormData();

      bookFormData.append("title", formData.title);
      bookFormData.append("author", formData.author);

      if (formData.category && Array.isArray(formData.category)) {
        formData.category.forEach((catId) => {
          bookFormData.append("category", catId);
        });
      }

      bookFormData.append("quantity", formData.quantity);
      bookFormData.append("description", formData.description);
      bookFormData.append("preview", formData.preview); // Thêm preview

      const publicationDate = formData.publication_date
        ? new Date(formData.publication_date).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0];
      bookFormData.append("publication_date", publicationDate);

      if (formData.image && typeof formData.image !== "string") {
        bookFormData.append("image", formData.image);
      }

      const requestHeaders = {
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      if (currentBook && currentBook.id) {
        await api.put(
          `${BASE_URL}/books/api/edit/${currentBook.id}`,
          bookFormData,
          { headers: requestHeaders }
        );
      } else {
        await api.post(`${BASE_URL}/books/api/create`, bookFormData, {
          headers: requestHeaders,
        });
        // Khi thêm sách mới thành công, có thể muốn chuyển đến trang cuối cùng nếu API sắp xếp mới nhất lên đầu,
        // hoặc đơn giản là ở lại trang 1 hoặc trang hiện tại.
        // Để đơn giản, chúng ta sẽ fetch lại trang hiện tại.
        // Nếu bạn muốn đi đến trang 1 sau khi thêm: setCurrentPage(1); (useEffect sẽ fetch)
      }

      await fetchBooks(currentPage, searchTerm); // Tải lại danh sách sách cho trang hiện tại

      setShowModal(false);
      setCurrentBook(null);

      alert(
        currentBook && currentBook.id
          ? "Cập nhật sách thành công!"
          : "Thêm sách mới thành công!"
      );
    } catch (error) {
      console.error("Error saving book:", error);
      let errorMessage = "Đã xảy ra lỗi khi lưu sách. ";
      if (error.response && error.response.data) {
        const errors = error.response.data;
        if (typeof errors === "object" && errors !== null) {
          for (const key in errors) {
            if (Array.isArray(errors[key])) {
              errorMessage += `${key}: ${errors[key].join(", ")}. `;
            } else if (typeof errors[key] === "string") {
              errorMessage += `${key}: ${errors[key]}. `;
            }
          }
          if (errors.detail) errorMessage += `${errors.detail}. `;
          if (errors.message) errorMessage += `${errors.message}. `;
        } else if (typeof errors === "string") {
          errorMessage += errors;
        }
      } else {
        errorMessage += error.message;
      }
      alert(errorMessage.trim());
    } finally {
      // setLoading(false);
    }
  };

  // ***** BẮT ĐẦU LOGIC PHÂN TRANG *****
  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPaginationItems = () => {
    if (totalPages <= 1) {
      return null; // Không hiển thị phân trang nếu chỉ có 1 hoặc không có trang nào
    }

    let items = [];
    const maxPagesToShow = 5; // Số lượng trang hiển thị trực tiếp (ví dụ: 1 ... 3 4 5 ... 10)
    const halfMaxPages = Math.floor(maxPagesToShow / 2);

    let startPage = Math.max(1, currentPage - halfMaxPages);
    let endPage = Math.min(totalPages, currentPage + halfMaxPages);

    // Điều chỉnh để luôn hiển thị `maxPagesToShow` nếu có thể
    if (currentPage <= halfMaxPages) {
      endPage = Math.min(totalPages, maxPagesToShow);
    }
    if (currentPage + halfMaxPages >= totalPages) {
      startPage = Math.max(1, totalPages - maxPagesToShow + 1);
    }

    // Nút "First"
    items.push(
      <Pagination.First
        key="first"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      />
    );

    // Nút "Prev"
    items.push(
      <Pagination.Prev
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
    );

    // Dấu "..." ở đầu nếu cần
    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => handlePageChange(1)}>
          {1}
        </Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
      }
    }

    // Các nút số trang
    for (let number = startPage; number <= endPage; number++) {
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

    // Dấu "..." ở cuối nếu cần
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
      }
      items.push(
        <Pagination.Item
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }

    // Nút "Next"
    items.push(
      <Pagination.Next
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || totalPages === 0}
      />
    );

    // Nút "Last"
    items.push(
      <Pagination.Last
        key="last"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages || totalPages === 0}
      />
    );

    return <Pagination>{items}</Pagination>;
  };
  // ***** KẾT THÚC LOGIC PHÂN TRANG *****

  // Điều kiện loading ban đầu, chỉ hiển thị khi chưa có sách nào được tải
  if (loading && books.length === 0 && !error) {
    return (
      <Container className="my-5 text-center">
        <p>Loading books...</p>
      </Container>
    );
  }

  // Hiển thị lỗi nếu có
  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
        {/* Có thể thêm nút thử lại */}
        <Button
          onClick={() => {
            setError(null);
            fetchBooks(1, searchTerm);
          }}
        >
          Thử lại
        </Button>
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
              <InputGroup className="mb-4">
                <InputGroup.Text>
                  <FontAwesomeIcon icon={faSearch} />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Tìm kiếm sách theo tên sách"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
                  }}
                />
              </InputGroup>

              {/* Chỉ báo loading phụ khi đang tải dữ liệu (ví dụ khi chuyển trang) */}
              {loading && (
                <div className="text-center my-2">
                  <p>Đang cập nhật danh sách...</p>
                </div>
              )}

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
                            src={
                              `/image/${book.image}` || "/placeholder-book.jpg"
                            } // Placeholder nếu không có ảnh
                            alt={book.title}
                            width={50}
                            thumbnail // Hoặc className="rounded shadow-sm"
                          />
                        </td>
                        <td>{book.title}</td>
                        <td>{book.author?.name || "N/A"}</td>{" "}
                        {/* Xử lý nếu author null */}
                        <td>
                          {book.category?.map(
                            (
                              cat // Xử lý nếu category null
                            ) => (
                              <Badge
                                key={cat.id}
                                bg="info"
                                className="me-1 mb-1"
                              >
                                {cat.name}
                              </Badge>
                            )
                          ) || "N/A"}
                        </td>
                        <td>{book.quantity}</td>
                        <td>
                          <Button
                            variant="outline-info"
                            size="sm"
                            className="me-1 mb-1"
                            onClick={() => handleViewDetail(book.id)}
                            title="Xem chi tiết"
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </Button>
                          <Button
                            variant="outline-primary"
                            size="sm"
                            className="me-1 mb-1"
                            onClick={() => handleEditBook(book)}
                            title="Chỉnh sửa"
                          >
                            <FontAwesomeIcon icon={faEdit} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            className="mb-1"
                            onClick={() => confirmDeleteBook(book)}
                            title="Xóa"
                          >
                            <FontAwesomeIcon icon={faTrash} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        {!loading && "Không tìm thấy sách phù hợp."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>

              {/* Phần phân trang */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  {renderPaginationItems()}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal thêm/sửa sách */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{modalTitle}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingOptions ? (
            <div className="text-center py-4">
              <p>Đang tải dữ liệu tùy chọn...</p>
            </div>
          ) : (
            <Form>
              <Row className="mb-3">
                <Col md={4}>
                  <div className="text-center mb-3">
                    {formData.image ? (
                      <Image
                        src={
                          typeof formData.image === "string"
                            ? formData.image // URL cho ảnh cũ
                            : URL.createObjectURL(formData.image) // URL tạm thời cho ảnh mới
                        }
                        alt="Xem trước ảnh bìa"
                        fluid
                        className="rounded shadow-sm"
                        style={{ maxHeight: "200px", objectFit: "contain" }}
                      />
                    ) : (
                      <div
                        className="border rounded p-5 text-muted bg-light d-flex align-items-center justify-content-center"
                        style={{ height: "200px" }}
                      >
                        Chưa có ảnh
                      </div>
                    )}
                  </div>
                  <Form.Group>
                    <Form.Label>Ảnh bìa sách</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <Form.Text className="text-muted">
                      Nên chọn ảnh có tỷ lệ phù hợp (ví dụ: 3:4).
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
                    </Col>
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
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Thể loại</Form.Label>
                        <Form.Select
                          name="category"
                          multiple
                          onChange={handleCategoryChange}
                          required
                          disabled={loadingOptions}
                          value={formData.category} // formData.category là mảng các string IDs
                          style={{ height: "100px" }}
                        >
                          {/* <option value="" disabled>Chọn thể loại (có thể chọn nhiều)</option> */}
                          {categories.map((category) => (
                            <option
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Text className="text-muted">
                          Giữ Ctrl (Cmd trên Mac) để chọn nhiều.
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
                          min="0"
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Ngày xuất bản</Form.Label>
                        <Form.Control
                          type="date"
                          name="publication_date"
                          value={formData.publication_date}
                          onChange={handleInputChange}
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
                  <Form.Group className="mb-3">
                    <Form.Label>Preview (Nội dung xem trước)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      name="preview"
                      value={formData.preview}
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
          <Button
            variant="primary"
            onClick={handleSaveBook}
            disabled={loadingOptions}
          >
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
