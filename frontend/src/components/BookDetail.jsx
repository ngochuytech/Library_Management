import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faSolidStar } from "@fortawesome/free-solid-svg-icons"; // Đổi tên để rõ ràng hơn nếu muốn
import { faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons"; // Đổi tên để rõ ràng hơn nếu muốn
import {
  Container,
  Row,
  Col,
  Button,
  Image,
  Badge,
  Card,
  Modal,
  ProgressBar,
  Alert,
  Tabs,
  Tab,
  ListGroup,
  Form,
} from "react-bootstrap";
import {
  faStar,
  faBookOpen,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarRegular } from "@fortawesome/free-regular-svg-icons";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../api";
import "../styles/BookDetail.css";

const DetailBook = ({ book: initialBook, onSearchByAuthor }) => {
  const [book, setBook] = useState(initialBook);
  const [showPreview, setShowPreview] = useState(false);
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [borrowDays, setBorrowDays] = useState(7);
  const [author, setAuthor] = useState(null);
  const [similarBooks, setSimilarBooks] = useState([]);
  const [loadingAuthor, setLoadingAuthor] = useState(true);
  const [errorAuthor, setErrorAuthor] = useState(null);
  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (initialBook) {
      // Đảm bảo initialBook có giá trị trước khi fetch
      setBook(initialBook); // Set book từ prop
      fetchAuthor(initialBook.author.id); // Truyền author ID
      fetchSimilarBook(initialBook.id); // Truyền book ID
    }
  }, [initialBook]); // Thêm initialBook vào dependency array

  const fetchAuthor = async (authorId) => {
    // Nhận authorId làm tham số
    if (!authorId) return; // Không fetch nếu không có authorId
    setAuthor(null);
    setLoadingAuthor(true);
    setErrorAuthor(null);
    try {
      const response = await fetch(`${BASE_URL}/authors/api/${authorId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setAuthor(data);
    } catch (error) {
      setErrorAuthor("Không thể tải tác giả. Vui lòng thử lại sau.");
    } finally {
      setLoadingAuthor(false);
    }
  };

  const fetchSimilarBook = async (currentBookId) => {
    // Nhận currentBookId
    if (!currentBookId) return;
    setSimilarBooks([]);
    try {
      const response = await fetch(
        `${BASE_URL}/books/api/random/${currentBookId}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setSimilarBooks(data);
    } catch (error) {
      console.log("Không thể tải sách tương tự:", error);
    }
  };

  const fetchBookDetails = async () => {
    if (!book || !book.id) return; // Kiểm tra book.id tồn tại
    try {
      const response = await fetch(`${BASE_URL}/books/api/${book.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setBook(data); // Cập nhật state book
    } catch (error) {
      console.error("Không thể tải thông tin sách:", error);
    }
  };

  const handleBorrowBook = async () => {
    try {
      const token = sessionStorage.getItem("access_token"); // LẤY TOKEN
      if (!token) {
        toast.error(
          "Bạn chưa đăng nhập hoặc phiên làm việc đã hết hạn. Vui lòng đăng nhập lại."
        );
        // Có thể chuyển hướng người dùng đến trang đăng nhập
        // navigate('/login');
        return;
      }
      const currentUserId = sessionStorage.getItem("idUser");
      if (!currentUserId) {
        toast.error("Không tìm thấy ID người dùng. Vui lòng đăng nhập lại.");
        return;
      }

      if (!book || !book.id) {
        toast.error("Không tìm thấy thông tin sách để mượn.");
        return;
      }
      const currentBookId = book.id;

      // Tạo ngày yêu cầu ở phía client
      const requireDate = new Date().toISOString(); // Định dạng ISO: YYYY-MM-DDTHH:mm:ss.sssZ

      const payload = {
        user_id: parseInt(currentUserId, 10),
        book_id: currentBookId,
        borrow_days: borrowDays,
        require_date: requireDate, // <<<<<<< THÊM require_date VÀO PAYLOAD
      };

      console.log("Đang gửi yêu cầu mượn sách với payload:", payload);

      const response = await api.post(`/borrows/api/create`, payload);

      if (response.status === 201 && response.data) {
        toast.success(
          "Yêu cầu mượn sách đã được gửi! Chúng tôi sẽ sớm liên hệ với bạn.",
          {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );

        await fetchBookDetails();

        try {
          await api.post("/notifications/api/create", {
            user_id: parseInt(currentUserId, 10),
            message: `Bạn đã yêu cầu mượn sách "${book.title}". Chúng tôi sẽ sớm liên hệ với bạn.`,
          });
        } catch (notificationError) {
          console.error(
            "Lỗi khi gửi thông báo:",
            notificationError.response?.data || notificationError.message
          );
        }
      } else {
        console.warn(
          "Trạng thái phản hồi không mong muốn:",
          response.status,
          "Dữ liệu:",
          response.data
        );
        toast.error(
          response.data?.message ||
            `Yêu cầu không thành công (mã lỗi: ${response.status}).`
        );
      }
    } catch (error) {
      console.error("Đối tượng lỗi khi mượn sách:", error);
      if (error.response) {
        console.error(
          "Dữ liệu lỗi phản hồi khi mượn sách:",
          error.response.data
        );
        let errorMessages = "Lỗi khi gửi yêu cầu mượn sách:\n";
        const responseData = error.response.data;
        if (typeof responseData === "object" && responseData !== null) {
          for (const key in responseData) {
            if (Array.isArray(responseData[key])) {
              errorMessages += `Trường ${key}: ${responseData[key].join(
                "; "
              )}\n`;
            } else if (typeof responseData[key] === "string") {
              errorMessages += `${responseData[key]}\n`;
            }
          }
          if (
            responseData.message &&
            typeof responseData.message === "string"
          ) {
            errorMessages = responseData.message + "\n" + errorMessages;
          } else if (
            responseData.detail &&
            typeof responseData.detail === "string"
          ) {
            errorMessages = responseData.detail + "\n" + errorMessages;
          }
        } else if (typeof responseData === "string") {
          errorMessages += responseData;
        } else {
          errorMessages += error.message || "Lỗi không xác định từ máy chủ.";
        }
        toast.error(errorMessages.trim(), { autoClose: 5000 });
      } else if (error.request) {
        console.error("Yêu cầu lỗi khi mượn sách:", error.request);
        toast.error(
          "Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng."
        );
      } else {
        console.error("Lỗi thiết lập yêu cầu mượn sách:", error.message);
        toast.error(`Lỗi thiết lập yêu cầu: ${error.message}`);
      }
    } finally {
      setShowBorrowModal(false);
    }
  };

  // ... (renderRatingStars và JSX)
  // Sửa lỗi nhỏ trong useEffect và cách gọi fetchAuthor, fetchSimilarBook
  useEffect(() => {
    if (initialBook && initialBook.id) {
      // Kiểm tra initialBook và initialBook.id
      setBook(initialBook);
      if (initialBook.author && initialBook.author.id) {
        fetchAuthor(initialBook.author.id);
      } else {
        setLoadingAuthor(false);
        setErrorAuthor("Thông tin tác giả không đầy đủ.");
      }
      fetchSimilarBook(initialBook.id);
    } else {
      // Xử lý trường hợp initialBook không hợp lệ nếu cần
      setLoadingAuthor(false); // Dừng loading nếu không có initialBook
    }
  }, [initialBook]); // Chỉ chạy khi initialBook thay đổi

  // Kiểm tra book trước khi render để tránh lỗi
  if (!book || !book.id) {
    // Có thể hiển thị một thông báo tải hoặc lỗi ở đây
    return (
      <Container className="mt-3 mb-5 book-detail-container">
        <Alert variant="warning">
          Đang tải thông tin sách hoặc sách không tồn tại...
        </Alert>
      </Container>
    );
  }
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    // Cho nửa sao, bạn có thể muốn dùng icon khác như faStarHalfAlt nếu có
    // Hoặc logic hiện tại của bạn sẽ hiển thị một sao rỗng (faStarRegular)
    const hasHalfStar = rating % 1 >= 0.5; // Logic này có thể cần điều chỉnh nếu muốn hiển thị sao rỗng chính xác

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={`full-${i}`}
          icon={faSolidStar}
          className="text-warning"
        />
      );
    }

    if (hasHalfStar && stars.length < 5) {
      // Chỉ thêm nửa sao nếu chưa đủ 5 sao
      // Nếu bạn có icon faStarHalfAlt:
      // import { faStarHalfAlt } from "@fortawesome/free-solid-svg-icons";
      // stars.push(<FontAwesomeIcon key="half" icon={faStarHalfAlt} className="text-warning" />);
      // Nếu không, bạn đang dùng faRegularStar (sao rỗng) cho phần này:
      stars.push(
        <FontAwesomeIcon
          key="half"
          icon={faRegularStar}
          className="text-warning"
        />
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <FontAwesomeIcon
          key={`empty-${i}`}
          icon={faRegularStar} // Đúng: dùng sao rỗng
          className="text-secondary"
        />
      );
    }
    return stars;
  };

  // ... (Phần JSX return của bạn, nơi gọi hàm renderRatingStars)
  // Ví dụ: {renderRatingStars(book.rating)}
  // và {renderRatingStars(obj.rating || 0)}

  if (!initialBook || !initialBook.id) {
    return (
      <Container className="mt-3 mb-5 book-detail-container">
        <Alert variant="warning">
          Đang tải thông tin sách hoặc sách không tồn tại...
        </Alert>
      </Container>
    );
  }
  return (
    // ... (JSX của bạn)
    <Container className="mt-3 mb-5 book-detail-container">
      <ToastContainer />
      <Modal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Preview: {book.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ whiteSpace: "pre-line" }}>{book.preview}</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreview(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showBorrowModal}
        onHide={() => setShowBorrowModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận mượn sách</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Bạn có muốn mượn sách <strong>{book.title}</strong> không?
          </p>
          <Form.Group className="mb-3">
            <Form.Label>Chọn số ngày mượn</Form.Label>
            <Form.Select
              value={borrowDays}
              onChange={(e) => setBorrowDays(Number(e.target.value))}
            >
              <option value={7}>7 ngày</option>
              <option value={14}>14 ngày</option>
              <option value={30}>30 ngày</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBorrowModal(false)}>
            Không
          </Button>
          <Button variant="primary" onClick={handleBorrowBook}>
            Có
          </Button>
        </Modal.Footer>
      </Modal>
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Body>
              <Row>
                <Col md={4} className="mb-4 mb-md-0">
                  <Image
                    src={
                      book.image && book.image.startsWith("http")
                        ? book.image
                        : `${BASE_URL}${book.image}`
                    } // Sửa đường dẫn ảnh
                    alt={book.title}
                    fluid
                    className="shadow-sm rounded book-detail-image"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/icon.png";
                    }} // Fallback image
                  />
                  <div className="d-flex justify-content-between mt-3">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => setShowPreview(true)}
                    >
                      <FontAwesomeIcon icon={faBookOpen} className="me-2" />
                      Xem trước
                    </Button>
                  </div>
                </Col>
                <Col md={8}>
                  {" "}
                  <div>
                    <h1 className="h3 mb-2">{book.title}</h1>
                    <h2 className="h5 text-muted mb-3">
                      bởi {book.author?.name || "N/A"} ({book.publication_date}){" "}
                      {/* Thêm optional chaining */}
                    </h2>
                  </div>
                  <div className="mb-3">
                    <span className="me-2">
                      {renderRatingStars(book.rating)}
                    </span>
                    <span className="text-muted">
                      {book.rating?.toFixed(1) || "N/A"}
                    </span>
                  </div>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {book.category?.map(
                      (
                        obj,
                        index // Thêm optional chaining
                      ) => (
                        <Badge
                          key={index}
                          bg="light"
                          text="dark"
                          className="fw-normal"
                        >
                          {obj.name}
                        </Badge>
                      )
                    )}
                  </div>
                  <Alert
                    variant={book.avaliable > 0 ? "success" : "danger"}
                    className="d-flex align-items-center"
                  >
                    <div className="me-3">
                      <Badge
                        bg={book.avaliable > 0 ? "success" : "danger"}
                        className="me-2"
                      >
                        {book.avaliable > 0 ? "Còn sách" : "Hết sách"}
                      </Badge>
                      <span className="text-muted small">
                        ({book.avaliable} trong kho)
                      </span>
                    </div>
                    <ProgressBar
                      now={
                        (book.quantity > 0
                          ? book.avaliable / book.quantity
                          : 0) * 100
                      } // Tránh chia cho 0
                      variant={book.avaliable > 0 ? "success" : "danger"}
                      className="flex-grow-1"
                      style={{ height: "8px" }}
                    />
                  </Alert>
                  <div className="d-flex gap-3 mb-4">
                    <Button
                      variant="primary"
                      size="lg"
                      className="flex-grow-1"
                      onClick={() => setShowBorrowModal(true)}
                      disabled={book.avaliable <= 0}
                    >
                      <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
                      Mượn ngay
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
          <Tabs defaultActiveKey="description" id="book-tabs" className="mb-4">
            <Tab eventKey="description" title="Mô tả">
              <Card>
                <Card.Body>
                  <p className="lead" style={{ whiteSpace: "pre-line" }}>
                    {book.description}
                  </p>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
        <Col lg={4}>
          <Card className="mb-4">
            <Card.Header as="h5">Về tác giả</Card.Header>
            <Card.Body>
              <div className="d-flex mb-3">
                <Image
                  src={
                    author?.avatar && author.avatar.startsWith("http")
                      ? author.avatar
                      : author?.avatar
                      ? `${BASE_URL}${author.avatar}`
                      : "/icon.png"
                  } // Sửa đường dẫn ảnh
                  roundedCircle
                  width={80}
                  height={80}
                  className="me-3 author-avatar"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/icon.png";
                  }}
                />
                {loadingAuthor ? (
                  <p>Đang tải...</p>
                ) : errorAuthor ? (
                  <Alert variant="danger" className="p-2 small">
                    {errorAuthor}
                  </Alert>
                ) : author ? (
                  <div>
                    <h5 className="mb-1">{author.name}</h5>
                    <p className="text-muted small">
                      {author.jobs || "Chưa có thông tin nghề nghiệp"}
                    </p>
                  </div>
                ) : (
                  <p>Không có thông tin tác giả.</p>
                )}
              </div>
              <p
                className="author-biography"
                style={{ whiteSpace: "pre-line" }}
              >
                {author?.biography ? author.biography : ""}
              </p>
              {author &&
                book.author && ( // Chỉ hiển thị nút khi có thông tin tác giả
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() =>
                      onSearchByAuthor(book.author.id, book.author.name)
                    }
                  >
                    Xem tất cả sách của {book.author.name}
                  </Button>
                )}
            </Card.Body>
          </Card>
          <Card>
            <Card.Header as="h5">Bạn cũng có thể thích</Card.Header>
            <Card.Body>
              {similarBooks.length > 0 ? (
                <ListGroup variant="flush">
                  {similarBooks.map((obj, index) => (
                    <ListGroup.Item
                      key={index}
                      className="border-0 p-2 similar-book-item"
                    >
                      <div className="d-flex">
                        <Image
                          src={
                            obj.image && obj.image.startsWith("http")
                              ? obj.image
                              : `${BASE_URL}${obj.image}`
                          }
                          width={60}
                          height={80}
                          style={{ objectFit: "cover" }}
                          className="me-3 shadow-sm rounded"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/icon.png";
                          }}
                        />
                        <div>
                          <h6 className="mb-1 small-title">{obj.title}</h6>
                          <p className="small text-muted mb-0">
                            bởi {obj.author?.name || "N/A"}
                          </p>
                          <div className="small text-warning">
                            {renderRatingStars(obj.rating || 0)}
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted">Không tìm thấy sách tương tự.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DetailBook;
